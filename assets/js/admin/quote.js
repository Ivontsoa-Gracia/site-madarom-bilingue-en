function initQuotes() {
    let allQuotes = [];
    let currentPage = 1;
    const itemsPerPage = 3;

    const tbody = document.getElementById('quotesBody');
    const filterDate = document.getElementById('filterDate');
    const sortOrder = document.getElementById('sortOrder');
    const statusFilter = document.getElementById('statusFilter');
    const pagination = document.getElementById('pagination');

    const renderStatusBadge = (status) => {
      const base = "px-2 py-1 rounded-full text-xs font-medium";
      switch (status) {
        case "validated":
          return `<span class="${base} bg-success/10 text-success">Validated</span>`;
        case "pending":
          return `<span class="${base} bg-warning/10 text-yellow-800">Pending</span>`;
        case "refused":
          return `<span class="${base} bg-danger/10 text-danger">Refused</span>`;
        default:
          return `<span class="${base} bg-gray-200 text-gray-600">${status}</span>`;
      }
    }

    const renderQuotes = (data) => {
      tbody.innerHTML = '';
      if (data.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" class="text-center py-6 text-gray-500">No quotes available.</td></tr>`;
        pagination.innerHTML = '';
        return;
      }

      const start = (currentPage - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      const paginated = data.slice(start, end);

      paginated.forEach(q => {
        let total = 0;
        q.items.forEach(item => {
          total += item.price_snapshot * item.quantity;
        });

        tbody.innerHTML += `
          <tr class="hover:bg-gray-50">
            <td class="px-6 py-4 text-sm font-medium">
                <div class="flex items-center gap-3">
                    <div class="w-12 h-12 flex justify-center items-center bg-gray-50 rounded-full">
                    <i class="fas fa-file-pdf text-gray-400 text-2xl"></i>
                    </div>
                    <div class="flex flex-col">
                    <span class="font-semibold text-gray-800">${q.quote_number || 'N/A'}</span>
                    <span class="text-gray-500 text-sm"><i class="bx bx-user mr-2 text-lg"></i> ${q.user.name}</span>
                    </div>
                </div>
            </td>
            <td class="px-6 py-4 text-lg font-semibold">${formatPrice(total)}</td>
            <td class="px-6 py-4">${renderStatusBadge(q.status)}</td>
            <td class="px-6 py-4">${q.created_at?.split('T')[0]}</td>
            <td class="px-6 py-4 text-right">
                <button onclick="viewQuote('${q.id}')" class="mt-4 flex items-center justify-center gap-2 btn-default text-sm px-4 py-2 rounded-full w-full">
                    <i class="bx bx-show"></i> View details
                </button>
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
            ? 'bg-red text-white' 
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

    const applyFilters = () => {
      let filtered = [...allQuotes];
      const dateVal = filterDate.value;
      const sort = sortOrder.value;
      const statusVal = statusFilter.value;

      if (dateVal) filtered = filtered.filter(q => q.created_at.startsWith(dateVal));
      if (statusVal) filtered = filtered.filter(q => q.status === statusVal);

      filtered.sort((a, b) => {
        const dA = new Date(a.created_at);
        const dB = new Date(b.created_at);
        return sort === 'desc' ? dB - dA : dA - dB;
      });

      renderQuotes(filtered);
    }

    window.fetchQuotes = async function() {
      const token = sessionStorage.getItem("token");
      if (!token) {
        alert("No token found. Please log in.");
        return;
      }

      try {
        const res = await fetch("https://madarom-project-production.up.railway.app/api/quote", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          const message = errorData.message || errorData.error || "Fetch failed";
          throw new Error(message);
        }

        const data = await res.json();
        console.log("Les devis:", data);

        allQuotes = data.filter(quote => quote.status?.toLowerCase() === "pending");

        applyFilters();
      } catch (err) {
        console.error("Error fetching quotes:", err);
        alert(`Error fetching quotes: ${err.message}`);
      }
    }

    window.viewQuote = function(id) {
        if (!id) return;
        window.location.href = `/admin/quote/show?ref=${encodeURIComponent(id)}`;
    }

    filterDate.addEventListener('input', applyFilters);
    sortOrder.addEventListener('change', applyFilters);
    statusFilter.addEventListener('change', applyFilters);

    fetchQuotes();
}

function formatPrice(val) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(val);
  }
