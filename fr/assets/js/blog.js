const articles = [
  {
    id: "ART040825-001",
    date: "Mai 2025",
    title: "Le pouvoir secret des huiles essentielles malgaches",
    summary: "Madagascar est réputé pour produire certaines des huiles essentielles les plus pures et les plus puissantes au monde. Du ravintsara au niaouli, ces huiles offrent une solution naturelle et thérapeutique pour renforcer l’immunité, réduire le stress et améliorer le sommeil. Chez Mad’Arom, nous collaborons directement avec des petits producteurs afin de garantir une traçabilité à 100 % et un approvisionnement durable, alliant savoir traditionnel et science moderne.",
    contenu: "Le climat et la biodiversité uniques de Madagascar en font une source exceptionnelle d’huiles essentielles d’une pureté et d’une efficacité remarquables. L’île abrite des plantes endémiques comme le ravintsara et le niaouli, dont les huiles essentielles sont prisées depuis des siècles pour leurs propriétés médicinales et aromatiques. L’huile essentielle de ravintsara est largement connue pour ses effets antiviraux et stimulants du système immunitaire. Elle est souvent utilisée pour soutenir la santé respiratoire et renforcer les défenses naturelles de l’organisme pendant les saisons de rhume et de grippe. Son arôme frais et camphré aide également à réduire la fatigue mentale et à améliorer la concentration. L’huile de niaouli, autre trésor malgache, offre des bienfaits antiseptiques et anti-inflammatoires doux mais puissants. Elle est souvent utilisée pour apaiser les irritations cutanées, favoriser la cicatrisation et soutenir le bien-être respiratoire. Son parfum subtil, proche de l’eucalyptus, en fait un favori en aromathérapie et en relaxation. Chez Mad’Arom, notre engagement va au-delà de la qualité. Nous travaillons directement avec les petits producteurs à travers Madagascar, garantissant que chaque goutte d’huile est traçable à 100 % de la plante au flacon. Cette approche assure des pratiques de récolte durables qui protègent l’environnement et renforcent les communautés locales. Que votre objectif soit de renforcer l’immunité, de soulager le stress ou d’améliorer la qualité du sommeil, les huiles essentielles malgaches offrent une option naturelle et efficace. Soutenues par des siècles d’usage traditionnel et validées par la recherche scientifique moderne, ces huiles révèlent le pouvoir de guérison de la nature. Découvrez la pureté et la puissance des huiles essentielles malgaches — distillées et mises en flacon avec respect pour les hommes et la planète.",
    image: [
      "./assets/img/articles/article1-001.jpg",
      "./assets/img/articles/article1-002.jpg",
    ],
    theme: "Huiles essentielles",
  },
  {
    id: "ART040825-002",
    date: "Janvier 2025",
    title: "Comment utiliser les huiles essentielles en toute sécurité : guide pour débutants",
    summary: "Les huiles essentielles sont de puissants extraits naturels, mais les utiliser correctement est essentiel pour profiter pleinement de leurs bienfaits. Ce guide pour débutants de Mad’Arom propose des conseils sur la dilution, l’aromathérapie et les bonnes pratiques pour commencer en toute confiance.",
    contenu: "Les huiles essentielles sont des extraits végétaux concentrés au potentiel incroyable — mais elles doivent être utilisées correctement. Chez Mad’Arom, nous mettons l’accent autant sur l’éducation que sur la qualité. Voici quelques conseils de sécurité essentiels pour les débutants : Diluez toujours les huiles essentielles avant de les appliquer sur la peau avec une huile végétale comme l’huile de coco, de jojoba ou d’amande. Évitez toute ingestion sauf sur recommandation d’un aromathérapeute certifié. Faites toujours un test cutané pour vérifier d’éventuelles réactions allergiques. Utilisez un diffuseur pour une inhalation douce et thérapeutique. Conservez vos huiles dans des flacons en verre foncé, à l’abri de la chaleur et du soleil, afin de préserver leur efficacité. En suivant ces précautions, les huiles essentielles peuvent améliorer naturellement et en toute sécurité votre bien-être. Commencez en sécurité, restez au naturel.",
    image: [
      "./assets/img/articles/article2-001.jpg",
      "./assets/img/articles/article2-002.jpg"
    ],
    theme: "Huiles essentielles",
  },
  {
    id: "ART040825-003",
    date: "Août 2025",
    title: "Épices de Madagascar : pourquoi les chefs du monde entier les adorent",
    summary: "Madagascar produit certaines des épices les plus aromatiques et savoureuses au monde. De la vanille Bourbon au poivre noir sauvage, découvrez pourquoi les plus grands chefs font confiance à ces trésors récoltés à la main et issus de filières éthiques.",
    contenu: "Madagascar est un paradis pour les amateurs d’épices. L’île est mondialement célébrée pour la production d’épices de première qualité telles que la vanille Bourbon, le poivre noir sauvage, la cannelle et le clou de girofle. Ces épices sont appréciées non seulement pour leurs saveurs et arômes puissants, mais aussi pour leur pureté et leur traçabilité. Chez Mad’Arom, nous collaborons étroitement avec des cultivateurs locaux qui travaillent de manière biologique et durable. Chaque lot est séché au soleil, trié à la main et emballé avec soin afin de garantir une fraîcheur optimale. Que vous soyez un chef gastronomique ou un cuisinier passionné à domicile, les épices malgaches offrent une expérience sensorielle à la fois éthique et exceptionnelle. Goûtez l’île. Cuisinez avec intention.",
    image: [
      "./assets/img/articles/article3-001.jpg",
      "./assets/img/articles/article3-002.jpg",
    ],
    theme: "Épices",
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
  