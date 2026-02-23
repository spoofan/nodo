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
 * Attach cursor-tracking hover zoom to a .product-cover container.
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
    var detailCover = document.querySelector('.page-product .product-cover, #product .product-cover');
    if (!detailCover) detailCover = document.querySelector('.product-cover');
    attachHoverZoom(detailCover);

    // Attach hover zoom to quickview modals — they load after DOMContentLoaded
    // Bootstrap fires 'shown.bs.modal' once the modal is fully visible
    document.addEventListener('shown.bs.modal', function (e) {
        var modal = e.target;
        if (!modal) return;
        // quickview modals have class 'quickview'; product-modal is the zoom lightbox
        if (modal.classList.contains('quickview')) {
            var qvCover = modal.querySelector('.product-cover');
            attachHoverZoom(qvCover);
        }
    });
});
