document.addEventListener('DOMContentLoaded', function () {

    const keys = document.querySelectorAll('.key');
    const contentSections = document.querySelectorAll('.content-section');
    const contentContainer = document.getElementById('content-container');

    const handleKeyClick = (key) => {
        const targetSectionId = key.dataset.section;
        const targetSection = document.getElementById(targetSectionId);
        
        // Get the note name from the key's data-note attribute
        const noteName = key.dataset.note;

        // --- Play the audio ---
        if (noteName) {
            const noteAudio = document.getElementById('audio-' + noteName);
            if (noteAudio) {
                noteAudio.currentTime = 0; // Rewind to the start
                noteAudio.play();          // Play the sound
            }
        }
        
        // --- Update the visual state of the keys ---
        keys.forEach(k => k.classList.remove('active'));
        key.classList.add('active');
        
        // --- Update the visibility and animation of content sections ---
        contentSections.forEach(section => {
            section.classList.remove('active-section');
            // Reset animation to allow replay on each section switch
            section.style.animation = 'none';
            section.offsetHeight; // Trigger reflow
            section.style.animation = null; 
        });
        
        if (targetSection) {
            targetSection.classList.add('active-section');
            
            // UX IMPROVEMENT: Scroll to the top of the content container
            // This ensures the user sees the start of the newly selected section.
            const headerOffset = 40; // Extra padding from the top
            const elementPosition = contentContainer.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });
        }
    };

    // Attach a click event listener to each key.
    keys.forEach(key => {
        key.addEventListener('click', () => handleKeyClick(key));
    });

    // Initialize the page by activating the first key's content after animations.
    // This is wrapped in a small timeout to allow initial CSS animations to complete
    // before the first content section is shown, preventing a visual "pop".
    if (keys.length > 0) {
        setTimeout(() => {
            keys[0].classList.add('active');
            const firstSection = document.getElementById(keys[0].dataset.section);
            if (firstSection) {
                firstSection.classList.add('active-section');
            }
        }, 1500); // Adjust this timeout to match your CSS load animations
    }
});