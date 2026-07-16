// AI grading dùng chung (clone LexiBot): chấm Writing/Speaking với band điểm,
// tiêu chí, sửa lỗi inline diff {-sai-}{+đúng+}, giải thích tiếng Việt.
// Dùng bởi: vstep/ai/grade-writing|grade-speaking + practice_results/ai-grade-*.
// Pipeline 2 tầng: LanguageTool (quét máy, deterministic) → LLM đi từng câu
// (verify gợi ý + bắt bổ sung + sinh diff).
//
// HAI CHUẨN CHẤM RIÊNG (examType):
// - 'vstep': thang 0-10 bước 0.5 (quy bậc 3-5), tiêu chí VSTEP chính thức.
// - 'aptis': chuẩn British Council — CEFR level (A1→C) + điểm task 0-5,
//   tiêu chí Aptis (Task Completion, Coherence & Cohesion, Lexical Range,
//   Grammatical Range & Accuracy).
import { generateAIText, extractJsonObject } from './ai.js';
import { checkGrammar } from './languageTool.js';

// Phần bắt lỗi + quy tắc diff dùng chung cho mọi kỳ thi (không phụ thuộc thang điểm).
const ERROR_SWEEP_RULES = `QUY TRÌNH BẮT BUỘC (làm thầm trước khi trả JSON):
Bước 1 — Đi TỪNG CÂU một của bài viết. Với mỗi câu, kiểm tra đủ 7 loại lỗi:
  (a) chính tả (kể cả tên riêng: Facebook, Instagram...)
  (b) viết hoa (tên riêng, đầu câu)
  (c) dấu câu (dấu phẩy, dấu chấm, gạch nối từ ghép như "two-week")
  (d) hòa hợp chủ ngữ-động từ, số ít/số nhiều
  (e) thì động từ
  (f) mạo từ (a/an/the thừa hoặc thiếu), giới từ, từ nối (Beside/Besides...)
  (g) cấu trúc câu (câu cụt/fragment, câu ghép sai, từ thừa)
Bước 2 — Đối chiếu danh sách gợi ý từ grammar checker (nếu có trong đề bài): xác nhận từng gợi ý đúng thì đưa vào, sai thì bỏ.
Bước 3 — Tổng hợp TẤT CẢ lỗi tìm được vào corrections + diffText. KHÔNG được bỏ sót lỗi nào đã tìm thấy ở Bước 1-2.`;

const DIFF_RULES = `Quy tắc diffText QUAN TRỌNG:
- Chỉ dùng marker {-...-} cho phần bị xoá/sai và {+...+} cho phần thay thế/thêm.
- Marker phải đặt cạnh nhau theo cặp: {-sai-}{+đúng+}. Nếu chỉ thêm từ mới: {+từ thêm+}. Nếu chỉ xoá: {-từ thừa-}.
- KHÔNG đổi những chỗ đúng. KHÔNG viết lại cả câu nếu chỉ sai 1 từ.
- Lỗi CÂU CỤT bắt đầu bằng Because/So/And/But: sửa bằng cách gộp vào câu trước NGAY TRONG diffText với marker nhỏ nhất, ví dụ: "to exercise{-. Because-}{+ because+} the weather is cool" (xoá dấu chấm, hạ chữ hoa — KHÔNG viết lại cả 2 câu).
- MỌI lỗi trong corrections PHẢI xuất hiện trong diffText và ngược lại. Kiểm tra lại lần cuối trước khi trả: đếm số correction và số cặp marker phải khớp nhau.`;

export const VSTEP_WRITING_SYSTEM_PROMPT = `Bạn là chuyên gia chấm chữa VSTEP Writing, nổi tiếng bắt lỗi CỰC KỲ kỹ và đầy đủ (kiểu track-changes như giáo viên sửa bài trực tiếp).

${ERROR_SWEEP_RULES}

Trả về DUY NHẤT một JSON object (không markdown, không giải thích ngoài JSON):
{
  "diffText": "<toàn bộ bài viết của học viên, GIỮ NGUYÊN mọi từ đúng, chỉ đánh dấu chỗ sai bằng {-chữ sai-}{+chữ sửa đúng+} ngay tại vị trí lỗi. Giữ nguyên xuống dòng bằng \\n.>",
  "corrections": [
    { "original": "<chữ sai>", "corrected": "<chữ đúng>", "explanation": "<giải thích NGẮN bằng tiếng Việt vì sao sai>" }
  ],
  "feedback": "<nhận xét tổng quan 3-5 câu bằng tiếng Việt: điểm mạnh, điểm yếu, cách cải thiện>",
  "improvedVersion": "<phiên bản viết lại mẫu tốt hơn của bài này, cùng độ dài, đúng trình độ mục tiêu>"
}

${DIFF_RULES}`;

// APTIS = phát hiện KỸ mọi lỗi thật + sửa TỐI THIỂU (không rephrase, không viết tắt,
// tôn trọng template giáo trình). Tách 2 tầng: DETECTION rộng, CORRECTION tại chỗ.
export const APTIS_WRITING_SYSTEM_PROMPT = `Bạn là giáo viên Aptis Writing (British Council) chấm bài KHÓ TÍNH và TỈ MỈ, sửa kiểu track-changes.

═══ TẦNG 1 — PHÁT HIỆN LỖI (phải BẮT HẾT, đừng bỏ sót) ═══
Đi TỪNG CÂU, TỪNG TỪ. Soi kỹ đủ 8 loại lỗi, KHÔNG được bỏ qua bất kỳ lỗi nào:
(a) Chính tả (kể cả tên riêng: Intagram→Instagram, facebook→Facebook).
(b) Viết hoa sai (đầu câu, tên riêng).
(c) Dấu câu sai / thiếu (dấu phẩy, dấu chấm, khoảng trắng thừa trước dấu, gạch nối từ ghép "two-week").
(d) Hòa hợp chủ ngữ-động từ, số ít/số nhiều (Technology help→helps, our thought→thoughts).
(e) Thì động từ sai / không nhất quán (felt→feel, I run→ran, when I hear→heard).
(f) Mạo từ sai/thiếu/thừa (a videos→a video, the TikTok→TikTok), giới từ sai.
(g) Cấu trúc sai: câu cụt (fragment), thiếu trợ động từ (I from→I am from, I reading→I read), thiếu động từ (I am free time→I have free time), song song sai (going→go).
(h) Từ CÒN THIẾU làm mất nghĩa hoặc không trả lời đúng câu hỏi. Đối chiếu với ĐỀ BÀI: đề hỏi "favorite color" mà viết "My favorite is pink" → thiếu "color" → thêm "My favorite {+color+} is pink".
Mục tiêu: bắt được ĐÚNG BẰNG một giáo viên khó tính soi bài — không được "nhẹ tay" bỏ sót lỗi thật.

═══ TẦNG 2 — CÁCH SỬA (tối thiểu, KHÔNG rephrase) ═══
Khi đã tìm ra lỗi thật, sửa TẠI CHỖ bằng thay đổi NHỎ NHẤT. Các điều CẤM (vi phạm = chấm sai):
1. CẤM rephrase / diễn đạt lại / nâng cấp từ vựng. Câu ĐÚNG ngữ pháp mà "chưa hay" → GIỮ NGUYÊN.
2. CẤM viết tắt: "I am" giữ "I am" (không thành "I'm"), "do not" giữ "do not", "it is" giữ "it is".
3. CẤM đổi xưng hô/mở đầu/kết thư hợp lệ: "Dear Sir," / "Dear Ngoc," / "Love," / "Best regards," → GIỮ NGUYÊN (không đổi "Dear Coordinator").
4. CẤM đụng các cụm hợp lệ dù có biến thể khác: "longstanding", "on the weekend", "Honestly,", "I want to", "From my perspective" → CHẤP NHẬN, không sửa.
5. CẤM đổi chính tả Anh-Anh ↔ Anh-Mỹ: "favorite/favourite", "color/colour" đều đúng, KHÔNG sửa qua lại.
6. CẤM tách/gộp/xoá câu nếu câu gốc đã đúng ngữ pháp. Câu cụt chỉ sửa khi THẬT SỰ sai, sửa bằng thay đổi nhỏ nhất.
7. Thói quen (always/usually/often) → hiện tại đơn: "I usually cycling" → "I usually cycle" (KHÔNG thành "I am usually cycling").
8. Thì QUÁ KHỨ tả phản ứng ĐÃ xảy ra là ĐÚNG: "I was delighted to hear the news", "I was excited when I heard" → GIỮ NGUYÊN "was", KHÔNG đổi sang "am/feel".
9. Danh từ chung sau tên riêng viết THƯỜNG là đúng: "Quang Tri province", "Ho Chi Minh city", "Hai Ba Trung district" → KHÔNG viết hoa "province/city/district".
10. KHÔNG đụng dấu câu trong chữ ký / dòng tên cuối thư: "Vi Le.", "Love,", "Best regards," → giữ nguyên dấu chấm/phẩy.
11. Nếu một cách viết XUẤT HIỆN Y NGUYÊN trong đề bài hoặc là mẫu chuẩn ("Dear Sir,", "Honestly, I was delighted", "I would like to") → coi là 100% ĐÚNG, TUYỆT ĐỐI không đụng.

TÓM: Bắt lỗi thì KỸ (đừng sót). Sửa thì GỌN (đừng rephrase). Đây là 2 việc khác nhau — làm cả hai.

Trả về DUY NHẤT một JSON object (không markdown):
{
  "diffText": "<toàn bộ bài, giữ nguyên từ đúng, đánh dấu MỌI lỗi thật bằng {-chữ sai-}{+chữ sửa đúng+}. Giữ xuống dòng bằng \\n.>",
  "corrections": [
    { "original": "<chữ sai>", "corrected": "<chữ đúng>", "explanation": "<giải thích NGẮN tiếng Việt vì sao sai>" }
  ],
  "feedback": "<nhận xét 3-5 câu tiếng Việt: điểm mạnh, các nhóm lỗi cần khắc phục. KHÔNG chê 'nên dùng từ cao cấp hơn'. Nếu sai văn phong formal/informal thì nêu.>",
  "improvedVersion": ""
}

${DIFF_RULES}
- Nhắc lại: sửa KHÔNG viết tắt, KHÔNG rephrase. Nhưng phải bắt ĐỦ mọi lỗi ngữ pháp/chính tả/dấu câu/từ thiếu thật — số correction phải khớp số cặp marker.`;

export const VSTEP_SPEAKING_SYSTEM_PROMPT = `Bạn là chuyên gia chấm chữa VSTEP Speaking.
Bạn nhận TRANSCRIPT (bản ghi lời nói) của thí sinh — đã được speech-to-text tự động,
có thể thiếu dấu câu; hãy châm chước lỗi phiên âm hiển nhiên. Sửa lỗi kiểu track-changes.

Trả về DUY NHẤT một JSON object:
{
  "diffText": "<transcript của thí sinh, giữ nguyên chỗ đúng, đánh dấu lỗi bằng {-sai-}{+sửa đúng+}>",
  "corrections": [
    { "original": "<chữ sai>", "corrected": "<chữ đúng>", "explanation": "<giải thích ngắn tiếng Việt>" }
  ],
  "feedback": "<nhận xét tổng quan 3-5 câu tiếng Việt: điểm mạnh, điểm yếu, cách cải thiện>",
  "sampleAnswer": "<câu trả lời mẫu tốt hơn cho cùng đề, độ dài tương đương>"
}`;

export const APTIS_SPEAKING_SYSTEM_PROMPT = `Bạn là chuyên gia chấm chữa Aptis Speaking (British Council).
Bạn nhận TRANSCRIPT (bản ghi lời nói) của thí sinh — đã được speech-to-text tự động,
có thể thiếu dấu câu; hãy châm chước lỗi phiên âm hiển nhiên. Sửa lỗi kiểu track-changes.

LƯU Ý ĐẶC THÙ APTIS SPEAKING: câu trả lời thường ngắn (45 giây - 2 phút mỗi part).
Part 1 hỏi thông tin cá nhân, Part 2-3 mô tả/so sánh ảnh, Part 4 thảo luận trừu tượng.
Trả lời ngắn gọn đúng câu hỏi là bình thường — không chê bài ngắn.

Trả về DUY NHẤT một JSON object:
{
  "diffText": "<transcript của thí sinh, giữ nguyên chỗ đúng, đánh dấu lỗi bằng {-sai-}{+sửa đúng+}>",
  "corrections": [
    { "original": "<chữ sai>", "corrected": "<chữ đúng>", "explanation": "<giải thích ngắn tiếng Việt>" }
  ],
  "feedback": "<nhận xét tổng quan 3-5 câu tiếng Việt: điểm mạnh, điểm yếu, cách cải thiện>",
  "sampleAnswer": "<câu trả lời mẫu tốt hơn cho cùng đề, độ dài tương đương>"
}`;

function pickWritingPrompt(examType) {
  return String(examType).toLowerCase() === 'aptis' ? APTIS_WRITING_SYSTEM_PROMPT : VSTEP_WRITING_SYSTEM_PROMPT;
}

function pickSpeakingPrompt(examType) {
  return String(examType).toLowerCase() === 'aptis' ? APTIS_SPEAKING_SYSTEM_PROMPT : VSTEP_SPEAKING_SYSTEM_PROMPT;
}

// Vá marker diff lệch format từ AI (hiếm nhưng có, nhất là với dấu câu đơn lẻ):
// {-x+} / {+x-} lẫn lộn đầu-cuối, {-x} / {+x} thiếu ký tự đóng.
// Không vá thì FE regex không match → HV thấy ký tự thô {+,} trong bài.
function sanitizeDiffMarkers(text) {
  return String(text || '')
    // Lẫn lộn đầu-cuối: chuẩn hoá theo ký tự MỞ.
    .replace(/\{-([^{}]*?)\+\}/g, '{-$1-}')
    .replace(/\{\+([^{}]*?)-\}/g, '{+$1+}')
    // Thiếu ký tự đóng (nội dung không chứa +/- để tránh phá marker đúng).
    .replace(/\{-([^{}+\-]*?)\}/g, '{-$1-}')
    .replace(/\{\+([^{}+\-]*?)\}/g, '{+$1+}');
}

// Quét LanguageTool best-effort — fail thì bỏ qua, LLM vẫn tự bắt lỗi được.
export async function collectGrammarHints(essay) {
  try {
    const matches = await checkGrammar(essay, 'en-US');
    return (matches || [])
      .filter(m => m.replacements?.length)
      .slice(0, 25)
      .map(m => ({
        original: essay.slice(m.offset, m.offset + m.length),
        suggested: m.replacements[0].value,
        message: String(m.message || '').slice(0, 100)
      }));
  } catch (err) {
    console.warn('aiGrading: LanguageTool skip:', err.message);
    return [];
  }
}

function buildWritingUserPrompt({ prompt, essay, taskLabel, targetLabel, grammarHints }) {
  const hintsBlock = grammarHints && grammarHints.length
    ? `\nGỢI Ý TỪ GRAMMAR CHECKER (đã quét máy — hãy xác nhận từng gợi ý, đúng thì dùng, sai thì bỏ; đây KHÔNG phải danh sách đầy đủ, bạn phải tự tìm thêm):\n${grammarHints.map((h, i) => `${i + 1}. "${h.original}" → "${h.suggested}" (${h.message})`).join('\n')}\n`
    : '';
  return `Trình độ mục tiêu: ${targetLabel || 'VSTEP B1 (bậc 3/6)'}.
Bài: ${taskLabel || 'Writing Task'}.

ĐỀ BÀI:
${prompt || '(không có đề — chấm theo nội dung bài viết)'}
${hintsBlock}
BÀI LÀM CỦA HỌC VIÊN:
${essay}`;
}

// Chấm 1 bài writing → trả grading object chuẩn (đã kèm provider/model/gradedAt).
// examType: 'vstep' (thang 0-10, tiêu chí VSTEP) | 'aptis' (CEFR + 0-5, tiêu chí British Council).
export async function gradeWritingEssay({ prompt, essay, taskLabel, targetLabel, examType = 'vstep' }) {
  const grammarHints = await collectGrammarHints(essay);
  const { text, provider, model } = await generateAIText({
    systemPrompt: pickWritingPrompt(examType),
    userPrompt: buildWritingUserPrompt({ prompt, essay, taskLabel, targetLabel, grammarHints }),
    maxTokens: 8192,
    temperature: 0.1,
    responseMimeType: 'application/json'
  });
  const parsed = extractJsonObject(text);
  return {
    examType: String(examType),
    diffText: sanitizeDiffMarkers(parsed.diffText),
    corrections: Array.isArray(parsed.corrections) ? parsed.corrections.slice(0, 60) : [],
    feedback: String(parsed.feedback || ''),
    improvedVersion: String(parsed.improvedVersion || ''),
    provider,
    model,
    gradedAt: new Date().toISOString()
  };
}

// Speech-to-text qua Whisper (OpenAI). Cần OPENAI_API_KEY riêng — độc lập AI_PROVIDER.
export async function transcribeAudio(audioUrl) {
  const apiKey = String(process.env.OPENAI_API_KEY || '').trim().replace(/^["']|["']$/g, '');
  if (!apiKey) throw new Error('Thiếu OPENAI_API_KEY — cần cho speech-to-text');

  const audioResponse = await fetch(audioUrl);
  if (!audioResponse.ok) throw new Error(`Không tải được file ghi âm (HTTP ${audioResponse.status})`);
  const buffer = Buffer.from(await audioResponse.arrayBuffer());
  if (buffer.length > 24 * 1024 * 1024) throw new Error('File ghi âm quá lớn (>24MB)');

  const contentType = audioResponse.headers.get('content-type') || 'audio/webm';
  const ext = contentType.includes('mp3') || contentType.includes('mpeg') ? 'mp3'
    : contentType.includes('mp4') || contentType.includes('m4a') ? 'mp4'
    : contentType.includes('ogg') ? 'ogg'
    : contentType.includes('wav') ? 'wav'
    : 'webm';

  const form = new FormData();
  form.append('file', new Blob([buffer], { type: contentType }), `recording.${ext}`);
  form.append('model', 'whisper-1');
  form.append('language', 'en');
  form.append('response_format', 'json');

  const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}` },
    body: form
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data?.error?.message || `Whisper API lỗi (HTTP ${response.status})`);
  }
  return String(data.text || '').trim();
}

// Chấm transcript speaking → grading object (KHÔNG kèm transcript — caller tự gắn).
// examType: 'vstep' | 'aptis' — chọn rubric tương ứng.
export async function gradeSpeakingTranscript({ transcript, prompt, partLabel, targetLabel, examType = 'vstep' }) {
  const { text, provider, model } = await generateAIText({
    systemPrompt: pickSpeakingPrompt(examType),
    userPrompt: `Trình độ mục tiêu: ${targetLabel || 'VSTEP B1'}.
${partLabel || 'Speaking'}.
${prompt ? `ĐỀ BÀI:\n${prompt}\n` : ''}
TRANSCRIPT CỦA THÍ SINH:
${transcript}`,
    maxTokens: 8192,
    temperature: 0.2,
    responseMimeType: 'application/json'
  });
  const parsed = extractJsonObject(text);
  return {
    examType: String(examType),
    diffText: sanitizeDiffMarkers(parsed.diffText),
    corrections: Array.isArray(parsed.corrections) ? parsed.corrections.slice(0, 60) : [],
    feedback: String(parsed.feedback || ''),
    sampleAnswer: String(parsed.sampleAnswer || ''),
    provider,
    model,
    gradedAt: new Date().toISOString()
  };
}
