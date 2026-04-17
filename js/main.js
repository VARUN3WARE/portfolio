/**
 * Adithya-style Portfolio Logic
 * "I put the 'AI' in 'Aint nobody got time for that'" :)
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // --- Floating Navigation Logic ---
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('section[id]');

    function updateActiveNav() {
        let scrollY = window.pageYOffset;

        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 150;
            const sectionId = current.getAttribute('id');

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navItems.forEach(item => {
                    item.classList.remove('active');
                    if (item.getAttribute('href') === `#${sectionId}`) {
                        item.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', updateActiveNav);

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
        });
    });

    // --- Show More Repositories Logic ---
    const loadMoreBtn = document.getElementById('load-more-btn');
    const extraRepos = document.querySelectorAll('.repo-extra');
    const loadMoreText = document.getElementById('load-more-text');
    const loadMoreIcon = document.getElementById('load-more-icon');

    if (loadMoreBtn) {
        let isExpanded = false;

        loadMoreBtn.addEventListener('click', () => {
            isExpanded = !isExpanded;

            extraRepos.forEach(repo => {
                repo.style.display = isExpanded ? 'flex' : 'none';
            });

            // Update button text and icon
            if (isExpanded) {
                loadMoreText.textContent = 'Show fewer repositories';
                loadMoreIcon.setAttribute('data-lucide', 'chevron-up');
            } else {
                loadMoreText.textContent = 'Show more repositories';
                loadMoreIcon.setAttribute('data-lucide', 'chevron-down');
            }

            // Refresh icons for the toggle
            lucide.createIcons();
        });
    }
});
