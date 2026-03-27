import { extractJsonObject, generateAIText, getConfiguredAIProvider } from './ai.js';
import { checkGrammar, applyCorrections, buildFeedbackFromMatches, matchToVietnamese } from './languageTool.js';

const AUTO_GRADE_MAX_ATTEMPTS = 3;
const STYLE_PHRASES_TO_KEEP = [
  'in my opinion',
  'i think',
  'i believe',
  'i feel',
  'i guess',
  'i suppose',
  'i am sure'
];
const FUNCTION_WORDS = new Set([
  'a', 'an', 'the',
  'and', 'or', 'but', 'so', 'yet', 'nor',
  'to', 'of', 'in', 'on', 'at', 'for', 'from', 'with', 'by', 'about', 'into', 'over', 'after',
  'before', 'under', 'between', 'through', 'during', 'without', 'within', 'against', 'among',
  'is', 'am', 'are', 'was', 'were', 'be', 'been', 'being',
  'do', 'does', 'did',
  'have', 'has', 'had',
  'can', 'could', 'will', 'would', 'shall', 'should', 'may', 'might', 'must',
  'not', 'no',
  'this', 'that', 'these', 'those',
  'i', 'you', 'he', 'she', 'it', 'we', 'they',
  'me', 'him', 'her', 'us', 'them',
  'my', 'your', 'his', 'its', 'our', 'their',
  'mine', 'yours', 'hers', 'ours', 'theirs',
  'myself', 'yourself', 'himself', 'herself', 'itself', 'ourselves', 'themselves',
  'who', 'whom', 'whose', 'which', 'what',
  'there', 'here',
  'as', 'than', 'if', 'because', 'while', 'although', 'though', 'when', 'where', 'why', 'how',
  'very', 'more', 'most', 'less', 'least'
]);
const COMMON_BASE_VERBS = new Set([
  'ask', 'attend', 'be', 'build', 'buy', 'call', 'chat', 'choose', 'collect', 'contribute', 'cook',
  'create', 'discuss', 'do', 'drink', 'eat', 'enjoy', 'feel', 'find', 'forget', 'gather', 'get',
  'give', 'go', 'have', 'help', 'hold', 'imagine', 'improve', 'invite', 'join', 'keep', 'know',
  'learn', 'like', 'listen', 'make', 'mean', 'meet', 'need', 'offer', 'organize', 'plan', 'play',
  'prefer', 'prepare', 'provide', 'read', 'reduce', 'relax', 'reply', 'say', 'see', 'send', 'share',
  'show', 'sound', 'speak', 'spend', 'stay', 'study', 'support', 'survey', 'take', 'talk', 'teach',
  'tell', 'think', 'trust', 'use', 'visit', 'walk', 'watch', 'work', 'write', 'save', 'become'
]);
const COMMON_ADVERBS = new Set([
  'always', 'also', 'almost', 'just', 'never', 'often', 'really', 'sometimes', 'still', 'usually'
]);
const NON_SUBJECT_STARTERS = new Set([
  'actually', 'additionally', 'after', 'although', 'before', 'because', 'finally', 'first', 'for',
  'from', 'here', 'honestly', 'however', 'if', 'in', 'last', 'meanwhile', 'moreover', 'next', 'on',
  'second', 'suddenly', 'then', 'there', 'therefore', 'this', 'today', 'tomorrow', 'when', 'while', 'yesterday'
]);
const SINGULAR_DETERMINERS = new Set([
  'a', 'an', 'another', 'each', 'every', 'one',
  'my', 'your', 'his', 'her', 'its', 'our', 'their',
  'this', 'that', 'the'
]);
const SINGULAR_DETERMINER_PATTERN = '(?:another|every|their|your|this|that|each|our|one|the|his|her|its|my|an|a)';
const SINGULAR_NOUN_EXCEPTIONS = new Set([
  'children', 'police', 'people', 'cattle',
  'men', 'women', 'teeth', 'feet', 'mice', 'geese',
  'scissors', 'trousers', 'glasses'
]);
const PLURAL_SUBJECT_EXCEPTIONS = new Set(['news', 'mathematics', 'physics', 'economics', 'series', 'species']);
const PRONOUN_AUX_EXPECTATIONS = {
  i: { am: 'am', is: 'am', are: 'am', was: 'was', were: 'was', have: 'have', has: 'have', do: 'do', does: 'do' },
  you: { am: 'are', is: 'are', are: 'are', was: 'were', were: 'were', have: 'have', has: 'have', do: 'do', does: 'do' },
  we: { am: 'are', is: 'are', are: 'are', was: 'were', were: 'were', have: 'have', has: 'have', do: 'do', does: 'do' },
  they: { am: 'are', is: 'are', are: 'are', was: 'were', were: 'were', have: 'have', has: 'have', do: 'do', does: 'do' },
  he: { am: 'is', is: 'is', are: 'is', was: 'was', were: 'was', have: 'has', has: 'has', do: 'does', does: 'does' },
  she: { am: 'is', is: 'is', are: 'is', was: 'was', were: 'was', have: 'has', has: 'has', do: 'does', does: 'does' },
  it: { am: 'is', is: 'is', are: 'is', was: 'was', were: 'was', have: 'has', has: 'has', do: 'does', does: 'does' }
};
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

  const correctionProvider = (process.env.WRITING_CORRECTION_PROVIDER || '').toLowerCase();
  const provider = getConfiguredAIProvider();
  const forceLanguageToolOnly = correctionProvider === 'languagetool-only';
  const allowLanguageToolFallback = String(process.env.WRITING_ALLOW_LANGUAGETOOL_FALLBACK || 'true').toLowerCase() !== 'false';

  if (forceLanguageToolOnly) {
    return autoGradeWithLanguageTool({ writingItems, gradableItems });
  }

  if (!provider) {
    return autoGradeWithLanguageTool({ writingItems, gradableItems });
  }

  const systemPrompt = [
    'You are a strict English grammar corrector for Vietnamese learners.',
    'Your ONLY task is to make the smallest possible edits to fix clear grammar errors and a very small number of obvious wrong-word or incorrect collocation errors.',
    'You must follow ALL rules below.',
    'CRITICAL CONSTRAINTS:',
    '- Make MINIMAL edits only. Change as few words as possible.',
    '- Keep the original wording, vocabulary, tone, and sentence structure.',
    '- Do NOT rewrite, paraphrase, or improve style.',
    '- Do NOT make sentences more natural if they are already grammatically acceptable.',
    '- Do NOT add or reorder information.',
    'ALLOWED CHANGES:',
    '- Grammar only: verb forms, subject-verb agreement, articles, prepositions, pronouns, singular/plural, basic clause errors.',
    '- A very small missing function word is allowed when it clearly fixes grammar, for example adding "my" or "the".',
    '- Obvious wrong word: only if clearly incorrect and fixable with ONE simple replacement.',
    '- Collocations: only if clearly incorrect, unnatural, or not used by native speakers, and the correct form is very common and obvious.',
    'COLLOCATION RULES:',
    '- Only fix collocations when the original phrase is clearly unnatural or incorrect, even if grammatically possible.',
    '- Replace only 1–2 words maximum.',
    '- Prefer changing only ONE word, or adding a very small word if absolutely necessary.',
    '- Do NOT restructure the sentence.',
    '- Do NOT change if multiple correct options exist.',
    '- Prefer the simplest, most common, and closest equivalent collocation.',
    'STRICT PROHIBITIONS:',
    '- Do NOT fix spelling, punctuation, or capitalization unless required for grammar or the word is clearly incorrect.',
    '- Do NOT improve vocabulary or style.',
    '- Do NOT rewrite awkward but grammatically acceptable sentences.',
    '- Do NOT replace phrases just to sound more natural.',
    '- Do NOT explain anything.',
    '- Do NOT add comments, labels, or notes.',
    '- Never change proper nouns such as personal names, club names, place names, greeting names, or signature names.',
    '- Do NOT remove phrases like "I think" or "In my opinion" if they are grammatically acceptable.',
    'DECISION RULE:',
    '- If unsure whether something is wrong, do NOT change it.',
    '- If a sentence is acceptable, keep it exactly the same.',
    '- Each correction should affect as few words as possible and usually no more than 1–3 tokens.',
    '- Do NOT score or grade the writing.',
    'OUTPUT FORMAT:',
    '- Return JSON only. No markdown. No code fences.',
    '- For each corrected_answer, return only the corrected text.',
    '- Keep original line breaks and paragraph breaks.',
    '- Do not include explanations inside corrected_answer.'
  ].join(' ');

  const userPrompt = buildWritingPrompt({
    setTitle,
    totalWords: Number(metadata?.total_words || 0),
    writingItems: gradableItems
  });

  try {
    let lastError = null;
    let attemptCount = 0;

    for (let attempt = 1; attempt <= AUTO_GRADE_MAX_ATTEMPTS; attempt += 1) {
      attemptCount = attempt;
      try {
        const response = await generateAIText({
          systemPrompt,
          userPrompt:
            attempt === 1
              ? userPrompt
              : `${userPrompt}\n\nIMPORTANT: Return strictly valid JSON only. Escape all double quotes inside strings. Do not include any explanatory text.`,
          maxTokens: 5000,
          temperature: 0,
          responseMimeType: 'application/json',
          responseJsonSchema: WRITING_RESPONSE_JSON_SCHEMA
        });
        const parsed = await extractWritingJsonWithRepair(response.text);
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
        if (shouldAbortAutoGradingRetry(error)) {
          break;
        }
      }
    }

    throw lastError || new Error('Unknown auto grading error');
  } catch (error) {
    console.error('auto grade writing error:', error);
    const failureInfo = getAutoGradingFailureInfo(error, provider?.provider || 'ai');
    if (!allowLanguageToolFallback) {
      return {
        status: 'failed',
        metadataPatch: {
          auto_grading_status: 'failed',
          auto_grading_attempts: Number(failureInfo.attempts) || AUTO_GRADE_MAX_ATTEMPTS,
          auto_grading_message: failureInfo.message,
          auto_grading_error: sanitizeText(error?.message || '', 280),
          auto_grading_provider: provider?.provider || null,
          auto_grading_model: provider?.model || null,
          auto_grading_error_type: failureInfo.type,
          ai_feedback_preview: failureInfo.preview,
          ai_feedback: failureInfo.preview
        }
      };
    }
    try {
      return await autoGradeWithLanguageTool({
        writingItems,
        gradableItems,
        metadataPatch: {
          auto_grading_provider: 'languagetool-fallback',
          auto_grading_model: 'LanguageTool API',
          auto_grading_attempts: Number(failureInfo.attempts) || AUTO_GRADE_MAX_ATTEMPTS,
          auto_grading_fallback_from: provider.provider,
          auto_grading_fallback_error: sanitizeText(error?.message || '', 280),
          auto_grading_message: failureInfo.fallbackMessage
        }
      });
    } catch (fallbackError) {
      console.error('auto grade writing fallback error:', fallbackError);
      return {
        status: 'failed',
        metadataPatch: {
          auto_grading_status: 'failed',
          auto_grading_attempts: AUTO_GRADE_MAX_ATTEMPTS,
          auto_grading_message: 'Hệ thống chưa thể sửa lỗi Writing tự động ở lần nộp này.',
          auto_grading_error: sanitizeText(error?.message || fallbackError?.message || '', 280),
          auto_grading_fallback_error: sanitizeText(fallbackError?.message || '', 280),
          ai_feedback_preview: 'Lần nộp này chưa sửa lỗi Writing tự động thành công.',
          ai_feedback: 'Lần nộp này chưa sửa lỗi Writing tự động thành công.'
        }
      };
    }
  }
}

async function extractWritingJsonWithRepair(rawText) {
  try {
    return extractJsonObject(rawText);
  } catch (parseError) {
    const repaired = await generateAIText({
      systemPrompt: [
        'You repair malformed JSON.',
        'Return one strict valid JSON object only.',
        'Do not add explanations, markdown, comments, or code fences.',
        'Keep the same meaning and values as the original content.',
        'The JSON must follow the requested schema exactly.'
      ].join(' '),
      userPrompt: [
        'Repair this malformed JSON so it becomes valid JSON.',
        'Schema:',
        JSON.stringify(WRITING_RESPONSE_JSON_SCHEMA),
        'Malformed JSON:',
        String(rawText || '')
      ].join('\n\n'),
      maxTokens: 5000,
      temperature: 0,
      responseMimeType: 'application/json',
      responseJsonSchema: WRITING_RESPONSE_JSON_SCHEMA
    });

    try {
      return extractJsonObject(repaired.text);
    } catch (repairError) {
      throw new Error(
        `AI JSON parse failed: ${sanitizeText(parseError?.message || '', 120)} | Repair failed: ${sanitizeText(repairError?.message || '', 120)}`
      );
    }
  }
}

function shouldAbortAutoGradingRetry(error) {
  const message = String(error?.message || '').toLowerCase();
  return (
    message.includes('api error (400)')
    || message.includes('api error (401)')
    || message.includes('api error (403)')
    || message.includes('api error (429)')
    || message.includes('resource_exhausted')
    || message.includes('quota exceeded')
    || message.includes('response blocked')
    || message.includes('chưa cấu hình ai api key')
  );
}

function getAutoGradingFailureInfo(error, providerName = 'ai') {
  const providerLabel = formatProviderLabel(providerName);
  const message = String(error?.message || '');
  const lowerMessage = message.toLowerCase();

  if (
    lowerMessage.includes('api error (429)')
    || lowerMessage.includes('resource_exhausted')
    || lowerMessage.includes('quota exceeded')
    || lowerMessage.includes('generate_content_free_tier_requests')
  ) {
    return {
      type: 'quota_exceeded',
      message: `${providerLabel} đang vượt quota nên lần sửa tự động này chưa thể hoàn tất.`,
      preview: `Lần nộp này ${providerLabel} đang vượt quota nên chưa thể sửa lỗi tự động.`,
      fallbackMessage: `${providerLabel} đang vượt quota, hệ thống đã chuyển sang chế độ dự phòng.`,
      attempts: 1
    };
  }

  if (lowerMessage.includes('response blocked')) {
    return {
      type: 'blocked',
      message: `${providerLabel} đã chặn phản hồi ở lần sửa tự động này.`,
      preview: `Lần nộp này ${providerLabel} đã chặn phản hồi nên chưa sửa lỗi tự động.`,
      fallbackMessage: `${providerLabel} chặn phản hồi nên hệ thống đã chuyển sang chế độ dự phòng.`,
      attempts: 1
    };
  }

  if (lowerMessage.includes('ai json parse failed')) {
    return {
      type: 'invalid_json',
      message: `${providerLabel} trả dữ liệu chưa đúng định dạng nên lần sửa tự động này chưa hoàn tất.`,
      preview: `Lần nộp này ${providerLabel} chưa trả dữ liệu hợp lệ để sửa lỗi tự động.`,
      fallbackMessage: `${providerLabel} trả dữ liệu lỗi, hệ thống đã dùng chế độ dự phòng.`,
      attempts: AUTO_GRADE_MAX_ATTEMPTS
    };
  }

  return {
    type: 'unknown',
    message: `${providerLabel} chưa thể sửa lỗi tự động ở lần nộp này.`,
    preview: `Lần nộp này ${providerLabel} chưa sửa lỗi tự động thành công.`,
    fallbackMessage: `${providerLabel} gặp lỗi nên hệ thống đã chuyển sang chế độ dự phòng.`,
    attempts: AUTO_GRADE_MAX_ATTEMPTS
  };
}

function formatProviderLabel(providerName = 'ai') {
  const normalized = String(providerName || '').trim().toLowerCase();
  if (normalized === 'gemini') return 'Gemini';
  if (normalized === 'openai') return 'OpenAI';
  if (normalized === 'anthropic') return 'Anthropic';
  return normalized ? normalized.toUpperCase() : 'AI';
}

async function autoGradeWithLanguageTool({ writingItems, gradableItems, metadataPatch = {} }) {
  try {
    const allMatches = [];
    const correctedItems = [];

    for (const item of writingItems) {
      if (!item.answer) {
        correctedItems.push({
          part: item.part,
          key: item.key,
          corrected_answer: '',
          feedback: 'Không có câu trả lời.'
        });
        continue;
      }

      const rawMatches = [
        ...filterGrammarOnlyMatches(await checkGrammar(item.answer)),
        ...getMinimalCustomRuleMatches(item.answer)
      ];
      const safeMatchSelection = selectSafeLanguageToolMatches(item.answer, rawMatches);
      const matches = safeMatchSelection.matches;
      allMatches.push(...matches);
      const corrected = restoreOriginalLineBreaks(item.answer, safeMatchSelection.correctedText);
      const correctionDecision = enforceMinimalGrammarCorrection(item.answer, corrected);
      const feedbackParts = [];

      if (matches.length > 0) {
        feedbackParts.push(...matches.slice(0, 3).map(m => matchToVietnamese(m)).filter(Boolean));
      }

      const itemFeedback = correctionDecision.rejected
        ? 'Giữ nguyên câu gốc để tránh sửa quá nhiều câu chữ hoặc đụng vào tên riêng.'
        : (
          feedbackParts.length > 0
            ? feedbackParts.slice(0, 3).join(' ')
            : 'Không có lỗi ngữ pháp, từ sai hoặc collocation sai rõ ràng.'
        );

      correctedItems.push({
        part: item.part,
        key: item.key,
        corrected_answer: correctionDecision.correctedAnswer,
        feedback: itemFeedback
      });
    }

    const { commonErrors } = buildFeedbackFromMatches(allMatches);
    const overallFeedback = allMatches.length > 0
      ? 'Bài viết có một số lỗi về ngữ pháp, chính tả hoặc collocation cần chỉnh nhẹ.'
      : 'Không phát hiện lỗi ngữ pháp, từ sai hoặc collocation sai rõ ràng.';

    return {
      status: 'completed',
      metadataPatch: {
        band: 'Pending',
        ai_feedback: overallFeedback,
        ai_feedback_preview: overallFeedback,
        auto_grading_status: 'completed',
        auto_grading_provider: metadataPatch.auto_grading_provider || 'languagetool',
        auto_grading_model: metadataPatch.auto_grading_model || 'LanguageTool API',
        auto_grading_attempts: Number(metadataPatch.auto_grading_attempts) || 1,
        auto_graded_at: new Date().toISOString(),
        ...metadataPatch,
        auto_writing_feedback: {
          overall_feedback: overallFeedback,
          common_errors: commonErrors,
          items: correctedItems
        }
      }
    };
  } catch (error) {
    console.error('LanguageTool grading error:', error);
    return {
      status: 'failed',
      metadataPatch: {
        auto_grading_status: 'failed',
        auto_grading_attempts: 1,
        auto_grading_message: 'LanguageTool chưa thể sửa lỗi tự động ở lần nộp này.',
        auto_grading_error: sanitizeText(error?.message || '', 280),
        ai_feedback_preview: 'Lần nộp này chưa sửa lỗi tự động thành công.',
        ai_feedback: 'Lần nộp này chưa sửa lỗi tự động thành công.'
      }
    };
  }
}

function selectSafeLanguageToolMatches(originalText, matches = []) {
  const sourceText = String(originalText || '');
  if (!sourceText || !Array.isArray(matches) || !matches.length) {
    return {
      matches: [],
      correctedText: sourceText
    };
  }

  const safeMatches = [];
  let currentText = sourceText;
  let offsetShift = 0;
  const appliedOriginalRanges = [];

  const sortedMatches = [...matches]
    .filter((match) => match?.replacements?.length > 0 && Number.isFinite(match?.offset) && Number.isFinite(match?.length))
    .sort((left, right) => left.offset - right.offset);

  for (const match of sortedMatches) {
    const originalStart = Number(match.offset);
    const originalEnd = originalStart + Number(match.length);

    if (appliedOriginalRanges.some((range) => originalStart < range.end && originalEnd > range.start)) {
      continue;
    }

    const replacement = String(match.replacements[0].value || '');
    const currentStart = originalStart + offsetShift;
    const currentEnd = currentStart + Number(match.length);

    if (currentStart < 0 || currentEnd > currentText.length || currentStart > currentEnd) {
      continue;
    }

    const candidateText = `${currentText.slice(0, currentStart)}${replacement}${currentText.slice(currentEnd)}`;
    const decision = enforceMinimalGrammarCorrectionStrict(currentText, candidateText);
    if (decision.rejected) {
      continue;
    }

    currentText = decision.correctedAnswer;
    offsetShift += replacement.length - Number(match.length);
    safeMatches.push(match);
    appliedOriginalRanges.push({ start: originalStart, end: originalEnd });
  }

  return {
    matches: safeMatches,
    correctedText: currentText
  };
}

function isLikelyCommonVerbBase(word = '') {
  const lower = String(word || '').toLowerCase();
  return COMMON_BASE_VERBS.has(lower);
}

function toBaseVerbForm(word = '') {
  const lower = String(word || '').toLowerCase();
  if (!lower) return '';

  const irregular = {
    is: 'be',
    are: 'be',
    am: 'be',
    was: 'be',
    were: 'be',
    has: 'have',
    does: 'do'
  };
  if (irregular[lower]) return irregular[lower];

  if (lower.endsWith('ies') && lower.length > 3) {
    return `${lower.slice(0, -3)}y`;
  }

  if (/(ches|shes|sses|xes|zes|oes)$/.test(lower)) {
    return lower.slice(0, -2);
  }

  if (lower.endsWith('es') && lower.length > 2) {
    return lower.slice(0, -1);
  }

  if (lower.endsWith('s') && !lower.endsWith('ss') && lower.length > 1) {
    return lower.slice(0, -1);
  }

  return lower;
}

function toThirdPersonSingularVerb(word = '') {
  const lower = String(word || '').toLowerCase();
  if (!lower) return '';

  const irregular = {
    be: 'is',
    have: 'has',
    do: 'does'
  };
  if (irregular[lower]) return irregular[lower];

  if (/[bcdfghjklmnpqrstvwxyz]y$/.test(lower)) {
    return `${lower.slice(0, -1)}ies`;
  }

  if (/(s|sh|ch|x|z|o)$/.test(lower)) {
    return `${lower}es`;
  }

  return `${lower}s`;
}

function isSingularNounHead(word = '') {
  const lower = String(word || '').toLowerCase();
  if (!lower) return false;
  if (
    FUNCTION_WORDS.has(lower)
    || COMMON_ADVERBS.has(lower)
    || NON_SUBJECT_STARTERS.has(lower)
    || PRONOUN_AUX_EXPECTATIONS[lower]
  ) return false;
  if (SINGULAR_NOUN_EXCEPTIONS.has(lower)) return false;
  if (lower.endsWith('s')) return false;
  return /^[a-z-]+$/i.test(lower);
}

function isSafeSingularSubjectPhrase(phrase = '', { allowDeterminer = false } = {}) {
  const tokens = String(phrase || '').trim().split(/\s+/).filter(Boolean);
  if (!tokens.length) return false;

  const head = tokens[tokens.length - 1]?.toLowerCase() || '';
  if (!isSingularNounHead(head)) return false;

  for (let index = 0; index < tokens.length - 1; index += 1) {
    const token = tokens[index].toLowerCase();
    if (!token) return false;
    if (allowDeterminer && SINGULAR_DETERMINERS.has(token)) continue;
    if (
      FUNCTION_WORDS.has(token)
      || COMMON_ADVERBS.has(token)
      || NON_SUBJECT_STARTERS.has(token)
      || PRONOUN_AUX_EXPECTATIONS[token]
      || token.endsWith('ly')
    ) {
      return false;
    }
  }

  return true;
}

function pushGenericAgreementMatches(sourceText, pushReplacementMatch) {
  let match;
  const singularAuxMap = { are: 'is', were: 'was', have: 'has', do: 'does' };

  const pronounAuxRule = /\b(i|you|we|they|he|she|it)\s+((?:always|also|almost|just|never|often|really|sometimes|still|usually)\s+)?(am|is|are|was|were|has|have|does|do)\b/gi;
  while ((match = pronounAuxRule.exec(sourceText)) !== null) {
    const pronoun = String(match[1] || '').toLowerCase();
    const observed = String(match[3] || '').toLowerCase();
    const expected = PRONOUN_AUX_EXPECTATIONS[pronoun]?.[observed];
    if (!expected || expected === observed) continue;
    const offset = match.index + match[0].lastIndexOf(match[3]);
    pushReplacementMatch({
      offset,
      length: match[3].length,
      value: expected,
      message: 'Use the correct auxiliary verb for this subject.',
      ruleId: 'CUSTOM_PRONOUN_AUX_AGREEMENT',
      description: 'Pronoun and auxiliary verb agreement.'
    });
  }

  const pronounLexicalRule = /\b(i|you|we|they|he|she|it)\s+((?:always|also|almost|just|never|often|really|sometimes|still|usually)\s+)?([A-Za-z]+)\b/gi;
  while ((match = pronounLexicalRule.exec(sourceText)) !== null) {
    const pronoun = String(match[1] || '').toLowerCase();
    const observed = String(match[3] || '').toLowerCase();
    if (!observed || FUNCTION_WORDS.has(observed)) continue;

    if (['i', 'you', 'we', 'they'].includes(pronoun)) {
      const base = toBaseVerbForm(observed);
      if (!base || base === observed || !isLikelyCommonVerbBase(base)) continue;
      const offset = match.index + match[0].lastIndexOf(match[3]);
      pushReplacementMatch({
        offset,
        length: match[3].length,
        value: base,
        message: 'Use the base verb after this subject.',
        ruleId: 'CUSTOM_PRONOUN_BASE_VERB_AGREEMENT',
        description: 'Pronoun with an unnecessary third-person singular verb.'
      });
      continue;
    }

    const singularVerb = toThirdPersonSingularVerb(observed);
    if (!singularVerb || singularVerb === observed || !isLikelyCommonVerbBase(observed)) continue;
    const offset = match.index + match[0].lastIndexOf(match[3]);
    pushReplacementMatch({
      offset,
      length: match[3].length,
      value: singularVerb,
      message: 'Use the singular verb after this subject.',
      ruleId: 'CUSTOM_PRONOUN_SINGULAR_VERB_AGREEMENT',
      description: 'Third-person singular pronoun with a bare verb.'
    });
  }

  const singularDeterminerAuxRule = new RegExp(
    `\\b(${SINGULAR_DETERMINER_PATTERN}\\s+(?!(?:${SINGULAR_DETERMINER_PATTERN})\\b)[A-Za-z]+(?:\\s+[A-Za-z]+){0,2}?)\\s+((?:always|also|almost|just|never|often|really|sometimes|still|usually)\\s+)?(are|were|have|do)\\b`,
    'gi'
  );
  while ((match = singularDeterminerAuxRule.exec(sourceText)) !== null) {
    const phrase = String(match[1] || '').trim();
    const observed = String(match[3] || '').toLowerCase();
    const replacement = singularAuxMap[observed];
    if (!replacement) continue;
    if (!isSafeSingularSubjectPhrase(phrase, { allowDeterminer: true })) continue;
    const offset = match.index + match[0].lastIndexOf(match[3]);
    pushReplacementMatch({
      offset,
      length: match[3].length,
      value: replacement,
      message: 'Use a singular verb after a singular noun phrase.',
      ruleId: 'CUSTOM_SINGULAR_NOUN_PHRASE_AUX',
      description: 'Subject-verb agreement for a singular noun phrase with an incorrect auxiliary verb.'
    });
  }

  const singularDeterminerLexicalRule = new RegExp(
    `\\b(${SINGULAR_DETERMINER_PATTERN}\\s+(?!(?:${SINGULAR_DETERMINER_PATTERN})\\b)[A-Za-z]+(?:\\s+[A-Za-z]+){0,2}?)\\s+((?:always|also|almost|just|never|often|really|sometimes|still|usually)\\s+)?([A-Za-z]+)\\b`,
    'gi'
  );
  while ((match = singularDeterminerLexicalRule.exec(sourceText)) !== null) {
    const phrase = String(match[1] || '').trim();
    const observed = String(match[3] || '').toLowerCase();
    if (!isSafeSingularSubjectPhrase(phrase, { allowDeterminer: true }) || !observed || FUNCTION_WORDS.has(observed)) continue;

    const singularVerb = toThirdPersonSingularVerb(observed);
    if (!singularVerb || singularVerb === observed || !isLikelyCommonVerbBase(observed)) continue;
    const offset = match.index + match[0].lastIndexOf(match[3]);
    pushReplacementMatch({
      offset,
      length: match[3].length,
      value: singularVerb,
      message: 'Use a singular lexical verb after a singular noun phrase.',
      ruleId: 'CUSTOM_SINGULAR_NOUN_PHRASE_LEXICAL_VERB',
      description: 'Singular noun phrase with a bare lexical verb.'
    });
  }

  const pluralSubjectAuxRule = /\b([A-Za-z]+s)\s+(is|was|has|does)\b/gi;
  const pluralAuxMap = { is: 'are', was: 'were', has: 'have', does: 'do' };
  while ((match = pluralSubjectAuxRule.exec(sourceText)) !== null) {
    const subject = String(match[1] || '').toLowerCase();
    const observed = String(match[2] || '').toLowerCase();
    if (!subject || PLURAL_SUBJECT_EXCEPTIONS.has(subject) || !pluralAuxMap[observed]) continue;
    const offset = match.index + match[0].lastIndexOf(match[2]);
    pushReplacementMatch({
      offset,
      length: match[2].length,
      value: pluralAuxMap[observed],
      message: 'Use the plural verb after a plural subject.',
      ruleId: 'CUSTOM_PLURAL_SUBJECT_VERB_AGREEMENT',
      description: 'Plural subject with a singular auxiliary verb.'
    });
  }

  const irregularPluralSubjectRule = /\b(children|people|men|women|teeth|feet|mice|police)\s+(is|was|has|does|[A-Za-z]+)\b/gi;
  while ((match = irregularPluralSubjectRule.exec(sourceText)) !== null) {
    const observed = String(match[2] || '').toLowerCase();
    let replacement = { is: 'are', was: 'were', has: 'have', does: 'do' }[observed] || '';
    if (!replacement) {
      const base = toBaseVerbForm(observed);
      if (!base || base === observed || !isLikelyCommonVerbBase(base)) continue;
      replacement = base;
    }
    const offset = match.index + match[0].lastIndexOf(match[2]);
    pushReplacementMatch({
      offset,
      length: match[2].length,
      value: replacement,
      message: 'Use the plural verb after an irregular plural subject.',
      ruleId: 'CUSTOM_IRREGULAR_PLURAL_SUBJECT_VERB_AGREEMENT',
      description: 'Irregular plural subject with an incorrect verb.'
    });
  }

  const gerundSubjectRule = /\b([A-Za-z]+ing)\s+((?:always|also|almost|just|never|often|really|sometimes|still|usually)\s+)?([A-Za-z]+)\b/gi;
  while ((match = gerundSubjectRule.exec(sourceText)) !== null) {
    const observed = String(match[3] || '').toLowerCase();
    if (!observed || FUNCTION_WORDS.has(observed) || COMMON_ADVERBS.has(observed)) continue;
    const singularVerb = toThirdPersonSingularVerb(observed);
    if (!singularVerb || singularVerb === observed || !isLikelyCommonVerbBase(observed)) continue;
    const offset = match.index + match[0].lastIndexOf(match[3]);
    pushReplacementMatch({
      offset,
      length: match[3].length,
      value: singularVerb,
      message: 'Use a singular verb after a gerund subject.',
      ruleId: 'CUSTOM_GERUND_SUBJECT_VERB_AGREEMENT',
      description: 'Gerund subject with a bare verb.'
    });
  }

  const gerundCoordinatedVerbRule = /\b([A-Za-z]+ing)\s+((?:always|also|almost|just|never|often|really|sometimes|still|usually)\s+)?([A-Za-z]+)\b[^.?!]*?\band\s+((?:always|also|almost|just|never|often|really|sometimes|still|usually)\s+)?([A-Za-z]+)\b/gi;
  while ((match = gerundCoordinatedVerbRule.exec(sourceText)) !== null) {
    const observed = String(match[5] || '').toLowerCase();
    if (!observed || FUNCTION_WORDS.has(observed) || COMMON_ADVERBS.has(observed)) continue;
    const singularVerb = toThirdPersonSingularVerb(observed);
    if (!singularVerb || singularVerb === observed || !isLikelyCommonVerbBase(observed)) continue;
    const offset = match.index + match[0].lastIndexOf(match[5]);
    pushReplacementMatch({
      offset,
      length: match[5].length,
      value: singularVerb,
      message: 'Use a singular verb after a singular gerund subject.',
      ruleId: 'CUSTOM_GERUND_COORDINATED_VERB_AGREEMENT',
      description: 'Gerund subject with a bare coordinated verb.'
    });
  }

  const pluralPronounCoordinatedVerbRule = /\b(we|they|you)\b[^.?!]*?\band\s+(?:(?:always|also|almost|just|never|often|really|sometimes|still|usually)\s+)?([A-Za-z]+)\b/gi;
  while ((match = pluralPronounCoordinatedVerbRule.exec(sourceText)) !== null) {
    const observed = String(match[2] || '').toLowerCase();
    if (!observed || FUNCTION_WORDS.has(observed)) continue;
    const base = toBaseVerbForm(observed);
    if (!base || base === observed || !isLikelyCommonVerbBase(base)) continue;
    const offset = match.index + match[0].lastIndexOf(match[2]);
    pushReplacementMatch({
      offset,
      length: match[2].length,
      value: base,
      message: 'Use the base verb after a plural subject in a coordinated clause.',
      ruleId: 'CUSTOM_PLURAL_PRONOUN_COORDINATED_VERB',
      description: 'Subject-verb agreement in a coordinated clause with a plural subject.'
    });
  }

  const modalCoordinatedVerbRule = /\b(can|could|may|might|must|should|would|will)\b[^.?!]*?\band\s+(?:(?:always|also|almost|just|never|often|really|sometimes|still|usually)\s+)?([A-Za-z]+)\b/gi;
  while ((match = modalCoordinatedVerbRule.exec(sourceText)) !== null) {
    const observed = String(match[2] || '').toLowerCase();
    if (!observed || FUNCTION_WORDS.has(observed)) continue;
    const base = toBaseVerbForm(observed);
    if (!base || base === observed || !isLikelyCommonVerbBase(base)) continue;
    const offset = match.index + match[0].lastIndexOf(match[2]);
    pushReplacementMatch({
      offset,
      length: match[2].length,
      value: base,
      message: 'Use the base verb after a modal verb.',
      ruleId: 'CUSTOM_MODAL_COORDINATED_BARE_VERB',
      description: 'Bare infinitive after a modal verb in a coordinated clause.'
    });
  }

  const compoundSubjectRule = /\b([A-Za-z]+(?:\s+[A-Za-z]+)?)\s+and\s+([A-Za-z]+(?:\s+[A-Za-z]+)?)\s+(is|was|has|does|[A-Za-z]+)\b/gi;
  const compoundAuxMap = { is: 'are', was: 'were', has: 'have', does: 'do' };
  while ((match = compoundSubjectRule.exec(sourceText)) !== null) {
    const first = String(match[1] || '').toLowerCase().split(/\s+/).pop() || '';
    const second = String(match[2] || '').toLowerCase().split(/\s+/).pop() || '';
    const observed = String(match[3] || '').toLowerCase();
    if (!first || !second || FUNCTION_WORDS.has(first) || FUNCTION_WORDS.has(second)) continue;

    let replacement = compoundAuxMap[observed] || '';
    if (!replacement) {
      const base = toBaseVerbForm(observed);
      if (!base || base === observed || !isLikelyCommonVerbBase(base)) continue;
      replacement = base;
    }

    const offset = match.index + match[0].lastIndexOf(match[3]);
    pushReplacementMatch({
      offset,
      length: match[3].length,
      value: replacement,
      message: 'Use the plural verb after a compound subject.',
      ruleId: 'CUSTOM_COMPOUND_SUBJECT_VERB_AGREEMENT',
      description: 'Compound subject with an incorrect singular verb.'
    });
  }

  const sentenceInitialSingularAuxRule = /(^|[.!?]\s+|,\s+)([A-Za-z]+(?:\s+[A-Za-z]+)?)\s+((?:always|also|almost|just|never|often|really|sometimes|still|usually)\s+)?(are|were|have|do)\b/gm;
  while ((match = sentenceInitialSingularAuxRule.exec(sourceText)) !== null) {
    const subjectPhrase = String(match[2] || '').toLowerCase().trim();
    const subject = subjectPhrase.split(/\s+/).pop() || '';
    const observed = String(match[4] || '').toLowerCase();
    const replacement = singularAuxMap[observed];
    if (!subject || !observed || !replacement) continue;
    if (NON_SUBJECT_STARTERS.has(subject) || FUNCTION_WORDS.has(subject) || COMMON_ADVERBS.has(subject)) continue;
    if (PRONOUN_AUX_EXPECTATIONS[subject] || !isSafeSingularSubjectPhrase(subjectPhrase)) continue;

    const offset = match.index + match[0].lastIndexOf(match[4]);
    pushReplacementMatch({
      offset,
      length: match[4].length,
      value: replacement,
      message: 'Use the singular auxiliary verb after a singular subject.',
      ruleId: 'CUSTOM_SENTENCE_INITIAL_SINGULAR_SUBJECT_AUX',
      description: 'Sentence-initial singular subject with an incorrect auxiliary verb.'
    });
  }

  const sentenceInitialSingularNounRule = /(^|[.!?]\s+|,\s+)([A-Za-z]+(?:\s+[A-Za-z]+)?)\s+((?:always|also|almost|just|never|often|really|sometimes|still|usually)\s+)?([A-Za-z]+)\b/gm;
  while ((match = sentenceInitialSingularNounRule.exec(sourceText)) !== null) {
    const subjectPhrase = String(match[2] || '').toLowerCase().trim();
    const subject = subjectPhrase.split(/\s+/).pop() || '';
    const observed = String(match[4] || '').toLowerCase();
    if (!subject || !observed) continue;
    if (NON_SUBJECT_STARTERS.has(subject) || FUNCTION_WORDS.has(subject) || COMMON_ADVERBS.has(subject)) continue;
    if (PRONOUN_AUX_EXPECTATIONS[subject] || !isSafeSingularSubjectPhrase(subjectPhrase)) continue;
    if (!isLikelyCommonVerbBase(observed) || toThirdPersonSingularVerb(observed) === observed) continue;

    const offset = match.index + match[0].lastIndexOf(match[4]);
    pushReplacementMatch({
      offset,
      length: match[4].length,
      value: toThirdPersonSingularVerb(observed),
      message: 'Use the singular verb after a singular sentence subject.',
      ruleId: 'CUSTOM_SENTENCE_INITIAL_SINGULAR_SUBJECT_VERB',
      description: 'Sentence-initial singular subject with a bare verb.'
    });
  }
}

function getMinimalCustomRuleMatches(text = '') {
  const sourceText = String(text || '');
  if (!sourceText) return [];

  const matches = [];
  const pushReplacementMatch = ({
    offset,
    length,
    value,
    message,
    ruleId,
    description,
    categoryName = 'Grammar',
    issueType = 'grammar'
  }) => {
    if (!Number.isFinite(offset) || !Number.isFinite(length) || offset < 0 || length < 0) return;
    matches.push({
      offset,
      length,
      replacements: [{ value }],
      message,
      rule: {
        id: ruleId,
        description,
        issueType,
        category: {
          name: categoryName
        }
      },
      context: {
        text: sourceText,
        offset,
        length
      }
    });
  };

  const pattern = /\bkeen on\s+the\s+(white|black|red|blue|green|yellow|pink|purple|brown|orange|grey|gray)\b/gi;
  let match;
  while ((match = pattern.exec(sourceText)) !== null) {
    const articleIndex = match[0].toLowerCase().indexOf('the ');
    if (articleIndex < 0) continue;
    const offset = match.index + articleIndex;
    pushReplacementMatch({
      offset,
      length: 4,
      value: '',
      message: 'Remove the unnecessary article before the color.',
      ruleId: 'CUSTOM_COLOR_ARTICLE_AFTER_KEEN_ON',
      description: 'Unnecessary article before a color after "keen on".'
    });
  }

  pushGenericAgreementMatches(sourceText, pushReplacementMatch);

  const habitualReadBookRule = /\bread\s+book\s+(every\s+(morning|afternoon|evening|day|night|week|weekend)|after school|before bed|in my free time)\b/gi;
  while ((match = habitualReadBookRule.exec(sourceText)) !== null) {
    const fullMatch = String(match[0] || '');
    const bookIndex = fullMatch.toLowerCase().indexOf('book');
    if (bookIndex < 0) continue;
    const bookOffset = match.index + bookIndex;
    pushReplacementMatch({
      offset: bookOffset,
      length: 4,
      value: 'books',
      message: 'Use the plural noun for a habitual general activity.',
      ruleId: 'CUSTOM_HABITUAL_READ_BOOK_PLURAL',
      description: 'Bare singular count noun in a habitual "read book" phrase.'
    });
  }

  return matches;
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
    'Fix only clear grammar errors and a very small number of obvious wrong-word or incorrect collocation errors in this English writing submission.',
    'Make the smallest possible edits.',
    'Keep the original wording, vocabulary, tone, sentence order, and structure.',
    'Do NOT rewrite, paraphrase, improve style, or make the text sound more natural.',
    'Do NOT add or reorder information.',
    'Allowed grammar changes: verb forms, subject-verb agreement, articles, prepositions, pronouns, singular/plural, basic clause errors.',
    'A very small missing function word is allowed when it clearly fixes grammar, for example adding "my" or "the".',
    'Allowed wrong-word changes: only if the word is clearly incorrect and fixable with one simple replacement.',
    'Allowed collocation changes: only if the phrase is clearly incorrect or clearly unnatural, and the fix is very common and obvious.',
    'For collocations, replace only 1-2 words maximum and prefer just one word if possible.',
    'Do NOT change if multiple correct options exist.',
    'Do NOT fix awkward but acceptable wording.',
    'Do NOT remove phrases like "I think" or "In my opinion" if they are grammatically acceptable.',
    'Do NOT change proper nouns such as personal names, club names, place names, greeting names, or signature names.',
    'Keep original line breaks and paragraph breaks whenever possible.',
    'Keep every feedback very short and practical.',
    'common_errors should have at most 3 items.',
    'Each item feedback must be 1 short sentence in Vietnamese explaining only the grammar point, wrong word, or collocation that was corrected.',
    'Examples of the expected correction style:',
    'Original: "In my opinion, I think you should prepare carefully."',
    'Corrected: "In my opinion, I think you should prepare carefully."',
    'Why: awkward or redundant wording is style, not a grammar or wrong-word error.',
    'Original: "I would like to the club can organize outdoor activities."',
    'Corrected: "I would like the club to organize outdoor activities."',
    'Why: fix only the broken grammar pattern; keep almost all original words.',
    'Original: "I highly recommend that the club The club can invite speakers."',
    'Corrected: "I highly recommend that the club can invite speakers."',
    'Why: delete the duplicated words only; do not rewrite the whole sentence.',
    'Original: "Moreover, it can relive emotional pressure and reduce anxiety."',
    'Corrected: "Moreover, it can relieve emotional pressure and reduce anxiety."',
    'Why: fix the clearly wrong word with one small replacement only.',
    'Original: "We did a party last weekend."',
    'Corrected: "We had a party last weekend."',
    'Why: fix one clearly wrong collocation with one common replacement only.',
    'Original: "I did homework yesterday."',
    'Corrected: "I did my homework yesterday."',
    'Why: add one small missing possessive only.',
    'Original: "I was eager to contribute to preparation process."',
    'Corrected: "I was eager to contribute to the preparation process."',
    'Why: add one small missing article only.',
    'Return JSON exactly with this structure:',
    JSON.stringify({
      overall_feedback: 'Nhan xet tong the ngan bang tieng Viet ve loi ngu phap, tu sai ro rang, hoac collocation sai ro rang.',
      common_errors: ['Loi 1', 'Loi 2'],
      items: [
        {
          part: 'part1',
          key: 'question1_1',
          corrected_answer: 'Corrected English answer.',
          feedback: 'Nhan xet ngan cho loi ngu phap, tu sai ro rang, hoac collocation sai ro rang cua cau nay bang tieng Viet.'
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
    const rawCorrectedAnswer = hasAnswer
      ? restoreOriginalLineBreaks(item.answer, sanitizeText(rawItem.corrected_answer || item.answer))
      : '';
    const correctionDecision = hasAnswer
      ? enforceMinimalGrammarCorrection(item.answer, rawCorrectedAnswer)
      : { correctedAnswer: '', rejected: false };
    const feedback = hasAnswer
      ? (correctionDecision.rejected
        ? 'Giữ nguyên câu gốc để tránh sửa quá nhiều câu chữ.'
        : sanitizeText(rawItem.feedback || ''))
      : 'Không có câu trả lời.';

    return {
      part: item.part,
      key: item.key,
      corrected_answer: hasAnswer ? correctionDecision.correctedAnswer : '',
      feedback
    };
  });

  const overallFeedback = sanitizeText(parsed?.overall_feedback || '') || 'AI đã rà soát và chỉ sửa lỗi ngữ pháp, từ sai rõ ràng, hoặc collocation sai rõ ràng thật sự cần thiết.';
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

function restoreOriginalLineBreaks(original, corrected) {
  const originalText = String(original || '').replace(/\r\n/g, '\n');
  let correctedText = String(corrected || '').replace(/\r\n/g, '\n');

  if (!originalText || !correctedText || !originalText.includes('\n')) {
    return correctedText;
  }

  const originalLines = originalText.split('\n');
  const anchors = originalLines
    .slice(1)
    .map(buildLineAnchors)
    .filter(Boolean);

  if (!anchors.length) {
    return correctedText;
  }

  let searchStart = 0;
  anchors.forEach((anchorOptions) => {
    const index = indexOfAnchor(correctedText, anchorOptions, searchStart);
    if (index <= 0) return;
    if (correctedText[index - 1] !== '\n') {
      correctedText = `${correctedText.slice(0, index)}\n${correctedText.slice(index)}`;
      searchStart = index + 2;
      return;
    }
    searchStart = index + 1;
  });

  return correctedText
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n[ \t]+/g, '\n')
    .replace(/\n{3,}/g, '\n\n');
}

function buildLineAnchors(line) {
  const trimmed = String(line || '').trim();
  if (!trimmed) return null;
  const words = trimmed.split(/\s+/).filter(Boolean);
  const maxWords = Math.min(words.length, 5);
  const anchors = [];
  for (let count = maxWords; count >= 1; count -= 1) {
    anchors.push(words.slice(0, count).join(' '));
  }
  return anchors;
}

function indexOfAnchor(text, anchors, startIndex) {
  const anchorList = Array.isArray(anchors) ? anchors : [anchors];
  for (const anchor of anchorList) {
    const directIndex = text.indexOf(anchor, startIndex);
    if (directIndex >= 0) return directIndex;
  }

  const lowerText = text.toLowerCase();
  for (const anchor of anchorList) {
    const lowerAnchor = String(anchor || '').toLowerCase();
    const lowerIndex = lowerText.indexOf(lowerAnchor, startIndex);
    if (lowerIndex >= 0) return lowerIndex;
  }

  return -1;
}

function filterGrammarOnlyMatches(matches = []) {
  return matches.filter((match) => {
    const categoryName = String(match?.rule?.category?.name || '').toLowerCase();
    const issueType = String(match?.rule?.issueType || '').toLowerCase();
    return (
      categoryName.includes('grammar')
      || issueType === 'grammar'
      || issueType === 'misspelling'
      || issueType === 'typographical'
      || categoryName.includes('spelling')
      || (
        categoryName.includes('possible typo')
        && typeof match?.replacements?.[0]?.value === 'string'
      )
    );
  });
}

function enforceMinimalGrammarCorrection(original, candidate) {
  const strictDecision = enforceMinimalGrammarCorrectionStrict(original, candidate);
  if (!strictDecision.rejected) {
    return strictDecision;
  }

  return salvageLineLevelCorrection(original, candidate, strictDecision);
}

function salvageLineLevelCorrection(original, candidate, fallbackDecision) {
  const originalText = sanitizeText(original || '');
  const candidateText = sanitizeText(candidate || '');

  if (!originalText || !candidateText || !originalText.includes('\n') || !candidateText.includes('\n')) {
    return fallbackDecision;
  }

  const originalLines = originalText.split('\n');
  const candidateLines = candidateText.split('\n');
  if (originalLines.length !== candidateLines.length) {
    return fallbackDecision;
  }

  let changed = false;
  const mergedLines = originalLines.map((originalLine, index) => {
    const candidateLine = candidateLines[index] ?? originalLine;
    const lineDecision = enforceMinimalGrammarCorrectionStrict(originalLine, candidateLine);
    const nextLine = lineDecision.rejected
      ? sanitizeText(originalLine || '')
      : lineDecision.correctedAnswer;

    if (nextLine !== sanitizeText(originalLine || '')) {
      changed = true;
    }

    return nextLine;
  });

  if (!changed) {
    return fallbackDecision;
  }

  const mergedText = mergedLines.join('\n');
  const protectedDecision = restoreProtectedContent(originalText, mergedText);
  if (protectedDecision.rejected) {
    return fallbackDecision;
  }

  return {
    correctedAnswer: protectedDecision.correctedAnswer,
    rejected: false
  };
}

function enforceMinimalGrammarCorrectionStrict(original, candidate) {
  const originalText = sanitizeText(original || '');
  let candidateText = sanitizeText(candidate || '');

  if (!originalText) {
    return {
      correctedAnswer: '',
      rejected: false
    };
  }

  if (!candidateText || candidateText === originalText) {
    return {
      correctedAnswer: originalText,
      rejected: false
    };
  }

  const protectedContentDecision = restoreProtectedContent(originalText, candidateText);
  candidateText = protectedContentDecision.correctedAnswer;

  if (protectedContentDecision.rejected) {
    return {
      correctedAnswer: originalText,
      rejected: true
    };
  }

  const originalWords = tokenizeComparisonWords(originalText);
  const candidateWords = tokenizeComparisonWords(candidateText);

  if (!originalWords.length || !candidateWords.length) {
    return {
      correctedAnswer: originalText,
      rejected: true
    };
  }

  const originalLower = originalWords.map((word) => word.toLowerCase());
  const candidateLower = candidateWords.map((word) => word.toLowerCase());

  // If only punctuation/capitalization changed, keep the original because
  // this mode should focus on grammar only.
  if (areArraysEqual(originalLower, candidateLower)) {
    return {
      correctedAnswer: originalText,
      rejected: true
    };
  }

  const originalSentenceCount = countSentences(originalText);
  const candidateSentenceCount = countSentences(candidateText);
  if (originalSentenceCount !== candidateSentenceCount) {
    return {
      correctedAnswer: originalText,
      rejected: true
    };
  }

  const wordDelta = Math.abs(candidateWords.length - originalWords.length);
  if (wordDelta > getAllowedWordDelta(originalWords.length)) {
    return {
      correctedAnswer: originalText,
      rejected: true
    };
  }

  const lcsLength = computeWordLcsLength(originalLower, candidateLower);
  const maxLength = Math.max(originalLower.length, candidateLower.length, 1);
  const preservedRatio = lcsLength / maxLength;
  const changedWordCount = maxLength - lcsLength;

  if (preservedRatio < getMinimumPreservedRatio(originalWords.length)) {
    return {
      correctedAnswer: originalText,
      rejected: true
    };
  }

  if (changedWordCount > getAllowedChangedWordCount(originalWords.length)) {
    return {
      correctedAnswer: originalText,
      rejected: true
    };
  }

  if (removesProtectedStylePhrase(originalText, candidateText)) {
    return {
      correctedAnswer: originalText,
      rejected: true
    };
  }

  const diffChunks = computeWordDiffChunks(originalLower, candidateLower);
  if (!areDiffChunksGrammarOrSpellingOnly(originalLower, diffChunks)) {
    return {
      correctedAnswer: originalText,
      rejected: true
    };
  }

  return {
    correctedAnswer: candidateText,
    rejected: false
  };
}

function restoreProtectedContent(originalText, candidateText) {
  let nextText = String(candidateText || '');
  nextText = restoreGreetingLine(originalText, nextText);
  nextText = restoreSignatureBlock(originalText, nextText);

  const protectedPhrases = extractProtectedPhrases(originalText);
  protectedPhrases.forEach((entry) => {
    if (countOccurrencesInsensitive(nextText, entry.phrase) >= entry.originalCount) {
      return;
    }

    entry.occurrences.forEach((occurrence) => {
      if (countOccurrencesInsensitive(nextText, entry.phrase) >= entry.originalCount) {
        return;
      }
      const replaced = replaceUsingContexts(nextText, occurrence.leftContext, occurrence.rightContext, entry.phrase);
      if (replaced) {
        nextText = replaced;
      }
    });
  });

  const lostProtectedPhrase = protectedPhrases.some(
    (entry) => countOccurrencesInsensitive(nextText, entry.phrase) < entry.originalCount
  );

  return {
    correctedAnswer: lostProtectedPhrase ? originalText : nextText,
    rejected: lostProtectedPhrase
  };
}

function restoreGreetingLine(originalText, candidateText) {
  const originalMatch = originalText.match(/(^|\n)(Dear[^\n]*)/i);
  const candidateMatch = candidateText.match(/(^|\n)(Dear[^\n]*)/i);
  if (!originalMatch || !candidateMatch) {
    return candidateText;
  }

  const originalLine = originalMatch[2];
  const candidateLine = candidateMatch[2];
  if (originalLine === candidateLine) {
    return candidateText;
  }

  const start = candidateMatch.index + candidateMatch[1].length;
  return `${candidateText.slice(0, start)}${originalLine}${candidateText.slice(start + candidateLine.length)}`;
}

function restoreSignatureBlock(originalText, candidateText) {
  const signatureRegex = /(?:^|\n)((?:Best regards|Kind regards|Regards|Love|Sincerely|Yours sincerely|Yours faithfully|Warm regards),?\n[^\n]+)/i;
  const originalMatch = signatureRegex.exec(originalText);
  const candidateMatch = signatureRegex.exec(candidateText);

  if (!originalMatch || !candidateMatch) {
    return candidateText;
  }

  const originalBlock = originalMatch[1];
  const candidateBlock = candidateMatch[1];
  if (originalBlock === candidateBlock) {
    return candidateText;
  }

  const start = candidateMatch.index + (candidateMatch[0].length - candidateBlock.length);
  return `${candidateText.slice(0, start)}${originalBlock}${candidateText.slice(start + candidateBlock.length)}`;
}

function extractProtectedPhrases(originalText) {
  const phraseMap = new Map();
  const seenOccurrences = new Set();
  const addPhrase = (phrase, startIndex) => {
    const normalizedPhrase = sanitizeText(phrase || '', 200);
    if (!normalizedPhrase || normalizedPhrase.length < 2) {
      return;
    }

    const occurrenceKey = `${normalizedPhrase}@@${startIndex}`;
    if (seenOccurrences.has(occurrenceKey)) {
      return;
    }
    seenOccurrences.add(occurrenceKey);

    const existing = phraseMap.get(normalizedPhrase) || {
      phrase: normalizedPhrase,
      originalCount: 0,
      occurrences: []
    };

    existing.originalCount += 1;
    existing.occurrences.push({
      leftContext: originalText.slice(Math.max(0, startIndex - 24), startIndex),
      rightContext: originalText.slice(startIndex + normalizedPhrase.length, startIndex + normalizedPhrase.length + 24)
    });
    phraseMap.set(normalizedPhrase, existing);
  };

  addCaptureMatches(originalText, /\bDear\s+([^,\n]+)(?=,)/gi, addPhrase);
  addCaptureMatches(
    originalText,
    /,\s*([A-Z][A-Za-z'’-]+(?:\s+[A-Z][A-Za-z'’-]+){0,2})(?=[\.,])/g,
    addPhrase
  );
  addCaptureMatches(
    originalText,
    /\b([A-Z][A-Za-z'’-]+(?:\s+[A-Z][A-Za-z'’-]+){1,3})\b/g,
    addPhrase
  );

  return Array.from(phraseMap.values()).sort((left, right) => right.phrase.length - left.phrase.length);
}

function addCaptureMatches(text, regex, onMatch) {
  const sourceText = String(text || '');
  const flags = regex.flags.includes('g') ? regex.flags : `${regex.flags}g`;
  const pattern = new RegExp(regex.source, flags);
  let match;
  while ((match = pattern.exec(sourceText)) !== null) {
    const captured = sanitizeText(match[1] || '', 200);
    if (!captured) continue;
    const relativeIndex = match[0].indexOf(match[1]);
    const startIndex = match.index + Math.max(0, relativeIndex);
    onMatch(captured, startIndex);
  }
}

function replaceUsingContexts(text, leftContext, rightContext, replacement) {
  const range = findContextRange(text, leftContext, rightContext, replacement.length);
  if (!range) {
    return null;
  }
  return `${text.slice(0, range.start)}${replacement}${text.slice(range.end)}`;
}

function findContextRange(text, leftContext, rightContext, replacementLength) {
  const leftOptions = buildContextOptions(leftContext, true);
  const rightOptions = buildContextOptions(rightContext, false);

  for (const leftOption of leftOptions) {
    let leftIndex = leftOption ? indexOfInsensitive(text, leftOption, 0) : 0;
    while (leftIndex >= 0) {
      const start = leftIndex + leftOption.length;
      for (const rightOption of rightOptions) {
        const end = rightOption ? indexOfInsensitive(text, rightOption, start) : start;
        if (end >= 0) {
          const gapLength = end - start;
          if (gapLength >= 0 && gapLength <= Math.max(replacementLength + 24, 80)) {
            return { start, end };
          }
        }
      }

      if (!leftOption) {
        break;
      }
      leftIndex = indexOfInsensitive(text, leftOption, leftIndex + 1);
    }
  }

  return null;
}

function buildContextOptions(context, isLeftSide) {
  const value = String(context || '');
  if (!value) return [''];

  const options = [];
  const lengths = isLeftSide ? [value.length, 20, 14, 8] : [value.length, 20, 14, 8];
  lengths.forEach((length) => {
    if (length <= 0) return;
    const option = isLeftSide ? value.slice(-length) : value.slice(0, length);
    if (option && !options.includes(option)) {
      options.push(option);
    }
  });
  return options;
}

function indexOfInsensitive(text, search, startIndex = 0) {
  const source = String(text || '');
  const needle = String(search || '');
  if (!needle) return startIndex;
  return source.toLowerCase().indexOf(needle.toLowerCase(), startIndex);
}

function countOccurrencesInsensitive(text, phrase) {
  const source = String(text || '').toLowerCase();
  const needle = String(phrase || '').toLowerCase();
  if (!needle) return 0;

  let count = 0;
  let searchIndex = 0;
  while (searchIndex < source.length) {
    const foundIndex = source.indexOf(needle, searchIndex);
    if (foundIndex === -1) break;
    count += 1;
    searchIndex = foundIndex + needle.length;
  }
  return count;
}

function countPhraseOccurrences(text, phrase) {
  const source = normalizePhraseText(text);
  const needle = normalizePhraseText(phrase);
  if (!needle) return 0;

  let count = 0;
  let searchIndex = 0;
  while (searchIndex < source.length) {
    const foundIndex = source.indexOf(needle, searchIndex);
    if (foundIndex === -1) break;
    const leftOk = foundIndex === 0 || source[foundIndex - 1] === ' ';
    const rightIndex = foundIndex + needle.length;
    const rightOk = rightIndex === source.length || source[rightIndex] === ' ';
    if (leftOk && rightOk) {
      count += 1;
    }
    searchIndex = foundIndex + needle.length;
  }
  return count;
}

function normalizePhraseText(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/[^a-z0-9'\s]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function removesProtectedStylePhrase(originalText, candidateText) {
  return STYLE_PHRASES_TO_KEEP.some((phrase) => (
    countPhraseOccurrences(originalText, phrase) > countPhraseOccurrences(candidateText, phrase)
  ));
}

function tokenizeComparisonWords(text) {
  return sanitizeText(text || '')
    .match(/[A-Za-z0-9']+/g) || [];
}

function countSentences(text) {
  const normalized = sanitizeText(text || '');
  if (!normalized) return 0;
  const sentences = normalized.match(/[.!?]+/g);
  return sentences ? sentences.length : 1;
}

function getAllowedWordDelta(wordCount) {
  if (wordCount <= 8) return 2;
  if (wordCount <= 20) return 3;
  if (wordCount <= 60) return 5;
  return 8;
}

function getMinimumPreservedRatio(wordCount) {
  if (wordCount <= 8) return 0.55;
  if (wordCount <= 20) return 0.7;
  if (wordCount <= 60) return 0.8;
  return 0.85;
}

function getAllowedChangedWordCount(wordCount) {
  if (wordCount <= 8) return 4;
  if (wordCount <= 20) return 6;
  return Math.max(8, Math.ceil(wordCount * 0.2));
}

function computeWordLcsLength(source, target) {
  const rows = source.length;
  const cols = target.length;
  const dp = Array.from({ length: rows + 1 }, () => Array(cols + 1).fill(0));

  for (let row = rows - 1; row >= 0; row -= 1) {
    for (let col = cols - 1; col >= 0; col -= 1) {
      if (source[row] === target[col]) {
        dp[row][col] = dp[row + 1][col + 1] + 1;
      } else {
        dp[row][col] = Math.max(dp[row + 1][col], dp[row][col + 1]);
      }
    }
  }

  return dp[0][0];
}

function computeWordDiffChunks(source, target) {
  const rows = source.length;
  const cols = target.length;
  const dp = Array.from({ length: rows + 1 }, () => Array(cols + 1).fill(0));

  for (let row = rows - 1; row >= 0; row -= 1) {
    for (let col = cols - 1; col >= 0; col -= 1) {
      if (source[row] === target[col]) {
        dp[row][col] = dp[row + 1][col + 1] + 1;
      } else {
        dp[row][col] = Math.max(dp[row + 1][col], dp[row][col + 1]);
      }
    }
  }

  const chunks = [];
  let current = null;
  let row = 0;
  let col = 0;

  const flush = () => {
    if (!current) return;
    current.endOriginal = row;
    chunks.push(current);
    current = null;
  };

  while (row < rows || col < cols) {
    if (row < rows && col < cols && source[row] === target[col]) {
      flush();
      row += 1;
      col += 1;
      continue;
    }

    if (!current) {
      current = {
        startOriginal: row,
        endOriginal: row,
        removed: [],
        added: []
      };
    }

    const deleteScore = row < rows ? dp[row + 1][col] : -1;
    const insertScore = col < cols ? dp[row][col + 1] : -1;

    if (col >= cols || (row < rows && deleteScore >= insertScore)) {
      current.removed.push(source[row]);
      row += 1;
    } else {
      current.added.push(target[col]);
      col += 1;
    }
  }

  flush();
  return chunks;
}

function areDiffChunksGrammarOrSpellingOnly(originalWords, chunks) {
  return chunks.every((chunk) => isAllowedDiffChunk(originalWords, chunk));
}

function isAllowedDiffChunk(originalWords, chunk) {
  const removed = chunk.removed || [];
  const added = chunk.added || [];

  if (!removed.length && !added.length) {
    return true;
  }

  if (!added.length && isDuplicateDeletion(originalWords, chunk)) {
    return true;
  }

  if (removed.length === 1 && added.length === 1) {
    return isAllowedWordSwap(removed[0], added[0]);
  }

  if (!removed.length) {
    return added.every(isFunctionWord);
  }

  if (!added.length) {
    return removed.every(isFunctionWord);
  }

  return removed.every(isFunctionWord) && added.every(isFunctionWord);
}

function isDuplicateDeletion(originalWords, chunk) {
  const removed = chunk.removed || [];
  const length = removed.length;
  const start = chunk.startOriginal || 0;
  if (!length) return false;

  const previous = originalWords.slice(Math.max(0, start - length), start);
  if (previous.length === length && areArraysEqual(previous, removed)) {
    return true;
  }

  const next = originalWords.slice(start + length, start + (length * 2));
  return next.length === length && areArraysEqual(next, removed);
}

function isAllowedWordSwap(fromWord, toWord) {
  if (fromWord === toWord) return true;
  if (isFunctionWord(fromWord) || isFunctionWord(toWord)) return true;
  if (isSimpleSpellingVariant(fromWord, toWord)) return true;
  return isInflectionVariant(fromWord, toWord);
}

function isFunctionWord(word) {
  return FUNCTION_WORDS.has(String(word || '').toLowerCase());
}

function isInflectionVariant(left, right) {
  const fromWord = String(left || '').toLowerCase();
  const toWord = String(right || '').toLowerCase();
  if (!fromWord || !toWord) return false;
  if (stripCommonSuffix(fromWord) === stripCommonSuffix(toWord)) return true;
  if (toWord === `${fromWord}s` || toWord === `${fromWord}es`) return true;
  if (fromWord === `${toWord}s` || fromWord === `${toWord}es`) return true;
  if (fromWord.endsWith('y') && toWord === `${fromWord.slice(0, -1)}ies`) return true;
  if (toWord.endsWith('y') && fromWord === `${toWord.slice(0, -1)}ies`) return true;
  return false;
}

function stripCommonSuffix(word) {
  const value = String(word || '').toLowerCase();
  for (const suffix of ['ing', 'ed', 'es', 's', 'ly']) {
    if (value.length > suffix.length + 2 && value.endsWith(suffix)) {
      return value.slice(0, -suffix.length);
    }
  }
  return value;
}

function isSimpleSpellingVariant(left, right) {
  const fromWord = String(left || '').toLowerCase();
  const toWord = String(right || '').toLowerCase();
  if (!fromWord || !toWord) return false;
  if (Math.abs(fromWord.length - toWord.length) > 2) return false;
  if (fromWord[0] !== toWord[0]) return false;
  return levenshteinDistance(fromWord, toWord) <= 2;
}

function levenshteinDistance(source, target) {
  const left = String(source || '');
  const right = String(target || '');
  const rows = left.length + 1;
  const cols = right.length + 1;
  const dp = Array.from({ length: rows }, () => Array(cols).fill(0));

  for (let row = 0; row < rows; row += 1) dp[row][0] = row;
  for (let col = 0; col < cols; col += 1) dp[0][col] = col;

  for (let row = 1; row < rows; row += 1) {
    for (let col = 1; col < cols; col += 1) {
      const cost = left[row - 1] === right[col - 1] ? 0 : 1;
      dp[row][col] = Math.min(
        dp[row - 1][col] + 1,
        dp[row][col - 1] + 1,
        dp[row - 1][col - 1] + cost
      );
    }
  }

  return dp[rows - 1][cols - 1];
}

function areArraysEqual(source, target) {
  if (source.length !== target.length) return false;
  for (let index = 0; index < source.length; index += 1) {
    if (source[index] !== target[index]) {
      return false;
    }
  }
  return true;
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
