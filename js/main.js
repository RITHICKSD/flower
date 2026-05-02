'use strict';
// ── HORIZONTAL SCROLL PREVENTION ──
(function preventHorizontalScroll() {
    let startX = 0;
    let scrollLeft = 0;

    // Prevent horizontal scroll with mouse
    document.addEventListener('wheel', (e) => {
        // Don't prevent scroll on navigation menu
        if (e.target.closest('.nav') || e.target.closest('#mainNav')) return;

        if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
            e.preventDefault();
        }
    }, { passive: false });

    // Prevent horizontal scroll with touch
    document.addEventListener('touchstart', (e) => {
        // Don't prevent touch on navigation menu
        if (e.target.closest('.nav') || e.target.closest('#mainNav')) return;

        startX = e.touches[0].pageX;
        scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
    }, { passive: true });

    document.addEventListener('touchmove', (e) => {
        // Don't prevent touch on navigation menu
        if (e.target.closest('.nav') || e.target.closest('#mainNav')) return;

        const currentX = e.touches[0].pageX;
        const diffX = currentX - startX;

        if (Math.abs(diffX) > 10) {
            e.preventDefault();
        }
    }, { passive: false });

    // Prevent horizontal scroll with keyboard
    window.addEventListener('keydown', (e) => {
        // Don't prevent keyboard navigation in menu
        if (document.activeElement?.closest('.nav') || document.activeElement?.closest('#mainNav')) return;

        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
            e.preventDefault();
        }
    });

    // Force scroll position to 0,0 (but not when nav is open)
    setInterval(() => {
        if (!document.querySelector('.nav.open')) {
            if (window.pageXOffset !== 0 || document.documentElement.scrollLeft !== 0) {
                window.scrollTo(0, window.pageYOffset);
            }
        }
    }, 100);
})();

// ── PRELOADER ──
window.addEventListener('load', () => {
    setTimeout(() => document.getElementById('preloader')?.classList.add('done'), 1100);
});
// ── HEADER scroll ──
const hdr = document.getElementById('header');
function updHdr() { hdr?.classList.toggle('scrolled', window.scrollY > 60) }
window.addEventListener('scroll', updHdr, { passive: true }); updHdr();
// ── HAMBURGER ──
const ham = document.getElementById('hamburger'), nav = document.getElementById('mainNav');
const hdrWrap = document.querySelector('.hdr-wrap');
if (ham && nav && hdrWrap) {
    // On mobile, backdrop-filter on .header.scrolled traps position:fixed children.
    // We move nav to body on mobile so it can cover the full viewport.
    let navInBody = false;
    function ensureNavInBody() {
        if (!navInBody && window.innerWidth <= 768) {
            document.body.appendChild(nav);
            navInBody = true;
        } else if (navInBody && window.innerWidth > 768) {
            // Put it back before hdr-right for desktop layout
            hdrWrap.insertBefore(nav, hdrWrap.querySelector('.hdr-right'));
            navInBody = false;
        }
    }
    ensureNavInBody();
    window.addEventListener('resize', ensureNavInBody, { passive: true });

    ham.addEventListener('click', () => {
        ham.classList.toggle('open');
        nav.classList.toggle('open');

        // Simple body scroll lock
        if (nav.classList.contains('open')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
            // Close all dropdowns when menu closes
            nav.querySelectorAll('.ni.has-drop.open').forEach(item => item.classList.remove('open'));
        }
    });

    // Close menu when clicking on actual navigation links (NOT dropdown parent links)
    nav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            // Don't close if this is a dropdown parent link on mobile
            const isDropdownParent = link.classList.contains('nl-a') && link.parentElement.classList.contains('has-drop');
            if (isDropdownParent && window.innerWidth <= 768) {
                return; // Let the dropdown toggle handler deal with it
            }
            ham.classList.remove('open');
            nav.classList.remove('open');
            document.body.style.overflow = '';
            nav.querySelectorAll('.ni.has-drop.open').forEach(item => item.classList.remove('open'));
        });
    });
}

// ── MOBILE DROPDOWN TOGGLE ──
nav?.querySelectorAll('.ni.has-drop > .nl-a').forEach(link => {
    link.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
            e.preventDefault();
            e.stopPropagation();
            const parent = link.parentElement;

            // Close all other dropdowns
            nav.querySelectorAll('.ni.has-drop.open').forEach(item => {
                if (item !== parent) item.classList.remove('open');
            });

            // Toggle current dropdown
            parent.classList.toggle('open');
        }
    });
});
// ── LTR/RTL ──
(() => {
    const html = document.documentElement;
    const currentDir = localStorage.getItem('dir') || 'ltr';
    
    const updateDirUI = (dir) => {
        html.setAttribute('dir', dir);
        localStorage.setItem('dir', dir);
        document.querySelectorAll('#dirToggle, .btn-globe, .btn-globe-auth').forEach(btn => {
            btn.textContent = dir.toUpperCase();
        });
    };

    updateDirUI(currentDir);

    document.addEventListener('click', (e) => {
        const btn = e.target.closest('#dirToggle') || e.target.closest('.btn-globe') || e.target.closest('.btn-globe-auth');
        if (btn) {
            const newDir = html.getAttribute('dir') === 'rtl' ? 'ltr' : 'rtl';
            updateDirUI(newDir);
        }
    });
})();
// ── THEME TOGGLE ──
(() => {
    const body = document.body;
    const currentTheme = localStorage.getItem('theme');

    if (currentTheme === 'dark') {
        body.classList.add('dark-theme');
    }

    document.addEventListener('click', (e) => {
        const btn = e.target.closest('#themeToggle') || e.target.closest('.btn-theme') || e.target.closest('.btn-theme-auth');
        if (btn) {
            body.classList.toggle('dark-theme');
            const theme = body.classList.contains('dark-theme') ? 'dark' : 'light';
            localStorage.setItem('theme', theme);
            window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme } }));
        }
    });
})();
// ── FALLING PETALS CANVAS ──
(() => {
    const c = document.getElementById('petalCanvas'); if (!c) return;
    const ctx = c.getContext('2d');
    const cols = ['#e8a0a8', '#f2c4c6', '#c8686f', '#dbb0b4', '#f5d5d7', '#c9a050', '#e8d5a3'];
    let petals = [];
    function resize() { c.width = innerWidth; c.height = innerHeight }
    resize(); window.addEventListener('resize', resize, { passive: true });
    function rp() { return { x: Math.random() * c.width, y: -20 - Math.random() * 150, r: 6 + Math.random() * 9, rot: Math.random() * Math.PI * 2, rs: (Math.random() - .5) * .04, sx: (Math.random() - .5) * 1.1, sy: .5 + Math.random() * 1.3, op: .4 + Math.random() * .5, col: cols[Math.random() * cols.length | 0], sw: Math.random() * Math.PI * 2, ss: .01 + Math.random() * .02 } }
    for (let i = 0; i < 20; i++) { const p = rp(); p.y = Math.random() * c.height; petals.push(p) }
    function draw(p) { ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.globalAlpha = p.op; ctx.fillStyle = p.col; ctx.beginPath(); ctx.ellipse(0, 0, p.r * .5, p.r, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore() }
    function loop() { ctx.clearRect(0, 0, c.width, c.height); petals.forEach(p => { p.sw += p.ss; p.x += p.sx + Math.sin(p.sw) * .7; p.y += p.sy; p.rot += p.rs; if (p.y > c.height + 20) Object.assign(p, rp()); draw(p) }); requestAnimationFrame(loop) }
    loop();
})();
// ── SCROLL REVEAL (all ani-* classes) ──
const aniEls = document.querySelectorAll('[class*="ani-"]');
if (aniEls.length) {
    const io = new IntersectionObserver(entries => { entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('vis'); io.unobserve(e.target) } }) }, { threshold: .1, rootMargin: '0px 0px -30px 0px' });
    aniEls.forEach(el => io.observe(el));
}
// ── COUNTERS ──
function animCount(el, target, dur = 1800) { let s = 0; const step = ts => { if (!s) s = ts; const p = Math.min((ts - s) / dur, 1), e = 1 - Math.pow(1 - p, 3); el.textContent = Math.floor(e * target); if (p < 1) requestAnimationFrame(step); else el.textContent = target.toLocaleString() }; requestAnimationFrame(step) }
new IntersectionObserver(ents => { ents.forEach(e => { if (e.isIntersecting) { animCount(e.target, +e.target.dataset.c, 1600); io.unobserve(e.target) } }) }, { threshold: .5 }).observe;
// story stats
const snums = document.querySelectorAll('.snum');
if (snums.length) { const sio = new IntersectionObserver(ents => { ents.forEach(e => { if (e.isIntersecting) { animCount(e.target, +e.target.dataset.c, 1600); sio.unobserve(e.target) } }) }, { threshold: .5 }); snums.forEach(el => sio.observe(el)) }
// big stats
const cnts = document.querySelectorAll('.cnt');
if (cnts.length) { const cio = new IntersectionObserver(ents => { ents.forEach(e => { if (e.isIntersecting) { animCount(e.target, +e.target.dataset.t, 2200); cio.unobserve(e.target) } }) }, { threshold: .3 }); cnts.forEach(el => cio.observe(el)) }
// ── BESTSELLERS SLIDER ──
const bsT = document.getElementById('bsTrack'), bsPr = document.getElementById('bsPrev'), bsNx = document.getElementById('bsNext');
if (bsT) { const amt = () => (bsT.querySelector('.bs-card')?.offsetWidth || 250) + 22; bsNx?.addEventListener('click', () => bsT.scrollBy({ left: amt(), behavior: 'smooth' })); bsPr?.addEventListener('click', () => bsT.scrollBy({ left: -amt(), behavior: 'smooth' })) }
// ── SEASONAL TABS ──
document.querySelectorAll('.stab').forEach(btn => { btn.addEventListener('click', () => { document.querySelectorAll('.stab').forEach(b => b.classList.remove('active')); document.querySelectorAll('.spanel').forEach(p => p.classList.remove('active')); btn.classList.add('active'); const p = document.getElementById('tab-' + btn.dataset.tab); if (p) p.classList.add('active') }) });
// ── TESTIMONIALS ──
(() => {
    const cards = [...document.querySelectorAll('.tc')], dots = [...document.querySelectorAll('.td')];
    if (!cards.length) return; let cur = 0, tim;
    function go(i) { cards[cur].classList.remove('active'); dots[cur]?.classList.remove('active'); cur = (i + cards.length) % cards.length; cards[cur].classList.add('active'); dots[cur]?.classList.add('active') }
    dots.forEach(d => d.addEventListener('click', () => { clearInterval(tim); go(+d.dataset.i); tim = setInterval(() => go(cur + 1), 5000) }));
    tim = setInterval(() => go(cur + 1), 5000);
})();
// ── ACCORDION ──
document.querySelectorAll('.at').forEach(btn => { btn.addEventListener('click', () => { const open = btn.classList.contains('open'); document.querySelectorAll('.at.open').forEach(b => { b.classList.remove('open'); b.closest('.ai').querySelector('.ap').classList.remove('open') }); if (!open) { btn.classList.add('open'); btn.closest('.ai').querySelector('.ap').classList.add('open') } }) });
// ── GIFT CARD AMOUNTS ──
const gcBtns = document.querySelectorAll('.gcb'), gcAmt = document.getElementById('gcAmt');
if (gcBtns.length && gcAmt) { gcBtns.forEach(b => { b.addEventListener('click', () => { gcBtns.forEach(x => x.classList.remove('active')); b.classList.add('active'); gcAmt.textContent = b.dataset.v }) }) }
// ── NEWSLETTER ──
document.getElementById('nlForm')?.addEventListener('submit', e => { e.preventDefault(); const btn = e.target.querySelector('button'), inp = e.target.querySelector('.nl-in'); if (!inp?.value) return; btn.textContent = '✓ Subscribed!'; btn.style.background = '#6B8F71'; inp.value = ''; setTimeout(() => { btn.textContent = 'Subscribe'; btn.style.background = '' }, 3500) });
// ── BACK TO TOP ──
const btt = document.getElementById('btt');
window.addEventListener('scroll', () => btt?.classList.toggle('show', scrollY > 400), { passive: true });
btt?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
// ── SMOOTH ANCHOR SCROLL ──
document.querySelectorAll('a[href^="#"]').forEach(a => { a.addEventListener('click', e => { const id = a.getAttribute('href').slice(1), t = document.getElementById(id); if (!t) return; e.preventDefault(); window.scrollTo({ top: t.offsetTop - (hdr?.offsetHeight || 88), behavior: 'smooth' }) }) });
// ── SUBTLE HERO PARALLAX ──
const heroImg = document.querySelector('.hero-img');
window.addEventListener('scroll', () => { if (heroImg && scrollY < innerHeight) heroImg.style.transform = `scale(1) translateY(${scrollY * .22}px)` }, { passive: true });
// ── GALLERY items (div-based) ──
// Gallery items are divs with .gi-img background, no lightbox needed for CSS fallback version
