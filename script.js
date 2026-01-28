/**
 * Portfolio Interactive Behaviors
 * Handles navigation, scroll effects, and animations
 */

// ================================
// UTILITY FUNCTIONS
// ================================

/**
 * Debounce function to limit function calls
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
 * Check if element is in viewport
 */
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

/**
 * Check if element is partially in viewport
 */
function isPartiallyInViewport(element, offset = 100) {
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    
    return (
        rect.top <= windowHeight - offset &&
        rect.bottom >= offset
    );
}

// ================================
// NAVIGATION
// ================================

/**
 * Handle navigation scroll behavior
 */
function initNavigation() {
    const nav = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Add scroll effect to navigation
    let lastScroll = 0;
    
    window.addEventListener('scroll', debounce(() => {
        const currentScroll = window.pageYOffset;
        
        // Add scrolled class for backdrop effect
        if (currentScroll > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    }, 10));
    
    // Smooth scroll for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            
            // Only handle hash links
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const navHeight = nav.offsetHeight;
                    const targetPosition = targetElement.offsetTop - navHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

// ================================
// SCROLL REVEAL ANIMATIONS
// ================================

/**
 * Reveal elements on scroll
 */
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal');
    
    function checkReveal() {
        revealElements.forEach(element => {
            if (isPartiallyInViewport(element, 100)) {
                element.classList.add('active');
            }
        });
    }
    
    // Initial check
    checkReveal();
    
    // Check on scroll
    window.addEventListener('scroll', debounce(checkReveal, 50));
}

/**
 * Add reveal classes to sections for scroll animations
 */
function setupRevealElements() {
    // Add reveal class to project cards
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.classList.add('reveal');
    });
    
    // Add reveal class to skill categories
    const skillCategories = document.querySelectorAll('.skill-category');
    skillCategories.forEach(category => {
        category.classList.add('reveal');
    });
    
    // Add reveal class to about highlights
    const highlights = document.querySelectorAll('.highlight-item');
    highlights.forEach(highlight => {
        highlight.classList.add('reveal');
    });
    
    // Add reveal class to contact links
    const contactLinks = document.querySelectorAll('.contact-link');
    contactLinks.forEach(link => {
        link.classList.add('reveal');
    });
}

// ================================
// PROJECT CARDS INTERACTION
// ================================

/**
 * Add subtle parallax effect to project cards
 */
function initProjectCardEffects() {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-8px)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
        
        // Optional: Add mouse move parallax effect
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 50;
            const rotateY = (centerX - x) / 50;
            
            card.style.transform = `
                translateY(-8px)
                rotateX(${rotateX}deg)
                rotateY(${rotateY}deg)
            `;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) rotateX(0) rotateY(0)';
        });
    });
}

// ================================
// HERO CODE WINDOW TYPING EFFECT
// ================================

/**
 * Subtle cursor blink effect for code window
 */
function initCodeWindowEffect() {
    const codeContent = document.querySelector('.code-content code');
    
    if (!codeContent) return;
    
    // Add cursor element
    const cursor = document.createElement('span');
    cursor.textContent = '|';
    cursor.style.cssText = `
        animation: blink 1s infinite;
        color: var(--color-accent);
        font-weight: 700;
    `;
    
    // Add blink animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes blink {
            0%, 50% { opacity: 1; }
            51%, 100% { opacity: 0; }
        }
    `;
    document.head.appendChild(style);
    
    // Append cursor after a delay
    setTimeout(() => {
        codeContent.appendChild(cursor);
    }, 1500);
}

// ================================
// SMOOTH SCROLL TO TOP
// ================================

/**
 * Add scroll to top functionality
 */
function initScrollToTop() {
    // Create scroll to top button (optional)
    const scrollBtn = document.createElement('button');
    scrollBtn.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 19V5M12 5L5 12M12 5L19 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    `;
    scrollBtn.className = 'scroll-to-top';
    scrollBtn.style.cssText = `
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        width: 48px;
        height: 48px;
        border-radius: 50%;
        background: var(--color-accent-gradient);
        color: white;
        border: none;
        box-shadow: var(--shadow-xl);
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all var(--transition-base);
        z-index: 999;
        display: flex;
        align-items: center;
        justify-content: center;
    `;
    
    document.body.appendChild(scrollBtn);
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', debounce(() => {
        if (window.pageYOffset > 500) {
            scrollBtn.style.opacity = '1';
            scrollBtn.style.visibility = 'visible';
        } else {
            scrollBtn.style.opacity = '0';
            scrollBtn.style.visibility = 'hidden';
        }
    }, 100));
    
    // Scroll to top on click
    scrollBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Hover effect
    scrollBtn.addEventListener('mouseenter', () => {
        scrollBtn.style.transform = 'translateY(-4px)';
        scrollBtn.style.boxShadow = '0 20px 40px -5px rgba(79, 70, 229, 0.4)';
    });
    
    scrollBtn.addEventListener('mouseleave', () => {
        scrollBtn.style.transform = 'translateY(0)';
        scrollBtn.style.boxShadow = 'var(--shadow-xl)';
    });
}

// ================================
// ACTIVE SECTION DETECTION
// ================================

/**
 * Update active navigation link based on scroll position
 */
function initActiveSectionDetection() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    function updateActiveLink() {
        const scrollPosition = window.pageYOffset + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    window.addEventListener('scroll', debounce(updateActiveLink, 50));
}

// ================================
// PERFORMANCE MONITORING
// ================================

/**
 * Log performance metrics (development only)
 */
function logPerformanceMetrics() {
    if ('performance' in window && 'getEntriesByType' in window.performance) {
        window.addEventListener('load', () => {
            const perfData = window.performance.timing;
            const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
            const connectTime = perfData.responseEnd - perfData.requestStart;
            const renderTime = perfData.domComplete - perfData.domLoading;
            
            console.log('%c⚡ Performance Metrics', 'color: #4f46e5; font-weight: bold; font-size: 14px;');
            console.log(`Page Load Time: ${pageLoadTime}ms`);
            console.log(`Server Connection Time: ${connectTime}ms`);
            console.log(`Render Time: ${renderTime}ms`);
        });
    }
}

// ================================
// ACCESSIBILITY ENHANCEMENTS
// ================================

/**
 * Add keyboard navigation support
 */
function initAccessibility() {
    // Add skip to main content link
    const skipLink = document.createElement('a');
    skipLink.href = '#hero';
    skipLink.className = 'skip-to-content';
    skipLink.textContent = 'Skip to main content';
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Trap focus in navigation when using keyboard
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                link.click();
            }
        });
    });
}

// ================================
// INITIALIZATION
// ================================

/**
 * Initialize all interactive features
 */
function init() {
    console.log('%c🚀 Portfolio Initialized', 'color: #4f46e5; font-weight: bold; font-size: 16px;');
    
    // Core functionality
    initNavigation();
    setupRevealElements();
    initScrollReveal();
    initProjectCardEffects();
    initCodeWindowEffect();
    initScrollToTop();
    initActiveSectionDetection();
    initAccessibility();
    
    // Development tools
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        logPerformanceMetrics();
    }
}

// Wait for DOM to be ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// ================================
// EXPORT FOR TESTING (optional)
// ================================

// Uncomment for module exports if needed
// export { init, debounce, isInViewport, isPartiallyInViewport };