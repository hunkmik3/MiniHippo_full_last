// Mobile/Tablet reorder controls
// ----------------------------------------------------------------------------
// Trên màn hình <= 1024px (mobile & tablet), thao tác kéo-thả để sắp xếp câu
// (.draggable-card) khó thực hiện. File này thêm nút mũi tên Lên/Xuống vào mỗi
// thẻ để học viên bấm di chuyển, và ẩn tay cầm kéo. Trên desktop vẫn dùng kéo-thả
// như cũ (nút mũi tên bị ẩn bằng CSS).
//
// Dùng chung cho reading_bode_set.js và buoi_hoc.js:
//   - MobileReorder.isCompact()  -> true nếu màn hình <= 1024px (để disable Sortable)
//   - MobileReorder.enhance(container) -> chèn nút mũi tên cho mọi .draggable-card
// Câu đầu bị khoá KHÔNG có class .draggable-card nên tự động không nhận nút và
// không thể bị đẩy lên trên.
(function () {
  if (window.MobileReorder) return;

  var COMPACT_QUERY = '(max-width: 1024px)';

  function isCompact() {
    return !!(window.matchMedia && window.matchMedia(COMPACT_QUERY).matches);
  }

  function injectStyleOnce() {
    if (document.getElementById('mobile-reorder-style')) return;
    var style = document.createElement('style');
    style.id = 'mobile-reorder-style';
    style.textContent = [
      '.reorder-controls{display:none;gap:6px;flex:0 0 auto;}',
      '.reorder-controls .reorder-btn{width:40px;height:40px;display:inline-flex;',
      'align-items:center;justify-content:center;padding:0;font-size:1.15rem;line-height:1;}',
      '@media (max-width:1024px){',
      '  .reorder-controls{display:inline-flex;}',
      '  .draggable-card .bi-grip-vertical{display:none !important;}',
      '  .draggable-card{cursor:default !important;}',
      '  .draggable-card .d-flex{flex-wrap:nowrap;}',
      '  .draggable-card .d-flex > span{flex:1 1 auto;min-width:0;}',
      '}'
    ].join('');
    document.head.appendChild(style);
  }

  function getRow(card) {
    return card.querySelector('.d-flex') || card.firstElementChild || card;
  }

  function moveCard(card, direction) {
    var container = card.parentElement;
    if (!container) return;
    if (direction < 0) {
      var prev = card.previousElementSibling;
      // Chỉ đổi chỗ với thẻ kéo được khác (không vượt qua câu đầu đã khoá).
      if (prev && prev.classList.contains('draggable-card')) {
        container.insertBefore(card, prev);
      }
    } else {
      var next = card.nextElementSibling;
      if (next && next.classList.contains('draggable-card')) {
        container.insertBefore(next, card);
      }
    }
  }

  function enhance(container) {
    if (!container) return;
    injectStyleOnce();

    var cards = container.querySelectorAll('.draggable-card');
    Array.prototype.forEach.call(cards, function (card) {
      if (card.dataset.reorderEnhanced === '1') return;
      card.dataset.reorderEnhanced = '1';
      var row = getRow(card);
      if (!row) return;
      var controls = document.createElement('div');
      controls.className = 'reorder-controls ms-auto';
      controls.innerHTML =
        '<button type="button" class="btn btn-outline-secondary reorder-btn reorder-up" aria-label="Di chuyển lên"><i class="bi bi-arrow-up"></i></button>' +
        '<button type="button" class="btn btn-outline-secondary reorder-btn reorder-down" aria-label="Di chuyển xuống"><i class="bi bi-arrow-down"></i></button>';
      row.appendChild(controls);
    });

    if (container.dataset.reorderBound !== '1') {
      container.dataset.reorderBound = '1';
      container.addEventListener('click', function (e) {
        var btn = e.target.closest && e.target.closest('.reorder-up, .reorder-down');
        if (!btn || !container.contains(btn)) return;
        var card = btn.closest('.draggable-card');
        if (!card) return;
        e.preventDefault();
        moveCard(card, btn.classList.contains('reorder-up') ? -1 : 1);
      });
    }
  }

  window.MobileReorder = { enhance: enhance, isCompact: isCompact };
})();
