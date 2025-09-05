import { updateCartCount, loadCategoriesToMenu } from './get_api.js';

document.addEventListener('DOMContentLoaded', () => {
  fetch('header.html')
    .then(response => {
      if (!response.ok) throw new Error('Network response was not ok');
      return response.text();
    })
    .then(html => {
      const headerPlaceholder = document.getElementById('header-placeholder');
      if (!headerPlaceholder) throw new Error('Missing #header-placeholder in DOM');

      headerPlaceholder.innerHTML = html;

      const token = sessionStorage.getItem('token');
      // const cartBtnDesktop = document.querySelector('.btn-cart'); 
      // const cartBtnMobile = document.getElementById('cart-count-mobile')?.closest('.btn-cart'); 
      const loginBtn = document.getElementById('login-btn'); 
      const loginBtnMobile = document.getElementById('login-btn-mobile'); 

      if (!token) {
        // if (cartBtnDesktop) cartBtnDesktop.classList.add('hidden');
        // if (cartBtnMobile) cartBtnMobile.classList.add('hidden');
        if (loginBtn) loginBtn.classList.remove('hidden');
        if (loginBtnMobile) loginBtnMobile.classList.remove('hidden');
      } else {
        // if (cartBtnDesktop) cartBtnDesktop.classList.remove('hidden');
        // if (cartBtnMobile) cartBtnMobile.classList.remove('hidden');
        if (loginBtn) loginBtn.classList.add('hidden');
        if (loginBtnMobile) loginBtnMobile.classList.add('hidden');
      }

      updateCartCount();
      loadCategoriesToMenu();

      if (token) {

      } else {
        console.warn("Aucun token trouvé dans sessionStorage");
      }

      fetch('https://madarom-project-production.up.railway.app/api/user-session', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      .then(res => res.json())
      .then(data => {
        
        const user = data.user;
        if (user) {
          const userSection = document.getElementById('user-section');
          const userInitial = document.getElementById('user-initial');
          const userEmail = document.getElementById('user-email');
          const avatarBtn = document.getElementById('user-avatar');
          const dropdown = document.getElementById('user-dropdown');
      
          if (userSection) userSection.classList.remove('hidden');
          if (userInitial) userInitial.textContent = user.email.charAt(0).toUpperCase();
          if (userEmail) userEmail.textContent = user.email;
      
          if (avatarBtn && dropdown) {
            avatarBtn.addEventListener('click', (e) => {
              e.stopPropagation();
              dropdown.classList.toggle('hidden');
            });
      
            document.addEventListener('click', (e) => {
              if (!userSection.contains(e.target)) {
                dropdown.classList.add('hidden');
              }
            });
          }
     
          const userSectionMobile = document.getElementById('user-section-mobile');
          const avatarMobile = document.getElementById('user-avatar-mobile');
          const initialMobile = document.getElementById('user-initial-mobile');
          const emailMobile = document.getElementById('user-email-mobile');
          const logoutMobile = document.getElementById('logout-btn-mobile');
          
          if (userSectionMobile) userSectionMobile.classList.remove('hidden');
          
          if (avatarMobile && initialMobile) {
            initialMobile.textContent = user.email.charAt(0).toUpperCase();
          }
          if (emailMobile) {
            emailMobile.textContent = user.email;
          }
          if (logoutMobile) {
            logoutMobile.addEventListener('click', () => {
              sessionStorage.removeItem('user');
              location.reload();
            });
          }
        }
    })
    .catch(err => console.error('Erreur récupération user:', err));

      const burger = document.getElementById('burger-menu');
      const mobileMenu = document.getElementById('mobile-menu');

      if (burger && mobileMenu) {
        burger.addEventListener('click', () => {
          mobileMenu.classList.toggle('hidden');
        });
      }

      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', e => {
          const targetId = anchor.getAttribute('href');
          if (!targetId || targetId === '#') return;
          const el = document.querySelector(targetId);
          if (el) {
            e.preventDefault();
            window.scrollTo({
              top: el.offsetTop - 80,
              behavior: 'smooth'
            });
            mobileMenu?.classList.add('hidden');
          }
        });
      });

      const langDropdownBtn = document.getElementById('langDropdownBtn');
      const langDropdownMenu = document.getElementById('langDropdownMenu');
      const selectedLang = document.getElementById('selected-lang');

      if (langDropdownBtn && langDropdownMenu && selectedLang) {
        langDropdownBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          const isHidden = langDropdownMenu.classList.toggle('hidden');
          langDropdownBtn.setAttribute('aria-expanded', !isHidden);
        });

        langDropdownMenu.querySelectorAll('button').forEach(btn => {
          btn.addEventListener('click', function () {
            const lang = this.dataset.lang.toUpperCase();
            const newLang = this.dataset.lang.toLowerCase();
            selectedLang.textContent = lang;
            langDropdownMenu.classList.add('hidden');
            langDropdownBtn.setAttribute('aria-expanded', false);
            sessionStorage.setItem('lang', lang);
            window.location.href = `${window.location.origin}/${newLang}/`;

          });
        });

        document.addEventListener('click', () => {
          if (!langDropdownMenu.classList.contains('hidden')) {
            langDropdownMenu.classList.add('hidden');
            langDropdownBtn.setAttribute('aria-expanded', false);
          }
        });

        const savedLang = sessionStorage.getItem('lang');
        if (savedLang) selectedLang.textContent = savedLang;
      }

      const langDropdownBtnMobile = document.getElementById('langDropdownBtnMobile');
      const langDropdownMenuMobile = document.getElementById('langDropdownMenuMobile');
      const selectedLangMobile = document.getElementById('selected-lang-mobile');

      if (langDropdownBtnMobile && langDropdownMenuMobile && selectedLangMobile) {
        langDropdownBtnMobile.addEventListener('click', (e) => {
          e.stopPropagation();
          const isHidden = langDropdownMenuMobile.classList.toggle('hidden');
          langDropdownBtnMobile.setAttribute('aria-expanded', !isHidden);
        });

        langDropdownMenuMobile.querySelectorAll('button').forEach(btn => {
          btn.addEventListener('click', function () {
            const lang = this.dataset.lang.toUpperCase();
            const newLang = this.dataset.lang.toLowerCase();
            selectedLangMobile.textContent = lang;
            langDropdownMenuMobile.classList.add('hidden');
            langDropdownBtnMobile.setAttribute('aria-expanded', false);
            sessionStorage.setItem('lang', lang);
            window.location.href = `${window.location.origin}/${newLang}/`;

          });
        });

        document.addEventListener('click', () => {
          if (!langDropdownMenuMobile.classList.contains('hidden')) {
            langDropdownMenuMobile.classList.add('hidden');
            langDropdownBtnMobile.setAttribute('aria-expanded', false);
          }
        });

        const savedLang = sessionStorage.getItem('lang');
        if (savedLang) selectedLangMobile.textContent = savedLang;
      }
    })
    .catch(err => {
      console.error('Failed to load header:', err);
    });
});

window.addEventListener('scroll', () => {
  const header = document.querySelector('header');
  const navLinks = document.querySelectorAll('.nav-link');
  const logo = document.querySelector('.logo-font');
  const logo2 = document.querySelector('.logo-part');
  const langue = document.querySelector('.btn-langue');
  const lang_border = document.querySelector('.btn-lang');
  const cart = document.querySelector('.btn-cart');
  const menu = document.querySelector('.btn-menu');

  if (!header || !logo || !logo2 || !langue || !cart || !menu) return;

  if (window.scrollY > 50) {
    header.classList.add('bg-white', 'shadow-lg', 'translate-y-0');
    header.classList.remove('bg-transparent');

    logo.classList.remove('text-white');
    logo.classList.add('text-teal');

    logo2.classList.remove('text-white');
    logo2.classList.add('text-red');

    langue.classList.remove('text-white');
    langue.classList.add('text-gray-900');

    lang_border.classList.remove('border-white');
    lang_border.classList.add('border-gray-900');

    cart.classList.remove('text-white');
    cart.classList.add('text-gray-900');

    menu.classList.remove('text-white');
    menu.classList.add('text-gray-900');

    navLinks.forEach(link => {
      link.classList.remove('text-white');
      link.classList.add('text-gray-900');
    });
  } else {
    header.classList.add('bg-transparent');
    header.classList.remove('bg-white', 'shadow-lg', 'translate-y-0');

    logo.classList.remove('text-teal');
    logo.classList.add('text-white');

    logo2.classList.remove('text-red');
    logo2.classList.add('text-white');

    langue.classList.add('text-white');
    langue.classList.remove('text-gray-900');

    lang_border.classList.add('border-white');
    lang_border.classList.remove('border-gray-900');

    cart.classList.add('text-white');
    cart.classList.remove('text-gray-900');

    menu.classList.add('text-white');
    menu.classList.remove('text-gray-900');

    navLinks.forEach(link => {
      link.classList.remove('text-gray-900');
      link.classList.add('text-white');
    });
  }
});


  window.toggleList = function(button) {
    const list = button.nextElementSibling;
    list.classList.toggle('hidden');
    
    if (list.classList.contains('hidden')) {
      button.textContent = 'Learn more';
    } else {
      button.textContent = 'Learn less';
    }
  }
  
  window.logoutWithConfirmation = async function() {
    const confirmLogout = window.confirm("Voulez-vous vraiment vous déconnecter ?");
  
    if (!confirmLogout) return;
  
    const token = sessionStorage.getItem("token");
    if (!token) {
      alert("Vous êtes déjà déconnecté.");
      return;
    }
  
    try {
      const response = await fetch("https://madarom-project-production.up.railway.app/api/logout", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        credentials: 'include'
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Réponse serveur non OK:", errorText);
        throw new Error(`Erreur serveur ${response.status}`);
      }
  
      sessionStorage.removeItem("token");
  
      alert("Déconnecté avec succès !");
      location.reload();
  
    } catch (error) {
      console.error("Erreur lors du logout :", error, error.stack);
      alert("Erreur lors du logout. Voir console pour détails.");
    }
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    const toggleBtn = document.getElementById('toggle-filters-btn');
    const filterPanel = document.getElementById('filter-panel');

    if(toggleBtn && filterPanel) {
      toggleBtn.addEventListener('click', () => {
        const isHidden = filterPanel.classList.toggle('hidden');
        toggleBtn.textContent = isHidden ? 'Show Filters' : 'Hide Filters';
        toggleBtn.setAttribute('aria-expanded', !isHidden);
      });
    }
  });

  document.addEventListener("DOMContentLoaded", () => {
    const path = window.location.pathname;
  
    const sections = {
      "/fr": "home",
      "/fr/about": "about",
      "/fr/service": "services",
      "/fr/contact": "contact",
      "/fr/products": "products"
    };
  
    const sectionId = sections[path];
    if (sectionId) {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    } 
  });