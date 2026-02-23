/**
 * Nodo — Custom JS (child-classic theme)
 */

// Load Bebas Neue font for header nav (fires immediately, before DOM ready)
(function () {
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400&display=swap';
    document.head.appendChild(link);
})();

/**
 * Open a minimal full-screen image lightbox.
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
            'background:rgba(0,0,0,0.92)',
            'z-index:99999',
            'display:flex',
            'align-items:center',
            'justify-content:center',
            'cursor:zoom-out',
        ].join(';');

        var img = document.createElement('img');
        img.id = 'nodo-lightbox-img';
        img.style.cssText = 'max-width:90vw;max-height:90vh;object-fit:contain;';
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
 * When inside a quickview modal, clicking the image opens a lightbox
 * (because #product-modal does not exist outside the product detail page).
 * Safe to call multiple times — skips if already attached.
 */
function attachHoverZoom(coverContainer) {
    if (!coverContainer || coverContainer._nodoZoom) return;
    coverContainer._nodoZoom = true;

    var coverImg = coverContainer.querySelector('img');
    if (!coverImg) return;

    // Hover zoom: cursor-tracking scale
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

    // Click: inside a quickview modal #product-modal doesn't exist on the page,
    // so we open our own lightbox instead.
    var inQuickview = !!coverContainer.closest('.modal.quickview');
    if (inQuickview) {
        coverContainer.style.cursor = 'crosshair';
        coverContainer.addEventListener('click', function () {
            nodoLightboxOpen(coverImg.src);
        });
    }
}

document.addEventListener('DOMContentLoaded', function () {
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

    // Attach hover zoom to product detail page cover (static DOM)
    var detailCover = document.querySelector('.product-cover');
    attachHoverZoom(detailCover);

    // Bootstrap 4 fires 'shown.bs.modal' as a jQuery event — must use jQuery to catch it
    if (typeof $ !== 'undefined') {
        $(document).on('shown.bs.modal', function (e) {
            var modal = e.target;
            if (modal && modal.classList.contains('quickview')) {
                var qvCover = modal.querySelector('.product-cover');
                attachHoverZoom(qvCover);
            }
        });
    }
});
