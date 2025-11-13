const articles = [
  {
    id: "BLOGEN-001",
    date: "May 2025",
    title: "Why Madagascar Essential Oils Are Taking Over the Asian Wellness Market",
    summary:
      "Asia’s demand for natural essential oils is growing fast. From Singapore’s spas to China’s clean beauty brands, businesses seek high-purity, ethical products — and Madagascar leads this transformation. At Madarom, we export 100% pure, GC/MS-tested essential oils sourced directly from Malagasy farmers.",
    contenu:
      "In recent years, the demand for natural essential oils in Asia has grown rapidly. From Singapore’s spa industry to China’s natural cosmetics and Taiwan’s aromatherapy brands, businesses are turning toward ethical, high-purity products — and Madagascar is leading the trend. At Madarom, we export 100% pure essential oils sourced directly from Malagasy farmers. Each drop tells a story of biodiversity, tradition, and science. Madagascar’s unique climate allows plants to produce exceptional aromatic molecules. Examples include Ravintsara, Ylang-Ylang, Baie Rose, and Niaouli. These oils have become Asia’s new reference for authenticity and performance. Madarom stands for ethical sourcing and traceable production: GC/MS tested, COA + MSDS certified, steam-distilled, and sustainable. Asian buyers appreciate our premium quality and commitment to sustainability. Our clients include spa and wellness centers, natural skincare brands, and essential oil distributors across Asia. We provide bulk export, OEM, and white-label services.",
    image: [
      "./assets/img/articles/article1-001.jpg",
      "./assets/img/articles/article1-002.jpg",
    ],
    theme: "Essential Oils",
  },
  {
    id: "BLOGEN-002",
    date: "May 2025",
    title: "How to Choose the Right Essential Oil for Your Brand (Asian Market Edition)",
    summary:
      "Choosing the right essential oil supplier defines your brand’s identity — especially in Asia, where quality and story matter most. Discover Madarom’s key steps to selecting trusted, high-purity oils.",
    contenu:
      "Choosing the right essential oil supplier defines your brand’s identity — especially in the Asian wellness market, where quality and story matter. Here’s how to make the right choice with Madarom Madagascar. Step 1: Identify your brand’s purpose – relaxation, detox, or respiratory wellness. Step 2: Understand oil grades – choose GC/MS verified, sustainably sourced oils. Step 3: Blend for Asian sensibilities – 20% top note, 30% middle, 50% base. Step 4: Choose a reliable export partner – flexible packaging, OEM, and support in English & Mandarin.",
    image: [
      "./assets/img/articles/article2-001.jpg",
      "./assets/img/articles/article2-002.jpg",
    ],
    theme: "Brand Strategy",
  },
  {
    id: "BLOGEN-003",
    date: "May 2025",
    title: "The Secret Behind Madagascar’s 'King & Queen' Essential Oils",
    summary:
      "Frankincense and Ylang-Ylang — the King and Queen of Madagascar — define the luxury of purity and wellness. Discover why they dominate Asia’s fragrance and spa industries.",
    contenu:
      "In the world of essential oils, few stand out like Frankincense and Ylang-Ylang — the King and Queen of Madagascar. Their purity and luxury make them essential to Asia’s spa and fragrance markets. Frankincense represents purity and healing. Ylang-Ylang, Madagascar’s floral jewel, balances emotions and enhances beauty. These oils are loved in Singapore and Taiwan’s wellness industries. Try blends like Ylang-Ylang + Orange for relaxation or Frankincense + Ravintsara for grounding. Madarom provides ethical sourcing, testing, and OEM solutions.",
    image: [
      "./assets/img/articles/article3-001.jpg",
      "./assets/img/articles/article3-002.jpg",
    ],
    theme: "Wellness",
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
          onclick="window.location.href='/en/blog-details?id=${item.id}'"
          role="button"
          tabindex="0"
          onkeydown="if(event.key==='Enter'){window.location.href='/en/blog-details?id=${item.id}'}"
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
            Published on <span class="font-semibold text-gray-700">${article.date}</span>
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
  
    resetInterval();
  
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
  