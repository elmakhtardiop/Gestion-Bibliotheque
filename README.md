# 📚 Gestion de Bibliothèque

Application web interactive de gestion de bibliothèque développée en **JavaScript**, sans aucun framework ni base de données.

> Projet d'évaluation — Module **JavaScript Avancé**  
> Encadrant : **Mouhamed Moustapha Diouf**
> Master 1 - Semestre 2

---

## 🖥️ Aperçu

L'application permet de gérer un catalogue de livres directement dans le navigateur :
- Affichage des livres chargés depuis un fichier **XML**
- Ajout, modification et suppression de livres
- Recherche en temps réel (titre, auteur, année, prix)
- Tri des colonnes par clic
- Modal de détail avec image de couverture

---

## 🗂️ Structure du projet

```
gestion-bibliotheque/
├── index.html       → Structure HTML5 de l'application
├── style.css        → Design responsive (palette Ardoise Moderne)
├── script.js        → Logique complète (DOM, CRUD, XHR, événements)
├── books.xml        → Données de démarrage (9 livres)
└── images/
    ├── js-avance.jpg
    ├── dom.jpg
    ├── usll.jpg
    ├── uvdb.jpg

```

---

## Lancer le projet

### Prérequis
- [VS Code](https://code.visualstudio.com/)
- Extension **Live Server**  installée dans VS Code
> ⚠️ **Live Server est obligatoire** — `XMLHttpRequest` ne peut pas charger `books.xml` si `index.html` est ouvert directement depuis le disque (erreur CORS).

---

## Fonctionnalités

| Fonctionnalité | Description |
|---|---|
| 📋 Affichage | Chargement XML via `XMLHttpRequest`, rendu en tableau HTML |
| 🔍 Recherche | Filtrage en temps réel sur titre, auteur, année et prix |
| ⇅ Tri | Clic sur les en-têtes de colonnes pour trier (asc/desc) |
| 👁️ Voir | Modal avec couverture, infos complètes et description |
| ➕ Ajouter | Formulaire validé, ajout sans rechargement de page |
| ✏️ Modifier | Pré-remplissage du formulaire, sauvegarde instantanée |
| 🗑️ Supprimer | Suppression avec confirmation, mise à jour du tableau |
| ✅ Validation | Messages d'erreur inline sur les champs obligatoires |

---

## Technologies utilisées

- **HTML5** — Balises sémantiques (`header`, `main`, `section`, `form`, `table`)
- **CSS3** — Variables CSS, Flexbox, Grid, animations `@keyframes`, media queries
- **JavaScript Vanilla** — Aucun framework, pur JS natif
- **DOM Manipulation** — `createElement`, `appendChild`, `innerHTML`, `classList`
- **XML + XMLHttpRequest** — Chargement asynchrone de `books.xml`

---

## 📚 Catalogue de départ

| # | Titre | Auteur | Année |
|---|---|---|---|
| 1 | JavaScript Avancé | Tuteur Mouhamed M. Diouf | 2020 |
| 2 | Une si longue lettre | Mariama Bâ | 1979 |
| 3 | Une vie de boy | Ferdinand Oyono | 1956 |
| 4 | Eloquent JavaScript | Marijn Haverbeke | 2018 |

---

## 📁 Ajouter des images de couverture

Placez vos images dans le dossier `images/` et référencez-les dans `books.xml` :

```xml
<couverture>images/nom-du-fichier.jpg</couverture>
```

Formats acceptés : `.jpg` `.jpeg` `.png` `.webp`

---

## 👤 Auteurs

**Anta GAYE**

**El Makhtar DIOP**  

**Pape Gora THIAM**

**Cheikh Ahmadou Bamba FALL**

**Abdou KEBE**

**Mouhamadou Moustapha SALL**


---

## 📄 Licence

Projet académique - Université Virtuelle du Sénégal
