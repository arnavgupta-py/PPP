document.addEventListener('DOMContentLoaded', function () {

    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }

    const keys = document.querySelectorAll('.key');
    const keyContainer = document.querySelector('.white-keys');
    const contentSections = document.querySelectorAll('.content-section');
    const contentContainer = document.getElementById('content-container');

    const fetchData = async (url) => {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error("Could not fetch data:", error);
        }
    };
    
    const renderAbout = (data) => {
        const grid = document.querySelector('#about .content-grid');
        const taglineTemplate = document.getElementById('template-tagline');
        const expertiseTemplate = document.getElementById('template-expertise');
        
        if (!grid || !taglineTemplate || !expertiseTemplate) {
            console.error("A required element or template was not found in the DOM.");
            return;
        }

        grid.innerHTML = '';
        
        const taglineClone = taglineTemplate.content.cloneNode(true);
        taglineClone.querySelector('p').textContent = data.tagline;
        grid.appendChild(taglineClone);

        const expertiseHeading = document.createElement('h2');
        expertiseHeading.textContent = 'Expertise';
        expertiseHeading.className = 'expertise-heading';
        expertiseHeading.dataset.scroll = '';
        grid.appendChild(expertiseHeading);

        data.expertise.forEach(item => {
            const expertiseClone = expertiseTemplate.content.cloneNode(true);
            const iconElement = expertiseClone.querySelector('i');
            const nameElement = expertiseClone.querySelector('h4');
            const descElement = expertiseClone.querySelector('p');
            
            if (iconElement) iconElement.className = item.icon;
            if (nameElement) nameElement.textContent = item.name;
            if (descElement) descElement.textContent = item.description;
            
            grid.appendChild(expertiseClone);
        });
    };

    const renderEducation = (data) => {
        const cardsContainer = document.querySelector('.timeline-cards');
        if (!cardsContainer) return;

        cardsContainer.innerHTML = '';
        data.forEach((item, index) => {
            const card = document.createElement('div');
            card.className = 'content-card education-card';
            card.style.top = `${100 + index * 20}px`;

            const header = document.createElement('div');
            header.className = 'education-header';
            
            const degree = document.createElement('h3');
            degree.className = 'degree';
            degree.textContent = item.degree;
            
            const branch = document.createElement('h4');
            branch.className = 'branch';
            if (item.branch) branch.textContent = item.branch;

            header.appendChild(degree);
            header.appendChild(branch);

            const college = document.createElement('p');
            college.className = 'college';
            college.textContent = item.college;
            
            const details = document.createElement('p');
            details.className = 'details';
            details.textContent = item.details;
            
            card.appendChild(header);
            card.appendChild(college);
            card.appendChild(details);
            cardsContainer.appendChild(card);
        });
    };

    const handleTimelineScroll = () => {
        const container = document.querySelector('.education-timeline-container');
        const progressBar = document.querySelector('.progress-bar');
        const cards = document.querySelectorAll('.timeline-cards .education-card');
        
        if (!container || !progressBar || cards.length === 0) return;

        const containerRect = container.getBoundingClientRect();
        const containerTop = containerRect.top + window.scrollY;
        const containerHeight = container.offsetHeight;
        const viewportHeight = window.innerHeight;
        
        const scrollStart = containerTop;
        const scrollEnd = containerTop + containerHeight - viewportHeight;
        
        const progress = Math.max(0, Math.min(1, (window.scrollY - scrollStart) / (scrollEnd - scrollStart)));
        
        progressBar.style.height = `${progress * 100}%`;

        cards.forEach(card => {
            const cardRect = card.getBoundingClientRect();
            if (cardRect.top < 120 && cardRect.top > 80) {
                 card.classList.add('is-active');
            } else {
                card.classList.remove('is-active');
            }
        });
    };

    const handleKeyActivation = async (key, playSound = true, shouldScroll = true) => {
        if (!key) return;

        const sectionId = key.dataset.section;
        const targetSection = document.getElementById(sectionId);
        const noteName = key.dataset.note;

        if (noteName && playSound) {
            const noteAudio = document.getElementById('audio-' + noteName);
            if (noteAudio) {
                noteAudio.currentTime = 0;
                noteAudio.play().catch(error => console.error("Audio play failed:", error));
            }
        }
        
        keys.forEach(k => k.classList.remove('active'));
        key.classList.add('active');
        
        contentSections.forEach(section => {
            section.classList.remove('active-section');
        });
        
        if (targetSection) {
            targetSection.classList.add('active-section');
            
            switch (sectionId) {
                case 'about':
                    window.removeEventListener('scroll', handleTimelineScroll);
                    const aboutData = await fetchData('data/about.json');
                    if (aboutData) {
                        renderAbout(aboutData);
                        handleScrollAnimation();
                    }
                    break;
                case 'education':
                    const eduData = await fetchData('data/education.json');
                    if (eduData) {
                        renderEducation(eduData);
                        handleScrollAnimation(); 
                        window.addEventListener('scroll', handleTimelineScroll);
                    }
                    break;
                default:
                    window.removeEventListener('scroll', handleTimelineScroll);
            }

            if (shouldScroll) {
                const headerOffset = 40;
                const elementPosition = contentContainer.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        }
    };

    keyContainer.addEventListener('click', (event) => {
        const key = event.target.closest('.key');
        if (key) {
            handleKeyActivation(key);
        }
    });

    keyContainer.addEventListener('keydown', (event) => {
        if ((event.key === 'Enter' || event.key === ' ') && document.activeElement.classList.contains('key')) {
            event.preventDefault();
            handleKeyActivation(document.activeElement);
        }
    });
    
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
        const scrollElements = document.querySelectorAll('[data-scroll]');
        scrollElements.forEach((el) => {
            if (elementInView(el, 1.25)) {
                displayScrollElement(el);
            }
        });

        document.querySelectorAll('.content-grid').forEach(grid => {
            if (elementInView(grid)) {
                grid.querySelectorAll('.content-card').forEach((card, index) => {
                    card.style.setProperty('--card-index', index);
                });
            }
        });
    };
    
    const initializePage = () => {
        if (keys.length > 0) {
            handleKeyActivation(keys[0], false, false);
        }
        handleScrollAnimation();
        window.addEventListener('scroll', handleScrollAnimation);
    };

    initializePage();
});