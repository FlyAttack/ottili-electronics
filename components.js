// Theme Management
const themeToggle = document.getElementById('theme-toggle');
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

// Set initial theme
function setInitialTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
        themeToggle.checked = savedTheme === 'dark';
    } else {
        const systemTheme = prefersDarkScheme.matches ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', systemTheme);
        themeToggle.checked = systemTheme === 'dark';
    }
}

// Toggle theme
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    themeToggle.checked = newTheme === 'dark';
}

// Mobile Menu Toggle
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const mainNav = document.querySelector('.main-nav');

function toggleMobileMenu() {
    mainNav.classList.toggle('show');
    document.body.classList.toggle('menu-open');
}

// Back to Top Button
const backToTopButton = document.getElementById('back-to-top');

function toggleBackToTop() {
    if (window.scrollY > 300) {
        backToTopButton.classList.add('show');
    } else {
        backToTopButton.classList.remove('show');
    }
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Cookie Banner
const cookieBanner = document.getElementById('cookie-banner');

function showCookieBanner() {
    if (!localStorage.getItem('cookiesAccepted')) {
        cookieBanner.classList.add('show');
    }
}

function acceptCookies() {
    localStorage.setItem('cookiesAccepted', 'true');
    cookieBanner.classList.remove('show');
}

function showCookieSettings() {
    // Hier können Sie die Cookie-Einstellungen anzeigen
    console.log('Cookie-Einstellungen öffnen');
}

// Form Validation
const contactForm = document.getElementById('contact-form');

function validateForm(event) {
    event.preventDefault();
    
    const formData = new FormData(contactForm);
    let isValid = true;
    
    for (let [key, value] of formData.entries()) {
        if (!value) {
            isValid = false;
            const input = contactForm.querySelector(`[name="${key}"]`);
            input.classList.add('error');
        }
    }
    
    if (isValid) {
        // Hier können Sie den Formularversand implementieren
        console.log('Formular wird gesendet:', Object.fromEntries(formData));
        contactForm.reset();
    }
}

// Product Search and Filter
const productSearch = document.getElementById('product-search');
const conditionFilter = document.getElementById('condition-filter');
const sortFilter = document.getElementById('sort-filter');

function filterProducts() {
    const searchTerm = productSearch.value.toLowerCase();
    const condition = conditionFilter.value;
    const sortBy = sortFilter.value;
    
    // Hier können Sie die Produktfilterung implementieren
    console.log('Filter:', { searchTerm, condition, sortBy });
}

// Initialize all features
document.addEventListener('DOMContentLoaded', () => {
    // Theme
    setInitialTheme();
    themeToggle.addEventListener('change', toggleTheme);
    
    // Mobile Menu
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', toggleMobileMenu);
    }
    
    // Back to Top
    if (backToTopButton) {
        window.addEventListener('scroll', toggleBackToTop);
        backToTopButton.addEventListener('click', scrollToTop);
    }
    
    // Cookie Banner
    if (cookieBanner) {
        showCookieBanner();
    }
    
    // Form Validation
    if (contactForm) {
        contactForm.addEventListener('submit', validateForm);
        
        // Remove error class on input
        contactForm.querySelectorAll('input, textarea, select').forEach(input => {
            input.addEventListener('input', () => {
                input.classList.remove('error');
            });
        });
    }
    
    // Product Search and Filter
    if (productSearch && conditionFilter && sortFilter) {
        productSearch.addEventListener('input', filterProducts);
        conditionFilter.addEventListener('change', filterProducts);
        sortFilter.addEventListener('change', filterProducts);
    }
    
    // Smooth Scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});

// Sticky Header
window.addEventListener('scroll', function() {
    const header = document.querySelector('.main-header');
    if (header) {
        header.classList.toggle('sticky', window.scrollY > 0);
    }
}); 