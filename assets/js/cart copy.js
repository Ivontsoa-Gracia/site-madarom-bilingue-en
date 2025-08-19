let cartItems = JSON.parse(localStorage.getItem("cart")) || [];

    function formatPrice(val) {
      return val.toLocaleString("fr-MG") + " Ar";
    }

    // Sauvegarde panier et met à jour affichage
    function saveCartAndUpdate() {
      localStorage.setItem("cart", JSON.stringify(cartItems));
      updateCartDisplay();
    }

    function changeQuantity(index, delta) {
      const newQty = cartItems[index].quantity + delta;
      if (newQty < 1) return;
      cartItems[index].quantity = newQty;
      saveCartAndUpdate();
    }

    function onQuantityInputChange(e, index) {
      let val = parseInt(e.target.value);
      if (isNaN(val) || val < 1) {
        val = 1;
        e.target.value = val;
      }
      cartItems[index].quantity = val;
      saveCartAndUpdate();
    }

    // Modal suppression
    let productToRemoveIndex = null;
    function removeProduct(index) {
      productToRemoveIndex = index;
      const productName = cartItems[index]?.name_latin || "ce produit";
      document.getElementById("product-name-to-remove").textContent = productName;
      document.getElementById("confirm-modal").classList.remove("hidden");
    }
    document.getElementById("cancel-btn").addEventListener("click", () => {
      productToRemoveIndex = null;
      document.getElementById("confirm-modal").classList.add("hidden");
    });
    document.getElementById("confirm-btn").addEventListener("click", () => {
      if (productToRemoveIndex !== null) {
        cartItems.splice(productToRemoveIndex, 1);
        saveCartAndUpdate();
        productToRemoveIndex = null;
      }
      document.getElementById("confirm-modal").classList.add("hidden");
    });

    // Mise à jour de l'affichage panier et résumé
    function updateCartDisplay() {
      const cartContainer = document.getElementById("cart-container");
      const summaryItems = document.getElementById("summary-items");
      const clearCartBtn = document.getElementById("btn-open-clear-cart");
      let total = 0;

      cartContainer.innerHTML = "";
      summaryItems.innerHTML = "";

      if (cartItems.length === 0) {
        cartContainer.innerHTML = "<p class='text-gray-500 italic'>Votre panier est vide.</p>";
        document.getElementById("total-amount").textContent = formatPrice(0);
        clearCartBtn.classList.add("hidden");
        return;
      } else {
        clearCartBtn.classList.remove("hidden");
      }

      cartItems.forEach((item, index) => {
        const { image_path, name_latin, name_en, quantity } = item;
        const price = item.price ?? 100; 
        const subTotal = price * quantity;
        total += subTotal;
      
        const productDiv = document.createElement("div");
        productDiv.className = `
        relative flex-none w-[85vw] sm:w-auto snap-start
        flex flex-col sm:flex-row sm:items-center gap-4 border rounded-lg p-4 shadow-sm 
        sm:gap-6 bg-white sm:bg-transparent
      `;
      

        productDiv.innerHTML = `
        <button aria-label="Supprimer produit" title="Supprimer" onclick="removeProduct(${index})"
          class="absolute top-2 right-2 text-red-600 hover:text-red-800 text-2xl font-bold leading-none z-10">
          &times;
        </button>
      
        <img src="https://www.madarom.net/${image_path}" alt="${name_en}"
          class="w-28 h-28 sm:w-20 sm:h-20 object-cover rounded-lg mx-auto sm:mx-0" />
      
        <div class="flex flex-col flex-1 text-center sm:text-left gap-2">
          <h3 class="font-semibold text-base sm:text-lg text-primary">${name_latin}</h3>
          <p class="text-gray-500 text-sm">Prix unitaire : <span class="font-medium">${formatPrice(price)}</span></p>
      
          <div class="flex justify-center sm:justify-start items-center gap-2 mt-1">
            <button class="w-8 h-8 bg-gray-200 hover:bg-gray-300 text-xl rounded" onclick="changeQuantity(${index}, -1)">−</button>
            <input type="number" min="1" value="${quantity}" 
              class="w-12 text-center border border-gray-300 rounded py-1 text-base" 
              onchange="onQuantityInputChange(event, ${index})" />
            <button class="w-8 h-8 bg-gray-200 hover:bg-gray-300 text-xl rounded" onclick="changeQuantity(${index}, 1)">+</button>
          </div>
        </div>
      
        <div class="flex flex-col items-center sm:items-end gap-2 mt-3 sm:mt-0 min-w-[80px]">
          <div class="font-bold text-lg text-teal-700">${formatPrice(subTotal)}</div>
        </div>
      `;
      
      
        cartContainer.appendChild(productDiv);
      
        const summaryLine = document.createElement("div");

        summaryLine.className = `
        grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 p-3 sm:p-0 
        border border-gray-200 sm:border-none rounded-lg sm:rounded-none mb-3 sm:mb-0 
        text-sm sm:text-base shadow-sm sm:shadow-none bg-white sm:bg-transparent
      `;
      
        summaryLine.innerHTML = `
          <div class="font-semibold text-gray-700 sm:text-center text-primary">
            <span class="block sm:hidden text-gray-400 text-xs mb-1">Qté</span>
            ${quantity}
          </div>
          <div class="font-semibold text-gray-900 sm:text-left">
            <span class="block sm:hidden text-gray-400 text-xs mb-1 text-primary">Produit</span>
            ${name_latin}
          </div>
          <div class="font-semibold text-teal-600">
            <span class="block sm:hidden text-gray-400 text-xs mb-1">Prix Unitaire</span>
            ${formatPrice(price)}
          </div>
          <div class="font-bold text-right text-teal-800">
            <span class="block sm:hidden text-gray-400 text-xs mb-1">Total</span>
            ${formatPrice(subTotal)}
          </div>
        `;
        
        
        summaryItems.appendChild(summaryLine);
      });
      

      document.getElementById("total-amount").textContent = formatPrice(total);
    }

    document.getElementById("request-quote").addEventListener("click", () => {
      alert("Fonction 'Demander un devis' à implémenter !");
    });

    updateCartDisplay();

    document.addEventListener("DOMContentLoaded", () => {
      const modal = document.getElementById("clearCartModal");
      const modalContent = document.getElementById("modalContent");
      const btnOpen = document.getElementById("btn-open-clear-cart");
      const btnClose = document.getElementById("btn-close-clear-cart");
      const btnConfirm = document.getElementById("btn-confirm-clear-cart");
      const spinner = document.getElementById("loadingSpinner");
      const confirmText = document.getElementById("confirmText");
      const clearCartMessage = document.getElementById("clearCartMessage");
      const clearCartButtons = document.getElementById("clearCartButtons");

      function showModal() {
        modal.classList.remove("hidden");
        // Animate in: opacity 0 -> 100, translate-y-10 -> 0
        setTimeout(() => {
          modalContent.classList.remove("opacity-0", "translate-y-10");
          modalContent.classList.add("opacity-100", "translate-y-0");
        }, 10);

        // Reset UI
        spinner.classList.add("hidden");
        confirmText.classList.remove("hidden");
        clearCartMessage.classList.add("hidden");
        clearCartButtons.classList.remove("pointer-events-none");
      }

      function hideModal() {
        // Animate out: opacity 100 -> 0, translate-y-0 -> 10
        modalContent.classList.remove("opacity-100", "translate-y-0");
        modalContent.classList.add("opacity-0", "translate-y-10");

        setTimeout(() => {
          modal.classList.add("hidden");
        }, 300); // Match duration-300
      }

      btnOpen.addEventListener("click", showModal);
      btnClose.addEventListener("click", hideModal);

      btnConfirm.addEventListener("click", () => {
        spinner.classList.remove("hidden");
        confirmText.classList.add("hidden");
        clearCartButtons.classList.add("pointer-events-none");

        setTimeout(() => {
          localStorage.removeItem("cart");
          cartItems = [];
          updateCartDisplay();

          spinner.classList.add("hidden");
          clearCartMessage.classList.remove("hidden");

          setTimeout(() => {
            hideModal();
            clearCartMessage.classList.add("hidden");
            clearCartButtons.classList.remove("pointer-events-none");
            confirmText.classList.remove("hidden");
          }, 2000);
        }, 1500);
      });
    });

    document.addEventListener("DOMContentLoaded", () => {
      const scrollContainer = document.getElementById("cart-container");
      const btnLeft = document.getElementById("scroll-left");
      const btnRight = document.getElementById("scroll-right");
    
      const scrollAmount = 250; // pixels to scroll per click
    
      btnLeft?.addEventListener("click", () => {
        scrollContainer.scrollBy({ left: -scrollAmount, behavior: "smooth" });
      });
    
      btnRight?.addEventListener("click", () => {
        scrollContainer.scrollBy({ left: scrollAmount, behavior: "smooth" });
      });
    });
    

    const steps = [
      { label: "Cart", icon: "fas fa-shopping-cart" },
      { label: "Quote", icon: "fas fa-file-invoice" },
      { label: "Purchase Order", icon: "fas fa-box" },
      { label: "Payment", icon: "fas fa-credit-card" },
      { label: "Delivery", icon: "fas fa-truck" },
      { label: "User", icon: "fas fa-user-circle" },
    ];
  
    let currentStep = 0;
  
    const stepsContainer = document.getElementById("steps-container");
    const progressBar = document.getElementById("progress-bar");
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");
  
    function renderSteps() {
      stepsContainer.innerHTML = "";
  
      steps.forEach((step, index) => {
        const isCompleted = index < currentStep;
        const isActive = index === currentStep;
  
        // Create step wrapper
        const stepEl = document.createElement("div");
        stepEl.className = "flex flex-col items-center w-16 text-center relative";
  
        // Circle with icon
        const circle = document.createElement("div");
        circle.className = `
          w-12 h-12 rounded-full flex items-center justify-center border-4 transition-all duration-500 ease-in-out
          ${isCompleted ? "bg-teal-600 border-teal-600 text-white" : ""}
          ${isActive ? "bg-white border-teal-600 text-teal-600 shadow-lg" : ""}
          ${(!isActive && !isCompleted) ? "bg-white border-gray-300 text-gray-400" : ""}
        `;
        const icon = document.createElement("i");
        icon.className = step.icon + " text-xl";
        circle.appendChild(icon);
  
        // Label below icon
        const label = document.createElement("span");
        label.textContent = step.label;
        label.className = `
          mt-2 text-xs font-semibold
          ${isCompleted ? "text-teal-600" : ""}
          ${isActive ? "text-teal-600" : "text-gray-400"}
        `;
  
        stepEl.appendChild(circle);
        stepEl.appendChild(label);
        stepsContainer.appendChild(stepEl);
      });
  
      // Update progress bar width
      const progressPercent = (currentStep) / (steps.length - 1) * 100;
      progressBar.style.width = `${progressPercent}%`;
  
      // Enable/disable buttons
      prevBtn.disabled = currentStep === 0;
      nextBtn.disabled = currentStep === steps.length - 1;
    }
  
    prevBtn.addEventListener("click", () => {
      if (currentStep > 0) {
        currentStep--;
        renderSteps();
      }
    });
  
    nextBtn.addEventListener("click", () => {
      if (currentStep < steps.length - 1) {
        currentStep++;
        renderSteps();
      }
    });
  
    // Initial render
    renderSteps();