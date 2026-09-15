(function () {
  function ensureContainerId(container) {
    if (container.id) return container.id;
    container.id = `reading-order-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    return container.id;
  }

  function getMovableCards(container) {
    return Array.from(container?.children || []).filter((child) =>
      child.classList?.contains('draggable-item') ||
      child.classList?.contains('reading-order-card')
    );
  }

  function getCardBody(card) {
    return card.querySelector('.card-body') || card;
  }

  function ensureTextWrapper(body) {
    const existingText = body.querySelector('.reading-order-text');
    if (existingText) return existingText;

    const directSpan = Array.from(body.children).find((child) =>
      child.tagName === 'SPAN' && !child.classList.contains('reading-order-actions')
    );
    if (directSpan) {
      directSpan.classList.add('reading-order-text');
      return directSpan;
    }

    const contentNodes = Array.from(body.childNodes).filter((node) => {
      if (node.nodeType === Node.TEXT_NODE) return node.textContent.trim();
      if (node.nodeType !== Node.ELEMENT_NODE) return false;
      return !node.classList.contains('reading-order-actions') &&
        !node.classList.contains('bi-grip-vertical');
    });

    if (!contentNodes.length) return null;

    const textWrapper = document.createElement('span');
    textWrapper.className = 'reading-order-text';
    contentNodes.forEach((node) => textWrapper.appendChild(node));
    body.insertBefore(textWrapper, body.querySelector('.reading-order-actions'));
    return textWrapper;
  }

  function syncButtons(container) {
    const cards = getMovableCards(container);
    cards.forEach((card, index) => {
      card.dataset.orderIndex = String(index);
      const up = card.querySelector('[data-order-action="up"]');
      const down = card.querySelector('[data-order-action="down"]');
      if (up) up.disabled = index === 0;
      if (down) down.disabled = index === cards.length - 1;
    });
  }

  function moveCard(containerId, index, delta) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const cards = getMovableCards(container);
    const from = Number(index);
    const to = from + Number(delta);
    if (!Number.isInteger(from) || !Number.isInteger(to) || to < 0 || to >= cards.length) return;

    const moving = cards[from];
    const target = cards[to];
    if (!moving || !target) return;
    if (delta < 0) {
      container.insertBefore(moving, target);
    } else {
      container.insertBefore(target, moving);
    }
    syncButtons(container);
  }

  function setup(container) {
    if (!container) return { destroy() {} };
    const containerId = ensureContainerId(container);
    const cards = getMovableCards(container);

    cards.forEach((card) => {
      card.removeAttribute('draggable');
      card.classList.add('reading-order-card');
      const body = getCardBody(card);
      body.classList.add('reading-order-card-body');

      const gripIcon = body.querySelector('.bi-grip-vertical');
      if (gripIcon) gripIcon.remove();
      ensureTextWrapper(body);

      if (!body.querySelector('.reading-order-actions')) {
        const actions = document.createElement('div');
        actions.className = 'reading-order-actions';
        actions.setAttribute('aria-label', 'Đổi vị trí câu');
        actions.innerHTML = `
          <button type="button" class="btn btn-sm btn-outline-primary reading-order-move-btn"
                  data-order-action="up" title="Chuyển lên"
                  onclick="moveReadingOrderCard('${containerId}', Number(this.closest('.reading-order-card').dataset.orderIndex), -1)">
            <i class="bi bi-arrow-up"></i>
          </button>
          <button type="button" class="btn btn-sm btn-outline-primary reading-order-move-btn"
                  data-order-action="down" title="Chuyển xuống"
                  onclick="moveReadingOrderCard('${containerId}', Number(this.closest('.reading-order-card').dataset.orderIndex), 1)">
            <i class="bi bi-arrow-down"></i>
          </button>
        `;
        body.appendChild(actions);
      }
    });

    syncButtons(container);
    return { destroy() {} };
  }

  function ArrowSortable(container) {
    return setup(container);
  }
  ArrowSortable.create = function create(container) {
    return setup(container);
  };

  window.moveReadingOrderCard = moveCard;
  window.setupReadingOrderArrows = setup;

  Object.defineProperty(window, 'Sortable', {
    configurable: true,
    get() {
      return ArrowSortable;
    },
    set() {
      // Keep Reading ordering interactions arrow-based even if SortableJS loads.
    }
  });
})();
