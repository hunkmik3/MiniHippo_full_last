import parseBody from './_utils/parseBody.js';
import { putGithubContent } from './_utils/supabase.js';
import { verifyAdminRequest, verifyUserRequest } from './_utils/auth.js';

const MAX_AUDIO_BYTES = 12 * 1024 * 1024; // 12MB

function normalizePath(value) {
  return String(value || '')
    .trim()
    .replace(/^\/+/, '')
    .replace(/\\/g, '/');
}

function isSpeakingSubmissionPath(path) {
  return (
    path.startsWith('audio/speaking_submissions/') ||
    path.startsWith('minihippofuill/aptiskey.com/audio/speaking_submissions/')
  );
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  let body;

  try {
    body = await parseBody(req);
  } catch (error) {
    console.error('Parse body error:', error);
    return res.status(400).json({ error: error.message || 'Invalid JSON payload' });
  }

  const { filePath, content, message } = body || {};

  if (!filePath || !content) {
    return res.status(400).json({ error: 'Thiếu filePath hoặc content' });
  }

  // Validate file path
  if (typeof filePath !== 'string' || filePath.length === 0) {
    return res.status(400).json({ error: 'filePath phải là chuỗi không rỗng' });
  }

  // Validate content (base64)
  if (typeof content !== 'string' || content.length === 0) {
    return res.status(400).json({ error: 'content phải là chuỗi base64 không rỗng' });
  }

  const normalizedInputPath = normalizePath(filePath);
  const speakingSubmissionUpload = isSpeakingSubmissionPath(normalizedInputPath);

  if (speakingSubmissionUpload) {
    const userCheck = await verifyUserRequest(req, { requireDevice: true });
    if (!userCheck.success) {
      return res
        .status(userCheck.status)
        .json({ error: userCheck.error || 'Unauthorized' });
    }
  } else {
    const adminCheck = await verifyAdminRequest(req);
    if (!adminCheck.success) {
      return res
        .status(adminCheck.status)
        .json({ error: adminCheck.error || 'Unauthorized' });
    }
  }

  const approxBytes = Math.floor((content.length * 3) / 4);
  if (approxBytes <= 0 || approxBytes > MAX_AUDIO_BYTES) {
    return res
      .status(400)
      .json({ error: `File audio vượt giới hạn cho phép (${MAX_AUDIO_BYTES / (1024 * 1024)}MB).` });
  }

  // Normalize file path - remove leading slashes and ensure proper format
  let normalizedPath = normalizedInputPath;
  
  // Ensure path starts with minihippofuill/aptiskey.com/ if not already
  if (!normalizedPath.startsWith('minihippofuill/aptiskey.com/')) {
    normalizedPath = `minihippofuill/aptiskey.com/${normalizedPath}`;
  }

  try {
    console.log('Uploading audio to:', normalizedPath);
    const result = await putGithubContent(normalizedPath, {
      content,
      message: message || `Upload audio ${normalizedPath}`,
      encoding: 'base64'
    });

    if (!result || !result.content) {
      throw new Error('GitHub API không trả về dữ liệu hợp lệ');
    }

    const githubContent = result.content;
    // GitHub API returns download_url for raw content
    const rawUrl = githubContent.download_url || githubContent.html_url?.replace('/blob/', '/raw/');

    if (!rawUrl) {
      throw new Error('Không thể lấy URL của file đã upload');
    }

    return res.status(200).json({
      success: true,
      rawUrl,
      fileUrl: githubContent.html_url,
      sha: githubContent.sha
    });
  } catch (error) {
    console.error('Upload audio error:', error);
    const errorMessage = error.details || error.message || 'Unknown error';
    return res.status(error.status || 500).json({
      error: 'Không thể upload audio',
      details: typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage)
    });
  }
}

