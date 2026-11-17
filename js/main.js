/**
 * Motor Interativo - Interactive Anniversary Template
 * Organização modular com foco em acessibilidade, animações suaves e responsividade.
 */

const MotionHelper = {
    query: window.matchMedia('(prefers-reduced-motion: reduce)'),
    prefersReduced() {
        return this.query.matches;
    },
    isFinePointer() {
        return window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    }
};

// 1. Sistema de Notificações (transitions-dev: 22-toast)
const Toast = (() => {
    const container = document.getElementById('toast-container');

    const getCloseMs = () => {
        const raw = getComputedStyle(document.documentElement).getPropertyValue('--toast-close');
        return parseFloat(raw) || 250;
    };

    const show = (message, type = 'info', duration = 3000) => {
        if (!container) return;

        while (container.children.length >= 3) {
            container.firstElementChild.remove();
        }

        const toast = document.createElement('div');
        toast.className = `toast t-toast toast-${type}`;
        toast.textContent = message;
        container.appendChild(toast);

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                toast.classList.add('is-open');
            });
        });

        setTimeout(() => {
            toast.classList.remove('is-open');
            setTimeout(() => toast.remove(), getCloseMs() + 20);
        }, duration);
    };

    return { show };
})();

// 2. Revelação de Textos (transitions-dev: 18-texts-reveal)
const setupTextReveals = () => {
    const heroHeader = document.getElementById('hero-header');
    const galleryHeader = document.getElementById('gallery-header-stagger');

    if (MotionHelper.prefersReduced() || !('IntersectionObserver' in window)) {
        if (heroHeader) heroHeader.classList.add('is-shown');
        if (galleryHeader) galleryHeader.classList.add('is-shown');
        return;
    }

    if (heroHeader) {
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                heroHeader.classList.add('is-shown');
            });
        });
    }

    if (galleryHeader) {
        const headerObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-shown');
                    headerObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '40px 0px' });

        headerObserver.observe(galleryHeader);
    }
};

// 3. Galeria de Polaroides + Hover Tilt 3D (transitions-dev: 19-card-tilt)
const Gallery = (() => {
    // Mantemos a estrutura de objetos compatível com api/server.py
    const memories = [
        { src: './imgs/gallery/1.png', caption: 'Momentos inesquecíveis ✨', tilt: 'tilt-left' },
        { src: './imgs/gallery/2.png', caption: 'Conexões verdadeiras ❤️', tilt: 'tilt-right' },
        { src: './imgs/gallery/3.png', caption: 'Caminhos que se cruzam 🌅', tilt: 'tilt-left-extreme' },
        { src: './imgs/gallery/4.png', caption: 'Celebrando a vida 🎂', tilt: 'tilt-right-extreme' },
        { src: './imgs/gallery/5.png', caption: 'Pequenos grandes instantes ☕', tilt: 'tilt-left' },
        { src: './imgs/gallery/6.png', caption: 'Juntos em cada aventura 🌊', tilt: 'tilt-right' }
    ];

    const attachCardTilt = (tiltEl, cardEl) => {
        if (!MotionHelper.isFinePointer() || MotionHelper.prefersReduced()) return;

        const MAX_TILT_DEG = 10;

        const reset = () => {
            tiltEl.classList.remove('is-hover');
            cardEl.classList.remove('is-tilting');
            cardEl.style.setProperty('--tilt-rx', '0deg');
            cardEl.style.setProperty('--tilt-ry', '0deg');
        };

        const track = (e) => {
            if (e.pointerType !== 'mouse' || MotionHelper.prefersReduced()) return;
            const rect = tiltEl.getBoundingClientRect();
            if (!rect.width || !rect.height) return;

            const px = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
            const py = Math.min(1, Math.max(0, (e.clientY - rect.top) / rect.height));

            tiltEl.classList.add('is-hover');
            cardEl.classList.add('is-tilting');
            cardEl.style.setProperty('--tilt-ry', `${((px - 0.5) * MAX_TILT_DEG).toFixed(2)}deg`);
            cardEl.style.setProperty('--tilt-rx', `${((0.5 - py) * MAX_TILT_DEG).toFixed(2)}deg`);
            cardEl.style.setProperty('--tilt-gx', `${(px * 100).toFixed(1)}%`);
            cardEl.style.setProperty('--tilt-gy', `${(py * 100).toFixed(1)}%`);
        };

        tiltEl.addEventListener('pointermove', track);
        tiltEl.addEventListener('pointerleave', reset);
        tiltEl.addEventListener('pointercancel', reset);
    };

    const createPolaroidElement = (mem, idx) => {
        const isVideo = /\.(mp4|webm|ogg)$/i.test(mem.src);

        const reveal = document.createElement('div');
        reveal.className = isVideo ? 'polaroid-reveal video-slot' : 'polaroid-reveal';

        const slot = document.createElement('div');
        slot.className = `polaroid-slot ${mem.tilt || ''}`.trim();

        const tiltWrapper = document.createElement('div');
        tiltWrapper.className = 't-tilt';

        const card = document.createElement('article');
        card.className = 'polaroid-card t-tilt-card';

        const mediaBox = document.createElement('div');
        mediaBox.className = 'polaroid-media';

        const mediaEl = document.createElement(isVideo ? 'video' : 'img');
        mediaEl.src = encodeURI(mem.src);
        if (isVideo) {
            mediaEl.controls = true;
            mediaEl.playsInline = true;
            mediaEl.preload = 'metadata';
        } else {
            mediaEl.alt = mem.caption ? `Memória ${idx + 1}: ${mem.caption}` : `Memória ${idx + 1}`;
            mediaEl.loading = 'lazy';
            mediaEl.decoding = 'async';
        }

        const glare = document.createElement('div');
        glare.className = 't-tilt-glare';
        glare.setAttribute('aria-hidden', 'true');

        mediaBox.appendChild(mediaEl);
        mediaBox.appendChild(glare);

        const captionBox = document.createElement('div');
        captionBox.className = 'caption-container';

        const caption = document.createElement('p');
        caption.className = 'polaroid-caption';
        caption.dataset.src = mem.src;
        caption.textContent = mem.caption || '';

        captionBox.appendChild(caption);
        card.appendChild(mediaBox);
        card.appendChild(captionBox);
        tiltWrapper.appendChild(card);
        slot.appendChild(tiltWrapper);
        reveal.appendChild(slot);

        attachCardTilt(tiltWrapper, card);
        return reveal;
    };

    const init = () => {
        const grid = document.getElementById('polaroid-grid');
        if (!grid) return;

        grid.textContent = '';
        memories.forEach((mem, idx) => {
            grid.appendChild(createPolaroidElement(mem, idx));
        });

        const reveals = grid.querySelectorAll('.polaroid-reveal');

        if (MotionHelper.prefersReduced() || !('IntersectionObserver' in window)) {
            reveals.forEach((el) => el.classList.add('is-revealed'));
            return;
        }

        const observer = new IntersectionObserver((entries) => {
            let batchIndex = 0;
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                // Orçamento de stagger abaixo de 300ms (motion-design)
                const delayMs = Math.min(batchIndex * 55, 220);
                entry.target.style.setProperty('--reveal-delay', `${delayMs}ms`);
                entry.target.classList.add('is-revealed');
                observer.unobserve(entry.target);
                batchIndex += 1;
            });
        }, { threshold: 0.05, rootMargin: '60px 0px' });

        reveals.forEach((el) => observer.observe(el));
    };

    return { init };
})();

// 4. Envelope 3D & Geometria Responsiva da Carta
const setupEnvelope = () => {
    const envelope = document.getElementById('love-envelope');
    const letterSection = document.getElementById('letter-section');
    const letterPaper = document.getElementById('letter-paper');
    const letterContent = document.getElementById('editable-letter');
    const closeBtn = document.getElementById('close-letter-btn');

    if (!envelope || !letterSection || !letterPaper || !letterContent) return;

    const isMobileViewport = () => window.innerWidth <= 768;

    const updateScrollCue = () => {
        const hasMore =
            letterContent.scrollHeight > letterContent.clientHeight + 4 &&
            letterContent.scrollTop + letterContent.clientHeight < letterContent.scrollHeight - 4;
        letterPaper.classList.toggle('has-scroll', hasMore);
    };

    const updateLetterGeometry = () => {
        const envH = envelope.offsetHeight || 220;
        const vh = window.innerHeight || 800;
        const isSmall = window.innerWidth <= 640;

        // Em telas pequenas a largura aberta expande; estimamos com margem segura
        const maxPaperH = isSmall
            ? Math.min(460, Math.round(vh * 0.62))
            : Math.min(680, Math.round(vh * 0.74));
        const minPaperH = Math.max(envH + 72, isSmall ? 330 : 420);

        const cs = getComputedStyle(letterPaper);
        const padV = (parseFloat(cs.paddingTop) || 40) + (parseFloat(cs.paddingBottom) || 24);
        const neededH = Math.ceil(letterContent.scrollHeight + padV + 20);
        const targetH = Math.max(minPaperH, Math.min(maxPaperH, neededH));

        // Mantém a base da folha ancorada sobre o envelope e reserva espaço acima sem cobrir o título
        const anchorInside = Math.round(envH * 0.62);
        const lift = Math.max(96, targetH - anchorInside);
        const openSpace = Math.max(0, lift - (isSmall ? 18 : 42));

        letterSection.style.setProperty('--letter-open-height', `${targetH}px`);
        letterSection.style.setProperty('--letter-open-lift', `-${lift}px`);
        letterSection.style.setProperty('--letter-open-space', `${openSpace}px`);

        setTimeout(updateScrollCue, 120);
    };

    const setOpen = (open) => {
        if (open) {
            letterContent.scrollTop = 0;
            updateLetterGeometry();
        }
        envelope.classList.toggle('open', open);
        letterSection.classList.toggle('open-spacing', open);
        envelope.setAttribute('aria-expanded', String(open));
        envelope.setAttribute('aria-label', open ? 'Carta de aniversário aberta' : 'Abrir carta de aniversário');

        if (!open) {
            letterPaper.classList.remove('has-scroll');
        } else {
            letterContent.scrollTop = 0;
            setTimeout(() => {
                letterContent.scrollTop = 0;
                updateScrollCue();
            }, 580);
        }
    };

    envelope.addEventListener('click', (e) => {
        if (e.target.closest('.letter-content')) return;
        if (e.target.closest('#close-letter-btn')) return;

        const isOpen = envelope.classList.contains('open');
        if (isMobileViewport() && isOpen) return;

        setOpen(!isOpen);
    });

    envelope.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            if (e.target !== envelope) return;
            e.preventDefault();
            if (!envelope.classList.contains('open')) {
                setOpen(true);
            }
        }
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            setOpen(false);
        });
    }

    document.addEventListener('keydown', (e) => {
        const volPop = document.getElementById('volume-popover');
        if (e.key === 'Escape' && !volPop?.classList.contains('is-open') && envelope.classList.contains('open')) {
            setOpen(false);
            envelope.focus();
        }
    });

    letterPaper.addEventListener('transitionend', (e) => {
        if (e.target === letterPaper && e.propertyName === 'height' && envelope.classList.contains('open')) {
            letterContent.scrollTop = 0;
            updateScrollCue();
        }
    });

    letterContent.addEventListener('scroll', updateScrollCue, { passive: true });

    let resizeRaf = null;
    window.addEventListener('resize', () => {
        if (!envelope.classList.contains('open')) return;
        if (resizeRaf) cancelAnimationFrame(resizeRaf);
        resizeRaf = requestAnimationFrame(() => {
            updateLetterGeometry();
        });
    });
};

// 5. Chuva Ambiente de Emojis (respeita prefers-reduced-motion e visibilidade da aba)
const EmojiRain = (() => {
    const emojis = ['🧸', '🌸', '🎂', '🎈', '🎉', '✨', '💖', '🎁', '🌹', '🥳'];
    const MAX_PARTICLES = 22;
    let container = null;
    let timerId = null;

    const createParticle = () => {
        if (!container || document.hidden || MotionHelper.prefersReduced()) return;
        if (container.childElementCount >= MAX_PARTICLES) return;

        const particle = document.createElement('span');
        particle.textContent = emojis[Math.floor(Math.random() * emojis.length)];

        const size = (Math.random() * 1.1 + 0.85).toFixed(2);
        const startLeft = (Math.random() * 94 + 3).toFixed(1);
        const duration = (Math.random() * 8 + 8).toFixed(1);
        const opacity = (Math.random() * 0.32 + 0.12).toFixed(2);
        const drift = ((Math.random() - 0.5) * 44).toFixed(1);
        const rotate = Math.round(Math.random() * 320);

        particle.style.cssText =
            `position:absolute;bottom:-48px;left:${startLeft}vw;font-size:${size}rem;` +
            `opacity:${opacity};will-change:transform,opacity;` +
            `transition:transform ${duration}s linear,opacity ${duration}s ease-in-out;`;

        container.appendChild(particle);

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                particle.style.transform = `translate(${drift}px, -110dvh) rotate(${rotate}deg)`;
                particle.style.opacity = '0';
            });
        });

        setTimeout(() => particle.remove(), Number(duration) * 1000 + 100);
    };

    const startLoop = () => {
        if (timerId || MotionHelper.prefersReduced()) return;
        const intervalMs = window.innerWidth <= 640 ? 1050 : 700;
        timerId = setInterval(createParticle, intervalMs);
    };

    const stopLoop = () => {
        if (timerId) {
            clearInterval(timerId);
            timerId = null;
        }
        if (container) container.textContent = '';
    };

    const init = () => {
        container = document.createElement('div');
        container.id = 'emoji-rain-container';
        container.setAttribute('aria-hidden', 'true');
        container.style.cssText =
            'position:fixed;inset:0;pointer-events:none;z-index:1;overflow:hidden;';
        document.body.appendChild(container);

        if (!MotionHelper.prefersReduced()) {
            startLoop();
        }

        if (MotionHelper.query.addEventListener) {
            MotionHelper.query.addEventListener('change', (e) => {
                if (e.matches) stopLoop();
                else startLoop();
            });
        }
    };

    return { init };
})();

// 6. Mini Player de Música com Volume Baixo Inicial, Fade-in e Popover de Controle
const MusicPlayer = (() => {
    const STORAGE_KEY = 'iat_music_volume';
    const DEFAULT_VOLUME = 0.15;
    const STEP = 0.05;
    const FADE_IN_MS = 700;

    let audio, playerRoot, toggleBtn, musicIconSwap;
    let volumeBtn, pillVolumeIconSwap, popover;
    let slider, volumeValueEl, muteBtn, muteIconSwap, downBtn, upBtn;

    let started = false;
    let targetVolume = DEFAULT_VOLUME;
    let lastNonZeroVolume = DEFAULT_VOLUME;
    let isMuted = false;
    let canWriteNativeVolume = true;
    let audioCtx = null;
    let gainNode = null;
    let fadeRaf = null;
    let popoverOpen = false;
    let closeTimer = null;

    const clampVol = (v) => Math.min(1, Math.max(0, Number.isFinite(v) ? v : DEFAULT_VOLUME));

    const readSavedVolume = () => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw === null) return DEFAULT_VOLUME;
            const parsed = Number(raw);
            return Number.isFinite(parsed) ? clampVol(parsed) : DEFAULT_VOLUME;
        } catch {
            return DEFAULT_VOLUME;
        }
    };

    const saveVolume = (v) => {
        try {
            localStorage.setItem(STORAGE_KEY, String(Number(v.toFixed(2))));
        } catch {
            // Ignora em contextos com storage bloqueado
        }
    };

    const detectNativeVolumeSupport = () => {
        if (!audio) return true;
        const probe = 0.15;
        audio.volume = probe;
        return Math.abs(audio.volume - probe) < 0.02;
    };

    const ensureWebAudioGain = () => {
        if (canWriteNativeVolume || gainNode || !audio) return;
        if (window.location.protocol === 'file:') return;
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;

        try {
            audioCtx = new AudioCtx();
            const source = audioCtx.createMediaElementSource(audio);
            gainNode = audioCtx.createGain();
            gainNode.gain.value = isMuted ? 0 : targetVolume;
            source.connect(gainNode);
            gainNode.connect(audioCtx.destination);
        } catch {
            audioCtx = null;
            gainNode = null;
        }
    };

    const applyOutputLevel = (level) => {
        const clamped = clampVol(level);
        if (canWriteNativeVolume && audio) {
            audio.volume = clamped;
        } else if (gainNode && audioCtx) {
            gainNode.gain.setValueAtTime(clamped, audioCtx.currentTime);
        } else if (audio) {
            audio.muted = clamped === 0;
        }
    };

    const cancelFade = () => {
        if (fadeRaf) {
            cancelAnimationFrame(fadeRaf);
            fadeRaf = null;
        }
    };

    const fadeOutputTo = (endLevel, durationMs = FADE_IN_MS) => {
        cancelFade();
        const finalLevel = clampVol(endLevel);
        if (MotionHelper.prefersReduced() || durationMs <= 0) {
            applyOutputLevel(finalLevel);
            return;
        }

        const startTime = performance.now();
        applyOutputLevel(0);

        const step = (now) => {
            const elapsed = now - startTime;
            const progress = Math.min(1, elapsed / durationMs);
            // Curva suave desacelerada
            const eased = 1 - Math.pow(1 - progress, 2);
            applyOutputLevel(finalLevel * eased);
            if (progress < 1) {
                fadeRaf = requestAnimationFrame(step);
            } else {
                fadeRaf = null;
            }
        };

        fadeRaf = requestAnimationFrame(step);
    };

    const updateVolumeUI = () => {
        const effectiveVol = isMuted ? 0 : targetVolume;
        const pct = Math.round(effectiveVol * 100);

        if (slider) {
            slider.value = String(pct);
            slider.style.setProperty('--vol-pct', `${pct}%`);
            slider.setAttribute('aria-valuenow', String(pct));
        }

        if (volumeValueEl) {
            volumeValueEl.textContent = `${pct}%`;
        }

        const mutedState = isMuted || effectiveVol === 0;
        if (muteBtn) {
            muteBtn.setAttribute('aria-pressed', String(mutedState));
            muteBtn.setAttribute('aria-label', mutedState ? 'Reativar som' : 'Silenciar música');
        }

        const swapVal = mutedState ? 'b' : 'a';
        if (muteIconSwap) muteIconSwap.dataset.state = swapVal;
        if (pillVolumeIconSwap) pillVolumeIconSwap.dataset.state = swapVal;
    };

    const updatePlayUI = (playing) => {
        if (toggleBtn) {
            toggleBtn.classList.toggle('playing', playing);
            toggleBtn.setAttribute('aria-pressed', String(playing));
            toggleBtn.setAttribute('aria-label', playing ? 'Pausar música' : 'Tocar música');
        }
        if (musicIconSwap) {
            musicIconSwap.dataset.state = playing ? 'b' : 'a';
        }
    };

    const setVolume = (nextVol, { cancelActiveFade = true, persist = true } = {}) => {
        if (cancelActiveFade) cancelFade();
        const clamped = clampVol(nextVol);
        targetVolume = clamped;
        if (clamped > 0) {
            lastNonZeroVolume = clamped;
            isMuted = false;
        } else {
            isMuted = true;
        }
        if (audio) audio.muted = isMuted;
        applyOutputLevel(isMuted ? 0 : targetVolume);
        if (persist) saveVolume(targetVolume);
        updateVolumeUI();
    };

    const toggleMute = () => {
        cancelFade();
        if (isMuted || targetVolume === 0) {
            isMuted = false;
            if (targetVolume === 0) {
                targetVolume = lastNonZeroVolume > 0 ? lastNonZeroVolume : DEFAULT_VOLUME;
            }
        } else {
            if (targetVolume > 0) lastNonZeroVolume = targetVolume;
            isMuted = true;
        }
        if (audio) audio.muted = isMuted;
        applyOutputLevel(isMuted ? 0 : targetVolume);
        saveVolume(isMuted ? 0 : targetVolume);
        updateVolumeUI();
    };

    const startPlayback = () => {
        if (!audio) return Promise.resolve(false);
        ensureWebAudioGain();
        if (audioCtx && audioCtx.state === 'suspended') {
            audioCtx.resume().catch(() => {});
        }

        const destLevel = isMuted ? 0 : targetVolume;
        applyOutputLevel(0);

        return audio.play().then(() => {
            updatePlayUI(true);
            fadeOutputTo(destLevel);
            return true;
        }).catch(() => {
            applyOutputLevel(destLevel);
            updatePlayUI(false);
            return false;
        });
    };

    const pausePlayback = () => {
        if (!audio) return;
        cancelFade();
        audio.pause();
        updatePlayUI(false);
    };

    const togglePlay = () => {
        if (!audio) return;
        if (audio.paused) {
            startPlayback();
        } else {
            pausePlayback();
        }
    };

    const getDropdownCloseMs = () => {
        const raw = getComputedStyle(document.documentElement).getPropertyValue('--dropdown-close-dur');
        return parseFloat(raw) || 150;
    };

    const setPopoverOpen = (open) => {
        if (!popover || !volumeBtn) return;
        if (popoverOpen === open) return;

        popoverOpen = open;
        if (closeTimer) {
            clearTimeout(closeTimer);
            closeTimer = null;
        }

        if (open) {
            popover.classList.remove('is-closing');
            popover.classList.add('is-open');
            popover.setAttribute('aria-hidden', 'false');
            volumeBtn.setAttribute('aria-expanded', 'true');
        } else {
            popover.classList.remove('is-open');
            popover.classList.add('is-closing');
            popover.setAttribute('aria-hidden', 'true');
            volumeBtn.setAttribute('aria-expanded', 'false');
            closeTimer = setTimeout(() => {
                popover.classList.remove('is-closing');
                closeTimer = null;
            }, getDropdownCloseMs());
        }
    };

    const detachAutoplayListeners = () => {
        document.removeEventListener('pointerdown', autoplayOnFirstTouch);
        document.removeEventListener('keydown', autoplayOnFirstTouch);
    };

    const autoplayOnFirstTouch = (e) => {
        if (started) {
            detachAutoplayListeners();
            return;
        }
        // Não interfere se o usuário clicou diretamente nos controles do player
        if (playerRoot && playerRoot.contains(e.target)) return;

        started = true;
        detachAutoplayListeners();
        startPlayback();
    };

    const init = () => {
        audio = document.getElementById('bg-music');
        playerRoot = document.getElementById('music-player');
        toggleBtn = document.getElementById('music-toggle');
        musicIconSwap = document.getElementById('music-icon-swap');
        volumeBtn = document.getElementById('volume-toggle');
        pillVolumeIconSwap = document.getElementById('pill-volume-icon-swap');
        popover = document.getElementById('volume-popover');
        slider = document.getElementById('volume-slider');
        volumeValueEl = document.getElementById('volume-value');
        muteBtn = document.getElementById('volume-mute-btn');
        muteIconSwap = document.getElementById('mute-icon-swap');
        downBtn = document.getElementById('volume-down');
        upBtn = document.getElementById('volume-up');

        if (!audio || !toggleBtn) return;

        canWriteNativeVolume = detectNativeVolumeSupport();
        const saved = readSavedVolume();
        targetVolume = saved;
        lastNonZeroVolume = saved > 0 ? saved : DEFAULT_VOLUME;
        isMuted = saved === 0;
        audio.muted = isMuted;
        applyOutputLevel(isMuted ? 0 : targetVolume);
        updateVolumeUI();
        updatePlayUI(false);

        audio.addEventListener('play', () => updatePlayUI(true));
        audio.addEventListener('pause', () => updatePlayUI(false));

        toggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            started = true;
            detachAutoplayListeners();
            togglePlay();
        });

        if (volumeBtn && popover) {
            volumeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                setPopoverOpen(!popoverOpen);
            });
        }

        if (slider) {
            slider.addEventListener('input', (e) => {
                const next = Number(e.target.value) / 100;
                setVolume(next);
            });
        }

        if (downBtn) {
            downBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const base = isMuted ? 0 : targetVolume;
                const next = Math.round((base - STEP) * 20) / 20;
                setVolume(next);
            });
        }

        if (upBtn) {
            upBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const base = isMuted ? 0 : targetVolume;
                const next = Math.round((base + STEP) * 20) / 20;
                setVolume(next);
            });
        }

        if (muteBtn) {
            muteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                toggleMute();
            });
        }

        document.addEventListener('click', (e) => {
            if (popoverOpen && playerRoot && !playerRoot.contains(e.target)) {
                setPopoverOpen(false);
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && popoverOpen) {
                setPopoverOpen(false);
                if (volumeBtn) volumeBtn.focus();
            }
        });

        document.addEventListener('pointerdown', autoplayOnFirstTouch, { passive: true });
        document.addEventListener('keydown', autoplayOnFirstTouch, { passive: true });
    };

    return { init, Toast };
})();

// Inicialização Global
document.addEventListener('DOMContentLoaded', () => {
    setupTextReveals();
    Gallery.init();
    EmojiRain.init();
    setupEnvelope();
    MusicPlayer.init();
});
