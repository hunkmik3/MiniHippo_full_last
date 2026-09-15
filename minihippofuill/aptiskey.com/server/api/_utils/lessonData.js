// ===================================================================
// Bóc dữ liệu bài học "học theo câu hỏi" (Aptis) từ file JS sinh sẵn.
//
// Bối cảnh: các bài Reading part 1/2/4/5, Listening 1_13/14/15/16_17 và
// Writing không lưu dữ liệu dạng JSON mà lưu thành FILE JAVASCRIPT trên
// GitHub — bên trong là IIFE khai báo biến rồi tự render ra DOM. Mỗi loại
// part lại đặt tên biến và cấu trúc khác nhau (questions1_1, question2Content_1,
// question4Text_1, options_1, question15Data_1, key_id/club_name, ...).
//
// Vì vậy KHÔNG parse bằng regex (sẽ vỡ khi format khác nhau). Cách làm ở đây:
//   1. Chèn thêm phép gán phụ vào mỗi khai báo biến:
//        const X = <giá trị>   ->   const X = globalThis.__D__.X = <giá trị>
//      (cú pháp `const x = (g.x = v)` gán được cho cả hai, không đổi logic)
//   2. Chạy file trong sandbox `node:vm` với DOM giả (mọi thuộc tính/hàm đều
//      no-op) để code render không crash.
//   3. Thu lại các biến đã gán, bỏ hàm/đối tượng DOM, chỉ giữ dữ liệu thuần.
//
// Nhờ CHẠY THẬT nên không phụ thuộc vào format của từng loại bài.
// ===================================================================

import vm from 'node:vm';

// Đối tượng giả "nuốt" mọi thao tác: truy cập thuộc tính nào cũng trả về chính
// nó, gọi như hàm cũng được. Đủ để code render DOM chạy mà không lỗi.
function createStub() {
  const fn = function () { return stub; };
  const stub = new Proxy(fn, {
    get(_target, prop) {
      if (prop === Symbol.toPrimitive) return () => '';
      if (prop === 'then') return undefined; // tránh bị coi là Promise
      if (prop === 'length') return 0;
      if (prop === 'style') return stub;
      return stub;
    },
    set() { return true; },
    has() { return true; },
    apply() { return stub; },
    construct() { return stub; }
  });
  return stub;
}

function buildSandbox() {
  const stub = createStub();
  const captured = Object.create(null);

  const documentStub = new Proxy({}, {
    get(_t, prop) {
      // Cho init() chạy ngay thay vì chờ DOMContentLoaded.
      if (prop === 'addEventListener') {
        return (_evt, cb) => { try { typeof cb === 'function' && cb(); } catch (_) {} };
      }
      if (prop === 'readyState') return 'complete';
      if (prop === 'querySelectorAll' || prop === 'getElementsByClassName' ||
          prop === 'getElementsByTagName') {
        return () => [];
      }
      return stub;
    },
    set() { return true; }
  });

  // Một số bài (vd Listening 1-13) KHÔNG khai báo biến mà gán thẳng
  // `window.listeningQuestions1 = [...]`. Nếu window là stub nuốt-mọi-thứ thì
  // mất dữ liệu -> dùng proxy có ghi nhận: set thì lưu lại, get thì trả giá trị
  // đã lưu, chưa có thì trả stub để code render vẫn chạy.
  const windowStore = Object.create(null);
  const windowProxy = new Proxy(windowStore, {
    get(target, prop) {
      if (prop in target) return target[prop];
      if (prop === 'document') return documentStub;
      if (prop === 'addEventListener' || prop === 'removeEventListener') return () => {};
      return stub;
    },
    set(target, prop, value) { target[prop] = value; return true; },
    has() { return true; },
    deleteProperty(target, prop) { delete target[prop]; return true; }
  });

  const sandbox = {
    __D__: captured,
    __W__: windowStore,
    document: documentStub,
    window: windowProxy,
    navigator: stub,
    location: stub,
    localStorage: stub,
    sessionStorage: stub,
    console: { log() {}, warn() {}, error() {}, info() {} },
    alert() {}, confirm() { return true; }, prompt() { return ''; },
    setTimeout() { return 0; }, clearTimeout() {},
    setInterval() { return 0; }, clearInterval() {},
    requestAnimationFrame() { return 0; },
    addEventListener() {}, removeEventListener() {},
    fetch() { return Promise.resolve(stub); },
    Audio: function () { return stub; },
    Image: function () { return stub; },
    XMLHttpRequest: function () { return stub; },
    MutationObserver: function () { return stub; }
  };
  sandbox.globalThis = sandbox;
  sandbox.self = windowProxy;
  sandbox.top = windowProxy;
  return { sandbox, captured, windowStore };
}

// Chèn phép gán phụ vào mọi khai báo biến đơn giản.
// Bỏ qua destructuring (`const {a} =`, `const [a] =`) và so sánh (`==`).
function instrument(source) {
  return String(source).replace(
    /\b(const|let|var)\s+([A-Za-z_$][\w$]*)\s*=(?!=)/g,
    (_m, kw, name) => `${kw} ${name} = globalThis.__D__.${name} =`
  );
}

// Chỉ giữ dữ liệu thuần (object/array/chuỗi/số/bool). Bỏ hàm, DOM, vòng lặp.
function toPlain(value, seen = new WeakSet(), depth = 0) {
  if (value === null || value === undefined) return null;
  const t = typeof value;
  if (t === 'string' || t === 'number' || t === 'boolean') return value;
  if (t === 'function' || t === 'symbol') return undefined;
  if (t !== 'object') return undefined;
  if (depth > 12) return undefined;
  if (seen.has(value)) return undefined;

  // Proxy stub sẽ trả về chính nó ở mọi thuộc tính -> nhận diện và bỏ.
  try {
    if (value && value.__isStubProbe__ === value) return undefined;
  } catch (_) { return undefined; }

  seen.add(value);
  if (Array.isArray(value)) {
    const out = value.map((item) => toPlain(item, seen, depth + 1))
      .filter((item) => item !== undefined);
    return out;
  }
  const out = {};
  let keys = [];
  try { keys = Object.keys(value); } catch (_) { return undefined; }
  for (const key of keys) {
    let child;
    try { child = value[key]; } catch (_) { continue; }
    const plain = toPlain(child, seen, depth + 1);
    if (plain !== undefined) out[key] = plain;
  }
  return out;
}

/**
 * Bóc dữ liệu từ nội dung file JS bài học.
 * @param {string} source nội dung file .js
 * @returns {{ data: object, variables: string[], error?: string }}
 */
export function extractLessonData(source) {
  const { sandbox, captured, windowStore } = buildSandbox();
  let runError = null;

  try {
    const script = new vm.Script(instrument(source), { filename: 'lesson.js' });
    script.runInNewContext(sandbox, { timeout: 5000 });
  } catch (error) {
    // Code render có thể lỗi giữa chừng, nhưng các biến khai báo TRƯỚC đó
    // đã kịp gán vào __D__ nên vẫn bóc được phần lớn dữ liệu.
    runError = error?.message || String(error);
  }

  // Gộp biến khai báo (__D__) và dữ liệu gán thẳng vào window.
  const merged = Object.create(null);
  for (const key of Object.keys(windowStore)) merged[key] = windowStore[key];
  for (const key of Object.keys(captured)) merged[key] = captured[key];

  const data = {};
  for (const key of Object.keys(merged)) {
    const plain = toPlain(merged[key]);
    // Bỏ biến rỗng/không phải dữ liệu (biến trạng thái, phần tử DOM...).
    if (plain === undefined || plain === null) continue;
    if (typeof plain === 'object' && !Array.isArray(plain) && !Object.keys(plain).length) continue;
    if (Array.isArray(plain) && !plain.length) continue;
    data[key] = plain;
  }

  return {
    data,
    variables: Object.keys(data),
    ...(runError ? { warning: runError } : {})
  };
}

export default extractLessonData;
