/* T'NOIR TAROT — behaviour
   - Booking form opens a pre-filled email to tnoirtarot@gmail.com (mailto, no backend needed)
   - Each reading's "Request this reading" pre-selects that package in the form
   - Small mobile nav toggle
   - Hero spotlight follows the cursor on devices that support hover, unless the
     visitor has asked their system to reduce motion
*/

function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

document.addEventListener('DOMContentLoaded', () => {

    // Footer year
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // Reading CTA -> pre-fill and scroll to the booking form
    const packageSelect = document.getElementById('package');
    const nameField = document.getElementById('name');
    const bookSection = document.getElementById('book');

    document.querySelectorAll('.reading-cta').forEach((btn) => {
        btn.addEventListener('click', () => {
            const pkg = btn.getAttribute('data-package');
            if (packageSelect && pkg) packageSelect.value = pkg;
            if (bookSection) {
                bookSection.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
            }
            if (nameField) window.setTimeout(() => nameField.focus(), 400);
        });
    });

    // Booking form -> mailto
    const form = document.getElementById('bookingForm');
    if (form) {
        form.addEventListener('submit', (event) => {
            event.preventDefault();

            const name = form.name.value.trim();
            const email = form.email.value.trim();
            const pkg = form.package.value;
            const date = form.date.value.trim();
            const message = form.message.value.trim();

            const subject = `Booking request — ${pkg || 'Reading'}`;
            const bodyLines = [
                `Name: ${name}`,
                `Email: ${email}`,
                `Reading: ${pkg}`,
                date ? `Preferred date: ${date}` : null,
                '',
                message || 'No additional notes.',
            ].filter((line) => line !== null);

            const mailto = `mailto:tnoirtarot@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyLines.join('\n'))}`;
            window.location.href = mailto;
        });
    }

    // Mobile nav toggle
    const navToggle = document.getElementById('navToggle');
    const siteNav = document.getElementById('siteNav');
    if (navToggle && siteNav) {
        navToggle.addEventListener('click', () => {
            const isOpen = siteNav.classList.toggle('is-open');
            navToggle.setAttribute('aria-expanded', String(isOpen));
        });
        siteNav.querySelectorAll('a').forEach((link) => {
            link.addEventListener('click', () => {
                siteNav.classList.remove('is-open');
                navToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // Hero spotlight follows the cursor, and the floating cards drift slightly with it
    const hero = document.getElementById('hero');
    const heroCardsLayer = document.getElementById('heroCards');
    const heroStarsLayer = document.getElementById('heroStars');
    const heroCards = document.querySelectorAll('.hero-card');

    if (hero && !prefersReducedMotion() && window.matchMedia('(hover: hover)').matches) {
        hero.addEventListener('mousemove', (event) => {
            const rect = hero.getBoundingClientRect();
            const x = ((event.clientX - rect.left) / rect.width) * 100;
            const y = ((event.clientY - rect.top) / rect.height) * 100;
            hero.style.setProperty('--spot-x', `${x}%`);
            hero.style.setProperty('--spot-y', `${y}%`);

            const nx = x / 100 - 0.5;
            const ny = y / 100 - 0.5;
            const maxShift = 34; // px of drift for the closest (depth 1) card

            heroCards.forEach((card) => {
                const depth = parseFloat(card.dataset.depth || '0.5');
                const offsetX = nx * maxShift * depth;
                const offsetY = ny * maxShift * depth;
                card.style.transform = `translate(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px))`;
            });
        });
    }

    // Let the floating cards and constellations fade in once the page has settled
    if (heroCardsLayer || heroStarsLayer) {
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                if (heroCardsLayer) heroCardsLayer.classList.add('is-visible');
                if (heroStarsLayer) heroStarsLayer.classList.add('is-visible');
            });
        });
    }

});