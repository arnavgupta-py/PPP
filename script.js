document.addEventListener('DOMContentLoaded', function () {

    // --- Harmonium and Content Logic ---
    const keys = document.querySelectorAll('.key');
    const contentSections = document.querySelectorAll('.content-section');
    const contentContainer = document.getElementById('content-container');

    const handleKeyClick = (key) => {
        const targetSectionId = key.dataset.section;
        const targetSection = document.getElementById(targetSectionId);
        const noteName = key.dataset.note;

        if (noteName) {
            const noteAudio = document.getElementById('audio-' + noteName);
            if (noteAudio) {
                noteAudio.currentTime = 0;
                noteAudio.play();
            }
        }
        
        keys.forEach(k => k.classList.remove('active'));
        key.classList.add('active');
        
        contentSections.forEach(section => {
            section.classList.remove('active-section');
        });
        
        if (targetSection) {
            targetSection.classList.add('active-section');
        }
    };

    keys.forEach(key => {
        key.addEventListener('click', () => handleKeyClick(key));
    });
    
    // Set initial state
    if (keys.length > 0) {
        keys[0].classList.add('active');
        const firstSection = document.getElementById(keys[0].dataset.section);
        if (firstSection) {
            firstSection.classList.add('active-section');
        }
    }

    // --- Scroll Animation Logic ---
    const scrollElements = document.querySelectorAll('[data-scroll]');

    const elementInView = (el, dividend = 1) => {
        const elementTop = el.getBoundingClientRect().top;
        return (
            elementTop <= (window.innerHeight || document.documentElement.clientHeight) / dividend
        );
    };

    const displayScrollElement = (element) => {
        element.classList.add('is-visible');
    };

    const handleScrollAnimation = () => {
        scrollElements.forEach((el) => {
            if (elementInView(el, 1.25)) {
                displayScrollElement(el);
            }
        });

        // Set staggered delay for grid cards when they become visible
        document.querySelectorAll('.content-grid').forEach(grid => {
            if (elementInView(grid)) {
                grid.querySelectorAll('.content-card').forEach((card, index) => {
                    card.style.setProperty('--card-index', index);
                });
            }
        });
    };
    
    // Initial check on page load
    handleScrollAnimation();
    window.addEventListener('scroll', handleScrollAnimation);
});