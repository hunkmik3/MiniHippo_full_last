import parseBody from './_utils/parseBody.js';
import {
  insertInto,
  updateTable,
  selectFrom,
  putGithubContent
} from './_utils/supabase.js';

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
  return null;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  let body;

  try {
    body = await parseBody(req);
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

  const derivedPart = providedPart || getPartFromFilePath(filePath);

  try {
    const uploadResult = await putGithubContent(filePath, {
      content,
      message: message || `Update ${filePath}`,
      encoding: append ? 'base64' : 'utf8'
    });

    const lessonPayload = {
      part: derivedPart,
      file_path: filePath,
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


