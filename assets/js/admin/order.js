function initOrders() {
    let allOrders = [];
    const container = document.querySelector('.grid');
    const filterDate = document.getElementById('filterDate');
    const sortOrder = document.getElementById('sortOrder');
    const statusFilter = document.getElementById('statusFilter');

    const renderCards = (data) => {
      container.innerHTML = '';
      data.forEach(order => {
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
            <span class="absolute top-3 right-3 text-xs font-medium px-3 py-1 rounded-full ${badgeColor}">
              ${order.quote.status}
            </span>
            <h2 class="text-lg font-semibold text-gray-800">${order.quote.reference}</h2>
            <p class="flex items-center text-gray-600 mt-2 text-sm">
              <i class="bx bx-calendar mr-2 text-lg"></i> ${order.quote.updated_at?.split('T')[0]}
            </p>
            <p class="flex items-center text-gray-600 mt-1 text-sm">
              <i class="bx bx-user mr-2 text-lg"></i> ${order.user.name}
            </p>
            <h3 class="text-xl font-bold text-gray-900 mt-3">${formatPrice(total)}</h3>
            <button onclick="viewQuote('${order.id}')" class="mt-4 flex items-center justify-center gap-2 btn-default text-sm px-4 py-2 rounded-full w-full">
              <i class="bx bx-show"></i> View details
            </button>
          </div>
        `;
      });
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
        const token = localStorage.getItem("token");
        if (!token) return alert("No token found. Please log in.");

        try {
            const res = await fetch("http://127.0.0.1:8000/api/quote", {
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
            console.log("Les bon de commandes:", data);

            allOrders = data.filter(quote => quote.status?.toLowerCase() === "validated"); 
            populateStatusFilter(); 
            applyFilters();
        } catch (err) {
            console.error("Error fetching quotes:", err);
            alert(`Error fetching quotes: ${err.message}`);
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

