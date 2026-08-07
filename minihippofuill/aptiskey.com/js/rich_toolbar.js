/*
 * rich_toolbar.js — Soạn thảo WYSIWYG với 1 THANH ĐỊNH DẠNG TOÀN CỤC.
 *
 * Ý tưởng:
 *  - Chỉ có DUY NHẤT 1 thanh nút (đậm/nghiêng/gạch chân/gạch ngang/xoá định dạng).
 *  - Thanh này tự bám vào ô đang được focus: bấm vào ô nào thì thanh nổi lên
 *    ngay phía trên ô đó và định dạng cho ô đó.
 *  - Mỗi <textarea> (và <input> có class .rich-text) được thay bằng 1 vùng
 *    contenteditable hiển thị ĐÚNG định dạng (bôi đen bấm B -> chữ đậm ngay).
 *  - Khi gõ, nội dung được đồng bộ về field gốc; xuống dòng được chuẩn hoá về
 *    "\n" (giữ thẻ inline <b><i><u><s>) nên các ô "mỗi dòng 1 mục" không hỏng.
 *  - Field gốc vẫn nằm trong DOM (ẩn) -> code đọc .value như cũ; app hiển thị
 *    nội dung qua innerHTML nên định dạng render đúng.
 *
 * Loại trừ: thêm data-no-rich vào field không muốn có editor (vd ô dán CSV/JSON).
 */
(function () {
  'use strict';

  var STYLE_ID = 'rich-toolbar-style';
  var bar = null;              // thanh toàn cục (1 cái duy nhất)
  var activeEditable = null;   // vùng đang thao tác
  var hideTimer = null;

  var BUTTONS = [
    { label: 'B', title: 'In đậm (Ctrl+B)', cmd: 'bold', style: 'font-weight:700;' },
    { label: 'I', title: 'In nghiêng (Ctrl+I)', cmd: 'italic', style: 'font-style:italic;' },
    { label: 'U', title: 'Gạch chân (Ctrl+U)', cmd: 'underline', style: 'text-decoration:underline;' },
    { label: 'S', title: 'Gạch ngang', cmd: 'strikeThrough', style: 'text-decoration:line-through;' },
    { label: '⨯', title: 'Xoá định dạng', cmd: 'removeFormat', style: 'font-weight:600;' }
  ];

  function injectStyleOnce() {
    if (document.getElementById(STYLE_ID)) return;
    var css =
      '#rich-global-toolbar{position:fixed;z-index:20000;display:none;gap:4px;' +
      'background:#fff;border:1px solid #cdd4e0;border-radius:8px;padding:4px;' +
      'box-shadow:0 6px 20px rgba(20,30,60,.16);}' +
      '#rich-global-toolbar.show{display:flex;}' +
      '#rich-global-toolbar button{border:1px solid #d3d9e3;background:#fff;color:#334;border-radius:6px;' +
      'min-width:30px;height:28px;padding:0 8px;font-size:0.9rem;line-height:1;cursor:pointer;' +
      'display:inline-flex;align-items:center;justify-content:center;transition:background .12s,border-color .12s;}' +
      '#rich-global-toolbar button:hover{background:#eef1f7;border-color:#b9c2d4;}' +
      '#rich-global-toolbar button:active{background:#dce3f2;}' +
      '.rich-editable{border:1px solid #ced4da;border-radius:6px;padding:8px 12px;min-height:38px;' +
      'background:#fff;font-size:1rem;line-height:1.5;color:#212529;outline:none;overflow-wrap:anywhere;' +
      'white-space:pre-wrap;transition:border-color .12s,box-shadow .12s;}' +
      '.rich-editable:focus{border-color:#86b7fe;box-shadow:0 0 0 .2rem rgba(13,110,253,.2);}' +
      '.rich-editable[data-empty="1"]:before{content:attr(data-placeholder);color:#9aa4b2;pointer-events:none;}' +
      '.rich-editable.rich-single{min-height:0;white-space:nowrap;overflow-x:auto;}' +
      '.rich-editable b,.rich-editable strong{font-weight:700;}';
    var el = document.createElement('style');
    el.id = STYLE_ID;
    el.textContent = css;
    document.head.appendChild(el);
  }

  function buildToolbar() {
    if (bar) return bar;
    bar = document.createElement('div');
    bar.id = 'rich-global-toolbar';
    BUTTONS.forEach(function (b) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.title = b.title;
      btn.textContent = b.label;
      btn.setAttribute('style', b.style);
      btn.addEventListener('mousedown', function (e) {
        e.preventDefault(); // giữ focus + vùng bôi đen trong ô
        if (!activeEditable) return;
        activeEditable.focus();
        try { document.execCommand('styleWithCSS', false, false); } catch (_) {}
        try { document.execCommand(b.cmd, false, null); } catch (_) {}
        syncActive();
      });
      bar.appendChild(btn);
    });
    document.body.appendChild(bar);
    return bar;
  }

  function positionToolbar(editable) {
    if (!bar) return;
    var r = editable.getBoundingClientRect();
    bar.classList.add('show');
    var bw = bar.offsetWidth || 170;
    var top = r.top - (bar.offsetHeight || 34) - 6;
    if (top < 4) top = r.bottom + 6; // không đủ chỗ phía trên -> đặt phía dưới
    var left = r.left;
    var maxLeft = window.innerWidth - bw - 8;
    if (left > maxLeft) left = Math.max(4, maxLeft);
    bar.style.top = top + 'px';
    bar.style.left = left + 'px';
  }

  function showToolbarFor(editable) {
    buildToolbar();
    if (hideTimer) { clearTimeout(hideTimer); hideTimer = null; }
    positionToolbar(editable);
  }
  function hideToolbarSoon() {
    hideTimer = setTimeout(function () {
      if (bar) bar.classList.remove('show');
      activeEditable = null;
    }, 150);
  }

  // Chuẩn hoá HTML từ contenteditable: xuống dòng -> "\n" (giữ thẻ inline).
  // QUAN TRỌNG: thẻ block MỞ (<div>/<p>) phải thành "\n" để không dính dòng.
  // Chrome bọc dòng mới sau chữ đầu bằng <div> (vd "Both<div>Woman</div>") →
  // nếu chỉ xoá <div> mở thì "Both" dính "Woman" → hỏng textarea "mỗi dòng 1 mục".
  function normalizeHtml(html, isSingle) {
    var out = String(html || '')
      .replace(/<div><br\s*\/?><\/div>/gi, '\n')   // dòng trống
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/(div|p|h[1-6])>/gi, '')          // đóng block -> bỏ
      .replace(/<(div|p|h[1-6])[^>]*>/gi, '\n')     // MỞ block -> xuống dòng
      .replace(/<\/?(span|font)[^>]*>/gi, '')
      .replace(/<strike>/gi, '<s>').replace(/<\/strike>/gi, '</s>')
      .replace(/&nbsp;/gi, ' ');
    if (isSingle) return out.replace(/\s*\n\s*/g, ' ').trim();
    // Gộp nhiều dòng trống, bỏ \n thừa ở đầu/cuối.
    return out.replace(/\n{3,}/g, '\n\n').replace(/^\n+/, '').replace(/\n+$/, '');
  }

  function syncToField(field, editable) {
    var isSingle = field.tagName === 'INPUT';
    var html = normalizeHtml(editable.innerHTML, isSingle);
    if (html === '<br>' || html === '\n') html = '';
    field.value = html;
    editable.setAttribute('data-empty', html ? '0' : '1');
    field.dispatchEvent(new Event('input', { bubbles: true }));
    field.dispatchEvent(new Event('change', { bubbles: true }));
  }
  function syncActive() {
    if (activeEditable && activeEditable._field) syncToField(activeEditable._field, activeEditable);
  }

  var INPUT_OK = { text: 1, search: 1, url: 1, tel: 1, '': 1 };
  function isEditable(el) {
    if (!el) return false;
    if (el.tagName === 'TEXTAREA') return true;
    if (el.tagName === 'INPUT') {
      var t = (el.getAttribute('type') || '').toLowerCase();
      return !!INPUT_OK[t];
    }
    return false;
  }

  // Ô ĐÁP ÁN / OPTION (giá trị được so khớp để chấm) → KHÔNG gắn định dạng,
  // tránh admin lỡ bôi đậm làm hỏng so khớp (vd "Woman" -> "<b>Woman</b>").
  // Ô câu hỏi/đề/nội dung (prose) vẫn được định dạng bình thường.
  function isAnswerOrOptionField(el) {
    var hay = ((el.id || '') + ' ' + (el.className || '') + ' ' +
      (el.getAttribute('name') || '') + ' ' + (el.getAttribute('placeholder') || '')).toLowerCase();
    return /answer|correct|option|đáp\s*án|dap[-_\s]?an|man\/woman/.test(hay);
  }

  function attach(field) {
    if (!isEditable(field)) return;
    if (field.dataset.richAttached === '1') return;
    if (field.hasAttribute('data-no-rich')) return;
    if (isAnswerOrOptionField(field)) return;
    field.dataset.richAttached = '1';

    var isSingle = field.tagName === 'INPUT';
    var editable = document.createElement('div');
    editable.className = 'rich-editable' + (isSingle ? ' rich-single' : '');
    editable.setAttribute('contenteditable', 'true');
    editable.setAttribute('spellcheck', 'false');
    var ph = field.getAttribute('placeholder') || '';
    if (ph) editable.setAttribute('data-placeholder', ph);
    // Nạp nội dung hiện có: "\n" -> <br> để hiển thị nhiều dòng.
    editable.innerHTML = String(field.value || '').replace(/\n/g, '<br>');
    editable.setAttribute('data-empty', field.value ? '0' : '1');
    editable._field = field;

    field.style.display = 'none';
    field.parentNode.insertBefore(editable, field);

    editable.addEventListener('focus', function () {
      // Nếu field được nạp dữ liệu sau khi gắn (trang tải async) mà editor đang
      // rỗng -> nạp lại nội dung từ field để không mất dữ liệu.
      if (!editable.textContent && field.value) {
        editable.innerHTML = String(field.value).replace(/\n/g, '<br>');
        editable.setAttribute('data-empty', '0');
      }
      showToolbarFor(editable); activeEditable = editable;
    });
    editable.addEventListener('click', function () { showToolbarFor(editable); activeEditable = editable; });
    editable.addEventListener('keyup', function () { positionToolbar(editable); });
    editable.addEventListener('blur', function () { syncToField(field, editable); hideToolbarSoon(); });
    editable.addEventListener('input', function () { syncToField(field, editable); });

    if (isSingle) {
      editable.addEventListener('keydown', function (e) { if (e.key === 'Enter') e.preventDefault(); });
    }
    editable.addEventListener('keydown', function (e) {
      if (!(e.ctrlKey || e.metaKey) || e.altKey) return;
      var map = { b: 'bold', i: 'italic', u: 'underline' };
      var cmd = map[e.key.toLowerCase()];
      if (cmd) {
        e.preventDefault();
        try { document.execCommand('styleWithCSS', false, false); } catch (_) {}
        try { document.execCommand(cmd, false, null); } catch (_) {}
        syncToField(field, editable);
      }
    });
  }

  function scan(root) {
    var scope = root && root.querySelectorAll ? root : document;
    // Gắn cho mọi textarea + input dạng text (Bootstrap .form-control hoặc .rich-text).
    // isEditable() sẽ tự loại input number/date/checkbox... Chỉ cần data-no-rich để chừa.
    var list = scope.querySelectorAll(
      'textarea:not([data-rich-attached]), input.form-control:not([data-rich-attached]), input.rich-text:not([data-rich-attached])'
    );
    for (var i = 0; i < list.length; i++) attach(list[i]);
  }

  function init() {
    injectStyleOnce();
    buildToolbar();
    scan(document);
    if (window.MutationObserver) {
      var obs = new MutationObserver(function (mutations) {
        for (var m = 0; m < mutations.length; m++) {
          var added = mutations[m].addedNodes;
          for (var n = 0; n < added.length; n++) {
            var node = added[n];
            if (node.nodeType !== 1) continue;
            if (node.tagName === 'TEXTAREA' || (node.tagName === 'INPUT' && (node.classList.contains('rich-text') || node.classList.contains('form-control')))) attach(node);
            else if (node.querySelectorAll) scan(node);
          }
        }
      });
      obs.observe(document.body, { childList: true, subtree: true });
    }
    // Bám vị trí khi cuộn/đổi kích thước.
    window.addEventListener('scroll', function () { if (activeEditable) positionToolbar(activeEditable); }, true);
    window.addEventListener('resize', function () { if (activeEditable) positionToolbar(activeEditable); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.RichToolbar = { attach: attach, scan: scan };
})();
