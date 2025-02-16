document.addEventListener('DOMContentLoaded', function() {
  // Gerenciamento do Menu Móvel
  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('nav');
  
  if (navToggle && nav) {
    // Toggle menu
    navToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      nav.classList.toggle('active');
      navToggle.setAttribute('aria-expanded', nav.classList.contains('active'));
    });

    // Fechar menu ao clicar fora
    document.addEventListener('click', (e) => {
      if (nav.classList.contains('active') && !nav.contains(e.target)) {
        nav.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });

    // Fechar menu ao clicar em links
    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Carregamento de Conteúdo
  const mainContent = document.querySelector('#content');
  const loadingElement = document.querySelector('#loading');
  const sections = ['introducao', 'panic', 'evandro', 'percepcao', 'acao-direta', 'engajamento', 'ferramentas'];
  
  async function loadContent() {
    try {
      const contentPromises = sections.map(section =>
        fetch(`sections/${section}.html`)
          .then(response => {
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return response.text();
          })
      );

      const contents = await Promise.all(contentPromises);
      if (loadingElement) loadingElement.style.display = 'none';
      if (mainContent) {
        contents.forEach(content => {
          mainContent.innerHTML += content;
        });
        
        // Adiciona animações de entrada para seções
        const allSections = document.querySelectorAll('.section-content');
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
              observer.unobserve(entry.target);
            }
          });
        }, {
          threshold: 0.1
        });

        allSections.forEach(section => observer.observe(section));
      }
    } catch (error) {
      console.error('Error loading content:', error);
      if (loadingElement) {
        loadingElement.innerHTML = `
          <p style="color: red;">Erro ao carregar o conteúdo. Por favor, recarregue a página.</p>
          <button onclick="window.location.reload()">Recarregar</button>
        `;
      }
    }
  }

  loadContent();

  // Navegação Suave
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        const headerOffset = 70;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // Highlight seção ativa no scroll
  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY + 100;
    
    sections.forEach(sectionId => {
      const section = document.querySelector(`#${sectionId}`);
      if (section) {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        
        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
          document.querySelector(`nav a[href="#${sectionId}"]`)?.classList.add('active');
        } else {
          document.querySelector(`nav a[href="#${sectionId}"]`)?.classList.remove('active');
        }
      }
    });
  });
});