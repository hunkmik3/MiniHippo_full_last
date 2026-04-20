/* ═══════════════════════════════════════════════════════
   Buổi Học – Multi-session player
   Mỗi buổi có cấu trúc khác nhau, 1 câu / 1 trang
   ═══════════════════════════════════════════════════════ */

const urlParams = new URLSearchParams(window.location.search);
const REQUESTED_BAND = normalizeBand(urlParams.get('band') || '');
const SESSION = parseInt(urlParams.get('session')) || 1;
const CLASS_ID = urlParams.get('classId') || '';
const PREVIEW_MODE = urlParams.get('preview') === '1';
let ACTIVE_BAND = REQUESTED_BAND || 'B1';

let pages = [];       // Array of page objects: { type, render(), score() }
let currentPage = 0;
let userAnswers = {};  // Persistent answer storage
let timerSeconds = 25 * 60;
let timerInterval = null;
let audioPlaysLeft = {}; // Track plays per audio id
let ACTIVE_SESSION = null;

const SESSION_CONTENT_TYPE = 'session_content';
const SESSION_PREVIEW_STORAGE_PREFIX = '__minihippo_session_preview__';
const HOMEWORK_CLASS_TYPE = 'homework_class';

let ACCESS_CONTEXT = {
  user: null,
  classSet: null,
  sessionMeta: null,
  locked: false,
  lockReason: ''
};
let HOMEWORK_SUBMISSION_PROMISE = null;

function normalizeText(value) {
  return typeof value === 'string' ? value.trim().toLowerCase() : '';
}

function normalizeBand(value) {
  const band = normalizeText(value).toUpperCase();
  return band === 'B1' || band === 'B2' ? band : '';
}

function normalizeRole(value) {
  return typeof value === 'string' ? value.trim().toLowerCase() : '';
}

function isAdminUser(user) {
  return normalizeRole(user?.role) === 'admin';
}

function resolveToken() {
  if (typeof getAuthToken === 'function') {
    const token = getAuthToken();
    if (token) return token;
  }
  return (
    localStorage.getItem('auth_token') ||
    localStorage.getItem('access_token') ||
    sessionStorage.getItem('access_token') ||
    ''
  );
}

function buildAuthorizedHeaders(extra = {}) {
  const headers = { ...extra };
  const token = resolveToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  if (typeof buildDeviceHeaders === 'function') {
    return buildDeviceHeaders(headers);
  }
  return headers;
}

async function apiGet(url, retryWithRefresh = true) {
  const res = await fetch(url, {
    method: 'GET',
    headers: buildAuthorizedHeaders()
  });

  if (res.status === 401 && retryWithRefresh && typeof refreshAuthToken === 'function') {
    const refreshed = await refreshAuthToken();
    if (refreshed) return apiGet(url, false);
  }

  const payload = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(payload?.error || payload?.message || `HTTP ${res.status}`);
  }
  return payload;
}

function toDate(value) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date;
}

function getDateDistanceDays(a, b) {
  if (!a || !b) return 9999;
  return Math.abs(a.getTime() - b.getTime()) / (1000 * 60 * 60 * 24);
}

function scoreClassForBand(cls, band, user) {
  const data = cls?.data || {};
  const configuredBand = normalizeBand(data.band || data.band_code);
  if (configuredBand && configuredBand !== band) return -9999;

  const note = normalizeText(user?.notes);
  const title = normalizeText(cls?.title || data?.name || '');
  const firstDate = toDate(data.first_date);
  const startedOn = toDate(user?.startedOn || user?.started_on);
  const now = new Date();

  let score = 0;
  if (configuredBand === band) score += 90;
  if (!configuredBand) score += 20;
  if (note && title && note.includes(title)) score += 35;
  if (startedOn && firstDate && startedOn.toDateString() === firstDate.toDateString()) score += 40;
  if (startedOn && firstDate) score += Math.max(0, 20 - getDateDistanceDays(startedOn, firstDate));
  if (!startedOn && firstDate && firstDate <= now) score += 8;
  return score;
}

function pickClassForBand(classes, band, user) {
  const ranked = (classes || [])
    .map((cls) => ({ cls, score: scoreClassForBand(cls, band, user) }))
    .filter((entry) => entry.score > -9999)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      const ta = new Date(a.cls?.updated_at || a.cls?.created_at || 0).getTime();
      const tb = new Date(b.cls?.updated_at || b.cls?.created_at || 0).getTime();
      return tb - ta;
    });

  return ranked[0]?.cls || null;
}

function resolveSessionMeta(classSet, sessionNumber) {
  const sessions = Array.isArray(classSet?.data?.sessions) ? classSet.data.sessions : [];
  return sessions.find((session) => Number(session?.number) === Number(sessionNumber)) || null;
}

function formatDateTimeVi(date) {
  if (!date) return '';
  return date.toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function renderAccessDenied(message) {
  const pageContainer = document.getElementById('pageContent');
  const nav = document.getElementById('navigator');
  const timerLabel = document.querySelector('.time-remaining-label');
  const timer = document.getElementById('countdownTimer');
  const step = document.getElementById('step-label');
  if (pageContainer) {
    pageContainer.innerHTML = `
      <div class="question-card">
        <h3 class="fw-bold text-danger mb-3">Không thể truy cập buổi học</h3>
        <p class="mb-0">${esc(message || 'Buổi học đã bị khóa.')}</p>
      </div>
    `;
  }
  if (nav) nav.style.display = 'none';
  if (timerLabel) timerLabel.style.display = 'none';
  if (timer) timer.style.display = 'none';
  if (step) step.textContent = 'Bị khóa';
}

async function resolveAccessContext() {
  if (PREVIEW_MODE) {
    ACCESS_CONTEXT = {
      user: null,
      classSet: null,
      sessionMeta: null,
      locked: false,
      lockReason: ''
    };
    return ACCESS_CONTEXT;
  }

  const authOk = typeof checkAuth === 'function' ? await checkAuth() : true;
  if (!authOk) {
    ACCESS_CONTEXT = { user: null, classSet: null, sessionMeta: null, locked: true, lockReason: 'Bạn cần đăng nhập lại.' };
    return ACCESS_CONTEXT;
  }

  const user = typeof getCurrentUser === 'function' ? getCurrentUser() : null;
  const isAdmin = isAdminUser(user);
  const course = normalizeText(user?.course);
  const userBand = normalizeBand(user?.band);

  if (isAdmin) {
    const adminBand = normalizeBand(REQUESTED_BAND || userBand || ACTIVE_BAND || 'B1') || 'B1';
    ACTIVE_BAND = adminBand;

    let classes = [];
    try {
      const data = await apiGet(`/api/practice_sets/list?type=${HOMEWORK_CLASS_TYPE}`);
      classes = Array.isArray(data?.sets) ? data.sets : [];
    } catch (error) {
      console.warn('Load homework classes failed for admin:', error);
    }

    let classSet = null;
    if (CLASS_ID) {
      classSet = classes.find((item) => String(item?.id) === String(CLASS_ID)) || null;
    }
    if (!classSet) {
      classSet = pickClassForBand(classes, adminBand, user);
    }

    ACCESS_CONTEXT = {
      user,
      classSet,
      sessionMeta: resolveSessionMeta(classSet, SESSION),
      locked: false,
      lockReason: ''
    };
    return ACCESS_CONTEXT;
  }

  if (course === 'lớp ôn thi') {
    window.location.replace('home.html');
    ACCESS_CONTEXT = { user, classSet: null, sessionMeta: null, locked: true, lockReason: 'Tài khoản này dùng giao diện ôn thi.' };
    return ACCESS_CONTEXT;
  }

  if (course !== 'lớp học') {
    window.location.replace('home.html');
    ACCESS_CONTEXT = { user, classSet: null, sessionMeta: null, locked: true, lockReason: 'Tài khoản này không thuộc module lớp học.' };
    return ACCESS_CONTEXT;
  }

  if (!userBand) {
    ACCESS_CONTEXT = {
      user,
      classSet: null,
      sessionMeta: null,
      locked: true,
      lockReason: 'Tài khoản lớp học chưa được gán band (B1/B2).'
    };
    return ACCESS_CONTEXT;
  }

  if (REQUESTED_BAND && REQUESTED_BAND !== userBand) {
    window.location.replace('lop_hoc.html');
    ACCESS_CONTEXT = {
      user,
      classSet: null,
      sessionMeta: null,
      locked: true,
      lockReason: `Bạn thuộc band ${userBand}, không thể truy cập band ${REQUESTED_BAND}.`
    };
    return ACCESS_CONTEXT;
  }

  ACTIVE_BAND = userBand;

  let classes = [];
  try {
    const data = await apiGet(`/api/practice_sets/list?type=${HOMEWORK_CLASS_TYPE}`);
    classes = Array.isArray(data?.sets) ? data.sets : [];
  } catch (error) {
    console.warn('Load homework classes failed:', error);
  }

  let classSet = null;
  if (CLASS_ID) {
    classSet = classes.find((item) => String(item?.id) === String(CLASS_ID)) || null;
  }
  if (!classSet) {
    classSet = pickClassForBand(classes, normalizeBand(ACTIVE_BAND), user);
  }

  const sessionMeta = resolveSessionMeta(classSet, SESSION);
  const deadline = toDate(sessionMeta?.deadline);
  const now = Date.now();
  const locked = !!deadline && now > deadline.getTime();
  const lockReason = locked
    ? `Buổi ${SESSION} đã quá deadline (${formatDateTimeVi(deadline)}).`
    : '';

  ACCESS_CONTEXT = {
    user,
    classSet,
    sessionMeta,
    locked,
    lockReason
  };

  return ACCESS_CONTEXT;
}

function ensureSessionUnlockedOrNotify() {
  if (!ACCESS_CONTEXT?.locked) return true;
  renderAccessDenied(ACCESS_CONTEXT.lockReason || `Buổi ${SESSION} đã quá deadline.`);
  return false;
}

function buildHomeworkPayload(totalCorrect = 0, totalQuestions = 0) {
  const classSet = ACCESS_CONTEXT?.classSet;
  if (!classSet?.id) return null;
  return {
    practiceType: 'homework',
    mode: 'session',
    setId: classSet.id,
    setTitle: classSet.title || classSet?.data?.name || `Lớp ${ACTIVE_BAND}`,
    totalScore: Math.max(0, Number(totalCorrect) || 0),
    maxScore: Math.max(0, Number(totalQuestions) || 0),
    durationSeconds: Math.max(0, Math.round(((ACTIVE_SESSION?.timer || 25) * 60 - timerSeconds))),
    metadata: {
      submission_kind: 'homework',
      class_id: classSet.id,
      class_title: classSet.title || classSet?.data?.name || '',
      session_key: `${ACTIVE_BAND}-${SESSION}`,
      session_number: SESSION,
      band: ACTIVE_BAND,
      homework_submitted_at: new Date().toISOString()
    }
  };
}

function submitHomeworkResultIfNeeded(totalCorrect = 0, totalQuestions = 0) {
  if (PREVIEW_MODE) return Promise.resolve(false);
  if (HOMEWORK_SUBMISSION_PROMISE) return HOMEWORK_SUBMISSION_PROMISE;
  if (ACCESS_CONTEXT?.locked) return Promise.resolve(false);

  const payload = buildHomeworkPayload(totalCorrect, totalQuestions);
  if (!payload) return Promise.resolve(false);

  HOMEWORK_SUBMISSION_PROMISE = (async () => {
    try {
      const token = resolveToken();
      const response = await fetch('/api/practice_results/submit', {
        method: 'POST',
        headers: buildAuthorizedHeaders({
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }),
        body: JSON.stringify(payload)
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data?.error || 'Không thể lưu trạng thái nộp bài BTVN');
      }
      return true;
    } catch (error) {
      console.warn('Submit homework status failed:', error);
      return false;
    }
  })();

  return HOMEWORK_SUBMISSION_PROMISE;
}

/* ═══════════════════════════════════════════════════════
   SESSION DATA
   ═══════════════════════════════════════════════════════ */

const SESSIONS = {};

// ── Buổi 1: Grammar + Vocabulary ──
SESSIONS['B1-1'] = {
  timer: 25,
  buildPages: function (data) {
    const p = [];
    // 24 grammar pages
    data.grammar.forEach((item, i) => {
      p.push({ type: 'grammar', idx: i, data: item });
    });
    // 4 vocab part pages
    ['part1', 'part2', 'part3', 'part4'].forEach((pk, i) => {
      p.push({ type: 'vocab', partKey: pk, partNum: i + 1, data: data.vocab[pk] });
    });
    return p;
  },
  data: {
    grammar: [
      { q: "Look! It _____ outside.", options: ["rain", "is raining", "rains"], answer: "is raining" },
      { q: "She _____ to school every day.", options: ["go", "goes", "going"], answer: "goes" },
      { q: "They _____ lunch at 12 o'clock yesterday.", options: ["have", "had", "has"], answer: "had" },
      { q: "I _____ my homework yet.", options: ["haven't finished", "didn't finish", "don't finish"], answer: "haven't finished" },
      { q: "He _____ English since 2020.", options: ["studies", "has studied", "studied"], answer: "has studied" },
      { q: "We _____ to the cinema tonight.", options: ["are going", "go", "went"], answer: "are going" },
      { q: "If it _____, we will stay home.", options: ["rain", "rains", "rained"], answer: "rains" },
      { q: "The book _____ by millions of people.", options: ["has read", "has been read", "is reading"], answer: "has been read" },
      { q: "She asked me where I _____.", options: ["live", "lived", "am living"], answer: "lived" },
      { q: "I wish I _____ more time.", options: ["have", "had", "has"], answer: "had" },
      { q: "He is _____ tallest boy in the class.", options: ["a", "an", "the"], answer: "the" },
      { q: "This is the book _____ I told you about.", options: ["which", "who", "where"], answer: "which" },
      { q: "You _____ smoke in the hospital.", options: ["mustn't", "don't have to", "needn't"], answer: "mustn't" },
      { q: "She _____ her keys. She can't find them.", options: ["has lost", "lost", "loses"], answer: "has lost" },
      { q: "The train _____ at 9 AM tomorrow.", options: ["leave", "leaves", "is leaving"], answer: "leaves" },
      { q: "I'm not used to _____ up early.", options: ["get", "getting", "got"], answer: "getting" },
      { q: "He suggested _____ a taxi.", options: ["take", "to take", "taking"], answer: "taking" },
      { q: "By next year, I _____ here for 10 years.", options: ["will work", "will have worked", "am working"], answer: "will have worked" },
      { q: "The children were _____ tired to continue.", options: ["too", "enough", "so"], answer: "too" },
      { q: "Neither Tom _____ Mary came to the party.", options: ["or", "nor", "and"], answer: "nor" },
      { q: "I'd rather you _____ here.", options: ["stay", "stayed", "staying"], answer: "stayed" },
      { q: "_____ you mind opening the window?", options: ["Do", "Would", "Could"], answer: "Would" },
      { q: "She speaks English _____ than her sister.", options: ["more fluently", "most fluently", "fluently"], answer: "more fluently" },
      { q: "He _____ working when I arrived.", options: ["is", "was", "has been"], answer: "was" }
    ],
    vocab: {
      part1: {
        title: "DẠNG 1", instruction: "Write the letter (A-K) of the word that is most similar in meaning to a word on the left (1-5).",
        instructionVi: "Viết chữ cái (A-K) của từ có nghĩa tương tự nhất với từ ở bên trái (1-5).",
        example: { word: "Create", answer: "C", answerWord: "make" },
        words: [
          { num: 1, word: "choose", answer: "D" }, { num: 2, word: "close", answer: "F" },
          { num: 3, word: "improve", answer: "J" }, { num: 4, word: "care", answer: "B" },
          { num: 5, word: "practice", answer: "A" }
        ],
        options: [
          { letter: "A", word: "train" }, { letter: "B", word: "look after" }, { letter: "C", word: "make" },
          { letter: "D", word: "decide" }, { letter: "E", word: "take" }, { letter: "F", word: "shut" },
          { letter: "G", word: "propose" }, { letter: "H", word: "believe" }, { letter: "J", word: "develop" },
          { letter: "K", word: "worry" }
        ]
      },
      part2: {
        title: "DẠNG 2", instruction: "Finish each sentence (6-10) using a word from the list (A-K).",
        instructionVi: "Hoàn thành mỗi câu (6-10) bằng cách sử dụng một từ từ danh sách (A-K).",
        sentences: [
          { num: 6, text: "To oppose someone is to...", answer: "B" }, { num: 7, text: "To teach someone is to...", answer: "C" },
          { num: 8, text: "To accept something is to...", answer: "K" }, { num: 9, text: "To get something is to...", answer: "F" },
          { num: 10, text: "To pay someone is to...", answer: "H" }
        ],
        options: [
          { letter: "A", word: "concern" }, { letter: "B", word: "challenge" }, { letter: "C", word: "instruct" },
          { letter: "D", word: "appear" }, { letter: "E", word: "worry" }, { letter: "F", word: "obtain" },
          { letter: "G", word: "wish" }, { letter: "H", word: "compensate" }, { letter: "J", word: "assume" },
          { letter: "K", word: "approve" }
        ]
      },
      part3: {
        title: "DẠNG 3", instruction: "Finish each sentence (16-20) using a word from the list (A-K).",
        instructionVi: "Hoàn thành mỗi câu (16-20) bằng cách sử dụng một từ từ danh sách (A-K).",
        sentences: [
          { num: 11, before: "He had to walk down a long dark", after: "to get to his room.", answer: "D" },
          { num: 12, before: "The teacher should maintain", after: "in the classroom to make the lesson effective.", answer: "E" },
          { num: 13, before: "She opened the", after: "and took a coat out of it.", answer: "K" },
          { num: 14, before: "You should cut your", after: "regularly otherwise your hair will get in your eyes.", answer: "G" },
          { num: 15, before: "The local", after: "has an exhibit about the history of this area.", answer: "J" }
        ],
        options: [
          { letter: "A", word: "atmosphere" }, { letter: "B", word: "canteen" }, { letter: "C", word: "ceiling" },
          { letter: "D", word: "corridor" }, { letter: "E", word: "discipline" }, { letter: "F", word: "envelope" },
          { letter: "G", word: "fringe" }, { letter: "H", word: "hedge" }, { letter: "J", word: "museum" },
          { letter: "K", word: "wardrobe" }
        ]
      },
      part4: {
        title: "DẠNG 4", instruction: "Write the letter of the word on the right (A-K) that is most often used with a word on the left (21-25).",
        instructionVi: "Viết chữ cái của từ ở bên phải (A-K) mà thường được sử dụng cùng với từ ở bên trái (21-25).",
        words: [
          { num: 16, word: "abstract", answer: "F" }, { num: 17, word: "athletics", answer: "B" },
          { num: 18, word: "congested", answer: "G" }, { num: 19, word: "frantic", answer: "H" },
          { num: 20, word: "housework", answer: "K" }
        ],
        options: [
          { letter: "A", word: "clean" }, { letter: "B", word: "club" }, { letter: "C", word: "efforts" },
          { letter: "D", word: "food" }, { letter: "E", word: "friends" }, { letter: "F", word: "painting" },
          { letter: "G", word: "roads" }, { letter: "H", word: "speed" }, { letter: "J", word: "status" },
          { letter: "K", word: "task" }
        ]
      }
    }
  }
};

// ── Buổi 2: Listening (Part 1: 13 câu, Part 2: 1 câu) ──
SESSIONS['B1-2'] = {
  timer: 25,
  buildPages: function (data) {
    const p = [];
    // Part 1: 13 individual listening questions
    data.part1.forEach((item, i) => {
      p.push({ type: 'listening-q', idx: i, partLabel: 'Part 1', data: item, totalInPart: data.part1.length });
    });
    // Part 2: 1 page with topic + 4 persons
    p.push({ type: 'listening-topic', idx: 0, partLabel: 'Part 2', data: data.part2 });
    return p;
  },
  data: {
    part1: [
      { q: "What does her sister drink?", options: ["Tea", "Water", "Coffee"], answer: "Tea", audio: "audio/listening/b1_s2_p1_q1.mp3" },
      { q: "Where is the library?", options: ["Next to the bank", "Opposite the park", "Behind the school"], answer: "Opposite the park", audio: "audio/listening/b1_s2_p1_q2.mp3" },
      { q: "What time does the train leave?", options: ["8:15", "8:30", "8:45"], answer: "8:30", audio: "audio/listening/b1_s2_p1_q3.mp3" },
      { q: "How much does the ticket cost?", options: ["$15", "$20", "$25"], answer: "$20", audio: "audio/listening/b1_s2_p1_q4.mp3" },
      { q: "What is the man's job?", options: ["Teacher", "Doctor", "Engineer"], answer: "Doctor", audio: "audio/listening/b1_s2_p1_q5.mp3" },
      { q: "Which sport does she prefer?", options: ["Swimming", "Tennis", "Running"], answer: "Tennis", audio: "audio/listening/b1_s2_p1_q6.mp3" },
      { q: "What did he buy?", options: ["A book", "A pen", "A bag"], answer: "A bag", audio: "audio/listening/b1_s2_p1_q7.mp3" },
      { q: "When is the meeting?", options: ["Monday", "Wednesday", "Friday"], answer: "Wednesday", audio: "audio/listening/b1_s2_p1_q8.mp3" },
      { q: "How does she get to work?", options: ["By bus", "By car", "On foot"], answer: "By bus", audio: "audio/listening/b1_s2_p1_q9.mp3" },
      { q: "What colour is the new car?", options: ["Red", "Blue", "White"], answer: "Blue", audio: "audio/listening/b1_s2_p1_q10.mp3" },
      { q: "Where are they going on holiday?", options: ["France", "Spain", "Italy"], answer: "Spain", audio: "audio/listening/b1_s2_p1_q11.mp3" },
      { q: "What does she want to eat?", options: ["Pizza", "Salad", "Pasta"], answer: "Salad", audio: "audio/listening/b1_s2_p1_q12.mp3" },
      { q: "How many people are coming?", options: ["Three", "Five", "Seven"], answer: "Five", audio: "audio/listening/b1_s2_p1_q13.mp3" }
    ],
    part2: {
      topic: "A PLACE FOR STUDYING",
      instruction: "Four people are discussing their views on the topic above. Complete the sentences. Use each answer only once. You will not need two of the answers.",
      audio: "audio/listening/b1_s2_p2.mp3",
      persons: ["Person 1", "Person 2", "Person 3", "Person 4"],
      options: [
        "prefers studying in the library because it's quiet",
        "likes studying at home with music",
        "thinks coffee shops are the best place",
        "studies best in a group at school",
        "prefers studying outdoors in the park",
        "can only focus in complete silence"
      ],
      answers: [0, 2, 3, 1] // index into options
    }
  }
};

// ── Buổi 3: Key Reading (Part 1: gap-fill, Part 2: ordering, Part 3: paragraph matching) ──
SESSIONS['B1-3'] = {
  timer: 30,
  buildPages: function (data) {
    const p = [];
    // Part 1: 2 câu (mỗi câu = 1 trang, mỗi câu có nhiều gap-fill rows)
    data.part1.forEach((item, i) => {
      p.push({ type: 'reading-gap', idx: i, data: item, totalInPart: data.part1.length });
    });
    // Part 2: 2 câu ordering (mỗi câu = 1 trang)
    data.part2.forEach((item, i) => {
      p.push({ type: 'reading-order', idx: i, data: item, totalInPart: data.part2.length });
    });
    // Part 3: 2 câu paragraph matching (mỗi câu = 1 trang)
    data.part3.forEach((item, i) => {
      p.push({ type: 'reading-match', idx: i, data: item, totalInPart: data.part3.length });
    });
    return p;
  },
  data: {
    part1: [
      {
        intro: "Hey Lewis,",
        instruction: "Choose the word that fits in the gap. The first one is done for you.",
        rows: [
          { before: "Don't have too much", after: "because we're going to eat cake.", options: ["lunch", "dinner", "breakfast"], answer: "lunch" },
          { before: "I imagine you don't want to", after: "this.", options: ["miss", "lose", "forget"], answer: "miss" },
          { before: "Can you be", after: "before 7pm?", options: ["here", "there", "ready"], answer: "here" },
          { before: "I", after: "you earlier but you were not home.", options: ["called", "told", "met"], answer: "called" },
          { before: "I can", after: "you at your place then.", options: ["meet", "see", "visit"], answer: "meet" }
        ],
        closing: "Love,\nHelen"
      },
      {
        intro: "Dear Mr. Thompson,",
        instruction: "Choose the word that fits in the gap.",
        rows: [
          { before: "I am writing to", after: "about a problem.", options: ["complain", "explain", "ask"], answer: "complain" },
          { before: "The product I", after: "last week was damaged.", options: ["bought", "sold", "sent"], answer: "bought" },
          { before: "I would like a full", after: "as soon as possible.", options: ["refund", "answer", "report"], answer: "refund" },
          { before: "Please", after: "me at this email address.", options: ["contact", "call", "write"], answer: "contact" },
          { before: "I look forward to your", after: ".", options: ["reply", "answer", "letter"], answer: "reply" }
        ],
        closing: "Yours sincerely,\nJane Smith"
      }
    ],
    part2: [
      {
        topic: "My first car",
        sentences: [
          "I have just passed the test, and I am the proud owner of the driving license.",
          "However, I did not have a car and my parents would not let me drive theirs.",
          "So, when I saw an advertisement in the local newspaper for a cheap second-hand car, I did not waste time.",
          "I called the number in that advert and arranged a meeting to meet the owner on the other side of the town.",
          "We agreed on a price and when I handed over the money, he gave me the keys."
        ]
      },
      {
        topic: "A school trip",
        sentences: [
          "Last month, our teacher announced that we would go on a trip to the science museum.",
          "We were all very excited and couldn't wait for the day to come.",
          "On the morning of the trip, we gathered at the school gate and boarded the bus.",
          "At the museum, we saw many interesting exhibits about space and technology.",
          "By the end of the day, everyone agreed it was the best school trip ever."
        ]
      }
    ],
    part3: [
      {
        topic: "Opinions on flying",
        paragraphs: {
          A: "I have a dream that I work as a tour guide. So I understand that I will have to fly to other countries. In my personal opinion, airplanes are currently too cheap compared to the damage they cause to the environment, so I believe we should add taxes to airline ticket prices to make people choose to use other means of transport before they think about flying.",
          B: "My family and siblings live quite far from me. So I often have to fly to visit them every month when I have time. We really appreciate the time we spend together. I know that traveling by plane too much is not good for the environment so I often shop online or go to work by bike instead of going by car.",
          C: "I was a businessman so I had to fly many times a week. I had to go to other countries to be able to sign wine trading contracts with them. I feel very tired every time I have to fly. Now, my sister and I, whenever we have free time, take the train together and we enjoy that time very much because I can travel while sightseeing and relax without any stress.",
          D: "If I have to go somewhere I will choose other means of public transport, not the plane. Every time I go on a plane I feel extremely tired and I just hope time passes quickly so I can get off that plane. However, due to the specific nature of my job, I have to film in many different locations, so sometimes I cannot avoid having to take this public transportation."
        },
        questions: [
          { prompt: "suggest making flights more expensive", answer: "A" },
          { prompt: "want to work in other countries", answer: "A" },
          { prompt: "visit relatives regularly", answer: "B" },
          { prompt: "try to protect the environment", answer: "B" },
          { prompt: "like relaxing while they travel", answer: "C" },
          { prompt: "find flying tiring", answer: "D" },
          { prompt: "need to fly for their work", answer: "C" }
        ]
      },
      {
        topic: "Hobbies and free time",
        paragraphs: {
          A: "I love painting in my free time. It helps me relax after a long day at work. I usually paint landscapes and sometimes portraits of my friends.",
          B: "Reading is my favourite hobby. I can spend hours in a bookshop looking for new novels. I particularly enjoy mystery and science fiction books.",
          C: "I enjoy cooking different dishes from around the world. Last week I tried making Thai food and it turned out really well. My family loved it.",
          D: "Playing football with my friends every weekend is what I look forward to most. We have a small team and sometimes we compete against other groups in the neighbourhood."
        },
        questions: [
          { prompt: "enjoys creative activities", answer: "A" },
          { prompt: "likes competitive sports", answer: "D" },
          { prompt: "spends time in shops", answer: "B" },
          { prompt: "tries international food", answer: "C" },
          { prompt: "does activities with family", answer: "C" }
        ]
      }
    ]
  }
};

// ── Buổi 9: Reading mixed (Part 1: 2 trang, Part 2: 3 trang, Part 3: 2 trang) ──
SESSIONS['B1-9'] = {
  timer: 35,
  buildPages: function (data) {
    const p = [];
    data.part1.forEach((item, i) => {
      p.push({ type: 'reading-gap', idx: i, data: item, totalInPart: data.part1.length, partTitle: 'Part 1' });
    });
    data.part2.forEach((item, i) => {
      p.push({ type: 'reading-order', idx: i, data: item, totalInPart: data.part2.length, partTitle: 'Part 2' });
    });
    data.part3.forEach((item, i) => {
      p.push({ type: 'reading-match', idx: i, data: item, totalInPart: data.part3.length, partTitle: 'Part 3' });
    });
    return p;
  },
  data: {
    part1: [
      {
        instruction: "Choose the word that fits in the gap. The first one is done for you.",
        rows: [
          { before: "Don’t have too much", after: "because we’re going to eat cake.", options: ["dinner", "pencil", "talk"], answer: "dinner" },
          { before: "I imagine you don’t want to", after: "this.", options: ["miss", "remember", "love"], answer: "miss" },
          { before: "Can you be", after: "before 7pm?", options: ["ready", "early", "sleepy"], answer: "ready" },
          { before: "I", after: "you earlier but you were not home.", options: ["told", "called", "said"], answer: "called" },
          { before: "I can", after: "you at your place then.", options: ["hold", "miss", "meet"], answer: "meet" }
        ]
      },
      {
        instruction: "Choose the word that fits in the gap. The first one is done for you.",
        rows: [
          { before: "I always", after: "dinner for myself.", options: ["cook", "drink", "breathe"], answer: "cook" },
          { before: "In the mornings, I attend", after: ".", options: ["dinner", "meetings", "breakfast"], answer: "meetings" },
          { before: "I buy food from the", after: ".", options: ["shop", "car", "window"], answer: "shop" },
          { before: "I eat lunch in the", after: ".", options: ["city", "village", "park"], answer: "park" },
          { before: "I am never", after: "for work.", options: ["late", "soon", "early"], answer: "late" }
        ]
      }
    ],
    part2: [
      {
        topic: "My first car",
        sentences: [
          "I have just passed the test, and I am the proud owner of the driving license",
          "However, I did not have a car and my parents would not let me drive theirs",
          "So, when I saw an advertisement in the local newspaper for a cheap second-hand car, I did not waste time",
          "I called the number in that advert and arranged a meeting to meet the owner on the other side of the town",
          "We agreed on a price and when I handed over the money, he gave me the keys."
        ]
      },
      {
        topic: "Enter the conference hall 3",
        sentences: [
          "Go to security desk",
          "Show confirming letter to security guard",
          "After security check, you receive visitor's pass",
          "Enter the conference",
          "You can welcome…"
        ]
      },
      {
        topic: "Enter the conference hall 2",
        sentences: [
          "When you collect you pack, go to the lifts on the right",
          "Take the lift to the third floor and go to the main desk",
          "Show your pass from the conference pack to a member of staff at the desk",
          "He or she will tell you your seat number for the talk at the main hall",
          "Once you are in the hall, someone will help you find your seat"
        ]
      }
    ],
    part3: [
      {
        topic: "Opinions on flying",
        paragraphs: {
          A: "I have a dream that I work as a tour guide. So I understand that I will have to fly to other countries. In my personal opinion, airplanes are currently too cheap compared to the damage they cause to the environment, so I believe we should add taxes to airline ticket prices to make people choose to use other means of transport before they think about flying. I believe that people are also very happy when they can contribute to protecting the environment.",
          B: "My family and siblings live quite far from me. So I often have to fly to visit them every month when I have time. We really appreciate the time we spend together and we are happy to be able to meet each other and share our new story. I know that traveling by plane too much is not good for the environment so I often shop online or go to work by bike instead of going by car or I reuse plastic bags and paper bags. In addition, I sometimes volunteer to clean up trash in the neighborhood.",
          C: "I was a businessman so I had to fly many times a week. I had to go to other countries to be able to sign wine trading contracts with them. I feel very tired every time I have to fly. Now, my sister and I, whenever we have free time, take the train together and we enjoy that time very much because I can travel while sightseeing and relax without any stress.",
          D: "If I have to go somewhere I will choose other means of public transport, not the plane. Every time I go on a plane I feel extremely tired and I just hope time passes quickly so I can get off that plane. However, due to the specific nature of my job, I have to film in many different locations, so sometimes I cannot avoid having to take this public transportation."
        },
        questions: [
          { prompt: "suggest making flights more expensive", answer: "A" },
          { prompt: "want to work in other countries", answer: "A" },
          { prompt: "visit relatives regularly", answer: "B" },
          { prompt: "try to protect the environment", answer: "B" },
          { prompt: "like relaxing while they travel", answer: "C" },
          { prompt: "find flying tiring", answer: "D" },
          { prompt: "need to fly for their work", answer: "D" }
        ]
      },
      {
        topic: "Reading habits",
        paragraphs: {
          A: "My wife often complains about not having time to read, and I say we have to make our own time. So, I often calculate my free time on my phone. so I can know in advance whether I should bring a book to read on the train. My wife often laughs at me for doing so, but I don't mind, as long as I can finish reading so many books.",
          B: "I used to struggle very much to finish reading a book that we were expected to read. However, now that I read for my own pleasure, I don't mind too much. I usually don't limit myself to reading one at a time. There are so many titles I can choose from that get me excited. I have a list of books that I want to read in the future.",
          C: "I often keep a book on the bedside table to read before going to bed. The problem is, I get tired after reading only half of a page, and I fall asleep. So, I've been reading that one book for half a year now and have only read chapter 2. However, when I read factual books, I find it very interesting and it keeps me awake for hours.",
          D: "My job requires reading a lot of books. These books include a lot of facts and figures and they are very boring. When I have free time, I usually want to read light books, like mystery novels or comedy. I often read on the train to work. I have a young child, so when I come home I almost don't have time to read. Therefore, I have to read books when traveling by train. So, a book can last me 1 week."
        },
        questions: [
          { prompt: "plans their reading schedule", answer: "A" },
          { prompt: "reads more than another family member", answer: "A" },
          { prompt: "reads many books at once", answer: "B" },
          { prompt: "wants to read a lot of books", answer: "B" },
          { prompt: "is having difficulty in finishing a book", answer: "C" },
          { prompt: "thinks that factual books are boring", answer: "D" },
          { prompt: "has limited time to read books", answer: "D" }
        ]
      }
    ]
  }
};

// ── Buổi 12: giống buổi 9 (Reading 3 parts) ──
SESSIONS['B1-12'] = {
  timer: SESSIONS['B1-9'].timer,
  buildPages: SESSIONS['B1-9'].buildPages,
  data: JSON.parse(JSON.stringify(SESSIONS['B1-9'].data))
};

// ── Buổi 10: Writing (Part 1: 5 câu ngắn + Part 4: 1 email) – giống buổi 4 nhưng gọn hơn ──
SESSIONS['B1-10'] = {
  timer: 40,
  buildPages: function (data) {
    return [
      { type: 'writing-short', data: data.part1 },
      { type: 'writing-email', data: data.part4 }
    ];
  },
  data: {
    part1: {
      topic: "WALKING CLUB",
      topicInstruction: "You are joining a WALKING CLUB. Fill out the form. Write short answers (1-10 words) for each message (5 questions).",
      questions: [
        { key: "q10_1_1", prompt: "1. Where do you usually go for a walk?" },
        { key: "q10_1_2", prompt: "2. Who do you usually walk with?" },
        { key: "q10_1_3", prompt: "3. How often do you go walking?" },
        { key: "q10_1_4", prompt: "4. What do you enjoy about walking?" },
        { key: "q10_1_5", prompt: "5. What is the best place for walking near your home?" }
      ]
    },
    part4: {
      topic: "WALKING CLUB",
      topicInstruction: "Write an email (120-225 words) to the president of the club.",
      contextText: "\"As the members of the club know, the club will organize a 2-week walking tour through countries in Europe. Some members' opinions differ on this issue. What do you think? Give your opinion or suggestion about this plan.\"",
      emails: [
        {
          key: "q10_4_1",
          label: "Write an email to the president of the club. Tell them your thoughts about this and what you would like to do.",
          minWords: 120,
          maxWords: 225,
          rows: 10
        }
      ]
    }
  }
};

// ── Buổi 11: Writing - 2 cụm Describe image + follow-up ──
SESSIONS['B1-11'] = {
  timer: 45,
  buildPages: function (data) {
    const p = [];
    data.sets.forEach((set, si) => {
      p.push({
        type: 'writing-describe-image',
        data: set,
        setIdx: si,
        totalSets: data.sets.length
      });
      if (set.followUps && set.followUps.length) {
        p.push({
          type: 'writing-followup',
          data: set,
          setIdx: si,
          totalSets: data.sets.length
        });
      }
    });
    return p;
  },
  data: {
    sets: [
      {
        image: "images/speaking/part2/1773833109847_0d183092-70ae-4143-b2e0-5fd4ce6cc71d.jpeg",
        mainQuestion: { key: "q11_1", prompt: "1. Describe this picture:", minWords: 30, maxWords: 80 },
        followUps: [
          { key: "q11_2", prompt: "2. How do children go to school in your country?", minWords: 20, maxWords: 60 },
          { key: "q11_3", prompt: "3. Is it common to live far from school in your country?", minWords: 20, maxWords: 60 }
        ]
      },
      {
        images: [
          "images/speaking/part3/de01_1.png",
          "images/speaking/part3/de01_2.png"
        ],
        mainQuestion: { key: "q11_4", prompt: "1. Describe the two pictures:", minWords: 30, maxWords: 90 },
        followUps: [
          { key: "q11_5", prompt: "2. Do you prefer reading newspapers or playing video games?", minWords: 20, maxWords: 60 },
          { key: "q11_6", prompt: "3. What are benefits of reading?", minWords: 20, maxWords: 60 }
        ]
      }
    ]
  }
};

// ── Buổi 4: Writing (Part 1: 5 câu ngắn, Part 4: 2 emails) + AI sửa lỗi ──
SESSIONS['B1-4'] = {
  timer: 50,
  buildPages: function (data) {
    return [
      { type: 'writing-short', data: data.part1 },
      { type: 'writing-email', data: data.part4 },
      // Results page is auto-appended
    ];
  },
  data: {
    part1: {
      topic: "TRAVEL CLUB",
      topicInstruction: "You are joining a TRAVEL CLUB. Fill out the form. Write short answers (1-10 words) for each message (5 questions).",
      questions: [
        { key: "q1_1", prompt: "1. What country would you like to visit?" },
        { key: "q1_2", prompt: "2. Who do you usually travel with?" },
        { key: "q1_3", prompt: "3. What do you always take on holiday?" },
        { key: "q1_4", prompt: "4. How often do you travel?" },
        { key: "q1_5", prompt: "5. What kind of transport do you prefer?" }
      ]
    },
    part4: {
      topic: "TRAVEL CLUB",
      topicInstruction: "Write a short email (about 50-75 words) to your friend, and a longer email (120-225 words) to the president of the club.",
      contextText: "\"Dear members, Our club is planning to encourage tourists to visit an area. We also want visitors coming to our areas to behave politely. Please raise your voice and give some suggestions for this plan.\"",
      emails: [
        {
          key: "q4_1",
          label: "Write a short email to your friend. Tell your friend your feelings about this and what you plan to do.",
          minWords: 50,
          maxWords: 75,
          rows: 6
        },
        {
          key: "q4_2",
          label: "Write an email to the president of the club. Tell them your thoughts about this and what you would like to do.",
          minWords: 120,
          maxWords: 225,
          rows: 10
        }
      ]
    }
  }
};

// ── Buổi 5: Writing Part 2 (5 trang x 5 câu, 20-30 từ) + Part 3 (5 trang x 3 câu, 30-40 từ) ──
SESSIONS['B1-5'] = {
  timer: 50,
  buildPages: function (data) {
    const p = [];
    data.part2.forEach((set, i) => {
      p.push({ type: 'writing-sentences', data: set, pageIdx: i, totalPages: data.part2.length });
    });
    data.part3.forEach((set, i) => {
      p.push({ type: 'writing-chat', data: set, pageIdx: i, totalPages: data.part3.length });
    });
    return p;
  },
  data: {
    part2: [
      {
        instruction: "Part 2: Fill in the form. Write in sentences. Use 20-30 words.",
        questions: [
          { key: "q2a_1", prompt: "Tell me about your best friend?", minWords: 20, maxWords: 30 },
          { key: "q2a_2", prompt: "Tell me a painting or a photo that you like.", minWords: 20, maxWords: 30 },
          { key: "q2a_3", prompt: "Tell me your free time and interests?", minWords: 20, maxWords: 30 },
          { key: "q2a_4", prompt: "Which outdoor activities do you like? Why?", minWords: 20, maxWords: 30 },
          { key: "q2a_5", prompt: "Describe where you live.", minWords: 20, maxWords: 30 }
        ]
      },
      {
        instruction: "Part 2: Fill in the form. Write in sentences. Use 20-30 words.",
        questions: [
          { key: "q2b_1", prompt: "What is your favourite food? Why?", minWords: 20, maxWords: 30 },
          { key: "q2b_2", prompt: "Tell me about a film you enjoyed recently.", minWords: 20, maxWords: 30 },
          { key: "q2b_3", prompt: "What do you usually do at weekends?", minWords: 20, maxWords: 30 },
          { key: "q2b_4", prompt: "Describe your favourite place to relax.", minWords: 20, maxWords: 30 },
          { key: "q2b_5", prompt: "What kind of music do you like? Why?", minWords: 20, maxWords: 30 }
        ]
      },
      {
        instruction: "Part 2: Fill in the form. Write in sentences. Use 20-30 words.",
        questions: [
          { key: "q2c_1", prompt: "Tell me about your family.", minWords: 20, maxWords: 30 },
          { key: "q2c_2", prompt: "What is your favourite subject at school? Why?", minWords: 20, maxWords: 30 },
          { key: "q2c_3", prompt: "What do you like to do in the evening?", minWords: 20, maxWords: 30 },
          { key: "q2c_4", prompt: "Describe a person you admire.", minWords: 20, maxWords: 30 },
          { key: "q2c_5", prompt: "What is the best holiday you have had?", minWords: 20, maxWords: 30 }
        ]
      },
      {
        instruction: "Part 2: Fill in the form. Write in sentences. Use 20-30 words.",
        questions: [
          { key: "q2d_1", prompt: "Tell me about a skill you would like to learn.", minWords: 20, maxWords: 30 },
          { key: "q2d_2", prompt: "What is your favourite season? Why?", minWords: 20, maxWords: 30 },
          { key: "q2d_3", prompt: "Describe your daily routine.", minWords: 20, maxWords: 30 },
          { key: "q2d_4", prompt: "What kind of books do you enjoy reading?", minWords: 20, maxWords: 30 },
          { key: "q2d_5", prompt: "Tell me about a sport you enjoy watching or playing.", minWords: 20, maxWords: 30 }
        ]
      },
      {
        instruction: "Part 2: Fill in the form. Write in sentences. Use 20-30 words.",
        questions: [
          { key: "q2e_1", prompt: "What is important to you when choosing a job?", minWords: 20, maxWords: 30 },
          { key: "q2e_2", prompt: "Describe the town or city where you grew up.", minWords: 20, maxWords: 30 },
          { key: "q2e_3", prompt: "Tell me about something that makes you happy.", minWords: 20, maxWords: 30 },
          { key: "q2e_4", prompt: "What technology do you use every day? Why?", minWords: 20, maxWords: 30 },
          { key: "q2e_5", prompt: "Describe your ideal weekend.", minWords: 20, maxWords: 30 }
        ]
      }
    ],
    part3: [
      {
        topic: "TRAVEL CLUB",
        topicInstruction: "You are speaking to fellow members of the TRAVEL CLUB in a group chat. Respond to them in full sentences (30-40 words per answer).",
        questions: [
          { key: "q3a_1", prompt: "1. Tell me a time you had a trip in bad weather.", minWords: 30, maxWords: 40 },
          { key: "q3a_2", prompt: "2. Travelling a long distance by some means of transportation is not good for the environment! Do you agree?", minWords: 30, maxWords: 40 },
          { key: "q3a_3", prompt: "3. What are the most interesting places to visit in your country?", minWords: 30, maxWords: 40 }
        ]
      },
      {
        topic: "HEALTH & FITNESS CLUB",
        topicInstruction: "You are speaking to fellow members of the HEALTH & FITNESS CLUB in a group chat. Respond to them in full sentences (30-40 words per answer).",
        questions: [
          { key: "q3b_1", prompt: "1. What do you do to stay healthy?", minWords: 30, maxWords: 40 },
          { key: "q3b_2", prompt: "2. Some people think that gyms are a waste of money. What do you think?", minWords: 30, maxWords: 40 },
          { key: "q3b_3", prompt: "3. What is the best advice you have received about staying fit?", minWords: 30, maxWords: 40 }
        ]
      },
      {
        topic: "BOOK CLUB",
        topicInstruction: "You are speaking to fellow members of the BOOK CLUB in a group chat. Respond to them in full sentences (30-40 words per answer).",
        questions: [
          { key: "q3c_1", prompt: "1. Tell me about a book that changed the way you think.", minWords: 30, maxWords: 40 },
          { key: "q3c_2", prompt: "2. Do you prefer reading paper books or e-books? Why?", minWords: 30, maxWords: 40 },
          { key: "q3c_3", prompt: "3. How has reading helped you in your studies or work?", minWords: 30, maxWords: 40 }
        ]
      },
      {
        topic: "FOOD & COOKING CLUB",
        topicInstruction: "You are speaking to fellow members of the FOOD & COOKING CLUB in a group chat. Respond to them in full sentences (30-40 words per answer).",
        questions: [
          { key: "q3d_1", prompt: "1. What is a traditional dish from your country that you like?", minWords: 30, maxWords: 40 },
          { key: "q3d_2", prompt: "2. Do you think cooking at home is better than eating out? Why?", minWords: 30, maxWords: 40 },
          { key: "q3d_3", prompt: "3. Tell me about a meal you cooked that you are proud of.", minWords: 30, maxWords: 40 }
        ]
      },
      {
        topic: "MUSIC CLUB",
        topicInstruction: "You are speaking to fellow members of the MUSIC CLUB in a group chat. Respond to them in full sentences (30-40 words per answer).",
        questions: [
          { key: "q3e_1", prompt: "1. What kind of music do you listen to when you want to relax?", minWords: 30, maxWords: 40 },
          { key: "q3e_2", prompt: "2. Do you think learning a musical instrument is important? Why?", minWords: 30, maxWords: 40 },
          { key: "q3e_3", prompt: "3. Tell me about a concert or music event you enjoyed.", minWords: 30, maxWords: 40 }
        ]
      }
    ]
  }
};

// ── Buổi 6: Speaking Part 1 (5 câu, 30s mỗi câu, tự chuyển câu ngay) ──
SESSIONS['B1-6'] = {
  timer: 0, // Timer riêng cho speaking, không dùng global timer
  hideGlobalTimer: true,
  buildPages: function (data) {
    return data.questions.map((q, i) => ({
      type: 'speaking-q',
      idx: i,
      data: q,
      totalQ: data.questions.length,
      partLabel: data.partLabel || 'Part 1',
      responseSeconds: data.responseSeconds,
      waitSeconds: data.waitSeconds
    }));
  },
  data: {
    partLabel: 'Part 1',
    responseSeconds: 30,
    waitSeconds: 0,
    questions: [
      { prompt: "What do you enjoy doing in your free time?" },
      { prompt: "Tell me about your favourite place to visit." },
      { prompt: "What kind of food do you like? Why?" },
      { prompt: "Do you prefer studying alone or with other people? Why?" },
      { prompt: "What would you like to do in the future?" }
    ]
  }
};

// ── Buổi 7: Speaking Part 2-3 (intro+audio+image) + Writing Part 2 + Part 3 ──
SESSIONS['B1-7'] = {
  timer: 50,
  hideGlobalTimer: true, // Speaking controls its own timer
  buildPages: function (data) {
    const p = [];
    let spIdx = 0;
    const totalSpeakingPages = data.speakingSets.reduce((s, set) => s + 1 + set.questions.length, 0);

    // Speaking: intro page + question pages per image set
    data.speakingSets.forEach((set) => {
      // Intro page (image + intro audio → auto-advance)
      p.push({
        type: 'speaking-intro',
        idx: spIdx++,
        data: set,
        totalSpeakingPages,
        partLabel: set.partLabel
      });
      // Question pages (audio + textarea + 45s timer → auto-advance)
      set.questions.forEach((q) => {
        p.push({
          type: 'speaking-audio-q',
          idx: spIdx++,
          data: { ...q, images: set.images },
          totalSpeakingPages,
          partLabel: set.partLabel,
          responseSeconds: set.responseSeconds || 45,
          waitSeconds: set.waitSeconds || 5
        });
      });
    });

    // Writing Part 2
    data.writingPart2.forEach((set, i) => {
      p.push({ type: 'writing-sentences', data: set, pageIdx: i, totalPages: data.writingPart2.length });
    });
    // Writing Part 3
    data.writingPart3.forEach((set, i) => {
      p.push({ type: 'writing-chat', data: set, pageIdx: i, totalPages: data.writingPart3.length });
    });
    return p;
  },
  data: {
    speakingSets: [
      {
        partLabel: "Part 2 - Mô tả ảnh",
        introText: "Part Two. In this part I'm going to ask you to describe a picture. Then I will ask you two questions about it. You will have 45 seconds for each response. Begin speaking when you hear this sound.",
        introAudio: "audio/speaking/b1_s7_intro1.mp3",
        images: ["images/speaking/placeholder_part2_1.jpg"],
        responseSeconds: 45,
        waitSeconds: 5,
        questions: [
          { key: "sp7_1_1", prompt: "Tell me the last time you discussed something with your team.", audio: "audio/speaking/b1_s7_q1_1.mp3" },
          { key: "sp7_1_2", prompt: "What are the essential qualities of a good leader in the workplace?", audio: "audio/speaking/b1_s7_q1_2.mp3" }
        ]
      },
      {
        partLabel: "Part 2 - Mô tả ảnh",
        introText: "Now look at this picture. I'm going to ask you two questions about it.",
        introAudio: "audio/speaking/b1_s7_intro2.mp3",
        images: ["images/speaking/placeholder_part2_2.jpg"],
        responseSeconds: 45,
        waitSeconds: 5,
        questions: [
          { key: "sp7_2_1", prompt: "Describe what you see in this picture.", audio: "audio/speaking/b1_s7_q2_1.mp3" },
          { key: "sp7_2_2", prompt: "Would you like to be in this situation? Why or why not?", audio: "audio/speaking/b1_s7_q2_2.mp3" }
        ]
      }
    ],
    writingPart2: [
      {
        instruction: "Part 2: You want to join the Technology club. Fill in the form. Write in sentences. Use 20-30 words.",
        questions: [
          { key: "q7w2_1", prompt: "What do you usually use your laptop for?", minWords: 20, maxWords: 30 }
        ]
      }
    ],
    writingPart3: [
      {
        topic: "TECHNOLOGY CLUB",
        topicInstruction: "You are a new member of the Technology club. Fill in the form. Write in sentences. Use 30-40 words.",
        questions: [
          { key: "q7w3_1", prompt: "A. Do you often watch movies on your laptop or go to the theater?", minWords: 30, maxWords: 40 },
          { key: "q7w3_2", prompt: "B. I used to work on a laptop, and it stopped. I lost all my notes. Tell me about a bad time with your computer.", minWords: 30, maxWords: 40 },
          { key: "q7w3_3", prompt: "C. Technological improvements have made our lives easier. What do you think?", minWords: 30, maxWords: 40 }
        ]
      }
    ]
  }
};

// ── Buổi 8: Writing - Mô tả hình ảnh + câu hỏi phụ ──
SESSIONS['B1-8'] = {
  timer: 40,
  buildPages: function (data) {
    const p = [];
    data.sets.forEach((set, si) => {
      // Page 1: Image + describe question
      p.push({
        type: 'writing-describe-image',
        data: set,
        setIdx: si,
        totalSets: data.sets.length
      });
      // Page 2: Follow-up questions
      if (set.followUps && set.followUps.length) {
        p.push({
          type: 'writing-followup',
          data: set,
          setIdx: si,
          totalSets: data.sets.length
        });
      }
    });
    return p;
  },
  data: {
    sets: [
      {
        image: "images/speaking/part2/1773833109847_0d183092-70ae-4143-b2e0-5fd4ce6cc71d.jpeg",
        mainQuestion: { key: "q8_1", prompt: "1. Describe this picture:", minWords: 30, maxWords: 80 },
        followUps: [
          { key: "q8_2", prompt: "2. How do children go to school in your country?", minWords: 20, maxWords: 60 },
          { key: "q8_3", prompt: "3. Is it common to live far from school in your country?", minWords: 20, maxWords: 60 }
        ]
      }
    ]
  }
};

/* (Buổi 10 Reading data đã chuyển thành Writing ở trên - block này là placeholder cũ, giữ lại cho reference)
SESSIONS['_B1-10-reading-old'] = {
  timer: 35,
  buildPages: function (data) {
    const p = [];
    data.part1.forEach((item, i) => {
      p.push({ type: 'reading-gap', idx: i, data: item, totalInPart: data.part1.length });
    });
    data.part2.forEach((item, i) => {
      p.push({ type: 'reading-order', idx: i, data: item, totalInPart: data.part2.length });
    });
    data.part3.forEach((item, i) => {
      p.push({ type: 'reading-match', idx: i, data: item, totalInPart: data.part3.length });
    });
    return p;
  },
  data: {
    // Part 1: 2 trang gap-fill (giống Reading Question 1)
    part1: [
      {
        intro: "Dear Sarah,",
        instruction: "Choose the word that fits in the gap. The first one is done for you.",
        rows: [
          { before: "I hope you are", after: "well.", options: ["doing", "making", "getting"], answer: "doing" },
          { before: "I wanted to", after: "you about my new job.", options: ["say", "tell", "speak"], answer: "tell" },
          { before: "I have been working", after: "for two months now.", options: ["there", "here", "where"], answer: "there" },
          { before: "My colleagues are very", after: "and helpful.", options: ["friendly", "friendship", "friend"], answer: "friendly" },
          { before: "I really", after: "the work I do every day.", options: ["enjoy", "please", "fun"], answer: "enjoy" }
        ],
        closing: "Best wishes,\nEmma"
      },
      {
        intro: "Hi Tom,",
        instruction: "Choose the word that fits in the gap.",
        rows: [
          { before: "Thank you for your", after: "last week.", options: ["visit", "visiting", "visited"], answer: "visit" },
          { before: "It was great to", after: "you again after so long.", options: ["see", "look", "watch"], answer: "see" },
          { before: "We should", after: "more often.", options: ["meet", "meeting", "met"], answer: "meet" },
          { before: "Next time, let's go to that", after: "restaurant you mentioned.", options: ["new", "news", "newly"], answer: "new" },
          { before: "I look", after: "to hearing from you soon.", options: ["forward", "front", "ahead"], answer: "forward" }
        ],
        closing: "Take care,\nJames"
      }
    ],
    // Part 2: 3 trang ordering (giống Reading Question 2 & 3)
    part2: [
      {
        topic: "Learning to cook",
        sentences: [
          "When I was young, I never helped my mother in the kitchen.",
          "One day, she asked me to make dinner because she was feeling ill.",
          "I had no idea what to do, so I looked up a simple recipe online.",
          "The meal was not perfect, but my mother said it tasted wonderful.",
          "Since then, I have enjoyed cooking and I try new recipes every week."
        ]
      },
      {
        topic: "A rainy day",
        sentences: [
          "Last Saturday, I planned to go to the beach with my friends.",
          "Unfortunately, when I woke up, it was raining very heavily.",
          "We decided to stay indoors and watch movies instead.",
          "My friend brought some snacks and we had a great time together.",
          "By the evening, the rain had stopped, so we went for a walk."
        ]
      },
      {
        topic: "Moving to a new city",
        sentences: [
          "After finishing university, I got a job offer in another city.",
          "At first, I was nervous because I did not know anyone there.",
          "I found a small apartment near my office and moved in.",
          "Gradually, I made friends with my neighbours and colleagues.",
          "Now I feel completely at home and I love living here."
        ]
      }
    ],
    // Part 3: 2 trang matching (giống Reading Question 4)
    part3: [
      {
        topic: "Opinions on working from home",
        paragraphs: {
          A: "I have been working from home for two years now. I find it much better than going to the office every day. I can wake up later, avoid traffic, and spend more time with my family. The only problem is that sometimes I feel lonely because I don't see my colleagues face to face.",
          B: "Working from home is not for everyone. I tried it during the pandemic and I found it very difficult to concentrate. There were too many distractions at home – the TV, my phone, and my children running around. I prefer the structure of going to an office.",
          C: "I work from home three days a week and go to the office two days. I think this is the perfect balance. I get the flexibility of working from home but also the social interaction of being in the office. My company has adopted this model permanently.",
          D: "As a manager, I was initially worried about productivity when my team started working from home. However, I was surprised to find that most people actually worked harder. We use video calls for meetings and it works very well. I think remote work is the future."
        },
        questions: [
          { prompt: "feels lonely sometimes", answer: "A" },
          { prompt: "found it hard to focus at home", answer: "B" },
          { prompt: "works both from home and office", answer: "C" },
          { prompt: "was worried about the team's productivity", answer: "D" },
          { prompt: "prefers the structure of an office", answer: "B" },
          { prompt: "thinks remote work will continue", answer: "D" },
          { prompt: "enjoys spending more time with family", answer: "A" }
        ]
      },
      {
        topic: "Attitudes towards exercise",
        paragraphs: {
          A: "I go to the gym every morning before work. It gives me energy for the whole day. I mainly do weight training and some cardio. I think everyone should exercise regularly because it improves both physical and mental health.",
          B: "I don't like going to the gym at all. I prefer exercising outdoors – running in the park, cycling, or hiking in the mountains. Being in nature makes me feel much happier than being in a closed room with machines.",
          C: "I used to be very lazy about exercise. Then my doctor told me I needed to be more active for my health. I started with short walks and now I swim three times a week. It has made a huge difference to how I feel.",
          D: "Team sports are my favourite way to stay fit. I play football every weekend with friends and we also have a basketball game on Wednesdays. I find it much easier to exercise when other people are counting on you to be there."
        },
        questions: [
          { prompt: "exercises every morning", answer: "A" },
          { prompt: "prefers being outdoors", answer: "B" },
          { prompt: "started exercising because of health advice", answer: "C" },
          { prompt: "enjoys team activities", answer: "D" },
          { prompt: "thinks exercise helps mental health", answer: "A" }
        ]
      }
    ]
  }
};
*/

// ══════════════════════════════════════════════════════
// BAND B2 – Buổi 1 giống B1-1 (cùng cấu trúc, cùng data placeholder)
// ══════════════════════════════════════════════════════
// ── B2 Buổi 7: Reading Part 3 (matching 2 bài) + Part 4 (heading 2 bài) ──
SESSIONS['B2-7'] = {
  timer: 35,
  buildPages: function (data) {
    const p = [];
    data.part3.forEach((item, i) => {
      p.push({ type: 'reading-match', idx: i, data: item, totalInPart: data.part3.length });
    });
    data.part4.forEach((item, i) => {
      p.push({ type: 'reading-heading', idx: i, data: item, totalInPart: data.part4.length });
    });
    return p;
  },
  data: {
    part3: [
      {
        topic: "Opinions on flying",
        paragraphs: {
          A: "I have a dream that I work as a tour guide. So I understand that I will have to fly to other countries. In my personal opinion, airplanes are currently too cheap compared to the damage they cause to the environment, so I believe we should add taxes to airline ticket prices to make people choose to use other means of transport before they think about flying.",
          B: "My family and siblings live quite far from me. So I often have to fly to visit them every month when I have time. We really appreciate the time we spend together. I know that traveling by plane too much is not good for the environment so I often shop online or go to work by bike instead of going by car.",
          C: "I was a businessman so I had to fly many times a week. I had to go to other countries to be able to sign wine trading contracts with them. I feel very tired every time I have to fly. Now, my sister and I, whenever we have free time, take the train together and we enjoy that time very much because I can travel while sightseeing and relax without any stress.",
          D: "If I have to go somewhere I will choose other means of public transport, not the plane. Every time I go on a plane I feel extremely tired and I just hope time passes quickly so I can get off that plane. However, due to the specific nature of my job, I have to film in many different locations, so sometimes I cannot avoid having to take this public transportation."
        },
        questions: [
          { prompt: "suggest making flights more expensive", answer: "A" },
          { prompt: "want to work in other countries", answer: "A" },
          { prompt: "visit relatives regularly", answer: "B" },
          { prompt: "try to protect the environment", answer: "B" },
          { prompt: "like relaxing while they travel", answer: "C" },
          { prompt: "find flying tiring", answer: "D" },
          { prompt: "need to fly for their work", answer: "C" }
        ]
      },
      {
        topic: "Attitudes towards social media",
        paragraphs: {
          A: "I use social media every day to keep in touch with friends and family. It is the easiest way to share photos and updates. However, I try to limit my screen time because I noticed it was affecting my sleep and concentration at work.",
          B: "I deleted all my social media accounts two years ago and I have never felt better. I found that I was constantly comparing myself to others and it was making me unhappy. Now I have more time for hobbies and real conversations.",
          C: "As a small business owner, social media is essential for my work. I use it to promote my products and connect with customers. Without it, I would not have been able to grow my business as quickly as I did.",
          D: "I think social media can be both good and bad. It depends on how you use it. I enjoy following educational accounts and learning new things, but I avoid getting into arguments or spending too much time scrolling through posts."
        },
        questions: [
          { prompt: "uses social media for business", answer: "C" },
          { prompt: "stopped using social media completely", answer: "B" },
          { prompt: "tries to control how much time they spend online", answer: "A" },
          { prompt: "thinks social media has positive and negative sides", answer: "D" },
          { prompt: "felt unhappy because of social media", answer: "B" }
        ]
      }
    ],
    part4: [
      {
        topic: "Four-Day Workweek",
        headings: [
          "A way of life now out of date",
          "Benefits for employees",
          "Undesirable financial consequences",
          "Unforeseen challenges for employees",
          "Difficult to change old habits",
          "Unfair for some people",
          "Alternative solutions worth considering"
        ],
        paragraphs: [
          "For many years, a workweek of five or even six days was the standard. However, advancements in technology, evolving social values, and an increasing emphasis on work-life balance are making this traditional schedule less relevant.",
          "Proponents of a four-day workweek highlight various benefits for workers. With an extra day off, employees gain more time to recharge, connect with family, or explore personal interests.",
          "While appealing, a reduced workweek could have financial downsides. Companies might incur higher expenses from the need to hire additional staff or adjust compensation models.",
          "Adapting to a new work schedule can be difficult for some employees. The pressure to complete tasks within a shorter timeframe can lead to stress and missed deadlines.",
          "For individuals accustomed to traditional work hours, the shift to a four-day workweek can be challenging. Breaking long-established routines is tough.",
          "While a four-day workweek may sound ideal to many, it isn't necessarily fair to all. Essential workers and healthcare providers may not have the option to reduce their hours.",
          "Rather than universally implementing a four-day workweek, experts suggest considering more flexible arrangements such as allowing employees to choose their days off."
        ],
        answers: [0, 1, 2, 3, 4, 5, 6]
      },
      {
        topic: "The Impact of Technology on Education",
        headings: [
          "Traditional methods losing relevance",
          "Making learning more accessible",
          "Concerns about screen time",
          "The digital divide in education",
          "New skills for teachers",
          "Privacy and data concerns",
          "A balanced approach to technology"
        ],
        paragraphs: [
          "Textbooks and chalkboards were once the primary tools of education. While they still have value, the rise of digital resources has made many traditional methods feel outdated in comparison to interactive and multimedia learning experiences.",
          "Online courses and educational apps have made it possible for anyone with an internet connection to learn almost anything. Students in remote areas can now access the same quality of education as those in major cities.",
          "Many parents and educators worry about the amount of time students spend looking at screens. Research suggests that excessive screen time can affect concentration, sleep patterns, and social development.",
          "Not all students have equal access to technology. In many developing countries and low-income communities, the lack of devices and reliable internet creates a significant gap in educational opportunities.",
          "As technology becomes more integrated into classrooms, teachers need to develop new skills. Training programmes are essential to help educators effectively use digital tools and create engaging online content.",
          "The use of educational technology raises important questions about student data. Schools must ensure that personal information is protected and that third-party platforms comply with privacy regulations.",
          "Experts recommend combining technology with traditional teaching methods. A blended approach can maximise the benefits of digital tools while maintaining the human connection that is essential for effective learning."
        ],
        answers: [0, 1, 2, 3, 4, 5, 6]
      }
    ]
  }
};

// ── B2 Buổi 8: Listening (Part 1: 2 bài kiểu Q15, Part 2: 1 bài kiểu Q16/17 với 4 câu) ──
SESSIONS['B2-8'] = {
  timer: 30,
  buildPages: function (data) {
    const p = [];
    data.part1.forEach((item, i) => {
      p.push({ type: 'listening-opinion', idx: i, partLabel: 'Part 1', data: item, totalInPart: data.part1.length });
    });
    data.part2.forEach((item, i) => {
      p.push({ type: 'listening-mcq-batch', idx: i, partLabel: 'Part 2', data: item, totalInPart: data.part2.length });
    });
    return p;
  },
  data: {
    part1: [
      {
        topic: "Topic: Changes in the workplace",
        instruction: "Listen and choose who expresses each opinion.",
        audio: "audio/question15/audio_1763663468787.mp3",
        transcript: "W: I'm thinking about switching to another job. M: Why? Your current job is very stable. W: I think I should try my hand at different fields. M: But if you stay longer at one company, they might offer more opportunities. W: We also need motivation and job satisfaction. M: Technology can help us work faster and more efficiently.",
        statements: [
          "prefers changing jobs every 1-2 years",
          "believes staying longer in one company can bring career advancement",
          "thinks job satisfaction is important for motivation",
          "says technology can increase productivity and support work"
        ],
        answers: ["Woman", "Man", "Both", "Man"]
      },
      {
        topic: "Topic: Views of beauty",
        instruction: "Listen and choose who expresses each opinion.",
        audio: "audio/question15/audio_1763661917592.mp3",
        transcript: "W: Beauty is different for each person and changes over time. M: I think people often have similar ideas about beauty. W: Traditional and modern ideas are not always the same. M: Beauty can appear in unexpected places. W: Yes, and what people call beautiful can keep changing in the future.",
        statements: [
          "believes people often share similar ideas about beauty",
          "says views of beauty can change over time",
          "thinks beauty can be found in unexpected places",
          "suggests traditional ideas of beauty may continue to change"
        ],
        answers: ["Man", "Woman", "Both", "Woman"]
      }
    ],
    part2: [
      {
        topic: "Topic: Education and life choices",
        instruction: "Listen and choose the correct answer for each question.",
        audio: "audio/question16/audio_1763661951919.mp3",
        transcript: "The speaker talks about taking time before university, learning from travel experiences, and how practical skills support future work decisions.",
        questions: [
          {
            id: "1",
            question: "Why didn't he start university immediately?",
            options: [
              "He wasn't ready to start higher education.",
              "He had to move to another city.",
              "He failed the entrance test."
            ],
            answer: "He wasn't ready to start higher education."
          },
          {
            id: "2",
            question: "Why did he decide to travel for two years?",
            options: [
              "To gain life experience.",
              "To avoid studying completely.",
              "To work as a full-time driver."
            ],
            answer: "To gain life experience."
          },
          {
            id: "3",
            question: "What did he improve during that period?",
            options: [
              "His communication and problem-solving skills.",
              "His ability to memorize textbook facts.",
              "His speed in typing academic essays."
            ],
            answer: "His communication and problem-solving skills."
          },
          {
            id: "4",
            question: "What is his current plan?",
            options: [
              "Apply for college with clearer goals.",
              "Continue traveling without any plan.",
              "Only look for jobs abroad."
            ],
            answer: "Apply for college with clearer goals."
          }
        ]
      }
    ]
  }
};

// ── B2 Buổi 9: Practice Writing (Part 2 + Part 3, tích hợp AI sửa lỗi) ──
SESSIONS['B2-9'] = {
  timer: 45,
  buildPages: function (data) {
    return [
      { type: 'writing-sentences', data: data.part2, pageIdx: 0, totalPages: 1, stepLabel: 'Writing – Part 1' },
      { type: 'writing-chat', data: data.part3, pageIdx: 0, totalPages: 1, stepLabel: 'Writing – Part 2' }
    ];
  },
  data: {
    part2: {
      headerTitle: "Part 1",
      instruction: "You are a new member of a Social Club. Fill in the form. Write in sentences. Use 20 - 30 words.",
      questions: [
        { key: "b2s9_p2_q1", prompt: "1. Tell me about your best friend?", minWords: 20, maxWords: 30 },
        { key: "b2s9_p2_q2", prompt: "2. Tell me your free time and interests?", minWords: 20, maxWords: 30 }
      ]
    },
    part3: {
      topic: "SOCIAL",
      headerTitle: "Part 2",
      topicInstruction: "Answer in full sentences. Keep your response around 30 - 40 words for each question.",
      questions: [
        { key: "b2s9_p3_q1", prompt: "1. What do you do when you go out with your friends?", minWords: 30, maxWords: 40 },
        { key: "b2s9_p3_q2", prompt: "2. Is it easier for young people to have friends?", minWords: 30, maxWords: 40 },
        { key: "b2s9_p3_q3", prompt: "3. It is much easier to make new friends these days because of computers and mobile phones. Do you agree? Why or why not?", minWords: 30, maxWords: 40 }
      ]
    }
  }
};

// ── B2 Buổi 10: Part 1 (giống cấu trúc B1-7 Speaking) + Part 2 (1 bộ Writing kiểu writingkey001) ──
SESSIONS['B2-10'] = {
  timer: 60,
  hideGlobalTimer: true,
  buildPages: function (data) {
    const p = [];

    // Part 1: Speaking structure like B1-7
    let spIdx = 0;
    const totalSpeakingPages = data.part1.speakingSets.reduce((s, set) => s + 1 + set.questions.length, 0);
    data.part1.speakingSets.forEach((set) => {
      p.push({
        type: 'speaking-intro',
        idx: spIdx++,
        data: set,
        totalSpeakingPages,
        partLabel: set.partLabel
      });
      set.questions.forEach((q) => {
        p.push({
          type: 'speaking-audio-q',
          idx: spIdx++,
          data: { ...q, images: set.images },
          totalSpeakingPages,
          partLabel: set.partLabel,
          responseSeconds: set.responseSeconds || 45,
          waitSeconds: set.waitSeconds || 5
        });
      });
    });

    // Part 2: One writing set like writingkey001 (Q1 -> Q4)
    p.push({
      type: 'writing-short',
      data: data.part2.question1,
      stepLabel: 'Writing – Part 2 (Q1/4)'
    });
    p.push({
      type: 'writing-sentences',
      data: data.part2.question2,
      pageIdx: 0,
      totalPages: 1,
      stepLabel: 'Writing – Part 2 (Q2/4)'
    });
    p.push({
      type: 'writing-chat',
      data: data.part2.question3,
      pageIdx: 0,
      totalPages: 1,
      stepLabel: 'Writing – Part 2 (Q3/4)'
    });
    p.push({
      type: 'writing-email',
      data: data.part2.question4,
      stepLabel: 'Writing – Part 2 (Q4/4)'
    });

    return p;
  },
  data: {
    part1: {
      speakingSets: [
        {
          partLabel: "Part 1 - Speaking",
          introText: "Part One. In this part I'm going to ask you to describe a picture. Then I will ask you two questions about it. You will have 45 seconds for each response. Begin speaking when you hear this sound.",
          introAudio: "audio/speaking/b1_s7_intro1.mp3",
          images: ["images/speaking/placeholder_part2_1.jpg"],
          responseSeconds: 45,
          waitSeconds: 5,
          questions: [
            { key: "b2s10_sp_1_1", prompt: "Tell me the last time you discussed something with your team.", audio: "audio/speaking/b1_s7_q1_1.mp3" },
            { key: "b2s10_sp_1_2", prompt: "What are the essential qualities of a good leader in the workplace?", audio: "audio/speaking/b1_s7_q1_2.mp3" }
          ]
        },
        {
          partLabel: "Part 1 - Speaking",
          introText: "Now look at this picture. I'm going to ask you two questions about it.",
          introAudio: "audio/speaking/b1_s7_intro2.mp3",
          images: ["images/speaking/placeholder_part2_2.jpg"],
          responseSeconds: 45,
          waitSeconds: 5,
          questions: [
            { key: "b2s10_sp_2_1", prompt: "Describe what you see in this picture.", audio: "audio/speaking/b1_s7_q2_1.mp3" },
            { key: "b2s10_sp_2_2", prompt: "Would you like to be in this situation? Why or why not?", audio: "audio/speaking/b1_s7_q2_2.mp3" }
          ]
        }
      ]
    },
    part2: {
      question1: {
        headerTitle: "Part 2",
        topic: "TRAVEL CLUB",
        topicInstruction: "You are joining a TRAVEL CLUB. Fill out the form. Write short answers (1-10 words) for each message (5 questions).",
        questions: [
          { key: "b2s10_w_q1_1", prompt: "1. What country would you like to visit?" },
          { key: "b2s10_w_q1_2", prompt: "2. Who do you usually travel with?" },
          { key: "b2s10_w_q1_3", prompt: "3. What do you always take on holiday?" },
          { key: "b2s10_w_q1_4", prompt: "4. How often do you travel?" },
          { key: "b2s10_w_q1_5", prompt: "5. What kind of transport do you prefer?" }
        ]
      },
      question2: {
        headerTitle: "Part 2",
        instruction: "Now you've become a new member of the TRAVEL CLUB. Fill in the form. Write in sentences. Use 20-45 words.",
        questions: [
          { key: "b2s10_w_q2_1", prompt: "Why are you interested in travel?", minWords: 20, maxWords: 45 }
        ]
      },
      question3: {
        headerTitle: "Part 2",
        topic: "TRAVEL CLUB",
        topicInstruction: "You are speaking to fellow members of the TRAVEL CLUB in a group chat. Respond in full sentences (30-60 words per answer).",
        questions: [
          { key: "b2s10_w_q3_1", prompt: "1. Tell me a time you had a trip in bad weather.", minWords: 30, maxWords: 60 },
          { key: "b2s10_w_q3_2", prompt: "2. Traveling a long distance by some means of transportation is not good for the environment. Do you agree?", minWords: 30, maxWords: 60 },
          { key: "b2s10_w_q3_3", prompt: "3. What are the most interesting places to visit in your country?", minWords: 30, maxWords: 60 }
        ]
      },
      question4: {
        headerTitle: "Part 2",
        topic: "TRAVEL CLUB",
        topicInstruction: "Write a short email (about 50-75 words) to your friend, and a longer email (120-225 words) to the president of the club.",
        contextText: "Dear members, Our club is planning to encourage tourists to visit an area. We also want visitors coming to our areas to behave politely. Please raise your voice and give some suggestions for this plan.",
        emails: [
          {
            key: "b2s10_w_q4_1",
            label: "Write a short email to your friend. Tell your friend your feelings about this and what you plan to do.",
            minWords: 50, maxWords: 75, rows: 6
          },
          {
            key: "b2s10_w_q4_2",
            label: "Write an email to the president of the club. Tell them your thoughts about this and what you would like to do.",
            minWords: 120, maxWords: 225, rows: 10
          }
        ]
      }
    }
  }
};

// ── B2 Buổi 13: Writing full 4 part (giống writingkey001) ──
SESSIONS['B2-13'] = {
  timer: 60,
  buildPages: function (data) {
    return [
      {
        type: 'writing-short',
        data: data.question1,
        stepLabel: 'Writing – Part 1'
      },
      {
        type: 'writing-sentences',
        data: data.question2,
        pageIdx: 0,
        totalPages: 1,
        stepLabel: 'Writing – Part 2'
      },
      {
        type: 'writing-chat',
        data: data.question3,
        pageIdx: 0,
        totalPages: 1,
        stepLabel: 'Writing – Part 3'
      },
      {
        type: 'writing-email',
        data: data.question4,
        stepLabel: 'Writing – Part 4'
      }
    ];
  },
  data: {
    question1: {
      headerTitle: "Part 1",
      topic: "TRAVEL CLUB",
      topicInstruction: "You are joining a TRAVEL CLUB. Fill out the form. Write short answers (1-10 words) for each message (5 questions).",
      questions: [
        { key: "b2s13_w_q1_1", prompt: "1. What country would you like to visit?" },
        { key: "b2s13_w_q1_2", prompt: "2. Who do you usually travel with?" },
        { key: "b2s13_w_q1_3", prompt: "3. What do you always take on holiday?" },
        { key: "b2s13_w_q1_4", prompt: "4. How often do you travel?" },
        { key: "b2s13_w_q1_5", prompt: "5. What kind of transport do you prefer?" }
      ]
    },
    question2: {
      headerTitle: "Part 2",
      instruction: "Now you've become a new member of the TRAVEL CLUB. Fill in the form. Write in sentences. Use 20-45 words.",
      questions: [
        { key: "b2s13_w_q2_1", prompt: "Why are you interested in travel?", minWords: 20, maxWords: 45 }
      ]
    },
    question3: {
      headerTitle: "Part 3",
      topic: "TRAVEL CLUB",
      topicInstruction: "You are speaking to fellow members of the TRAVEL CLUB in a group chat. Respond in full sentences (30-60 words per answer).",
      questions: [
        { key: "b2s13_w_q3_1", prompt: "1. Tell me a time you had a trip in bad weather.", minWords: 30, maxWords: 60 },
        { key: "b2s13_w_q3_2", prompt: "2. Traveling a long distance by some means of transportation is not good for the environment. Do you agree?", minWords: 30, maxWords: 60 },
        { key: "b2s13_w_q3_3", prompt: "3. What are the most interesting places to visit in your country?", minWords: 30, maxWords: 60 }
      ]
    },
    question4: {
      headerTitle: "Part 4",
      topic: "TRAVEL CLUB",
      topicInstruction: "Write a short email (about 50-75 words) to your friend, and a longer email (120-225 words) to the president of the club.",
      contextText: "Dear members, Our club is planning to encourage tourists to visit an area. We also want visitors coming to our areas to behave politely. Please raise your voice and give some suggestions for this plan.",
      emails: [
        {
          key: "b2s13_w_q4_1",
          label: "Write a short email to your friend. Tell your friend your feelings about this and what you plan to do.",
          minWords: 50, maxWords: 75, rows: 6
        },
        {
          key: "b2s13_w_q4_2",
          label: "Write an email to the president of the club. Tell them your thoughts about this and what you would like to do.",
          minWords: 120, maxWords: 225, rows: 10
        }
      ]
    }
  }
};

SESSIONS['B2-1'] = SESSIONS['B1-1'];
SESSIONS['B2-11'] = {
  timer: SESSIONS['B1-11'].timer,
  buildPages: SESSIONS['B1-11'].buildPages,
  data: JSON.parse(JSON.stringify(SESSIONS['B1-11'].data))
};
SESSIONS['B2-12'] = {
  timer: SESSIONS['B1-12'].timer,
  buildPages: SESSIONS['B1-12'].buildPages,
  data: JSON.parse(JSON.stringify(SESSIONS['B1-12'].data))
};
SESSIONS['B2-14'] = {
  timer: SESSIONS['B1-11'].timer,
  buildPages: SESSIONS['B1-11'].buildPages,
  data: JSON.parse(JSON.stringify(SESSIONS['B1-11'].data))
};
SESSIONS['B2-15'] = {
  timer: SESSIONS['B1-12'].timer,
  buildPages: SESSIONS['B1-12'].buildPages,
  data: JSON.parse(JSON.stringify(SESSIONS['B1-12'].data))
};
SESSIONS['B2-16'] = {
  timer: SESSIONS['B2-13'].timer,
  buildPages: SESSIONS['B2-13'].buildPages,
  data: JSON.parse(JSON.stringify(SESSIONS['B2-13'].data))
};
SESSIONS['B2-17'] = {
  timer: SESSIONS['B1-11'].timer,
  buildPages: SESSIONS['B1-11'].buildPages,
  data: JSON.parse(JSON.stringify(SESSIONS['B1-11'].data))
};
SESSIONS['B2-18'] = {
  timer: SESSIONS['B1-12'].timer,
  buildPages: SESSIONS['B1-12'].buildPages,
  data: JSON.parse(JSON.stringify(SESSIONS['B1-12'].data))
};

// ── B2 Buổi 6: Grammar (30 câu trắc nghiệm ABC) ──
SESSIONS['B2-6'] = {
  timer: 30,
  buildPages: function (data) {
    const p = [];
    data.grammar.forEach((item, i) => {
      p.push({ type: 'grammar', idx: i, data: item });
    });
    return p;
  },
  data: {
    grammar: [
      { q: "Look! It _____ outside.", options: ["rain", "is raining", "rains"], answer: "is raining" },
      { q: "She _____ to school every day.", options: ["go", "goes", "going"], answer: "goes" },
      { q: "They _____ lunch at 12 o'clock yesterday.", options: ["have", "had", "has"], answer: "had" },
      { q: "I _____ my homework yet.", options: ["haven't finished", "didn't finish", "don't finish"], answer: "haven't finished" },
      { q: "He _____ English since 2020.", options: ["studies", "has studied", "studied"], answer: "has studied" },
      { q: "We _____ to the cinema tonight.", options: ["are going", "go", "went"], answer: "are going" },
      { q: "If it _____, we will stay home.", options: ["rain", "rains", "rained"], answer: "rains" },
      { q: "The book _____ by millions of people.", options: ["has read", "has been read", "is reading"], answer: "has been read" },
      { q: "She asked me where I _____.", options: ["live", "lived", "am living"], answer: "lived" },
      { q: "I wish I _____ more time.", options: ["have", "had", "has"], answer: "had" },
      { q: "He is _____ tallest boy in the class.", options: ["a", "an", "the"], answer: "the" },
      { q: "This is the book _____ I told you about.", options: ["which", "who", "where"], answer: "which" },
      { q: "You _____ smoke in the hospital.", options: ["mustn't", "don't have to", "needn't"], answer: "mustn't" },
      { q: "She _____ her keys. She can't find them.", options: ["has lost", "lost", "loses"], answer: "has lost" },
      { q: "The train _____ at 9 AM tomorrow.", options: ["leave", "leaves", "is leaving"], answer: "leaves" },
      { q: "I'm not used to _____ up early.", options: ["get", "getting", "got"], answer: "getting" },
      { q: "He suggested _____ a taxi.", options: ["take", "to take", "taking"], answer: "taking" },
      { q: "By next year, I _____ here for 10 years.", options: ["will work", "will have worked", "am working"], answer: "will have worked" },
      { q: "The children were _____ tired to continue.", options: ["too", "enough", "so"], answer: "too" },
      { q: "Neither Tom _____ Mary came to the party.", options: ["or", "nor", "and"], answer: "nor" },
      { q: "I'd rather you _____ here.", options: ["stay", "stayed", "staying"], answer: "stayed" },
      { q: "_____ you mind opening the window?", options: ["Do", "Would", "Could"], answer: "Would" },
      { q: "She speaks English _____ than her sister.", options: ["more fluently", "most fluently", "fluently"], answer: "more fluently" },
      { q: "He _____ working when I arrived.", options: ["is", "was", "has been"], answer: "was" },
      { q: "We have lived here _____ 2015.", options: ["for", "since", "during"], answer: "since" },
      { q: "She is interested _____ learning French.", options: ["in", "on", "at"], answer: "in" },
      { q: "The weather is getting _____ and _____.", options: ["cold / cold", "colder / colder", "coldest / coldest"], answer: "colder / colder" },
      { q: "He _____ to the gym three times a week.", options: ["is going", "goes", "go"], answer: "goes" },
      { q: "I don't know what _____ tomorrow.", options: ["will happen", "happens", "happened"], answer: "will happen" },
      { q: "The movie was _____ boring that I fell asleep.", options: ["so", "such", "too"], answer: "so" }
    ]
  }
};

// ── B2 Buổi 5: Speaking Part 1 (5 câu, 30s, tự chuyển câu ngay) ──
SESSIONS['B2-5'] = {
  timer: 0,
  hideGlobalTimer: true,
  buildPages: function (data) {
    return data.questions.map((q, i) => ({
      type: 'speaking-q',
      idx: i,
      data: q,
      totalQ: data.questions.length,
      partLabel: data.partLabel || 'Part 1',
      responseSeconds: data.responseSeconds,
      waitSeconds: data.waitSeconds
    }));
  },
  data: {
    partLabel: 'Part 1',
    responseSeconds: 30,
    waitSeconds: 0,
    questions: [
      { prompt: "What do you like to do on weekends?" },
      { prompt: "Tell me about a teacher who influenced you." },
      { prompt: "Do you prefer living in the city or the countryside? Why?" },
      { prompt: "What is the most useful thing you have learned recently?" },
      { prompt: "If you could travel anywhere, where would you go and why?" }
    ]
  }
};

// ── B2 Buổi 2: Reading (Part 1: 3 trang gap-fill, Part 2: 3 trang ordering) ──
SESSIONS['B2-2'] = {
  timer: 30,
  buildPages: function (data) {
    const p = [];
    data.part1.forEach((item, i) => {
      p.push({ type: 'reading-gap', idx: i, data: item, totalInPart: data.part1.length });
    });
    data.part2.forEach((item, i) => {
      p.push({ type: 'reading-order', idx: i, data: item, totalInPart: data.part2.length });
    });
    return p;
  },
  data: {
    part1: [
      {
        intro: "Dear Mr. Wilson,",
        instruction: "Choose the word that fits in the gap.",
        rows: [
          { before: "I am writing to", after: "for the position of sales manager.", options: ["apply", "ask", "request"], answer: "apply" },
          { before: "I have five years of", after: "in this field.", options: ["experience", "experiment", "expert"], answer: "experience" },
          { before: "I am", after: "in starting as soon as possible.", options: ["interested", "interesting", "interest"], answer: "interested" },
          { before: "Please find my CV", after: "to this email.", options: ["attached", "attaching", "attach"], answer: "attached" },
          { before: "I look forward to", after: "from you.", options: ["hearing", "hear", "heard"], answer: "hearing" }
        ],
        closing: "Yours sincerely,\nDavid Brown"
      },
      {
        intro: "Hi everyone,",
        instruction: "Choose the word that fits in the gap.",
        rows: [
          { before: "Just a reminder that the meeting has been", after: "to Friday.", options: ["moved", "removed", "improved"], answer: "moved" },
          { before: "Please make", after: "you bring all the documents.", options: ["sure", "certain", "clear"], answer: "sure" },
          { before: "We need to", after: "the new project plan.", options: ["discuss", "say", "speak"], answer: "discuss" },
          { before: "The meeting will", after: "about two hours.", options: ["last", "take", "spend"], answer: "last" },
          { before: "Let me know if you have any", after: ".", options: ["questions", "answers", "problems"], answer: "questions" }
        ],
        closing: "Thanks,\nThe Manager"
      },
      {
        intro: "Dear Neighbour,",
        instruction: "Choose the word that fits in the gap.",
        rows: [
          { before: "I am having a party", after: "Saturday evening.", options: ["on", "in", "at"], answer: "on" },
          { before: "There might be some", after: "from the music.", options: ["noise", "voice", "sound"], answer: "noise" },
          { before: "I hope this will not", after: "you too much.", options: ["disturb", "destroy", "damage"], answer: "disturb" },
          { before: "You are very", after: "to join us if you like.", options: ["welcome", "allowed", "able"], answer: "welcome" },
          { before: "Please do not", after: "to contact me.", options: ["hesitate", "stop", "refuse"], answer: "hesitate" }
        ],
        closing: "Kind regards,\nAlex"
      }
    ],
    part2: [
      {
        topic: "Getting a pet",
        sentences: [
          "My children had been asking for a pet for months.",
          "After much discussion, we decided to get a small dog from the local shelter.",
          "The first few days were difficult because the dog was very nervous.",
          "Slowly, it began to trust us and started playing with the children.",
          "Now it is part of our family and we cannot imagine life without it."
        ]
      },
      {
        topic: "Starting a business",
        sentences: [
          "I always dreamed of opening my own bakery.",
          "Last year, I finally saved enough money to rent a small shop.",
          "I spent weeks decorating the shop and creating new recipes.",
          "On the opening day, many friends and neighbours came to support me.",
          "The business is growing slowly, and I have never been happier."
        ]
      },
      {
        topic: "An unexpected visitor",
        sentences: [
          "I was sitting at home reading a book when the doorbell rang.",
          "I opened the door and was surprised to see my old friend from university.",
          "We had not seen each other for over ten years.",
          "We spent the whole afternoon talking about our memories and catching up.",
          "Before he left, we promised to stay in touch this time."
        ]
      }
    ]
  }
};

// ── B2 Buổi 4: Writing (Part 1: 5 câu ngắn + Part 2: 2 emails + Part 3: 2 chủ đề email practice) ──
SESSIONS['B2-4'] = {
  timer: 60,
  buildPages: function (data) {
    const p = [
      { type: 'writing-short', data: data.part1 },
      { type: 'writing-email', data: data.part2 }
    ];
    // Part 3: mỗi chủ đề = 1 trang gồm context + 2 emails (informal + formal)
    data.part3.forEach((set, i) => {
      p.push({ type: 'writing-email', data: set });
    });
    return p;
  },
  data: {
    part1: {
      topic: "PHOTOGRAPHY CLUB",
      topicInstruction: "You are joining a PHOTOGRAPHY CLUB. Fill out the form. Write short answers (1-10 words) for each message (5 questions).",
      questions: [
        { key: "b2q4_1_1", prompt: "1. What kind of photos do you like to take?" },
        { key: "b2q4_1_2", prompt: "2. How often do you take photos?" },
        { key: "b2q4_1_3", prompt: "3. What camera or device do you use?" },
        { key: "b2q4_1_4", prompt: "4. Where is your favourite place to take photos?" },
        { key: "b2q4_1_5", prompt: "5. Who do you usually share your photos with?" }
      ]
    },
    part2: {
      topic: "PHOTOGRAPHY CLUB",
      headerTitle: "Part 2 – PHOTOGRAPHY CLUB",
      topicInstruction: "Write a short email (about 50-75 words) to your friend, and a longer email (120-225 words) to the president of the club.",
      contextText: "\"Dear members, Our club is planning to organise a photography competition in the city centre. We want to attract more young people to join. Please share your ideas and suggestions for this event.\"",
      emails: [
        {
          key: "b2q4_2_1",
          label: "Write a short email to your friend. Tell your friend your feelings about this event and what you plan to do.",
          minWords: 50, maxWords: 75, rows: 6
        },
        {
          key: "b2q4_2_2",
          label: "Write an email to the president of the club. Tell them your thoughts about the competition and your suggestions.",
          minWords: 120, maxWords: 225, rows: 10
        }
      ]
    },
    part3: [
      {
        topic: "ART CLUB",
        headerTitle: "Part 3 – ART CLUB",
        topicInstruction: "Xác định dạng đề của bài và hãy luyện tập cách viết email (Informal + Formal email).",
        contextText: "\"The Art Club is organizing a talk to the public to attract more attention. We are going to invite an artist to give a talk to members. As a member of our club, could you give us an artist to join our talk and what topic should they share to gain more attention. We would like to have more both young and elderly members.\"",
        emails: [
          {
            key: "b2q4_3_1",
            label: "Informal email (Art club) – Write a short email to your friend about this event.",
            minWords: 50, maxWords: 75, rows: 6
          },
          {
            key: "b2q4_3_2",
            label: "Formal email (Art club) – Write an email to the club organizer with your suggestions.",
            minWords: 120, maxWords: 225, rows: 10
          }
        ]
      },
      {
        topic: "ENGLISH CLUB",
        headerTitle: "Part 3 – ENGLISH CLUB",
        topicInstruction: "Xác định dạng đề của bài và hãy luyện tập cách viết email (Informal + Formal email).",
        contextText: "\"We regret to inform you that our upcoming English Speaking Contest scheduled for this Friday has been canceled due to unforeseen circumstances. As an active member, we would like to hear your thoughts.\"",
        emails: [
          {
            key: "b2q4_3_3",
            label: "Informal email (English club) – Write a short email to your friend about this situation.",
            minWords: 50, maxWords: 75, rows: 6
          },
          {
            key: "b2q4_3_4",
            label: "Formal email (English club) – Write an email to the club president with your thoughts.",
            minWords: 120, maxWords: 225, rows: 10
          }
        ]
      }
    ]
  }
};

// ── B2 Buổi 3: Listening (Part 1: 5 câu, Part 2: 2 câu topic) ──
SESSIONS['B2-3'] = {
  timer: 25,
  buildPages: function (data) {
    const p = [];
    data.part1.forEach((item, i) => {
      p.push({ type: 'listening-q', idx: i, partLabel: 'Part 1', data: item, totalInPart: data.part1.length });
    });
    data.part2.forEach((item, i) => {
      p.push({ type: 'listening-topic', idx: i, partLabel: 'Part 2', data: item });
    });
    return p;
  },
  data: {
    part1: [
      { q: "What time does the shop close?", options: ["5:00", "6:00", "7:00"], answer: "6:00", audio: "audio/listening/b2_s3_p1_q1.mp3" },
      { q: "Where did she leave her bag?", options: ["In the car", "At the office", "At home"], answer: "At the office", audio: "audio/listening/b2_s3_p1_q2.mp3" },
      { q: "What is the man going to buy?", options: ["A shirt", "A jacket", "A hat"], answer: "A jacket", audio: "audio/listening/b2_s3_p1_q3.mp3" },
      { q: "How will they get to the airport?", options: ["By taxi", "By bus", "By train"], answer: "By taxi", audio: "audio/listening/b2_s3_p1_q4.mp3" },
      { q: "What does the woman suggest?", options: ["Going for a walk", "Watching a film", "Having dinner"], answer: "Going for a walk", audio: "audio/listening/b2_s3_p1_q5.mp3" }
    ],
    part2: [
      {
        topic: "LEARNING A NEW LANGUAGE",
        instruction: "Four people are discussing their views on the topic above. Complete the sentences. Use each answer only once.",
        audio: "audio/listening/b2_s3_p2_1.mp3",
        persons: ["Person 1", "Person 2", "Person 3", "Person 4"],
        options: [
          "thinks practising every day is the most important thing",
          "believes travelling is the best way to learn",
          "prefers learning through music and films",
          "finds grammar books very helpful",
          "says speaking with native speakers is essential",
          "thinks online courses are a waste of time"
        ],
        answers: [0, 2, 4, 1]
      },
      {
        topic: "WORKING IN TEAMS",
        instruction: "Four people are discussing their views on the topic above. Complete the sentences. Use each answer only once.",
        audio: "audio/listening/b2_s3_p2_2.mp3",
        persons: ["Person 1", "Person 2", "Person 3", "Person 4"],
        options: [
          "enjoys sharing ideas with colleagues",
          "prefers working alone most of the time",
          "thinks a good leader is essential for teamwork",
          "finds meetings often unproductive",
          "believes team projects improve communication skills",
          "says teamwork is harder when working remotely"
        ],
        answers: [0, 3, 2, 5]
      }
    ]
  }
};

/* ═══════════════════════════════════════════════════════
   CUSTOM SESSION CONTENT (from admin_lop_hoc)
   ═══════════════════════════════════════════════════════ */

async function loadCustomSessionConfig(sessionKey) {
  try {
    const res = await fetch(`/api/practice_sets/list?type=${SESSION_CONTENT_TYPE}`);
    if (!res.ok) return null;
    const data = await res.json();
    const sets = Array.isArray(data?.sets) ? data.sets : [];
    const matched = sets
      .filter((set) => String(set?.data?.session_key || '').toUpperCase() === String(sessionKey).toUpperCase())
      .sort((a, b) => {
        const ta = new Date(a?.updated_at || a?.created_at || 0).getTime();
        const tb = new Date(b?.updated_at || b?.created_at || 0).getTime();
        return tb - ta;
      });

    if (!matched.length) return null;
    const record = matched[0];
    const config = record?.data?.session_config;
    if (!config || typeof config !== 'object' || Array.isArray(config)) return null;
    if (!Array.isArray(config.pages)) return null;
    return { record, config };
  } catch (err) {
    console.warn('Load custom session config failed:', err);
    return null;
  }
}

function loadPreviewSessionConfig(sessionKey) {
  if (!PREVIEW_MODE) return null;
  try {
    const storageKey = `${SESSION_PREVIEW_STORAGE_PREFIX}:${sessionKey}`;
    const raw = localStorage.getItem(storageKey);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    const config = parsed?.config;
    if (!config || typeof config !== 'object' || Array.isArray(config)) return null;
    if (!Array.isArray(config.pages)) return null;
    return config;
  } catch (err) {
    console.warn('Load preview session config failed:', err);
    return null;
  }
}

function extractPartNumberFromLabel(value) {
  const match = String(value || '').match(/\bpart\s*(\d+)\b/i);
  if (!match) return null;
  const num = parseInt(match[1], 10);
  return Number.isFinite(num) ? num : null;
}

function replacePartNumberInLabel(value, nextPartNumber) {
  if (typeof value !== 'string' || !value.trim()) return value;
  if (!Number.isFinite(Number(nextPartNumber))) return value;
  const normalizedNum = parseInt(nextPartNumber, 10);
  return value.replace(/\bpart\s*\d+\b/i, `Part ${normalizedNum}`);
}

function normalizePagesPartLabelsForDisplay(rawPages) {
  const pages = Array.isArray(rawPages) ? rawPages : [];
  if (!pages.length) return pages;

  const partNumberMap = new Map();
  let nextPartNumber = 1;
  const register = (num) => {
    if (!Number.isFinite(num)) return;
    if (!partNumberMap.has(num)) {
      partNumberMap.set(num, nextPartNumber);
      nextPartNumber += 1;
    }
  };

  const fields = ['partTitle', 'partLabel', 'headerTitle', 'stepLabel'];
  pages.forEach((page) => {
    fields.forEach((field) => {
      const num = extractPartNumberFromLabel(page?.[field]);
      if (num) register(num);
      const dataNum = extractPartNumberFromLabel(page?.data?.[field]);
      if (dataNum) register(dataNum);
    });
  });

  if (!partNumberMap.size) return pages;

  const relabelField = (obj, field) => {
    if (!obj || typeof obj !== 'object') return;
    const oldNum = extractPartNumberFromLabel(obj[field]);
    if (!oldNum) return;
    const mapped = partNumberMap.get(oldNum) || oldNum;
    obj[field] = replacePartNumberInLabel(obj[field], mapped);
  };

  pages.forEach((page) => {
    fields.forEach((field) => relabelField(page, field));
    if (page?.data && typeof page.data === 'object') {
      fields.forEach((field) => relabelField(page.data, field));
    }
  });

  return pages;
}

function resolvePageDisplayPartLabel(page, fallbackLabel = '') {
  const candidates = [
    page?.partTitle,
    page?.partLabel,
    page?.headerTitle,
    page?.stepLabel,
    page?.data?.headerTitle,
    page?.data?.partTitle,
    page?.data?.partLabel,
    page?.data?.stepLabel
  ];

  for (const candidate of candidates) {
    const num = extractPartNumberFromLabel(candidate);
    if (num) return `Part ${num}`;
  }
  return fallbackLabel;
}

function normalizeCustomPages(rawPages) {
  const list = (Array.isArray(rawPages) ? rawPages : []).map((page) => {
    const copy = page && typeof page === 'object' ? { ...page } : {};
    if (!copy.data || typeof copy.data !== 'object' || Array.isArray(copy.data)) {
      copy.data = {};
    }
    return copy;
  });

  normalizePagesPartLabelsForDisplay(list);

  const groupCounts = {};
  const groupCursor = {};
  const keyOf = (page) => {
    const seg = page.partLabel || page.partTitle || page.stepLabel || page.groupKey || '';
    return `${page.type || 'unknown'}__${seg}`;
  };

  list.forEach((page) => {
    const key = keyOf(page);
    groupCounts[key] = (groupCounts[key] || 0) + 1;
  });

  list.forEach((page) => {
    const key = keyOf(page);
    const idx = groupCursor[key] || 0;
    groupCursor[key] = idx + 1;

    if (page.idx === undefined || page.idx === null || Number.isNaN(Number(page.idx))) {
      page.idx = idx;
    }

    if (page.totalInPart === undefined || page.totalInPart === null) {
      page.totalInPart = groupCounts[key];
    }

    if ((page.type === 'writing-sentences' || page.type === 'writing-chat')) {
      if (page.pageIdx === undefined || page.pageIdx === null) page.pageIdx = idx;
      if (page.totalPages === undefined || page.totalPages === null) page.totalPages = groupCounts[key];
    }
  });

  const speakingPages = list.filter((p) => p.type === 'speaking-intro' || p.type === 'speaking-audio-q');
  if (speakingPages.length) {
    const totalSpeakingPages = speakingPages.length;
    speakingPages.forEach((page, i) => {
      if (page.idx === undefined || page.idx === null) page.idx = i;
      if (page.totalSpeakingPages === undefined || page.totalSpeakingPages === null) {
        page.totalSpeakingPages = totalSpeakingPages;
      }
    });
  }

  return list;
}

function resolveCustomSession(baseSession, customConfig) {
  const fallbackTimer = Number(baseSession?.timer) || 25;
  const timer = Number(customConfig?.timer);
  const finalTimer = Number.isFinite(timer) && timer >= 0 ? timer : fallbackTimer;
  const hideGlobalTimer =
    typeof customConfig?.hideGlobalTimer === 'boolean'
      ? customConfig.hideGlobalTimer
      : !!baseSession?.hideGlobalTimer;

  const normalizedPages = normalizeCustomPages(customConfig?.pages || []);

  return {
    timer: finalTimer,
    hideGlobalTimer,
    buildPages: function () {
      return normalizedPages.map((page) => ({
        ...page,
        data: page?.data && typeof page.data === 'object' ? { ...page.data } : {}
      }));
    },
    data: { pages: normalizedPages }
  };
}

async function resolveSessionForRuntime(sessionKey) {
  const baseSession = SESSIONS[sessionKey] || null;

  const previewConfig = loadPreviewSessionConfig(sessionKey);
  if (previewConfig) {
    try {
      return resolveCustomSession(baseSession || { timer: 25, hideGlobalTimer: false }, previewConfig);
    } catch (err) {
      console.warn('Preview config invalid, fallback to regular flow:', err);
    }
  }

  const custom = await loadCustomSessionConfig(sessionKey);
  if (!custom) return baseSession;

  try {
    return resolveCustomSession(baseSession || { timer: 25, hideGlobalTimer: false }, custom.config);
  } catch (err) {
    console.warn('Custom session payload invalid, fallback to default:', err);
    return baseSession;
  }
}

/* ═══════════════════════════════════════════════════════
   INIT
   ═══════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', async function () {
  const pageContainer = document.getElementById('pageContent');
  if (!pageContainer) return;

  await resolveAccessContext();
  if (!ensureSessionUnlockedOrNotify()) {
    return;
  }

  const sessionKey = `${ACTIVE_BAND}-${SESSION}`;
  const session = await resolveSessionForRuntime(sessionKey);
  ACTIVE_SESSION = session;

  if (!session) {
    pageContainer.innerHTML =
      '<div class="question-card"><h2>Buổi học chưa có dữ liệu</h2><p>Vui lòng quay lại sau.</p></div>';
    return;
  }

  pages = session.buildPages(session.data);
  pages = normalizePagesPartLabelsForDisplay(pages);

  if (session.hideGlobalTimer) {
    // Speaking: hide global countdown, use per-question timer
    document.getElementById('countdownTimer').style.display = 'none';
    document.querySelector('.time-remaining-label')?.style.setProperty('display', 'none');
    timerSeconds = 0;
  } else {
    timerSeconds = (session.timer || 25) * 60;
    startTimer();
  }

  renderPage(0);
});

/* ═══════════════════════════════════════════════════════
   RENDER PAGE (dispatcher)
   ═══════════════════════════════════════════════════════ */

function renderPage(pageIndex) {
  saveCurrent();
  clearSpeakingTimer(); // Always clear speaking timer when switching pages
  currentPage = pageIndex;
  const container = document.getElementById('pageContent');

  if (pageIndex >= pages.length) {
    container.innerHTML = renderResultsPage();
  } else {
    const page = pages[pageIndex];
    switch (page.type) {
      case 'grammar':       container.innerHTML = renderGrammarPage(page); break;
      case 'vocab':         container.innerHTML = renderVocabPage(page); break;
      case 'listening-q':   container.innerHTML = renderListeningQ(page); break;
      case 'listening-topic': container.innerHTML = renderListeningTopic(page); break;
      case 'listening-opinion': container.innerHTML = renderListeningOpinion(page); break;
      case 'listening-mcq-batch': container.innerHTML = renderListeningMcqBatch(page); break;
      case 'reading-gap':    container.innerHTML = renderReadingGap(page); break;
      case 'reading-order':  container.innerHTML = renderReadingOrder(page); initSortable(page); break;
      case 'reading-match':   container.innerHTML = renderReadingMatch(page); break;
      case 'reading-heading': container.innerHTML = renderReadingHeading(page); break;
      case 'writing-short':     container.innerHTML = renderWritingShort(page); break;
      case 'writing-email':     container.innerHTML = renderWritingEmail(page); break;
      case 'writing-sentences': container.innerHTML = renderWritingSentences(page); break;
      case 'writing-chat':      container.innerHTML = renderWritingChat(page); break;
      case 'speaking-q':        container.innerHTML = renderSpeakingQ(page); playSpeakingQAudio(page); break;
      case 'speaking-image':    container.innerHTML = renderSpeakingImage(page); startSpeakingTimer(page); break;
      case 'writing-describe-image': container.innerHTML = renderWritingDescribeImage(page); break;
      case 'writing-followup':      container.innerHTML = renderWritingFollowup(page); break;
      case 'speaking-intro':    container.innerHTML = renderSpeakingIntro(page); playSpeakingIntroAudio(page); break;
      case 'speaking-audio-q':  container.innerHTML = renderSpeakingAudioQ(page); playSpeakingQuestionAudio(page); break;
      default:              container.innerHTML = '<div class="question-card"><p>Unknown page type</p></div>';
    }
  }

  updateUI();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ═══════════════════════════════════════════════════════
   RENDER – GRAMMAR (1 câu / trang)
   ═══════════════════════════════════════════════════════ */

function renderGrammarPage(page) {
  const item = page.data;
  const num = page.idx + 1;
  const totalGrammar = pages.filter(p => p.type === 'grammar').length;
  const letters = ['A', 'B', 'C'];
  const saved = userAnswers['g-' + page.idx] || '';

  const optionsHtml = item.options.map((opt, oi) => {
    const sel = saved === opt ? 'selected' : '';
    return `
      <li class="option-item ${sel}" onclick="pickAnswer('g-${page.idx}', '${esc(opt)}', this)">
        <span class="option-letter">${letters[oi]}</span>
        <span class="option-text">${esc(opt)}</span>
      </li>`;
  }).join('');

  return `
    <div class="question-card">
      <div class="q-number-label">Grammar – Câu ${num} (${num}/${totalGrammar})</div>
      <p class="q-text">${esc(item.q)}</p>
      <ul class="option-list">${optionsHtml}</ul>
    </div>`;
}

/* ═══════════════════════════════════════════════════════
   RENDER – LISTENING Part 1 (1 câu + audio / trang)
   ═══════════════════════════════════════════════════════ */

function renderListeningQ(page) {
  const item = page.data;
  const num = page.idx + 1;
  const audioId = 'audio-p1-' + page.idx;
  if (audioPlaysLeft[audioId] === undefined) audioPlaysLeft[audioId] = 2;
  const playsLeft = audioPlaysLeft[audioId];
  const saved = userAnswers['lq-' + page.idx] || '';
  const letters = ['A', 'B', 'C'];

  const optionsHtml = item.options.map((opt, oi) => {
    const sel = saved === opt ? 'selected' : '';
    return `
      <li class="option-item ${sel}" onclick="pickAnswer('lq-${page.idx}', '${esc(opt)}', this)">
        <span class="option-letter">${letters[oi]}</span>
        <span class="option-text">${esc(opt)}</span>
      </li>`;
  }).join('');

  return `
    <div class="question-card legacy-skill-card listening-card">
      <div class="q-number-label">Question ${num} of ${page.totalInPart}</div>

      <div class="audio-bar">
        <button class="play-btn" id="playBtn-${audioId}" onclick="playAudio('${audioId}')" ${playsLeft <= 0 ? 'disabled' : ''}>
          <i class="bi bi-play-fill" id="playIcon-${audioId}"></i>
        </button>
        <i class="bi bi-volume-up-fill vol-icon"></i>
        <input type="range" min="0" max="100" value="0" id="range-${audioId}" oninput="seekAudio('${audioId}', this.value)">
        <span class="plays-remaining" id="playsLabel-${audioId}">${playsLeft} of 2 plays remaining</span>
      </div>
      <audio id="${audioId}" src="${item.audio}" preload="none"></audio>

      <div class="listening-q-box">
        <div class="lq-text">${esc(item.q)}</div>
        <ul class="option-list">${optionsHtml}</ul>
      </div>
    </div>`;
}

/* ═══════════════════════════════════════════════════════
   RENDER – LISTENING Part 2 (topic + 4 persons / trang)
   ═══════════════════════════════════════════════════════ */

function renderListeningTopic(page) {
  const d = page.data;
  const audioId = 'audio-p2';
  if (audioPlaysLeft[audioId] === undefined) audioPlaysLeft[audioId] = 2;
  const playsLeft = audioPlaysLeft[audioId];
  const partTitle = resolvePageDisplayPartLabel(page, 'Part 2');

  const personsHtml = d.persons.map((person, i) => {
    const saved = userAnswers['lt-' + i] || '';
    const opts = d.options.map((opt, oi) =>
      `<option value="${oi}" ${saved == oi ? 'selected' : ''}>${esc(opt)}</option>`
    ).join('');
    return `
      <div class="person-row">
        <span class="person-label">${esc(person)}</span>
        <select class="form-select" onchange="userAnswers['lt-${i}']=this.value">
          <option value="">-- Select an answer --</option>
          ${opts}
        </select>
      </div>`;
  }).join('');

  return `
    <div class="question-card legacy-skill-card listening-card">
      <div class="q-number-label">${esc(partTitle)}</div>

      <div class="audio-bar">
        <button class="play-btn" id="playBtn-${audioId}" onclick="playAudio('${audioId}')" ${playsLeft <= 0 ? 'disabled' : ''}>
          <i class="bi bi-play-fill" id="playIcon-${audioId}"></i>
        </button>
        <i class="bi bi-volume-up-fill vol-icon"></i>
        <input type="range" min="0" max="100" value="0" id="range-${audioId}" oninput="seekAudio('${audioId}', this.value)">
        <span class="plays-remaining" id="playsLabel-${audioId}">${playsLeft} of 2 plays remaining</span>
      </div>
      <audio id="${audioId}" src="${d.audio}" preload="none"></audio>

      <div class="listening-q-box">
        <div class="topic-banner">${esc(d.topic)}</div>
        <p class="text-muted mb-3" style="font-size:0.9rem;">${esc(d.instruction)}</p>
        ${personsHtml}
      </div>
    </div>`;
}

/* ═══════════════════════════════════════════════════════
   RENDER – LISTENING Part 1 kiểu Question 15
   ═══════════════════════════════════════════════════════ */

function renderListeningOpinion(page) {
  const d = page.data;
  const audioId = 'audio-opinion-' + page.idx;
  const transcriptId = 'transcript-opinion-' + page.idx;
  if (audioPlaysLeft[audioId] === undefined) audioPlaysLeft[audioId] = 2;
  const playsLeft = audioPlaysLeft[audioId];
  const partTitle = resolvePageDisplayPartLabel(page, page.partLabel || 'Part 1');
  const setLabel = page.totalInPart > 1 ? `Bài ${page.idx + 1}/${page.totalInPart}` : 'Bài 1/1';
  const options = ['Man', 'Woman', 'Both'];

  const statementsHtml = d.statements.map((text, si) => {
    const key = `lop-${page.idx}-${si}`;
    const saved = userAnswers[key] || '';
    const opts = options.map(opt => `<option value="${opt}" ${saved === opt ? 'selected' : ''}>${opt}</option>`).join('');
    return `
      <div class="person-row listening-opinion-row">
        <span class="person-label">${si + 1}.</span>
        <span class="listening-opinion-text">${esc(text)}</span>
        <select class="form-select" onchange="userAnswers['${key}']=this.value">
          <option value="">-- Select an answer --</option>
          ${opts}
        </select>
      </div>`;
  }).join('');

  return `
    <div class="question-card legacy-skill-card listening-card">
      <div class="q-number-label">${esc(partTitle)}</div>
      <div class="text-muted mb-3">${esc(setLabel)}</div>

      <div class="audio-bar">
        <button class="play-btn" id="playBtn-${audioId}" onclick="playAudio('${audioId}')" ${playsLeft <= 0 ? 'disabled' : ''}>
          <i class="bi bi-play-fill" id="playIcon-${audioId}"></i>
        </button>
        <i class="bi bi-volume-up-fill vol-icon"></i>
        <input type="range" min="0" max="100" value="0" id="range-${audioId}" oninput="seekAudio('${audioId}', this.value)">
        <span class="plays-remaining" id="playsLabel-${audioId}">${playsLeft} of 2 plays remaining</span>
      </div>
      <audio id="${audioId}" src="${d.audio}" preload="none"></audio>

      <div class="listening-q-box">
        <div class="topic-banner">${esc(d.topic)}</div>
        <p class="text-muted mb-3" style="font-size:0.9rem;">${esc(d.instruction || 'Listen and choose who says each statement.')}</p>
        ${statementsHtml}
      </div>

      <button type="button" class="btn btn-primary btn-sm mt-2" onclick="toggleTranscript('${transcriptId}', this)">
        Show Paragraph
      </button>
      <div id="${transcriptId}" class="listening-transcript" style="display:none;">
        <p class="mb-2"><strong>Paragraph:</strong></p>
        <div>${esc(d.transcript || '')}</div>
      </div>
    </div>`;
}

/* ═══════════════════════════════════════════════════════
   RENDER – LISTENING Part 2 kiểu Question 16/17 (batch MCQ)
   ═══════════════════════════════════════════════════════ */

function renderListeningMcqBatch(page) {
  const d = page.data;
  const audioId = 'audio-mcq-' + page.idx;
  const transcriptId = 'transcript-mcq-' + page.idx;
  if (audioPlaysLeft[audioId] === undefined) audioPlaysLeft[audioId] = 2;
  const playsLeft = audioPlaysLeft[audioId];
  const partTitle = resolvePageDisplayPartLabel(page, page.partLabel || 'Part 2');

  const questionsHtml = d.questions.map((q, qi) => {
    const key = `lmb-${page.idx}-${qi}`;
    const letters = ['A', 'B', 'C'];
    const saved = userAnswers[key] || '';
    const optionsHtml = q.options.map((opt, oi) => {
      const sel = saved === opt ? 'selected' : '';
      return `
        <li class="option-item ${sel}" onclick="pickAnswer('${key}', '${esc(opt)}', this)">
          <span class="option-letter">${letters[oi]}</span>
          <span class="option-text">${esc(opt)}</span>
        </li>`;
    }).join('');
    return `
      <div class="listening-mcq-item">
        <div class="lq-text">${esc(q.id ? `${q.id}. ${q.question}` : `${qi + 1}. ${q.question}`)}</div>
        <ul class="option-list">${optionsHtml}</ul>
      </div>`;
  }).join('');

  return `
    <div class="question-card legacy-skill-card listening-card">
      <div class="q-number-label">${esc(partTitle)}</div>

      <div class="audio-bar">
        <button class="play-btn" id="playBtn-${audioId}" onclick="playAudio('${audioId}')" ${playsLeft <= 0 ? 'disabled' : ''}>
          <i class="bi bi-play-fill" id="playIcon-${audioId}"></i>
        </button>
        <i class="bi bi-volume-up-fill vol-icon"></i>
        <input type="range" min="0" max="100" value="0" id="range-${audioId}" oninput="seekAudio('${audioId}', this.value)">
        <span class="plays-remaining" id="playsLabel-${audioId}">${playsLeft} of 2 plays remaining</span>
      </div>
      <audio id="${audioId}" src="${d.audio}" preload="none"></audio>

      <div class="listening-q-box">
        <div class="topic-banner">${esc(d.topic)}</div>
        <p class="text-muted mb-3" style="font-size:0.9rem;">${esc(d.instruction || 'Choose the correct option for each question.')}</p>
        ${questionsHtml}
      </div>

      <button type="button" class="btn btn-primary btn-sm mt-2" onclick="toggleTranscript('${transcriptId}', this)">
        Show Paragraph
      </button>
      <div id="${transcriptId}" class="listening-transcript" style="display:none;">
        <p class="mb-2"><strong>Paragraph:</strong></p>
        <div>${esc(d.transcript || '')}</div>
      </div>
    </div>`;
}

/* ═══════════════════════════════════════════════════════
   RENDER – VOCAB (same as before)
   ═══════════════════════════════════════════════════════ */

function renderVocabPage(page) {
  const p = page.data;
  const partKey = page.partKey;
  let bodyHtml = '';

  if (partKey === 'part1' || partKey === 'part4') {
    let exHtml = '';
    if (p.example) {
      exHtml = `<div class="vocab-row" style="opacity:.55;"><span class="v-num">0.</span><span class="v-word">${esc(p.example.word)}</span><span class="ms-auto badge bg-secondary">${p.example.answer}. ${esc(p.example.answerWord)}</span></div>`;
    }
    const wHtml = (p.words).map(w => `<div class="vocab-row"><span class="v-num">${w.num}.</span><span class="v-word">${esc(w.word)}</span><div class="ms-auto">${buildDropdown('v'+partKey.replace('part','p')+'-q'+w.num, p.options, w.answer)}</div></div>`).join('');
    const oHtml = p.options.map(o => `<div class="vocab-option"><span class="v-letter">${o.letter}</span>${esc(o.word)}</div>`).join('');
    bodyHtml = `<div class="vocab-table"><div class="vocab-header"><h5>${p.title}</h5><p>${esc(p.instruction)}</p><p class="fst-italic" style="font-size:.75rem;">${esc(p.instructionVi)}</p></div><div class="vocab-body"><div class="vocab-left">${exHtml}${wHtml}</div><div class="vocab-right">${oHtml}</div></div></div>`;
  } else if (partKey === 'part2') {
    const sHtml = p.sentences.map(s => `<div class="vocab-row"><span class="v-num">${s.num}.</span><span class="v-word flex-grow-1">${esc(s.text)}</span><div class="ms-2">${buildDropdown('vp2-q'+s.num, p.options, s.answer)}</div></div>`).join('');
    const oHtml = p.options.map(o => `<div class="vocab-option"><span class="v-letter">${o.letter}</span>${esc(o.word)}</div>`).join('');
    bodyHtml = `<div class="vocab-table"><div class="vocab-header"><h5>${p.title}</h5><p>${esc(p.instruction)}</p><p class="fst-italic" style="font-size:.75rem;">${esc(p.instructionVi)}</p></div><div class="vocab-body"><div class="vocab-left">${sHtml}</div><div class="vocab-right">${oHtml}</div></div></div>`;
  } else if (partKey === 'part3') {
    const sHtml = p.sentences.map(s => `<div class="sentence-fill"><span class="sf-num">${s.num}.</span>${esc(s.before)} ${buildDropdown('vp3-q'+s.num, p.options, s.answer)} ${esc(s.after)}</div>`).join('');
    const oRef = '<div class="d-flex flex-wrap gap-3">' + p.options.map(o => `<span class="vocab-option"><span class="v-letter">${o.letter}</span>${esc(o.word)}</span>`).join('') + '</div>';
    bodyHtml = `<div class="vocab-table"><div class="vocab-header"><h5>${p.title}</h5><p>${esc(p.instruction)}</p><p class="fst-italic" style="font-size:.75rem;">${esc(p.instructionVi)}</p></div><div class="p-3">${sHtml}</div><div class="p-3 bg-light border-top">${oRef}</div></div>`;
  }

  return `<div class="question-card"><span class="q-badge q-badge-vocab"><i class="bi bi-book me-1"></i>Vocabulary – Part ${page.partNum}</span>${bodyHtml}</div>`;
}

function buildDropdown(name, options, correctAnswer) {
  const saved = userAnswers[name] || '';
  const opts = options.map(o => `<option value="${o.letter}" ${saved===o.letter?'selected':''}>${o.letter}. ${esc(o.word)}</option>`).join('');
  return `<select class="form-select form-select-sm vocab-select" name="${name}" data-answer="${correctAnswer}" onchange="userAnswers['${name}']=this.value"><option value="">-- Chọn --</option>${opts}</select>`;
}

/* ═══════════════════════════════════════════════════════
   RENDER – READING Part 1: Gap-fill (giống reading_bode_set Part 1)
   ═══════════════════════════════════════════════════════ */

function renderReadingGap(page) {
  const d = page.data;
  const num = page.idx + 1;
  const title = page.partTitle ? esc(page.partTitle) : `Question ${num} of ${page.totalInPart}`;

  const rowsHtml = d.rows.map((r, ri) => {
    const key = `rg-${page.idx}-${ri}`;
    const saved = userAnswers[key] || '';
    const shuffled = shuffleArr([...r.options]);
    const opts = shuffled.map(o => `<option value="${esc(o)}" ${saved===o?'selected':''}>${esc(o)}</option>`).join('');
    return `
      <div class="reading-part1-row">
        <div class="d-flex flex-column flex-md-row gap-3 align-items-md-center">
          <div class="flex-grow-1">
            <span>${esc(r.before)}</span>
            <select class="form-select d-inline-block w-auto mx-2 reading-gap-select reading-part1-select" name="${key}" data-answer="${esc(r.answer)}" onchange="userAnswers['${key}']=this.value">
              <option value="">-- Chọn --</option>${opts}
            </select>
            <span>${esc(r.after)}</span>
          </div>
        </div>
      </div>`;
  }).join('');

  const closing = d.closing ? `<p class="reading-part1-closing">${esc(d.closing)}</p>` : '';

  return `
    <div class="question-card legacy-skill-card reading-part1-layout">
      <h1 class="reading-part1-title"><strong>${title}</strong></h1>
      <p class="reading-part1-instruction">${esc(d.instruction || 'Choose the right word to fill in the blank.')}</p>

      <div class="reading-part1-shell">
        ${rowsHtml}
      </div>

      ${closing ? `<div class="reading-part1-shell mt-3">${closing}</div>` : ''}
    </div>`;
}

/* ═══════════════════════════════════════════════════════
   RENDER – READING Part 2: Sentence ordering (drag & drop)
   ═══════════════════════════════════════════════════════ */

function renderReadingOrder(page) {
  const d = page.data;
  const num = page.idx + 1;
  const title = page.partTitle ? esc(page.partTitle) : `Reading Question 2 &amp; 3 (${num}/${page.totalInPart})`;
  const containerId = `order-container-${page.idx}`;

  // First sentence locked, rest shuffled
  const first = d.sentences[0];
  const rest = d.sentences.slice(1);
  const shuffled = shuffleArr([...rest]);

  const lockedHtml = `
    <div class="locked-sentence">
      <div class="d-flex align-items-center">
        <i class="bi bi-check-circle-fill text-success me-2" style="font-size:1.2rem;"></i>
        <span>${esc(first)}</span>
      </div>
    </div>`;

  const cardsHtml = shuffled.map((s, i) => `
    <div class="draggable-card" data-text="${esc(s)}">
      <div class="d-flex align-items-center">
        <i class="bi bi-grip-vertical me-2 text-muted" style="font-size:1.2rem;"></i>
        <span>${esc(s)}</span>
      </div>
    </div>`).join('');

  return `
    <div class="question-card legacy-skill-card reading-part2-layout">
      <div class="q-number-label">${title}</div>
      <p class="text-danger fw-semibold mb-2">Topic: ${esc(d.topic)}</p>
      <p class="text-muted small mb-3">Put the sentences below in the right order. The first sentence is done for you.</p>
      <div id="${containerId}">
        ${lockedHtml}
        ${cardsHtml}
      </div>
    </div>`;
}

function initSortable(page) {
  setTimeout(() => {
    const containerId = `order-container-${page.idx}`;
    const container = document.getElementById(containerId);
    if (container && typeof Sortable !== 'undefined') {
      Sortable.create(container, { animation: 150, draggable: '.draggable-card' });
    }
  }, 50);
}

/* ═══════════════════════════════════════════════════════
   RENDER – READING Part 3: Paragraph matching (giống reading_bode_set Part 4)
   ═══════════════════════════════════════════════════════ */

function renderReadingMatch(page) {
  const d = page.data;
  const num = page.idx + 1;
  const title = page.partTitle ? esc(page.partTitle) : `Reading Question 4 (${num}/${page.totalInPart})`;

  const parasHtml = Object.entries(d.paragraphs).map(([letter, text]) =>
    `<div class="paragraph-box"><p><strong>${letter}:</strong> ${esc(text)}</p></div>`
  ).join('');

  const matchHtml = d.questions.map((q, qi) => {
    const key = `rm-${page.idx}-${qi}`;
    const saved = userAnswers[key] || '';
    const letters = Object.keys(d.paragraphs);
    const opts = letters.map(l => `<option value="${l}" ${saved===l?'selected':''}>${l}</option>`).join('');
    return `<div class="match-row">
      <span class="match-label">${esc(q.prompt)}</span>
      <select class="form-select form-select-sm" name="${key}" data-answer="${q.answer}" onchange="userAnswers['${key}']=this.value" style="width:70px;">
        <option value="">--</option>${opts}
      </select>
    </div>`;
  }).join('');

  return `
    <div class="question-card legacy-skill-card reading-part3-layout">
      <div class="q-number-label">${title}</div>
      <p class="text-danger fw-semibold mb-3">Topic: ${esc(d.topic)}</p>
      <div class="row">
        <div class="col-md-7">
          <p class="fw-bold mb-2">Choose the right person for these following questions</p>
          ${parasHtml}
        </div>
        <div class="col-md-5">
          <p class="fw-bold mb-2">Read the four opinions and answer the questions.</p>
          ${matchHtml}
        </div>
      </div>
    </div>`;
}

/* ═══════════════════════════════════════════════════════
   RENDER – READING Part 4: Heading selection (giống reading_question5)
   Mỗi đoạn văn chọn 1 heading từ dropdown
   ═══════════════════════════════════════════════════════ */

function renderReadingHeading(page) {
  const d = page.data;
  const num = page.idx + 1;
  const containerId = `heading-paras-${page.idx}`;
  const titleBase = page.partTitle || page.partLabel || page.headerTitle || resolvePageDisplayPartLabel(page, 'Reading Question 5');

  // Paragraphs (hidden by default, toggle with button)
  const parasHtml = d.paragraphs.map((text, pi) =>
    `<div class="border rounded-3 p-3 mb-3 bg-white shadow-sm">
      <div class="d-flex flex-column flex-md-row align-items-md-start gap-3">
        <label class="mb-0 fw-semibold" style="min-width:30px;">${pi + 1}.</label>
        <select class="form-select reading-heading-select" name="rh-${page.idx}-${pi}" data-answer="${d.answers[pi]}"
                onchange="userAnswers['rh-${page.idx}-${pi}']=this.value;" style="max-width:350px;">
          <option value="">-- Chọn heading --</option>
          ${d.headings.map((h, hi) => {
            const saved = userAnswers['rh-' + page.idx + '-' + pi] || '';
            return `<option value="${hi}" ${saved == hi ? 'selected' : ''}>${esc(h)}</option>`;
          }).join('')}
        </select>
      </div>
      <p class="mb-0 mt-2 text-muted" id="para-text-${page.idx}-${pi}" style="display:none; font-size:0.9rem; line-height:1.7;">${esc(text)}</p>
    </div>`
  ).join('');

  return `
    <div class="question-card">
      <div class="q-number-label">${esc(titleBase)} (${num}/${page.totalInPart})</div>
      <h4 class="mb-3" style="color:#dc2626;"><strong>TOPIC: ${esc(d.topic)}</strong></h4>
      <div class="mb-3">
        <button class="btn btn-secondary btn-sm" onclick="toggleHeadingParagraphs(${page.idx})">
          <i class="bi bi-eye me-1"></i>Xem nội dung
        </button>
      </div>
      <div id="${containerId}">
        ${parasHtml}
      </div>
    </div>`;
}

function toggleHeadingParagraphs(pageIdx) {
  const paras = document.querySelectorAll(`[id^="para-text-${pageIdx}-"]`);
  paras.forEach(p => {
    p.style.display = p.style.display === 'none' ? 'block' : 'none';
  });
}

function toggleTranscript(transcriptId, btn) {
  const box = document.getElementById(transcriptId);
  if (!box) return;
  const isHidden = box.style.display === 'none';
  box.style.display = isHidden ? 'block' : 'none';
  if (btn) btn.textContent = isHidden ? 'Hide Paragraph' : 'Show Paragraph';
}

function shuffleArr(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/* ═══════════════════════════════════════════════════════
   RENDER – WRITING Part 1: Short answers (5 câu, 1-10 words)
   ═══════════════════════════════════════════════════════ */

function renderWritingShort(page) {
  const d = page.data;
  const questions = Array.isArray(d.questions) ? d.questions : [];
  const qsHtml = questions.map((q, idx) => {
    const key = q?.key || `q${idx + 1}`;
    const prompt = q?.prompt || '';
    const minWordsRaw = parseInt(q?.minWords, 10);
    const maxWordsRaw = parseInt(q?.maxWords, 10);
    const minWords = Number.isFinite(minWordsRaw) ? Math.max(0, minWordsRaw) : 1;
    let maxWords = Number.isFinite(maxWordsRaw) ? Math.max(0, maxWordsRaw) : 10;
    if (maxWords < minWords) maxWords = minWords;

    const saved = userAnswers[key] || '';
    const wc = saved.split(/\s+/).filter(Boolean).length;
    let counterClass = 'word-counter';
    if (wc >= minWords && wc <= maxWords) counterClass += ' in-range';
    else if (wc > maxWords) counterClass += ' over-limit';
    return `
      <div class="writing-q-item">
        <label>${esc(prompt)}</label>
        <input type="text" class="form-control writing-input" name="${key}" value="${esc(saved)}"
               data-min="${minWords}" data-max="${maxWords}"
               placeholder="Viết ${minWords}-${maxWords} từ..." maxlength="200"
               oninput="limitWords(this, ${maxWords}); updateWordCount(this); userAnswers['${key}']=this.value;">
        <div class="${counterClass}" id="wc-${key}">Số từ: ${wc} / ${maxWords}</div>
      </div>`;
  }).join('');

  const title = page.headerTitle
    ? esc(page.headerTitle)
    : (d.headerTitle ? esc(d.headerTitle) : `${esc(resolvePageDisplayPartLabel(page, 'Part 1'))} – ${esc(d.topic)}`);
  const topicHtml = d.topic ? `<div class="topic-banner">${esc(d.topic)}</div>` : '';
  const instructionHtml = d.topicInstruction
    ? `<div class="writing-topic-bar">${esc(d.topicInstruction)}</div>`
    : '';

  return `
    <div class="question-card legacy-skill-card legacy-writing-card">
      <div class="q-number-label">${title}</div>
      ${topicHtml}
      ${instructionHtml}
      ${qsHtml}
    </div>`;
}

function limitWords(el, max) {
  const words = el.value.split(/\s+/).filter(Boolean);
  if (words.length > max) {
    el.value = words.slice(0, max).join(' ') + ' ';
  }
}

function attachWordLimiters() {
  // Word limit enforcement is inline via oninput
}

/* ═══════════════════════════════════════════════════════
   RENDER – WRITING Part 4: Emails (2 textareas + word count)
   ═══════════════════════════════════════════════════════ */

function renderWritingEmail(page) {
  const d = page.data;

  const contextHtml = d.contextText
    ? `<div class="alert alert-light border mb-3" style="font-size:0.88rem;line-height:1.6;">${esc(d.contextText)}</div>`
    : '';

  const emailsHtml = d.emails.map(e => {
    const saved = userAnswers[e.key] || '';
    const wc = saved.split(/\s+/).filter(Boolean).length;
    return `
      <div class="writing-q-item">
        <label>${esc(e.label)}</label>
        <textarea class="form-control writing-textarea" name="${e.key}" rows="${e.rows}"
                  data-min="${e.minWords}" data-max="${e.maxWords}"
                  placeholder="Viết ${e.minWords}-${e.maxWords} từ..."
                  oninput="updateWordCount(this); userAnswers['${e.key}']=this.value;">${esc(saved)}</textarea>
        <div class="word-counter" id="wc-${e.key}">Số từ: ${wc} / ${e.maxWords}</div>
      </div>`;
  }).join('');

  const title = page.headerTitle
    ? esc(page.headerTitle)
    : (d.headerTitle ? esc(d.headerTitle) : `${esc(resolvePageDisplayPartLabel(page, 'Part 2'))} – ${esc(d.topic)}`);
  const topicHtml = d.topic ? `<div class="topic-banner">${esc(d.topic)}</div>` : '';
  const instructionHtml = d.topicInstruction
    ? `<div class="writing-topic-bar">${esc(d.topicInstruction)}</div>`
    : '';

  return `
    <div class="question-card legacy-skill-card legacy-writing-card">
      <div class="q-number-label">${title}</div>
      ${topicHtml}
      ${instructionHtml}
      ${contextHtml}
      ${emailsHtml}
    </div>`;
}

function updateWordCount(textarea) {
  const words = textarea.value.split(/\s+/).filter(Boolean);
  const max = parseInt(textarea.dataset.max) || 225;
  const min = parseInt(textarea.dataset.min) || 0;
  const count = words.length;

  // Enforce max
  if (count > max) {
    textarea.value = words.slice(0, max).join(' ') + ' ';
  }

  const wcEl = document.getElementById('wc-' + textarea.name);
  if (wcEl) {
    const current = textarea.value.split(/\s+/).filter(Boolean).length;
    wcEl.textContent = `Số từ: ${current} / ${max}`;
    wcEl.className = 'word-counter';
    if (current >= min && current <= max) wcEl.classList.add('in-range');
    else if (current > max) wcEl.classList.add('over-limit');
  }
}

function attachWordCounters() {
  // Word count is handled inline via oninput
}

/* ═══════════════════════════════════════════════════════
   RENDER – WRITING: Describe Image (hình ảnh + textarea)
   ═══════════════════════════════════════════════════════ */

function renderWritingDescribeImage(page) {
  const d = page.data;
  const q = d.mainQuestion;
  const saved = userAnswers[q.key] || '';
  const wc = saved.split(/\s+/).filter(Boolean).length;
  const fallbackIdx = Number.isFinite(Number(page.setIdx)) ? Number(page.setIdx) + 1 : Number(page.idx || 0) + 1;
  const partLabel = page.headerTitle || d.headerTitle || resolvePageDisplayPartLabel(page, `Câu ${fallbackIdx}`);

  const imgSources = Array.isArray(d.images) && d.images.length
    ? d.images
    : (d.image ? [d.image] : []);

  const imgHtml = imgSources.length
    ? `<div style="display:grid; grid-template-columns:${imgSources.length > 1 ? 'repeat(2, minmax(0, 1fr))' : '1fr'}; gap:0.75rem;">
         ${imgSources.map(src => `
           <img src="${src}" alt="Describe this picture"
                style="width:100%; max-height:400px; object-fit:cover; border-radius:0.75rem; border:1px solid #cbd5e1; background:#f8fafc;"
                onerror="this.src=''; this.alt='Hình ảnh chưa có'; this.style.padding='3rem'; this.style.background='#f8fafc'; this.style.border='2px dashed #cbd5e1'; this.style.color='#94a3b8';">`
         ).join('')}
       </div>`
    : `<div style="padding:3rem; background:#f8fafc; border:2px dashed #cbd5e1; border-radius:0.75rem; color:#94a3b8; text-align:center;">
         <i class="bi bi-image" style="font-size:3rem; display:block; margin-bottom:0.5rem;"></i>
         Hình ảnh sẽ được admin cập nhật
       </div>`;

  return `
    <div class="question-card legacy-skill-card legacy-writing-card">
      <div class="q-number-label">${esc(partLabel)}</div>
      <p class="fw-semibold mb-3" style="font-size:1.1rem;">${esc(q.prompt)}</p>

      <div style="margin-bottom:1.5rem; text-align:center;">
        ${imgHtml}
      </div>

      <div style="margin-bottom:1rem;">
        <label style="font-weight:600; display:block; margin-bottom:0.4rem;">Câu trả lời của bạn</label>
        <textarea class="form-control writing-textarea" name="${q.key}" rows="6"
                  data-min="${q.minWords}" data-max="${q.maxWords}"
                  placeholder="Viết ${q.minWords}-${q.maxWords} từ mô tả bức tranh..."
                  style="min-height:150px; border:1px solid #cbd5e1; border-radius:0.5rem;"
                  oninput="updateWordCount(this); userAnswers['${q.key}']=this.value;">${esc(saved)}</textarea>
        <div class="word-counter" id="wc-${q.key}">Số từ: ${wc} / ${q.maxWords}</div>
      </div>
    </div>`;
}

/* ═══════════════════════════════════════════════════════
   RENDER – WRITING: Follow-up questions (2-3 câu hỏi phụ)
   ═══════════════════════════════════════════════════════ */

function renderWritingFollowup(page) {
  const d = page.data;
  const partLabel = page.headerTitle || d.headerTitle || resolvePageDisplayPartLabel(page, 'Câu hỏi phụ');

  const qsHtml = d.followUps.map(q => {
    const saved = userAnswers[q.key] || '';
    const wc = saved.split(/\s+/).filter(Boolean).length;
    return `
      <div style="margin-bottom:1.25rem;">
        <label style="font-weight:700; display:block; margin-bottom:0.4rem; font-size:0.95rem;">${esc(q.prompt)}</label>
        <textarea class="form-control writing-textarea" name="${q.key}" rows="4"
                  data-min="${q.minWords}" data-max="${q.maxWords}"
                  placeholder="Viết ${q.minWords}-${q.maxWords} từ..."
                  style="min-height:120px; border:1px solid #cbd5e1; border-radius:0.5rem;"
                  oninput="updateWordCount(this); userAnswers['${q.key}']=this.value;">${esc(saved)}</textarea>
        <div class="word-counter" id="wc-${q.key}">Số từ: ${wc} / ${q.maxWords}</div>
      </div>`;
  }).join('');

  return `
    <div class="question-card legacy-skill-card legacy-writing-card">
      <div class="q-number-label">${esc(partLabel)}</div>
      ${qsHtml}
    </div>`;
}

/* ═══════════════════════════════════════════════════════
   RENDER – SPEAKING (1 câu / trang, timer 30s, auto-advance 5s)
   ═══════════════════════════════════════════════════════ */

let speakingTimerInterval = null;

function renderSpeakingQ(page) {
  const d = page.data;
  const num = page.idx + 1;
  const partLabel = resolvePageDisplayPartLabel(page, page.partLabel || 'Part 1');
  const saved = userAnswers['sp-' + page.idx] || '';
  const wc = saved.split(/\s+/).filter(Boolean).length;
  const audioId = `sp-basic-audio-${page.idx}`;
  const audioStatusId = `sp-basic-audio-status-${page.idx}`;
  const hasAudio = !!String(d.audio || '').trim();
  const audioPanelHtml = hasAudio
    ? `
          <div class="audio-panel mb-3">
            <div class="d-flex justify-content-between align-items-center mb-2">
              <h6 class="mb-0">Audio</h6>
              <span class="small text-muted">Audio 1 / 1</span>
            </div>
            <audio id="${audioId}" controls preload="none" class="w-100 mb-2" src="${d.audio}"></audio>
            <div class="small" id="${audioStatusId}">Đang phát audio 1...</div>
          </div>`
    : '';
  const hintText = hasAudio
    ? 'Đang phát audio câu hỏi trước khi bắt đầu đếm giờ.'
    : 'Đang đếm thời gian trả lời. Hệ thống sẽ tự chuyển sang câu tiếp theo.';

  return `
    <div class="container py-5">
      <div class="card shadow-sm border-0 speaking-card page-fade">
        <div class="card-body p-3 p-md-4">
          <div class="d-flex flex-column flex-md-row justify-content-between align-items-start gap-2 mb-3">
            <span class="badge bg-primary">Trang ${num} / ${page.totalQ}</span>
            <span class="page-hint" id="speaking-status">${hintText}</span>
          </div>
          <h4 class="mb-2">Speaking ${esc(partLabel)} – Câu ${num}</h4>
          <p class="text-muted mb-3">${hasAudio ? 'Lắng nghe audio câu hỏi và trả lời.' : 'Đọc câu hỏi và trả lời.'}</p>

          ${audioPanelHtml}

          <p class="fw-semibold mb-3" style="font-size:1.1rem;">${esc(d.prompt)}</p>

          <label class="form-label fw-semibold">Câu trả lời của bạn</label>
          <textarea class="form-control answer-box" name="sp-${page.idx}"
                    placeholder="Nhập câu trả lời hoặc transcript bạn nói..."
                    oninput="userAnswers['sp-${page.idx}']=this.value; document.getElementById('wc-sp-${page.idx}').textContent=this.value.split(/\\s+/).filter(Boolean).length+' từ';">${esc(saved)}</textarea>
          <div class="d-flex justify-content-between align-items-center mt-2">
            <small class="text-muted">Bạn có thể quay lại để chỉnh sửa trước khi nộp bài.</small>
            <span class="badge bg-light text-dark" id="wc-sp-${page.idx}">${wc} từ</span>
          </div>
        </div>
      </div>

      <div class="text-center mt-3">
        <div class="speaking-timer-ring running" id="speaking-ring">
          <span id="speaking-seconds">${page.responseSeconds}</span>
        </div>
        <div class="speaking-status" id="speaking-timer-status">${hasAudio ? 'Đang chờ audio...' : `Thời gian trả lời: ${page.responseSeconds} giây`}</div>
      </div>
    </div>`;
}

function playSpeakingQAudio(page) {
  clearSpeakingTimer();
  const d = page.data || {};
  const audioId = `sp-basic-audio-${page.idx}`;
  const audioStatusId = `sp-basic-audio-status-${page.idx}`;
  const audio = document.getElementById(audioId);
  const statusLabel = document.getElementById(audioStatusId);
  const hintEl = document.getElementById('speaking-status');
  const timerStatus = document.getElementById('speaking-timer-status');

  const startTimer = () => {
    if (statusLabel) statusLabel.textContent = 'Audio xong.';
    if (hintEl) hintEl.textContent = 'Đang đếm thời gian trả lời. Hệ thống sẽ tự chuyển sang câu tiếp theo.';
    if (timerStatus) timerStatus.textContent = `Thời gian trả lời: ${page.responseSeconds} giây`;
    startSpeakingTimer(page);
  };

  if (!audio || !audio.src || audio.src.endsWith('/')) {
    startTimer();
    return;
  }

  if (statusLabel) statusLabel.textContent = 'Đang phát audio 1...';
  if (hintEl) hintEl.textContent = 'Đang phát audio câu hỏi...';
  if (timerStatus) timerStatus.textContent = 'Đang chờ audio...';

  audio.play().catch(() => { startTimer(); });
  audio.onended = function () {
    startTimer();
  };
  audio.onerror = function () {
    startTimer();
  };
}

function renderSpeakingImage(page) {
  const d = page.data;
  const num = page.idx + 1;
  const saved = userAnswers['sp-' + page.idx] || '';

  const imagesHtml = (d.images || []).map(src =>
    `<img src="${src}" alt="Speaking image" onerror="this.style.display='none';">`
  ).join('');

  const dotsHtml = Array.from({length: page.totalQ}, (_, i) => {
    let cls = 'page-dot-item';
    if (i < (page.idx - (pages.filter(p => p.type === 'speaking-image' && p.idx < page.idx).length ? 0 : 0))) cls += ' done';
    if (i === page.idx % page.totalQ) cls += ' active';
    return `<div class="${cls}"></div>`;
  }).join('');

  return `
    <div class="question-card" style="text-align:center;">
      <div class="page-dots-bar">${dotsHtml}</div>
      <div class="q-number-label" style="text-align:left;">${esc(d.instruction || page.partLabel)} – Câu ${((page.idx % page.totalQ) + 1)} / ${page.totalQ}</div>

      <div class="speaking-image-container">
        ${imagesHtml || '<div class="p-4 bg-light border rounded text-muted"><i class="bi bi-image fs-1 d-block mb-2"></i>Hình ảnh sẽ được cập nhật sau</div>'}
      </div>

      <div class="speaking-question-text">${esc(d.prompt)}</div>

      <div class="speaking-timer-ring running" id="speaking-ring">
        <span id="speaking-seconds">${page.responseSeconds}</span>
      </div>
      <div class="speaking-status" id="speaking-status">Thời gian trả lời: ${page.responseSeconds} giây</div>

      <div class="speaking-answer-area mt-3" style="text-align:left;">
        <label class="form-label fw-bold">Ghi chú câu trả lời (tùy chọn):</label>
        <textarea class="form-control writing-textarea" name="sp-${page.idx}" rows="3"
                  placeholder="Ghi nhanh ý chính..."
                  oninput="userAnswers['sp-${page.idx}']=this.value;">${esc(saved)}</textarea>
      </div>
    </div>`;
}

/* ═══════════════════════════════════════════════════════
   RENDER – SPEAKING INTRO (image + audio → auto-advance)
   ═══════════════════════════════════════════════════════ */

function renderSpeakingIntro(page) {
  const d = page.data;
  const audioId = 'sp-intro-audio-' + page.idx;

  const imagesHtml = (d.images || []).map(src =>
    `<div class="col-12 col-md-6"><img class="page-image" src="${src}" alt="Speaking visual" onerror="this.alt='Hình ảnh sẽ cập nhật sau'; this.style.padding='3rem';"></div>`
  ).join('');

  return `
    <div class="container py-5">
      <div class="card shadow-sm border-0 speaking-card page-fade">
        <div class="card-body p-3 p-md-4">
          <div class="d-flex flex-column flex-md-row justify-content-between align-items-start gap-2 mb-3">
            <span class="badge bg-primary">Trang ${page.idx + 1} / ${page.totalSpeakingPages}</span>
            <span class="page-hint" id="speaking-status">Hệ thống sẽ tự chuyển sang câu hỏi sau khi audio giới thiệu phát xong.</span>
          </div>
          <h4 class="mb-2">${esc(d.partLabel)} – Giới thiệu</h4>
          <p class="text-muted mb-3">${esc(d.introText)}</p>

          <div class="row g-3 mb-3">${imagesHtml}</div>

          <div class="audio-panel mb-3">
            <div class="d-flex justify-content-between align-items-center mb-2">
              <h6 class="mb-0">Audio</h6>
              <span class="small text-muted">Audio 1 / 1</span>
            </div>
            <audio id="${audioId}" controls preload="none" class="w-100 mb-2" src="${d.introAudio || ''}"></audio>
            <div class="small" id="audio-status-label">Đang phát audio 1...</div>
          </div>
        </div>
      </div>
    </div>`;
}

function playSpeakingIntroAudio(page) {
  clearSpeakingTimer();
  const audioId = 'sp-intro-audio-' + page.idx;
  const audio = document.getElementById(audioId);
  const statusLabel = document.getElementById('audio-status-label');

  if (!audio || !audio.src || audio.src.endsWith('/')) {
    if (statusLabel) statusLabel.textContent = 'Không có audio, chuyển trang...';
    setTimeout(() => { saveCurrent(); renderPage(currentPage + 1); }, 3000);
    return;
  }

  audio.play().catch(() => {});
  if (statusLabel) statusLabel.textContent = 'Đang phát audio 1...';

  audio.onended = function () {
    if (statusLabel) statusLabel.textContent = 'Audio xong, chuyển sang câu hỏi...';
    setTimeout(() => { saveCurrent(); renderPage(currentPage + 1); }, 1000);
  };

  audio.onerror = function () {
    if (statusLabel) statusLabel.textContent = 'Audio chưa có, chuyển trang...';
    setTimeout(() => { saveCurrent(); renderPage(currentPage + 1); }, 3000);
  };
}

/* ═══════════════════════════════════════════════════════
   RENDER – SPEAKING AUDIO QUESTION (audio + textarea + timer)
   ═══════════════════════════════════════════════════════ */

function renderSpeakingAudioQ(page) {
  const d = page.data;
  const audioId = 'sp-q-audio-' + page.idx;
  const saved = userAnswers[d.key] || '';
  const wc = saved.split(/\s+/).filter(Boolean).length;

  return `
    <div class="container py-5">
      <div class="card shadow-sm border-0 speaking-card page-fade">
        <div class="card-body p-3 p-md-4">
          <div class="d-flex flex-column flex-md-row justify-content-between align-items-start gap-2 mb-3">
            <span class="badge bg-primary">Trang ${page.idx + 1} / ${page.totalSpeakingPages}</span>
            <span class="page-hint" id="speaking-status">Đang phát audio... hệ thống sẽ chờ đúng theo mốc thời gian của từng audio.</span>
          </div>
          <h4 class="mb-2">${esc(page.partLabel)} – Câu hỏi</h4>
          <p class="text-muted mb-3">Lắng nghe audio câu hỏi và trả lời.</p>

          <div class="audio-panel mb-3">
            <div class="d-flex justify-content-between align-items-center mb-2">
              <h6 class="mb-0">Audio</h6>
              <span class="small text-muted">Audio 1 / 1</span>
            </div>
            <audio id="${audioId}" controls preload="none" class="w-100 mb-2" src="${d.audio || ''}"></audio>
            <div class="small" id="audio-status-label">Đang phát audio 1...</div>
          </div>

          <p class="fw-semibold mb-2">Câu hỏi: ${esc(d.prompt)}</p>
          <label class="form-label fw-semibold">Câu trả lời của bạn</label>
          <textarea class="form-control answer-box" id="answer-${d.key}"
                    placeholder="Nhập câu trả lời hoặc transcript bạn nói..."
                    oninput="userAnswers['${d.key}']=this.value; document.getElementById('wc-${d.key}').textContent=this.value.split(/\\s+/).filter(Boolean).length+' từ';">${esc(saved)}</textarea>
          <div class="d-flex justify-content-between align-items-center mt-2">
            <small class="text-muted">Bạn có thể quay lại để chỉnh sửa trước khi nộp bài.</small>
            <span class="badge bg-light text-dark" id="wc-${d.key}">${wc} từ</span>
          </div>
        </div>
      </div>

      <div class="text-center mt-3">
        <div class="speaking-timer-ring running" id="speaking-ring">
          <span id="speaking-seconds">${page.responseSeconds}</span>
        </div>
        <div class="speaking-status" id="speaking-timer-status">Đang chờ audio...</div>
      </div>
    </div>`;
}

function playSpeakingQuestionAudio(page) {
  clearSpeakingTimer();
  const audioId = 'sp-q-audio-' + page.idx;
  const audio = document.getElementById(audioId);
  const statusLabel = document.getElementById('audio-status-label');
  const hintEl = document.getElementById('speaking-status');
  const timerStatus = document.getElementById('speaking-timer-status');

  const startTimer = () => {
    if (statusLabel) statusLabel.textContent = 'Audio xong.';
    if (hintEl) hintEl.textContent = `Hệ thống sẽ tự chuyển sang câu tiếp theo sau khi hết thời gian.`;
    if (timerStatus) timerStatus.textContent = `Thời gian trả lời: ${page.responseSeconds} giây`;
    startSpeakingTimer(page);
  };

  if (!audio || !audio.src || audio.src.endsWith('/')) {
    if (statusLabel) statusLabel.textContent = 'Không có audio.';
    startTimer();
    return;
  }

  audio.play().catch(() => { startTimer(); });
  if (statusLabel) statusLabel.textContent = 'Đang phát audio 1...';

  audio.onended = function () {
    startTimer();
  };

  audio.onerror = function () {
    startTimer();
  };
}

function startSpeakingTimer(page) {
  clearSpeakingTimer();
  let remaining = page.responseSeconds || 30;
  const ring = document.getElementById('speaking-ring');
  const seconds = document.getElementById('speaking-seconds');
  const status = document.getElementById('speaking-timer-status') || document.getElementById('speaking-status');

  if (seconds) seconds.textContent = remaining;
  if (ring) ring.className = 'speaking-timer-ring running';

  speakingTimerInterval = setInterval(() => {
    remaining--;
    if (seconds) seconds.textContent = remaining;

    if (remaining <= 5 && ring) ring.className = 'speaking-timer-ring warning';

    if (status) status.textContent = `Thời gian trả lời: ${remaining} giây`;

    if (remaining <= 0) {
      clearSpeakingTimer();
      if (ring) ring.className = 'speaking-timer-ring expired';
      if (seconds) seconds.textContent = '0';
      if (status) status.textContent = 'Hết giờ!';

      startWaitBeforeNext(page);
    }
  }, 1000);
}

function startWaitBeforeNext(page) {
  const waitSec = Math.max(0, Number(page.waitSeconds) || 0);
  const isLastOverallPage = currentPage >= pages.length - 1;
  // Check if next page is also speaking — if not, just move on immediately
  const nextPage = pages[currentPage + 1];
  const speakingTypes = ['speaking-q', 'speaking-image', 'speaking-intro', 'speaking-audio-q'];
  const nextIsSpeaking = nextPage && speakingTypes.includes(nextPage.type);

  if (isLastOverallPage) {
    const status = document.getElementById('speaking-status');
    if (status) status.textContent = 'Đã hoàn thành!';
    setTimeout(() => { saveCurrent(); renderPage(pages.length); }, 2000);
    return;
  }

  if (!nextIsSpeaking) {
    // Next page is writing or another type → go there after short wait
    const status = document.getElementById('speaking-status');
    if (status) status.textContent = 'Chuyển sang phần tiếp theo...';
    setTimeout(() => { saveCurrent(); renderPage(currentPage + 1); }, 2000);
    return;
  }

  if (waitSec <= 0) {
    const status = document.getElementById('speaking-status');
    if (status) status.textContent = 'Chuyển sang câu tiếp theo...';
    saveCurrent();
    renderPage(currentPage + 1);
    return;
  }

  // Show wait overlay
  const container = document.getElementById('pageContent');
  const ring = document.getElementById('speaking-ring');
  const seconds = document.getElementById('speaking-seconds');
  const status = document.getElementById('speaking-status');

  if (ring) ring.style.display = 'none';
  if (status) status.innerHTML = `<strong>Chuẩn bị câu tiếp theo...</strong>`;

  let wait = waitSec;
  if (seconds) {
    seconds.parentElement.style.display = '';
    // Reuse ring for countdown
  }

  const waitEl = document.createElement('div');
  waitEl.className = 'speaking-wait-overlay';
  waitEl.innerHTML = `
    <h4><i class="bi bi-hourglass-split me-2"></i>Câu tiếp theo trong <span id="wait-count">${wait}</span>s</h4>
  `;
  const qCard = container.querySelector('.speaking-card') || container.querySelector('.question-card');
  if (qCard) qCard.querySelector('.card-body')?.appendChild(waitEl) || qCard.appendChild(waitEl);

  const waitInterval = setInterval(() => {
    wait--;
    const waitCount = document.getElementById('wait-count');
    if (waitCount) waitCount.textContent = wait;
    if (wait <= 0) {
      clearInterval(waitInterval);
      saveCurrent();
      renderPage(currentPage + 1);
    }
  }, 1000);
}

function updateSpeakingHeader() {
  const dotsContainer = document.getElementById('headerPageDots');
  const labelEl = document.getElementById('step-label-speaking');
  const speakingTypes = ['speaking-q', 'speaking-image', 'speaking-intro', 'speaking-audio-q'];

  // Count speaking pages and find current index within them
  const speakingPages = pages.filter(p => speakingTypes.includes(p.type));
  const totalSpeaking = speakingPages.length;
  const currentSpeakingIdx = speakingPages.indexOf(pages[currentPage]);

  // Build dots
  if (dotsContainer) {
    dotsContainer.innerHTML = pages.map((p, i) => {
      if (!speakingTypes.includes(p.type)) return '';
      let cls = 'page-dot';
      if (i < currentPage) cls += ' done';
      else if (i === currentPage) cls += ' active';
      return `<div class="${cls}"></div>`;
    }).join('');
  }

  // Update label
  if (labelEl) {
    const pg = pages[currentPage];
    const normalizedPart = resolvePageDisplayPartLabel(pg, '');
    labelEl.textContent = pg?.partLabel || (normalizedPart ? `Speaking ${normalizedPart}` : 'Speaking Practice');
  }
}

function clearSpeakingTimer() {
  if (speakingTimerInterval) {
    clearInterval(speakingTimerInterval);
    speakingTimerInterval = null;
  }
}

/* ═══════════════════════════════════════════════════════
   RENDER – WRITING Part 2: Sentences (5 câu, 20-30 từ mỗi câu)
   ═══════════════════════════════════════════════════════ */

function renderWritingSentences(page) {
  const d = page.data;

  const qsHtml = d.questions.map(q => {
    const saved = userAnswers[q.key] || '';
    const wc = saved.split(/\s+/).filter(Boolean).length;
    return `
      <div class="writing-q-item">
        <div class="writing-sentence-prompt">${esc(q.prompt)}</div>
        <textarea class="form-control writing-textarea" name="${q.key}" rows="3"
                  data-min="${q.minWords}" data-max="${q.maxWords}"
                  placeholder="Viết ${q.minWords}-${q.maxWords} từ..."
                  oninput="updateWordCount(this); userAnswers['${q.key}']=this.value;">${esc(saved)}</textarea>
        <div class="word-counter" id="wc-${q.key}">Số từ: ${wc} / ${q.maxWords}</div>
      </div>`;
  }).join('');

  const pageLabel = page.totalPages > 1 ? ` (${page.pageIdx + 1}/${page.totalPages})` : '';
  const title = page.headerTitle
    ? esc(page.headerTitle)
    : (d.headerTitle ? esc(d.headerTitle) : `${esc(resolvePageDisplayPartLabel(page, 'Part 2'))} – Sentences${pageLabel}`);

  return `
    <div class="question-card legacy-skill-card legacy-writing-card">
      <div class="q-number-label">${title}</div>
      <div class="writing-topic-bar">${esc(d.instruction)}</div>
      ${qsHtml}
    </div>`;
}

/* ═══════════════════════════════════════════════════════
   RENDER – WRITING Part 3: Chat responses (3 câu, 30-40 từ mỗi câu)
   ═══════════════════════════════════════════════════════ */

function renderWritingChat(page) {
  const d = page.data;

  const qsHtml = d.questions.map(q => {
    const saved = userAnswers[q.key] || '';
    const wc = saved.split(/\s+/).filter(Boolean).length;
    return `
      <div class="writing-q-item">
        <label>${esc(q.prompt)}</label>
        <textarea class="form-control writing-textarea" name="${q.key}" rows="4"
                  data-min="${q.minWords}" data-max="${q.maxWords}"
                  placeholder="Viết ${q.minWords}-${q.maxWords} từ..."
                  oninput="updateWordCount(this); userAnswers['${q.key}']=this.value;">${esc(saved)}</textarea>
        <div class="word-counter" id="wc-${q.key}">Số từ: ${wc} / ${q.maxWords}</div>
      </div>`;
  }).join('');

  const pageLabel = page.totalPages > 1 ? ` (${page.pageIdx + 1}/${page.totalPages})` : '';
  const title = page.headerTitle
    ? esc(page.headerTitle)
    : (d.headerTitle ? esc(d.headerTitle) : `${esc(resolvePageDisplayPartLabel(page, 'Part 3'))} – ${esc(d.topic)}${pageLabel}`);
  const topicHtml = d.topic ? `<div class="topic-banner">${esc(d.topic)}</div>` : '';
  const instructionHtml = d.topicInstruction
    ? `<div class="writing-topic-bar">${esc(d.topicInstruction)}</div>`
    : '';

  return `
    <div class="question-card legacy-skill-card legacy-writing-card">
      <div class="q-number-label">${title}</div>
      ${topicHtml}
      ${instructionHtml}
      ${qsHtml}
    </div>`;
}

/* ═══════════════════════════════════════════════════════
   WRITING – Submit & AI Auto-grade
   ═══════════════════════════════════════════════════════ */

async function submitWritingForGrading() {
  if (!ensureSessionUnlockedOrNotify()) return null;

  const sessionKey = `${ACTIVE_BAND}-${SESSION}`;
  const session = ACTIVE_SESSION || SESSIONS[sessionKey];
  if (!session) return null;
  const classSet = ACCESS_CONTEXT?.classSet || null;

  // Keep structure close to Aptis writing flow: part1/part2/part3/part4.
  // Important: append across multiple pages of the same type (no overwrite).
  const collected = {};
  const ensurePartBucket = (partKey) => {
    if (!collected[partKey]) collected[partKey] = [];
    return collected[partKey];
  };
  const toWordCount = (value) => {
    const text = String(value || '').trim();
    if (!text) return 0;
    return text.split(/\s+/).filter(Boolean).length;
  };
  const pushAnswer = (partKey, key, prompt) => {
    const answer = (userAnswers[key] || '').trim();
    ensurePartBucket(partKey).push({
      key,
      prompt: prompt || '',
      answer,
      word_count: toWordCount(answer)
    });
  };

  pages.forEach((pg) => {
    if (pg.type === 'writing-short' && Array.isArray(pg?.data?.questions)) {
      pg.data.questions.forEach((q, index) => {
        const key = q?.key || `part1_q_${index + 1}`;
        pushAnswer('part1', key, q?.prompt || '');
      });
      return;
    }

    if (pg.type === 'writing-sentences' && Array.isArray(pg?.data?.questions)) {
      pg.data.questions.forEach((q, index) => {
        const key = q?.key || `part2_q_${index + 1}`;
        pushAnswer('part2', key, q?.prompt || '');
      });
      return;
    }

    if (pg.type === 'writing-chat' && Array.isArray(pg?.data?.questions)) {
      pg.data.questions.forEach((q, index) => {
        const key = q?.key || `part3_q_${index + 1}`;
        pushAnswer('part3', key, q?.prompt || '');
      });
      return;
    }

    if (pg.type === 'writing-email' && Array.isArray(pg?.data?.emails)) {
      pg.data.emails.forEach((e, index) => {
        const key = e?.key || `part4_q_${index + 1}`;
        pushAnswer('part4', key, e?.label || '');
      });
      return;
    }

    if (pg.type === 'writing-describe-image') {
      const q = pg?.data?.mainQuestion || {};
      const key = q?.key || 'part1_describe';
      pushAnswer('part1', key, q?.prompt || '');
      return;
    }

    if (pg.type === 'writing-followup' && Array.isArray(pg?.data?.followUps)) {
      pg.data.followUps.forEach((q, index) => {
        const key = q?.key || `part2_followup_${index + 1}`;
        pushAnswer('part2', key, q?.prompt || '');
      });
    }
  });

  const allItems = Object.values(collected).flat();
  const totalWords = allItems.reduce((s, a) => s + a.word_count, 0);

  const metadata = {
    submission_kind: 'homework',
    band: ACTIVE_BAND,
    source: 'buoi_hoc',
    session: SESSION,
    session_number: SESSION,
    session_key: sessionKey,
    session_type: 'writing',
    class_id: classSet?.id || null,
    class_title: classSet?.title || classSet?.data?.name || null,
    user_answers: collected,
    total_words: totalWords,
    writing_submitted_at: new Date().toISOString(),
    homework_submitted_at: new Date().toISOString()
  };

  try {
    const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
    const deviceId = localStorage.getItem('device_id') || 'browser';
    const res = await fetch('/api/practice_results/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'X-Device-Id': deviceId,
        'X-Device-Name': navigator.userAgent.substring(0, 50)
      },
      body: JSON.stringify({
        practiceType: 'writing',
        mode: 'set',
        setId: classSet?.id || null,
        setTitle: classSet?.title
          ? `${classSet.title} - Buổi ${SESSION}`
          : `Lớp Học ${ACTIVE_BAND} Buổi ${SESSION}`,
        totalScore: 0,
        maxScore: 0,
        durationSeconds: Math.max(0, Math.round(((session.timer || 50) * 60 - timerSeconds))),
        metadata
      })
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.error('Writing submit error:', err);
    return null;
  }
}

/* ═══════════════════════════════════════════════════════
   AUDIO PLAYER
   ═══════════════════════════════════════════════════════ */

function playAudio(audioId) {
  const audio = document.getElementById(audioId);
  if (!audio) return;

  if (!audio.paused) {
    audio.pause();
    updatePlayIcon(audioId, false);
    return;
  }

  if (audioPlaysLeft[audioId] <= 0) return;

  audio.play().catch(() => {});
  updatePlayIcon(audioId, true);

  // Track progress
  audio.ontimeupdate = function () {
    const range = document.getElementById('range-' + audioId);
    if (range && audio.duration) {
      range.value = (audio.currentTime / audio.duration) * 100;
    }
  };

  audio.onended = function () {
    audioPlaysLeft[audioId]--;
    updatePlayIcon(audioId, false);
    const label = document.getElementById('playsLabel-' + audioId);
    if (label) label.textContent = `${audioPlaysLeft[audioId]} of 2 plays remaining`;
    const btn = document.getElementById('playBtn-' + audioId);
    if (btn && audioPlaysLeft[audioId] <= 0) btn.disabled = true;
    audio.currentTime = 0;
    const range = document.getElementById('range-' + audioId);
    if (range) range.value = 0;
  };
}

function seekAudio(audioId, value) {
  const audio = document.getElementById(audioId);
  if (audio && audio.duration) {
    audio.currentTime = (value / 100) * audio.duration;
  }
}

function updatePlayIcon(audioId, isPlaying) {
  const icon = document.getElementById('playIcon-' + audioId);
  if (icon) {
    icon.className = isPlaying ? 'bi bi-pause-fill' : 'bi bi-play-fill';
  }
}

/* ═══════════════════════════════════════════════════════
   ANSWER PICKING
   ═══════════════════════════════════════════════════════ */

function pickAnswer(key, value, el) {
  userAnswers[key] = value;
  el.closest('.option-list').querySelectorAll('.option-item').forEach(li => li.classList.remove('selected'));
  el.classList.add('selected');
}

function saveCurrent() {
  document.querySelectorAll('.vocab-select, .reading-gap-select, .reading-heading-select, [name^="rm-"]').forEach(sel => {
    if (sel.name && sel.value) userAnswers[sel.name] = sel.value;
  });
  // Save ordering state from drag containers
  document.querySelectorAll('[id^="order-container-"]').forEach(container => {
    const idx = container.id.replace('order-container-', '');
    const cards = container.querySelectorAll('.draggable-card');
    const order = [];
    cards.forEach(c => order.push(c.dataset.text));
    if (order.length) userAnswers['order-' + idx] = order;
  });
  // Save writing inputs & textareas
  document.querySelectorAll('.writing-input, .writing-textarea').forEach(el => {
    if (el.name) userAnswers[el.name] = el.value;
  });
}

/* ═══════════════════════════════════════════════════════
   NAVIGATION
   ═══════════════════════════════════════════════════════ */

function goNext() {
  if (!ensureSessionUnlockedOrNotify()) return;
  saveCurrent();
  if (currentPage === pages.length - 1) {
    if (!confirm('Bạn có chắc muốn nộp bài?')) return;
    renderPage(pages.length);
    return;
  }
  if (currentPage < pages.length) renderPage(currentPage + 1);
}

function goBack() {
  saveCurrent();
  if (currentPage > 0) renderPage(currentPage - 1);
}

function updateUI() {
  const backBtn = document.getElementById('backButton');
  const nextBtn = document.getElementById('nextButton');
  const stepLabel = document.getElementById('step-label');
  const progressBar = document.getElementById('progressBar');
  const headerDefault = document.getElementById('header-default');
  const headerSpeaking = document.getElementById('header-speaking');

  backBtn.disabled = currentPage === 0;

  const pgType = currentPage < pages.length ? pages[currentPage]?.type : '';
  const speakingTypes = ['speaking-q', 'speaking-image', 'speaking-intro', 'speaking-audio-q'];
  const isSpeakingPage = speakingTypes.includes(pgType);

  // Switch header mode
  if (headerDefault && headerSpeaking) {
    if (isSpeakingPage) {
      headerDefault.style.setProperty('display', 'none', 'important');
      headerSpeaking.style.setProperty('display', 'block', 'important');
      updateSpeakingHeader();
    } else {
      headerDefault.style.setProperty('display', 'flex', 'important');
      headerSpeaking.style.setProperty('display', 'none', 'important');
    }
  }

  if (pgType === 'speaking-intro' || pgType === 'speaking-audio-q' || pgType === 'speaking-image' || pgType === 'speaking-q') {
    backBtn.innerHTML = '<i class="bi bi-arrow-left me-1"></i>Quay lại';
    backBtn.style.display = '';
    backBtn.disabled = currentPage === 0;
    nextBtn.innerHTML = 'Tiếp theo<i class="bi bi-arrow-right ms-1"></i>';
    nextBtn.style.display = '';
    nextBtn.className = 'btn btn-next';
  } else if (currentPage === pages.length - 1) {
    nextBtn.textContent = 'Nộp bài';
    nextBtn.innerHTML = 'Nộp bài';
    nextBtn.className = 'btn btn-check-result';
    nextBtn.style.display = '';
    backBtn.innerHTML = '<i class="bi bi-arrow-left me-1"></i>Quay lại';
    backBtn.style.display = '';
    backBtn.disabled = false;
  } else if (currentPage >= pages.length) {
    nextBtn.style.display = 'none';
    backBtn.style.display = 'none';
  } else {
    nextBtn.innerHTML = 'Next';
    nextBtn.className = 'btn btn-next';
    nextBtn.style.display = '';
    backBtn.innerHTML = 'Back';
    backBtn.style.display = '';
    backBtn.disabled = currentPage === 0;
  }

  // Step label
  if (currentPage < pages.length) {
    const pg = pages[currentPage];
    if (pg.stepLabel) {
      stepLabel.textContent = pg.stepLabel;
    } else if (pg.type === 'grammar') {
      const total = pages.filter(p => p.type === 'grammar').length;
      stepLabel.textContent = `Grammar – Câu ${pg.idx + 1} / ${total}`;
    } else if (pg.type === 'vocab') {
      stepLabel.textContent = `Vocabulary – Part ${pg.partNum}`;
    } else if (pg.type === 'listening-q') {
      stepLabel.textContent = `Listening Part 1 – Câu ${pg.idx + 1} / ${pg.totalInPart}`;
    } else if (pg.type === 'listening-topic') {
      stepLabel.textContent = `Listening ${resolvePageDisplayPartLabel(pg, 'Part 2')}`;
    } else if (pg.type === 'listening-opinion') {
      stepLabel.textContent = `Listening ${resolvePageDisplayPartLabel(pg, 'Part 1')} – Bài ${pg.idx + 1} / ${pg.totalInPart}`;
    } else if (pg.type === 'listening-mcq-batch') {
      stepLabel.textContent = `Listening ${resolvePageDisplayPartLabel(pg, 'Part 2')}`;
    } else if (pg.type === 'reading-gap') {
      stepLabel.textContent = `Reading ${resolvePageDisplayPartLabel(pg, 'Part 1')} – Câu ${pg.idx + 1} / ${pg.totalInPart}`;
    } else if (pg.type === 'reading-order') {
      stepLabel.textContent = `Reading ${resolvePageDisplayPartLabel(pg, 'Part 2')} – Câu ${pg.idx + 1} / ${pg.totalInPart}`;
    } else if (pg.type === 'reading-match') {
      stepLabel.textContent = `Reading ${resolvePageDisplayPartLabel(pg, 'Part 3')} – Câu ${pg.idx + 1} / ${pg.totalInPart}`;
    } else if (pg.type === 'reading-heading') {
      stepLabel.textContent = `Reading ${resolvePageDisplayPartLabel(pg, 'Part 4')} – Câu ${pg.idx + 1} / ${pg.totalInPart}`;
    } else if (pg.type === 'writing-short') {
      stepLabel.textContent = `Writing – ${resolvePageDisplayPartLabel(pg, 'Part 1')}`;
    } else if (pg.type === 'writing-email') {
      stepLabel.textContent = `Writing – ${resolvePageDisplayPartLabel(pg, 'Part 2')}`;
    } else if (pg.type === 'writing-describe-image') {
      stepLabel.textContent = `Writing – ${resolvePageDisplayPartLabel(pg, 'Mô tả hình ảnh')}`;
    } else if (pg.type === 'writing-followup') {
      stepLabel.textContent = `Writing – ${resolvePageDisplayPartLabel(pg, 'Câu hỏi phụ')}`;
    } else if (pg.type === 'writing-sentences') {
      const lbl = pg.totalPages > 1 ? ` (${pg.pageIdx+1}/${pg.totalPages})` : '';
      stepLabel.textContent = `Writing – ${resolvePageDisplayPartLabel(pg, 'Part 2')}${lbl}`;
    } else if (pg.type === 'writing-chat') {
      const lbl = pg.totalPages > 1 ? ` (${pg.pageIdx+1}/${pg.totalPages})` : '';
      stepLabel.textContent = `Writing – ${resolvePageDisplayPartLabel(pg, 'Part 3')}${lbl}`;
    } else if (pg.type === 'speaking-q') {
      stepLabel.textContent = `Speaking ${resolvePageDisplayPartLabel(pg, 'Part 1')} – Câu ${pg.idx+1} / ${pg.totalQ}`;
    } else if (pg.type === 'speaking-image') {
      stepLabel.textContent = pg.partLabel || `Speaking – Câu ${pg.idx+1}`;
    } else if (pg.type === 'speaking-intro') {
      stepLabel.textContent = pg.partLabel || 'Speaking – Giới thiệu';
    } else if (pg.type === 'speaking-audio-q') {
      stepLabel.textContent = pg.partLabel || 'Speaking – Câu hỏi';
    }
  } else {
    stepLabel.textContent = 'Kết quả';
  }

  const pct = Math.min(100, Math.round((currentPage / pages.length) * 100));
  if (progressBar) progressBar.style.width = pct + '%';
}

/* ═══════════════════════════════════════════════════════
   TIMER
   ═══════════════════════════════════════════════════════ */

function startTimer() {
  updateTimerDisplay();
  timerInterval = setInterval(() => {
    timerSeconds--;
    if (timerSeconds <= 0) { clearInterval(timerInterval); timerSeconds = 0; saveCurrent(); renderPage(pages.length); }
    updateTimerDisplay();
  }, 1000);
}

function updateTimerDisplay() {
  const m = Math.floor(timerSeconds / 60);
  const s = timerSeconds % 60;
  const el = document.getElementById('countdownTimer');
  if (el) el.textContent = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

/* ═══════════════════════════════════════════════════════
   RESULTS
   ═══════════════════════════════════════════════════════ */

function renderResultsPage() {
  clearInterval(timerInterval);
  const sessionKey = `${ACTIVE_BAND}-${SESSION}`;
  const session = ACTIVE_SESSION || SESSIONS[sessionKey];
  if (!session) return '<div class="question-card"><p>Lỗi</p></div>';

  let totalCorrect = 0;
  let totalQ = 0;
  let rows = '';

  pages.forEach((pg, i) => {
    if (pg.type === 'grammar') {
      totalQ++;
      const user = userAnswers['g-' + pg.idx] || '(chưa chọn)';
      const ok = user === pg.data.answer;
      if (ok) totalCorrect++;
      rows += `<tr><td>Grammar ${pg.idx+1}</td><td>${esc(pg.data.q)}</td><td class="${ok?'result-correct':'result-incorrect'}">${esc(user)}</td><td class="result-correct">${esc(pg.data.answer)}</td></tr>`;
    }
    else if (pg.type === 'listening-q') {
      totalQ++;
      const user = userAnswers['lq-' + pg.idx] || '(chưa chọn)';
      const ok = user === pg.data.answer;
      if (ok) totalCorrect++;
      rows += `<tr><td>Listening ${pg.idx+1}</td><td>${esc(pg.data.q)}</td><td class="${ok?'result-correct':'result-incorrect'}">${esc(user)}</td><td class="result-correct">${esc(pg.data.answer)}</td></tr>`;
    }
    else if (pg.type === 'listening-topic') {
      pg.data.persons.forEach((person, pi) => {
        totalQ++;
        const user = userAnswers['lt-' + pi];
        const correctIdx = pg.data.answers[pi];
        const ok = user == correctIdx;
        if (ok) totalCorrect++;
        const userText = user !== undefined && user !== '' ? pg.data.options[user] : '(chưa chọn)';
        const correctText = pg.data.options[correctIdx];
        rows += `<tr><td>${esc(person)}</td><td>${esc(pg.data.topic)}</td><td class="${ok?'result-correct':'result-incorrect'}">${esc(userText)}</td><td class="result-correct">${esc(correctText)}</td></tr>`;
      });
    }
    else if (pg.type === 'listening-opinion') {
      const options = ['Man', 'Woman', 'Both'];
      pg.data.statements.forEach((text, si) => {
        totalQ++;
        const key = `lop-${pg.idx}-${si}`;
        const user = userAnswers[key] || '(chưa chọn)';
        const correct = pg.data.answers[si];
        const ok = user === correct;
        if (ok) totalCorrect++;
        rows += `<tr><td>Listening P1 ${pg.idx+1}.${si+1}</td><td>${esc(text)}</td><td class="${ok?'result-correct':'result-incorrect'}">${esc(user)}</td><td class="result-correct">${esc(correct || options[0])}</td></tr>`;
      });
    }
    else if (pg.type === 'listening-mcq-batch') {
      pg.data.questions.forEach((q, qi) => {
        totalQ++;
        const key = `lmb-${pg.idx}-${qi}`;
        const user = userAnswers[key] || '(chưa chọn)';
        const correct = q.answer;
        const ok = user === correct;
        if (ok) totalCorrect++;
        rows += `<tr><td>Listening P2 ${qi+1}</td><td>${esc(q.question)}</td><td class="${ok?'result-correct':'result-incorrect'}">${esc(user)}</td><td class="result-correct">${esc(correct)}</td></tr>`;
      });
    }
    else if (pg.type === 'reading-gap') {
      pg.data.rows.forEach((r, ri) => {
        totalQ++;
        const key = `rg-${pg.idx}-${ri}`;
        const user = userAnswers[key] || '(chưa chọn)';
        const ok = user === r.answer;
        if (ok) totalCorrect++;
        rows += `<tr><td>R-Gap ${pg.idx+1}.${ri+1}</td><td>${esc(r.before)} ___ ${esc(r.after)}</td><td class="${ok?'result-correct':'result-incorrect'}">${esc(user)}</td><td class="result-correct">${esc(r.answer)}</td></tr>`;
      });
    }
    else if (pg.type === 'reading-order') {
      const correct = pg.data.sentences.slice(1); // correct order (without first)
      const userOrder = userAnswers['order-' + pg.idx] || [];
      correct.forEach((s, si) => {
        totalQ++;
        const userS = userOrder[si] || '(chưa sắp xếp)';
        const ok = userS === s;
        if (ok) totalCorrect++;
        rows += `<tr><td>R-Order ${pg.idx+1}.${si+1}</td><td>Vị trí ${si+2}</td><td class="${ok?'result-correct':'result-incorrect'}">${esc(userS)}</td><td class="result-correct">${esc(s)}</td></tr>`;
      });
    }
    else if (pg.type === 'reading-match') {
      pg.data.questions.forEach((q, qi) => {
        totalQ++;
        const key = `rm-${pg.idx}-${qi}`;
        const user = userAnswers[key] || '(chưa chọn)';
        const ok = user === q.answer;
        if (ok) totalCorrect++;
        rows += `<tr><td>R-Match ${pg.idx+1}.${qi+1}</td><td>${esc(q.prompt)}</td><td class="${ok?'result-correct':'result-incorrect'}">${esc(user)}</td><td class="result-correct">${esc(q.answer)}</td></tr>`;
      });
    }
    else if (pg.type === 'reading-heading') {
      pg.data.paragraphs.forEach((text, pi) => {
        totalQ++;
        const key = `rh-${pg.idx}-${pi}`;
        const user = userAnswers[key];
        const correctIdx = pg.data.answers[pi];
        const ok = user == correctIdx;
        if (ok) totalCorrect++;
        const userLabel = user !== undefined && user !== '' ? pg.data.headings[user] : '(chưa chọn)';
        const correctLabel = pg.data.headings[correctIdx];
        rows += `<tr><td>R-Heading ${pg.idx+1}.${pi+1}</td><td>${esc(text).substring(0,60)}...</td><td class="${ok?'result-correct':'result-incorrect'}">${esc(userLabel)}</td><td class="result-correct">${esc(correctLabel)}</td></tr>`;
      });
    }
    else if (pg.type === 'vocab') {
      const items = pg.data.words || pg.data.sentences;
      items.forEach(item => {
        totalQ++;
        const name = 'v' + pg.partKey.replace('part','p') + '-q' + item.num;
        const user = userAnswers[name] || '';
        const ok = user === item.answer;
        if (ok) totalCorrect++;
        const userLabel = user ? user + '. ' + (pg.data.options.find(o=>o.letter===user)?.word||'') : '(chưa chọn)';
        const correctLabel = item.answer + '. ' + (pg.data.options.find(o=>o.letter===item.answer)?.word||'');
        rows += `<tr><td>Vocab ${item.num}</td><td>${esc(item.word||item.text||(item.before+' ___ '+item.after))}</td><td class="${ok?'result-correct':'result-incorrect'}">${esc(userLabel)}</td><td class="result-correct">${esc(correctLabel)}</td></tr>`;
      });
    }
    else if (pg.type === 'speaking-intro') {
      // Intro pages have no answers, skip
    }
    else if (pg.type === 'speaking-q' || pg.type === 'speaking-image' || pg.type === 'speaking-audio-q') {
      totalQ++;
      const ansKey = pg.data.key || ('sp-' + pg.idx);
      const note = userAnswers[ansKey] || '(không có ghi chú)';
      const label = pg.partLabel || 'Speaking';
      rows += `<tr><td>${esc(label)}</td><td>${esc(pg.data.prompt)}</td><td colspan="2"><em>${esc(note)}</em></td></tr>`;
    }
  });

  const hasSpeaking = pages.some(p => ['speaking-q','speaking-image','speaking-intro','speaking-audio-q'].includes(p.type));
  const writingTypes = ['writing-short','writing-email','writing-sentences','writing-chat','writing-describe-image','writing-followup'];
  const hasWriting = pages.some(p => writingTypes.includes(p.type));

  submitHomeworkResultIfNeeded(totalCorrect, totalQ);

  if (hasSpeaking) clearSpeakingTimer();

  // Pure speaking session
  if (hasSpeaking && !hasWriting) {
    return `
      <div class="question-card">
        <div class="card shadow-sm border-0 mb-4">
          <div class="card-body text-center">
            <i class="bi bi-mic fs-2 text-primary mb-2 d-block"></i>
            <h4 class="fw-bold">Hoàn thành Speaking!</h4>
          </div>
        </div>
        <h5 class="fw-bold mb-3">Câu hỏi & Ghi chú</h5>
        <div class="table-responsive" style="padding-bottom:60px;">
          <table class="table table-striped table-sm">
            <thead><tr><th>Câu</th><th>Câu hỏi</th><th colspan="2">Ghi chú</th></tr></thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
      </div>`;
  }

  // Pure writing or mixed speaking+writing session
  if (hasWriting) {
    return renderWritingResults();
  }

  return `
    <div class="question-card">
      <div class="card shadow-sm border-0 mb-4">
        <div class="card-body text-center">
          <p class="text-muted mb-1">Kết quả bài làm</p>
          <h3 class="fw-bold" style="color:#16a34a;">${totalCorrect} / ${totalQ}</h3>
        </div>
      </div>
      <div class="table-responsive" style="padding-bottom:60px;">
        <table class="table table-striped table-sm">
          <thead><tr><th>Câu</th><th>Nội dung</th><th>Bạn chọn</th><th>Đáp án</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    </div>`;
}

function renderWritingResults() {
  // Generic: render all writing page answers
  const sections = [];

  pages.forEach(pg => {
    if (pg.type === 'writing-short') {
      const items = pg.data.questions.map(q => {
        const ans = userAnswers[q.key] || '(chưa trả lời)';
        return `<div class="writing-q-item">
          <label>${esc(q.prompt)}</label>
          <div class="p-2 bg-light border rounded" style="font-size:0.95rem;">${esc(ans)}</div>
          <div id="ai-fb-${q.key}"></div>
        </div>`;
      }).join('');
      const sectionTitle = pg.headerTitle
        ? esc(pg.headerTitle)
        : (pg.data.headerTitle ? esc(pg.data.headerTitle) : `${esc(resolvePageDisplayPartLabel(pg, 'Part 1'))} – Short answers`);
      sections.push(`<h5 class="fw-bold mb-3">${sectionTitle}</h5>${items}`);
    }
    if (pg.type === 'writing-sentences') {
      const items = pg.data.questions.map(q => {
        const ans = userAnswers[q.key] || '(chưa trả lời)';
        const wc = ans.split(/\s+/).filter(Boolean).length;
        return `<div class="writing-q-item">
          <label>${esc(q.prompt)}</label>
          <div class="p-3 bg-light border rounded" style="font-size:0.95rem; white-space:pre-wrap;">${esc(ans)}</div>
          <div class="word-counter">Số từ: ${wc}</div>
          <div id="ai-fb-${q.key}"></div>
        </div>`;
      }).join('');
      const sectionTitle = pg.headerTitle
        ? esc(pg.headerTitle)
        : (pg.data.headerTitle ? esc(pg.data.headerTitle) : `${esc(resolvePageDisplayPartLabel(pg, 'Part 2'))} – Sentences`);
      sections.push(`<h5 class="fw-bold mb-3">${sectionTitle}</h5>${items}`);
    }
    if (pg.type === 'writing-chat') {
      const items = pg.data.questions.map(q => {
        const ans = userAnswers[q.key] || '(chưa trả lời)';
        const wc = ans.split(/\s+/).filter(Boolean).length;
        return `<div class="writing-q-item">
          <label>${esc(q.prompt)}</label>
          <div class="p-3 bg-light border rounded" style="font-size:0.95rem; white-space:pre-wrap;">${esc(ans)}</div>
          <div class="word-counter">Số từ: ${wc}</div>
          <div id="ai-fb-${q.key}"></div>
        </div>`;
      }).join('');
      const sectionTitle = pg.headerTitle
        ? esc(pg.headerTitle)
        : (pg.data.headerTitle ? esc(pg.data.headerTitle) : `${esc(resolvePageDisplayPartLabel(pg, 'Part 3'))} – Chat responses`);
      sections.push(`<h5 class="fw-bold mb-3">${sectionTitle}</h5>${items}`);
    }
    if (pg.type === 'writing-email') {
      const items = pg.data.emails.map(e => {
        const ans = userAnswers[e.key] || '(chưa viết)';
        const wc = ans.split(/\s+/).filter(Boolean).length;
        return `<div class="writing-q-item">
          <label>${esc(e.label)}</label>
          <div class="p-3 bg-light border rounded" style="font-size:0.95rem; white-space:pre-wrap; line-height:1.7;">${esc(ans)}</div>
          <div class="word-counter">Số từ: ${wc}</div>
          <div id="ai-fb-${e.key}"></div>
        </div>`;
      }).join('');
      const sectionTitle = pg.headerTitle
        ? esc(pg.headerTitle)
        : (pg.data.headerTitle ? esc(pg.data.headerTitle) : `${esc(resolvePageDisplayPartLabel(pg, 'Part 2'))} – Emails`);
      sections.push(`<h5 class="fw-bold mb-3">${sectionTitle}</h5>${items}`);
    }
    if (pg.type === 'writing-describe-image') {
      const q = pg.data.mainQuestion;
      const ans = userAnswers[q.key] || '(chưa viết)';
      const wc = ans.split(/\s+/).filter(Boolean).length;
      const imgHtml = pg.data.image ? `<div class="mb-2"><img src="${pg.data.image}" class="page-image" style="max-width:100%;max-height:250px;" onerror="this.style.display='none';"></div>` : '';
      const sectionTitle = pg.headerTitle
        ? esc(pg.headerTitle)
        : (pg.data.headerTitle ? esc(pg.data.headerTitle) : esc(resolvePageDisplayPartLabel(pg, 'Mô tả hình ảnh')));
      sections.push(`<h5 class="fw-bold mb-3">${sectionTitle}</h5>
        ${imgHtml}
        <div class="writing-q-item">
          <label>${esc(q.prompt)}</label>
          <div class="p-3 bg-light border rounded" style="font-size:0.95rem; white-space:pre-wrap;">${esc(ans)}</div>
          <div class="word-counter">Số từ: ${wc}</div>
          <div id="ai-fb-${q.key}"></div>
        </div>`);
    }
    if (pg.type === 'writing-followup') {
      const items = pg.data.followUps.map(q => {
        const ans = userAnswers[q.key] || '(chưa viết)';
        const wc = ans.split(/\s+/).filter(Boolean).length;
        return `<div class="writing-q-item">
          <label>${esc(q.prompt)}</label>
          <div class="p-3 bg-light border rounded" style="font-size:0.95rem; white-space:pre-wrap;">${esc(ans)}</div>
          <div class="word-counter">Số từ: ${wc}</div>
          <div id="ai-fb-${q.key}"></div>
        </div>`;
      }).join('');
      const sectionTitle = pg.headerTitle
        ? esc(pg.headerTitle)
        : (pg.data.headerTitle ? esc(pg.data.headerTitle) : esc(resolvePageDisplayPartLabel(pg, 'Câu hỏi phụ')));
      sections.push(`<h5 class="fw-bold mb-3">${sectionTitle}</h5>${items}`);
    }
  });

  setTimeout(() => triggerAIGrading(), 300);

  return `
    <div class="question-card">
      <div class="card shadow-sm border-0 mb-4">
        <div class="card-body text-center">
          <i class="bi bi-pencil-square fs-2 text-primary mb-2 d-block"></i>
          <p class="text-muted mb-1">Bài Writing đã nộp</p>
          <h4 class="fw-bold">Đang sửa lỗi tự động...</h4>
          <div class="spinner-border spinner-border-sm text-primary mt-2" id="ai-spinner"></div>
          <div id="ai-status" class="mt-2"></div>
        </div>
      </div>
      ${sections.join('<hr class="my-4">')}
      <div id="ai-overall-feedback" class="ai-feedback-section" style="padding-bottom:80px;"></div>
    </div>`;
}

async function triggerAIGrading() {
  const statusEl = document.getElementById('ai-status');
  const spinnerEl = document.getElementById('ai-spinner');

  try {
    const result = await submitWritingForGrading();

    if (spinnerEl) spinnerEl.style.display = 'none';

    if (!result || result.error) {
      if (statusEl) statusEl.innerHTML = `<span class="badge bg-warning text-dark">AI chưa sẵn sàng – bài đã được lưu</span>`;
      return;
    }

    const metadata = result.result?.metadata || result.metadata || {};
    const autoStatus = metadata.auto_grading_status || '';
    const feedback = metadata.auto_writing_feedback;

    if (autoStatus === 'completed' && feedback) {
      if (statusEl) statusEl.innerHTML = `<span class="badge bg-success">Đã sửa lỗi tự động</span>`;

      // Render overall feedback
      const overallEl = document.getElementById('ai-overall-feedback');
      if (overallEl && feedback.overall_feedback) {
        overallEl.innerHTML = `
          <div class="ai-feedback-card">
            <h6><i class="bi bi-chat-dots me-1"></i>Nhận xét chung</h6>
            <p style="font-size:0.9rem; margin:0;">${esc(feedback.overall_feedback)}</p>
          </div>
          ${(feedback.common_errors || []).length ? `
            <div class="ai-feedback-card error-card">
              <h6><i class="bi bi-exclamation-triangle me-1"></i>Lỗi thường gặp</h6>
              <ul class="mb-0" style="font-size:0.88rem;">
                ${feedback.common_errors.map(e => `<li>${esc(e)}</li>`).join('')}
              </ul>
            </div>` : ''}`;
      }

      // Render per-item feedback
      if (feedback.items) {
        feedback.items.forEach(item => {
          const container = document.getElementById('ai-fb-' + item.key);
          if (!container) return;

          const original = userAnswers[item.key] || '';
          const corrected = item.corrected_answer || '';
          const diffHtml = buildSimpleDiff(original, corrected);

          container.innerHTML = `
            <div class="ai-feedback-card mt-2">
              <h6><i class="bi bi-magic me-1"></i>AI sửa lỗi</h6>
              <div style="font-size:0.9rem; line-height:1.7;">${diffHtml}</div>
              ${item.feedback ? `<p class="text-muted mt-2 mb-0" style="font-size:0.82rem;"><i class="bi bi-info-circle me-1"></i>${esc(item.feedback)}</p>` : ''}
            </div>`;
        });
      }
    } else {
      if (statusEl) statusEl.innerHTML = `<span class="badge bg-secondary">Bài đã lưu – sửa lỗi tự động chưa khả dụng</span>`;
    }
  } catch (err) {
    if (spinnerEl) spinnerEl.style.display = 'none';
    if (statusEl) statusEl.innerHTML = `<span class="badge bg-secondary">Bài đã lưu</span>`;
    console.error('AI grading error:', err);
  }
}

function buildSimpleDiff(original, corrected) {
  if (!original || !corrected) return esc(corrected || original || '');
  if (original.trim().toLowerCase() === corrected.trim().toLowerCase()) {
    return `<span style="color:#16a34a;">${esc(corrected)}</span>`;
  }

  const origWords = original.split(/\s+/).filter(Boolean);
  const corrWords = corrected.split(/\s+/).filter(Boolean);

  // Simple LCS-based diff
  const m = origWords.length, n = corrWords.length;
  const dp = Array.from({length: m+1}, () => Array(n+1).fill(0));
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      dp[i][j] = origWords[i-1].toLowerCase() === corrWords[j-1].toLowerCase()
        ? dp[i-1][j-1] + 1
        : Math.max(dp[i-1][j], dp[i][j-1]);

  const result = [];
  let i = m, j = n;
  const ops = [];
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && origWords[i-1].toLowerCase() === corrWords[j-1].toLowerCase()) {
      ops.unshift({ type: 'same', text: corrWords[j-1] });
      i--; j--;
    } else if (j > 0 && (i === 0 || dp[i][j-1] >= dp[i-1][j])) {
      ops.unshift({ type: 'ins', text: corrWords[j-1] });
      j--;
    } else {
      ops.unshift({ type: 'del', text: origWords[i-1] });
      i--;
    }
  }

  return ops.map(op => {
    if (op.type === 'del') return `<span class="ai-diff-del">${esc(op.text)}</span>`;
    if (op.type === 'ins') return `<span class="ai-diff-ins">${esc(op.text)}</span>`;
    return esc(op.text);
  }).join(' ');
}

/* ═══════════════════════════════════════════════════════
   UTILITY
   ═══════════════════════════════════════════════════════ */

function esc(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
