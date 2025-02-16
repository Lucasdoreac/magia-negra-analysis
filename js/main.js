document.addEventListener('DOMContentLoaded', async function() {
    const mainContent = document.querySelector('main');
    const sections = ['introducao', 'panic', 'evandro', 'percepcao'];
    
    for (const section of sections) {
        try {
            const response = await fetch(`sections/${section}.html`);
            const content = await response.text();
            mainContent.innerHTML += content;
        } catch (error) {
            console.error(`Error loading section ${section}:`, error);
        }
    }
});