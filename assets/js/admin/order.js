// function initOrders() {
    const container = document.querySelector('.grid');
    const filterDate = document.getElementById('filterDate');
    const sortOrder = document.getElementById('sortOrder');
    const statusFilter = document.getElementById('statusFilter');
  
    if (!container || !filterDate || !sortOrder || !statusFilter) {
      console.error("Some elements are missing in the DOM.");
      return;
    }
  
    let allOrders = [];
  
    const renderCards = (data) => {
      container.innerHTML = '';
      data.forEach(order => {
        const badgeColor = {
          pending: 'bg-yellow-100 text-yellow-800',
          validated: 'bg-green-100 text-green-800',
          command: 'bg-blue-100 text-blue-800',
          canceled: 'bg-red-100 text-red-800'
        }[order.quote.status.toLowerCase()] || 'bg-gray-400 text-gray-800';
  
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
            <h3 class="text-xl font-bold text-gray-900 mt-3">$</h3>
            <button onclick="viewQuote('${order.quote.id}')" class="mt-4 flex items-center justify-center gap-2 btn-primary text-white text-sm font-medium px-4 py-2 rounded-full w-full">
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
      statusFilter.innerHTML = '<option value="">All Status</option>'; // reset
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
        console.log("Les devis:", data);
  
        allOrders = data.filter(quote => quote.status?.toLowerCase() === "validated"); 
        populateStatusFilter(); 
        applyFilters();
      } catch (err) {
        console.error("Error fetching quotes:", err);
        alert(`Error fetching quotes: ${err.message}`);
      }
    }
  
    function viewQuote(id) {
      if (!id) return;
      window.location.href = `/admin/order/show?ref=${encodeURIComponent(id)}`;
    }
  
    // event listeners
    filterDate.addEventListener('input', applyFilters);
    sortOrder.addEventListener('change', applyFilters);
    statusFilter.addEventListener('change', applyFilters);
  
    fetchOrders();
//   }
  