const api_url = "http://127.0.0.1:8000/api";
let cartItems = [];

// Format prix USD
function formatPrice(val) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(val);
}

// Récupère le panier utilisateur depuis la session (liste d’objets avec product_id et quantity)
async function fetchCartItems() {
  const token = localStorage.getItem("token");
  if (!token) {
    console.warn("Aucun token trouvé dans localStorage → utilisateur non connecté.");
    cartItems = [];
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

    console.log("cart data: ", sessionCart);

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
    console.log("detailedCart après filtrage:", cartItems);

    updateCartDisplay();

  } catch (error) {
    console.error('Erreur réseau récupération panier:', error);
    cartItems = [];
    updateCartDisplay();
  }
}

// Récupère les détails d’un produit via /products/details/{id}
async function fetchProductDetails(id) {
  try {
    const res = await fetch(`${api_url}/products/details/${id}`);
    if (!res.ok) {
      console.warn(`Erreur produit ${id} : ${res.status}`);
      return null;
    }
    const data = await res.json();

    console.log('details produit:', data);

    const price = parseFloat(data.active_price?.amount ?? 0);
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

// Met à jour le panier avec les nouveaux détails
function updateCartDisplay() {
  console.log("updateCartDisplay appelé");
  console.log("cartItems:", cartItems);

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
    cartContainer.innerHTML = "<p class='text-gray-500 italic'>Votre panier est vide.</p>";
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
  
      <img src="https://www.madarom.net/${item.image_path}" alt="${item.name_en}"
        class="w-28 h-28 sm:w-20 sm:h-20 object-cover rounded-lg mx-auto sm:mx-0" />
  
      <div class="flex flex-col flex-1 text-center sm:text-left gap-2">
        <h3 class="font-semibold text-base sm:text-lg text-primary">${item.name_latin}</h3>
        <p class="text-gray-500 text-sm">Unit Price : <span class="font-medium">${formatPrice(item.price)}</span></p>
  
        <div class="flex justify-center sm:justify-start items-center gap-2 mt-1">
          <button class="w-8 h-8 bg-gray-200 hover:bg-gray-300 text-xl rounded" onclick="changeQuantity(${index}, -1)">−</button>
          <input type="number" min="1" value="${item.quantity}" 
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
  });
  
  // Afficher une seule fois le résumé APRÈS la boucle
  const summaryLine = document.createElement("div");
  summaryLine.className = "rounded-lg text-sm bg-white";
  
  summaryLine.innerHTML = `
    <div class="rounded-md text-sm text-gray-400 text-left">
      Validate your cart to receive a personalized quote and proceed with a purchase order request.
    </div>
  `;
  
  summaryItems.appendChild(summaryLine);
  

  const totalAmountElement = document.getElementById("total-amount");
  if (totalAmountElement) {
    totalAmountElement.textContent = formatPrice(total);
  }
}

// Change la quantité et met à jour l’API
async function changeQuantity(index, delta) {
  const product = cartItems[index];
  const newQty = product.quantity + delta;
  if (newQty < 1) return;

  const success = await updateCartQuantity(product.id, newQty);
  if (success) {
    cartItems[index].quantity = newQty;
    updateCartDisplay();
  }
}

// Saisie directe dans l’input de quantité
async function onQuantityInputChange(e, index) {
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

// Met à jour la quantité d’un produit via API
async function updateCartQuantity(productId, quantity) {
  const token = localStorage.getItem("token");
  if (!token) return false;

  try {
    const res = await fetch(`${api_url}/cart/${productId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ quantity })
    });

    if (!res.ok) {
      console.error("Erreur API update:", res.status);
      return false;
    }

    return true;

  } catch (error) {
    console.error("Erreur réseau mise à jour:", error);
    return false;
  }
}

// Supprime un produit du panier
async function removeProductFromCart(productId) {
  const token = localStorage.getItem("token");
  if (!token) return false;

  try {
    const res = await fetch(`${api_url}/cart/${productId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    return res.ok;

  } catch (error) {
    console.error("Erreur suppression produit:", error);
    return false;
  }
}

// Supprime un produit via modal
let productToRemoveIndex = null;

function removeProduct(index) {
  productToRemoveIndex = index;
  const productName = cartItems[index]?.name_latin || "ce produit";
  document.getElementById("product-name-to-remove").textContent = productName;
  document.getElementById("confirm-modal").classList.remove("hidden");
}

// Écouteurs d’événements ajoutés UNE SEULE FOIS au chargement DOM
document.addEventListener("DOMContentLoaded", async () => {
  console.log("DOM prêt, on appelle fetchCartItems()");

  await fetchCartItems();

  // Listeners modaux et boutons
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

  // Modal suppression produit
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

  // Request quote button
  const requestQuoteBtn = document.getElementById("request-quote");
  if (requestQuoteBtn) {
    requestQuoteBtn.addEventListener("click", async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please log in to request a quote.");
        return;
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
          const data = await res.json();
          alert("Quote request sent successfully!");
        } else {
          const errorData = await res.json();
          alert("Error: " + (errorData.error || "Failed to send quote request"));
        }
      } catch (error) {
        console.error("Network error:", error);
        alert("Network error, please try again later.");
      }
    });
  }
});

// Supprime tout le panier via l'API
async function clearCart() {
  const token = localStorage.getItem("token");
  if (!token) return;

  const confirmBtn = document.getElementById("btn-open-clear-cart");
  const spinner = document.getElementById("loadingSpinner");
  const confirmText = document.getElementById("confirmText");
  const message = document.getElementById("clearCartMessage");

  if (!confirmBtn || !spinner || !confirmText || !message) {
    console.error("Éléments modaux manquants pour clearCart");
    return;
  }

  // UI loading state
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

      // Affiche le message de succès
      message.classList.remove("hidden");
    } else {
      console.error("Échec suppression panier:", res.status);
    }
  } catch (error) {
    console.error("Erreur réseau clearCart:", error);
  }

  // Reset UI state après un petit délai
  setTimeout(() => {
    const modal = document.getElementById("clearCartModal");
    if (modal) modal.classList.add("hidden");
    spinner.classList.add("opacity-0", "scale-90");
    confirmText.classList.remove("opacity-50");
    confirmBtn.disabled = false;
    message.classList.add("hidden");
  }, 1500);
}

document.getElementById("request-quote").addEventListener("click", async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("Please log in to request a quote.");
    return;
  }

  // Tu peux ajouter ici des notes optionnelles, par ex. un prompt ou un champ
  // const notes = prompt("Add any notes for your quote request (optional):") || "";
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
      const data = await res.json();
      alert("Quote request sent successfully!");
      // Optionnel : rediriger, vider panier ou autre action
    } else {
      const errorData = await res.json();
      alert("Error: " + (errorData.error || "Failed to send quote request"));
    }
  } catch (error) {
    console.error("Network error:", error);
    alert("Network error, please try again later.");
  }
});

