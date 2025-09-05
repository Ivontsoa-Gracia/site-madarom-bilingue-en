function initOrders() {
    let allOrders = [];
    let currentPage = 1;
    const itemsPerPage = 6;

    const container = document.querySelector('.grid');
    const filterDate = document.getElementById('filterDate');
    const sortOrder = document.getElementById('sortOrder');
    const statusFilter = document.getElementById('statusFilter');
    const pagination = document.getElementById('pagination');

    const renderCards = (data) => {
      container.innerHTML = '';

      const start = (currentPage -1) * itemsPerPage;
      const end = start + itemsPerPage;
      const paginated = data.slice(start, end);


      paginated.forEach(order => {
        let total = 0;
        order.items.forEach(item => {
          total += item.price_snapshot * item.quantity;
        });

        const badgeColor = {
          pending: 'bg-yellow-100 text-[#e6a534]',
          validated: 'bg-green-100 text-[#68b56c]',
          command: 'bg-blue-100 text-[#1f7ed1]',
          canceled: 'bg-red-100 text-[#ab1a17]'
        }[order.quote.status.toLowerCase()] || 'bg-gray-400';

        container.innerHTML += `
          <div class="relative bg-white p-5 rounded-xl shadow-md">
            <span class="absolute top-3 right-3 text-xs px-3 py-1 rounded-full ${badgeColor}">
              ${order.quote.status}
            </span>
            <h2 class="text-lg font-medium text-gray-800">${order.quote.reference}</h2>
            <p class="flex items-center text-gray-600 mt-2 text-sm">
              <i class="bx bx-calendar mr-2 text-lg"></i> ${order.quote.updated_at?.split('T')[0]}
            </p>
            <p class="flex items-center text-gray-600 mt-1 text-sm">
              <i class="bx bx-user mr-2 text-lg"></i> ${order.user.name}
            </p>
            <h3 class="text-xl font-medium text-gray-900 mt-3">${formatPrice(total)}</h3>
            <button onclick="viewQuote('${order.id}')" class="mt-4 flex items-center justify-center gap-2 btn-default text-sm px-4 py-2 rounded-full w-full">
              <i class="bx bx-show"></i> View details
            </button>
          </div>
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
      let filtered = [...allOrders];
      const dateVal = filterDate.value;
      const statusVal = statusFilter.value;

      if (dateVal) filtered = filtered.filter(q => q.quote.updated_at?.startsWith(dateVal));
      if (statusVal) filtered = filtered.filter(q => q.quote.status === statusVal);

      filtered.sort((a, b) => {
        const dA = new Date(a.quote.updated_at);
        const dB = new Date(b.quote.updated_at);
        return sortOrder.value === 'desc' ? dB - dA : dA - dB;
      });

      renderCards(filtered);
    }

    const populateStatusFilter = () => {
      const uniqueStatuses = [...new Set(allOrders.map(o => o.quote.status))];
      uniqueStatuses.forEach(status => {
        const option = document.createElement('option');
        option.value = status;
        option.textContent = status.charAt(0).toUpperCase() + status.slice(1);
        statusFilter.appendChild(option);
      });
    }

    async function fetchOrders() {
        const token = sessionStorage.getItem("token");
        if (!token) return alert("No token found. Please log in.");

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
                throw new Error(errorData.message || errorData.error || "Fetch failed");
            }

            const data = await res.json();
            // console.log("Les bon de commandes:", data);

            allOrders = data.filter(quote => quote.status?.toLowerCase() === "validated"); 
            populateStatusFilter(); 
            applyFilters();
        } catch (err) {
            console.error("Error fetching orders:", err);
            alert(`Error fetching orders: ${err.message}`);
        }
    }

    window.viewQuote = function(id) {
        if (!id) return;
        window.location.href = `/admin/order/show?ref=${encodeURIComponent(id)}`;
    }

    filterDate.addEventListener('input', applyFilters);
    sortOrder.addEventListener('change', applyFilters);
    statusFilter.addEventListener('change', applyFilters);

    fetchOrders();

    function formatPrice(val) {
        return new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }).format(val);
      }
}
