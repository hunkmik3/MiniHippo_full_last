const DEFAULT_OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';
const DEFAULT_ANTHROPIC_MODEL = process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-20250514';
const DEFAULT_GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

export function getConfiguredAIProvider() {
  const providers = [
    {
      provider: 'anthropic',
      apiKey: process.env.ANTHROPIC_API_KEY,
      model: DEFAULT_ANTHROPIC_MODEL
    },
    {
      provider: 'openai',
      apiKey: process.env.OPENAI_API_KEY,
      model: DEFAULT_OPENAI_MODEL
    },
    {
      provider: 'gemini',
      apiKey: process.env.GEMINI_API_KEY,
      model: DEFAULT_GEMINI_MODEL
    }
  ];

  const preferredProvider = String(process.env.AI_PROVIDER || '')
    .trim()
    .toLowerCase();

  if (preferredProvider) {
    const preferred = providers.find((item) => item.provider === preferredProvider && item.apiKey);
    if (preferred) {
      return preferred;
    }
  }

  return providers.find((item) => item.apiKey) || null;
}

export function hasConfiguredAIProvider() {
  return !!getConfiguredAIProvider();
}

export async function generateAIText({
  systemPrompt = '',
  userPrompt = '',
  maxTokens = 4096,
  temperature = 0.2,
  responseMimeType = '',
  responseJsonSchema = null
} = {}) {
  const config = getConfiguredAIProvider();
  if (!config) {
    throw new Error('Chưa cấu hình AI API key');
  }

  let text = '';
  if (config.provider === 'anthropic') {
    text = await callAnthropic({
      apiKey: config.apiKey,
      model: config.model,
      systemPrompt,
      userPrompt,
      maxTokens,
      temperature,
      responseMimeType
    });
  } else if (config.provider === 'openai') {
    text = await callOpenAI({
      apiKey: config.apiKey,
      model: config.model,
      systemPrompt,
      userPrompt,
      maxTokens,
      temperature,
      responseMimeType
    });
  } else {
    text = await callGemini({
      apiKey: config.apiKey,
      model: config.model,
      systemPrompt,
      userPrompt,
      maxTokens,
      temperature,
      responseMimeType,
      responseJsonSchema
    });
  }

  return {
    provider: config.provider,
    model: config.model,
    text
  };
}

export function extractJsonObject(text = '') {
  const rawText = String(text || '').trim();
  if (!rawText) {
    throw new Error('AI không trả về nội dung');
  }

  try {
    return JSON.parse(rawText);
  } catch {
    // Fall back to extracting the most likely JSON object.
  }

  const fencedMatch = rawText.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = (fencedMatch?.[1] || rawText).trim();
  const startIndex = candidate.indexOf('{');
  const endIndex = candidate.lastIndexOf('}');

  if (startIndex === -1 || endIndex === -1 || endIndex < startIndex) {
    throw new Error('AI không trả về JSON hợp lệ');
  }

  return JSON.parse(candidate.slice(startIndex, endIndex + 1));
}

async function callAnthropic({
  apiKey,
  model,
  systemPrompt,
  userPrompt,
  maxTokens,
  temperature
}) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model,
      max_tokens: maxTokens,
      temperature,
      system: systemPrompt || undefined,
      messages: [
        {
          role: 'user',
          content: userPrompt
        }
      ]
    })
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Anthropic API error (${response.status}): ${text}`);
  }

  const data = await response.json();
  return data.content?.[0]?.text || '';
}

async function callOpenAI({
  apiKey,
  model,
  systemPrompt,
  userPrompt,
  maxTokens,
  temperature,
  responseMimeType
}) {
  const messages = [];
  if (systemPrompt) {
    messages.push({ role: 'system', content: systemPrompt });
  }
  messages.push({ role: 'user', content: userPrompt });

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model,
      messages,
      max_tokens: maxTokens,
      temperature,
      ...(responseMimeType === 'application/json'
        ? {
            response_format: {
              type: 'json_object'
            }
          }
        : {})
    })
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`OpenAI API error (${response.status}): ${text}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || '';
}

async function callGemini({
  apiKey,
  model,
  systemPrompt,
  userPrompt,
  maxTokens,
  temperature,
  responseMimeType,
  responseJsonSchema
}) {
  const promptText = String(userPrompt || '').trim();
  const generationConfig = {
    temperature,
    maxOutputTokens: maxTokens
  };

  if (responseMimeType) {
    generationConfig.response_mime_type = responseMimeType;
  }
  if (responseJsonSchema) {
    generationConfig.response_schema = toGeminiSchema(responseJsonSchema);
  }

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': apiKey
    },
    body: JSON.stringify({
      ...(systemPrompt
        ? {
            systemInstruction: {
              parts: [
                {
                  text: String(systemPrompt)
                }
              ]
            }
          }
        : {}),
      contents: [
        {
          parts: [
            {
              text: promptText
            }
          ]
        }
      ],
      generationConfig
    })
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Gemini API error (${response.status}): ${text}`);
  }

  const data = await response.json();
  const text = (data.candidates || [])
    .flatMap((candidate) => candidate?.content?.parts || [])
    .map((part) => part?.text || '')
    .join('')
    .trim();

  if (!text) {
    const blockReason = data?.promptFeedback?.blockReason;
    if (blockReason) {
      throw new Error(`Gemini response blocked: ${blockReason}`);
    }
  }

  return text;
}

function toGeminiSchema(schema) {
  if (!schema || typeof schema !== 'object') {
    return undefined;
  }

  const mapped = {};

  if (schema.type) {
    mapped.type = String(schema.type).toUpperCase();
  }
  if (schema.description) {
    mapped.description = schema.description;
  }
  if (schema.nullable !== undefined) {
    mapped.nullable = !!schema.nullable;
  }
  if (Array.isArray(schema.required)) {
    mapped.required = [...schema.required];
  }
  if (schema.minimum !== undefined) {
    mapped.minimum = schema.minimum;
  }
  if (schema.maximum !== undefined) {
    mapped.maximum = schema.maximum;
  }
  if (schema.minItems !== undefined) {
    mapped.minItems = schema.minItems;
  }
  if (schema.maxItems !== undefined) {
    mapped.maxItems = schema.maxItems;
  }
  if (schema.items) {
    mapped.items = toGeminiSchema(schema.items);
  }
  if (schema.properties && typeof schema.properties === 'object') {
    mapped.properties = Object.fromEntries(
      Object.entries(schema.properties).map(([key, value]) => [key, toGeminiSchema(value)])
    );
  }

  return mapped;
}
