
function initOrders() {
  const filterDate = document.getElementById('filterDate');
  const sortOrder = document.getElementById('sortOrder');
  const statusFilter = document.getElementById('statusFilter');

  if (!filterDate || !sortOrder || !statusFilter) return;

  filterDate.addEventListener('input', applyFilters);
  sortOrder.addEventListener('change', applyFilters);
  statusFilter.addEventListener('change', applyFilters);

  fetchOrders();
}

function initQuotes() {
  const filterDate = document.getElementById('filterDate');
  const statusFilter = document.getElementById('statusFilter');

  if (!filterDate || !statusFilter) return;

  filterDate.addEventListener('input', applyFiltersQuotes);
  statusFilter.addEventListener('change', applyFiltersQuotes);

  fetchQuotes();
}