// ==============================================================================
// 🎮 KYAN & ALIN: KUTA BEACH, BALI ➔ SURABAYA ➔ BANDUNG ARCADE MINI-GAME
// Features a Sweet Pixel Hug Reunion Animation, Sound FX & Chapter Cutscenes
// ==============================================================================

(function() {
  const canvas = document.getElementById('game-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  // Chiptune Sound Synthesizer via Web Audio API
  let audioCtx = null;
  function getAudioCtx() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') audioCtx.resume();
    return audioCtx;
  }

  function playTone(freq, type, duration, delay = 0) {
    try {
      const actx = getAudioCtx();
      const osc = actx.createOscillator();
      const gain = actx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, actx.currentTime + delay);
      gain.gain.setValueAtTime(0.12, actx.currentTime + delay);
      gain.gain.exponentialRampToValueAtTime(0.001, actx.currentTime + delay + duration);
      osc.connect(gain);
      gain.connect(actx.destination);
      osc.start(actx.currentTime + delay);
      osc.stop(actx.currentTime + delay + duration);
    } catch(e) {}
  }

  function sfxJump() {
    try {
      const actx = getAudioCtx();
      const osc = actx.createOscillator();
      const gain = actx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(160, actx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(440, actx.currentTime + 0.14);
      gain.gain.setValueAtTime(0.15, actx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, actx.currentTime + 0.14);
      osc.connect(gain);
      gain.connect(actx.destination);
      osc.start();
      osc.stop(actx.currentTime + 0.14);
    } catch(e) {}
  }

  function sfxCollect() {
    playTone(523.25, 'triangle', 0.08, 0);      // C5
    playTone(659.25, 'triangle', 0.08, 0.08);   // E5
    playTone(783.99, 'triangle', 0.15, 0.16);   // G5
  }

  function sfxHug() {
    playTone(523.25, 'sine', 0.2, 0);       // C5
    playTone(659.25, 'sine', 0.2, 0.15);    // E5
    playTone(783.99, 'sine', 0.2, 0.3);     // G5
    playTone(1046.5, 'sine', 0.5, 0.45);    // C6 (Warm resolution)
  }

  // Game States
  let currentLevelIdx = 0;
  let treatsCollected = 0;
  let gameRunning = false;
  let animFrameId = null;
  let isHugging = false;
  let hugCoords = { x: 715, y: 350 };

  // Player Object (Kyan)
  const player = {
    x: 40,
    y: 330,
    width: 24,
    height: 36,
    vx: 0,
    vy: 0,
    speed: 4.0,
    jumpPower: -9.8,
    grounded: false,
    facing: 1
  };

  // 3 Chapters: Bali ➔ Railway ➔ Bandung Meadow
  const levels = [
    {
      chapter: "Chapter 1 • 2023",
      title: "Kuta Beach, Bali: 'She Said Yes!' 🌊",
      kmLeft: 670,
      dialogue: "Kyan: 'At Kuta Beach, Bali, with the ocean at our feet, you said YES. The happiest day of my life.'",
      bgGradient: ["#f97316", "#fed7aa", "#38bdf8"],
      isBeach: true,
      platforms: [
        { x: 0, y: 400, w: 800, h: 50, color: "#d97706" }, // Sand
        { x: 160, y: 310, w: 100, h: 16, color: "#b45309" },
        { x: 330, y: 240, w: 110, h: 16, color: "#b45309" },
        { x: 500, y: 290, w: 110, h: 16, color: "#b45309" }
      ],
      treats: [
        { x: 200, y: 275, collected: false, icon: "🐚", name: "Kuta Sea Shell" },
        { x: 375, y: 205, collected: false, icon: "🌸", name: "Bali Frangipani" },
        { x: 545, y: 255, collected: false, icon: "🌊", name: "Bali Sunset Breeze" }
      ],
      goal: { x: 715, y: 340, w: 36, h: 48, reached: false }
    },
    {
      chapter: "Chapter 2 • 2024–2025",
      title: "Crossing Java: Surabaya ➔ Bandung (670 km) 🚂",
      kmLeft: 335,
      dialogue: "Alin: 'Surabaya to Bandung is far, but eating ice cream over our calls makes it feel next door!'",
      bgGradient: ["#0f172a", "#1e1b4b", "#31103f"],
      isBeach: false,
      platforms: [
        { x: 0, y: 400, w: 800, h: 50, color: "#334155" }, // Tracks
        { x: 140, y: 320, w: 90, h: 16, color: "#475569" },
        { x: 280, y: 250, w: 100, h: 16, color: "#475569" },
        { x: 440, y: 200, w: 110, h: 16, color: "#475569" },
        { x: 600, y: 280, w: 90, h: 16, color: "#475569" }
      ],
      treats: [
        { x: 175, y: 285, collected: false, icon: "🍦", name: "Vanilla Cone" },
        { x: 320, y: 215, collected: false, icon: "🍧", name: "Strawberry Sundae" },
        { x: 485, y: 165, collected: false, icon: "🍦", name: "Chocolate Swirl" }
      ],
      goal: { x: 715, y: 340, w: 36, h: 48, reached: false }
    },
    {
      chapter: "Chapter 3 • 2026",
      title: "Bandung Flower Meadow: 3 Years Strong 🌸",
      kmLeft: 0,
      dialogue: "Together: 'Happy 3-Year Anniversary! 1,096 days from Kuta Beach to forever!' 💖✨",
      bgGradient: ["#38bdf8", "#bae6fd", "#86efac"],
      isBeach: false,
      platforms: [
        { x: 0, y: 400, w: 800, h: 50, color: "#15803d" }, // Green Meadow
        { x: 120, y: 320, w: 100, h: 16, color: "#16a34a" },
        { x: 270, y: 250, w: 110, h: 16, color: "#16a34a" },
        { x: 430, y: 210, w: 120, h: 16, color: "#16a34a" },
        { x: 600, y: 290, w: 110, h: 16, color: "#16a34a" }
      ],
      treats: [
        { x: 160, y: 285, collected: false, icon: "🌸", name: "Meadow Flower" },
        { x: 315, y: 215, collected: false, icon: "🎁", name: "Care Package" },
        { x: 480, y: 175, collected: false, icon: "💍", name: "3-Year Ring" }
      ],
      goal: { x: 710, y: 340, w: 40, h: 48, reached: false }
    }
  ];

  // Input Listeners
  const keys = { left: false, right: false, up: false };

  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') keys.left = true;
    if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') keys.right = true;
    if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W' || e.key === ' ') {
      keys.up = true;
      e.preventDefault();
    }
  });

  window.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') keys.left = false;
    if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') keys.right = false;
    if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W' || e.key === ' ') keys.up = false;
  });

  // Mobile Touch Listeners
  const btnLeft = document.getElementById('btn-left');
  const btnRight = document.getElementById('btn-right');
  const btnJump = document.getElementById('btn-jump');

  if (btnLeft) {
    btnLeft.addEventListener('touchstart', (e) => { e.preventDefault(); keys.left = true; });
    btnLeft.addEventListener('touchend', (e) => { e.preventDefault(); keys.left = false; });
  }
  if (btnRight) {
    btnRight.addEventListener('touchstart', (e) => { e.preventDefault(); keys.right = true; });
    btnRight.addEventListener('touchend', (e) => { e.preventDefault(); keys.right = false; });
  }
  if (btnJump) {
    btnJump.addEventListener('touchstart', (e) => { e.preventDefault(); keys.up = true; });
    btnJump.addEventListener('touchend', (e) => { e.preventDefault(); keys.up = false; });
  }

  function initLevel(index) {
    currentLevelIdx = index;
    const lvl = levels[currentLevelIdx];
    player.x = 40;
    player.y = 330;
    player.vx = 0;
    player.vy = 0;
    player.grounded = false;
    treatsCollected = 0;
    isHugging = false;

    lvl.treats.forEach(t => t.collected = false);
    lvl.goal.reached = false;

    const hudChapter = document.getElementById('hud-chapter');
    const hudTreats = document.getElementById('hud-treats');
    const hudKm = document.getElementById('hud-km');
    const dialogue = document.getElementById('game-dialogue');

    if (hudChapter) hudChapter.textContent = lvl.chapter;
    if (hudTreats) hudTreats.textContent = "0";
    if (hudKm) hudKm.textContent = lvl.kmLeft;
    if (dialogue) dialogue.innerHTML = lvl.dialogue;
  }

  // Draw Kyan (Solo)
  function drawPlayer(x, y, facing) {
    ctx.save();
    ctx.translate(x + player.width / 2, y + player.height / 2);
    if (facing < 0) ctx.scale(-1, 1);

    // Jacket (Navy)
    ctx.fillStyle = '#1e3a8a';
    ctx.fillRect(-10, -6, 20, 24);

    // Head / Skin
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(-8, -18, 16, 13);

    // Hair
    ctx.fillStyle = '#1c1917';
    ctx.fillRect(-9, -20, 18, 6);
    ctx.fillRect(-9, -16, 4, 4);

    // Eye
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(2, -14, 3, 3);

    // Pants
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(-8, 18, 7, 10);
    ctx.fillRect(1, 18, 7, 10);

    // Shoes
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-9, 26, 8, 4);
    ctx.fillRect(1, 26, 8, 4);

    ctx.restore();
  }

  // Draw Alin (Solo)
  function drawAlin(x, y) {
    ctx.save();
    ctx.translate(x + 16, y + 24);

    const bob = Math.sin(Date.now() / 280) * 4;
    ctx.font = "16px sans-serif";
    ctx.fillText("💖", -8, -32 + bob);

    // Dress
    ctx.fillStyle = '#f472b6';
    ctx.beginPath();
    ctx.moveTo(0, -6);
    ctx.lineTo(12, 18);
    ctx.lineTo(-12, 18);
    ctx.closePath();
    ctx.fill();

    // Head / Skin
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(-7, -18, 14, 12);

    // Chestnut Hair
    ctx.fillStyle = '#451a03';
    ctx.fillRect(-9, -20, 18, 6);
    ctx.fillRect(-10, -16, 5, 22);
    ctx.fillRect(5, -16, 5, 22);

    // Eyes
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-3, -14, 2, 2);
    ctx.fillRect(2, -14, 2, 2);

    // Pink Flower Hairpin
    ctx.fillStyle = '#ec4899';
    ctx.fillRect(-4, -20, 4, 4);

    ctx.restore();
  }

  // ============================================================================
  // 🫂 THE PIXEL HUG EMBRACE CUTSCENE
  // ============================================================================
  function drawHug(x, y) {
    ctx.save();
    ctx.translate(x, y);

    const bob = Math.sin(Date.now() / 220) * 3;

    // Floating Hearts rising above the hug
    for (let i = 0; i < 4; i++) {
      const heartTime = (Date.now() / 380 + i * 1.1) % 3;
      const hy = -45 - heartTime * 24;
      const hx = Math.sin(Date.now() / 280 + i * 1.5) * 16;
      ctx.font = "14px sans-serif";
      ctx.fillText(i % 2 === 0 ? "💖" : "🤍", hx - 6, hy);
    }

    // Cute Pixel Speech Bubble: "I missed you 🤍"
    ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
    ctx.fillRect(-48, -58 + bob, 100, 20);
    ctx.fillStyle = "#000";
    ctx.font = "bold 9px sans-serif";
    ctx.fillText("I missed you 🤍", -40, -44 + bob);

    // Kyan's legs & pants
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(-14, 18 + bob, 12, 14);

    // Alin's dress lower hem
    ctx.fillStyle = '#f472b6';
    ctx.fillRect(-2, 16 + bob, 14, 16);

    // Kyan's torso & jacket (embracing)
    ctx.fillStyle = '#1e3a8a';
    ctx.fillRect(-16, -6 + bob, 18, 24);

    // Alin's dress & torso (embracing)
    ctx.fillStyle = '#f472b6';
    ctx.fillRect(-2, -6 + bob, 18, 24);

    // Heads touching / resting on shoulder
    // Kyan's head
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(-14, -18 + bob, 14, 13);
    // Kyan's hair
    ctx.fillStyle = '#1c1917';
    ctx.fillRect(-16, -21 + bob, 16, 6);

    // Alin's head resting sweetly on Kyan's shoulder
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(-2, -16 + bob, 13, 12);
    // Alin's hair cascading down
    ctx.fillStyle = '#451a03';
    ctx.fillRect(-1, -19 + bob, 16, 6);
    ctx.fillRect(8, -15 + bob, 6, 24);

    // Embracing Arms wrapped around each other!
    // Kyan's arm around Alin's back
    ctx.fillStyle = '#1e3a8a';
    ctx.fillRect(-4, 4 + bob, 18, 6);
    ctx.fillStyle = '#fed7aa'; // Kyan's hand
    ctx.fillRect(13, 3 + bob, 4, 6);

    // Alin's arm wrapped around Kyan's neck/shoulder
    ctx.fillStyle = '#f472b6';
    ctx.fillRect(-8, -2 + bob, 14, 6);
    ctx.fillStyle = '#fed7aa'; // Alin's hand
    ctx.fillRect(-12, -3 + bob, 5, 5);

    ctx.restore();
  }

  // Physics Loop
  function update() {
    const lvl = levels[currentLevelIdx];

    if (!isHugging) {
      if (keys.left) {
        player.vx = -player.speed;
        player.facing = -1;
      } else if (keys.right) {
        player.vx = player.speed;
        player.facing = 1;
      } else {
        player.vx *= 0.6;
      }

      if (keys.up && player.grounded) {
        player.vy = player.jumpPower;
        player.grounded = false;
        sfxJump();
      }

      player.vy += 0.55;
      if (player.vy > 12) player.vy = 12;

      player.x += player.vx;
      player.y += player.vy;

      if (player.x < 0) player.x = 0;
      if (player.x > canvas.width - player.width) player.x = canvas.width - player.width;

      player.grounded = false;
      for (const plat of lvl.platforms) {
        if (
          player.x + player.width > plat.x &&
          player.x < plat.x + plat.w &&
          player.y + player.height >= plat.y &&
          player.y + player.height <= plat.y + 14 &&
          player.vy >= 0
        ) {
          player.y = plat.y - player.height;
          player.vy = 0;
          player.grounded = true;
        }
      }

      // Collect treats
      lvl.treats.forEach(t => {
        if (!t.collected) {
          const dx = (player.x + player.width / 2) - t.x;
          const dy = (player.y + player.height / 2) - t.y;
          if (Math.hypot(dx, dy) < 28) {
            t.collected = true;
            treatsCollected++;
            sfxCollect();
            const hudTreats = document.getElementById('hud-treats');
            if (hudTreats) hudTreats.textContent = treatsCollected;
          }
        }
      });

      // Check Goal
      const goal = lvl.goal;
      if (
        player.x + player.width > goal.x &&
        player.x < goal.x + goal.w &&
        player.y + player.height > goal.y &&
        player.y < goal.y + goal.h
      ) {
        if (!goal.reached) {
          goal.reached = true;
          isHugging = true;
          hugCoords.x = goal.x + 8;
          hugCoords.y = goal.y + 16;
          sfxHug();

          if (window.confetti) {
            window.confetti({ particleCount: 110, spread: 80, origin: { y: 0.6 } });
          }

          if (currentLevelIdx < levels.length - 1) {
            const dialogue = document.getElementById('game-dialogue');
            if (dialogue) {
              dialogue.innerHTML = `🫂 <strong>HUG!</strong> Advancing to next chapter in 2 seconds... 🤍`;
            }
            setTimeout(() => {
              initLevel(currentLevelIdx + 1);
            }, 2200);
          } else {
            // Grand Finale Hug
            const dialogue = document.getElementById('game-dialogue');
            if (dialogue) {
              dialogue.innerHTML = "🏆 <strong>REUNITED AT LAST! 🫂💖</strong><br>Kyan & Alin: 'No more 670 km between us. Happy 3-Year Anniversary, my love! 1,096 days and forever to go!'";
            }
            if (window.confetti) {
              window.confetti({ particleCount: 250, spread: 120, origin: { y: 0.5 } });
            }
          }
        }
      }
    }

    render(lvl);

    if (gameRunning) {
      animFrameId = requestAnimationFrame(update);
    }
  }

  function render(lvl) {
    const bgGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    bgGrad.addColorStop(0, lvl.bgGradient[0]);
    bgGrad.addColorStop(0.6, lvl.bgGradient[1]);
    bgGrad.addColorStop(1, lvl.bgGradient[2] || lvl.bgGradient[1]);
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Decorative clouds
    const now = Date.now() / 1000;
    for (let i = 0; i < 6; i++) {
      const cx = (i * 150 + now * 20) % (canvas.width + 100) - 50;
      const cy = 40 + (i % 3) * 30;
      ctx.fillStyle = "rgba(255, 255, 255, 0.45)";
      ctx.fillRect(cx, cy, 60, 16);
      ctx.fillRect(cx + 10, cy - 8, 40, 8);
    }

    // Platforms
    for (const plat of lvl.platforms) {
      ctx.fillStyle = plat.color;
      ctx.fillRect(plat.x, plat.y, plat.w, plat.h);
      ctx.fillStyle = "rgba(255, 255, 255, 0.25)";
      ctx.fillRect(plat.x, plat.y, plat.w, 3);
    }

    // Treats
    ctx.font = "20px sans-serif";
    lvl.treats.forEach(t => {
      if (!t.collected) {
        const floatY = Math.sin(Date.now() / 250 + t.x) * 4;
        ctx.fillText(t.icon, t.x - 10, t.y + floatY);
      }
    });

    if (isHugging) {
      // Draw hugging couple instead of separate sprites!
      drawHug(hugCoords.x, hugCoords.y);
    } else {
      // Draw separate characters
      drawAlin(lvl.goal.x, lvl.goal.y);
      drawPlayer(player.x, player.y, player.facing);
    }
  }

  window.GameEngine = {
    start: function() {
      gameRunning = true;
      initLevel(0);
      if (animFrameId) cancelAnimationFrame(animFrameId);
      animFrameId = requestAnimationFrame(update);
    },
    stop: function() {
      gameRunning = false;
      if (animFrameId) cancelAnimationFrame(animFrameId);
    },
    restart: function() {
      initLevel(currentLevelIdx);
    }
  };

  const restartBtn = document.getElementById('restart-game-btn');
  if (restartBtn) {
    restartBtn.addEventListener('click', () => {
      window.GameEngine.restart();
    });
  }
})();
