// pages/api/sync.js

export default async function handler(req, res) {
  // 只允许 POST 请求
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { password } = req.body;

  // 从 Vercel 环境变量中获取机密信息
  const syncPassword = process.env.SYNC_PASSWORD;
  const githubToken = process.env.GITHUB_PAT;
  const repoOwner = process.env.GITHUB_REPO_OWNER; // 例如 'nw-gale'
  const repoName = process.env.GITHUB_REPO_NAME; // 例如 'NotionNext'
  const workflowId = 'deploy-to-domestic.yml'; // 工作流文件名

  // 1. 验证密码
  if (!syncPassword || password !== syncPassword) {
    return res.status(401).json({ message: 'Invalid password.' });
  }

  // 2. 验证必要的 GitHub 机密信息是否已在 Vercel 中设置
  if (!githubToken || !repoOwner || !repoName) {
    console.error('Server configuration error. Missing GitHub credentials in Vercel environment variables.');
    return res.status(500).json({ message: 'Server configuration error. Please contact the administrator.' });
  }

  // 3. 触发 GitHub Actions 工作流
  try {
    const dispatchUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/actions/workflows/${workflowId}/dispatches`;

    const response = await fetch(dispatchUrl, {
      method: 'POST',
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'Authorization': `token ${githubToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ref: 'main', // 在 main 分支上运行工作流
      }),
    });

    // 204 No Content 是此 API 调用的成功状态
    if (response.status === 204) {
      return res.status(200).json({ message: 'Sync triggered successfully!' });
    } else {
      // 如果 GitHub API 返回错误
      const errorBody = await response.json();
      console.error('GitHub API Error:', errorBody);
      return res.status(response.status).json({ message: `Failed to trigger sync. GitHub API responded with status ${response.status}.`, details: errorBody.message });
    }
  } catch (error) {
    console.error('Error triggering workflow:', error);
    return res.status(500).json({ message: 'An internal server error occurred while communicating with GitHub.' });
  }
}