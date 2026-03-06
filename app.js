// ── Tool display labels ──
const TOOL_LABELS = {
  claude: 'Claude', notion: 'Notion', figma: 'Figma',
  linear: 'Linear', slack: 'Slack', openai: 'OpenAI', cross: 'Cross-tool'
};
const IMPACT_LABELS = {
  'impact-high': 'High impact',
  'impact-medium': 'Medium impact',
  'impact-watch': 'Worth watching'
};

// ── Stats ──
function updateStats() {
  const allCards = document.querySelectorAll('.card');
  const total = allCards.length;
  const high = document.querySelectorAll('.card .impact-high').length;
  const cross = document.querySelectorAll('.card[data-tool="cross"]').length;
  const tools = new Set([...allCards].map(c => c.dataset.tool).filter(t => t !== 'cross')).size;
  document.getElementById('stat-total').textContent = total;
  document.getElementById('stat-high').textContent = high;
  document.getElementById('stat-cross').textContent = cross;
  document.getElementById('stat-tools').textContent = tools;
}

// ── Build card HTML from a data object ──
function buildCardHTML(card) {
  const intHTML = card.integrations && card.integrations.length
    ? `<div class="integrations"><span class="int-label">Connects to:</span>${card.integrations.map(i => `<span class="int-pill">${i}</span>`).join('')}</div>`
    : '';
  const meansHTML = card.means
    ? `<div class="means-block"><div class="means-label">What it means for you</div><div class="means-text">${card.means}</div></div>`
    : '';
  return `
    <div class="card" data-tool="${card.tool}" data-tags="${card.tags || ''}">
      <div class="card-header">
        <div class="card-meta">
          <span class="tool-badge ${card.tool}">${TOOL_LABELS[card.tool] || card.tool}</span>
          <span class="impact-badge ${card.impact}">${IMPACT_LABELS[card.impact] || card.impact}</span>
        </div>
        <span class="card-date">${card.date || ''}</span>
      </div>
      <h3>${card.title}</h3>
      <p class="card-desc">${card.desc}</p>
      ${meansHTML}
      ${intHTML}
    </div>`;
}

// ── Load persisted cards from localStorage ──
function loadCustomCards() {
  const saved = JSON.parse(localStorage.getItem('customCards') || '[]');
  const container = document.getElementById('cards-container');
  saved.forEach(card => {
    container.insertAdjacentHTML('beforeend', buildCardHTML(card));
  });
}

// ── Format month input to display string ──
function formatMonth(value) {
  if (!value) return '';
  const [year, month] = value.split('-');
  const d = new Date(+year, +month - 1, 1);
  return d.toLocaleString('en-GB', { month: 'short', year: 'numeric' });
}

// ── Filter logic ──
const filterBtns = document.querySelectorAll('.filter-btn');
const emptyState = document.getElementById('empty');
const searchInput = document.getElementById('search');

let activeFilter = 'all';
let searchQuery = '';

function applyFilters() {
  const cards = document.querySelectorAll('.card');
  let visible = 0;
  cards.forEach(card => {
    const tool = card.dataset.tool;
    const tags = (card.dataset.tags || '') + ' ' + card.textContent.toLowerCase();
    const matchFilter = activeFilter === 'all' || tool === activeFilter;
    const matchSearch = searchQuery === '' || tags.toLowerCase().includes(searchQuery.toLowerCase());
    if (matchFilter && matchSearch) {
      card.classList.remove('hidden');
      visible++;
    } else {
      card.classList.add('hidden');
    }
  });
  emptyState.style.display = visible === 0 ? 'block' : 'none';
}

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeFilter = btn.dataset.filter;
    applyFilters();
  });
});

searchInput.addEventListener('input', e => {
  searchQuery = e.target.value;
  applyFilters();
});

// ── View toggle ──
const viewBtns = document.querySelectorAll('.view-btn');
const container = document.getElementById('cards-container');

viewBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    viewBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    container.classList.toggle('grid-view', btn.dataset.view === 'grid');
  });
});

// ── Refresh button ──
function handleRefresh() {
  const btn = document.getElementById('refresh-btn');
  btn.classList.add('spinning');
  setTimeout(() => { location.reload(); }, 400);
}

// ── Modal ──
const overlay = document.getElementById('modal-overlay');

document.getElementById('add-btn').addEventListener('click', () => {
  overlay.classList.add('open');
  document.getElementById('f-title').focus();
});

document.getElementById('modal-cancel').addEventListener('click', closeModal);
overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });

function closeModal() {
  overlay.classList.remove('open');
  document.getElementById('f-title').value = '';
  document.getElementById('f-desc').value = '';
  document.getElementById('f-means').value = '';
  document.getElementById('f-tags').value = '';
  document.getElementById('f-integrations').value = '';
  document.getElementById('f-date').value = '';
}

document.getElementById('modal-save').addEventListener('click', () => {
  const title = document.getElementById('f-title').value.trim();
  if (!title) { document.getElementById('f-title').focus(); return; }

  const rawDate = document.getElementById('f-date').value;
  const integStr = document.getElementById('f-integrations').value.trim();
  const card = {
    tool: document.getElementById('f-tool').value,
    impact: document.getElementById('f-impact').value,
    date: rawDate ? formatMonth(rawDate) : '',
    title,
    desc: document.getElementById('f-desc').value.trim(),
    means: document.getElementById('f-means').value.trim(),
    tags: document.getElementById('f-tags').value.trim(),
    integrations: integStr ? integStr.split(',').map(s => s.trim()).filter(Boolean) : []
  };

  // Persist to localStorage
  const saved = JSON.parse(localStorage.getItem('customCards') || '[]');
  saved.push(card);
  localStorage.setItem('customCards', JSON.stringify(saved));

  // Inject card into DOM
  document.getElementById('cards-container').insertAdjacentHTML('beforeend', buildCardHTML(card));

  updateStats();
  closeModal();
  applyFilters();
});

// ── Init ──
loadCustomCards();
updateStats();
