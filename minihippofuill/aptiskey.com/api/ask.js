import parseBody from './_utils/parseBody.js';

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

  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;

  if (!anthropicKey && !openaiKey) {
    return res.status(500).json({
      error: 'Chưa cấu hình AI API key. Vui lòng thêm ANTHROPIC_API_KEY hoặc OPENAI_API_KEY vào environment variables.'
    });
  }

  try {
    let answer;
    if (anthropicKey) {
      answer = await callAnthropic(anthropicKey, question);
    } else {
      answer = await callOpenAI(openaiKey, question);
    }
    return res.status(200).json({ answer });
  } catch (error) {
    console.error('AI grading error:', error);
    return res.status(500).json({
      error: 'Lỗi khi chấm điểm AI: ' + (error.message || 'Unknown error')
    });
  }
}

async function callAnthropic(apiKey, question) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      messages: [{ role: 'user', content: question }]
    })
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Anthropic API error (${response.status}): ${text}`);
  }

  const data = await response.json();
  return data.content?.[0]?.text || 'Không có phản hồi từ AI';
}

async function callOpenAI(apiKey, question) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: question }],
      max_tokens: 4096
    })
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`OpenAI API error (${response.status}): ${text}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || 'Không có phản hồi từ AI';
}
