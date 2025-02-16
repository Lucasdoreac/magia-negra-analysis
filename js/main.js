document.addEventListener('DOMContentLoaded', async function() {
  const mainContent = document.querySelector('#content');
  const loadingElement = document.querySelector('#loading');
  const sections = [
    'introducao', 
    'panic', 
    'evandro', 
    'percepcao', 
    'controle', 
    'impacto',
    'academico',
    'vozes',
    'recursos'
  ];
  
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

    // Adiciona animações de entrada para seções
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Carrega imagens quando a seção se torna visível
          entry.target.querySelectorAll('img[loading="lazy"]').forEach(img => {
            img.src = img.getAttribute('data-src');
          });
        }
      });
    }, observerOptions);

    document.querySelectorAll('.section-content').forEach(section => {
      section.classList.add('fade-in');
      sectionObserver.observe(section);
    });

    // Atualiza navegação ativa durante o scroll
    const nav = document.querySelector('nav');
    const navHeight = nav.offsetHeight;
    
    window.addEventListener('scroll', () => {
      let currentSection = '';
      
      sections.forEach(sectionId => {
        const section = document.querySelector(`#${sectionId}`);
        if (section) {
          const sectionTop = section.offsetTop - navHeight;
          const sectionHeight = section.offsetHeight;
          if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
            currentSection = sectionId;
          }
        }
      });
      
      document.querySelectorAll('nav a').forEach(a => {
        a.classList.remove('active');
        if (a.getAttribute('href').substring(1) === currentSection) {
          a.classList.add('active');
        }
      });
    });

  } catch (error) {
    console.error('Error loading sections:', error);
    loadingElement.textContent = 'Erro ao carregar o conteúdo. Por favor, recarregue a página.';
    loadingElement.style.color = 'red';
  }
});