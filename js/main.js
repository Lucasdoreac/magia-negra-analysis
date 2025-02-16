document.addEventListener('DOMContentLoaded', async function() {
  const mainContent = document.querySelector('#content');
  const loadingElement = document.querySelector('#loading');
  const sections = ['introducao', 'panic', 'evandro', 'percepcao', 'controle', 'impacto'];
  
  try {
    const contentPromises = sections.map(section =>
      fetch(`sections/${section}.html`)
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.text();
        })
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
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });

    // Adiciona classe para seções visíveis
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, observerOptions);

    document.querySelectorAll('.section-content').forEach(section => {
      sectionObserver.observe(section);
    });

  } catch (error) {
    console.error('Error loading sections:', error);
    loadingElement.textContent = 'Erro ao carregar o conteúdo. Por favor, recarregue a página.';
    loadingElement.style.color = 'red';
  }
});