(() => {
  if (!window.API_BASE) {
    window.API_BASE = "https://d57b49e3d8a4.ngrok-free.app/api";
  }

  const productsTable = document.getElementById("productsTable");
  const searchInput = document.getElementById("searchInput");
  const categoryFilter = document.getElementById("categoryFilter");
  const subcategoryFilter = document.getElementById("subcategoryFilter");
  const pagination = document.getElementById("pagination");
  const modal = document.getElementById("productModal");
  const productForm = document.getElementById("productForm");
  const modalTitle = document.getElementById("modalTitle");
  const cancelBtn = document.getElementById("cancelBtn");

  let categories = [];
  let subcategories = [];
  let products = [];

  let currentPage = 1;
  const itemsPerPage = 5;

  function formatPrice(val) {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(val);
  }

  async function fetchData() {
    const headers = { "ngrok-skip-browser-warning": "true" };
  
    const [pRes, cRes, sRes] = await Promise.all([
      fetch(`${API_BASE}/products/details`, { headers }),
      fetch(`${API_BASE}/categories`, { headers }),
      fetch(`${API_BASE}/subcategories`, { headers })
    ]);
  
    products = await pRes.json();
    categories = await cRes.json();
    subcategories = await sRes.json();
  
    console.log("🧾 Produits:", products);
    // console.log("📁 Catégories:", categories);
    // console.log("📂 Sous-catégories:", subcategories);
  
    renderFilters();
    applyFilters();
  }
  
  

  // async function fetchData() {
  //   const [pRes, cRes, sRes] = await Promise.all([
  //     fetch(`${API_BASE}/products/details`),
  //     fetch(`${API_BASE}/categories`),
  //     fetch(`${API_BASE}/subcategories`)
  //   ]);
  //   products = await pRes.json();
  //   categories = await cRes.json();
  //   subcategories = await sRes.json();
  //   renderFilters();
  //   applyFilters();
  // }

  function renderFilters() {
    categoryFilter.innerHTML = '<option value="">All categories</option>' +
      categories.map(c => `<option value="${c.id}">${c.name}</option>`).join("");

    subcategoryFilter.innerHTML = '<option value="">All subcategories</option>' +
      subcategories.map(s => `<option value="${s.id}">${s.name}</option>`).join("");

    document.getElementById("category").innerHTML = categoryFilter.innerHTML;
    document.getElementById("subcategory").innerHTML = subcategoryFilter.innerHTML;
  }

  function applyFilters() {
    const search = searchInput.value.toLowerCase();
    const catId = categoryFilter.value;
    const subId = subcategoryFilter.value;

    const filtered = products.filter(p =>
      (!search || p.name_en.toLowerCase().includes(search) || p.name_latin.toLowerCase().includes(search)) &&
      (!catId || p.category_id == catId) &&
      (!subId || p.subcategory_id == subId)
    );

    renderProducts(filtered);
  }

  function renderProducts(filtered) {
    const totalItems = filtered.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    if (currentPage > totalPages) currentPage = totalPages || 1;

    const start = (currentPage - 1) * itemsPerPage;
    const paginated = filtered.slice(start, start + itemsPerPage);

    productsTable.innerHTML = paginated.map(p => `
      <tr class="hover:bg-gray-50">
        <td class="px-4 py-2">${p.reference}</td>
        <td class="px-4 py-2">
          <img src="https://d57b49e3d8a4.ngrok-free.app/${p.image_path ?? 'assets/img/products/PE002.png'}"
               class="w-12 h-12 object-cover rounded">
        </td>
        <td class="px-4 py-2">
          <div class="font-medium">${p.name_latin}</div>
          <div class="text-gray-500 text-xs">${p.name_en}</div>
        </td>
        <td class="px-4 py-2">${formatPrice(p.active_price?.amount ?? 0)}</td>
        <td class="px-4 py-2">${categories.find(c => c.id == p.category_id)?.name ?? '-'}</td>
        <td class="px-4 py-2">${subcategories.find(s => s.id == p.subcategory_id)?.name ?? '-'}</td>
        <td class="px-4 py-2 flex gap-2 justify-center">
          <button onclick="editProduct(${p.id})" class="text-blue-600 hover:text-blue-800 transition">
            <i class="fa-solid fa-pen-to-square"></i>
          </button>
          <button onclick="deleteProduct(${p.id})" class="text-red-600 hover:text-red-800 transition">
            <i class="fa-solid fa-trash"></i>
          </button>
        </td>
      </tr>
    `).join("");

    renderPagination(totalItems, totalPages);
  }

  function renderPagination(totalItems, totalPages) {
    pagination.innerHTML = '';
    if (totalPages <= 1) return;

    const prevBtn = document.createElement('button');
    prevBtn.innerHTML = `&laquo;`;
    prevBtn.disabled = currentPage === 1;
    prevBtn.className = `px-3 py-1 rounded-full border ${
      currentPage === 1
        ? 'border-gray-600 text-gray-500 cursor-not-allowed'
        : 'border-gray-500 text-gray-300 hover:bg-[#ab1a17] hover:text-white'
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
    if (startPage > 2) addDots();

    for (let i = startPage; i <= endPage; i++) {
      if (i !== 1 && i !== totalPages) addPageButton(i);
    }

    if (endPage < totalPages - 1) addDots();
    if (totalPages > 1) addPageButton(totalPages);

    const nextBtn = document.createElement('button');
    nextBtn.innerHTML = `&raquo;`;
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.className = `px-3 py-1 rounded-full border ${
      currentPage === totalPages
        ? 'border-gray-600 text-gray-500 cursor-not-allowed'
        : 'border-gray-500 text-gray-300 hover:bg-[#ab1a17] hover:text-white'
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
          ? 'bg-[#ab1a17] border-[#ab1a17] text-white'
          : 'border-gray-500 text-gray-300 hover:bg-[#ab1a17] hover:text-white'
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

  // CRUD logic
  document.getElementById("addProductBtn").onclick = () => openModal();
  cancelBtn.onclick = () => closeModal();

  function openModal(product = null) {
    modal.classList.remove("hidden");
    const preview = document.getElementById("previewImage");

    if (product) {
        modalTitle.textContent = "Edit product";
        document.getElementById("productId").value = product.id;
        document.getElementById("code").value = product.reference ?? "";
        document.getElementById("nameLatin").value = product.name_latin ?? "";
        document.getElementById("nameFr").value = product.name_fr ?? "";
        document.getElementById("nameEn").value = product.name_en ?? "";
        document.getElementById("price").value = product.active_price?.amount ?? "";
        document.getElementById("descriptionFr").value = product.description_fr ?? "";
        document.getElementById("descriptionEn").value = product.description_en ?? "";
        document.getElementById("category").value = product.category_id ?? "";
        document.getElementById("subcategory").value = product.subcategory_id ?? "";

        const NGROK_URL = "https://d57b49e3d8a4.ngrok-free.app/";

        if (product.image_path) {
            preview.src = NGROK_URL + product.image_path; 
            preview.classList.remove("hidden");
        } else {
            preview.classList.add("hidden");
        }
        

    } else {
        modalTitle.textContent = "Add product";
        productForm.reset();
        document.getElementById("productId").value = "";
        preview.classList.add("hidden");
    }
}

  function closeModal() {
    modal.classList.add("hidden");
  }

  productForm.onsubmit = async (e) => {
    e.preventDefault();
  
    const fileInput = document.getElementById("imageFile");
    const formData = new FormData();
  
    formData.append("reference", document.getElementById("code").value || null);
    formData.append("name_latin", document.getElementById("nameLatin").value);
    formData.append("name_fr", document.getElementById("nameFr").value);
    formData.append("name_en", document.getElementById("nameEn").value || null);
    formData.append("price", document.getElementById("price").value);
    formData.append("description_fr", document.getElementById("descriptionFr").value || null);
    formData.append("description_en", document.getElementById("descriptionEn").value || null);
    formData.append("category_id", document.getElementById("category").value);
    formData.append("sub_category_id", document.getElementById("subcategory").value);
  
    if (fileInput.files[0]) {
      formData.append("image_path", fileInput.files[0]);
    }
  
    const id = document.getElementById("productId").value;
    const method = id ? "PUT" : "POST";
    const url = id ? `${API_BASE}/products/${id}` : `${API_BASE}/products`;
  
    await fetch(url, { method, body: formData });
  
    closeModal();
    fetchData();
  };
  
  window.editProduct = function(id) {
    const product = products.find(p => p.id == id);
    openModal(product);
  };

  window.deleteProduct = async function(id) {
    if (confirm("Delete this product?")) {
      await fetch(`${API_BASE}/products/${id}`, { method: "DELETE" });
      fetchData();
    }
  };

  searchInput.oninput = applyFilters;
  categoryFilter.onchange = applyFilters;
  subcategoryFilter.onchange = applyFilters;

  fetchData();
})();