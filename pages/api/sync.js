// pages/api/sync.js

export default async function handler(req, res) {
  console.log('--- Sync API endpoint triggered ---');

  // 只允许 POST 请求
  if (req.method !== 'POST') {
    console.log(`Method Not Allowed: ${req.method}`);
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { password } = req.body;
  console.log('Received request with a password.');

  // 从 Vercel 环境变量中获取机密信息
  const syncPassword = process.env.SYNC_PASSWORD;
  const githubToken = process.env.GITHUB_PAT;
  const repoOwner = process.env.GITHUB_REPO_OWNER;
  const repoName = process.env.GITHUB_REPO_NAME;
  const workflowId = 'deploy-to-domestic.yml';

  // 打印环境变量以进行调试
  console.log(`SYNC_PASSWORD exists: ${!!syncPassword}`);
  console.log(`GITHUB_PAT exists: ${!!githubToken}`);
  console.log(`GITHUB_REPO_OWNER: ${repoOwner}`);
  console.log(`GITHUB_REPO_NAME: ${repoName}`);

  // 1. 验证密码
  if (!syncPassword || password !== syncPassword) {
    console.log('Password validation failed.');
    return res.status(401).json({ message: 'Invalid password.' });
  }
  console.log('Password validation successful.');

  // 2. 验证必要的 GitHub 机密信息
  if (!githubToken || !repoOwner || !repoName) {
    console.error('Server configuration error. Missing GitHub credentials.');
    return res.status(500).json({ message: 'Server configuration error. Please contact the administrator.' });
  }
  console.log('GitHub credentials check passed.');

  // 3. 触发 GitHub Actions 工作流
  try {
    const dispatchUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/actions/workflows/${workflowId}/dispatches`;
    console.log(`Attempting to dispatch workflow to: ${dispatchUrl}`);

    const response = await fetch(dispatchUrl, {
      method: 'POST',
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'Authorization': `token ${githubToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ref: 'main',
      }),
    });

    console.log(`GitHub API response status: ${response.status}`);

    if (response.status === 204) {
      console.log('Successfully triggered workflow.');
      return res.status(200).json({ message: 'Sync triggered successfully!' });
    } else {
      const errorBody = await response.text(); // 使用 .text() 以防错误响应不是JSON
      console.error('GitHub API Error:', errorBody);
      return res.status(response.status).json({ message: `Failed to trigger sync. GitHub API responded with status ${response.status}.`, details: errorBody });
    }
  } catch (error) {
    console.error('Error in try-catch block when triggering workflow:', error);
    return res.status(500).json({ message: 'An internal server error occurred while communicating with GitHub.' });
  }
}