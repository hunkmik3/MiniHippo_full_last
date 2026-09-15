import parseBody from './_utils/parseBody.js';
import fs from 'fs';
import path from 'path';
import { verifyAdminRequest } from './_utils/auth.js';
import {
  insertInto,
  updateTable,
  putGithubContent
} from './_utils/supabase.js';

const GITHUB_SITE_PREFIX = 'minihippofuill/aptiskey.com/';

function getPartFromFilePath(filePath) {
  if (!filePath) return null;
  if (filePath.includes('reading_question1')) return 1;
  if (filePath.includes('reading_question2')) return 2;
  if (filePath.includes('reading_question4')) return 4;
  if (filePath.includes('reading_question5')) return 5;
  if (filePath.includes('listening_question1_13')) return 'listening_1_13';
  if (filePath.includes('listening_question14')) return 'listening_14';
  if (filePath.includes('listening_question15')) return 'listening_15';
  if (filePath.includes('listening_question16_17')) return 'listening_16_17';
  if (filePath.includes('writing/writingkey')) return 'writing';
  return null;
}

function normalizeLessonPaths(filePath) {
  const normalized = String(filePath || '')
    .trim()
    .replace(/^\/+/, '')
    .replace(/\\/g, '/');

  if (!normalized) {
    return {
      publicPath: '',
      githubPath: ''
    };
  }

  if (normalized.startsWith(GITHUB_SITE_PREFIX)) {
    return {
      publicPath: normalized.slice(GITHUB_SITE_PREFIX.length),
      githubPath: normalized
    };
  }

  return {
    publicPath: normalized,
    githubPath: `${GITHUB_SITE_PREFIX}${normalized}`
  };
}

function saveLocalCopy(publicPath, content) {
  const isLocalDev =
    process.env.NODE_ENV === 'development' ||
    !process.env.VERCEL ||
    process.env.VERCEL_ENV === 'development';

  if (!isLocalDev || !publicPath) return;

  const cwd = process.cwd();
  const candidates = [
    path.join(cwd, publicPath),
    path.join(cwd, GITHUB_SITE_PREFIX, publicPath)
  ];

  const localPath =
    candidates.find(candidate => fs.existsSync(path.dirname(candidate))) || candidates[0];
  const dir = path.dirname(localPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(localPath, content);
  console.log('Saved locally to:', localPath);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  let adminCheck;
  try {
    adminCheck = await verifyAdminRequest(req);
  } catch (error) {
    console.error('verifyAdminRequest crashed:', error);
    return res.status(500).json({
      error: 'Không thể xác thực admin',
      details: error?.message || 'Unknown auth error'
    });
  }

  if (!adminCheck.success) {
    return res
      .status(adminCheck.status || 401)
      .json({ error: adminCheck.error || 'Unauthorized' });
  }

  let body;

  try {
    body = req.body && typeof req.body === 'object' ? req.body : await parseBody(req);
  } catch (error) {
    return res.status(400).json({ error: error.message || 'Invalid JSON payload' });
  }

  const {
    filePath,
    content,
    message,
    append = false,
    lessonId,
    title,
    topic,
    part: providedPart,
    numSets
  } = body || {};

  if (!filePath || !content) {
    return res.status(400).json({ error: 'Thiếu filePath hoặc content' });
  }

  const { publicPath, githubPath } = normalizeLessonPaths(filePath);
  if (!publicPath || !githubPath) {
    return res.status(400).json({ error: 'filePath không hợp lệ' });
  }

  const derivedPart = providedPart || getPartFromFilePath(publicPath);

  try {
    const uploadResult = await putGithubContent(githubPath, {
      content,
      message: message || `Update ${githubPath}`,
      encoding: append ? 'base64' : 'utf8'
    });

    try {
      saveLocalCopy(publicPath, content);
    } catch (err) {
      console.error('Failed to save locally:', err);
    }

    const lessonPayload = {
      part: derivedPart,
      file_path: publicPath,
      title: title || null,
      topic: topic || null,
      num_sets: numSets || null,
      updated_at: new Date().toISOString()
    };

    if (lessonId) {
      await updateTable(
        'lessons',
        [{ column: 'id', value: lessonId }],
        lessonPayload
      );
    } else {
      await insertInto('lessons', {
        ...lessonPayload,
        created_at: new Date().toISOString()
      });
    }

    const githubContent = uploadResult?.content || {};
    const githubCommit = uploadResult?.commit || {};

    return res.status(200).json({
      success: true,
      fileUrl: githubContent.html_url,
      commitUrl: githubCommit.html_url,
      sha: githubContent.sha
    });
  } catch (error) {
    console.error('Upload lesson error:', error);
    return res.status(500).json({
      error: 'Không thể upload bài học',
      details: error.details || error.message || 'Unknown error'
    });
  }
}
