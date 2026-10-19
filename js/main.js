/* ========================================
   COSMIC PORTFOLIO — MAIN JAVASCRIPT
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================
       1. STARS / PARTICLES CANVAS
    ========================================== */
    const canvas = document.getElementById('stars-canvas');
    const ctx = canvas.getContext('2d');
    let stars = [];
    let shootingStars = [];
    let animFrameId;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function createStars(count = 200) {
        stars = [];
        for (let i = 0; i < count; i++) {
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: Math.random() * 1.5 + 0.3,
                opacity: Math.random() * 0.8 + 0.2,
                twinkleSpeed: Math.random() * 0.02 + 0.005,
                twinkleOffset: Math.random() * Math.PI * 2,
                vx: (Math.random() - 0.5) * 0.05,
                vy: (Math.random() - 0.5) * 0.05,
            });
        }
    }

    function createShootingStar() {
        if (shootingStars.length > 2) return;
        if (Math.random() > 0.005) return;

        shootingStars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height * 0.5,
            length: Math.random() * 80 + 40,
            speed: Math.random() * 8 + 4,
            angle: Math.PI / 4 + (Math.random() - 0.5) * 0.3,
            opacity: 1,
            decay: Math.random() * 0.02 + 0.01,
        });
    }

    function drawStars(time) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        const starColor = isDark ? '255, 255, 255' : '23, 23, 28';

        // Draw stars
        stars.forEach(star => {
            const twinkle = Math.sin(time * star.twinkleSpeed + star.twinkleOffset) * 0.5 + 0.5;
            const opacity = star.opacity * (0.4 + twinkle * 0.6);

            ctx.beginPath();
            ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${starColor}, ${opacity})`;
            ctx.fill();

            // Very subtle glow for larger stars
            if (star.radius > 1) {
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.radius * 3, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${starColor}, ${opacity * 0.08})`;
                ctx.fill();
            }

            // Subtle movement
            star.x += star.vx;
            star.y += star.vy;

            // Wrap around
            if (star.x < 0) star.x = canvas.width;
            if (star.x > canvas.width) star.x = 0;
            if (star.y < 0) star.y = canvas.height;
            if (star.y > canvas.height) star.y = 0;
        });

        // Draw shooting stars
        if (isDark) {
            createShootingStar();
            shootingStars = shootingStars.filter(ss => {
                ss.x += Math.cos(ss.angle) * ss.speed;
                ss.y += Math.sin(ss.angle) * ss.speed;
                ss.opacity -= ss.decay;

                if (ss.opacity <= 0) return false;

                const tailX = ss.x - Math.cos(ss.angle) * ss.length;
                const tailY = ss.y - Math.sin(ss.angle) * ss.length;

                const gradient = ctx.createLinearGradient(tailX, tailY, ss.x, ss.y);
                gradient.addColorStop(0, `rgba(255, 255, 255, 0)`);
                gradient.addColorStop(1, `rgba(255, 255, 255, ${ss.opacity})`);

                ctx.beginPath();
                ctx.moveTo(tailX, tailY);
                ctx.lineTo(ss.x, ss.y);
                ctx.strokeStyle = gradient;
                ctx.lineWidth = 1.5;
                ctx.stroke();

                return true;
            });
        }

        animFrameId = requestAnimationFrame(drawStars);
    }

    resizeCanvas();
    createStars();
    drawStars(0);

    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            resizeCanvas();
            createStars();
        }, 250);
    });


    /* ==========================================
       2. THEME TOGGLE
    ========================================== */
    const themeToggle = document.getElementById('theme-toggle');
    const html = document.documentElement;

    // Check saved theme
    const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
    html.setAttribute('data-theme', savedTheme);

    themeToggle.addEventListener('click', () => {
        const current = html.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        html.setAttribute('data-theme', next);
        localStorage.setItem('portfolio-theme', next);
    });


    /* ==========================================
       HERO: INTERACTIVE LETTERS & TYPEWRITER
    ========================================== */
    const charBoxes = document.querySelectorAll('.char-box');
    const folioTypewriter = document.getElementById('folio-typewriter');
    const folioBox = document.getElementById('hero-folio-box');

    // Interactive PORT Letter Boxes (Figma / Vector Bounding Box Hover Effect)
    charBoxes.forEach(box => {
        const charText = box.querySelector('.char-text');

        box.addEventListener('mouseenter', () => {
            box.classList.add('active-box');
        });

        box.addEventListener('mousemove', (e) => {
            const rect = box.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            
            if (charText) {
                charText.style.transform = `scale(1.08) translateY(-3px) rotate(${x * 8}deg)`;
            }
        });

        box.addEventListener('mouseleave', () => {
            box.classList.remove('active-box');
            if (charText) {
                charText.style.transform = '';
            }
        });

        box.addEventListener('click', () => {
            // Pulse on click
            box.style.transform = 'scale(0.95)';
            setTimeout(() => {
                box.style.transform = '';
            }, 150);
        });
    });

    // Folio Box Interactive Tilt
    if (folioBox) {
        folioBox.addEventListener('mousemove', (e) => {
            const rect = folioBox.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            folioBox.style.transform = `perspective(600px) rotateX(${y * -10}deg) rotateY(${x * 10}deg) rotate(-2deg) scale(1.04)`;
        });

        folioBox.addEventListener('mouseleave', () => {
            folioBox.style.transform = '';
        });
    }

    // Typewriter Animation for Folio Box (Exclusively types "Folio")
    if (folioTypewriter) {
        const targetWord = 'Folio';
        let charIndex = 0;
        let isDeleting = false;

        function typeLoop() {
            if (isDeleting) {
                charIndex--;
                folioTypewriter.textContent = targetWord.substring(0, charIndex);
            } else {
                charIndex++;
                folioTypewriter.textContent = targetWord.substring(0, charIndex);
            }

            let typeSpeed = isDeleting ? 80 : 150 + Math.random() * 40;

            if (!isDeleting && charIndex === targetWord.length) {
                // Fully typed "Folio" - hold and display for 3 seconds
                typeSpeed = 3000;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                // Finished deleting - brief pause before re-typing
                isDeleting = false;
                typeSpeed = 600;
            }

            setTimeout(typeLoop, typeSpeed);
        }

        // Start typewriter
        typeLoop();
    }


    /* ==========================================
       3. NAVIGATION
    ========================================== */
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');
    const navLinkElements = document.querySelectorAll('.nav-link');

    // Scroll effect
    let lastScrollY = 0;
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;

        if (scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScrollY = scrollY;
    }, { passive: true });

    // Hamburger toggle
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });

    // Close mobile menu on link click
    navLinkElements.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Active link on scroll
    const sections = document.querySelectorAll('section[id]');

    function updateActiveLink() {
        const scrollY = window.scrollY + window.innerHeight / 3;

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollY >= top && scrollY < top + height) {
                navLinkElements.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('data-section') === id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', updateActiveLink, { passive: true });

    /* ==========================================
       CV DOWNLOAD & TOAST NOTIFICATION
    ========================================== */
    function showToast(message) {
        let toast = document.getElementById('portfolio-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'portfolio-toast';
            toast.className = 'portfolio-toast';
            document.body.appendChild(toast);
        }
        toast.innerHTML = `<span style="font-size:1.15rem; flex-shrink:0;">📄</span> <span>${message}</span>`;
        toast.classList.add('show');
        clearTimeout(toast._timeout);
        toast._timeout = setTimeout(() => {
            toast.classList.remove('show');
        }, 3400);
    }

    const cvButtons = document.querySelectorAll('#nav-btn-cv, #btn-cv, .nav-link-cv');
    cvButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const href = btn.getAttribute('href');
            if (!href || href === '#' || href === '') {
                e.preventDefault();
                showToast('File CV sedang dipersiapkan.');
            } else {
                showToast('Mengunduh CV Zahrah Setia Rafaeyfa Assyla...');
            }
        });
    });

    /* ==========================================
       4. SCROLL ANIMATIONS
    ========================================== */
    const animatedElements = document.querySelectorAll('[data-animate]');

    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -60px 0px',
        threshold: 0.1,
    };

    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.getAttribute('data-delay') || 0;
                setTimeout(() => {
                    entry.target.classList.add('animated');
                }, parseInt(delay));
                animationObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach(el => animationObserver.observe(el));


    /* ==========================================
       5. PROJECT TABS + SUB-FILTERS
    ========================================== */
    const mainTabBtns = document.querySelectorAll('.main-tab-btn');
    const subFilterBtns = document.querySelectorAll('.sub-filter-btn');
    const subFiltersPanel = document.getElementById('project-sub-filters');
    const projectCards = document.querySelectorAll('.project-card');

    // Map: data-sub value → visible categories
    // project cards have data-category="project" data-sub="web|design|video"
    // cert cards have data-category="certificate"

    function showCards(tab, subFilter) {
        projectCards.forEach(card => {
            const cat = card.getAttribute('data-category');
            const sub = card.getAttribute('data-sub') || '';

            let visible = false;

            if (tab === 'certificate') {
                visible = (cat === 'certificate');
            } else {
                // tab === 'project'
                if (cat !== 'project') {
                    visible = false;
                } else if (subFilter === 'all-projects') {
                    const excludeAll = card.getAttribute('data-exclude-all') === 'true' || card.classList.contains('coming-soon-card');
                    visible = !excludeAll;
                } else {
                    visible = (sub === subFilter);
                }
            }

            if (visible) {
                card.classList.remove('hidden');
                card.style.animation = 'fadeInUp 0.5s var(--ease-out) forwards';
            } else {
                card.classList.add('hidden');
            }
        });
    }

    function setActiveTab(tab) {
        mainTabBtns.forEach(b => b.classList.toggle('active', b.getAttribute('data-tab') === tab));

        if (tab === 'project') {
            subFiltersPanel.classList.add('visible');
            // Get current active sub-filter
            const activeSubBtn = subFiltersPanel.querySelector('.sub-filter-btn.active');
            const sub = activeSubBtn ? activeSubBtn.getAttribute('data-sub-filter') : 'all-projects';
            showCards('project', sub);
        } else {
            subFiltersPanel.classList.remove('visible');
            showCards('certificate', null);
        }
    }

    mainTabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tab = btn.getAttribute('data-tab');
            setActiveTab(tab);
        });
    });

    subFilterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            subFilterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const sub = btn.getAttribute('data-sub-filter');
            showCards('project', sub);
        });
    });

    // Inject fadeInUp keyframe
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
    `;
    document.head.appendChild(style);

    // Initial state: Project tab active, sub-filter visible, show all projects
    setActiveTab('project');


    /* ==========================================
       6. CONTACT FORM
    ========================================== */
    const contactForm = document.getElementById('contact-form');

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalContent = submitBtn.innerHTML;

        // Simulate sending
        submitBtn.innerHTML = '<span>SENDING...</span>';
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.7';

        setTimeout(() => {
            submitBtn.innerHTML = '<span>MESSAGE SENT ✓</span>';
            submitBtn.style.opacity = '1';

            // Reset form
            contactForm.reset();

            setTimeout(() => {
                submitBtn.innerHTML = originalContent;
                submitBtn.disabled = false;
            }, 3000);
        }, 1500);
    });


    /* ==========================================
       7. MAGNETIC BUTTONS
    ========================================== */
    const magneticBtns = document.querySelectorAll('.magnetic-btn');

    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0, 0)';
        });
    });


    /* ==========================================
       8. PARALLAX EFFECT ON HERO
    ========================================== */
    const heroSection = document.querySelector('.hero');
    const heroPlanets = document.querySelectorAll('.hero-planet');
    const heroOrbitals = document.querySelectorAll('.hero-orbital');

    window.addEventListener('mousemove', (e) => {
        if (window.innerWidth < 768) return;

        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        const moveX = (e.clientX - centerX) / centerX;
        const moveY = (e.clientY - centerY) / centerY;

        heroPlanets.forEach((planet, i) => {
            const depth = (i + 1) * 10;
            planet.style.transform = `translate(${moveX * depth}px, ${moveY * depth}px)`;
        });
    });


    /* ==========================================
       9. SMOOTH SCROLL FOR ANCHORS
    ========================================== */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth',
                });
            }
        });
    });


    /* ==========================================
       10. HERO TITLE ANIMATION ON LOAD
    ========================================== */
    const heroTitle = document.querySelector('.hero-title');
    const heroElements = document.querySelectorAll('.hero-content [data-animate]');

    // Animate hero elements on load
    setTimeout(() => {
        heroElements.forEach((el, i) => {
            const delay = parseInt(el.getAttribute('data-delay') || 0);
            setTimeout(() => {
                el.classList.add('animated');
            }, delay + 300);
        });
    }, 200);


    /* ==========================================
       11. PDF VIEWER MODAL
    ========================================== */
    const pdfModal = document.getElementById('pdf-modal');
    const pdfViewerFrame = document.getElementById('pdf-viewer-frame');
    const pdfModalTitle = document.getElementById('pdf-modal-title');
    const pdfModalIssuer = document.getElementById('pdf-modal-issuer');
    const pdfModalDownload = document.getElementById('pdf-modal-download');
    const pdfModalOpenTab = document.getElementById('pdf-modal-open-tab') || document.getElementById('pdf-modal-newtab');
    const pdfModalClose = document.getElementById('pdf-modal-close');
    const pdfModalBackdrop = document.getElementById('pdf-modal-backdrop');

    function openPdfModal(pdfUrl, title, issuer) {
        if (!pdfModal || !pdfUrl) return;
        
        if (pdfViewerFrame) pdfViewerFrame.src = pdfUrl;
        if (pdfModalTitle) pdfModalTitle.textContent = title || 'Sertifikat';
        if (pdfModalIssuer) pdfModalIssuer.textContent = issuer || 'Verified Credential';
        if (pdfModalDownload) {
            pdfModalDownload.href = pdfUrl;
            pdfModalDownload.setAttribute('download', (title ? title.replace(/\s+/g, '_') : 'certificate') + '.pdf');
        }
        if (pdfModalOpenTab) {
            pdfModalOpenTab.href = pdfUrl;
        }

        pdfModal.classList.add('active');
        pdfModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closePdfModal() {
        if (!pdfModal) return;
        pdfModal.classList.remove('active');
        pdfModal.setAttribute('aria-hidden', 'true');
        if (pdfViewerFrame) pdfViewerFrame.src = '';
        document.body.style.overflow = '';
    }

    // Attach click handlers to all PDF open buttons
    document.querySelectorAll('.btn-open-pdf').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const pdfUrl = btn.getAttribute('data-pdf');
            const title = btn.getAttribute('data-title');
            const issuer = btn.getAttribute('data-issuer');
            openPdfModal(pdfUrl, title, issuer);
        });
    });

    // Also allow clicking the certificate or design card directly
    document.querySelectorAll('.cert-card, .design-pdf-card').forEach(card => {
        card.addEventListener('click', (e) => {
            // If already clicked an action button, let it handle
            if (e.target.closest('.btn-open-pdf')) return;
            const openBtn = card.querySelector('.btn-open-pdf');
            if (openBtn) {
                const pdfUrl = openBtn.getAttribute('data-pdf');
                const title = openBtn.getAttribute('data-title');
                const issuer = openBtn.getAttribute('data-issuer');
                openPdfModal(pdfUrl, title, issuer);
            }
        });
    });

    if (pdfModalClose) {
        pdfModalClose.addEventListener('click', closePdfModal);
    }
    if (pdfModalBackdrop) {
        pdfModalBackdrop.addEventListener('click', closePdfModal);
    }


    /* ==========================================
       11b. VIDEO VIEWER MODAL
    ========================================== */
    const videoModal = document.getElementById('video-modal');
    const videoPlayer = document.getElementById('portfolio-video-player');
    const videoModalTitle = document.getElementById('video-modal-title');
    const videoModalCategory = document.getElementById('video-modal-category');
    const videoModalDesc = document.getElementById('video-modal-desc');
    const videoModalTools = document.getElementById('video-modal-tools');
    const videoModalDownload = document.getElementById('video-modal-download');
    const videoModalClose = document.getElementById('video-modal-close');
    const videoModalBackdrop = document.getElementById('video-modal-backdrop');

    function openVideoModal({ videoUrl, title, category, desc, tools, poster }) {
        if (!videoModal || !videoUrl) return;

        if (videoPlayer) {
            videoPlayer.pause();
            videoPlayer.src = videoUrl;
            if (poster) {
                videoPlayer.poster = poster;
            }
            videoPlayer.load();
            const playPromise = videoPlayer.play();
            if (playPromise !== undefined) {
                playPromise.catch(() => {
                    // Browser autoplay policy might require manual user tap
                });
            }
        }

        if (videoModalTitle) videoModalTitle.textContent = title || 'Video Project';
        if (videoModalCategory) videoModalCategory.textContent = category || 'Video Editing';
        if (videoModalDesc) videoModalDesc.textContent = desc || '';
        if (videoModalDownload) {
            videoModalDownload.href = videoUrl;
            const ext = videoUrl.split('.').pop() || 'mp4';
            videoModalDownload.setAttribute('download', (title ? title.replace(/[^a-zA-Z0-9_-]/g, '_') : 'video') + '.' + ext);
        }

        if (videoModalTools) {
            videoModalTools.innerHTML = '';
            if (tools) {
                const toolList = Array.isArray(tools) ? tools : tools.split(',');
                toolList.forEach(t => {
                    const trimmed = t.trim();
                    if (trimmed) {
                        const pill = document.createElement('span');
                        pill.className = 'video-tool-pill';
                        pill.textContent = trimmed;
                        videoModalTools.appendChild(pill);
                    }
                });
            }
        }

        videoModal.classList.add('active');
        videoModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeVideoModal() {
        if (!videoModal) return;
        videoModal.classList.remove('active');
        videoModal.setAttribute('aria-hidden', 'true');
        if (videoPlayer) {
            videoPlayer.pause();
            videoPlayer.removeAttribute('src');
            videoPlayer.load();
        }
        document.body.style.overflow = '';
    }

    // Attach click handlers to all video open buttons and video cards
    document.querySelectorAll('.btn-open-video').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const card = btn.closest('.video-card') || btn;
            openVideoModal({
                videoUrl: btn.getAttribute('data-video') || card.getAttribute('data-video'),
                title: btn.getAttribute('data-title') || card.getAttribute('data-title'),
                category: btn.getAttribute('data-category-label') || card.getAttribute('data-category-label'),
                desc: btn.getAttribute('data-desc') || card.getAttribute('data-desc'),
                tools: btn.getAttribute('data-tools') || card.getAttribute('data-tools'),
                poster: btn.getAttribute('data-poster') || card.getAttribute('data-poster')
            });
        });
    });

    document.querySelectorAll('.video-card').forEach(card => {
        card.addEventListener('click', (e) => {
            if (e.target.closest('.btn-open-video')) return;
            openVideoModal({
                videoUrl: card.getAttribute('data-video'),
                title: card.getAttribute('data-title'),
                category: card.getAttribute('data-category-label'),
                desc: card.getAttribute('data-desc'),
                tools: card.getAttribute('data-tools'),
                poster: card.getAttribute('data-poster')
            });
        });
    });

    if (videoModalClose) {
        videoModalClose.addEventListener('click', closeVideoModal);
    }
    if (videoModalBackdrop) {
        videoModalBackdrop.addEventListener('click', closeVideoModal);
    }


    /* ==========================================
       12. TEXT COUNTER ANIMATION
    ========================================== */
    // For future use with statistics


    /* ==========================================
       13. HERO SCROLL INDICATOR FADE
    ========================================== */
    const scrollIndicator = document.querySelector('.hero-scroll-indicator');
    if (scrollIndicator) {
        window.addEventListener('scroll', () => {
            const opacity = Math.max(0, 1 - window.scrollY / 300);
            scrollIndicator.style.opacity = opacity;
        }, { passive: true });
    }


    /* ==========================================
       14. PRELOAD IMAGES
    ========================================== */
    const images = document.querySelectorAll('img[loading="lazy"]');
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                    }
                    imageObserver.unobserve(img);
                }
            });
        });
        images.forEach(img => imageObserver.observe(img));
    }


    /* ==========================================
       15. TILT EFFECT ON PROJECT CARDS
    ========================================== */
    const projectCardEls = document.querySelectorAll('.project-card');

    projectCardEls.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            if (window.innerWidth < 768) return;

            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const y = (e.clientY - rect.top) / rect.height;

            const tiltX = (y - 0.5) * 6;
            const tiltY = (x - 0.5) * -6;

            card.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-8px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateY(0)';
        });
    });


    /* ==========================================
       16. KEYBOARD ACCESSIBILITY
    ========================================== */
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (videoModal && videoModal.classList.contains('active')) {
                closeVideoModal();
                return;
            }
            if (pdfModal && pdfModal.classList.contains('active')) {
                closePdfModal();
                return;
            }
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        }
    });


    /* ==========================================
       17. WHAT I DO — TOOLS MARQUEE SHOWCASE
    ========================================== */
    const toolsData = {
        'graphic-design': [
            { name: 'Adobe Illustrator', color: '#FF9A00', glow: 'rgba(255, 154, 0, 0.35)', image: 'assets/logologo/adobe%20Ilustrator.png' },
            { name: 'CorelDRAW', color: '#00C261', glow: 'rgba(0, 194, 97, 0.35)', image: 'assets/logologo/corel%20draww.jpg' },
            { name: 'Canva', color: '#00C4CC', glow: 'rgba(0, 196, 204, 0.35)', image: 'assets/logologo/canva.jpg' },
            { name: 'Adobe Photoshop', color: '#31A8FF', glow: 'rgba(49, 168, 255, 0.35)', image: 'assets/logologo/adobe%20potoshop.png' }
        ],
        'web-development': [
            { name: 'React', color: '#61DAFB', glow: 'rgba(97, 218, 251, 0.35)', image: 'assets/logologo/react.png' },
            { name: 'HTML5', color: '#E34F26', glow: 'rgba(227, 79, 38, 0.35)', image: 'assets/logologo/html.png' },
            { name: 'CSS3', color: '#1572B6', glow: 'rgba(21, 114, 182, 0.35)', image: 'assets/logologo/css.png' },
            { name: 'JavaScript', color: '#F7DF1E', glow: 'rgba(247, 223, 30, 0.35)', image: 'assets/logologo/javascript.png' },
            { name: 'Laravel', color: '#FF2D20', glow: 'rgba(255, 45, 32, 0.35)', image: 'assets/logologo/laravel.png' },
            { name: 'MySQL', color: '#00758F', glow: 'rgba(0, 117, 143, 0.35)', image: 'assets/logologo/mysql.png' }
        ],
        'video-editor': [
            { name: 'CapCut', color: '#00E5FF', glow: 'rgba(0, 229, 255, 0.35)', image: 'assets/logologo/capcut.jpg' },
            { name: 'Adobe After Effects', color: '#CF96FD', glow: 'rgba(207, 150, 253, 0.35)', image: 'assets/logologo/after%20effect.jpg' },
            { name: 'Adobe Premiere Pro', color: '#EA77FF', glow: 'rgba(234, 119, 255, 0.35)', image: 'assets/logologo/adobe%20premier.png' }
        ]
    };

    const interestTags = document.querySelectorAll('.interest-tag[data-category]');
    const marqueeTrack = document.getElementById('tools-marquee-track');
    const toolsShowcase = document.getElementById('about-tools-showcase');

    function renderToolCards(category) {
        if (!toolsData[category] || !marqueeTrack) return;
        const items = toolsData[category];

        const repeatCount = Math.max(3, Math.ceil(12 / items.length));
        let halfHtml = '';
        for (let r = 0; r < repeatCount; r++) {
            items.forEach(tool => {
                halfHtml += `
                    <div class="marquee-tool-card" style="--tool-brand-color: ${tool.color}; --tool-glow: ${tool.glow};">
                        <div class="tool-icon-box">
                            <img src="${tool.image}" alt="${tool.name}" class="tool-logo-img" loading="lazy">
                        </div>
                        <span class="tool-name-text">${tool.name}</span>
                    </div>
                `;
            });
        }

        marqueeTrack.style.opacity = '0';
        setTimeout(() => {
            marqueeTrack.innerHTML = halfHtml + halfHtml;
            marqueeTrack.style.animation = 'none';
            marqueeTrack.offsetHeight; /* trigger reflow */
            marqueeTrack.style.animation = '';
            marqueeTrack.style.opacity = '1';
        }, 120);
    }

    function setActiveCategory(category, shouldScroll = false) {
        interestTags.forEach(tag => {
            tag.classList.toggle('active', tag.getAttribute('data-category') === category);
        });

        renderToolCards(category);

        if (shouldScroll && toolsShowcase) {
            const rect = toolsShowcase.getBoundingClientRect();
            if (rect.top < 60 || rect.bottom > window.innerHeight) {
                toolsShowcase.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        }
    }

    interestTags.forEach(tag => {
        tag.addEventListener('click', () => {
            const cat = tag.getAttribute('data-category');
            setActiveCategory(cat, true);
        });
    });

    if (marqueeTrack) {
        setActiveCategory('graphic-design', false);
    }

});
