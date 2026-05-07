initTheme();

document.addEventListener('DOMContentLoaded', function () {
    initThemeToggle();
    initNav();
    initScrollProgress();
    initReveal();
    initSectionParallax();
    setActiveNavLink();
    initCardTilt();
    initKPICounter();
    initStarField();
    initMountainEffects();
    initPhotoReel();
});

function initTheme() {
    var savedTheme = null;
    try {
        savedTheme = localStorage.getItem('theme-preference');
    } catch (error) {
        savedTheme = null;
    }

    var theme = savedTheme || 'dark';
    document.documentElement.setAttribute('data-theme', theme);
}

function initThemeToggle() {
    var button = document.getElementById('theme-toggle');
    if (!button) return;

    updateThemeButton(button, document.documentElement.getAttribute('data-theme') || 'dark');

    button.addEventListener('click', function () {
        var current = document.documentElement.getAttribute('data-theme') || 'dark';
        var next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        updateThemeButton(button, next);

        try {
            localStorage.setItem('theme-preference', next);
        } catch (error) {
            // Ignore storage failures in private browsing contexts.
        }
    });
}

function updateThemeButton(button, theme) {
    var isDark = theme === 'dark';
    button.setAttribute('aria-pressed', String(!isDark));
    button.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
    button.setAttribute('title', isDark ? 'Switch to light mode' : 'Switch to dark mode');
    button.innerHTML = isDark
        ? '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>'
        : '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
}

function initNav() {
    const nav = document.getElementById('nav');
    if (!nav) return;

    // Scrolled state: observe a sentinel at the very top of the page
    const sentinel = document.createElement('div');
    sentinel.style.cssText = 'position:absolute;top:0;left:0;height:1px;width:1px;pointer-events:none;';
    document.body.prepend(sentinel);

    new IntersectionObserver(function (entries) {
        nav.classList.toggle('nav--scrolled', !entries[0].isIntersecting);
    }).observe(sentinel);

    // Mobile menu toggle
    const hamburger = document.getElementById('nav-hamburger');
    const overlay = document.getElementById('nav-overlay');
    if (!hamburger || !overlay) return;

    hamburger.addEventListener('click', function () {
        const isOpen = nav.classList.toggle('menu-open');
        hamburger.setAttribute('aria-expanded', String(isOpen));
        overlay.setAttribute('aria-hidden', String(!isOpen));
        document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close overlay on link click
    overlay.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () {
            nav.classList.remove('menu-open');
            hamburger.setAttribute('aria-expanded', 'false');
            overlay.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        });
    });

    // Close on Escape key
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && nav.classList.contains('menu-open')) {
            nav.classList.remove('menu-open');
            hamburger.setAttribute('aria-expanded', 'false');
            overlay.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        }
    });
}

function initScrollProgress() {
    const bar = document.getElementById('scroll-progress');
    if (!bar) return;

    window.addEventListener('scroll', function () {
        const scrollable = document.documentElement.scrollHeight - window.innerHeight;
        if (scrollable > 0) {
            bar.style.width = ((window.scrollY / scrollable) * 100) + '%';
        }
    }, { passive: true });
}

function initReveal() {
    const elements = document.querySelectorAll('.reveal');
    if (!elements.length) return;

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -48px 0px' });

    elements.forEach(function (el) { observer.observe(el); });
}

function initSectionParallax() {
    var sections = document.querySelectorAll('.section, .page-hero, .hero');
    if (!sections.length) return;

    var reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) return;

    window.addEventListener('scroll', function () {
        var scrollY = window.scrollY;
        sections.forEach(function (section, index) {
            var speed = (index % 2 === 0 ? 0.012 : -0.01);
            section.style.backgroundPosition = '50% calc(50% + ' + (scrollY * speed) + 'px)';
        });
    }, { passive: true });
}

function setActiveNavLink() {
    var path = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav__links a, #nav-overlay a').forEach(function (link) {
        var href = link.getAttribute('href');
        if (!href) return;
        if (href === path) {
            link.setAttribute('aria-current', 'page');
        } else {
            link.removeAttribute('aria-current');
        }
    });
}

function initCardTilt() {
    var reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) return;

    document.querySelectorAll('.project-card, .kpi-card, .game-card').forEach(function (card) {
        card.addEventListener('mousemove', function (e) {
            var rect = card.getBoundingClientRect();
            var dx = (e.clientX - (rect.left + rect.width  / 2)) / (rect.width  / 2);
            var dy = (e.clientY - (rect.top  + rect.height / 2)) / (rect.height / 2);
            card.style.transform = 'perspective(700px) rotateX(' + (-dy * 7) + 'deg) rotateY(' + (dx * 7) + 'deg) translateY(-4px)';
        }, { passive: true });
        card.addEventListener('mouseleave', function () {
            card.style.transform = '';
        });
    });
}

function initKPICounter() {
    document.querySelectorAll('.kpi-card').forEach(function (card) {
        var valueEl = card.querySelector('.kpi-card__value');
        if (!valueEl) return;

        var original = valueEl.textContent.trim();
        var match = original.match(/^(\d+)/);
        if (!match) return;

        var target   = parseInt(match[1], 10);
        var suffix   = original.slice(match[0].length);
        var started  = false;

        var observer = new IntersectionObserver(function (entries) {
            if (!entries[0].isIntersecting || started) return;
            started = true;
            observer.disconnect();

            var duration  = 1400;
            var startTime = null;

            function step(ts) {
                if (!startTime) startTime = ts;
                var progress = Math.min((ts - startTime) / duration, 1);
                var eased    = 1 - Math.pow(1 - progress, 3);
                valueEl.textContent = Math.round(eased * target) + suffix;
                if (progress < 1) requestAnimationFrame(step);
            }
            requestAnimationFrame(step);
        }, { threshold: 0.5 });

        observer.observe(card);
    });
}

function initStarField() {
    var hero = document.querySelector('.hero');
    if (!hero) return;

    var reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    var canvas = document.createElement('canvas');
    canvas.className = 'hero__stars';
    canvas.setAttribute('aria-hidden', 'true');
    hero.insertBefore(canvas, hero.firstChild);

    var ctx   = canvas.getContext('2d');
    var stars = [];

    function resize() {
        canvas.width  = hero.offsetWidth;
        canvas.height = hero.offsetHeight;
        buildStars();
    }

    function buildStars() {
        stars = [];
        for (var i = 0; i < 85; i++) {
            stars.push({
                x:     Math.random() * canvas.width,
                y:     Math.random() * canvas.height * 0.68,
                r:     Math.random() * 1.1 + 0.3,
                base:  Math.random() * 0.45 + 0.15,
                speed: Math.random() * 0.003 + 0.001,
                phase: Math.random() * Math.PI * 2
            });
        }
    }

    function draw(ts) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        stars.forEach(function (s) {
            var alpha = s.base + Math.sin(ts * s.speed + s.phase) * 0.14;
            alpha = Math.max(0.05, Math.min(0.65, alpha));
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(244,244,249,' + alpha + ')';
            ctx.fill();
        });
        if (!reducedMotion) requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener('resize', resize, { passive: true });
    requestAnimationFrame(draw);
}

function initMountainEffects() {
    var container = document.querySelector('.hero__mountains');
    if (!container) return;

    var heroZone = document.querySelector('.hero-zone');
    if (!heroZone) return;

    var reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) return;

    var canvas = document.createElement('canvas');
    canvas.className = 'hero__mountain-effects';
    canvas.setAttribute('aria-hidden', 'true');
    heroZone.appendChild(canvas);

    var ctx            = canvas.getContext('2d');
    var PARTICLE_COUNT = 18;
    var AURORA_COLORS  = ['159,123,255', '93,199,255', '255,181,98'];

    // Background star / aurora state
    var star      = null;
    var nextSpawn = 0;
    var particles = [];
    var isHovered = false;
    var prevMouse = null;
    var lastTs    = 0;

    // Butterfly state
    var flapAngle      = 0;
    var flapSpeed      = 0.008;
    var facingAngle    = 0;
    var mouseX         = null;
    var mouseY         = null;
    var butterflyX     = null;
    var butterflyY     = null;
    var butterflyAlpha = 0;
    var sparkles       = [];

    function resize() {
        canvas.width  = heroZone.offsetWidth;
        canvas.height = heroZone.offsetHeight;
        buildParticles();
    }

    function buildParticles() {
        particles = [];
        for (var i = 0; i < PARTICLE_COUNT; i++) {
            particles.push(makeParticle(true));
        }
    }

    function makeParticle(scatter) {
        var baseAlpha = Math.random() * 0.10 + 0.05;
        var spawnY    = scatter
            ? Math.random() * canvas.height
            : canvas.height * 0.50 + Math.random() * (canvas.height * 0.35);
        return {
            x:         Math.random() * canvas.width,
            y:         spawnY,
            r:         Math.random() * 0.8 + 0.4,
            baseAlpha: baseAlpha,
            alpha:     baseAlpha,
            vx:        (Math.random() - 0.5) * 0.18,
            vy:        -(Math.random() * 0.30 + 0.15),
            color:     AURORA_COLORS[Math.floor(Math.random() * AURORA_COLORS.length)],
            phase:     Math.random() * Math.PI * 2,
            speed:     Math.random() * 0.002 + 0.001
        };
    }

    function getStarColor() {
        var theme = document.documentElement.getAttribute('data-theme') || 'dark';
        return theme === 'light' ? '255,181,98' : '59,130,246';
    }

    function getButterflyColor() {
        var theme = document.documentElement.getAttribute('data-theme') || 'dark';
        return theme === 'light'
            ? { wing1: '219,39,119', wing2: '244,114,182', glow: '219,39,119' }
            : { wing1: '159,123,255', wing2: '93,199,255',  glow: '159,123,255' };
    }

    function spawnStar(ts) {
        var angleDeg = Math.random() * 14 + 28;
        var angleRad = angleDeg * Math.PI / 180;
        star = {
            startX:    Math.random() * canvas.width * 0.50 + canvas.width * 0.05,
            startY:    Math.random() * canvas.height * 0.60 + 4,
            dx:        Math.cos(angleRad),
            dy:        Math.sin(angleRad),
            trailLen:  Math.random() * 60 + 80,
            totalDist: canvas.width * 0.55,
            duration:  (Math.random() * 0.5 + 0.65) * 1000,
            spawnTime: ts,
            color:     getStarColor()
        };
    }

    // Global mousemove listener: bypasses the z-index stacking that blocks
    // container-level events (hero grid items sit above hero__mountains).
    function onGlobalMouseMove(e) {
        var rect   = heroZone.getBoundingClientRect();
        var cx     = e.clientX - rect.left;
        var cy     = e.clientY - rect.top;
        var inside = cx >= 0 && cy >= 0 && cx <= rect.width && cy <= rect.height;

        if (inside) {
            var dvx = prevMouse ? cx - prevMouse.x : 0;
            var dvy = prevMouse ? cy - prevMouse.y : 0;
            var spd = Math.sqrt(dvx * dvx + dvy * dvy);

            mouseX = cx;
            mouseY = cy;

            if (prevMouse && spd > 2) {
                // Facing angle: maps butterfly's local -Y axis to movement direction.
                // Formula derived from: local (0,-1) after rotate(θ) → (sin θ, -cos θ) on screen.
                // We want (sin θ, -cos θ) = (dvx, dvy)/spd, so θ = atan2(dvx, -dvy).
                var targetAngle = Math.atan2(dvx, -dvy);
                var diff = targetAngle - facingAngle;
                while (diff >  Math.PI) diff -= Math.PI * 2;
                while (diff < -Math.PI) diff += Math.PI * 2;
                facingAngle += diff * 0.15;

                flapSpeed = Math.min(0.022, 0.008 + spd * 0.0012);

                if (spd > 3) spawnSparkles(cx, cy, spd, -dvx, -dvy);
            }

            prevMouse = { x: cx, y: cy };
            if (!isHovered) {
                isHovered = true;
                document.body.style.cursor = 'none';
            }
        } else {
            if (isHovered) {
                isHovered = false;
                prevMouse = null;
                flapSpeed = 0.008;
                document.body.style.cursor = '';
            }
        }
    }

    function onGlobalTouchMove(e) {
        var t      = e.touches[0];
        var rect   = heroZone.getBoundingClientRect();
        var cx     = t.clientX - rect.left;
        var cy     = t.clientY - rect.top;
        var inside = cx >= 0 && cy >= 0 && cx <= rect.width && cy <= rect.height;
        if (!inside) return;
        mouseX = cx;
        mouseY = cy;
        prevMouse = { x: cx, y: cy };
        isHovered = true;
    }

    document.addEventListener('mousemove', onGlobalMouseMove, { passive: true });
    document.addEventListener('touchmove', onGlobalTouchMove, { passive: true });
    document.addEventListener('touchend',  function () {
        if (isHovered) { isHovered = false; prevMouse = null; flapSpeed = 0.008; }
    });

    function spawnSparkles(x, y, spd, dvx, dvy) {
        var theme   = document.documentElement.getAttribute('data-theme') || 'dark';
        var palette = theme === 'light'
            ? ['219,39,119', '244,114,182', '253,186,216', '255,255,255']
            : ['159,123,255', '93,199,255',  '255,181,98',  '255,255,255'];
        var count = spd > 12 ? 3 : (spd > 5 ? 2 : 1);
        var baseAngle = (dvx || dvy) ? Math.atan2(dvy, dvx) : Math.random() * Math.PI * 2;
        for (var k = 0; k < count; k++) {
            var spread = (Math.random() - 0.5) * Math.PI * 1.4;
            var ps     = Math.random() * 1.2 + 0.4;
            sparkles.push({
                x:            x + (Math.random() - 0.5) * 8,
                y:            y + (Math.random() - 0.5) * 8,
                vx:           Math.cos(baseAngle + spread) * ps,
                vy:           Math.sin(baseAngle + spread) * ps - 0.3,
                size:         Math.random() * 2.5 + 1.5,
                color:        palette[Math.floor(Math.random() * palette.length)],
                alpha:        0.9,
                life:         0,
                maxLife:      700 + Math.random() * 500,
                rotation:     Math.random() * Math.PI * 2,
                rotSpeed:     (Math.random() - 0.5) * 0.08,
                twinklePhase: Math.random() * Math.PI * 2,
                twinkleSpeed: 0.003 + Math.random() * 0.004
            });
        }
    }

    function drawSparkle(x, y, size, color, alpha, rotation) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rotation);
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        for (var i = 0; i < 8; i++) {
            var r = i % 2 === 0 ? size : size * 0.22;
            var a = (i / 8) * Math.PI * 2 - Math.PI / 2;
            if (i === 0) ctx.moveTo(Math.cos(a) * r, Math.sin(a) * r);
            else ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
        }
        ctx.closePath();
        ctx.fillStyle = 'rgba(' + color + ',1)';
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.restore();
    }

    function drawSparkles(dt) {
        for (var i = sparkles.length - 1; i >= 0; i--) {
            var sp = sparkles[i];
            sp.life += dt;
            if (sp.life >= sp.maxLife) { sparkles.splice(i, 1); continue; }
            sp.x += sp.vx;
            sp.y += sp.vy;
            sp.vy -= 0.01;
            sp.rotation += sp.rotSpeed * dt;
            var lifeFrac = sp.life / sp.maxLife;
            var twinkle  = 0.7 + Math.sin(sp.twinklePhase + sp.life * sp.twinkleSpeed) * 0.3;
            var alpha    = (1 - lifeFrac) * 0.9 * twinkle;
            drawSparkle(sp.x, sp.y, sp.size * (1 - lifeFrac * 0.4), sp.color, alpha, sp.rotation);
        }
    }

    function drawButterfly(cx, cy, angle, flapPhase, alpha) {
        var cols    = getButterflyColor();
        var s       = 13;
        var cosFlap = Math.abs(Math.cos(flapPhase));

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.translate(cx, cy);
        ctx.rotate(angle);

        // Soft glow aura
        var glow = ctx.createRadialGradient(0, 0, 0, 0, 0, s * 2.2);
        glow.addColorStop(0,   'rgba(' + cols.glow + ',0.22)');
        glow.addColorStop(0.5, 'rgba(' + cols.glow + ',0.08)');
        glow.addColorStop(1,   'rgba(' + cols.glow + ',0)');
        ctx.beginPath();
        ctx.arc(0, 0, s * 2.2, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();

        // Wing scale simulates 3D flap: compress local X → 0 (folded) → 1 (open)
        ctx.save();
        ctx.scale(cosFlap, 1);

        // Upper wings — primary color
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo( s*0.2, -s*0.5,  s*1.0, -s*0.55,  s*0.85,  s*0.05);
        ctx.bezierCurveTo( s*0.6,  s*0.4,  s*0.1,  s*0.28,  0, 0);
        ctx.fillStyle = 'rgba(' + cols.wing1 + ',0.84)';
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(-s*0.2, -s*0.5, -s*1.0, -s*0.55, -s*0.85,  s*0.05);
        ctx.bezierCurveTo(-s*0.6,  s*0.4, -s*0.1,  s*0.28,  0, 0);
        ctx.fillStyle = 'rgba(' + cols.wing1 + ',0.84)';
        ctx.fill();

        // Lower wings — secondary color
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo( s*0.1,  s*0.15,  s*0.55,  s*0.65,  s*0.28,  s*0.55);
        ctx.bezierCurveTo( s*0.08, s*0.42,  0,        s*0.22,  0, 0);
        ctx.fillStyle = 'rgba(' + cols.wing2 + ',0.68)';
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(-s*0.1,  s*0.15, -s*0.55,  s*0.65, -s*0.28,  s*0.55);
        ctx.bezierCurveTo(-s*0.08, s*0.42,  0,        s*0.22,  0, 0);
        ctx.fillStyle = 'rgba(' + cols.wing2 + ',0.68)';
        ctx.fill();

        ctx.restore(); // remove wing scale

        // Body
        ctx.beginPath();
        ctx.ellipse(0, s * 0.05, 1.4, s * 0.28, 0, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,255,255,0.92)';
        ctx.fill();

        // Antennae
        ctx.beginPath();
        ctx.moveTo(0, -s * 0.05);
        ctx.quadraticCurveTo( s*0.12, -s*0.38,  s*0.18, -s*0.52);
        ctx.moveTo(0, -s * 0.05);
        ctx.quadraticCurveTo(-s*0.12, -s*0.38, -s*0.18, -s*0.52);
        ctx.strokeStyle = 'rgba(255,255,255,0.65)';
        ctx.lineWidth = 0.9;
        ctx.stroke();

        // Antenna tips
        ctx.beginPath();
        ctx.arc( s*0.18, -s*0.52, 1.3, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,255,255,0.85)';
        ctx.fill();
        ctx.beginPath();
        ctx.arc(-s*0.18, -s*0.52, 1.3, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,255,255,0.85)';
        ctx.fill();

        ctx.globalAlpha = 1;
        ctx.restore();
    }

    function debrisBurst(bx, by, color, baseAngle) {
        var count = Math.floor(Math.random() * 5) + 4;
        for (var j = 0; j < count; j++) {
            var angle = baseAngle + (Math.random() - 0.5) * Math.PI * 1.6;
            var speed = Math.random() * 2.0 + 0.5;
            var rng   = Math.random();
            sparkles.push({
                x:            bx + (Math.random() - 0.5) * 6,
                y:            by + (Math.random() - 0.5) * 6,
                vx:           Math.cos(angle) * speed,
                vy:           Math.sin(angle) * speed,
                size:         Math.random() * 2.2 + 1.2,
                color:        rng < 0.30 ? '255,255,255'
                                  : (rng < 0.65 ? color
                                  : AURORA_COLORS[Math.floor(Math.random() * AURORA_COLORS.length)]),
                alpha:        0.9,
                life:         0,
                maxLife:      600 + Math.random() * 500,
                rotation:     Math.random() * Math.PI * 2,
                rotSpeed:     (Math.random() - 0.5) * 0.06,
                twinklePhase: Math.random() * Math.PI * 2,
                twinkleSpeed: 0.002 + Math.random() * 0.003
            });
        }
    }

    function drawCometHead(cx, cy, color) {
        // Wide outer bloom
        var outerBloom = ctx.createRadialGradient(cx, cy, 0, cx, cy, 28);
        outerBloom.addColorStop(0,   'rgba(' + color + ',0.20)');
        outerBloom.addColorStop(0.4, 'rgba(' + color + ',0.06)');
        outerBloom.addColorStop(1,   'rgba(' + color + ',0)');
        ctx.beginPath();
        ctx.arc(cx, cy, 28, 0, Math.PI * 2);
        ctx.fillStyle = outerBloom;
        ctx.fill();

        // Mid bloom
        var bloom = ctx.createRadialGradient(cx, cy, 0, cx, cy, 12);
        bloom.addColorStop(0,   'rgba(' + color + ',0.50)');
        bloom.addColorStop(0.5, 'rgba(' + color + ',0.18)');
        bloom.addColorStop(1,   'rgba(' + color + ',0)');
        ctx.beginPath();
        ctx.arc(cx, cy, 12, 0, Math.PI * 2);
        ctx.fillStyle = bloom;
        ctx.fill();

        // White-hot core → colored aura
        var core = ctx.createRadialGradient(cx, cy, 0, cx, cy, 5);
        core.addColorStop(0,   'rgba(255,255,255,1)');
        core.addColorStop(0.4, 'rgba(' + color + ',0.90)');
        core.addColorStop(1,   'rgba(' + color + ',0)');
        ctx.beginPath();
        ctx.arc(cx, cy, 5, 0, Math.PI * 2);
        ctx.fillStyle = core;
        ctx.fill();
    }

    function draw(ts) {
        var dt = lastTs ? Math.min(ts - lastTs, 50) : 16;
        lastTs = ts;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Aurora background particles
        for (var i = 0; i < particles.length; i++) {
            var p = particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.alpha = p.baseAlpha + Math.sin(ts * p.speed + p.phase) * 0.04;
            p.alpha = Math.max(0.02, Math.min(0.19, p.alpha));
            if (p.y < -2) { particles[i] = makeParticle(false); continue; }
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(' + p.color + ',' + p.alpha + ')';
            ctx.fill();
        }

        if (isHovered) {
            // Butterfly + sparkle mode
            flapAngle += flapSpeed * dt;
            if (mouseX !== null) {
                if (butterflyX === null) { butterflyX = mouseX; butterflyY = mouseY; }
                butterflyX += (mouseX - butterflyX) * 0.25;
                butterflyY += (mouseY - butterflyY) * 0.25;
            }
            butterflyAlpha = Math.min(1, butterflyAlpha + dt * 0.006);
            drawSparkles(dt);
            if (butterflyX !== null) {
                var bob = Math.sin(ts * 0.0025) * 2.5;
                drawButterfly(butterflyX, butterflyY + bob, facingAngle, flapAngle, butterflyAlpha);
            }
        } else {
            // Slow idle flap continues during fade-out
            flapAngle += 0.007 * dt;
            drawSparkles(dt);
            if (butterflyAlpha > 0.01) {
                butterflyAlpha = Math.max(0, butterflyAlpha - dt * 0.004);
                if (butterflyX !== null) {
                    var bob = Math.sin(ts * 0.0025) * 2.5;
                    drawButterfly(butterflyX, butterflyY + bob, facingAngle, flapAngle, butterflyAlpha);
                }
            } else {
                // Background shooting stars when butterfly fully gone
                if (star === null) {
                    if (ts >= nextSpawn) spawnStar(ts);
                } else {
                    var progress = (ts - star.spawnTime) / star.duration;
                    if (progress >= 1) {
                        star      = null;
                        nextSpawn = ts + Math.random() * 6000 + 6000;
                    } else {
                        var headX = star.startX + progress * star.totalDist * star.dx;
                        var headY = star.startY + progress * star.totalDist * star.dy;
                        var tailX = headX - star.trailLen * star.dx;
                        var tailY = headY - star.trailLen * star.dy;
                        var grad  = ctx.createLinearGradient(tailX, tailY, headX, headY);
                        grad.addColorStop(0,    'rgba(' + star.color + ',0)');
                        grad.addColorStop(0.75, 'rgba(' + star.color + ',0.55)');
                        grad.addColorStop(1,    'rgba(' + star.color + ',0.95)');
                        ctx.beginPath();
                        ctx.moveTo(tailX, tailY);
                        ctx.lineTo(headX, headY);
                        ctx.lineCap = 'round';
                        // Wide soft glow
                        var gGlow = ctx.createLinearGradient(tailX, tailY, headX, headY);
                        gGlow.addColorStop(0, 'rgba(' + star.color + ',0)');
                        gGlow.addColorStop(1, 'rgba(' + star.color + ',0.12)');
                        ctx.strokeStyle = gGlow;
                        ctx.lineWidth   = 10;
                        ctx.stroke();
                        // Bright core
                        ctx.beginPath();
                        ctx.moveTo(tailX, tailY);
                        ctx.lineTo(headX, headY);
                        ctx.strokeStyle = grad;
                        ctx.lineWidth   = 2.5;
                        ctx.stroke();
                        // Head bloom
                        drawCometHead(headX, headY, star.color);
                        // Occasional sparkle debris trailing behind the star
                        if (Math.random() < 0.08) {
                            var starAngle = Math.atan2(star.dy, star.dx) + Math.PI;
                            debrisBurst(headX, headY, star.color, starAngle);
                        }
                    }
                }
            }
        }

        requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener('resize', resize, { passive: true });
    nextSpawn = performance.now() + Math.random() * 3000 + 2000;
    requestAnimationFrame(draw);
}

function initPhotoReel() {
    var viewport = document.querySelector('.photo-reel-viewport');
    var track    = document.getElementById('photo-reel-track');
    if (!viewport || !track) return;

    var reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var autoSpeed     = 0.4;
    var offset        = 0;
    var isPaused      = false;
    var isDragging    = false;
    var dragStartX    = 0;
    var dragOffsetAtStart = 0;
    var halfWidth     = 0;

    function measure() {
        halfWidth = track.scrollWidth / 2;
    }

    function applyTransform() {
        track.style.transform = 'translateX(' + (-offset) + 'px)';
    }

    function loop() {
        if (!isDragging && !isPaused && !reducedMotion) {
            offset += autoSpeed;
            if (halfWidth > 0 && offset >= halfWidth) {
                offset -= halfWidth;
            }
        }
        applyTransform();
        requestAnimationFrame(loop);
    }

    viewport.addEventListener('mouseenter', function () {
        isPaused = true;
    });

    viewport.addEventListener('mouseleave', function () {
        isPaused   = false;
        isDragging = false;
        viewport.classList.remove('is-dragging');
    });

    viewport.addEventListener('mousedown', function (e) {
        isDragging        = true;
        dragStartX        = e.clientX;
        dragOffsetAtStart = offset;
        viewport.classList.add('is-dragging');
        e.preventDefault();
    });

    document.addEventListener('mousemove', function (e) {
        if (!isDragging) return;
        var dx = e.clientX - dragStartX;
        offset = dragOffsetAtStart - dx;
        if (halfWidth > 0) {
            while (offset < 0)          { offset += halfWidth; }
            while (offset >= halfWidth) { offset -= halfWidth; }
        }
    }, { passive: true });

    document.addEventListener('mouseup', function () {
        if (!isDragging) return;
        isDragging = false;
        isPaused   = false;
        viewport.classList.remove('is-dragging');
    });

    var touchStartX        = 0;
    var touchOffsetAtStart = 0;

    viewport.addEventListener('touchstart', function (e) {
        isDragging         = true;
        isPaused           = true;
        touchStartX        = e.touches[0].clientX;
        touchOffsetAtStart = offset;
        viewport.classList.add('is-dragging');
    }, { passive: true });

    viewport.addEventListener('touchmove', function (e) {
        if (!isDragging) return;
        var dx = e.touches[0].clientX - touchStartX;
        offset = touchOffsetAtStart - dx;
        if (halfWidth > 0) {
            while (offset < 0)          { offset += halfWidth; }
            while (offset >= halfWidth) { offset -= halfWidth; }
        }
    }, { passive: true });

    viewport.addEventListener('touchend', function () {
        isDragging = false;
        isPaused   = false;
        viewport.classList.remove('is-dragging');
    }, { passive: true });

    window.addEventListener('resize', function () {
        measure();
    }, { passive: true });

    requestAnimationFrame(function () {
        measure();
        loop();
    });
}
