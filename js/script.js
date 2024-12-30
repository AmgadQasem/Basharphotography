document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initMobileMenu();
    initThemeToggle();
    initLanguageToggle();
    initSlider();
    initPortfolioFilter();
});

// Mobile Menu
function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const body = document.body;
    
    // Create overlay if it doesn't exist
    let overlay = document.querySelector('.nav-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'nav-overlay';
        body.appendChild(overlay);
    }

    function toggleMenu() {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
        overlay.classList.toggle('active');
        body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    }

    function closeMenu() {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
        overlay.classList.remove('active');
        body.style.overflow = '';
    }

    hamburger.addEventListener('click', toggleMenu);
    overlay.addEventListener('click', closeMenu);

    // Close menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // Close menu when screen is resized above mobile breakpoint
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            closeMenu();
        }
    });

    // Handle escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navLinks.classList.contains('active')) {
            closeMenu();
        }
    });

    // Prevent scrolling when menu is open
    navLinks.addEventListener('touchmove', (e) => {
        if (e.target.closest('.nav-links')) {
            e.stopPropagation();
        } else {
            e.preventDefault();
        }
    }, { passive: false });
}

// Theme Toggle
function initThemeToggle() {
    const themeRadios = document.querySelectorAll('.theme-toggle input[type="radio"]');
    
    // Check for saved theme preference or system preference
    const savedTheme = localStorage.getItem('theme') || 
                      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    
    // Set initial theme
    document.documentElement.setAttribute('data-theme', savedTheme);
    document.getElementById(savedTheme).checked = true;

    // Add change event listener to radio buttons
    themeRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            const newTheme = e.target.value;
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            
            // Trigger transition effect
            document.documentElement.style.transition = 'background-color 0.3s ease';
            setTimeout(() => {
                document.documentElement.style.transition = '';
            }, 300);
        });
    });

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (!localStorage.getItem('theme')) {
            const newTheme = e.matches ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', newTheme);
            document.getElementById(newTheme).checked = true;
        }
    });
}

// Language Toggle
function initLanguageToggle() {
    const languageRadios = document.querySelectorAll('.language-toggle input[type="radio"]');
    
    // Check for saved language preference
    const savedLanguage = localStorage.getItem('language') || 'en';
    document.getElementById(savedLanguage).checked = true;

    // Add change event listener to radio buttons
    languageRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            const newLanguage = e.target.value;
            localStorage.setItem('language', newLanguage);
            changeLanguage(newLanguage);
        });
    });
}

// Image Slider
function initSlider() {
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.querySelector('.slider-btn.prev');
    const nextBtn = document.querySelector('.slider-btn.next');
    let currentSlide = 0;
    let slideInterval;

    function showSlide(n) {
        // Remove active class and add prev class for animation
        slides.forEach(slide => {
            slide.classList.remove('active', 'prev');
            slide.style.zIndex = 0;
        });

        // Calculate the index
        currentSlide = (n + slides.length) % slides.length;
        const prevSlide = ((currentSlide - 1) + slides.length) % slides.length;

        // Add prev class to the previous slide
        slides[prevSlide].classList.add('prev');

        // Add active class to current slide
        slides[currentSlide].classList.add('active');
        slides[currentSlide].style.zIndex = 1;
    }

    function nextSlide() {
        showSlide(currentSlide + 1);
    }

    function prevSlide() {
        showSlide(currentSlide - 1);
    }

    // Start automatic slideshow
    function startSlideshow() {
        slideInterval = setInterval(nextSlide, 5000);
    }

    // Stop automatic slideshow
    function stopSlideshow() {
        clearInterval(slideInterval);
    }

    // Event Listeners
    prevBtn.addEventListener('click', () => {
        prevSlide();
        stopSlideshow();
        startSlideshow();
    });

    nextBtn.addEventListener('click', () => {
        nextSlide();
        stopSlideshow();
        startSlideshow();
    });

    // Pause slideshow on hover
    const slider = document.querySelector('.slider');
    slider.addEventListener('mouseenter', stopSlideshow);
    slider.addEventListener('mouseleave', startSlideshow);

    // Touch events for mobile
    let touchStartX = 0;
    let touchEndX = 0;

    slider.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        stopSlideshow();
    });

    slider.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
        startSlideshow();
    });

    function handleSwipe() {
        const swipeThreshold = 50;
        const difference = touchStartX - touchEndX;

        if (Math.abs(difference) > swipeThreshold) {
            if (difference > 0) {
                nextSlide(); // Swipe left
            } else {
                prevSlide(); // Swipe right
            }
        }
    }

    // Initialize
    showSlide(0);
    startSlideshow();
}

// Language translations
const translations = {
    en: {
        home: "Home",
        portfolio: "Portfolio",
        about: "About",
        contact: "Contact",
        // First slide
        heroTitle1: "Capturing Life's Beautiful Moments",
        heroSubtitle1: "Professional Photography Services",
        viewWork: "View My Work",
        // Second slide
        heroTitle2: "Creating Timeless Memories",
        heroSubtitle2: "Expert Photography Solutions",
        contactMe: "Contact Me",
        // Contact form
        contactTitle: "Get in Touch",
        yourName: "Your Name",
        yourEmail: "Your Email",
        yourMessage: "Your Message",
        sendMessage: "Send Message",
        // Portfolio section
        portfolioTitle: "My Portfolio",
        allCategories: "All",
        natureCategory: "Nature",
        portraitCategory: "Portrait",
        weddingCategory: "Wedding",
        viewProject: "View Project",
        // Portfolio items
        landscapePhoto: "Landscape Photography",
        professionalPortraits: "Professional Portraits",
        weddingCeremonies: "Wedding Ceremonies",
        wildlifeNature: "Nature Photography",
        
        // About section
        aboutTitle: "About Me",
        photographerTitle: "Professional Photographer",
        aboutText: "With over 10 years of experience capturing life's most precious moments, I specialize in nature, portrait, and wedding photography. My passion is to tell stories through my lens and create lasting memories for my clients.",
        // Stats
        photoSessions: "Photo Sessions",
        happyClients: "Happy Clients",
        awardsWon: "Awards Won"
    },
    ar: {
        home: "الرئيسية",
        portfolio: "معرض الأعمال",
        about: "من نحن",
        contact: "اتصل بنا",
        // First slide
        heroTitle1: "نلتقط أجمل لحظات الحياة",
        heroSubtitle1: "خدمات تصوير احترافية",
        viewWork: "شاهد أعمالنا",
        // Second slide
        heroTitle2: "نخلق ذكريات خالدة",
        heroSubtitle2: "حلول التصوير المتخصصة",
        contactMe: "تواصل معنا",
        // Contact form
        contactTitle: "تواصل معنا",
        yourName: "الاسم",
        yourEmail: "البريد الإلكتروني",
        yourMessage: "رسالتك",
        sendMessage: "إرسال",
        // Portfolio section
        portfolioTitle: "معرض أعمالي",
        allCategories: "الكل",
        natureCategory: "الطبيعة",
        portraitCategory: "البورتريه",
        weddingCategory: "الأعراس",
        viewProject: "عرض المشروع",
        // Portfolio items
        landscapePhoto: "تصوير المناظر الطبيعية",
        professionalPortraits: "صور شخصية احترافية",
        weddingCeremonies: "حفلات الزفاف",
        wildlifeNature: "تصوير الطبيعة",
        
        // About section
        aboutTitle: "من أنا",
        photographerTitle: "مصور محترف",
        aboutText: "مع أكثر من 10 سنوات من الخبرة في التقاط أجمل لحظات الحياة، أتخصص في تصوير الطبيعة والبورتريه والأعراس. شغفي هو رواية القصص من خلال عدستي وخلق ذكريات دائمة لعملائي.",
        // Stats
        photoSessions: "جلسة تصوير",
        happyClients: "عميل سعيد",
        awardsWon: "جائزة"
    }
};

function changeLanguage(lang) {
    // Update navigation
    document.querySelector('.nav-links a[href="#home"]').textContent = translations[lang].home;
    document.querySelector('.nav-links a[href="#portfolio"]').textContent = translations[lang].portfolio;
    document.querySelector('.nav-links a[href="#about"]').textContent = translations[lang].about;
    document.querySelector('.nav-links a[href="#contact"]').textContent = translations[lang].contact;
    
    // Update first slide
    const firstSlide = document.querySelector('.slide:first-child .slide-content');
    firstSlide.querySelector('h1').textContent = translations[lang].heroTitle1;
    firstSlide.querySelector('p').textContent = translations[lang].heroSubtitle1;
    firstSlide.querySelector('.cta-button').textContent = translations[lang].viewWork;
    
    // Update second slide
    const secondSlide = document.querySelector('.slide:nth-child(2) .slide-content');
    secondSlide.querySelector('h1').textContent = translations[lang].heroTitle2;
    secondSlide.querySelector('p').textContent = translations[lang].heroSubtitle2;
    secondSlide.querySelector('.cta-button').textContent = translations[lang].contactMe;
    
    // Update contact form
    document.querySelector('#contact h2').textContent = translations[lang].contactTitle;
    document.querySelector('input[type="text"]').placeholder = translations[lang].yourName;
    document.querySelector('input[type="email"]').placeholder = translations[lang].yourEmail;
    document.querySelector('textarea').placeholder = translations[lang].yourMessage;
    document.querySelector('button[type="submit"]').textContent = translations[lang].sendMessage;
    
    // Update HTML lang attribute and direction
    document.documentElement.lang = lang;
    document.body.style.direction = lang === 'ar' ? 'rtl' : 'ltr';

    // Update Portfolio section
    document.querySelector('#portfolio h2').textContent = translations[lang].portfolioTitle;
    document.querySelectorAll('.category-btn').forEach(btn => {
        const category = btn.dataset.category;
        switch(category) {
            case 'all':
                btn.textContent = translations[lang].allCategories;
                break;
            case 'nature':
                btn.textContent = translations[lang].natureCategory;
                break;
            case 'portrait':
                btn.textContent = translations[lang].portraitCategory;
                break;
            case 'wedding':
                btn.textContent = translations[lang].weddingCategory;
                break;
        }
    });

    // Update portfolio items
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    portfolioItems.forEach(item => {
        const category = item.dataset.category;
        const overlay = item.querySelector('.overlay');
        switch(category) {
            case 'nature':
                if (overlay.querySelector('h3').textContent === 'Nature') {
                    overlay.querySelector('p').textContent = translations[lang].landscapePhoto;
                } else {
                    overlay.querySelector('p').textContent = translations[lang].wildlifeNature;
                }
                break;
            case 'portrait':
                overlay.querySelector('p').textContent = translations[lang].professionalPortraits;
                break;
            case 'wedding':
                overlay.querySelector('p').textContent = translations[lang].weddingCeremonies;
                break;
        }
        overlay.querySelector('.view-project').textContent = translations[lang].viewProject;
    });

    // Update About section
    document.querySelector('#about h2').textContent = translations[lang].aboutTitle;
    document.querySelector('.about-text h3').textContent = translations[lang].photographerTitle;
    document.querySelector('.about-text p').textContent = translations[lang].aboutText;
    
    // Update stats
    const stats = document.querySelectorAll('.stat .label');
    stats[0].textContent = translations[lang].photoSessions;
    stats[1].textContent = translations[lang].happyClients;
    stats[2].textContent = translations[lang].awardsWon;
}

// Portfolio filter
function initPortfolioFilter() {
    const categoryBtns = document.querySelectorAll('.category-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            categoryBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');

            const category = btn.dataset.category;

            portfolioItems.forEach(item => {
                if (category === 'all' || item.dataset.category === category) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 0);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// Mobile Menu
function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const body = document.body;

    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
        
        // Toggle body scroll
        if (navLinks.classList.contains('active')) {
            body.style.overflow = 'hidden';
        } else {
            body.style.overflow = '';
        }
    });

    // Close menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            body.style.overflow = '';
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navLinks.contains(e.target) && !hamburger.contains(e.target)) {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            body.style.overflow = '';
        }
    });
}
