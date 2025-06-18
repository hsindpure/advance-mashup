// Landing Page JavaScript
$(document).ready(function() {
    initializeLandingPage();
    initializeAnimations();
    initializeEventListeners();
});

function initializeLandingPage() {
    // Animate counter numbers
    animateCounters();
    
    // Initialize intersection observer for animations
    initializeScrollAnimations();
    
    // Add navbar scroll effect
    handleNavbarScroll();
}

function initializeEventListeners() {
    // Get Started buttons
    $('#getStartedBtn, #getStartedBtn2').click(function() {
        navigateToDashboard();
    });
    
    // Smooth scrolling for navigation links
    $('.nav-links a').click(function(e) {
        e.preventDefault();
        const target = $(this).attr('href');
        if (target.startsWith('#')) {
            smoothScrollTo(target);
        }
    });
    
    // Add loading state to CTA buttons
    $('.cta-button').click(function() {
        const button = $(this);
        const originalText = button.find('span').text();
        const icon = button.find('i');
        
        button.addClass('loading');
        button.find('span').text('Loading...');
        icon.removeClass().addClass('fas fa-spinner fa-spin');
        
        setTimeout(() => {
            button.removeClass('loading');
            button.find('span').text(originalText);
            icon.removeClass().addClass('fas fa-arrow-right');
        }, 1500);
    });
}

function navigateToDashboard() {
    // Add page transition effect
    $('body').addClass('page-transition');
    
    // Navigate to dashboard after animation
    setTimeout(() => {
        window.location.href = 'dashboard.html';
    }, 800);
}

function animateCounters() {
    $('.stat-number').each(function() {
        const $this = $(this);
        const target = parseInt($this.data('target'));
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            $this.text(Math.floor(current));
        }, 16);
    });
}

function initializeScrollAnimations() {
    // Create intersection observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                
                // Add animation class based on data attribute
                if (element.hasAttribute('data-aos')) {
                    element.classList.add('aos-animate');
                }
                
                // Trigger counter animation for stats section
                if (element.classList.contains('stats')) {
                    animateCounters();
                }
                
                // Trigger floating cards animation
                if (element.classList.contains('floating-elements')) {
                    triggerFloatingCards();
                }
            }
        });
    }, observerOptions);
    
    // Observe elements with animation attributes
    document.querySelectorAll('[data-aos]').forEach(el => observer.observe(el));
    document.querySelectorAll('.stats').forEach(el => observer.observe(el));
    document.querySelectorAll('.floating-elements').forEach(el => observer.observe(el));
}

function triggerFloatingCards() {
    $('.floating-card').each(function(index) {
        const card = $(this);
        setTimeout(() => {
            card.addClass('animate');
        }, index * 500);
    });
}

function handleNavbarScroll() {
    let lastScrollTop = 0;
    
    $(window).scroll(function() {
        const scrollTop = $(this).scrollTop();
        const navbar = $('.navbar');
        
        if (scrollTop > 100) {
            navbar.addClass('scrolled');
        } else {
            navbar.removeClass('scrolled');
        }
        
        // Hide/show navbar on scroll
        if (scrollTop > lastScrollTop && scrollTop > 200) {
            navbar.addClass('hidden');
        } else {
            navbar.removeClass('hidden');
        }
        
        lastScrollTop = scrollTop;
    });
}

function smoothScrollTo(target) {
    const targetElement = $(target);
    if (targetElement.length) {
        const offsetTop = targetElement.offset().top - 70; // Account for navbar height
        
        $('html, body').animate({
            scrollTop: offsetTop
        }, 800, 'easeInOutCubic');
    }
}

function initializeAnimations() {
    // Add staggered animation to feature items
    $('.hero-features .feature-item').each(function(index) {
        $(this).css('animation-delay', (0.6 + index * 0.1) + 's');
    });
    
    // Add hover effects to dashboard preview
    $('.dashboard-preview').hover(
        function() {
            $(this).addClass('hover-effect');
        },
        function() {
            $(this).removeClass('hover-effect');
        }
    );
    
    // Animate floating cards on hover
    $('.floating-card').hover(
        function() {
            $(this).addClass('hover');
        },
        function() {
            $(this).removeClass('hover');
        }
    );
    
    // Add parallax effect to background elements
    $(window).scroll(function() {
        const scrolled = $(window).scrollTop();
        const parallaxElements = $('.bg-pattern, .bg-gradient');
        
        parallaxElements.each(function() {
            const speed = 0.5;
            const yPos = -(scrolled * speed);
            $(this).css('transform', `translateY(${yPos}px)`);
        });
    });
}

// Add easing function for smooth scrolling
$.easing.easeInOutCubic = function(x, t, b, c, d) {
    if ((t /= d / 2) < 1) return c / 2 * t * t * t + b;
    return c / 2 * ((t -= 2) * t * t + 2) + b;
};

// Add page transition styles
const transitionStyles = `
<style>
.page-transition {
    animation: pageOut 0.8s ease-in-out forwards;
}

@keyframes pageOut {
    0% {
        opacity: 1;
        transform: scale(1);
    }
    100% {
        opacity: 0;
        transform: scale(0.95);
    }
}

.navbar.scrolled {
    background: rgba(255, 255, 255, 0.98);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.navbar.hidden {
    transform: translateY(-100%);
}

.dashboard-preview.hover-effect {
    transform: perspective(1000px) rotateY(0deg) rotateX(0deg) scale(1.02);
}

.floating-card.animate {
    opacity: 1;
    animation: floatIn 0.8s ease-out forwards, float 3s ease-in-out infinite 0.8s;
}

.floating-card.hover {
    transform: translateY(-5px) scale(1.05);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}

@keyframes floatIn {
    from {
        opacity: 0;
        transform: translateY(30px) scale(0.8);
    }
    to {
        opacity: 0.8;
        transform: translateY(0) scale(1);
    }
}

.cta-button.loading {
    pointer-events: none;
    opacity: 0.8;
}

.feature-card.aos-animate {
    opacity: 1;
    transform: translateY(0);
}

/* Enhanced hover effects */
.feature-card:hover .feature-icon {
    transform: scale(1.1);
    animation: none;
}

.showcase-item:hover {
    transform: scale(1.1) translateY(-5px);
}

/* Loading spinner animation */
@keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}

.fa-spin {
    animation: spin 1s infinite linear;
}
</style>
`;

// Inject transition styles
$('head').append(transitionStyles);

// Add performance optimization
$(window).on('load', function() {
    // Preload dashboard page for faster navigation
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = 'dashboard.html';
    document.head.appendChild(link);
    
    // Start animations after page load
    setTimeout(() => {
        $('.hero-visual').addClass('loaded');
        $('.floating-elements').addClass('loaded');
    }, 500);
});