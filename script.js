// GESTION DE BIBLIOTHÈQUE PRO — script.js
// HTML5 | CSS3 | JavaScript Vanilla | DOM | XML + XMLHttpRequest | CRUD

let livres = [];
let nextId = 100;

// ── Sélection DOM ────────────────────────────────────────────
const booksTableBody  = document.getElementById('booksTableBody');
const emptyState      = document.getElementById('emptyState');
const compteur        = document.getElementById('compteurLivres');
const searchInput     = document.getElementById('searchInput');
const searchClear     = document.getElementById('searchClear');
const bookForm        = document.getElementById('bookForm');
const formTitle       = document.getElementById('formTitle');
const submitBtnText   = document.getElementById('submitBtnText');
const annulerModifBtn = document.getElementById('annulerModifBtn');
const formSection     = document.querySelector('.form-section');
const editIndex       = document.getElementById('editIndex');
const inputTitre      = document.getElementById('inputTitre');
const inputAuteur     = document.getElementById('inputAuteur');
const inputAnnee      = document.getElementById('inputAnnee');
const inputPrix       = document.getElementById('inputPrix');
const inputCouverture = document.getElementById('inputCouverture');
const inputDescription= document.getElementById('inputDescription');
const modalOverlay    = document.getElementById('modalOverlay');
const modalBody       = document.getElementById('modalBody');
const toast           = document.getElementById('toast');

// ── Chargement XML ───────────────────────────────────────────
function chargerXML() {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', 'books.xml', true);

  xhr.onload = function () {
    if (xhr.status === 200) {
      const noeuds = xhr.responseXML.getElementsByTagName('livre');
      livres = Array.from(noeuds).map(n => {
        const g = tag => n.getElementsByTagName(tag)[0]?.textContent.trim() || '';
        const l = {
          id: parseInt(n.getAttribute('id')),
          titre: g('titre'), auteur: g('auteur'),
          annee: g('annee'), prix: g('prix'),
          couverture: g('couverture'), description: g('description')
        };
        if (l.id >= nextId) nextId = l.id + 1;
        return l;
      });
      afficherLivres(livres);
      afficherToast('Bibliothèque chargée !', 'success');
    }
  };

  xhr.onerror = () => afficherToast('Ouvrez avec Live Server pour charger le XML', 'error');
  xhr.send();
}

// ── Affichage tableau ────────────────────────────────────────
function echapper(str) {
  const d = document.createElement('div');
  d.appendChild(document.createTextNode(String(str || '')));
  return d.innerHTML;
}

function afficherLivres(liste) {
  booksTableBody.innerHTML = '';
  compteur.textContent = livres.length + ' livre(s)';
  emptyState.style.display = liste.length ? 'none' : 'flex';

  liste.forEach((livre, i) => {
    const idx = livres.findIndex(l => l.id === livre.id);
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${i + 1}</td>
      <td class="titre-cell">${echapper(livre.titre)}</td>
      <td>${echapper(livre.auteur)}</td>
      <td>${echapper(livre.annee)}</td>
      <td class="prix-cell">${Number(livre.prix).toLocaleString('fr-FR')} FCFA</td>
      <td><div class="actions-cell">
        <button class="btn-voir"      onclick="ouvrirModal(${idx})"> VOIR </button>
        <button class="btn-modifier"  onclick="chargerModification(${idx})"> MODIFIER </button>
        <button class="btn-supprimer" onclick="supprimerLivre(${idx})"> SUPPRIMER </button>
      </div></td>`;
    booksTableBody.appendChild(tr);
  });
}

// ── Recherche ────────────────────────────────────────────────
searchInput.addEventListener('keyup', function () {
  const t = this.value.trim().toLowerCase();
  searchClear.classList.toggle('visible', t.length > 0);
  afficherLivres(t ? livres.filter(l =>
    l.titre.toLowerCase().includes(t)  || l.auteur.toLowerCase().includes(t) ||
    String(l.annee).includes(t)        || String(l.prix).includes(t)
  ) : livres);
});

searchClear.addEventListener('click', () => {
  searchInput.value = '';
  searchClear.classList.remove('visible');
  afficherLivres(livres);
});

// ── Tri des colonnes ─────────────────────────────────────────
let sortCol = null, sortDir = 'asc';

document.querySelectorAll('.sortable').forEach(th => {
  th.addEventListener('click', function () {
    sortDir = sortCol === this.dataset.col ? (sortDir === 'asc' ? 'desc' : 'asc') : 'asc';
    sortCol = this.dataset.col;
    document.querySelectorAll('.sortable').forEach(el => el.classList.remove('asc', 'desc'));
    this.classList.add(sortDir);
    appliquerRecherche();
  });
});

function trierLivres(liste) {
  if (!sortCol) return liste;
  return [...liste].sort((a, b) => {
    if (sortCol === 'annee' || sortCol === 'prix')
      return sortDir === 'asc' ? a[sortCol] - b[sortCol] : b[sortCol] - a[sortCol];
    const [va, vb] = [String(a[sortCol]).toLowerCase(), String(b[sortCol]).toLowerCase()];
    return sortDir === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va);
  });
}

// ── Modal ────────────────────────────────────────────────────
function ouvrirModal(index) {
  const l = livres[index];
  if (!l) return;

  modalBody.innerHTML = `
    <div class="modal-book">
      <div id="modalCoverSlot"></div>
      <div class="modal-info">
        <h3>${echapper(l.titre)}</h3>
        <div class="modal-meta">
          <div class="modal-meta-item">✍️ <strong>${echapper(l.auteur)}</strong></div>
          <div class="modal-meta-item">📅 Publié en <strong>${echapper(l.annee)}</strong></div>
          <div class="modal-meta-item">🆔 Référence <strong>#${l.id}</strong></div>
        </div>
        <div class="modal-prix">${Number(l.prix).toLocaleString('fr-FR')} FCFA</div>
      </div>
    </div>
    ${l.description ? `<p class="modal-desc">${echapper(l.description)}</p>` : ''}`;

  const slot = document.getElementById('modalCoverSlot');
  if (l.couverture) {
    const img = document.createElement('img');
    img.className = 'modal-cover'; img.alt = 'Couverture'; img.src = l.couverture;
    img.onerror = () => { slot.innerHTML = '<div class="modal-cover-placeholder">📖</div>'; };
    slot.appendChild(img);
  } else {
    slot.innerHTML = '<div class="modal-cover-placeholder">📖</div>';
  }

  modalOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

const fermerModal = () => { modalOverlay.classList.remove('open'); document.body.style.overflow = ''; };
document.getElementById('modalClose').addEventListener('click', fermerModal);
modalOverlay.addEventListener('click', e => { if (e.target === modalOverlay) fermerModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') fermerModal(); });

// ── Validation ───────────────────────────────────────────────
function validerFormulaire() {
  let ok = true;
  const champs = [
    { id: 'errTitre',  el: inputTitre,  msg: 'Le titre est obligatoire.',      test: () => !inputTitre.value.trim() },
    { id: 'errAuteur', el: inputAuteur, msg: "L'auteur est obligatoire.",       test: () => !inputAuteur.value.trim() },
    { id: 'errAnnee',  el: inputAnnee,  msg: 'Année valide requise (1800–2099).', test: () => { const a = parseInt(inputAnnee.value); return !inputAnnee.value || isNaN(a) || a < 1800 || a > 2099; } },
    { id: 'errPrix',   el: inputPrix,   msg: 'Prix valide requis (≥ 0).',       test: () => { const p = parseFloat(inputPrix.value); return !inputPrix.value || isNaN(p) || p < 0; } },
  ];
  champs.forEach(c => {
    if (c.test()) { document.getElementById(c.id).textContent = c.msg; c.el.classList.add('input--error'); ok = false; }
    else          { document.getElementById(c.id).textContent = '';    c.el.classList.remove('input--error'); }
  });
  return ok;
}

// ── Ajout / Modification ─────────────────────────────────────
bookForm.addEventListener('submit', function (e) {
  e.preventDefault();
  if (!validerFormulaire()) return;
  const idx = parseInt(editIndex.value);
  const d = { titre: inputTitre.value.trim(), auteur: inputAuteur.value.trim(),
              annee: inputAnnee.value.trim(),  prix: inputPrix.value.trim(),
              couverture: inputCouverture.value.trim(), description: inputDescription.value.trim() };
  if (idx === -1) {
    livres.push({ id: nextId++, ...d });
    afficherToast('Livre ajouté !', 'success');
  } else {
    Object.assign(livres[idx], d);
    afficherToast('Livre modifié !', 'success');
  }
  reinitialiserFormulaire();
  appliquerRecherche();
});

// ── Modification ─────────────────────────────────────────────
function chargerModification(index) {
  const l = livres[index];
  if (!l) return;
  editIndex.value = index;
  inputTitre.value = l.titre;   inputAuteur.value = l.auteur;
  inputAnnee.value = l.annee;   inputPrix.value   = l.prix;
  inputCouverture.value = l.couverture; inputDescription.value = l.description;
  formTitle.textContent = 'Modifier le livre';
  submitBtnText.textContent = 'Sauvegarder';
  annulerModifBtn.style.display = 'inline-flex';
  formSection.classList.add('edit-mode');
  formSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  inputTitre.focus();
}

// ── Suppression ──────────────────────────────────────────────
function supprimerLivre(index) {
  if (!livres[index] || !confirm(`Supprimer "${livres[index].titre}" ?`)) return;
  if (parseInt(editIndex.value) === index) reinitialiserFormulaire();
  livres.splice(index, 1);
  afficherToast('🗑 Livre supprimé.', 'info');
  appliquerRecherche();
}

// ── Utilitaires ──────────────────────────────────────────────
function reinitialiserFormulaire() {
  bookForm.reset(); editIndex.value = '-1';
  formTitle.textContent = 'Ajouter un livre';
  submitBtnText.textContent = 'Ajouter';
  annulerModifBtn.style.display = 'none';
  formSection.classList.remove('edit-mode');
  ['errTitre','errAuteur','errAnnee','errPrix'].forEach(id => document.getElementById(id).textContent = '');
  [inputTitre, inputAuteur, inputAnnee, inputPrix].forEach(el => el.classList.remove('input--error'));
}
annulerModifBtn.addEventListener('click', reinitialiserFormulaire);

function appliquerRecherche() {
  const t = searchInput.value.trim().toLowerCase();
  afficherLivres(trierLivres(t ? livres.filter(l =>
    l.titre.toLowerCase().includes(t)  || l.auteur.toLowerCase().includes(t) ||
    String(l.annee).includes(t)        || String(l.prix).includes(t)
  ) : [...livres]));
  compteur.textContent = livres.length + ' livre(s)';
}

// ── Toast ────────────────────────────────────────────────────
let toastTimer = null;
function afficherToast(msg, type = 'info') {
  toast.textContent = msg; toast.className = `toast show toast--${type}`;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3000);
}

// ── Exposer + Init ───────────────────────────────────────────
window.ouvrirModal = ouvrirModal;
window.chargerModification = chargerModification;
window.supprimerLivre = supprimerLivre;
chargerXML();