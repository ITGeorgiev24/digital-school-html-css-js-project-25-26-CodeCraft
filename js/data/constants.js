const CATEGORIES = [
    { id: 1, emoji: "💻", name: "Computer Science", count: 15, color: "purple", difficulty: "Medium" },
    { id: 2, emoji: "🧬", name: "Biology", count: 15, color: "emerald", difficulty: "Hard" },
    { id: 3, emoji: "🌍", name: "Geography", count: 15, color: "sky", difficulty: "Easy" },
    { id: 4, emoji: "🎨", name: "Art & Culture", count: 15, color: "rose", difficulty: "Easy" },
    { id: 5, emoji: "⚛", name: "Physics", count: 15, color: "gold", difficulty: "Hard" },
    { id: 6, emoji: "📚", name: "Literature", count: 15, color: "purple", difficulty: "Medium" },
    { id: 7, emoji: "🏛", name: "History", count: 15, color: "gold", difficulty: "Medium" },
    { id: 8, emoji: "🧮", name: "Mathematics", count: 15, color: "sky", difficulty: "Hard" },
];
const ACHIEVEMENTS = [
    { id: 1, icon: "🏆", name: "First Win", desc: "Complete your first quiz" },
    { id: 2, icon: "⚡", name: "Speed Demon", desc: "Answer correctly in under 5s" },
    { id: 3, icon: "🔥", name: "On a Roll", desc: "Complete 5 quizzes" },
    { id: 4, icon: "🎯", name: "Perfect Score", desc: "Score 100% on any quiz" },
    { id: 5, icon: "🌟", name: "Scholar", desc: "Reach Level 5" },
    { id: 6, icon: "📚", name: "Dedicated", desc: "Complete 10 quizzes" },
    { id: 7, icon: "🧠", name: "Brainiac", desc: "Earn 500 XP" },
    { id: 8, icon: "👑", name: "Grandmaster", desc: "Reach Level 10" },
];
const DEFAULT_NOTIFS = [
    { id: 1, title: "🎉 Welcome to QuizMaster!", body: "Your account is ready. Start any quiz to earn XP!", time: "Just now", unread: true },
    { id: 2, title: "💡 Tip: Try the Quiz Generator", body: "Type any topic in the Quiz Generator for a custom challenge.", time: "Just now", unread: true },
];
const ADMIN_USERS = [
    { id: 1, name: "Alex Chen", email: "alex@example.com", quizzes: 47, score: 9840, status: "active" },
    { id: 2, name: "Sarah Kim", email: "sarah@example.com", quizzes: 39, score: 9120, status: "active" },
    { id: 3, name: "Marcus Johnson", email: "marcus@example.com", quizzes: 31, score: 8750, status: "suspended" },
    { id: 4, name: "Priya Patel", email: "priya@example.com", quizzes: 28, score: 8340, status: "active" },
];
const ADMIN_QUIZZES = [
    { id: 1, title: "JavaScript Advanced", category: "CS", questions: 15, plays: 2840, rating: 4.8 },
    { id: 2, title: "World Geography", category: "Geography", questions: 15, plays: 1920, rating: 4.6 },
    { id: 3, title: "Human Biology", category: "Biology", questions: 15, plays: 1540, rating: 4.7 },
    { id: 4, title: "Modern Physics", category: "Physics", questions: 15, plays: 980, rating: 4.5 },
];

function showToast(msg, sub, type) {
    const c = document.getElementById('toast-container'); const el = document.createElement('div'); el.className = 'toast-item';
    const colors = { success: 'var(--emerald)', error: 'var(--rose)', info: 'var(--sky)', gold: 'var(--gold)' };
    el.innerHTML = '<div style="width:20px;height:20px;border-radius:50%;background:' + (colors[type || 'success']) + ';flex-shrink:0;margin-top:1px"></div><div><div class="toast-msg">' + msg + '</div>' + (sub ? '<div class="toast-sub">' + sub + '</div>' : '') + '</div>';
    c.appendChild(el); setTimeout(() => { el.style.animation = 'toastIn .3s ease reverse'; setTimeout(() => el.remove(), 300); }, 3000);
}

function SparkLine({ data, color }) {
    const max = Math.max(...data), min = Math.min(...data);
    const pts = data.map((v, i) => i * (100 / (data.length - 1)) + ',' + (100 - ((v - min) / (max - min || 1)) * 80)).join(' ');
    return h('svg', { width: '100%', height: 40, viewBox: '0 0 100 100', preserveAspectRatio: 'none' }, h('polyline', { points: pts, fill: 'none', stroke: color || 'var(--accent2)', strokeWidth: 3, strokeLinecap: 'round', strokeLinejoin: 'round' }));
}
function DonutChart({ pct, color, size }) {
    size = size || 80; const r = 32, c = 2 * Math.PI * r, fill = c * (pct / 100);
    return h('svg', { width: size, height: size, viewBox: '0 0 80 80' }, h('circle', { cx: 40, cy: 40, r, fill: 'none', stroke: 'var(--bg3)', strokeWidth: 8 }), h('circle', { cx: 40, cy: 40, r, fill: 'none', stroke: color || 'var(--accent2)', strokeWidth: 8, strokeDasharray: fill + ' ' + c, strokeLinecap: 'round', style: { transition: 'stroke-dasharray 1s ease', transform: 'rotate(-90deg)', transformOrigin: 'center' } }), h('text', { x: 40, y: 40, textAnchor: 'middle', dominantBaseline: 'central', fill: 'var(--text)', fontSize: 14, fontWeight: 700, fontFamily: 'Syne,sans-serif' }, pct + '%'));
}
function Counter({ target }) {
    const [val, setVal] = useState(0);
    useEffect(() => { let s, cur = 0; const inc = target / 40; s = setInterval(() => { cur += inc; if (cur >= target) { setVal(target); clearInterval(s); } else setVal(Math.floor(cur)); }, 30); return () => clearInterval(s); }, [target]);
    return h('span', null, val.toLocaleString());
}
function XPBar({ xp }) {
    const info = getLevelInfo(xp); const prog = getXPProgress(xp);
    return h('div', { style: { width: '100%' } },
        h('div', { style: { display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text3)', marginBottom: 4 } },
            h('span', null, 'Level ' + info.level + ' — ' + info.title),
            prog.needed > 0 ? h('span', null, prog.current + '/' + prog.needed + ' XP to next') : h('span', { style: { color: 'var(--gold)' } }, 'Max Level!')
        ),
        h('div', { className: 'progress-bar' }, h('div', { className: 'progress-fill purple', style: { width: prog.pct + '%' } }))
    );
}


const icons = {
    home: h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', className: 'nav-icon' }, h('path', { d: 'M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z' }), h('polyline', { points: '9 22 9 12 15 12 15 22' })),
    quiz: h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', className: 'nav-icon' }, h('circle', { cx: 12, cy: 12, r: 10 }), h('path', { d: 'M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3' }), h('line', { x1: 12, y1: 17, x2: 12.01, y2: 17 })),
    chart: h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', className: 'nav-icon' }, h('line', { x1: 18, y1: 20, x2: 18, y2: 10 }), h('line', { x1: 12, y1: 20, x2: 12, y2: 4 }), h('line', { x1: 6, y1: 20, x2: 6, y2: 14 })),
    trophy: h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', className: 'nav-icon' }, h('polyline', { points: '6 9 6 2 18 2 18 9' }), h('path', { d: 'M6 9c0 4 3 7 6 7s6-3 6-7' }), h('path', { d: 'M6 9H2v1a6 6 0 006 6' }), h('path', { d: 'M18 9h4v1a6 6 0 01-6 6' }), h('line', { x1: 12, y1: 22, x2: 12, y2: 16 }), h('rect', { x: 8, y: 22, width: 8, height: 1, rx: .5 })),
    user: h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', className: 'nav-icon' }, h('path', { d: 'M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2' }), h('circle', { cx: 12, cy: 7, r: 4 })),
    settings: h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', className: 'nav-icon' }, h('circle', { cx: 12, cy: 12, r: 3 }), h('path', { d: 'M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z' })),
    shield: h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', className: 'nav-icon' }, h('path', { d: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z' })),
    bell: h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', className: 'nav-icon' }, h('path', { d: 'M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9' }), h('path', { d: 'M13.73 21a2 2 0 01-3.46 0' })),
    logout: h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', className: 'nav-icon' }, h('path', { d: 'M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4' }), h('polyline', { points: '16 17 21 12 16 7' }), h('line', { x1: 21, y1: 12, x2: 9, y2: 12 })),
    menu: h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', style: { width: 20, height: 20 } }, h('line', { x1: 3, y1: 6, x2: 21, y2: 6 }), h('line', { x1: 3, y1: 12, x2: 21, y2: 12 }), h('line', { x1: 3, y1: 18, x2: 21, y2: 18 })),
    xmark: h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', style: { width: 18, height: 18 } }, h('line', { x1: 18, y1: 6, x2: 6, y2: 18 }), h('line', { x1: 6, y1: 6, x2: 18, y2: 18 })),
    sun: h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', style: { width: 16, height: 16 } }, h('circle', { cx: 12, cy: 12, r: 5 }), h('line', { x1: 12, y1: 1, x2: 12, y2: 3 }), h('line', { x1: 12, y1: 21, x2: 12, y2: 23 }), h('line', { x1: 4.22, y1: 4.22, x2: 5.64, y2: 5.64 }), h('line', { x1: 18.36, y1: 18.36, x2: 19.78, y2: 19.78 }), h('line', { x1: 1, y1: 12, x2: 3, y2: 12 }), h('line', { x1: 21, y1: 12, x2: 23, y2: 12 }), h('line', { x1: 4.22, y1: 19.78, x2: 5.64, y2: 18.36 }), h('line', { x1: 18.36, y1: 5.64, x2: 19.78, y2: 4.22 })),
    moon: h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', style: { width: 16, height: 16 } }, h('path', { d: 'M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z' })),
};

