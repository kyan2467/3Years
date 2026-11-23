// ==============================================================================
// 🎮 KYAN & ALIN — 3-YEAR ANNIVERSARY PIXEL ADVENTURE CONTROLLER
// Handles 16-Bit Pixel Landscape Canvas, Unboxing, Letters, Audio, and Photos
// ==============================================================================

document.addEventListener('DOMContentLoaded', () => {
  const config = window.ANNIVERSARY_CONFIG || {};

  // Audio Context for UI Sound Effects
  let soundCtx = null;
  function getSoundCtx() {
    if (!soundCtx) {
      soundCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (soundCtx.state === 'suspended') soundCtx.resume();
    return soundCtx;
  }

  function playChime(freqs, delays) {
    try {
      const actx = getSoundCtx();
      freqs.forEach((freq, idx) => {
        const osc = actx.createOscillator();
        const gain = actx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, actx.currentTime + delays[idx]);
        gain.gain.setValueAtTime(0.12, actx.currentTime + delays[idx]);
        gain.gain.exponentialRampToValueAtTime(0.001, actx.currentTime + delays[idx] + 0.35);
        osc.connect(gain);
        gain.connect(actx.destination);
        osc.start(actx.currentTime + delays[idx]);
        osc.stop(actx.currentTime + delays[idx] + 0.35);
      });
    } catch(e) {}
  }

  // ============================================================================
  // 1. 🌄 16-BIT CODÉDEX-STYLE RETRO PIXEL LANDSCAPE CANVAS
  // ============================================================================
  const heroCanvas = document.getElementById('pixel-landscape-canvas');
  if (heroCanvas) {
    const ctx = heroCanvas.getContext('2d');
    let width = 0;
    let height = 0;

    function resizeCanvas() {
      const parent = heroCanvas.parentElement;
      width = heroCanvas.width = parent.clientWidth;
      height = heroCanvas.height = parent.clientHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Drifting Pixel Clouds
    const clouds = [
      { x: 50, y: 35, speed: 0.25, width: 90, height: 26 },
      { x: 260, y: 70, speed: 0.18, width: 140, height: 34 },
      { x: 520, y: 30, speed: 0.3, width: 110, height: 28 },
      { x: 780, y: 60, speed: 0.22, width: 160, height: 38 },
      { x: 1050, y: 45, speed: 0.26, width: 120, height: 30 }
    ];

    function drawPixelCloud(cx, cy, cw, ch) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.88)';
      // Stepped cloud shape
      ctx.fillRect(cx + 10, cy, cw - 20, ch);
      ctx.fillRect(cx, cy + 6, cw, ch - 12);
      ctx.fillRect(cx + 25, cy - 8, cw - 50, 8);
    }

    function drawPineTree(tx, ty, size) {
      ctx.fillStyle = '#1c422b';
      // Trunk
      ctx.fillRect(tx + size * 0.4, ty + size * 0.7, size * 0.2, size * 0.3);
      // Foliage layers (triangles stepped)
      ctx.fillStyle = '#2d6a3f';
      ctx.fillRect(tx, ty + size * 0.45, size, size * 0.3);
      ctx.fillStyle = '#40916c';
      ctx.fillRect(tx + size * 0.15, ty + size * 0.25, size * 0.7, size * 0.25);
      ctx.fillStyle = '#52b788';
      ctx.fillRect(tx + size * 0.3, ty + size * 0.05, size * 0.4, size * 0.25);
    }

    function renderLandscape() {
      ctx.clearRect(0, 0, width, height);

      // Layer 1: Pixel Sky Gradient
      const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
      skyGrad.addColorStop(0, '#3682b1');
      skyGrad.addColorStop(0.4, '#68b4dd');
      skyGrad.addColorStop(0.7, '#9edaf4');
      skyGrad.addColorStop(1, '#bfe9fa');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, height);

      // Layer 2: Drifting Clouds
      clouds.forEach(c => {
        c.x -= c.speed;
        if (c.x + c.width < 0) c.x = width + 50;
        drawPixelCloud(c.x, c.y, c.width, c.height);
      });

      // Layer 3: Distant Mountain Peaks
      ctx.fillStyle = '#2d5b68';
      ctx.beginPath();
      ctx.moveTo(0, height * 0.65);
      // Mountain points
      const step = width / 6;
      ctx.lineTo(step * 0.8, height * 0.32);
      ctx.lineTo(step * 1.8, height * 0.58);
      ctx.lineTo(step * 2.8, height * 0.38);
      ctx.lineTo(step * 4.2, height * 0.62);
      ctx.lineTo(step * 5.2, height * 0.3);
      ctx.lineTo(width, height * 0.55);
      ctx.lineTo(width, height);
      ctx.lineTo(0, height);
      ctx.closePath();
      ctx.fill();

      // Mountain Snow / Light Caps
      ctx.fillStyle = '#6bb1bf';
      ctx.fillRect(step * 0.7, height * 0.32, step * 0.2, 18);
      ctx.fillRect(step * 2.7, height * 0.38, step * 0.2, 16);
      ctx.fillRect(step * 5.1, height * 0.3, step * 0.2, 22);

      // Layer 4: Middle Green Hills
      ctx.fillStyle = '#39784b';
      ctx.beginPath();
      ctx.moveTo(0, height * 0.7);
      ctx.quadraticCurveTo(width * 0.25, height * 0.52, width * 0.5, height * 0.68);
      ctx.quadraticCurveTo(width * 0.75, height * 0.82, width, height * 0.65);
      ctx.lineTo(width, height);
      ctx.lineTo(0, height);
      ctx.closePath();
      ctx.fill();

      // Pine Trees on the hills
      const treeCount = Math.floor(width / 70);
      for (let i = 0; i < treeCount; i++) {
        const tx = i * 70 + (i % 2 === 0 ? 10 : 30);
        const ty = height * 0.62 + (Math.sin(i) * 20);
        drawPineTree(tx, ty, 32);
      }

      // Layer 5: Rolling Foreground Lush Green Meadow
      ctx.fillStyle = '#56ab61';
      ctx.beginPath();
      ctx.moveTo(0, height * 0.78);
      ctx.quadraticCurveTo(width * 0.35, height * 0.72, width * 0.7, height * 0.8);
      ctx.quadraticCurveTo(width * 0.9, height * 0.85, width, height * 0.82);
      ctx.lineTo(width, height);
      ctx.lineTo(0, height);
      ctx.closePath();
      ctx.fill();

      // Foreground Grass Highlights (Lighter green stepped band)
      ctx.fillStyle = '#7ac77d';
      for (let gx = 0; gx < width; gx += 16) {
        const gy = height * 0.82 + Math.sin(gx * 0.01) * 12;
        ctx.fillRect(gx, gy, 12, 6);
      }

      // Layer 6: Pink & Magenta Wildflowers (Dotted across meadow)
      const flowers = [
        { x: 0.12, y: 0.86, color: '#f472b6' },
        { x: 0.22, y: 0.89, color: '#ec4899' },
        { x: 0.32, y: 0.85, color: '#f472b6' },
        { x: 0.44, y: 0.88, color: '#ffffff' },
        { x: 0.58, y: 0.86, color: '#ec4899' },
        { x: 0.68, y: 0.9, color: '#f472b6' },
        { x: 0.82, y: 0.87, color: '#fbcfe8' },
        { x: 0.92, y: 0.89, color: '#ec4899' }
      ];

      flowers.forEach(f => {
        const fx = f.x * width;
        const fy = f.y * height;
        ctx.fillStyle = f.color;
        // Flower Petals
        ctx.fillRect(fx - 4, fy - 4, 8, 8);
        ctx.fillStyle = '#fde047'; // Flower center
        ctx.fillRect(fx - 2, fy - 2, 4, 4);
      });

      requestAnimationFrame(renderLandscape);
    }
    renderLandscape();
  }

  // ============================================================================
  // 2. ⏳ 1,096 DAYS COUNTER & MIDNIGHT COUNTDOWN
  // ============================================================================
  const navTicker = document.getElementById('nav-days-ticker');
  const annivStart = new Date("2023-11-24T00:00:00+07:00").getTime();
  const midnightGoal = new Date("2026-11-24T00:00:00+07:00").getTime();
  let celebrated = false;

  function updateTicker() {
    const now = new Date().getTime();
    const elapsedMs = now - annivStart;
    const totalDays = Math.floor(elapsedMs / (1000 * 60 * 60 * 24));

    if (now < midnightGoal) {
      const leftMs = midnightGoal - now;
      const leftH = Math.floor(leftMs / (1000 * 60 * 60));
      const leftM = Math.floor((leftMs / (1000 * 60)) % 60);
      const leftS = Math.floor((leftMs / 1000) % 60);
      if (navTicker) {
        navTicker.textContent = `Midnight in ${leftH}h ${leftM}m ${leftS}s`;
      }
    } else {
      if (!celebrated) {
        celebrated = true;
        if (window.confetti) {
          window.confetti({ particleCount: 160, spread: 90, origin: { y: 0.3 } });
        }
      }
      if (navTicker) {
        navTicker.textContent = `${totalDays} Days (3 Years!)`;
      }
    }
  }
  updateTicker();
  setInterval(updateTicker, 1000);

  // ============================================================================
  // 🤫 SECRET EASTER EGG ("MAUU BOOBIESS")
  // ============================================================================
  const mascotMonitor = document.getElementById('mascot-monitor');
  const mascotFace = document.getElementById('mascot-face');
  const mascotScreen = document.getElementById('mascot-screen');
  const secretBubble = document.getElementById('secret-bubble');
  let easterEggActive = false;

  if (mascotMonitor) {
    mascotMonitor.addEventListener('click', (e) => {
      e.stopPropagation();
      easterEggActive = !easterEggActive;

      if (easterEggActive) {
        playChime([659, 784, 1046], [0, 0.08, 0.16]);
        if (mascotFace) mascotFace.textContent = "( > ‿ < )";
        if (mascotScreen) mascotScreen.style.background = "#f472b6";
        if (secretBubble) secretBubble.classList.remove('hidden');

        if (window.confetti) {
          window.confetti({
            particleCount: 40,
            spread: 50,
            origin: { y: 0.7 },
            colors: ['#f43f5e', '#ec4899', '#fbcfe8']
          });
        }
      } else {
        if (mascotFace) mascotFace.textContent = "• ‿ •";
        if (mascotScreen) mascotScreen.style.background = "#93c5fd";
        if (secretBubble) secretBubble.classList.add('hidden');
      }
    });
  }

  // ============================================================================
  // 3. 📦 CARE PACKAGE UNBOXING ACTION
  // ============================================================================
  const heroStartBtn = document.getElementById('hero-start-btn');
  const unboxBtn = document.getElementById('unbox-btn');
  const pixelTape = document.getElementById('pixel-tape');
  const carePackageStage = document.getElementById('care-package-stage');
  const unboxedHub = document.getElementById('unboxed-hub');

  if (heroStartBtn) {
    heroStartBtn.addEventListener('click', () => {
      document.getElementById('package-anchor').scrollIntoView({ behavior: 'smooth' });
    });
  }

  if (unboxBtn) {
    unboxBtn.addEventListener('click', () => {
      playChime([392, 523.25, 659.25, 783.99], [0, 0.1, 0.2, 0.3]);

      if (pixelTape) {
        pixelTape.style.transform = "scaleX(0) rotate(15deg)";
        pixelTape.style.opacity = "0";
      }

      toggleAudio(true);

      setTimeout(() => {
        if (window.confetti) {
          window.confetti({
            particleCount: 130,
            spread: 75,
            origin: { y: 0.5 },
            colors: ['#facc15', '#f472b6', '#38bdf8', '#22c55e']
          });
        }

        if (carePackageStage) carePackageStage.style.display = "none";
        if (unboxedHub) unboxedHub.classList.remove('hidden');

        document.getElementById('hub-anchor').scrollIntoView({ behavior: 'smooth' });
      }, 600);
    });
  }

  // ============================================================================
  // 4. 🎵 BACKGROUND MUSIC TOGGLE
  // ============================================================================
  const bgAudio = document.getElementById('bg-audio');
  const musicToggleBtn = document.getElementById('music-toggle-btn');
  let isPlaying = false;

  function toggleAudio(forcePlay = false) {
    if (!bgAudio) return;
    if (forcePlay || !isPlaying) {
      bgAudio.play().then(() => {
        isPlaying = true;
        if (musicToggleBtn) {
          musicToggleBtn.innerHTML = "<span>🔊 Playing</span>";
        }
      }).catch(() => {});
    } else {
      bgAudio.pause();
      isPlaying = false;
      if (musicToggleBtn) {
        musicToggleBtn.innerHTML = "<span>🎵 Music</span>";
      }
    }
  }

  if (musicToggleBtn) {
    musicToggleBtn.addEventListener('click', () => toggleAudio());
  }

  // ============================================================================
  // 5. 🕹️ MODAL 1: RETRO PIXEL MINI-GAME
  // ============================================================================
  const gameModal = document.getElementById('game-modal');
  const startGameBtn = document.getElementById('start-game-btn');
  const closeGameBtn = document.getElementById('close-game-btn');

  if (startGameBtn) {
    startGameBtn.addEventListener('click', () => {
      playChime([440, 554, 659], [0, 0.08, 0.16]);
      if (gameModal) gameModal.classList.remove('hidden');
      if (window.GameEngine) window.GameEngine.start();
    });
  }

  if (closeGameBtn) {
    closeGameBtn.addEventListener('click', () => {
      if (gameModal) gameModal.classList.add('hidden');
      if (window.GameEngine) window.GameEngine.stop();
    });
  }

  // ============================================================================
  // 6. 💌 MODAL 2 & 3: "OPEN WHEN..." VAULT & POETIC LETTERS
  // ============================================================================
  const vaultModal = document.getElementById('vault-modal');
  const openVaultBtn = document.getElementById('open-vault-btn');
  const closeVaultBtn = document.getElementById('close-vault-btn');
  const envelopesContainer = document.getElementById('vault-envelopes-container');

  const letterModal = document.getElementById('letter-modal');
  const closeLetterBtn = document.getElementById('close-letter-btn');
  const openGrandLetterBtn = document.getElementById('open-grand-letter-btn');

  if (envelopesContainer && config.letters) {
    envelopesContainer.innerHTML = '';
    config.letters.forEach(letter => {
      const card = document.createElement('div');
      card.className = 'pixel-envelope-card';
      card.innerHTML = `
        <div class="env-stamp-icon" style="background:${letter.sealColor}">
          <span>💌</span>
        </div>
        <h4 class="env-title">${letter.title}</h4>
        <p class="env-sub">${letter.subtitle}</p>
        <span class="env-action-lbl">Read Letter ➔</span>
      `;
      card.addEventListener('click', () => {
        showLetter(letter);
      });
      envelopesContainer.appendChild(card);
    });
  }

  function showLetter(letter) {
    playChime([523, 659, 784], [0, 0.1, 0.2]);

    const modalTitle = document.getElementById('letter-modal-title');
    const modalBadge = document.getElementById('letter-modal-badge');
    const modalBody = document.getElementById('letter-modal-body');
    const modalSignoff = document.getElementById('letter-modal-signoff');
    const waxSeal = document.getElementById('letter-wax-seal');

    if (modalTitle) modalTitle.textContent = letter.title;
    if (modalBadge) modalBadge.textContent = letter.badge || "3-Year Anniversary";
    if (waxSeal && letter.sealColor) {
      waxSeal.style.background = `radial-gradient(circle at 35% 35%, ${letter.sealColor}, #78350f)`;
    }

    if (modalBody) {
      modalBody.innerHTML = letter.paragraphs
        .map(p => `<p>${p}</p>`)
        .join('');
    }

    if (modalSignoff) {
      modalSignoff.innerHTML = (letter.signOff || "Forever yours,\nKyan ❤️").replace(/\n/g, '<br>');
    }

    if (letterModal) {
      letterModal.classList.remove('hidden');
    }
  }

  if (openVaultBtn) {
    openVaultBtn.addEventListener('click', () => {
      playChime([440, 523, 659], [0, 0.08, 0.16]);
      if (vaultModal) vaultModal.classList.remove('hidden');
    });
  }

  if (closeVaultBtn) {
    closeVaultBtn.addEventListener('click', () => {
      if (vaultModal) vaultModal.classList.add('hidden');
    });
  }

  if (closeLetterBtn) {
    closeLetterBtn.addEventListener('click', () => {
      if (letterModal) letterModal.classList.add('hidden');
    });
  }

  // Grand Letter shortcut
  if (openGrandLetterBtn && config.letters && config.letters.length > 0) {
    openGrandLetterBtn.addEventListener('click', () => {
      showLetter(config.letters[0]); // Midnight Bali anniversary letter
    });
  }

  // ============================================================================
  // 7. 🎞️ "JUST US" PHOTO REEL (Exclusively Couple Photos!)
  // ============================================================================
  const photostripReel = document.getElementById('photostrip-reel');
  const photoFileInput = document.getElementById('photo-file-input');

  function renderPhotostrip(photos) {
    if (!photostripReel || !photos) return;
    photostripReel.innerHTML = '';
    photos.forEach(photo => {
      const card = document.createElement('div');
      card.className = 'couple-photo-card';
      card.innerHTML = `
        <div class="couple-img-box">
          <img src="${photo.src}" alt="${photo.caption}" loading="lazy">
        </div>
        <span class="couple-year-tag">${photo.year} • ${photo.location}</span>
        <p class="couple-caption">${photo.caption}</p>
      `;
      photostripReel.appendChild(card);
    });
  }

  renderPhotostrip(config.photos || []);

  if (photoFileInput) {
    photoFileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const newPhoto = {
            src: event.target.result,
            caption: "Another unforgettable memory together — forever Kyan & Alin 💖",
            year: "2026",
            location: "Just Us"
          };
          if (!config.photos) config.photos = [];
          config.photos.unshift(newPhoto);
          renderPhotostrip(config.photos);

          if (window.confetti) {
            window.confetti({ particleCount: 80, spread: 65, origin: { y: 0.8 } });
          }
        };
        reader.readAsDataURL(file);
      }
    });
  }
});
