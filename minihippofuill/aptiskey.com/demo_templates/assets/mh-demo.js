/* ===================================================================
   Mini Hippo — helper dùng chung cho giao diện mẫu Aptis học thử.
   JS thuần, không phụ thuộc thư viện nào.

   CÁCH DÙNG:
   1. Sửa MH.config bên dưới (baseUrl + apiKey) do Mini Hippo cấp.
   2. Mặc định template chạy bằng DỮ LIỆU MẪU nhúng sẵn (offline).
      Thêm ?live=1 vào URL (hoặc đặt MH.config.live = true) để lấy dữ
      liệu THẬT realtime từ Mini Hippo.
   =================================================================== */
window.MH = (function () {
  var params = new URLSearchParams(location.search);

  var config = {
    // Đổi thành domain thật khi tích hợp, vd 'https://minihippo.edu.vn'
    baseUrl: params.get('base') || '',
    // API key do Mini Hippo cấp (DEMO_API_KEY)
    apiKey: params.get('key') || '',
    // true = gọi API thật, false = dùng dữ liệu mẫu nhúng trong file
    live: params.get('live') === '1'
  };

  function url(path, query) {
    var qs = Object.keys(query || {})
      .filter(function (k) { return query[k] !== undefined && query[k] !== ''; })
      .map(function (k) { return encodeURIComponent(k) + '=' + encodeURIComponent(query[k]); })
      .join('&');
    return config.baseUrl + path + (qs ? '?' + qs : '');
  }

  async function get(path, query) {
    var q = Object.assign({ key: config.apiKey }, query || {});
    var res = await fetch(url(path, q));
    var data = await res.json().catch(function () { return {}; });
    if (!res.ok) throw new Error(data.error || ('Lỗi ' + res.status));
    return data;
  }

  /* ---------- API bộ đề (Reading / Listening / Speaking) ---------- */
  // skill: 'reading' | 'listening' | 'speaking'
  function listSets(skill) { return get('/api/demo/sets', { skill: skill }); }
  function getSet(id) { return get('/api/demo/set', { id: id }); }

  /* ---------- API học theo câu hỏi (Reading / Listening / Writing) ---------- */
  // part: '1','2','4','5' | 'listening_1_13','listening_14','listening_15',
  //       'listening_16_17' | 'writing'
  function listLessons(part) { return get('/api/demo/lessons', { part: part }); }
  function getLesson(id) { return get('/api/demo/lesson', { id: id }); }

  /* ---------- Tiện ích hiển thị ---------- */
  function esc(v) {
    return String(v == null ? '' : v)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function show(id) {
    ['view-list', 'view-practice', 'view-result'].forEach(function (v) {
      var el = document.getElementById(v);
      if (el) el.classList.toggle('mh-hidden', v !== id);
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function error(message) {
    var el = document.getElementById('mh-error');
    if (!el) return;
    el.textContent = message;
    el.classList.remove('mh-hidden');
  }

  function clearError() {
    var el = document.getElementById('mh-error');
    if (el) el.classList.add('mh-hidden');
  }

  // Chấm trắc nghiệm tại chỗ. questions: [{ correctAnswer }], answers: []
  function score(questions, answers) {
    var correct = 0;
    var details = questions.map(function (q, i) {
      var expected = q.correctAnswer != null ? q.correctAnswer : q.answer;
      var got = answers[i];
      var ok = got != null && String(got) === String(expected);
      if (ok) correct += 1;
      return { index: i, question: q, userAnswer: got, expected: expected, ok: ok };
    });
    return { correct: correct, total: questions.length, details: details };
  }

  return {
    config: config,
    get: get,
    listSets: listSets,
    getSet: getSet,
    listLessons: listLessons,
    getLesson: getLesson,
    esc: esc,
    show: show,
    error: error,
    clearError: clearError,
    score: score
  };
})();
