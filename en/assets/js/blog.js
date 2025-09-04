const articles = [
    {
      id: "ART040825-001",
      date: "Mai 2025",
      title: "The Secret Power of Malagasy Essential Oils",
      summary: "Madagascar is renowned for producing some of the purest and most potent essential oils in the world. From ravintsara to niaouli, these oils provide a natural, therapeutic solution for boosting immunity, reducing stress, and improving sleep. At Mad’Arom, we partner directly with small-scale farmers to ensure 100% traceability and sustainable sourcing, combining traditional wisdom with modern science.",
      contenu: "Madagascar’s unique climate and biodiversity make it an exceptional source of essential oils with remarkable purity and effectiveness. The island is home to endemic plants like ravintsara and niaouli, whose essential oils have been treasured for centuries for their medicinal and aromatic properties. Ravintsara essential oil is widely known for its antiviral and immune-boosting effects. It’s commonly used to support respiratory health and strengthen the body’s defenses during cold and flu seasons. Its fresh, camphoraceous aroma also helps to reduce mental fatigue and enhance concentration. Niaouli oil, another Malagasy treasure, offers gentle yet powerful antiseptic and anti-inflammatory benefits. It’s often used to soothe skin irritations, aid wound healing, and promote respiratory wellness. Its subtle, eucalyptus-like scent makes it a favorite for aromatherapy and relaxation. At Mad’Arom, our commitment goes beyond quality. We work directly with smallholder farmers across Madagascar, ensuring that every drop of oil is 100% traceable from plant to bottle. This approach guarantees sustainable harvesting practices that protect the environment and empower local communities. Whether your goal is to boost immunity, relieve stress, or improve sleep quality, Malagasy essential oils provide a natural, effective option. Backed by centuries of traditional use and validated by modern scientific research, these oils unlock the healing power of nature. Discover the purity and potency of Malagasy essential oils — carefully distilled and bottled with respect for both people and the planet.",
      image: [
        "./assets/img/articles/article1-001.jpg",
        "./assets/img/articles/article1-002.jpg",
      ],
      theme: "Essential Oils",
    },
    {
      id: "ART040825-002",
      date: "January 2025",
      title: "How to Use Essential Oils Safely: A Beginner’s Guide",
      summary: "Essential oils are powerful natural extracts, but using them safely is essential to enjoy their full benefits. This beginner’s guide from Mad’Arom offers tips on dilution, aromatherapy, and safe practices to get started with confidence.",
      contenu: "Essential oils are concentrated plant extracts with incredible potential — but they must be used correctly. At Mad’Arom, we emphasize education alongside quality. Here are key safety tips for beginners: Always dilute essential oils before applying them to the skin using a carrier oil such as coconut, jojoba, or almond oil. Avoid internal use unless guided by a certified aromatherapist. Always perform a patch test to check for allergic reactions. Use a diffuser for gentle, therapeutic inhalation. Store your oils in dark glass bottles away from heat and sunlight to preserve their potency. By following these precautions, essential oils can enhance your well-being naturally and safely. Start safe, stay natural.",
      image: [
        "./assets/img/articles/article2-001.jpg",
        "./assets/img/articles/article2-002.jpg"
      ],
      theme: "Essential Oils",
    },
    {
      id: "ART040825-003",
      date: "August 2025",
      title: "Spices from Madagascar: Why Chefs Around the World Love Them",
      summary: "Madagascar produces some of the world’s most flavorful and aromatic spices. From Bourbon vanilla to wild black pepper, discover why top chefs trust these ethically sourced, hand-harvested treasures.",
      contenu: "Madagascar is a paradise for spice lovers. The island is globally celebrated for producing top-quality spices such as Bourbon vanilla, wild black pepper, cinnamon, and cloves. These spices are prized not only for their bold flavors and aromas, but also for their purity and traceability. At Mad’Arom, we collaborate closely with local farmers who cultivate their crops organically and sustainably. Each batch is sun-dried, hand-sorted, and packaged with care to ensure peak freshness. Whether you’re a gourmet chef or a conscious home cook, Malagasy spices deliver a sensory experience that’s both ethical and exceptional. Taste the island. Cook with purpose.",
      image: [
        "./assets/img/articles/article3-001.jpg",
        "./assets/img/articles/article3-002.jpg",
      ],
      theme: "Spices",
    }
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
  