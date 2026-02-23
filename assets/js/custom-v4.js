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

    // Product image hover zoom — cursor-tracking scale on .product-cover
    var coverContainer = document.querySelector('.product-cover');
    if (coverContainer) {
        var coverImg = coverContainer.querySelector('img');
        var layer = coverContainer.querySelector('.layer');

        // Hide the click-to-modal overlay; hover zoom replaces it
        if (layer) {
            layer.style.display = 'none';
        }

        if (coverImg) {
            coverContainer.addEventListener('mousemove', function (e) {
                var rect = coverContainer.getBoundingClientRect();
                var x = ((e.clientX - rect.left) / rect.width) * 100;
                var y = ((e.clientY - rect.top) / rect.height) * 100;
                coverImg.style.transformOrigin = x + '% ' + y + '%';
                coverImg.style.transform = 'scale(2.2)';
            });

            coverContainer.addEventListener('mouseleave', function () {
                coverImg.style.transform = 'scale(1)';
                coverImg.style.transformOrigin = 'center center';
            });
        }
    }
});
