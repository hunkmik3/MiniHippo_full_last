import { extractJsonObject, generateAIText, getConfiguredAIProvider } from './ai.js';

const AUTO_GRADE_MAX_ATTEMPTS = 3;
const WRITING_RESPONSE_JSON_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    overall_feedback: {
      type: 'string'
    },
    common_errors: {
      type: 'array',
      items: {
        type: 'string'
      }
    },
    items: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          part: {
            type: 'string'
          },
          key: {
            type: 'string'
          },
          corrected_answer: {
            type: 'string'
          },
          feedback: {
            type: 'string'
          }
        },
        required: ['part', 'key', 'corrected_answer', 'feedback']
      }
    }
  },
  required: ['overall_feedback', 'common_errors', 'items']
};

export async function autoGradeWritingSubmission({
  metadata = {},
  setTitle = ''
} = {}) {
  const userAnswers = metadata?.user_answers;
  const writingItems = flattenWritingItems(userAnswers);
  const gradableItems = writingItems.filter((item) => item.answer);

  if (!gradableItems.length) {
    return {
      status: 'skipped_empty',
      metadataPatch: {
        auto_grading_status: 'skipped_empty',
        auto_grading_message: 'Không có nội dung bài viết để chấm tự động.',
        ai_feedback_preview: 'Không có nội dung bài viết để chấm tự động.',
        ai_feedback: 'Không có nội dung bài viết để chấm tự động.'
      }
    };
  }

  const provider = getConfiguredAIProvider();
  if (!provider) {
    return {
      status: 'unavailable',
      metadataPatch: {
        auto_grading_status: 'unavailable',
        auto_grading_message: 'Chưa cấu hình AI API key nên chưa thể sửa lỗi Writing tự động.',
        ai_feedback_preview: 'Chưa cấu hình AI API key nên chưa thể sửa lỗi Writing tự động.',
        ai_feedback: 'Chưa cấu hình AI API key nên chưa thể sửa lỗi Writing tự động.'
      }
    };
  }

  const systemPrompt = [
    'You are a careful English writing corrector for Vietnamese learners.',
    'Your ONLY job is to fix grammar, spelling, punctuation, and capitalization errors.',
    'CRITICAL RULES:',
    '- Only change the MINIMUM number of words needed to fix each error.',
    '- Do NOT restructure or rewrite sentences.',
    '- Do NOT add new words or phrases that the student did not write.',
    '- Do NOT replace words with synonyms unless the original word is grammatically wrong.',
    '- Keep the exact same sentence structure and word order.',
    '- If a sentence has no errors, keep it exactly as-is.',
    '- Do NOT score or grade the writing.',
    'Return JSON only. No markdown. No code fences.'
  ].join(' ');

  const userPrompt = buildWritingPrompt({
    setTitle,
    totalWords: Number(metadata?.total_words || 0),
    writingItems: gradableItems
  });

  try {
    let lastError = null;

    for (let attempt = 1; attempt <= AUTO_GRADE_MAX_ATTEMPTS; attempt += 1) {
      try {
        const response = await generateAIText({
          systemPrompt,
          userPrompt:
            attempt === 1
              ? userPrompt
              : `${userPrompt}\n\nIMPORTANT: Return strictly valid JSON only. Escape all double quotes inside strings. Do not include any explanatory text.`,
          maxTokens: 5000,
          temperature: attempt === 1 ? 0.2 : 0,
          responseMimeType: 'application/json',
          responseJsonSchema: WRITING_RESPONSE_JSON_SCHEMA
        });
        const parsed = extractJsonObject(response.text);
        const normalized = normalizeAIWritingResponse(parsed, writingItems);

        return {
          status: 'completed',
          metadataPatch: {
            band: 'Pending',
            ai_feedback: normalized.overallFeedback,
            ai_feedback_preview: normalized.overallFeedback,
            auto_grading_status: 'completed',
            auto_grading_provider: response.provider,
            auto_grading_model: response.model,
            auto_grading_attempts: attempt,
            auto_graded_at: new Date().toISOString(),
            auto_writing_feedback: {
              overall_feedback: normalized.overallFeedback,
              common_errors: normalized.commonErrors,
              items: normalized.items
            }
          }
        };
      } catch (error) {
        lastError = error;
        console.warn(`auto grade writing attempt ${attempt}/${AUTO_GRADE_MAX_ATTEMPTS} failed:`, error?.message || error);
      }
    }

    throw lastError || new Error('Unknown auto grading error');
  } catch (error) {
    console.error('auto grade writing error:', error);
    return {
      status: 'failed',
      metadataPatch: {
        auto_grading_status: 'failed',
        auto_grading_attempts: AUTO_GRADE_MAX_ATTEMPTS,
        auto_grading_message: 'Hệ thống chưa thể sửa lỗi Writing tự động ở lần nộp này.',
        auto_grading_error: sanitizeText(error?.message || '', 280),
        ai_feedback_preview: 'Lần nộp này chưa sửa lỗi Writing tự động thành công.',
        ai_feedback: 'Lần nộp này chưa sửa lỗi Writing tự động thành công.'
      }
    };
  }
}

function flattenWritingItems(userAnswers = {}) {
  if (!userAnswers || typeof userAnswers !== 'object') {
    return [];
  }

  const items = [];
  Object.keys(userAnswers).forEach((partKey) => {
    const partItems = userAnswers[partKey];
    if (!Array.isArray(partItems)) return;

    partItems.forEach((item, index) => {
      const key = sanitizeKey(item?.key || `item_${index + 1}`) || `item_${index + 1}`;
      items.push({
        part: sanitizeKey(partKey) || 'part',
        key,
        prompt: sanitizeText(item?.prompt || ''),
        answer: sanitizeText(item?.answer || ''),
        wordCount: Number(item?.word_count || 0)
      });
    });
  });

  return items;
}

function buildWritingPrompt({ setTitle, totalWords, writingItems }) {
  const payload = {
    set_title: sanitizeText(setTitle || ''),
    total_words: Number(totalWords || 0),
    items: writingItems.map((item) => ({
      part: item.part,
      key: item.key,
      prompt: item.prompt,
      answer: item.answer,
      word_count: item.wordCount
    }))
  };

  return [
    'Fix ONLY grammar, spelling, punctuation, and capitalization errors in this English writing submission.',
    'Change the MINIMUM number of words possible. Do NOT rewrite or restructure any sentence.',
    'Do NOT add words the student did not write. Do NOT replace words with synonyms.',
    'If a sentence is grammatically correct, keep it EXACTLY as the student wrote it.',
    'Keep every feedback very short and practical.',
    'common_errors should have at most 3 items.',
    'Each item feedback must be 1 short sentence in Vietnamese explaining what was corrected.',
    'Return JSON exactly with this structure:',
    JSON.stringify({
      overall_feedback: 'Nhan xet tong the ngan bang tieng Viet ve loi ngu phap va tu vung.',
      common_errors: ['Loi 1', 'Loi 2'],
      items: [
        {
          part: 'part1',
          key: 'question1_1',
          corrected_answer: 'Corrected English answer.',
          feedback: 'Nhan xet ngan cho cau nay bang tieng Viet.'
        }
      ]
    }),
    'If an answer is empty, keep corrected_answer empty and feedback should say khong co cau tra loi.',
    'Submission JSON:',
    JSON.stringify(payload)
  ].join('\n');
}

function normalizeAIWritingResponse(parsed, writingItems) {
  const rawItems = Array.isArray(parsed?.items) ? parsed.items : [];
  const normalizedItems = writingItems.map((item) => {
    const rawItem = rawItems.find((candidate) => {
      const part = sanitizeKey(candidate?.part);
      const key = sanitizeKey(candidate?.key);
      return buildItemId(part, key) === buildItemId(item.part, item.key);
    }) || {};

    const hasAnswer = !!item.answer;
    const correctedAnswer = hasAnswer
      ? sanitizeText(rawItem.corrected_answer || item.answer)
      : '';
    const feedback = hasAnswer
      ? sanitizeText(rawItem.feedback || '')
      : 'Không có câu trả lời.';

    return {
      part: item.part,
      key: item.key,
      corrected_answer: hasAnswer ? (correctedAnswer || item.answer || '') : '',
      feedback
    };
  });

  const overallFeedback = sanitizeText(parsed?.overall_feedback || '') || 'AI đã sửa lỗi ngữ pháp và từ vựng cho bài viết.';
  const commonErrors = normalizeStringArray(parsed?.common_errors);

  return {
    overallFeedback,
    commonErrors,
    items: normalizedItems
  };
}

function normalizeStringArray(value) {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => sanitizeText(item || ''))
    .filter(Boolean)
    .slice(0, 3);
}

function buildItemId(part, key) {
  return `${sanitizeKey(part) || 'part'}:${sanitizeKey(key) || 'item'}`;
}

function sanitizeKey(value) {
  return String(value || '')
    .trim()
    .replace(/\s+/g, '_')
    .replace(/[^\w:-]/g, '');
}

function sanitizeText(value, maxLength = 5000) {
  const text = String(value || '')
    .replace(/\r\n/g, '\n')
    .replace(/\u0000/g, '')
    .trim();
  return text.length > maxLength ? text.slice(0, maxLength) : text;
}
