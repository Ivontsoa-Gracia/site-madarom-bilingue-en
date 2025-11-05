let allQuotes = [];
let currentPage = 1;
const itemsPerPage = 3;

const tbody = document.getElementById('quotesBody');
const filterDate = document.getElementById('filterDate');
const sortOrder = document.getElementById('sortOrder');
const pagination = document.getElementById('pagination');

function renderQuotes(data) {
  tbody.innerHTML = '';
  if (data.length === 0) {
    tbody.innerHTML = `<tr><td colspan="4" class="px-6 py-4 text-center text-gray-500">No quotes found.</td></tr>`;
    pagination.innerHTML = '';
    return;
  }

  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const paginated = data.slice(start, end);

  paginated.forEach(quote => {
    let total = 0;
    quote.items.forEach(item => {
      total += item.price_snapshot * item.quantity;
    });

    tbody.innerHTML += `
      <tr class="hover:bg-gray-50 text-[#333333]">
        <td class="px-6 py-4 text-sm flex items-center gap-2 font-semibold">
          <div class="w-16 h-16 flex justify-center items-center bg-gray-50 rounded-full">
            <i class="fas fa-file-pdf text-gray-400 text-2xl"></i>
          </div>
          ${quote.quote.reference || 'N/A'}
        </td>
        <td class="px-6 py-4 text-lg font-semibold">${formatPrice(total)}</td>
        <td class="px-6 py-4 text-sm">${quote.quote.created_at.split('T')[0]}</td>
        <td class="px-6 py-4 text-sm">
          <div class="inline-flex rounded-full overflow-hidden shadow-sm">
            <button onclick="viewQuote('${quote.id}')"
              class="btn-default text-[#333333] px-3 py-1 text-sm flex items-center gap-1 rounded-l-full border-r">
              <i class="bx bx-show"></i> Voir
            </button>
            <button onclick="openModal('order', '${quote.quote.id}')"
              class="btn-primary text-white px-3 py-1 text-sm flex items-center gap-1">
              <i class="bx bx-cart"></i> Commander
            </button>
            <button onclick="openModal('cancel', '${quote.quote.id}')"
              class="btn-default px-3 py-1 text-sm flex items-center gap-1 rounded-r-full border-l">
              <i class="bx bx-trash"></i> Supprimer
            </button>
          </div>
        </td>
      
      </tr>
    `;
  });

  renderPagination(data.length);
}

function renderPagination(totalItems) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  pagination.innerHTML = '';

  if (totalPages <= 1) return;

  const prevBtn = document.createElement('button');
  prevBtn.innerHTML = `&laquo;`;
  prevBtn.disabled = currentPage === 1;
  prevBtn.className = `px-3 py-1 rounded-full ${
    currentPage === 1 ? 'border border-gray-300 text-gray-600 hover:bg-gray-100 cursor-not-allowed' : 'border border-gray-300 text-gray-600 hover:bg-gray-100'
  }`;
  prevBtn.onclick = () => {
    if (currentPage > 1) {
      currentPage--;
      applyFilters();
    }
  };
  pagination.appendChild(prevBtn);

  const maxVisible = 7; 
  let startPage = 1;
  let endPage = totalPages;

  if (totalPages > 10) {
    if (currentPage <= 4) {
      startPage = 1;
      endPage = 5;
    } else if (currentPage >= totalPages - 3) {
      startPage = totalPages - 4;
      endPage = totalPages;
    } else {
      startPage = currentPage - 2;
      endPage = currentPage + 2;
    }
  }

  addPageButton(1);
  if (startPage > 2) {
    addDots();
  }

  for (let i = startPage; i <= endPage; i++) {
    if (i !== 1 && i !== totalPages) {
      addPageButton(i);
    }
  }

  if (endPage < totalPages - 1) {
    addDots();
  }

  if (totalPages > 1) {
    addPageButton(totalPages);
  }

  const nextBtn = document.createElement('button');
  nextBtn.innerHTML = `&raquo;`;
  nextBtn.disabled = currentPage === totalPages;
  nextBtn.className = `px-3 py-1 rounded-full ${
    currentPage === totalPages ? 'border border-gray-300 text-gray-600 hover:bg-gray-100 cursor-not-allowed' : 'border border-gray-300 text-gray-600 hover:bg-gray-100'
  }`;
  nextBtn.onclick = () => {
    if (currentPage < totalPages) {
      currentPage++;
      applyFilters();
    }
  };
  pagination.appendChild(nextBtn);

  function addPageButton(page) {
    const btn = document.createElement('button');
    btn.innerText = page;
    btn.className = `px-4 py-1 rounded-full border ${
      page === currentPage 
        ? 'bg-teal text-white' 
        : 'border-gray-300 text-gray-600 hover:bg-gray-100'
    }`;
    btn.onclick = () => {
      currentPage = page;
      applyFilters();
    };
    pagination.appendChild(btn);
  }

  function addDots() {
    const span = document.createElement('span');
    span.innerText = '...';
    span.className = 'px-2 text-gray-500';
    pagination.appendChild(span);
  }
}

function applyFilters() {
  let filtered = [...allQuotes];
  const dateVal = filterDate.value;
  const sort = sortOrder.value;

  if (dateVal) {
    filtered = filtered.filter(q => q.created_at.startsWith(dateVal));
  }

  filtered.sort((a, b) => {
    const dateA = new Date(a.created_at);
    const dateB = new Date(b.created_at);
    return sort === 'desc' ? dateB - dateA : dateA - dateB;
  });

  renderQuotes(filtered);
}

async function fetchUserQuotes() {
  const token = sessionStorage.getItem("token");

  if (!token) {
    alert("No token found. Please log in.");
    return;
  }

  try {
    const response = await fetch("https://madarom-project-production.up.railway.app/api/quote/user", {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) throw new Error("Failed to fetch quotes.");

    const data = await response.json();
    allQuotes = data.filter(quote => quote.quote.status?.toLowerCase() === "pending");
    applyFilters();
  } catch (error) {
    console.error("Error:", error);
    alert("Error loading quotes.");
  }
}

filterDate.addEventListener('input', applyFilters);
sortOrder.addEventListener('change', applyFilters);
fetchUserQuotes();

function formatPrice(val) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(val);
}

async function viewQuote(id) {
  if (!id) return;
  const lang = sessionStorage.getItem('lang').toLowerCase();
  window.location.href = `/fr/quote/show?ref=${encodeURIComponent(id)}`;

}

async function orderQuote(id) {
  const token = sessionStorage.getItem("token");
  if (!token) {
    alert("No token found. Please log in.");
    return;
  }

  try {
    showLoader(2000);

    const response = await fetch(`https://madarom-project-production.up.railway.app/api/quote/order/${id}`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    const data = await response.json().catch(() => ({})); 

    if (!response.ok) {
      let data = {};
      try { data = await response.json(); } catch (err) {}
      console.error("Backend error:", data);
      return;
    }
    
    showToast("Order placed successfully!");
  } catch (error) {
    console.error("Error:", error);
  }
}

async function clearQuote(id) {
  const token = sessionStorage.getItem("token");
  if (!token) {
    return;
  }

  try {
    showLoader(2000);

    const response = await fetch(`https://madarom-project-production.up.railway.app/api/quote/cancel/${id}`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    const data = await response.json().catch(() => ({})); 

    if (!response.ok) {
      let data = {};
      try { data = await response.json(); } catch (err) {}
      console.error("Backend error:", data);
      return;
    }
    
    showToast("Quote cancelled successfully!");

  } catch (error) {
    console.error("Error:", error);
    alert("Erreur réseau ou inattendue: " + error.message);
  }
}

let selectedQuoteId = null;

function openModal(type, id) {
  selectedQuoteId = id;
  document.getElementById(type + "Modal").classList.remove("hidden");
}

function closeModal(type) {
  document.getElementById(type).classList.add("hidden");
  selectedQuoteId = null;
}

document.getElementById("confirmOrderBtn").addEventListener("click", async () => {
  if (selectedQuoteId) {
    await orderQuote(selectedQuoteId);
    closeModal("orderModal");
  }
});

document.getElementById("confirmCancelBtn").addEventListener("click", async () => {
  if (selectedQuoteId) {
    await clearQuote(selectedQuoteId);
    closeModal("cancelModal");
  }
});

function showLoader(duration = 2000) {
  const loader = document.getElementById("loader");
  loader.classList.remove("hidden");

  setTimeout(() => {
    loader.classList.add("hidden");
  }, duration);
}

function hideLoader() {
  document.getElementById("loader").classList.add("hidden");
}

function showToast(message = "Action successful!", duration = 2500) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.remove("hidden");
  setTimeout(() => {
    toast.classList.add("hidden");
  }, duration);
}

document.addEventListener("DOMContentLoaded", () => {
  const token = sessionStorage.getItem("token"); 
  const userMenus = document.getElementById("user-menus");

  if (token) {
    userMenus.classList.remove("hidden");
  }
});