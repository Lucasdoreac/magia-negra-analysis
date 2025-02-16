document.addEventListener('DOMContentLoaded', async function() {
  const mainContent = document.querySelector('#content');
  const loadingElement = document.querySelector('#loading');
  const sections = ['introducao', 'panic', 'evandro', 'percepcao'];
  
  try {
    const contentPromises = sections.map(section =>
      fetch(`sections/${section}.html`)
        .then(response => response.text())
    );

    const contents = await Promise.all(contentPromises);
    loadingElement.remove();
    contents.forEach(content => {
      mainContent.innerHTML += content;
    });

    // Adiciona animação suave ao scroll para links internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      });
    });

  } catch (error) {
    console.error('Error loading sections:', error);
    loadingElement.textContent = 'Erro ao carregar o conteúdo. Por favor, recarregue a página.';
    loadingElement.style.color = 'red';
  }
});
