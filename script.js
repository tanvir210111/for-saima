/* ==========================================================
   SWEETHEART / 20TH BIRTHDAY SURPRISE - JAVASCRIPT LOGIC
   100% Faithful Interactive Experience
   ========================================================== */

// --- AUDIO CONTROLLER ---
const bgMusic = document.getElementById('bg-music');
const musicToggleBtn = document.getElementById('music-toggle-btn');
const musicIcon = document.getElementById('music-icon');
const musicText = document.getElementById('music-text');
let isMusicPlaying = false;

// Web Audio API Context for Custom Sound Effects
let audioCtx = null;
function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

// Balloon Pop Sound
function playPopSound() {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(320, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.08);
    gain.gain.setValueAtTime(0.5, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.08);
  } catch (e) {}
}

// Candle Blow Sound
function playBlowSound() {
  try {
    const ctx = getAudioContext();
    const bufferSize = ctx.sampleRate * 0.4;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(600, ctx.currentTime);
    filter.frequency.linearRampToValueAtTime(150, ctx.currentTime + 0.4);
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.4, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    noise.start();
  } catch (e) {}
}

// Camera Shutter Click Sound
function playCameraSound() {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, ctx.currentTime);
    osc.frequency.setValueAtTime(600, ctx.currentTime + 0.03);
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.1);
  } catch (e) {}
}

// Golden Sparkle Ding
function playDingSound() {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1046.5, ctx.currentTime); // C6
    osc.frequency.exponentialRampToValueAtTime(1318.5, ctx.currentTime + 0.2); // E6
    gain.gain.setValueAtTime(0.25, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.4);
  } catch (e) {}
}

// Music Play / Pause Handlers
function toggleMusic() {
  if (isMusicPlaying) {
    pauseMusic();
  } else {
    startMusic();
  }
}

function startMusic() {
  bgMusic.play().then(() => {
    isMusicPlaying = true;
    musicText.textContent = 'MUSIC: ON';
    musicIcon.textContent = '🔊';
  }).catch(err => {
    console.log('Autoplay restriction:', err);
  });
}

function pauseMusic() {
  bgMusic.pause();
  isMusicPlaying = false;
  musicText.textContent = 'MUSIC: OFF';
  musicIcon.textContent = '🔇';
}

musicToggleBtn.addEventListener('click', toggleMusic);

// --- NAVIGATION CONTROLLER ---
function switchScreen(fromId, toId) {
  const fromEl = document.getElementById(fromId);
  const toEl = document.getElementById(toId);
  if (fromEl) fromEl.classList.remove('active');
  if (toEl) {
    toEl.classList.add('active');
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
    initScreenLogic(toId);
  }
}

function initScreenLogic(screenId) {
  if (screenId === 'screen-fireworks') {
    startFireworksAndHeart();
  } else if (screenId === 'screen-preparing') {
    startProgressBar();
  } else if (screenId === 'screen-celebration') {
    startRotatingQuotes();
  } else if (screenId === 'screen-letter') {
    startTypewriterLetter();
  } else if (screenId === 'screen-balloons') {
    setupBalloonGame();
  } else if (screenId === 'screen-scratch') {
    setupScratchCard();
  } else if (screenId === 'screen-memories') {
    startPolaroidDevelopment();
  }
}

// --- AMBIENT CONFETTI & DUST CANVAS ---
const ambientCanvas = document.getElementById('ambient-canvas');
const ambCtx = ambientCanvas.getContext('2d');
let ambParticles = [];

function resizeAmbientCanvas() {
  ambientCanvas.width = window.innerWidth;
  ambientCanvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeAmbientCanvas);
resizeAmbientCanvas();

class ConfettiParticle {
  constructor() {
    this.reset();
  }
  reset() {
    this.x = Math.random() * ambientCanvas.width;
    this.y = Math.random() * -ambientCanvas.height;
    this.size = Math.random() * 6 + 3;
    this.speedY = Math.random() * 1.5 + 0.8;
    this.speedX = Math.sin(Math.random() * Math.PI) * 1.2 - 0.6;
    this.rotation = Math.random() * 360;
    this.rotSpeed = Math.random() * 4 - 2;
    this.colors = ['#dfb76c', '#eed088', '#fff1c4', '#ffffff', '#c59b3f', '#967425'];
    this.color = this.colors[Math.floor(Math.random() * this.colors.length)];
    this.opacity = Math.random() * 0.7 + 0.3;
    this.isCircle = Math.random() > 0.6;
  }
  update() {
    this.y += this.speedY;
    this.x += this.speedX + Math.sin(this.y * 0.01) * 0.5;
    this.rotation += this.rotSpeed;
    if (this.y > ambientCanvas.height + 20) {
      this.reset();
      this.y = -10;
    }
  }
  draw() {
    ambCtx.save();
    ambCtx.translate(this.x, this.y);
    ambCtx.rotate((this.rotation * Math.PI) / 180);
    ambCtx.globalAlpha = this.opacity;
    ambCtx.fillStyle = this.color;
    if (this.isCircle) {
      ambCtx.beginPath();
      ambCtx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
      ambCtx.fill();
    } else {
      ambCtx.fillRect(-this.size / 2, -this.size / 4, this.size, this.size * 0.6);
    }
    ambCtx.restore();
  }
}

for (let i = 0; i < 35; i++) {
  ambParticles.push(new ConfettiParticle());
}

function animateAmbient() {
  ambCtx.clearRect(0, 0, ambientCanvas.width, ambientCanvas.height);
  for (let p of ambParticles) {
    p.update();
    p.draw();
  }
  requestAnimationFrame(animateAmbient);
}
animateAmbient();

// Trigger Extra Burst of Confetti
function burstConfetti(amount = 40) {
  for (let i = 0; i < amount; i++) {
    const p = new ConfettiParticle();
    p.x = ambientCanvas.width / 2 + (Math.random() * 120 - 60);
    p.y = ambientCanvas.height * 0.45 + (Math.random() * 60 - 30);
    p.speedY = Math.random() * -6 - 2;
    p.speedX = (Math.random() - 0.5) * 8;
    ambParticles.push(p);
  }
}

// ==========================================================
// STAGE 1: PASSKEY SCREEN
// ==========================================================
function handleUnlock() {
  const input = document.getElementById('passkey-input');
  const error = document.getElementById('passkey-error');
  const card = document.querySelector('.passkey-card');
  const val = input.value.trim();

  // Accept current year 2026 or "2026"
  if (val === '2026') {
    error.textContent = '';
    playDingSound();
    switchScreen('screen-passkey', 'screen-fireworks');
  } else {
    error.textContent = 'Incorrect passkey! Try 2026 😉';
    card.classList.remove('shake-anim');
    void card.offsetWidth; // trigger reflow
    card.classList.add('shake-anim');
  }
}

// ==========================================================
// STAGE 2: FIREWORKS & GLOWING HEART
// ==========================================================
let fireworksAnimationId = null;
let fireworksTimer = null;

function startFireworksAndHeart() {
  const canvas = document.getElementById('fireworks-canvas');
  const ctx = canvas.getContext('2d');
  const textOverlay = document.getElementById('heart-text-overlay');
  textOverlay.classList.remove('visible');

  function resize() {
    canvas.width = canvas.parentElement.clientWidth || window.innerWidth;
    canvas.height = canvas.parentElement.clientHeight || window.innerHeight;
  }
  resize();

  let particles = [];
  let rockets = [];
  let heartPoints = [];
  let heartIndex = 0;
  let isDrawingHeart = false;
  let heartDrawnPoints = [];

  // Generate Heart Path Points using cardioid formula
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2 - 30;
  const scale = Math.min(canvas.width, canvas.height) * 0.024;
  const totalPoints = 120;

  for (let i = 0; i < totalPoints; i++) {
    const t = (i / totalPoints) * Math.PI * 2;
    // Heart parametric equation
    const x = 16 * Math.pow(Math.sin(t), 3);
    const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
    heartPoints.push({
      x: centerX + x * scale,
      y: centerY + y * scale
    });
  }

  class Rocket {
    constructor() {
      this.x = Math.random() * (canvas.width * 0.8) + canvas.width * 0.1;
      this.y = canvas.height;
      this.targetY = Math.random() * (canvas.height * 0.45) + canvas.height * 0.15;
      this.speed = Math.random() * 4 + 7;
      this.color = ['#ffd700', '#ffaa00', '#fff', '#e5c07b'][Math.floor(Math.random() * 4)];
      this.exploded = false;
    }
    update() {
      this.y -= this.speed;
      if (this.y <= this.targetY) {
        this.exploded = true;
        this.explode();
      }
    }
    explode() {
      const pCount = Math.floor(Math.random() * 35) + 35;
      for (let i = 0; i < pCount; i++) {
        particles.push(new FireworkParticle(this.x, this.y, this.color));
      }
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
    }
  }

  class FireworkParticle {
    constructor(x, y, color) {
      this.x = x;
      this.y = y;
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 4 + 1;
      this.vx = Math.cos(angle) * speed;
      this.vy = Math.sin(angle) * speed;
      this.gravity = 0.06;
      this.alpha = 1;
      this.decay = Math.random() * 0.02 + 0.015;
      this.color = color;
      this.size = Math.random() * 2 + 1.5;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.vy += this.gravity;
      this.vx *= 0.98;
      this.alpha -= this.decay;
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = Math.max(0, this.alpha);
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.shadowBlur = 8;
      ctx.shadowColor = this.color;
      ctx.fill();
      ctx.restore();
    }
  }

  let startTime = Date.now();
  let heartStartTime = startTime + 3200;

  function loop() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const now = Date.now();

    // Launch random rockets during fireworks phase
    if (Math.random() < 0.08 && rockets.length < 5) {
      rockets.push(new Rocket());
    }

    // Update & draw rockets
    for (let i = rockets.length - 1; i >= 0; i--) {
      rockets[i].update();
      rockets[i].draw();
      if (rockets[i].exploded) rockets.splice(i, 1);
    }

    // Update & draw firework particles
    for (let i = particles.length - 1; i >= 0; i--) {
      particles[i].update();
      particles[i].draw();
      if (particles[i].alpha <= 0) particles.splice(i, 1);
    }

    // Draw Glowing Heart after 3.2s
    if (now > heartStartTime) {
      isDrawingHeart = true;
      if (heartIndex < heartPoints.length) {
        // Draw 2 points per frame for smooth speed
        heartDrawnPoints.push(heartPoints[heartIndex]);
        heartIndex++;
        if (heartIndex < heartPoints.length) {
          heartDrawnPoints.push(heartPoints[heartIndex]);
          heartIndex++;
        }
      } else {
        // Show Text Inside Heart
        textOverlay.classList.add('visible');
      }
    }

    // Render Heart Beads / Pearls
    if (heartDrawnPoints.length > 0) {
      for (let i = 0; i < heartDrawnPoints.length; i++) {
        const pt = heartDrawnPoints[i];
        ctx.save();
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#fff4d0';
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#ffd700';
        ctx.fill();

        // Inner glowing core
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        ctx.restore();
      }
    }

    fireworksAnimationId = requestAnimationFrame(loop);
  }

  loop();

  // Auto transition after 14 seconds
  clearTimeout(fireworksTimer);
  fireworksTimer = setTimeout(() => {
    finishFireworks();
  }, 14500);

  document.getElementById('skip-fireworks-btn').onclick = finishFireworks;

  function finishFireworks() {
    clearTimeout(fireworksTimer);
    if (fireworksAnimationId) cancelAnimationFrame(fireworksAnimationId);
    switchScreen('screen-fireworks', 'screen-preparing');
  }
}

// ==========================================================
// STAGE 3: PREPARING YOUR SURPRISE
// ==========================================================
function startProgressBar() {
  const bar = document.getElementById('progress-bar-fill');
  const startBtn = document.getElementById('start-surprise-btn');
  bar.style.width = '0%';
  startBtn.classList.remove('visible-fade');
  startBtn.classList.add('hidden-fade');

  let progress = 0;
  const interval = setInterval(() => {
    progress += 2.5;
    if (progress > 100) progress = 100;
    bar.style.width = progress + '%';

    if (progress >= 100) {
      clearInterval(interval);
      playDingSound();
      startBtn.classList.remove('hidden-fade');
      startBtn.classList.add('visible-fade');
    }
  }, 40);

  startBtn.onclick = () => {
    playDingSound();
    switchScreen('screen-preparing', 'screen-gift');
  };
}

// ==========================================================
// STAGE 4: SURPRISE GIFT BOX
// ==========================================================
let isGiftOpened = false;

function handleOpenGift() {
  if (isGiftOpened) return;
  isGiftOpened = true;

  const lid = document.getElementById('gift-lid');
  const cat = document.getElementById('popout-cat');
  const hint = document.getElementById('gift-hint');

  // Lift lid and pop out cat
  lid.classList.add('opened');
  cat.classList.add('popped');
  hint.textContent = '🎉 Surprise! Happy Birthday Saima! 🎉';

  burstConfetti(60);
  playDingSound();

  // Start music automatically!
  startMusic();

  // Transition to celebration screen after 3.2s
  setTimeout(() => {
    switchScreen('screen-gift', 'screen-celebration');
  }, 3200);
}

// ==========================================================
// STAGE 5: BIRTHDAY CELEBRATION
// ==========================================================
const celebrationQuotes = [
  "Chaand si roshni ho tere har din mein ✨",
  "Hansti rahe tu, khilta rahe ye dil tera 🌸",
  "Saalgirah mubarak ho, meri pyaari Saima 🎶",
  "Duaon se bhari ho ye nayi umar teri 💛"
];
let quoteIndex = 0;
let quoteTimer = null;

function startRotatingQuotes() {
  const quoteEl = document.getElementById('rotating-quote');
  quoteIndex = 0;
  quoteEl.textContent = celebrationQuotes[0];

  clearInterval(quoteTimer);
  quoteTimer = setInterval(() => {
    quoteEl.classList.add('fade-out');
    setTimeout(() => {
      quoteIndex = (quoteIndex + 1) % celebrationQuotes.length;
      quoteEl.textContent = celebrationQuotes[quoteIndex];
      quoteEl.classList.remove('fade-out');
    }, 400);
  }, 3500);

  document.getElementById('open-letter-btn').onclick = () => {
    clearInterval(quoteTimer);
    playDingSound();
    switchScreen('screen-celebration', 'screen-letter');
  };
}

// ==========================================================
// STAGE 6: A LETTER FOR YOU (TYPEWRITER EFFECT)
// ==========================================================
const letterParagraphs = [
  "Twenty looks beautiful on you. This birthday isn't just another number, it's the opening page of a chapter you've already started writing in your own quiet, determined way. Every plan you've mapped out, every skill you've been building late into the night, every dream you refuse to let go of, it's all leading somewhere, and today is proof of how far you've come.",
  "\n\nMay this year meet your effort with opportunity, your patience with reward, and your heart with exactly the peace and privacy it deserves. Here's to you, Saima, thoughtful, driven, and only just getting started. 🎂✨"
];
const fullLetterText = letterParagraphs.join('');

function startTypewriterLetter() {
  const container = document.getElementById('letter-body-text');
  const signoff = document.getElementById('letter-signoff');
  const continueBtn = document.getElementById('continue-cake-btn');
  container.innerHTML = '<span class="letter-cursor">|</span>';
  signoff.classList.remove('visible');

  let charIndex = 0;
  const speed = 25; // ms per char

  function typeChar() {
    if (charIndex < fullLetterText.length) {
      const currentText = fullLetterText.substring(0, charIndex + 1);
      container.innerHTML = currentText + '<span class="letter-cursor">|</span>';
      charIndex++;
      setTimeout(typeChar, speed);
    } else {
      // Done typing
      container.innerHTML = fullLetterText;
      signoff.classList.add('visible');
    }
  }

  typeChar();

  continueBtn.onclick = () => {
    playDingSound();
    switchScreen('screen-letter', 'screen-cake');
  };
}

// ==========================================================
// STAGE 7: MAKE A WISH (CAKE & CANDLES)
// ==========================================================
let areCandlesBlown = false;

function handleBlowCandles() {
  if (areCandlesBlown) return;
  areCandlesBlown = true;

  playBlowSound();

  const flames = document.getElementById('flames-container');
  const cakeImg = document.getElementById('cake-img');
  const blowBtn = document.getElementById('blow-candles-btn');
  const resultWrap = document.getElementById('wish-result-wrap');

  // Extinguish flames
  flames.classList.add('blown-out');
  setTimeout(() => {
    cakeImg.src = 'assets/cake_unlit.png';
  }, 250);

  // Update button state
  blowBtn.innerHTML = '<span class="btn-icon">🕯️</span> WISH MADE!';
  blowBtn.disabled = true;

  // Show result
  resultWrap.classList.remove('hidden-fade');
  resultWrap.classList.add('visible-fade');

  burstConfetti(50);

  document.getElementById('see-wishes-btn').onclick = () => {
    playDingSound();
    switchScreen('screen-cake', 'screen-wishes');
  };
}

// ==========================================================
// STAGE 8: BIRTHDAY WISHES
// ==========================================================
document.getElementById('one-more-surprise-btn').onclick = () => {
  playDingSound();
  switchScreen('screen-wishes', 'screen-balloons');
};

// ==========================================================
// STAGE 9: POP EVERY BALLOON GAME
// ==========================================================
// Total 18 letters = 18 balloons:
// "YOU ARE AMAZING" (13) + "SAIMA" (5) = 18 letters!
const secretLetters = [
  'Y', 'O', 'U', 'A', 'R', 'E', 'A', 'M', 'A', 'Z', 'I', 'N', 'G',
  'J', 'U', 'E', 'I', '💖'
];

function setupBalloonGame() {
  const row1 = document.getElementById('row-1');
  const row2 = document.getElementById('row-2');
  const grid = document.getElementById('balloons-grid');
  const nextBtn = document.getElementById('next-surprise-balloon-btn');

  row1.innerHTML = '';
  row2.innerHTML = '';
  grid.innerHTML = '';
  nextBtn.classList.remove('visible-fade');
  nextBtn.classList.add('hidden-fade');

  // Build Secret Message Slots:
  // Row 1: "YOU ARE AMAZING"
  const phrase1 = "YOU ARE AMAZING";
  let letterIndex = 0;
  for (let ch of phrase1) {
    const slot = document.createElement('span');
    if (ch === ' ') {
      slot.className = 'letter-slot space';
      slot.innerHTML = '&nbsp;';
    } else {
      slot.className = 'letter-slot';
      slot.id = 'slot-' + letterIndex;
      slot.textContent = '_';
      letterIndex++;
    }
    row1.appendChild(slot);
  }

  // Row 2: "SAIMA"
  const phrase2 = "SAIMA";
  for (let ch of phrase2) {
    if (ch === ' ') continue;
    const slot = document.createElement('span');
    slot.className = 'letter-slot';
    slot.id = 'slot-' + letterIndex;
    slot.textContent = '_';
    letterIndex++;
    row2.appendChild(slot);
  }

  // Generate 18 Balloons
  let poppedCount = 0;
  for (let i = 0; i < 18; i++) {
    const b = document.createElement('div');
    b.className = 'balloon-item';
    b.dataset.idx = i;
    b.addEventListener('click', () => {
      if (b.classList.contains('popped')) return;
      b.classList.add('popped');
      playPopSound();

      // Reveal corresponding letter
      const slot = document.getElementById('slot-' + poppedCount);
      if (slot) {
        slot.textContent = secretLetters[poppedCount];
        slot.classList.add('revealed');
      }
      poppedCount++;

      // When all 18 popped
      if (poppedCount >= 18) {
        burstConfetti(60);
        playDingSound();
        nextBtn.classList.remove('hidden-fade');
        nextBtn.classList.add('visible-fade');
      }
    });
    grid.appendChild(b);
  }

  nextBtn.onclick = () => {
    playDingSound();
    switchScreen('screen-balloons', 'screen-scratch');
  };
}

// ==========================================================
// STAGE 10: A HIDDEN NOTE (SCRATCH CARD)
// ==========================================================
function setupScratchCard() {
  const canvas = document.getElementById('scratch-canvas');
  const ctx = canvas.getContext('2d');
  const continueBtn = document.getElementById('scratch-continue-btn');
  const promptEl = document.getElementById('scratch-prompt');

  continueBtn.classList.remove('visible-fade');
  continueBtn.classList.add('hidden-fade');
  promptEl.textContent = '👆 Rub the card with your mouse or finger!';

  canvas.width = canvas.parentElement.clientWidth || 340;
  canvas.height = canvas.parentElement.clientHeight || 220;

  // Draw Luxury Golden Metallic Foil
  const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  grad.addColorStop(0, '#be8d3c');
  grad.addColorStop(0.3, '#ffd778');
  grad.addColorStop(0.5, '#dfb76c');
  grad.addColorStop(0.7, '#eed088');
  grad.addColorStop(1, '#946f25');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Decorative text "SCRATCH HERE"
  ctx.font = "bold 15px 'Cinzel', serif";
  ctx.fillStyle = "#3d2b0e";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.letterSpacing = "3px";
  ctx.fillText("SCRATCH HERE", canvas.width / 2, canvas.height / 2);

  let isScratching = false;
  let totalPixels = canvas.width * canvas.height;
  let scratchedPixels = 0;
  let isFullyRevealed = false;

  function scratch(e) {
    if (!isScratching || isFullyRevealed) return;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left;
    const y = (e.clientY || (e.touches && e.touches[0].clientY)) - rect.top;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 22, 0, Math.PI * 2);
    ctx.fill();

    checkPercentage();
  }

  function checkPercentage() {
    if (isFullyRevealed) return;
    // Check every few strokes
    if (Math.random() > 0.3) return;

    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let transparent = 0;
    // Sample every 16th pixel for high performance
    for (let i = 3; i < imgData.data.length; i += 64) {
      if (imgData.data[i] === 0) transparent++;
    }

    const ratio = transparent / (imgData.data.length / 64);
    if (ratio > 0.42) {
      isFullyRevealed = true;
      canvas.style.opacity = '0';
      setTimeout(() => {
        canvas.style.display = 'none';
      }, 500);

      promptEl.textContent = '🤍 Surprise revealed! 🤍';
      burstConfetti(40);
      playDingSound();
      continueBtn.classList.remove('hidden-fade');
      continueBtn.classList.add('visible-fade');
    }
  }

  canvas.addEventListener('mousedown', (e) => { isScratching = true; scratch(e); });
  canvas.addEventListener('mousemove', scratch);
  window.addEventListener('mouseup', () => { isScratching = false; });

  canvas.addEventListener('touchstart', (e) => { isScratching = true; scratch(e); }, { passive: true });
  canvas.addEventListener('touchmove', scratch, { passive: true });
  window.addEventListener('touchend', () => { isScratching = false; });

  continueBtn.onclick = () => {
    playDingSound();
    switchScreen('screen-scratch', 'screen-memories');
  };
}

// ==========================================================
// STAGE 11: CAPTURED MEMORIES (POLAROID DEVELOPMENT)
// ==========================================================
function startPolaroidDevelopment() {
  const polaroids = [
    document.getElementById('polaroid-1'),
    document.getElementById('polaroid-2'),
    document.getElementById('polaroid-3'),
    document.getElementById('polaroid-4')
  ];
  const counterText = document.getElementById('photo-counter-text');
  const statusText = document.getElementById('developed-status');
  const continueBtn = document.getElementById('memories-continue-btn');
  const flash = document.getElementById('flash-overlay');

  continueBtn.classList.remove('visible-fade');
  continueBtn.classList.add('hidden-fade');

  // Reset polaroids
  polaroids.forEach(p => p.classList.remove('developed'));

  function developStep(step) {
    if (step >= polaroids.length) {
      // Done all 4
      counterText.textContent = '4 OF 4 PHOTOS READY';
      statusText.textContent = '4 MEMORIES DEVELOPED';
      burstConfetti(45);
      continueBtn.classList.remove('hidden-fade');
      continueBtn.classList.add('visible-fade');
      return;
    }

    // Flash animation & camera shutter click
    counterText.textContent = `PHOTO ${step + 1} OF 4`;
    playCameraSound();
    flash.classList.add('active');
    setTimeout(() => {
      flash.classList.remove('active');
      polaroids[step].classList.add('developed');
      setTimeout(() => {
        developStep(step + 1);
      }, 1100);
    }, 150);
  }

  // Start after small initial delay
  setTimeout(() => {
    developStep(0);
  }, 600);

  continueBtn.onclick = () => {
    playDingSound();
    switchScreen('screen-memories', 'screen-last');
  };
}

// ==========================================================
// STAGE 12: ONE LAST THING
// ==========================================================
document.getElementById('final-surprise-btn').onclick = () => {
  playDingSound();
  burstConfetti(50);
  switchScreen('screen-last', 'screen-end');
};

// ==========================================================
// STAGE 13: THE END & REPLAY
// ==========================================================
document.getElementById('replay-btn').onclick = () => {
  playDingSound();
  // Reset all states
  isGiftOpened = false;
  areCandlesBlown = false;
  document.getElementById('gift-lid').classList.remove('opened');
  document.getElementById('popout-cat').classList.remove('popped');
  document.getElementById('gift-hint').textContent = '🎁 Tap the gift to open your surprise!';
  document.getElementById('cake-img').src = 'assets/cake_lit.png';
  document.getElementById('flames-container').classList.remove('blown-out');
  const blowBtn = document.getElementById('blow-candles-btn');
  blowBtn.innerHTML = '<span class="btn-icon">🕯️</span> BLOW THE CANDLES &amp; MAKE A WISH';
  blowBtn.disabled = false;
  document.getElementById('wish-result-wrap').classList.add('hidden-fade');

  const scratchCanvas = document.getElementById('scratch-canvas');
  scratchCanvas.style.display = 'block';
  scratchCanvas.style.opacity = '1';

  // Go back to Passkey
  switchScreen('screen-end', 'screen-passkey');
};
