const API_BASE = "https://phi-lab-server.vercel.app/api/v1/lab";

// DOM
const issueGrid    = document.getElementById("issueGrid");
const loader       = document.getElementById("loader");
const noResult     = document.getElementById("noResult");
const issueCount   = document.getElementById("issueCount");
const tabs         = document.querySelectorAll("#tabs .tab");
const searchInput  = document.getElementById("searchInput");
const searchBtn    = document.getElementById("searchBtn");

// Modal
const modal         = document.getElementById("issueModal");
const modalTitle    = document.getElementById("modalTitle");
const modalStatus   = document.getElementById("modalStatus");
const modalAuthor   = document.getElementById("modalAuthor");
const modalDate     = document.getElementById("modalDate");
const modalDesc     = document.getElementById("modalDesc");
const modalAssignee = document.getElementById("modalAssignee");
const modalPriority = document.getElementById("modalPriority");
const modalLabels   = document.getElementById("modalLabels");

// State
let allIssues    = [];
let activeStatus = "all";


document.addEventListener("DOMContentLoaded", () => {
  if (!issueGrid) return;        // safety: don't run on login page
  fetchIssues();
  bindTabs();
  bindSearch();
});


function bindTabs() {
  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("tab-active"));
      tab.classList.add("tab-active");

      activeStatus = tab.dataset.status;
      renderIssues(filterByStatus(allIssues, activeStatus));
    });
  });
}


function bindSearch() {
  searchBtn.addEventListener("click", handleSearch);
  searchInput.addEventListener("keypress", e => {
    if (e.key === "Enter") handleSearch();
  });
}

async function handleSearch() {
  const query = searchInput.value.trim();

  if (!query) {
    fetchIssues();
    return;
  }

  showLoader();
  try {
    const res  = await fetch(`${API_BASE}/issues/search?q=${encodeURIComponent(query)}`);
    const data = await res.json();

    allIssues = data.data || [];
    renderIssues(filterByStatus(allIssues, activeStatus));
  } catch (err) {
    console.error("Search failed:", err);
    showEmpty();
  }
}


async function fetchIssues() {
  showLoader();
  try {
    const res  = await fetch(`${API_BASE}/issues`);
    const data = await res.json();

    allIssues = data.data || [];
    renderIssues(filterByStatus(allIssues, activeStatus));
  } catch (err) {
    console.error("Fetch failed:", err);
    showEmpty();
  }
}


function filterByStatus(list, status) {
  if (status === "all") return list;
  return list.filter(i => i.status === status);
}

function showLoader() {
  loader.classList.remove("hidden");
  issueGrid.classList.add("hidden");
  noResult.classList.add("hidden");
}

function showEmpty() {
  loader.classList.add("hidden");
  issueGrid.classList.add("hidden");
  noResult.classList.remove("hidden");
  issueCount.textContent = "0";
}

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    month: "numeric", day: "numeric", year: "numeric"
  });
}

function priorityClass(priority) {
  switch ((priority || "").toLowerCase()) {
    case "high":   return "badge-error";
    case "medium": return "badge-warning";
    case "low":    return "badge-success";
    default:       return "badge-ghost";
  }
}


function renderIssues(issues) {
  loader.classList.add("hidden");
  noResult.classList.add("hidden");
  issueGrid.classList.remove("hidden");
  issueGrid.innerHTML = "";

  issueCount.textContent = issues.length;

  if (!issues.length) {
    showEmpty();
    return;
  }

  issues.forEach(issue => {
    const isOpen = issue.status === "open";
    const labels = Array.isArray(issue.labels) ? issue.labels : [];

    const card = document.createElement("div");
    card.className = `card bg-base-100 rounded-xl shadow-sm border border-base-300
                      hover:shadow-md transition cursor-pointer
                      ${isOpen ? "card-open" : "card-closed"}`;

    card.innerHTML = `
      <div class="p-4">
        <!-- Top row: icon + priority -->
        <div class="flex justify-between items-start mb-2">
          <span class="w-7 h-7 flex items-center justify-center rounded-full
                       ${isOpen ? "bg-green-100 text-green-600" : "bg-purple-100 text-purple-600"}">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none"
                 viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
          </span>
          <span class="badge badge-sm ${priorityClass(issue.priority)}">
            ${(issue.priority || "").toUpperCase()}
          </span>
        </div>

        <!-- Title -->
        <h3 class="font-semibold text-sm text-base-content leading-snug mb-1 line-clamp-2">
          ${issue.title}
        </h3>

        <!-- Description -->
        <p class="text-xs text-base-content/60 line-clamp-3 mb-3">
          ${issue.description}
        </p>

        <!-- Labels -->
        <div class="flex flex-wrap gap-1 mb-3">
          ${labels.map(l => `
            <span class="badge badge-outline badge-sm gap-1">
              ${labelIcon(l)} ${l.toUpperCase()}
            </span>`).join("")}
        </div>

        <!-- Footer -->
        <div class="flex items-center justify-between text-[11px] text-base-content/50 border-t border-base-200 pt-2">
          <span>#${issue.id} by ${issue.author}</span>
          <span>${formatDate(issue.createdAt)}</span>
        </div>
      </div>
    `;

    card.addEventListener("click", () => openModal(issue));
    issueGrid.appendChild(card);
  });
}

function labelIcon(label) {
  const l = (label || "").toLowerCase();
  if (l === "bug")         return "🐛";
  if (l === "help wanted") return "⚠";
  if (l === "enhancement") return "✨";
  return "🏷";
}


function openModal(issue) {
  modalTitle.textContent    = issue.title;
  modalAuthor.textContent   = issue.author;
  modalDate.textContent     = formatDate(issue.createdAt);
  modalDesc.textContent     = issue.description;
  modalAssignee.textContent = issue.assignee || "Unassigned";

  modalStatus.textContent = issue.status === "open" ? "Open" : "Closed";
  modalStatus.className   = "badge badge-sm " +
    (issue.status === "open" ? "badge-success" : "badge-secondary");

  modalPriority.textContent = (issue.priority || "").toUpperCase();
  modalPriority.className   = "badge badge-sm " + priorityClass(issue.priority);

  const labels = Array.isArray(issue.labels) ? issue.labels : [];
  modalLabels.innerHTML = labels
    .map(l => `<span class="badge badge-outline badge-sm">${l.toUpperCase()}</span>`)
    .join("");

  modal.showModal();
}