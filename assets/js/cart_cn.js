const api_url = "https://madarom-project-production.up.railway.app/api";
let cartItems = [];

function formatPrice(val) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(val);
}

async function fetchCartItems() {
  const token = sessionStorage.getItem("token");

  if (!token) {
    console.warn("Aucun token trouvé → utilisateur non connecté, récupération depuis localStorage.");
  
    const localCart = JSON.parse(localStorage.getItem('cart')) || [];
  
    const detailedCart = await Promise.all(
      localCart.map(async item => {
        const productDetails = await fetchProductDetails(item.product_id);
        if (productDetails) {
          return {
            ...productDetails,   
            quantity: item.quantity
          };
        }
        return null;
      })
    );
  
    cartItems = detailedCart.filter(p => p !== null);
  
    // console.log("Panier local détaillé:", cartItems);
    updateCartDisplay();
    return;
  }

  try {
    const res = await fetch(`${api_url}/cart`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!res.ok) {
      console.error('Erreur API récupération panier:', res.status);
      cartItems = [];
      updateCartDisplay();
      return;
    }

    const sessionCart = await res.json();
    // console.log("cart data:", sessionCart);

    const detailedCart = await Promise.all(
      sessionCart.map(async item => {
        const productDetails = await fetchProductDetails(item.product_id);
        if (productDetails) {
          return {
            ...productDetails,
            quantity: item.quantity
          };
        }
        return null;
      })
    );

    cartItems = detailedCart.filter(p => p !== null);

    updateCartDisplay();

  } catch (error) {
    console.error('Erreur réseau récupération panier:', error);
    cartItems = [];
    updateCartDisplay();
  }
}

async function fetchProductDetails(id) {
  try {
    const res = await fetch(`${api_url}/products/details/${id}`);
    if (!res.ok) {
      console.warn(`Erreur produit ${id} : ${res.status}`);
      return null;
    }
    const data = await res.json();

    // console.log('details produit:', data);

    const price = parseFloat(data.active_price?.amount ?? 0);
    // console.log('prix du produit:', price);
    return {
      id: data.id,
      name_latin: data.name_latin,
      name_en: data.name_en,
      image_path: data.image_path,
      price
    };
  } catch (error) {
    console.error(`Erreur réseau détails produit ${id}:`, error);
    return null;
  }
}

function strictObject(obj) {
  return new Proxy(obj, {
    get(target, prop) {
      if (!(prop in target)) {
        throw new Error(`La propriété "${prop}" est manquante !`);
      }
      return target[prop];
    }
  });
}

function updateCartDisplay() {
  // console.log("updateCartDisplay appelé");
  // console.log("cartItems:", cartItems);

  const cartContainer = document.getElementById("cart-container");
  const summaryItems = document.getElementById("summary-items");
  const clearCartBtn = document.getElementById("btn-open-clear-cart");

  if (!cartContainer || !summaryItems || !clearCartBtn) {
    console.error("Un ou plusieurs éléments HTML du panier sont manquants !");
    return;
  }

  cartContainer.innerHTML = "";
  summaryItems.innerHTML = "";
  let total = 0;

  if (cartItems.length === 0) {
    cartContainer.innerHTML = "<p class='text-gray-500 italic'>您的购物车为空。</p>";
    const totalAmountElement = document.getElementById("total-amount");
    if (totalAmountElement) {
      totalAmountElement.textContent = formatPrice(0);
    }

    clearCartBtn.classList.add("hidden");
    return;
  }

  clearCartBtn.classList.remove("hidden");

  cartItems.forEach((rawItem, index) => {
    const item = strictObject(rawItem);
    const subTotal = item.price * item.quantity;
    total += subTotal;
  
    const productDiv = document.createElement("div");
    productDiv.className = "relative flex-none w-full sm:w-auto snap-start flex flex-col sm:flex-row sm:items-center gap-4 border rounded-lg p-4 shadow-sm bg-white";
  
    productDiv.innerHTML += `
      <button aria-label="Supprimer produit" title="Supprimer" onclick="removeProduct(${index})"
        class="absolute top-2 right-2 danger text-2xl font-bold leading-none z-10">
        &times;
      </button>
  
      <img src="https://www.madarom.net/assets/${item.image_path}" alt="${item.name_en}"
        class="w-28 h-28 sm:w-20 sm:h-20 object-cover rounded-lg mx-auto sm:mx-0" />
  
      <div class="flex flex-col flex-1 text-center sm:text-left gap-2">
        <h3 class="font-semibold text-base sm:text-lg text-primary">${item.name_latin}</h3>
        <p class="text-gray-500 text-sm hidden">单价：<span class="font-medium ">${formatPrice(item.price)}</span></p>
  
        <div class="flex justify-center sm:justify-start items-center gap-2 mt-1">
          <button class="w-8 h-8 bg-gray-200 hover:bg-gray-300 text-xl rounded" onclick="changeQuantity(${index}, -1)">−</button>
          <input type="number" min="1" value="${item.quantity}" 
            class="w-12 text-center border border-gray-300 rounded py-1 text-base" 
            onchange="onQuantityInputChange(event, ${index})" />
          <button class="w-8 h-8 bg-gray-200 hover:bg-gray-300 text-xl rounded" onclick="changeQuantity(${index}, 1)">+</button>
        </div>
      </div>
  
      <div class="flex flex-col items-center sm:items-end gap-2 mt-3 sm:mt-0 min-w-[80px] hidden">
        <div class="font-bold text-lg text-teal-700">${formatPrice(subTotal)}</div>
      </div>
    `;
  
    cartContainer.appendChild(productDiv);
  });
  
  const summaryLine = document.createElement("div");
  summaryLine.className = "rounded-lg text-sm bg-white";
  
  summaryLine.innerHTML = `
  <div class="rounded-md text-sm text-gray-400 text-left">
    请确认您的购物车以获取个性化报价并进行采购订单申请。
  </div>
`;

  
  summaryItems.appendChild(summaryLine);
  

  const totalAmountElement = document.getElementById("total-amount");
  if (totalAmountElement) {
    totalAmountElement.textContent = formatPrice(total);
  }
}

  window.changeQuantity = async function (index, delta) {
  const product = cartItems[index];
  const newQty = product.quantity + delta;
  if (newQty < 1) return;

  const success = await updateCartQuantity(product.id, newQty);
  if (success) {
    cartItems[index].quantity = newQty;
    updateCartDisplay();
  }
}

  window.onQuantityInputChange = async function(e, index) {
  let val = parseInt(e.target.value);
  if (isNaN(val) || val < 1) {
    val = 1;
    e.target.value = val;
  }

  const product = cartItems[index];
  const success = await updateCartQuantity(product.id, val);
  if (success) {
    product.quantity = val;
    updateCartDisplay();
  } else {
    e.target.value = product.quantity;
  }
}

async function updateCartQuantity(productId, quantity) {
  const token = sessionStorage.getItem("token");
  if (!token) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const item = cart.find(i => i.product_id === productId);
    if (item) {
      item.quantity = quantity;
      localStorage.setItem('cart', JSON.stringify(cart));
      return true;
    }
    return false;
  }

  try {
    const res = await fetch(`${api_url}/cart/${productId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ quantity })
    });

    return res.ok;
  } catch (error) {
    console.error("Erreur réseau mise à jour:", error);
    return false;
  }
}

async function removeProductFromCart(productId) {
  const token = sessionStorage.getItem("token");
  if (!token) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(i => i.product_id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    return true;
  }

  try {
    const res = await fetch(`${api_url}/cart/${productId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return res.ok;
  } catch (error) {
    console.error("Erreur suppression produit:", error);
    return false;
  }
}

let productToRemoveIndex = null;

window.removeProduct = function(index) {
  productToRemoveIndex = index;
  const productName = cartItems[index]?.name_latin || "ce produit";
  document.getElementById("product-name-to-remove").textContent = productName;
  document.getElementById("confirm-modal").classList.remove("hidden");
}

document.addEventListener("DOMContentLoaded", async () => {
  console.log("DOM prêt, on appelle fetchCartItems()");

  await fetchCartItems();

  const clearCartBtn = document.getElementById("btn-open-clear-cart");
  if (clearCartBtn) {
    clearCartBtn.addEventListener("click", () => {
      const modal = document.getElementById("clearCartModal");
      const modalContent = document.getElementById("modalContent");
      if (!modal || !modalContent) return;

      modal.classList.remove("hidden");

      setTimeout(() => {
        modalContent.classList.remove("opacity-0", "translate-y-10");
      }, 50);
    });
  }

  const btnCloseClearCart = document.getElementById("btn-close-clear-cart");
  if (btnCloseClearCart) {
    btnCloseClearCart.addEventListener("click", () => {
      const modal = document.getElementById("clearCartModal");
      if (modal) modal.classList.add("hidden");
    });
  }

  const btnConfirmClearCart = document.getElementById("btn-confirm-clear-cart");
  if (btnConfirmClearCart) {
    btnConfirmClearCart.addEventListener("click", () => {
      clearCart();
    });
  }

  const confirmBtn = document.getElementById("confirm-btn");
  if (confirmBtn) {
    confirmBtn.addEventListener("click", async () => {
      if (productToRemoveIndex !== null) {
        const productId = cartItems[productToRemoveIndex]?.id;
        const success = await removeProductFromCart(productId);
        if (success) {
          cartItems.splice(productToRemoveIndex, 1);
          updateCartDisplay();
        }
        document.getElementById("confirm-modal").classList.add("hidden");
        productToRemoveIndex = null;
      }
    });
  }

  const cancelBtn = document.getElementById("cancel-btn");
  if (cancelBtn) {
    cancelBtn.addEventListener("click", () => {
      document.getElementById("confirm-modal").classList.add("hidden");
      productToRemoveIndex = null;
    });
  }

  const requestQuoteBtn = document.getElementById("request-quote");

  if (requestQuoteBtn) {
    requestQuoteBtn.addEventListener("click", async () => {
      const token = sessionStorage.getItem("token");
  
      if (!token) {
        saveLastUrl();
        window.location.href = "/signin";
      }

      const notes = "Quote request";
  
      try {

        const res = await fetch(`${api_url}/quote`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ notes })
        });
  
        if (res.ok) {
          alert("Quote request sent successfully!");
        } else {
          const errorData = await res.json();
          console.error("Network error:", errorData.error);

        }
      } catch (error) {
        console.error("Network error:", error);
      }
    });
  }
  
});

async function clearCart() {
  const token = sessionStorage.getItem("token");

  if (!token) {
    localStorage.removeItem("cart");
    cartItems = [];
    updateCartDisplay();
    return;
  }

  const confirmBtn = document.getElementById("btn-open-clear-cart");
  const spinner = document.getElementById("loadingSpinner");
  const confirmText = document.getElementById("confirmText");
  const message = document.getElementById("clearCartMessage");

  if (!confirmBtn || !spinner || !confirmText || !message) {
    console.error("Éléments modaux manquants pour clearCart");
    return;
  }

  spinner.classList.remove("opacity-0", "scale-90");
  confirmText.classList.add("opacity-50");
  confirmBtn.disabled = true;

  try {
    const res = await fetch(`${api_url}/cart`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (res.ok) {
      cartItems = [];
      updateCartDisplay();

      message.classList.remove("hidden");
    } else {
      console.error("Échec suppression panier:", res.status);
    }
  } catch (error) {
    console.error("Erreur réseau clearCart:", error);
  }

  setTimeout(() => {
    const modal = document.getElementById("clearCartModal");
    if (modal) modal.classList.add("hidden");
    spinner.classList.add("opacity-0", "scale-90");
    confirmText.classList.remove("opacity-50");
    confirmBtn.disabled = false;
    message.classList.add("hidden");
  }, 1500);
}

function saveLastUrl() {
  const currentUrl = window.location.href;
  if (
    !currentUrl.includes("/signin") &&
    !currentUrl.includes("/signup")
  ) {
    localStorage.setItem("last_url", currentUrl);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const token = sessionStorage.getItem("token"); 
  const userMenus = document.getElementById("user-menus");

  if (token) {
    userMenus.classList.remove("hidden");
  }
});

const whatsappBtn = document.getElementById('whatsapp-btn');

window.addEventListener('scroll', () => {
  if (window.scrollY > 100) {
    whatsappBtn.classList.add('collapsed');
  } else {
    whatsappBtn.classList.remove('collapsed');
  }
});  