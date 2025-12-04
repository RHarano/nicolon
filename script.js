/**
 * nicolon Sand Art - Main JavaScript
 * 動きのあるインタラクティブな体験を実現
 */

document.addEventListener('DOMContentLoaded', () => {
    // 初期化
    initLoader();
    initHeader();
    initHamburger();
    initSmoothScroll();
    initHeroSlider();
    initParticles();
    initCountUp();
    initScrollAnimations();
    initGalleryFilter();
    initContactParticles();
    initBackToTop();
});

/**
 * ヒーロー画像スライダー
 */
function initHeroSlider() {
    const slides = document.querySelectorAll('.hero-slide');
    if (slides.length === 0) return;

    let currentSlide = 0;
    const slideCount = slides.length;

    function nextSlide() {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slideCount;
        slides[currentSlide].classList.add('active');
    }

    // 5秒ごとにスライド切り替え
    setInterval(nextSlide, 5000);
}

/**
 * ローディングアニメーション
 */
function initLoader() {
    const loader = document.getElementById('loader');

    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.classList.add('hidden');
            document.body.classList.remove('loading');
        }, 1500);
    });

    // フォールバック: 3秒後に強制的に非表示
    setTimeout(() => {
        loader.classList.add('hidden');
        document.body.classList.remove('loading');
    }, 3000);
}

/**
 * ヘッダーのスクロール時の挙動
 */
function initHeader() {
    const header = document.getElementById('header');
    const navLinks = document.querySelectorAll('.nav-link');
    let lastScrollY = window.scrollY;
    let ticking = false;

    function updateHeader() {
        const scrollY = window.scrollY;

        // スクロール時にシャドウを追加
        if (scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // アクティブなナビゲーションリンクを更新
        updateActiveNavLink();

        lastScrollY = scrollY;
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateHeader);
            ticking = true;
        }
    });

    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollY = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
}

/**
 * ハンバーガーメニュー
 */
function initHamburger() {
    const hamburger = document.getElementById('hamburger');
    const nav = document.getElementById('nav');
    const navLinks = document.querySelectorAll('.nav-link');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        nav.classList.toggle('active');
    });

    // ナビゲーションリンクをクリックしたらメニューを閉じる
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            nav.classList.remove('active');
        });
    });

    // 外側をクリックしたらメニューを閉じる
    document.addEventListener('click', (e) => {
        if (!nav.contains(e.target) && !hamburger.contains(e.target)) {
            hamburger.classList.remove('active');
            nav.classList.remove('active');
        }
    });
}

/**
 * スムーススクロール
 */
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href === '#') return;

            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const headerHeight = document.getElementById('header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * フローティングパーティクル（ヒーローセクション）
 */
function initParticles() {
    const container = document.getElementById('particles');
    if (!container) return;

    const colors = [
        '#FF6B9D', // ピンク
        '#FFB347', // オレンジ
        '#F0E68C', // イエロー
        '#98D8AA', // グリーン
        '#87CEEB', // ブルー
        '#DDA0DD', // パープル
    ];

    const particleCount = 30;

    for (let i = 0; i < particleCount; i++) {
        createParticle(container, colors);
    }
}

function createParticle(container, colors) {
    const particle = document.createElement('div');
    const size = Math.random() * 10 + 5;
    const color = colors[Math.floor(Math.random() * colors.length)];

    particle.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: ${color};
        border-radius: 50%;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        opacity: ${Math.random() * 0.5 + 0.3};
        pointer-events: none;
        animation: floatParticle ${Math.random() * 10 + 10}s ease-in-out infinite;
        animation-delay: ${Math.random() * 5}s;
    `;

    container.appendChild(particle);
}

// パーティクルのアニメーション用CSSを動的に追加
const particleStyles = document.createElement('style');
particleStyles.textContent = `
    @keyframes floatParticle {
        0%, 100% {
            transform: translate(0, 0) rotate(0deg);
        }
        25% {
            transform: translate(${Math.random() * 50 - 25}px, ${Math.random() * 50 - 25}px) rotate(90deg);
        }
        50% {
            transform: translate(${Math.random() * 50 - 25}px, ${Math.random() * 50 - 25}px) rotate(180deg);
        }
        75% {
            transform: translate(${Math.random() * 50 - 25}px, ${Math.random() * 50 - 25}px) rotate(270deg);
        }
    }
`;
document.head.appendChild(particleStyles);

/**
 * 数字のカウントアップアニメーション
 */
function initCountUp() {
    const stats = document.querySelectorAll('.stat-number[data-target]');
    let animated = false;

    function animateCountUp() {
        stats.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'));
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;

            const updateCount = () => {
                current += step;
                if (current < target) {
                    stat.textContent = Math.floor(current).toLocaleString();
                    requestAnimationFrame(updateCount);
                } else {
                    stat.textContent = target.toLocaleString();
                }
            };

            updateCount();
        });
    }

    // Intersection Observerでスクロール時にアニメーション開始
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !animated) {
                animated = true;
                animateCountUp();
            }
        });
    }, { threshold: 0.5 });

    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) {
        observer.observe(heroStats);
    }
}

/**
 * スクロールアニメーション
 */
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll(
        '.animate-card, .animate-timeline, .animate-gallery'
    );

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    animatedElements.forEach(el => observer.observe(el));

    // セクションヘッダーのアニメーション
    const sectionHeaders = document.querySelectorAll('.section-header');
    const headerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.querySelectorAll('.animate-slide-in').forEach((el, i) => {
                    el.style.animationDelay = `${i * 0.1}s`;
                    el.style.animationPlayState = 'running';
                });
            }
        });
    }, { threshold: 0.3 });

    sectionHeaders.forEach(header => headerObserver.observe(header));
}

/**
 * ギャラリーフィルター
 */
function initGalleryFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // アクティブボタンの更新
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            // フィルタリング
            galleryItems.forEach(item => {
                const category = item.getAttribute('data-category');

                if (filter === 'all' || category === filter) {
                    item.style.display = 'block';
                    item.style.animation = 'scaleIn 0.4s ease forwards';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
}

/**
 * コンタクトセクションのパーティクル
 */
function initContactParticles() {
    const container = document.getElementById('contact-particles');
    if (!container) return;

    const colors = [
        'rgba(255, 107, 157, 0.3)',
        'rgba(255, 179, 71, 0.3)',
        'rgba(135, 206, 235, 0.3)',
        'rgba(152, 216, 170, 0.3)',
    ];

    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        const size = Math.random() * 100 + 50;
        const color = colors[Math.floor(Math.random() * colors.length)];

        particle.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: ${color};
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            filter: blur(40px);
            pointer-events: none;
            animation: floatSlow ${Math.random() * 20 + 20}s ease-in-out infinite;
            animation-delay: ${Math.random() * 10}s;
        `;

        container.appendChild(particle);
    }
}

// ゆっくり浮遊するアニメーション
const slowFloatStyles = document.createElement('style');
slowFloatStyles.textContent = `
    @keyframes floatSlow {
        0%, 100% {
            transform: translate(0, 0);
        }
        50% {
            transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px);
        }
    }
`;
document.head.appendChild(slowFloatStyles);

/**
 * マウス追従エフェクト（デスクトップのみ）
 */
if (window.matchMedia('(min-width: 768px)').matches) {
    const hero = document.querySelector('.hero');

    if (hero) {
        hero.addEventListener('mousemove', (e) => {
            const rect = hero.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;

            const content = hero.querySelector('.hero-content');
            if (content) {
                content.style.transform = `translate(${x * 10}px, ${y * 10}px)`;
            }
        });

        hero.addEventListener('mouseleave', () => {
            const content = hero.querySelector('.hero-content');
            if (content) {
                content.style.transform = 'translate(0, 0)';
                content.style.transition = 'transform 0.5s ease';
            }
        });
    }
}

/**
 * カーソルトレイルエフェクト（デスクトップのみ）
 */
if (window.matchMedia('(min-width: 768px)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const colors = ['#FF6B9D', '#FFB347', '#87CEEB', '#98D8AA', '#DDA0DD'];
    let colorIndex = 0;

    document.addEventListener('click', (e) => {
        createClickParticles(e.clientX, e.clientY);
    });

    function createClickParticles(x, y) {
        for (let i = 0; i < 8; i++) {
            const particle = document.createElement('div');
            const size = Math.random() * 10 + 5;
            const angle = (i / 8) * Math.PI * 2;
            const velocity = Math.random() * 50 + 30;

            particle.style.cssText = `
                position: fixed;
                width: ${size}px;
                height: ${size}px;
                background: ${colors[colorIndex % colors.length]};
                border-radius: 50%;
                left: ${x}px;
                top: ${y}px;
                pointer-events: none;
                z-index: 9999;
                animation: clickParticle 0.6s ease-out forwards;
                --tx: ${Math.cos(angle) * velocity}px;
                --ty: ${Math.sin(angle) * velocity}px;
            `;

            document.body.appendChild(particle);

            setTimeout(() => {
                particle.remove();
            }, 600);
        }
        colorIndex++;
    }
}

// クリックパーティクルのアニメーション
const clickStyles = document.createElement('style');
clickStyles.textContent = `
    @keyframes clickParticle {
        0% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
        }
        100% {
            transform: translate(calc(-50% + var(--tx)), calc(-50% + var(--ty))) scale(0);
            opacity: 0;
        }
    }
`;
document.head.appendChild(clickStyles);

/**
 * パフォーマンス最適化: デバウンス関数
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * ウィンドウリサイズ時の処理
 */
window.addEventListener('resize', debounce(() => {
    // 必要に応じてレイアウトを再計算
}, 200));

/**
 * ページ離脱時のアニメーション
 */
window.addEventListener('beforeunload', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.3s ease';
});

/**
 * トップに戻るボタン
 */
function initBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');
    if (!backToTopBtn) return;

    // スクロール位置に応じてボタンを表示/非表示
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });

    // クリックでトップにスクロール
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}
