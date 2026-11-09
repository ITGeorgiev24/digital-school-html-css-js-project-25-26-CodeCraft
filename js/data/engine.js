function launchConfetti(dur) {
    let cv = document.getElementById('confetti-canvas');
    if (!cv) { cv = document.createElement('canvas'); cv.id = 'confetti-canvas'; document.body.appendChild(cv); }
    cv.width = window.innerWidth; cv.height = window.innerHeight;
    const ctx = cv.getContext('2d');
    const cols = ['#7c3aed', '#a855f7', '#38bdf8', '#10b981', '#f59e0b', '#f43f5e', '#e879f9', '#34d399'];
    const ps = Array.from({ length: 120 }, () => ({
        x: Math.random() * cv.width, y: -10 - Math.random() * 80,
        w: 7 + Math.random() * 7, h: 3 + Math.random() * 4,
        col: cols[Math.floor(Math.random() * cols.length)],
        rot: Math.random() * 360, rv: (Math.random() - .5) * 7,
        vx: (Math.random() - .5) * 3.5, vy: 1.5 + Math.random() * 3.5, a: 1
    }));
    const end = Date.now() + (dur || 2800);
    function frame() {
        ctx.clearRect(0, 0, cv.width, cv.height);
        const now = Date.now();
        ps.forEach(p => {
            p.x += p.vx; p.y += p.vy; p.rot += p.rv; p.vy += .07;
            if (now > end - 900) p.a = Math.max(0, p.a - .012);
            ctx.save(); ctx.globalAlpha = p.a;
            ctx.translate(p.x + p.w / 2, p.y + p.h / 2); ctx.rotate(p.rot * Math.PI / 180);
            ctx.fillStyle = p.col; ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
            ctx.restore();
        });
        if (now < end) requestAnimationFrame(frame); else ctx.clearRect(0, 0, cv.width, cv.height);
    }
    requestAnimationFrame(frame);
}
window.launchConfetti = launchConfetti;


const { useState, useEffect, useRef, useCallback } = React;
const h = React.createElement;

// ---- AUDIO ENGINE ----
let audioCtx = null;
function getCtx() { if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)(); return audioCtx; }
function _playTone(freq, dur, type, vol) {
    try { const ctx = getCtx(); const o = ctx.createOscillator(); const g = ctx.createGain(); o.connect(g); g.connect(ctx.destination); o.type = type || 'sine'; o.frequency.setValueAtTime(freq, ctx.currentTime); g.gain.setValueAtTime(vol || 0.15, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur); o.start(); o.stop(ctx.currentTime + dur); } catch (e) { }
}
function playCorrect() { if (!window._soundsOn) return; _playTone(523, .12, 'sine', .15); setTimeout(() => _playTone(659, .15, 'sine', .15), 100); setTimeout(() => _playTone(784, .22, 'sine', .15), 200); }
function playWrong() { if (!window._soundsOn) return; _playTone(220, .18, 'sawtooth', .12); setTimeout(() => _playTone(196, .25, 'sawtooth', .1), 120); }
function playClick() { if (!window._soundsOn) return; _playTone(880, .04, 'sine', .08); }
function playLevelUp() { if (!window._soundsOn) return;[523, 659, 784, 1047].forEach((f, i) => setTimeout(() => _playTone(f, .18, 'sine', .2), i * 120)); }
function playStart() { if (!window._soundsOn) return; _playTone(440, .08, 'sine', .12); setTimeout(() => _playTone(554, .12, 'sine', .12), 80); }
window._soundsOn = true;

// ---- LEVEL SYSTEM ----
const LEVELS = [
    { level: 1, title: 'Rookie', xpNeeded: 0 }, { level: 2, title: 'Learner', xpNeeded: 100 }, { level: 3, title: 'Explorer', xpNeeded: 250 },
    { level: 4, title: 'Thinker', xpNeeded: 500 }, { level: 5, title: 'Scholar', xpNeeded: 900 }, { level: 6, title: 'Expert', xpNeeded: 1400 },
    { level: 7, title: 'Master', xpNeeded: 2000 }, { level: 8, title: 'Champion', xpNeeded: 2800 }, { level: 9, title: 'Legend', xpNeeded: 3800 },
    { level: 10, title: 'Grandmaster', xpNeeded: 5000 },
];
function getLevelInfo(xp) { let info = LEVELS[0]; for (const l of LEVELS) { if (xp >= l.xpNeeded) info = l; } return info; }
function getXPProgress(xp) {
    const cur = getLevelInfo(xp); const nextIdx = cur.level;
    if (nextIdx >= LEVELS.length) return { pct: 100, current: xp - cur.xpNeeded, needed: 0 };
    const next = LEVELS[nextIdx]; const earned = xp - cur.xpNeeded; const needed = next.xpNeeded - cur.xpNeeded;
    return { pct: Math.min(100, Math.round((earned / needed) * 100)), current: earned, needed };
}

function formatJoinDate(ts) { const d = new Date(ts); return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }); }

