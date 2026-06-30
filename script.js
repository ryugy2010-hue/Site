/* =============================================
   야명학원 — Pure JS SPA
   ============================================= */

/* ---- Data ---- */
const MEMBERS = [
  { name: "이도연",      role: "학장", flavor: "야명학원의 모든 것을 알고 있다. 아마도." },
  { name: "홍세아",      role: "교사", flavor: "야간 역사학 담당. 그녀의 강의는 새벽 두 시에 끝난다." },
  { name: "메리 블랙우드", role: "교사", flavor: "이상현상 분석 및 심령 언어학 담당." },
  { name: "한시연",      role: "학생", flavor: "입학 경위 불명. 그러나 성적은 항상 최상위." },
  { name: "사카키 유우",  role: "학생", flavor: "복도 끝 교실에서 혼자 공부하는 모습이 자주 목격된다." },
  { name: "시로가네 마이", role: "학생", flavor: "항상 흰 장갑을 끼고 있다. 이유는 묻지 마라." },
  { name: "안서",        role: "학생", flavor: "도서관 열쇠를 가지고 있다. 도서관은 공식적으로 잠겨 있다." },
  { name: "하나 유키",   role: "학생", flavor: "눈이 오는 날에만 출석한다." },
  { name: "샬럿 그린",   role: "학생", flavor: "녹색 눈동자. 교정의 나무가 그녀 쪽으로 기운다." },
  { name: "릴리 노크스",  role: "학생", flavor: "문을 노크하는 소리가 들릴 때 그 자리에 있다." },
  { name: "키사라기 미오", role: "학생", flavor: "매달 마지막 날 결석한다. 이유는 기록에 없다." },
  { name: "쿠네 시온",   role: "학생", flavor: "전학 온 날짜가 명부에 세 가지로 기록되어 있다." },
];

const SECTIONS = [
  { role: "학장", count: "1건" },
  { role: "교사", count: "2건" },
  { role: "학생", count: "9건" },
];

/* ---- Router ---- */
function showPage(id) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  const target = document.getElementById("page-" + id);
  if (target) target.classList.add("active");

  document.querySelectorAll(".nav-link").forEach(a => {
    a.classList.toggle("active", a.dataset.page === id);
  });

  window.scrollTo({ top: 0, behavior: "smooth" });
}

/* ---- File SVG ---- */
function fileSVG() {
  return `
  <svg class="file-svg" width="52" height="64" viewBox="0 0 52 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="2" width="40" height="54" rx="3"
      fill="hsl(240 18% 12%)" stroke="hsl(270 40% 28%)" stroke-width="1.5"/>
    <path d="M30 2 L42 14" stroke="hsl(270 40% 28%)" stroke-width="1.5"/>
    <path d="M30 2 L30 14 L42 14"
      fill="hsl(240 18% 9%)" stroke="hsl(270 40% 28%)" stroke-width="1.5"/>
    <line x1="10" y1="24" x2="36" y2="24"
      stroke="hsl(270 30% 33%)" stroke-width="1.2" stroke-linecap="round"/>
    <line x1="10" y1="32" x2="36" y2="32"
      stroke="hsl(270 30% 33%)" stroke-width="1.2" stroke-linecap="round"/>
    <line x1="10" y1="40" x2="28" y2="40"
      stroke="hsl(270 30% 33%)" stroke-width="1.2" stroke-linecap="round"/>
    <circle cx="33" cy="52" r="3.5" fill="hsl(270 50% 32%)"/>
    <circle cx="33" cy="52" r="2"   fill="hsl(270 55% 48%)" opacity=".55"/>
  </svg>`;
}

/* ---- Build Student Records ---- */
function buildStudentRecords() {
  const container = document.getElementById("student-sections");
  if (!container) return;
  container.innerHTML = "";

  SECTIONS.forEach(({ role, count }) => {
    const members = MEMBERS.filter(m => m.role === role);

    const section = document.createElement("div");
    section.innerHTML = `
      <div class="section-header">
        <span class="section-badge">${role}</span>
        <div class="section-rule"></div>
        <span class="section-count">${count}</span>
      </div>
      <div class="file-grid" id="grid-${role}"></div>
    `;
    container.appendChild(section);

    const grid = section.querySelector(`#grid-${role}`);
    members.forEach(member => {
      const card = document.createElement("div");
      card.className = "file-card";
      card.innerHTML = fileSVG() + `<span class="file-name">${member.name}</span>`;
      card.addEventListener("click", () => openModal(member));
      grid.appendChild(card);
    });
  });
}

/* ---- Modal ---- */
function openModal(member) {
  // Remove existing modal
  const existing = document.getElementById("modal-overlay");
  if (existing) existing.remove();

  const roleIcon = member.role === "학장" ? "📜" : member.role === "교사" ? "🕯️" : "📑";

  const overlay = document.createElement("div");
  overlay.id = "modal-overlay";
  overlay.className = "modal-overlay";
  overlay.innerHTML = `
    <div class="modal-box" role="dialog" aria-modal="true">
      <div class="modal-icon">${roleIcon}</div>
      <div class="modal-label">야명학원 — 재적 명부</div>
      <div class="modal-name">${member.name}</div>
      <div class="modal-role">${member.role}</div>
      <div class="modal-divider"></div>
      <div class="modal-flavor">${member.flavor}</div>
      <div class="modal-stamp">열람 일시: ${currentDateStr()} &nbsp;|&nbsp; 열람 권한: 확인됨</div>
      <button class="modal-close">닫기</button>
    </div>
  `;

  document.body.appendChild(overlay);

  // Close handlers
  overlay.querySelector(".modal-close").addEventListener("click", closeModal);
  overlay.addEventListener("click", e => { if (e.target === overlay) closeModal(); });
  document.addEventListener("keydown", escHandler);
}

function escHandler(e) {
  if (e.key === "Escape") closeModal();
}

function closeModal() {
  const overlay = document.getElementById("modal-overlay");
  if (!overlay) return;
  overlay.classList.add("closing");
  overlay.addEventListener("animationend", () => overlay.remove(), { once: true });
  document.removeEventListener("keydown", escHandler);
}

function currentDateStr() {
  const d = new Date();
  return `${d.getFullYear()}.${String(d.getMonth()+1).padStart(2,"0")}.${String(d.getDate()).padStart(2,"0")}`;
}

/* ---- Init ---- */
document.addEventListener("DOMContentLoaded", () => {
  // Nav links
  document.querySelectorAll(".nav-link").forEach(a => {
    a.addEventListener("click", e => {
      e.preventDefault();
      showPage(a.dataset.page);
      history.pushState({}, "", a.getAttribute("href"));
    });
  });

  // Logo → home
  document.querySelector(".nav-logo").addEventListener("click", () => showPage("home"));

  // Home buttons
  document.getElementById("btn-school-intro")?.addEventListener("click", () => showPage("school-intro"));
  document.getElementById("btn-students")?.addEventListener("click", () => showPage("students"));

  // Build dynamic content
  buildStudentRecords();

  // Simple hash / path routing
  const path = location.pathname.replace(/\/$/, "").split("/").pop();
  if (path === "students") showPage("students");
  else if (path === "school-intro") showPage("school-intro");
  else showPage("home");

  // Browser back/forward
  window.addEventListener("popstate", () => {
    const p = location.pathname.replace(/\/$/, "").split("/").pop();
    if (p === "students") showPage("students");
    else if (p === "school-intro") showPage("school-intro");
    else showPage("home");
  });
});
