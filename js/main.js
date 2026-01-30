// Expose functions to global scope for HTML onclick attributes
window.switchTab = switchTab;
window.startTest = startTest;
window.checkTestAnswer = checkTestAnswer;
window.toggleChat = toggleChat;
window.sendMessage = sendMessage;
window.handleKeyPress = handleKeyPress;
window.toggleCoverage = toggleCoverage;
window.startTour = startTour;

document.addEventListener('DOMContentLoaded', () => {
    // Initial render
    updateProgress();
    renderLearningContent();

    // Check for DG load
    const checkDG = setInterval(() => {
        if (typeof DG !== 'undefined') {
            clearInterval(checkDG);
            initMap();
        }
    }, 500);

    // Pre-load voices
    if (window.speechSynthesis) {
        window.speechSynthesis.getVoices();
    }
    
    // Simple parallax effect for hero
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero-overlay');
        if(hero) {
            hero.style.transform = `translateY(${scrolled * 0.4}px)`;
        }
    });
});
