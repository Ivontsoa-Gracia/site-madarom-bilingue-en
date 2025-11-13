const articles = [
  {
    id: "BLOGFR-001",
    date: "Mai 2025",
    title: "Pourquoi les huiles essentielles de Madagascar séduisent le marché asiatique du bien-être",
    summary:
      "La demande en huiles essentielles naturelles explose en Asie. Des spas de Singapour aux marques de cosmétiques naturelles de Chine et de Taïwan, toutes recherchent des produits purs et éthiques — et Madagascar est en tête.",
    contenu:
      "Ces dernières années, la demande en huiles essentielles naturelles a explosé en Asie. De l’industrie du spa à Singapour aux cosmétiques naturels en Chine et à Taïwan, les marques recherchent désormais des produits éthiques et d’une pureté exceptionnelle — et Madagascar est devenue une référence. Chez Madarom, nous exportons des huiles essentielles 100 % pures, directement issues des producteurs malgaches. Chaque goutte raconte une histoire de biodiversité, de tradition et de science. Le climat unique de Madagascar permet la production de molécules aromatiques d’une qualité rare. Parmi les plus prisées : Ravintsara, Ylang-Ylang, Baie Rose et Niaouli. Ces huiles sont désormais des références en Asie pour leur authenticité et leurs performances. Madarom garantit une origine éthique et une traçabilité totale : analyses GC/MS, certificats COA et MSDS, distillation à la vapeur et production durable. Nos clients incluent des centres de bien-être, marques de soins naturels et distributeurs d’huiles essentielles à travers toute l’Asie.",
    image: [
      "./assets/img/articles/article1-001.jpg",
      "./assets/img/articles/article1-002.jpg",
    ],
    theme: "Huiles Essentielles",
  },
  {
    id: "BLOGFR-002",
    date: "Mai 2025",
    title: "Comment choisir la bonne huile essentielle pour votre marque (Édition Asie)",
    summary:
      "Choisir le bon fournisseur d’huiles essentielles définit l’identité de votre marque — surtout en Asie, où qualité et histoire sont essentielles. Voici le guide Madarom.",
    contenu:
      "Choisir le bon fournisseur d’huiles essentielles, c’est définir l’identité même de votre marque — surtout sur le marché asiatique, où la qualité et l’histoire du produit priment. Étape 1 : Définir la mission de votre marque — relaxation, détox ou équilibre respiratoire. Étape 2 : Comprendre les grades d’huiles — privilégier les huiles testées GC/MS et issues de sources durables. Étape 3 : Adapter les mélanges aux goûts asiatiques — 20 % note de tête, 30 % note de cœur, 50 % note de base. Étape 4 : Choisir un partenaire d’export fiable — emballages flexibles, OEM et accompagnement bilingue (anglais et mandarin).",
    image: [
      "./assets/img/articles/article2-001.jpg",
      "./assets/img/articles/article2-002.jpg",
    ],
    theme: "Stratégie de Marque",
  },
  {
    id: "BLOGFR-003",
    date: "Mai 2025",
    title: "Le secret des huiles « Roi et Reine » de Madagascar",
    summary:
      "Encens et Ylang-Ylang — le roi et la reine de Madagascar — incarnent pureté et luxe naturel. Découvrez pourquoi ils conquièrent le marché asiatique du bien-être.",
    contenu:
      "Dans l’univers des huiles essentielles, peu se distinguent autant que l’Encens et l’Ylang-Ylang — les véritables roi et reine de Madagascar. Leur pureté et leur raffinement en font des incontournables du marché asiatique du spa et de la parfumerie. L’Encens symbolise la purification et la guérison. L’Ylang-Ylang, joyau floral de Madagascar, équilibre les émotions et sublime la peau. Ces huiles sont particulièrement prisées à Singapour et Taïwan. Essayez des synergies comme Ylang-Ylang + Orange (relaxation) ou Encens + Ravintsara (purification). Madarom assure un approvisionnement éthique, des tests de qualité et des services OEM personnalisés.",
    image: [
      "./assets/img/articles/article3-001.jpg",
      "./assets/img/articles/article3-002.jpg",
    ],
    theme: "Bien-être",
  },
];

  function renderArticlesList(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = "";
    articles.forEach((item) => {
      container.innerHTML += `
        <article
          class="cursor-pointer bg-white rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden flex flex-col md:flex-row group mx-auto max-w-4xl"
          onclick="window.location.href='/fr/blog-details?id=${item.id}'"
          role="button"
          tabindex="0"
          onkeydown="if(event.key==='Enter'){window.location.href='/fr/blog-details?id=${item.id}'}"
        >
          <!-- Image -->
          <div class="w-full md:w-72 h-56 md:h-auto shrink-0 relative overflow-hidden md:rounded-r-2xl">
            <img
              src="${item.image[0]}"
              alt="${item.title}"
              class="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          </div>
        
          <!-- Content -->
          <div class="flex flex-col justify-between p-4 md:p-6 flex-1 min-w-0">
            <div class="flex justify-between items-center mb-2 md:mb-3">
              <time
                datetime="${item.date.replace(/(\d{2})\/(\d{2})\/(\d{2})/, '20$3-$2-$1')}"
                class="text-gray-400 text-xs md:text-sm tracking-wide"
              >
                Published on ${item.date}
              </time>
              <span
                class="inline-block cursor-pointer select-none text-[#ab1a17] hover:text-[#81110e] font-semibold text-xs md:text-sm transition-colors duration-300"
              >
                Show more →
              </span>
            </div>
        
            <h3
              class="text-lg md:text-2xl font-semibold text-[#222831] leading-snug line-clamp-2 mb-2"
              title="${item.title}"
            >
              ${item.title}
            </h3>
        
            <p class="text-gray-600 text-sm md:text-base line-clamp-4 mt-1 md:mt-2 leading-relaxed">
              ${item.summary}
            </p>
          </div>
        </article>
      `;
    });
  }
  
  function renderArticleDetail(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
  
    const params = new URLSearchParams(window.location.search);
    const articleId = params.get("id");
    const article = articles.find((a) => a.id === articleId);
  
    if (!article) {
      container.innerHTML = `<p class="text-center text-red-600 font-semibold">Article not found.</p>`;
      return;
    }
  
    container.innerHTML = `
      <div class="flex flex-col gap-8 mb-12 max-w-4xl mx-auto px-4">
        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gray-300 pb-5">
          <time datetime="${article.date}" class="text-sm text-gray-500 tracking-wide select-none">
            Publié le <span class="font-semibold text-gray-700">${article.date}</span>
          </time>
          <span class="mt-4 sm:mt-0 inline-block bg-[#ab1a17]/20 text-[#ab1a17] font-semibold text-xs uppercase tracking-wide px-5 py-1.5 rounded-full shadow-sm select-none transition-colors duration-300 hover:bg-[#ab1a17]/40 cursor-default">
            ${article.theme || "Essential Oils"}
          </span>
        </div>
  
        <!-- Slider -->
        <div class="relative w-full rounded-xl shadow-lg overflow-hidden max-h-[400px] select-none">
          <div id="slider" class="flex transition-transform duration-700 ease-in-out w-full h-[320px] md:h-[520px] rounded-xl">
            ${article.image.map((src) => `
              <img 
                src="${src}" 
                alt="${article.title}" 
                class="w-full flex-shrink-0 h-full object-cover object-center"
                loading="lazy"
                draggable="false"
              />
            `).join('')}
          </div>
  
          <!-- Controls -->
          <button id="prevBtn" aria-label="Previous image" class="absolute top-1/2 left-3 transform -translate-y-1/2 bg-white bg-opacity-70 hover:bg-opacity-90 rounded-full p-2 shadow-md">
            <svg class="w-6 h-6 text-[#ab1a17]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/></svg>
          </button>
          <button id="nextBtn" aria-label="Next image" class="absolute top-1/2 right-3 transform -translate-y-1/2 bg-white bg-opacity-70 hover:bg-opacity-90 rounded-full p-2 shadow-md">
            <svg class="w-6 h-6 text-[#ab1a17]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
          </button>
  
          <!-- Pagination dots -->
          <div id="dots" class="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2"></div>
        </div>
  
        <!-- Content -->
        <div>
          <h1 class="text-3xl md:text-4xl font-extrabold text-[#222831] mb-8 leading-tight tracking-tight select-text">
            ${article.title}
          </h1>
          <div class="prose lg:prose-xl max-w-none text-gray-800 leading-relaxed select-text">
            ${article.contenu.split("\n").map(p => `<p class="mb-7">${p}</p>`).join("")}
          </div>
        </div>
      </div>
    `;
  
    const slider = container.querySelector('#slider');
    const imagesCount = article.image.length;
    const dotsContainer = container.querySelector('#dots');
    const prevBtn = container.querySelector('#prevBtn');
    const nextBtn = container.querySelector('#nextBtn');
    let currentIndex = 0;
    let intervalId;
  
    function updateSliderPosition() {
      slider.style.transform = `translateX(-${currentIndex * 100}%)`;
      Array.from(dotsContainer.children).forEach((dot, i) => {
        dot.classList.toggle('bg-[#ab1a17]', i === currentIndex);
        dot.classList.toggle('bg-gray-300', i !== currentIndex);
      });
    }
  
    function nextImage() {
      currentIndex = (currentIndex + 1) % imagesCount;
      updateSliderPosition();
    }
  
    function prevImage() {
      currentIndex = (currentIndex - 1 + imagesCount) % imagesCount;
      updateSliderPosition();
    }
  
    function resetInterval() {
      clearInterval(intervalId);
      intervalId = setInterval(nextImage, 30000); 
    }
  
    // Create dots
    article.image.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'w-3 h-3 rounded-full bg-gray-300 cursor-pointer transition-colors';
      dot.setAttribute('aria-label', `Go to image ${i + 1}`);
      dot.addEventListener('click', () => {
        currentIndex = i;
        updateSliderPosition();
        resetInterval();
      });
      dotsContainer.appendChild(dot);
    });
  
    prevBtn.addEventListener('click', () => {
      prevImage();
      resetInterval();
    });
    nextBtn.addEventListener('click', () => {
      nextImage();
      resetInterval();
    });
  
    // Start auto-slide
    resetInterval();
  
    // Initial display
    updateSliderPosition();
  }
  
  const whatsappBtn = document.getElementById('whatsapp-btn');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
      whatsappBtn.classList.add('collapsed');
    } else {
      whatsappBtn.classList.remove('collapsed');
    }
  });  