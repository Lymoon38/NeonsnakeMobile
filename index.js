<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>NeonSnake</title>
  <style>
    body {
      margin: 0;
      background: radial-gradient(circle, #000000, #111111);
      color: #00ffff;
      font-family: 'Courier New', Courier, monospace;
      overflow: hidden;
    }
    #start-screen, #game-over-screen {
      position: absolute;
      width: 100%;
      height: 100%;
      background: black;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      z-index: 10;
      transition: opacity 1s ease;
    }
    #start-screen h1 {
      font-size: 4rem;
      color: #00ffff;
      text-shadow: 0 0 20px #00ffff;
      margin-bottom: 2rem;
    }
    #start-button, #replay-button {
      padding: 1rem 2rem;
      font-size: 1.5rem;
      color: #000;
      background: #00ffff;
      border: none;
      border-radius: 1rem;
      cursor: pointer;
      box-shadow: 0 0 10px #00ffff;
      transition: background 0.3s;
    }
    #start-button:hover, #replay-button:hover {
      background: #00cccc;
    }
    #score {
      position: absolute;
      top: 10px;
      left: 10px;
      font-size: 1.5rem;
      z-index: 5;
      display: none;
    }
    #highscores {
      position: absolute;
      top: 10px;
      right: 10px;
      font-size: 1.2rem;
      color: #00ffff;
      background: rgba(0,0,0,0.6);
      padding: 10px;
      border-radius: 10px;
      z-index: 5;
    }
    #minimap {
      position: absolute;
      bottom: 10px;
      right: 10px;
      width: 150px;
      height: 150px;
      border: 2px solid #00ffff;
      background: rgba(0,0,0,0.7);
      z-index: 10;
    }
    canvas {
      display: block;
      border: 10px solid #00ffff;
      box-shadow: 0 0 40px #00ffff;
    }
    .rain {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 9;
    }
    .drop {
      position: absolute;
      width: 2px;
      height: 15px;
      background: #00ffff;
      opacity: 0.5;
      animation: fall 1s linear infinite;
    }
    @keyframes fall {
      to { transform: translateY(100vh); }
    }
  </style>
</head>
<body>
  <div id="start-screen">
    <h1>NeonSnake</h1>
    <button id="start-button">Jouer</button>
  </div>
  <div id="score">Score: 0</div>
  <div id="highscores"></div>
  <canvas id="gameCanvas"></canvas>
  <canvas id="minimap"></canvas>
  <div id="game-over-screen" style="display: none;">
    <h2 style="color: #00ffff; font-size: 3rem; margin-bottom: 2rem;">Game Over</h2>
    <input type="text" id="player-name" placeholder="Votre pseudo" style="padding: 0.5rem; font-size: 1rem; margin-bottom: 1rem;" />
    <button id="replay-button">Rejouer</button>
  </div>
  <div id="weather-container" class="rain"></div>
  <script>
    // --- Variables de boost ---.//
let boostActive = false;
let boostPower = 0;
const maxBoostPower = 200; // max frames de boost

// --- Gestion souris / tactile pour boost ---
let boosting = false;

document.addEventListener('mousedown', () => { boosting = true; });
document.addEventListener('mouseup', () => { boosting = false; });

canvas.addEventListener('touchstart', (e) => {
  boosting = true;
  const t = e.touches[0];
  mouse.x = t.clientX;
  mouse.y = t.clientY;
});
canvas.addEventListener('touchmove', (e) => {
  const t = e.touches[0];
  mouse.x = t.clientX;
  mouse.y = t.clientY;
});
canvas.addEventListener('touchend', () => { boosting = false; });

// --- Boucle de boost ---
function handleBoost() {
  if (bonusActive && boosting && boostPower < maxBoostPower) {
    boostActive = true;
    boostPower++;
    speed = 4.0; // vitesse double
  } else {
    boostActive = false;
    speed = 2.0; // vitesse normale
    if (boostPower > 0) boostPower--;
  }
}

// --- Dessin jauge de boost ---
function drawBoostGauge() {
  if (!bonusActive) return;
  ctx.fillStyle = 'rgba(0,255,255,0.2)';
  ctx.fillRect(20, canvas.height - 40, maxBoostPower, 20);
  ctx.fillStyle = '#00ffff';
  ctx.fillRect(20, canvas.height - 40, boostPower, 20);
  ctx.strokeStyle = '#fff';
  ctx.strokeRect(20, canvas.height - 40, maxBoostPower, 20);
}

// --- Modif drawSnake pour boost visuel ---
function drawSnake() {
  snake.forEach((seg, i) => {
    ctx.beginPath();
    ctx.arc(seg.x - camera.x, seg.y - camera.y, snakeRadius, 0, Math.PI * 2);
    if (boostActive && i === 0) {
      ctx.fillStyle = '#00ffff';
      ctx.shadowColor = '#00ffff';
      ctx.shadowBlur = 30;
    } else {
      ctx.fillStyle = `hsl(${(i * 10 + score * 5) % 360}, 100%, 50%)`;
      ctx.shadowColor = '#fff';
      ctx.shadowBlur = 10;
    }
    ctx.fill();
    ctx.shadowBlur = 0;

    // Tête avec yeux
    if (i === 0) {
      const eyeRadius = 12;
      const eyeOffsetX = 14;
      const eyeOffsetY = -14;
      const angle = Math.atan2(lastDirection.dy, lastDirection.dx);
      const pupilOffset = 4;
      // Yeux blancs
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(seg.x - eyeOffsetX - camera.x, seg.y + eyeOffsetY - camera.y, eyeRadius, 0, Math.PI*2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(seg.x + eyeOffsetX - camera.x, seg.y + eyeOffsetY - camera.y, eyeRadius, 0, Math.PI*2);
      ctx.fill();
      // Pupilles
      ctx.fillStyle = '#000';
      ctx.beginPath();
      ctx.arc(seg.x - eyeOffsetX + Math.cos(angle) * pupilOffset - camera.x, seg.y + eyeOffsetY + Math.sin(angle) * pupilOffset - camera.y, 5, 0, Math.PI*2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(seg.x + eyeOffsetX + Math.cos(angle) * pupilOffset - camera.x, seg.y + eyeOffsetY + Math.sin(angle) * pupilOffset - camera.y, 5, 0, Math.PI*2);
      ctx.fill();
    }
  });
}

// --- Boucle principale modifiée ---
function loop() {
  if (!gameRunning) return;

  handleBoost(); // gestion boost

  // Avancer serpent vers la souris
  const head = { ...snake[0] };
  const worldMouseX = camera.x + mouse.x;
  const worldMouseY = camera.y + mouse.y;
  const dx = worldMouseX - head.x;
  const dy = worldMouseY - head.y;
  const dist = Math.sqrt(dx*dx + dy*dy);
  if (dist > 0) {
    head.x += (dx / dist) * speed;
    head.y += (dy / dist) * speed;
    lastDirection.dx = dx / dist;
    lastDirection.dy = dy / dist;
  }
  snake.unshift(head);
  while (snake.length > 50 + score) snake.pop();

  // Collision bordures
  if (head.x < 0 || head.x > worldWidth || head.y < 0 || head.y > worldHeight) {
    showGameOver();
    return;
  }

  checkObstacleCollisions(head);
  checkOrbCollisions(head);

  if (bonusActive && !boostActive) {
    bonusTimer--;
    if (bonusTimer <= 0) bonusActive = false;
  }

  camera.x = head.x - canvas.width / 2;
  camera.y = head.y - canvas.height / 2;

  ctx.fillStyle = 'rgba(0,0,0,0.3)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  drawBarrier();
  drawObstacles();
  drawOrbs();
  drawSnake();
  drawMinimap();
  drawBoostGauge(); // jauge boost

  requestAnimationFrame(loop);
}

  </script>
</body>
</html>
