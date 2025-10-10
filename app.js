// Aglio Restaurant Website JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Page Management
    initializePageManagement();
    
    // Mobile Menu Functionality
    initializeMobileMenu();
    
    // Navigation Active State
    initializeNavigation();
    
    // Header Scroll Effect
    initializeHeaderScrollEffect();
    
    // Smooth Scrolling - Initialize first to ensure it works
    initializeSmoothScrolling();
    
    // Scroll animations for sections
    initializeScrollAnimations();
    
    // Accessibility enhancements
    initializeAccessibility();
});

/**
 * Initialize page management for single-page application
 */
function initializePageManagement() {
    const homePageContent = document.getElementById('home-page');
    const menuPageContent = document.getElementById('menu-page');
    
    let currentPage = 'home';
    
    // Function to show a specific page
    function showPage(pageId) {
        if (pageId === 'home') {
            homePageContent.style.display = 'block';
            menuPageContent.style.display = 'none';
            currentPage = 'home';
            // Scroll to top when switching to home
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else if (pageId === 'menu') {
            homePageContent.style.display = 'none';
            menuPageContent.style.display = 'block';
            currentPage = 'menu';
            // Scroll to top when switching to menu
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        
        // Update navigation active states
        updateNavigationForPage(pageId);
    }
    
    // Function to update navigation active states
    function updateNavigationForPage(pageId) {
        const allNavLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
        
        allNavLinks.forEach(link => {
            link.classList.remove('nav-link--active');
            const linkPage = link.getAttribute('data-page');
            
            if (linkPage === pageId) {
                link.classList.add('nav-link--active');
            }
        });
    }
    
    // Add click handlers for navigation links and buttons
    const navigationElements = document.querySelectorAll('[data-page]');
    
    navigationElements.forEach(element => {
        element.addEventListener('click', function(e) {
            const targetPage = this.getAttribute('data-page');
            
            // Handle different types of elements
            if (this.tagName === 'A' && this.getAttribute('href').startsWith('#')) {
                // This is a section link within the home page
                if (targetPage === 'home') {
                    e.preventDefault();
                    showPage('home');
                    
                    // If there's a hash in the href, scroll to that section after a short delay
                    const href = this.getAttribute('href');
                    if (href !== '#' && href !== '') {
                        setTimeout(() => {
                            const targetElement = document.querySelector(href);
                            if (targetElement) {
                                const headerHeight = document.querySelector('.header').offsetHeight || 70;
                                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                                
                                window.scrollTo({
                                    top: Math.max(0, targetPosition),
                                    behavior: 'smooth'
                                });
                            }
                        }, 100);
                    }
                } else if (targetPage === 'menu') {
        e.preventDefault();
        showPage('menu');
            }
            } else {
                // This is a page navigation
                e.preventDefault();
                showPage(targetPage);
            }
            
            // Close mobile menu if open
            setTimeout(() => closeMobileMenu(), 100);
        });
    });
    
    // Make the function available globally for potential external use
    window.showPage = showPage;
    window.getCurrentPage = () => currentPage;
}

/**
 * Initialize mobile menu toggle functionality
 */
function initializeMobileMenu() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileNav = document.querySelector('.mobile-nav');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    
    if (!mobileMenuToggle || !mobileNav) return;
    
    // Toggle mobile menu
    mobileMenuToggle.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        toggleMobileMenu();
    });
    
    // Close mobile menu when clicking on a link
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', function() {
            // Small delay to allow page switching to start
            setTimeout(() => {
                closeMobileMenu();
            }, 100);
        });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        const isClickInsideMenu = mobileNav.contains(event.target);
        const isClickOnToggle = mobileMenuToggle.contains(event.target);
        
        if (!isClickInsideMenu && !isClickOnToggle && mobileNav.classList.contains('active')) {
            closeMobileMenu();
        }
    });
    
    // Close mobile menu on escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && mobileNav.classList.contains('active')) {
            closeMobileMenu();
        }
    });
}

/**
 * Toggle mobile menu open/close
 */
function toggleMobileMenu() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileNav = document.querySelector('.mobile-nav');
    
    if (!mobileMenuToggle || !mobileNav) return;
    
    const isActive = mobileNav.classList.contains('active');
    
    if (isActive) {
        closeMobileMenu();
    } else {
        openMobileMenu();
    }
}

/**
 * Open mobile menu
 */
function openMobileMenu() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileNav = document.querySelector('.mobile-nav');
    
    mobileMenuToggle.classList.add('active');
    mobileNav.classList.add('active');
    document.body.style.overflow = 'hidden';
}

/**
 * Close mobile menu
 */
function closeMobileMenu() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileNav = document.querySelector('.mobile-nav');
    
    mobileMenuToggle.classList.remove('active');
    mobileNav.classList.remove('active');
    document.body.style.overflow = '';
}

/**
 * Initialize navigation active state management for home page sections
 */
function initializeNavigation() {
    const homeNavLinks = document.querySelectorAll('[data-page="home"][href^="#"]');
    const sections = document.querySelectorAll('#home-page section[id]');
    
    // Update active navigation based on scroll position (only for home page)
    function updateActiveNavigation() {
        // Only update if we're on the home page
        if (window.getCurrentPage && window.getCurrentPage() !== 'home') return;
        
        let currentSection = 'home'; // Default to home
        const scrollPosition = window.scrollY + 150; // Offset for header
        
        // Check if we're at the top of the page (hero section)
        if (window.scrollY < 100) {
            currentSection = 'home';
        } else {
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                
                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    currentSection = section.getAttribute('id');
                }
            });
        }
        
        // Update active class on home page navigation links
        homeNavLinks.forEach(link => {
            link.classList.remove('nav-link--active');
            const href = link.getAttribute('href');
            
            if (href === `#${currentSection}` || (href === '#' && currentSection === 'home')) {
                link.classList.add('nav-link--active');
            }
        });
    }
    
    // Listen for scroll events with throttling (only for home page)
    window.addEventListener('scroll', throttle(updateActiveNavigation, 100));
    
    // Initial call
    updateActiveNavigation();
}

/**
 * Initialize header scroll effects
 */
function initializeHeaderScrollEffect() {
    const header = document.querySelector('.header');
    
    function handleHeaderScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add/remove scrolled class for styling
        if (scrollTop > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
    
    window.addEventListener('scroll', throttle(handleHeaderScroll, 10));
}

/**
 * Initialize smooth scrolling for navigation links (home page only)
 */
function initializeSmoothScrolling() {
    // This is handled by the page management system
    // Individual section scrolling is managed in initializePageManagement
}

/**
 * Initialize scroll animations using Intersection Observer
 */
function initializeScrollAnimations() {
    // Check if IntersectionObserver is supported
    if (!window.IntersectionObserver) return;
    
    // Create intersection observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                // Stop observing once animation is triggered
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Add animate-on-scroll class and observe elements
    const animateElements = document.querySelectorAll('.chef-profile, .chef-image-container, .menu-image-container, .contact-item, .menu-category');
    animateElements.forEach(element => {
        element.classList.add('animate-on-scroll');
        observer.observe(element);
    });
    
    // Add hover effects for image containers
    const imageContainers = document.querySelectorAll('.chef-image-container, .menu-image-container');
    imageContainers.forEach(container => {
        container.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        container.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

/**
 * Throttle function to limit function calls
 */
function throttle(func, wait) {
    let timeout;
    let previous = 0;
    
    return function executedFunction(...args) {
        const now = Date.now();
        
        if (now - previous > wait) {
            func.apply(this, args);
            previous = now;
        }
    };
}

/**
 * Debounce function to delay function calls
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
 * Handle window resize events
 */
window.addEventListener('resize', debounce(function() {
    // Close mobile menu on resize to larger screen
    if (window.innerWidth > 768) {
        closeMobileMenu();
    }
    
    // Recalculate scroll positions for navigation if on home page
    if (window.getCurrentPage && window.getCurrentPage() === 'home') {
        const homeNavLinks = document.querySelectorAll('[data-page="home"][href^="#"]');
        const sections = document.querySelectorAll('#home-page section[id]');
        
        // Update active navigation on resize
        setTimeout(() => {
            let currentSection = 'home';
            const scrollPosition = window.scrollY + 150;
            
            if (window.scrollY < 100) {
                currentSection = 'home';
            } else {
                sections.forEach(section => {
                    const sectionTop = section.offsetTop;
                    const sectionHeight = section.offsetHeight;
                    
                    if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                        currentSection = section.getAttribute('id');
                    }
                });
            }
            
            homeNavLinks.forEach(link => {
                link.classList.remove('nav-link--active');
                const href = link.getAttribute('href');
                
                if (href === `#${currentSection}` || (href === '#' && currentSection === 'home')) {
                    link.classList.add('nav-link--active');
                }
            });
        }, 100);
    }
}, 250));

/**
 * Add loading class removal after page load
 */
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
    
    // Trigger animations for elements already in view
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach((element, index) => {
        const rect = element.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        // If element is in view on load, trigger animations
        if (rect.top < windowHeight && rect.bottom > 0) {
            setTimeout(() => {
                element.classList.add('in-view');
            }, index * 100);
        }
    });
});

/**
 * Accessibility enhancements
 */
function initializeAccessibility() {
    // Focus management for mobile menu
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileNav = document.querySelector('.mobile-nav');
    
    if (!mobileMenuToggle || !mobileNav) return;
    
    // Improve keyboard navigation
    mobileMenuToggle.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleMobileMenu();
        }
    });
    
    // Trap focus in mobile menu when open
    function trapFocus(e) {
        if (!mobileNav.classList.contains('active')) return;
        
        const focusableElements = mobileNav.querySelectorAll(
            'a[href], button:not([disabled]), textarea:not([disabled]), input[type="text"]:not([disabled]), input[type="radio"]:not([disabled]), input[type="checkbox"]:not([disabled]), select:not([disabled])'
        );
        
        const firstFocusableElement = focusableElements[0];
        const lastFocusableElement = focusableElements[focusableElements.length - 1];
        
        if (e.key === 'Tab') {
            if (e.shiftKey) {
                if (document.activeElement === firstFocusableElement) {
                    lastFocusableElement.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === lastFocusableElement) {
                    firstFocusableElement.focus();
                    e.preventDefault();
                }
            }
        }
    }
    
    document.addEventListener('keydown', trapFocus);
    
    // Add keyboard navigation for image containers
    const imageContainers = document.querySelectorAll('.chef-image-container, .menu-image-container');
    imageContainers.forEach(container => {
        // Make containers focusable
        container.setAttribute('tabindex', '0');
        
        // Add focus styles
        container.addEventListener('focus', function() {
            this.style.outline = '3px solid var(--aglio-red-primary)';
            this.style.outlineOffset = '4px';
        });
        
        container.addEventListener('blur', function() {
            this.style.outline = 'none';
        });
        
        // Activate hover effects on keyboard focus
        container.addEventListener('focus', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        container.addEventListener('blur', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Add keyboard navigation for page switching
    const pageNavElements = document.querySelectorAll('[data-page]');
    pageNavElements.forEach(element => {
        if (element.tagName === 'BUTTON') {
            element.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.click();
                }
            });
        }
    });
}

/**
 * Handle hash changes in URL (for home page sections only)
 */
window.addEventListener('hashchange', function() {
    if (window.getCurrentPage && window.getCurrentPage() !== 'home') return;
    
    const hash = window.location.hash;
    if (hash) {
        const targetElement = document.querySelector('#home-page ' + hash);
        if (targetElement) {
            const headerHeight = document.querySelector('.header').offsetHeight || 70;
            const targetPosition = targetElement.offsetTop - headerHeight - 20;
            
            window.scrollTo({
                top: Math.max(0, targetPosition),
                behavior: 'smooth'
            });
        }
    }
});

// Handle initial page load with hash
window.addEventListener('load', function() {
    if (window.location.hash && window.getCurrentPage && window.getCurrentPage() === 'home') {
        // Small delay to ensure page is fully loaded
        setTimeout(() => {
            const hash = window.location.hash;
            const targetElement = document.querySelector('#home-page ' + hash);
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight || 70;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: Math.max(0, targetPosition),
                    behavior: 'smooth'
                });
            }
        }, 100);
    }
});

// Enhanced scroll performance with passive listeners
document.addEventListener('scroll', function() {
    // Any scroll-based functionality that doesn't need to prevent default
    requestAnimationFrame(() => {
        // Efficient scroll-based updates can go here
    });
}, { passive: true });

// Logo click handler to go to home
document.addEventListener('DOMContentLoaded', function() {
    const logo = document.querySelector('.header__logo img');
    if (logo) {
        logo.style.cursor = 'pointer';
        logo.addEventListener('click', function() {
            if (window.showPage) {
                window.showPage('home');
            }
        });
    }
});
