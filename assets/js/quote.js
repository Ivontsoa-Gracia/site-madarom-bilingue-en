let allQuotes = [];

const tbody = document.getElementById('quotesBody');
const filterDate = document.getElementById('filterDate');
const sortOrder = document.getElementById('sortOrder');

function renderQuotes(data) {
  tbody.innerHTML = '';
  if (data.length === 0) {
    tbody.innerHTML = `<tr><td colspan="4" class="px-6 py-4 text-center text-gray-500">No quotes found.</td></tr>`;
    return;
  }

  data.forEach(quote => {

    let total = 0;
    quote.items.forEach(item => {
      total += item.price_snapshot * item.quantity;
    });

    tbody.innerHTML += `
      <tr class="hover:bg-gray-50">
        <td class="px-6 py-4 text-sm flex items-center gap-2">
          <div class="w-16 h-16 flex justify-center items-center bg-gray-50 rounded-full">
            <i class="fas fa-file-pdf text-gray-400 text-2xl"></i>
          </div>
          ${quote.quote_number || 'N/A'}
        </td>
        <td class="px-6 py-4 text-sm">
          ${formatPrice(total)}
        </td>
        <td class="px-6 py-4 text-sm">
          ${quote.quote.created_at.split('T')[0]}
        </td>
      
        <td class="px-6 py-4 text-sm flex gap-2">
          <button onclick="viewQuote('${quote.id}')" class="btn-default text-[#333333] px-3 py-1 rounded text-sm flex items-center gap-1">
            <i class="bx bx-show"></i> View
          </button>
          <button onclick="orderQuote('${quote.quote.id}')" class="btn-primary text-white px-3 py-1 rounded text-sm flex items-center gap-1">
            <i class="bx bx-cart"></i> Order
          </button>
          <button onclick="clearQuote('${quote.quote_number}')" class="btn-default px-3 py-1 rounded text-sm flex items-center gap-1">
            <i class="bx bx-trash"></i> Clear
          </button>
        </td>
      </tr>
  
    `;
  });
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
  const token = localStorage.getItem("token");

  if (!token) {
    alert("No token found. Please log in.");
    return;
  }

  try {
    const response = await fetch("http://127.0.0.1:8000/api/quote/user", {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) {
      throw new Error("Failed to fetch quotes.");
      
    }

    const data = await response.json();
    allQuotes = data.filter(quote => quote.quote.status?.toLowerCase() === "pending");
    applyFilters();
  } catch (error) {
    console.error("Error:", error);
    alert("Error loading quotes.");
  }
}

async function viewQuote(id) {
  if (!id) return;
  window.location.href = `/show?ref=${encodeURIComponent(id)}`;

}

async function orderQuote(id) {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("No token found. Please log in.");
    return;
  }

  try {
    const response = await fetch(`http://127.0.0.1:8000/api/quote/order/${id}`, {
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
      alert(`Erreur ${response.status}: ${data.message || "Voir console pour détails"}`);
      return;
    }
    
  } catch (error) {
    console.error("Error:", error);
    alert("Erreur réseau ou inattendue: " + error.message);
  }
}


  
function clearQuote(ref) {
  alert(`Clearing quote: ${ref}`);
  // Ici tu peux ajouter la logique réelle pour supprimer ou archiver le devis
}

// Event listeners
filterDate.addEventListener('input', applyFilters);
sortOrder.addEventListener('change', applyFilters);

// Initial load
fetchUserQuotes();

function formatPrice(val) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(val);
}