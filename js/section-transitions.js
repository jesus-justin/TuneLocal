// Smooth Section Transitions
class SectionTransitions {
    constructor() {
        this.currentSection = null;
        this.init();
    }
    
    init() {
        const sections = document.querySelectorAll('.section');
        sections.forEach(section => {
            section.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        });
        
        // Enhance the showSection function
        this.overrideShowSection();
    }
    
    overrideShowSection() {
        const originalShowSection = window.showSection;
        
        window.showSection = (sectionId) => {
            const allSections = document.querySelectorAll('.section');
            const targetSection = document.getElementById(sectionId);
            
            // Fade out current section
            allSections.forEach(section => {
                if (section.classList.contains('active')) {
                    section.style.opacity = '0';
                    section.style.transform = 'translateX(-30px)';
                    
                    setTimeout(() => {
                        section.classList.remove('active');
                    }, 300);
                }
            });
            
            // Fade in new section
            setTimeout(() => {
                if (targetSection) {
                    targetSection.classList.add('active');
                    targetSection.style.opacity = '0';
                    targetSection.style.transform = 'translateX(30px)';
                    
                    setTimeout(() => {
                        targetSection.style.opacity = '1';
                        targetSection.style.transform = 'translateX(0)';
                    }, 50);
                }
                
                // Update nav links
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('data-section') === sectionId) {
                        link.classList.add('active');
                    }
                });
            }, 300);
        };
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new SectionTransitions();
});
