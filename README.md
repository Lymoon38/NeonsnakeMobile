# 🐍 NeonSnakeMobile

> **Survivre · Grossir · Dominer**  
> Un jeu de serpent multijoueur néon, jouable en solo contre 15 bots IA agressifs.
version ligne + tard

---

## 🎮 Jouer

Ouvre `index.html` dans ton navigateur. Aucune installation requise.

```
neonsnakemobile/
├── index.html
└── assets/
    ├── neon-gaming.mp3     ← musique 1
    ├── synthwave.mp3       ← musique 2 (optionnel)
    └── ...                 ← ajoute tes pistes ici
```

---

## 🕹️ But du jeu

Tu contrôles un serpent néon dans une arène de 5000×5000 px contre **15 bots adversaires** qui jouent de façon autonome.  
Mange des orbes pour grandir. Évite les obstacles. Fais mourir les autres en les poussant sur ton corps.

**Tu meurs si :**
- Tu sors de la carte
- Ta tête touche le corps d'un adversaire (bot ou joueur)
- Tu entres dans un **cratère lunaire**
- Tu es aspiré par un **trou noir** (téléportation → tu survies mais perds du temps)

**Tu tues un bot si :**
- Sa tête touche **ton corps**
- Il fonce dans un obstacle ou hors des limites
- Lors d'une collision frontale tête-à-tête, le plus **long** serpent survit

---

## ⭐ Système de points

| Action | Points |
|---|---|
| Orbe normal | +1 |
| Orbe vitesse ⚡ (étoile rose) | +2 |
| Orbe croissance 🔥 (météore orange) | +3 |

Les points sont cumulés et servent à **débloquer des skins** et à battre ton **meilleur score** (sauvegardé localement).

---

## 🎨 Skins déblocables

| Skin | Score requis |
|---|---|
| Arc-en-ciel 🌈, Cyan, Rose, Vert, Orange, Violet, Rouge, Blanc | Dès le départ |
| Feu 🔥 | 30 pts |
| Glace ❄️ | 60 pts |
| Or ✨ | 100 pts |
| Néant 🌑 | 150 pts |
| Plasma ⚡ | 200 pts |

---

## 🚧 Obstacles

### 🌑 Trou noir
- **Attire** ton serpent vers lui par gravité
- Si tu touches le centre → **téléportation aléatoire** sur la carte (tu ne meurs pas)
- Tourne en orbite, anneau lumineux visible

### 🪨 Cratère lunaire
- **Ralentit** considérablement ton serpent dans sa zone d'influence
- Si ta tête touche le cratère → **mort instantanée**
- Visible par un cercle grisé avec des sous-cratères

---

## 🌿 Zones de croissance

Des **zones vertes pulsantes** (×2.5 croissance) apparaissent aléatoirement sur la carte.  
Rester dans une zone te fait grandir beaucoup plus vite en mangeant des orbes.

---

## ⚡ Boost

- **PC** : Clic gauche, Espace ou Shift
- **Mobile** : Bouton ⚡ BOOST ou appui long sur l'écran
- Le boost **augmente ta vitesse** (×1.75) mais **consomme ta longueur** (ton serpent rétrécit progressivement)
- Des **orbes sont lâchés** derrière toi pendant le boost (ramassables par tout le monde)
- Le boost s'arrête automatiquement si tu es trop petit

---

## 🤖 IA des bots

Les **15 bots adversaires** ont chacun un niveau d'agressivité aléatoire et se comportent comme de vrais joueurs :

- **Fuient** les murs, les obstacles dangereux
- **Évitent** les serpents plus grands qu'eux
- **Chassent** le corps du joueur ou des autres bots
- **Ramassent** les orbes en priorité si aucune proie à portée
- **Réapparaissent** automatiquement après mort pour maintenir 15 adversaires actifs

---

## 🎵 Musique

- Place tes fichiers audio dans `assets/`
- Ajoute les noms dans le tableau `TRACKS` dans `index.html`
- Utilise le bouton **⏭ SUIVANT** en haut à droite pour changer de piste
- Le volume est réglable avec le curseur

---

## 🗺️ Minimap

La minimap (coin bas-droite) affiche :
- 🟦 Ta position (point cyan)
- 🔴 Les bots actifs
- 🟣 Les trous noirs
- 🔵 Les cratères
- 🟢 Les zones de croissance
- Les orbes bonus (points magenta)

---

## 📱 Contrôles

| Action | PC | Mobile |
|---|---|---|
| Diriger | Souris | Joystick gauche |
| Boost | Clic / Espace / Shift | Bouton ⚡ / Appui long |

---

## 🏆 Scores

Les **5 meilleurs scores** sont sauvegardés localement dans ton navigateur.  
Accessible depuis l'écran Game Over.

---

## 🛠️ Structure technique

- **Pur HTML/CSS/JS** — aucune dépendance externe
- Canvas 2D, boucle `requestAnimationFrame`
- Monde de jeu : 5000×5000 px avec caméra centrée sur le joueur
- Fond pré-rendu en offscreen canvas pour les performances
- Skins et scores persistés via `localStorage`

---

## 📝 Ajouter des musiques

```js
// Dans index.html, modifie le tableau TRACKS :
const TRACKS = [
  'assets/neon-gaming.mp3',
  'assets/synthwave.mp3',
  'assets/cyberpunk-beats.mp3',
  // ajoute autant de pistes que tu veux
];
```

---

*Fait avec ❤️ et beaucoup de néon.*
