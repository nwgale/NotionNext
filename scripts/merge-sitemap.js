const fs = require('fs').promises;
const { parseStringPromise } = require('xml2js');
const { SitemapStream, streamToPromise } = require('sitemap');
const { Readable } = require('stream');
const axios = require('axios');
const path = require('path');

const EXTERNAL_PATHS_URL = 'https://tianfei.chat/app/sitemap-paths.txt';
const SITEMAP_PATH = './out/sitemap.xml';
const SITE_URL = process.env.NEXT_PUBLIC_CANONICAL_DOMAIN || 'https://tianfei.chat';
const LASTMOD_CACHE_PATH = path.resolve('.next', 'cache', 'lastmod-map.json');

/**
 * Generates an XML sitemap string from an array of URL objects.
 * @param {Array<object>} urls - Array of URL objects for the sitemap.
 * @returns {Promise<string>} - The generated XML sitemap as a string.
 */
async function generateSitemapXml(urls) {
  const stream = new SitemapStream({ hostname: SITE_URL });
  return streamToPromise(Readable.from(urls).pipe(stream)).then(data => data.toString());
}

async function mergeSitemaps() {
  try {
    console.log('[Sitemap-Pipeline] Starting...');

    // --- Worker A: The Archivist ---
    // His job is to load the "Book of Truth" (lastmod-map.json), which contains the 100% accurate timestamps.
    console.log('[Worker A - Archivist] Loading the "Book of Truth"...');
    let lastmodMap = {};
    try {
      lastmodMap = JSON.parse(await fs.readFile(LASTMOD_CACHE_PATH, 'utf-8'));
      console.log(`[Worker A - Archivist] Success! Book of Truth contains ${Object.keys(lastmodMap).length} records.`);
    } catch (e) {
      console.warn('[Worker A - Archivist] Warning: Could not find the Book of Truth. Timestamps may be inaccurate.');
    }

    // --- Worker B: The Inspector ---
    // He inspects the rough draft from the contractor (next-sitemap),
    // extracts only the page URLs, and discards the incorrect timestamps.
    console.log('[Worker B - Inspector] Inspecting the contractor\'s draft...');
    const intermediateXml = await fs.readFile(SITEMAP_PATH, 'utf-8');
    const intermediateJson = await parseStringPromise(intermediateXml);
    const urlListFromInspector = intermediateJson?.urlset?.url?.map(u => {
        const urlObject = new URL(u.loc[0]);
        return {
            url: urlObject.pathname,
            // Discarding incorrect lastmod, changefreq, and priority from the draft
            originalLastmod: u.lastmod?.[0],
            changefreq: u.changefreq?.[0],
            priority: u.priority?.[0],
        };
    }) || [];
    console.log(`[Worker B - Inspector] Inspection complete. Found ${urlListFromInspector.length} pages, timestamps discarded.`);

    // --- Worker C: The Corrector ---
    // He takes the URL list from the Inspector and the Book of Truth from the Archivist.
    // He corrects the timestamp for each URL and produces a "Corrected Draft".
    console.log('[Worker C - Corrector] Correcting timestamps...');
    const correctedDraft = urlListFromInspector.map(item => {
      const correctLastmod = lastmodMap[item.url];
      if (item.url.startsWith('/article/') && item.originalLastmod !== correctLastmod) {
          console.log(`[Worker C - Corrector] Correction: Path: ${item.url}, Incorrect: ${item.originalLastmod}, Correct: ${correctLastmod}`);
      }
      return {
        url: item.url,
        lastmod: correctLastmod, // Apply the correct timestamp
        changefreq: item.changefreq,
        priority: item.priority,
      };
    });
    console.log(`[Worker C - Corrector] All ${correctedDraft.length} internal pages have been timestamp-corrected.`);

    // --- Worker D: The Assembler ---
    // He takes the "Corrected Draft", fetches the list of external pages,
    // and assembles the final, complete sitemap.
    console.log('[Worker D - Assembler] Assembling the final sitemap...');
    
    // 1. Fetch external pages
    console.log(`[Worker D - Assembler] Fetching external page list...`);
    const response = await axios.get(EXTERNAL_PATHS_URL);
    const externalPathsText = response.data;
    const externalLines = externalPathsText.split('\n').filter(p => p.trim() !== '' && !p.startsWith('#'));
    const externalUrls = externalLines.map(line => {
      const [path, lastmod] = line.split('|');
      return { url: path, changefreq: 'daily', priority: 0.7, lastmod };
    });
    console.log(`[Worker D - Assembler] Found ${externalUrls.length} external pages.`);

    // 2. Assemble final list
    const combinedList = [...correctedDraft, ...externalUrls];
    console.log(`[Worker D - Assembler] Combined list has ${combinedList.length} URLs before cleaning.`);

    // 3. Clean and deduplicate the list
    const seenUrls = new Set();
    const finalUrlList = combinedList.filter(item => {
        // Basic validation: must be a relative path starting with '/'
        if (!item.url || !item.url.startsWith('/')) {
            console.warn(`[Worker D - Assembler] Filtering out malformed URL: ${item.url}`);
            return false;
        }
        if (seenUrls.has(item.url)) {
            console.log(`[Worker D - Assembler] Filtering out duplicate URL: ${item.url}`);
            return false;
        }
        seenUrls.add(item.url);
        return true;
    });
    console.log(`[Worker D - Assembler] Cleaning complete. Final unique URL count: ${finalUrlList.length}.`);

    // 4. Publish the final product
    const finalSitemapXml = await generateSitemapXml(finalUrlList);
    await fs.writeFile(SITEMAP_PATH, finalSitemapXml);
    console.log(`[Sitemap-Pipeline] Finished! The final sitemap has been published to ${SITEMAP_PATH}.`);

  } catch (error) {
    console.error('[Sitemap-Pipeline] FATAL ERROR:', error);
    process.exit(1);
  }
}

mergeSitemaps();