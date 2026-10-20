/**
 * DRAYNOVA OFFICIAL - AUDIO PLAYER & INTERACTION ENGINE
 * Monochrome Edition
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Audio Tracks Data
  const playlist = [
    {
      id: 1,
      title: 'majesty',
      artist: 'Draynova',
      duration: '2:31',
      file: './assets/audio/track1.m4a',
      cover: './assets/images/user_avatar.png'
    },
    {
      id: 2,
      title: 'montagem nevoa 2',
      artist: 'Draynova',
      duration: '1:16',
      file: './assets/audio/track2.m4a',
      cover: './assets/images/user_avatar.png'
    },
    {
      id: 3,
      title: 'monarch',
      artist: 'Draynova',
      duration: '2:11',
      file: './assets/audio/track3.m4a',
      cover: './assets/images/user_avatar.png'
    },
    {
      id: 4,
      title: 'chaos',
      artist: 'Draynova',
      duration: '2:59',
      file: './assets/audio/track4.mp3',
      cover: './assets/images/user_avatar.png'
    }
  ];

  let currentTrackIndex = 0;
  let isPlaying = false;
  const audio = new Audio();
  audio.preload = 'metadata';

  // DOM Elements
  const playPauseBtn = document.getElementById('play-pause-btn');
  const prevBtn = document.getElementById('prev-track-btn');
  const nextBtn = document.getElementById('next-track-btn');
  const progressContainer = document.getElementById('progress-container');
  const progressFill = document.getElementById('progress-fill');
  const currentTimeEl = document.getElementById('current-time');
  const totalTimeEl = document.getElementById('total-time');
  const volumeSlider = document.getElementById('volume-slider');
  const playerTrackTitle = document.getElementById('player-track-title');
  const playerTrackArtist = document.getElementById('player-track-artist');
  const playerTrackThumb = document.getElementById('player-track-thumb');
  const eqVisualizer = document.getElementById('eq-visualizer');
  const trackItems = document.querySelectorAll('.track-item');
  const toast = document.getElementById('toast-notice');

  // Load track into player
  function loadTrack(index) {
    currentTrackIndex = index;
    const track = playlist[index];
    
    audio.src = track.file;
    playerTrackTitle.textContent = track.title;
    playerTrackArtist.textContent = track.artist;
    playerTrackThumb.src = track.cover;
    currentTimeEl.textContent = '0:00';
    totalTimeEl.textContent = track.duration;
    progressFill.style.width = '0%';

    trackItems.forEach((item, idx) => {
      if (idx === index) {
        item.classList.add('active');
        const icon = item.querySelector('.track-item-btn i');
        if (icon) icon.className = isPlaying ? 'fas fa-pause' : 'fas fa-play';
      } else {
        item.classList.remove('active');
        const icon = item.querySelector('.track-item-btn i');
        if (icon) icon.className = 'fas fa-play';
      }
    });
  }

  // Play Audio
  function playAudio() {
    audio.play().then(() => {
      isPlaying = true;
      playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
      if (eqVisualizer) eqVisualizer.classList.add('active');
      updateTrackItemIcons(true);
    }).catch(err => {
      console.warn('Playback error / Autoplay blocked:', err);
    });
  }

  // Pause Audio
  function pauseAudio() {
    audio.pause();
    isPlaying = false;
    playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
    if (eqVisualizer) eqVisualizer.classList.remove('active');
    updateTrackItemIcons(false);
  }

  function togglePlayPause() {
    if (isPlaying) {
      pauseAudio();
    } else {
      playAudio();
    }
  }

  function updateTrackItemIcons(playing) {
    trackItems.forEach((item, idx) => {
      const icon = item.querySelector('.track-item-btn i');
      if (idx === currentTrackIndex) {
        if (icon) icon.className = playing ? 'fas fa-pause' : 'fas fa-play';
      } else {
        if (icon) icon.className = 'fas fa-play';
      }
    });
  }

  // Next / Prev
  function nextTrack() {
    let nextIdx = (currentTrackIndex + 1) % playlist.length;
    loadTrack(nextIdx);
    playAudio();
  }

  function prevTrack() {
    let prevIdx = (currentTrackIndex - 1 + playlist.length) % playlist.length;
    loadTrack(prevIdx);
    playAudio();
  }

  // Formatting seconds into M:SS
  function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }

  // Time update listener
  audio.addEventListener('timeupdate', () => {
    if (audio.duration) {
      const progressPercent = (audio.currentTime / audio.duration) * 100;
      progressFill.style.width = `${progressPercent}%`;
      currentTimeEl.textContent = formatTime(audio.currentTime);
      totalTimeEl.textContent = formatTime(audio.duration);
    }
  });

  // When track ends
  audio.addEventListener('ended', () => {
    nextTrack();
  });

  // Progress bar scrub
  if (progressContainer) {
    progressContainer.addEventListener('click', (e) => {
      const width = progressContainer.clientWidth;
      const clickX = e.offsetX;
      if (audio.duration) {
        audio.currentTime = (clickX / width) * audio.duration;
      }
    });
  }

  // Volume slider
  if (volumeSlider) {
    volumeSlider.addEventListener('input', (e) => {
      audio.volume = e.target.value;
    });
  }

  // Control Buttons Event Listeners
  if (playPauseBtn) playPauseBtn.addEventListener('click', togglePlayPause);
  if (nextBtn) nextBtn.addEventListener('click', nextTrack);
  if (prevBtn) prevBtn.addEventListener('click', prevTrack);

  // Track list items click
  trackItems.forEach((item, idx) => {
    item.addEventListener('click', () => {
      if (currentTrackIndex === idx) {
        togglePlayPause();
      } else {
        loadTrack(idx);
        playAudio();
      }
    });
  });

  // Quick Play buttons (Hero button)
  const heroPlayBtn = document.getElementById('hero-explore-btn');
  if (heroPlayBtn) {
    heroPlayBtn.addEventListener('click', () => {
      const musicSec = document.getElementById('music');
      if (musicSec) {
        musicSec.scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => {
          if (!isPlaying) playAudio();
        }, 600);
      }
    });
  }

  // 2. Navbar Scroll Style
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // 3. Discord Copy Handle Functionality
  const copyButtons = document.querySelectorAll('.discord-copy-btn');
  copyButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const handle = '@prod.draynova';
      navigator.clipboard.writeText(handle).then(() => {
        const origText = btn.innerHTML;
        btn.classList.add('copied');
        btn.innerHTML = '<i class="fas fa-check"></i> Copied!';
        showToast('Discord handle copied: @prod.draynova');
        setTimeout(() => {
          btn.classList.remove('copied');
          btn.innerHTML = origText;
        }, 2200);
      }).catch(() => {
        showToast('Discord: @prod.draynova');
      });
    });
  });

  // Toast helper
  function showToast(message) {
    if (!toast) return;
    toast.innerHTML = `<i class="fas fa-check-circle" style="color: #ffffff;"></i> <span>${message}</span>`;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
  }

  // 4. Subtle Monochrome Wave Visualizer
  const canvas = document.getElementById('audio-canvas-bg');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    let phase = 0;

    function renderWaves() {
      ctx.clearRect(0, 0, width, height);
      const amp = isPlaying ? 28 : 10;
      const speed = isPlaying ? 0.03 : 0.012;
      phase += speed;

      for (let j = 0; j < 3; j++) {
        ctx.beginPath();
        ctx.lineWidth = 1;
        const alpha = (0.05 - j * 0.015) * (isPlaying ? 1.6 : 1);
        ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
        const yOffset = height * (0.65 + j * 0.06);

        for (let x = 0; x < width; x += 14) {
          const y = yOffset + Math.sin(x * 0.003 + phase + j) * amp * Math.cos(x * 0.001 + phase);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      requestAnimationFrame(renderWaves);
    }

    renderWaves();
  }

  // Mobile navigation drawer toggle
  const mobileBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');
  if (mobileBtn && navLinks) {
    mobileBtn.addEventListener('click', () => {
      if (navLinks.style.display === 'flex') {
        navLinks.style.display = 'none';
      } else {
        navLinks.style.display = 'flex';
        navLinks.style.flexDirection = 'column';
        navLinks.style.position = 'absolute';
        navLinks.style.top = '75px';
        navLinks.style.left = '0';
        navLinks.style.width = '100%';
        navLinks.style.background = '#0a0a0a';
        navLinks.style.padding = '2rem';
        navLinks.style.borderBottom = '1px solid rgba(255,255,255,0.15)';
      }
    });
  }

  // Initialize track 0
  loadTrack(0);
});
