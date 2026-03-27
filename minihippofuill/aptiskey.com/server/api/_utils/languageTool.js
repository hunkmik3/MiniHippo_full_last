const LANGUAGETOOL_API_URL = process.env.LANGUAGETOOL_API_URL || 'https://api.languagetoolplus.com/v2';

export async function checkGrammar(text, language = 'en-US') {
  if (!text || !text.trim()) return [];

  const params = new URLSearchParams({
    text,
    language,
    level: 'picky'
  });

  const apiKey = process.env.LANGUAGETOOL_API_KEY;
  if (apiKey) params.append('apiKey', apiKey);

  const res = await fetch(`${LANGUAGETOOL_API_URL}/check`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString(),
    signal: AbortSignal.timeout(15000)
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    throw new Error(`LanguageTool API error ${res.status}: ${errText.slice(0, 200)}`);
  }

  const data = await res.json();
  return data.matches || [];
}

export function applyCorrections(originalText, matches) {
  if (!matches || !matches.length) return originalText;

  // Sort by offset descending so we can splice from end to start
  const sorted = [...matches]
    .filter(m => m.replacements && m.replacements.length > 0)
    .sort((a, b) => b.offset - a.offset);

  let result = originalText;
  const applied = [];

  for (const match of sorted) {
    const start = match.offset;
    const end = start + match.length;

    // Skip if overlaps with already applied correction
    if (applied.some(a => start < a.end && end > a.start)) continue;

    const replacement = match.replacements[0].value;
    result = result.slice(0, start) + replacement + result.slice(end);
    applied.push({ start, end });
  }

  return result;
}

export function buildFeedbackFromMatches(matches) {
  if (!matches || !matches.length) {
    return {
      feedback: 'Không phát hiện lỗi ngữ pháp, từ sai hoặc collocation sai rõ ràng.',
      commonErrors: []
    };
  }

  const groups = new Map();
  matches.forEach((match) => {
    const label = mapMatchToCommonError(match);
    groups.set(label, (groups.get(label) || 0) + 1);
  });

  const commonErrors = Array.from(groups.entries())
    .sort((left, right) => right[1] - left[1])
    .slice(0, 3)
    .map(([label]) => label);

  return {
    feedback: 'Bài viết có một số lỗi về ngữ pháp, chính tả hoặc collocation cần chỉnh nhẹ.',
    commonErrors
  };
}

export function matchToVietnamese(match) {
  if (!match) return '';
  const mapped = mapMatchToItemFeedback(match);
  if (mapped) return mapped;

  const original = match.context?.text?.slice(match.context.offset, match.context.offset + match.context.length) || '';
  const replacement = match.replacements?.[0]?.value || '';
  if (original && replacement) {
    return `Sửa "${original}" thành "${replacement}".`;
  }
  return 'Kiểm tra lại ngữ pháp ở cụm này.';
}

function mapMatchToCommonError(match) {
  const details = getMatchDetails(match);
  if (details.isCustomColorArticle) return 'Lỗi dùng mạo từ (articles)';
  if (details.isCustomHabitualReadBookPlural) return 'Lỗi danh từ số ít/số nhiều';
  if (details.isArticle) return 'Lỗi dùng mạo từ (articles)';
  if (details.isVerbAgreement) return 'Lỗi hòa hợp chủ ngữ-động từ và dạng động từ';
  if (details.isSpellingOrWrongWord) return 'Lỗi dùng từ sai hoặc chính tả';
  if (details.isPrepositionOrCollocation) return 'Lỗi dùng từ sai hoặc collocation không tự nhiên';
  return 'Lỗi ngữ pháp cơ bản';
}

function mapMatchToItemFeedback(match) {
  const details = getMatchDetails(match);
  if (details.isCustomColorArticle) return 'Bỏ mạo từ thừa trước tên màu.';
  if (details.isCustomHabitualReadBookPlural) return 'Đổi danh từ sang số nhiều trong thói quen chung.';
  if (details.isArticle) return 'Kiểm tra lại mạo từ ở cụm này.';
  if (details.isVerbAgreement) return 'Kiểm tra lại hòa hợp chủ ngữ-động từ hoặc dạng động từ.';
  if (details.isSpellingOrWrongWord) return 'Kiểm tra lại chính tả hoặc từ dùng ở cụm này.';
  if (details.isPrepositionOrCollocation) return 'Kiểm tra lại giới từ hoặc collocation ở cụm này.';
  return 'Kiểm tra lại ngữ pháp ở cụm này.';
}

function getMatchDetails(match) {
  const category = String(match?.rule?.category?.name || '').toLowerCase();
  const issueType = String(match?.rule?.issueType || '').toLowerCase();
  const ruleId = String(match?.rule?.id || '').toLowerCase();
  const description = String(match?.rule?.description || '').toLowerCase();
  const message = String(match?.message || '').toLowerCase();
  const haystack = [category, issueType, ruleId, description, message].join(' ');
  const isCustomColorArticle = ruleId === 'custom_color_article_after_keen_on';
  const isCustomHabitualReadBookPlural = ruleId === 'custom_habitual_read_book_plural';

  const isSpellingOrWrongWord = (
    issueType === 'misspelling'
    || issueType === 'typographical'
    || haystack.includes('typo')
    || haystack.includes('spelling')
    || haystack.includes('misspell')
    || haystack.includes('word choice')
    || haystack.includes('wrong word')
    || haystack.includes('confused words')
  );

  const isArticle = (
    haystack.includes('article')
    || haystack.includes('determiner')
  );

  const isVerbAgreement = (
    haystack.includes('agreement')
    || haystack.includes('subject-verb')
    || haystack.includes('subject verb')
    || haystack.includes('verb form')
    || haystack.includes('conjugat')
    || haystack.includes('tense')
    || haystack.includes('gerund')
    || haystack.includes('infinitive')
  );

  const isPrepositionOrCollocation = (
    haystack.includes('preposition')
    || haystack.includes('collocation')
    || haystack.includes('phrase')
    || haystack.includes('expression')
  );

  return {
    isCustomColorArticle,
    isCustomHabitualReadBookPlural,
    isArticle,
    isVerbAgreement,
    isSpellingOrWrongWord,
    isPrepositionOrCollocation
  };
}
