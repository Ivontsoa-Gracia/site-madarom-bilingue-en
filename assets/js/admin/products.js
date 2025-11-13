const API_BASE = "https://madarom-project-production.up.railway.app/api";
const productsTable = document.getElementById("productsTable");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const subcategoryFilter = document.getElementById("subcategoryFilter");
const pagination = document.getElementById("pagination");

const modal = document.getElementById("productModal");
const productForm = document.getElementById("productForm");
const modalTitle = document.getElementById("modalTitle");
const cancelBtn = document.getElementById("cancelBtn");

let categories = [], subcategories = [], products = [];
let currentPage = 1, pageSize = 5;

function formatPrice(val) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(val);
}

async function fetchData() {
  const [pRes, cRes, sRes] = await Promise.all([
    fetch(`${API_BASE}/products/details`),
    fetch(`${API_BASE}/categories`),
    fetch(`${API_BASE}/subcategories`)
  ]);
  products = await pRes.json();
  categories = await cRes.json();
  subcategories = await sRes.json();
  renderFilters();
  renderProducts();
}

function renderFilters() {
  categoryFilter.innerHTML = '<option value="">All categories</option>' +
    categories.map(c => `<option value="${c.id}">${c.name}</option>`).join("");
  subcategoryFilter.innerHTML = '<option value="">All subcategories</option>' +
    subcategories.map(s => `<option value="${s.id}">${s.name}</option>`).join("");
  document.getElementById("category").innerHTML = categoryFilter.innerHTML;
  document.getElementById("subcategory").innerHTML = subcategoryFilter.innerHTML;
}

function renderProducts() {
  const search = searchInput.value.toLowerCase();
  const catId = categoryFilter.value;
  const subId = subcategoryFilter.value;

  const filtered = products.filter(p =>
    (!search || p.name_en.toLowerCase().includes(search) || p.name_latin.toLowerCase().includes(search)) &&
    (!catId || p.category_id == catId) &&
    (!subId || p.subcategory_id == subId)
  );

  // Pagination
  const totalPages = Math.ceil(filtered.length / pageSize);
  if (currentPage > totalPages) currentPage = totalPages || 1;
  const start = (currentPage - 1) * pageSize;
  const paginated = filtered.slice(start, start + pageSize);

  productsTable.innerHTML = paginated.map(p => `
    <tr class="hover:bg-gray-700">
      <td class="px-4 py-2">${p.id}</td>
      <td class="px-4 py-2"><img src="https://www.madarom.net/assets/${p.image_path ?? 'assets/img/products/PE002.png'}" class="w-12 h-12 object-cover rounded"></td>
      <td class="px-4 py-2">
        <div class="font-medium">${p.name_latin}</div>
        <div class="text-gray-400 text-xs">${p.name_en}</div>
      </td>
      <td class="px-4 py-2">${formatPrice(p.active_price?.amount ?? 0)}</td>
      <td class="px-4 py-2">${categories.find(c => c.id == p.category_id)?.name ?? '-'}</td>
      <td class="px-4 py-2">${subcategories.find(s => s.id == p.subcategory_id)?.name ?? '-'}</td>
      <td class="px-4 py-2 flex gap-2">
        <button onclick="editProduct(${p.id})" class="text-red-400 hover:underline">Edit</button>
        <button onclick="deleteProduct(${p.id})" class="text-red-600 hover:underline">Delete</button>
      </td>
    </tr>
  `).join("");

  renderPagination(totalPages);
}

function renderPagination(totalPages) {
  pagination.innerHTML = "";
  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    btn.className = `px-3 py-1 rounded ${i === currentPage ? 'bg-red-600 text-white' : 'bg-gray-700 text-gray-300'} hover:bg-red-500`;
    btn.onclick = () => { currentPage = i; renderProducts(); };
    pagination.appendChild(btn);
  }
}

document.getElementById("addProductBtn").onclick = () => openModal();
cancelBtn.onclick = () => closeModal();

function openModal(product = null) {
  modal.classList.remove("hidden");
  if (product) {
    modalTitle.textContent = "Edit product";
    document.getElementById("productId").value = product.id;
    document.getElementById("nameLatin").value = product.name_latin;
    document.getElementById("nameEn").value = product.name_en;
    document.getElementById("price").value = product.active_price?.amount ?? "";
    document.getElementById("description").value = product.description_en ?? "";
    document.getElementById("category").value = product.category_id ?? "";
    document.getElementById("subcategory").value = product.subcategory_id ?? "";
    document.getElementById("imagePath").value = product.image_path ?? "";
  } else {
    modalTitle.textContent = "Add product";
    productForm.reset();
    document.getElementById("productId").value = "";
  }
}

function closeModal() { modal.classList.add("hidden"); }

productForm.onsubmit = async (e) => {
  e.preventDefault();
  const id = document.getElementById("productId").value;
  const data = {
    name_latin: document.getElementById("nameLatin").value,
    name_en: document.getElementById("nameEn").value,
    active_price: { amount: parseFloat(document.getElementById("price").value) },
    description_en: document.getElementById("description").value,
    category_id: document.getElementById("category").value,
    subcategory_id: document.getElementById("subcategory").value,
    image_path: document.getElementById("imagePath").value,
  };
  const method = id ? "PUT" : "POST";
  const url = id ? `${API_BASE}/products/${id}` : `${API_BASE}/products`;

  await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  closeModal();
  fetchData();
};

async function editProduct(id) { openModal(products.find(p => p.id == id)); }

async function deleteProduct(id) {
  if (confirm("Delete this product?")) {
    await fetch(`${API_BASE}/products/${id}`, { method: "DELETE" });
    fetchData();
  }
}

searchInput.oninput = renderProducts;
categoryFilter.onchange = () => { currentPage = 1; renderProducts(); };
subcategoryFilter.onchange = () => { currentPage = 1; renderProducts(); };

fetchData();