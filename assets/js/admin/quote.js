let allQuotes = [];

    const tbody = document.getElementById('quotesBody');
    const filterDate = document.getElementById('filterDate');
    const sortOrder = document.getElementById('sortOrder');
    const statusFilter = document.getElementById('statusFilter');

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
        return;
      }

      data.forEach(q => {
        tbody.innerHTML += `
          <tr class="hover:bg-gray-50">
            <td class="px-6 py-4 font-medium">${q.quote_number || 'N/A'}</td>
            <td class="px-6 py-4">${renderStatusBadge(q.status)}</td>
            <td class="px-6 py-4">${q.created_at?.split('T')[0]}</td>
            <td class="px-6 py-4 text-right">
              <button onclick="viewQuote('${q.id}')" class="bg-primary text-white text-sm px-3 py-1.5 rounded-lg hover:bg-[#8c1514]">View</button>
            </td>
          </tr>
        `;
      });
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

    async function fetchQuotes() {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("No token found. Please log in.");
        return;
      }

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

    function viewQuote(id) {
      if (!id) return;
      window.location.href = `/admin/quote/show?ref=${encodeURIComponent(id)}`;
    }