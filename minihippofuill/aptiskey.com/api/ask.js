import parseBody from './_utils/parseBody.js';
import { generateAIText, hasConfiguredAIProvider } from '../server/api/_utils/ai.js';

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

  const { question } = body || {};

  if (!question) {
    return res.status(400).json({ error: 'Thiếu nội dung câu hỏi' });
  }

  if (!hasConfiguredAIProvider()) {
    return res.status(500).json({
      error: 'Chưa cấu hình AI API key. Vui lòng thêm GEMINI_API_KEY, ANTHROPIC_API_KEY hoặc OPENAI_API_KEY vào environment variables.'
    });
  }

  try {
    const result = await generateAIText({
      userPrompt: question,
      maxTokens: 4096,
      temperature: 0.3
    });
    const answer = result?.text || 'Không có phản hồi từ AI';
    return res.status(200).json({ answer });
  } catch (error) {
    console.error('AI grading error:', error);
    return res.status(500).json({
      error: 'Lỗi khi chấm điểm AI: ' + (error.message || 'Unknown error')
    });
  }
}
