/**
 * Nodo — Custom JS (child-classic theme)
 * v8 — Refined Luxury edition
 */

// Load Playfair Display + Playfair Display SC + Inter fonts (fires immediately)
(function () {
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Playfair+Display+SC:wght@400;700&family=Inter:wght@300;400;500;600&display=swap';
    document.head.appendChild(link);
})();

/**
 * Open a minimal full-screen image lightbox (dark luxury style).
 */
function nodoLightboxOpen(src) {
    var overlay = document.getElementById('nodo-lightbox');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'nodo-lightbox';
        overlay.style.cssText = [
            'position:fixed',
            'top:0', 'left:0',
            'width:100%', 'height:100%',
            'background:rgba(10,10,10,0.95)',
            'z-index:99999',
            'display:flex',
            'align-items:center',
            'justify-content:center',
            'cursor:zoom-out',
            'backdrop-filter:blur(4px)',
        ].join(';');

        var img = document.createElement('img');
        img.id = 'nodo-lightbox-img';
        img.style.cssText = 'max-width:90vw;max-height:90vh;object-fit:contain;border:1px solid rgba(196,162,101,0.2);';
        overlay.appendChild(img);

        overlay.addEventListener('click', function () {
            overlay.style.display = 'none';
        });
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') overlay.style.display = 'none';
        });
        document.body.appendChild(overlay);
    }
    document.getElementById('nodo-lightbox-img').src = src;
    overlay.style.display = 'flex';
}

/**
 * Attach cursor-tracking hover zoom to a .product-cover container.
 * When inside a quickview modal, clicking opens lightbox.
 * Safe to call multiple times — skips if already attached.
 */
function attachHoverZoom(coverContainer) {
    if (!coverContainer || coverContainer._nodoZoom) return;
    coverContainer._nodoZoom = true;

    var coverImg = coverContainer.querySelector('img');
    if (!coverImg) return;

    coverContainer.addEventListener('mousemove', function (e) {
        var rect = coverContainer.getBoundingClientRect();
        var x = ((e.clientX - rect.left) / rect.width) * 100;
        var y = ((e.clientY - rect.top) / rect.height) * 100;
        coverImg.style.transition = 'none';
        coverImg.style.transformOrigin = x + '% ' + y + '%';
        coverImg.style.transform = 'scale(2.2)';
    });

    coverContainer.addEventListener('mouseleave', function () {
        coverImg.style.transition = 'transform 0.3s ease';
        coverImg.style.transform = 'scale(1)';
        coverImg.style.transformOrigin = 'center center';
    });

    // Click inside quickview → open lightbox
    var inQuickview = !!coverContainer.closest('.modal.quickview');
    if (inQuickview) {
        coverContainer.style.cursor = 'crosshair';
        coverContainer.addEventListener('click', function () {
            nodoLightboxOpen(coverImg.src);
        });
    }
}

/**
 * IntersectionObserver-based scroll reveal.
 * Adds .nodo-reveal to target elements, then .nodo-revealed when they enter viewport.
 */
function initScrollReveal() {
    // Skip on mobile (CSS disables the effect anyway)
    if (window.innerWidth <= 768) return;
    if (!window.IntersectionObserver) return;

    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('nodo-revealed');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.08,
        rootMargin: '0px 0px -40px 0px'
    });

    // Observe product miniatures
    document.querySelectorAll('.product-miniature').forEach(function (el, i) {
        el.classList.add('nodo-reveal');
        // Stagger delay via inline style (overrides nth-child in CSS)
        el.style.transitionDelay = Math.min(i * 0.07, 0.56) + 's';
        observer.observe(el);
    });

    // Observe section headings and CTA banners
    document.querySelectorAll(
        '.products-section-title, .cta-banner, .category-tile, #left-column'
    ).forEach(function (el) {
        el.classList.add('nodo-reveal');
        observer.observe(el);
    });
}

document.addEventListener('DOMContentLoaded', function () {
    // Page load fade-in
    document.body.classList.add('nodo-loaded');

    // Smooth scroll for anchor links (exclude carousel controls)
    document.querySelectorAll('a[href^="#"]:not(.carousel-control)').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            var target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Prevent carousel control links from scrolling the page
    document.querySelectorAll('.carousel-control').forEach(function (ctrl) {
        ctrl.addEventListener('click', function (e) {
            e.preventDefault();
        });
    });

    // Sticky header scroll effect — adds .scrolled class after 20px
    var header = document.getElementById('header');
    if (header) {
        window.addEventListener('scroll', function () {
            header.classList.toggle('scrolled', window.scrollY > 20);
        }, { passive: true });
    }

    // Attach hover zoom to product detail page cover
    var detailCover = document.querySelector('.product-cover');
    attachHoverZoom(detailCover);

    // Bootstrap 4 fires 'shown.bs.modal' as jQuery event
    if (typeof $ !== 'undefined') {
        $(document).on('shown.bs.modal', function (e) {
            var modal = e.target;
            if (modal && modal.classList.contains('quickview')) {
                var qvCover = modal.querySelector('.product-cover');
                attachHoverZoom(qvCover);
            }
        });
    }

    // Initialize scroll-reveal animations
    initScrollReveal();
});
