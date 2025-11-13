const articles = [
  {
    id: "BLOGCN-001",
    date: "2025年5月",
    title: "马达加斯加精油如何引领亚洲健康市场",
    summary:
      "亚洲对天然精油的需求快速增长。从新加坡的水疗行业到中国与台湾的天然护肤品牌，越来越多企业选择纯净、可持续的产品。Madarom 以 100% 纯天然精油引领趋势。",
    contenu:
      "近年来，亚洲对天然精油的需求快速增长。从新加坡的水疗行业到中国的天然护肤品牌，再到台湾的芳疗品牌，越来越多企业选择纯净、可持续的产品。Madarom 来自马达加斯加，出口 100% 纯天然精油，每一滴都承载自然的力量与科学的精粹。马达加斯加独特的气候孕育出卓越的芳香分子，如 Ravintsara、依兰依兰、粉胡椒与 Niaouli。这些精油成为亚洲市场真实与高品质的新标杆。Madarom 坚持道德采购与全程追溯，所有精油均通过 GC/MS 检测并附带 COA、MSDS 认证。我们的客户包括新加坡、香港、上海与台北的水疗中心、护肤品牌与批发商。Madarom 提供散装出口、OEM 与白标合作。",
    image: [
      "./assets/img/articles/article1-001.jpg",
      "./assets/img/articles/article1-002.jpg",
    ],
    theme: "精油",
  },
  {
    id: "BLOGCN-002",
    date: "2025年5月",
    title: "如何为您的品牌选择合适的精油（亚洲市场指南）",
    summary:
      "选择合适的精油供应商决定品牌的核心价值。Madarom 为亚洲品牌提供高品质、可追溯、纯天然的解决方案。",
    contenu:
      "选择合适的精油供应商决定品牌的核心价值。Madarom 马达加斯加为亚洲品牌提供高品质、可追溯、纯天然精油。第一步：确定品牌目标（放松、净化或能量） | 第二步：了解精油等级（纯净、无添加） | 第三步：根据亚洲喜好配方（柔和、清新） | 第四步：选择可靠出口伙伴（多语言服务与灵活包装）。",
    image: [
      "./assets/img/articles/article2-001.jpg",
      "./assets/img/articles/article2-002.jpg",
    ],
    theme: "品牌策略",
  },
  {
    id: "BLOGCN-003",
    date: "2025年5月",
    title: "马达加斯加“精油之王与之后”的秘密",
    summary:
      "乳香与依兰依兰——马达加斯加的“王与后”，以纯净与奢华闻名，深受亚洲水疗与香氛品牌喜爱。",
    contenu:
      "在精油的世界中，乳香与依兰依兰堪称“王与后”。它们的纯净与奢华使其成为亚洲香氛与水疗市场的首选。乳香象征净化与疗愈；依兰依兰代表热带花香之魂，舒缓情绪、滋养肌肤。推荐混合：依兰依兰 + 橙子（放松）或 乳香 + Ravintsara（净化）。Madarom 保证道德采购与实验室检测，提供 OEM 与品牌定制方案。",
    image: [
      "./assets/img/articles/article3-001.jpg",
      "./assets/img/articles/article3-002.jpg",
    ],
    theme: "健康养生",
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
          onclick="window.location.href='/zh-cn/blog-details?id=${item.id}'"
          role="button"
          tabindex="0"
          onkeydown="if(event.key==='Enter'){window.location.href='/zh-cn/blog-details?id=${item.id}'}"
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
              發佈於 ${item.date}
              </time>
              <span
                class="inline-block cursor-pointer select-none text-[#ab1a17] hover:text-[#81110e] font-semibold text-xs md:text-sm transition-colors duration-300"
              >
              顯示更多 →
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
          發佈於 <span class="font-semibold text-gray-700">${article.date}</span>
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