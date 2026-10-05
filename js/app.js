/**
 * SISGER DBM 1 / GOA - CBMERJ
 * Controlador Principal do Portal (App Controller)
 */

let appConfig = carregarConfiguracao();
let muralInterval = null;
let currentAvisoIndex = 0;
let checklistPollInterval = null;

function safeInit(fn) {
  try { fn(); } catch (err) { console.error("Falha ao inicializar módulo:", fn.name, err); }
}

document.addEventListener("DOMContentLoaded", () => {
  // Rotina primeiro: é o conteúdo mais crítico e deve aparecer instantaneamente
  safeInit(initRotinaTimeline);
  safeInit(initRouter);
  safeInit(initClock);
  safeInit(() => { if (window.initNewsManager) window.initNewsManager(); });
  safeInit(initMuralCarousel);
  safeInit(initQuickForms);
  safeInit(initChecklistStatusChecker);
  safeInit(initTvModeHandlers);
  safeInit(initManagerModal);
  if (window.location.search.includes("tv=1") || window.location.hash === "#tv") {
    ativarModoTv(true);
  }
  // QR Code do formulário de manutenção abre direto o formulário
  if (window.location.search.includes("form=manutencao")) {
    abrirFormManutencao();
  }
});

/* ==========================================================================
   1. ROTEADOR DE TELAS (SPA ROUTING)
   ========================================================================== */
function initRouter() {
  const navLinks = document.querySelectorAll(".nav-link[data-view]");
  navLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetView = link.getAttribute("data-view");
      navigateTo(targetView);
    });
  });

  // Gerenciamento do Menu Mobile Clássico (Hamburguer)
  const mobileToggle = document.getElementById("mobile-menu-toggle");
  const sidebar = document.querySelector(".sidebar");
  const backdrop = document.getElementById("sidebar-backdrop");
  const closeBtn = document.getElementById("mobile-sidebar-close");

  function openMobileMenu() {
    if (sidebar) sidebar.classList.add("open");
    if (backdrop) backdrop.classList.add("active");
    document.body.classList.add("menu-mobile-open");
  }

  function closeMobileMenu() {
    if (sidebar) sidebar.classList.remove("open");
    if (backdrop) backdrop.classList.remove("active");
    document.body.classList.remove("menu-mobile-open");
  }

  window.fecharMenuMobile = closeMobileMenu;

  if (mobileToggle) {
    mobileToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      if (sidebar && sidebar.classList.contains("open")) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      closeMobileMenu();
    });
  }

  if (backdrop) {
    backdrop.addEventListener("click", closeMobileMenu);
  }

  // Fechar ao pressionar tecla Esc
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && sidebar && sidebar.classList.contains("open")) {
      closeMobileMenu();
    }
  });
}

function navigateTo(viewId) {
  document.querySelectorAll(".nav-link").forEach(l => l.classList.remove("active"));
  const activeLink = document.querySelector(`.nav-link[data-view="${viewId}"]`);
  if (activeLink) activeLink.classList.add("active");

  document.querySelectorAll(".view-section").forEach(s => s.classList.remove("active"));
  const targetSection = document.getElementById(`view-${viewId}`);
  if (targetSection) {
    targetSection.classList.add("active");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const topbarTitle = document.getElementById("topbar-page-title");
  if (topbarTitle && activeLink) {
    const text = activeLink.querySelector("span")?.textContent || "SISGER DBM 1/GOA";
    topbarTitle.textContent = text;
  }

  // Fechar o menu automaticamente ao selecionar qualquer tela no celular
  if (window.fecharMenuMobile) {
    window.fecharMenuMobile();
  }

  // Lazy loaders
  if (viewId === "briefing" && window.initAeroBriefingModule) {
    window.initAeroBriefingModule();
  }
}

/* ==========================================================================
   2. RELÓGIO DIGITAL & DATA EM TEMPO REAL
   ========================================================================== */
function initClock() {
  function updateTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");
    const timeStr = `${hours}:${minutes}:${seconds}`;

    const dateOptions = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    const dateStr = now.toLocaleDateString('pt-BR', dateOptions);

    const topTime = document.getElementById("topbar-time");
    const topDate = document.getElementById("topbar-date");
    if (topTime) topTime.textContent = `${hours}:${minutes}`;
    if (topDate) topDate.textContent = dateStr;

    const tvTime = document.getElementById("tv-clock-time");
    const tvDate = document.getElementById("tv-clock-date");
    if (tvTime) tvTime.textContent = timeStr;
    if (tvDate) tvDate.textContent = dateStr;

  }

  updateTime();
  setInterval(updateTime, 1000);
}

/* ==========================================================================
   3. VERIFICAÇÃO EM TEMPO REAL DO CHECKLIST (GOOGLE DRIVE / PLANILHA)
   ========================================================================== */
async function verificarChecklistStatus() {
  const badge = document.getElementById("checklist-live-badge");
  const tvBadge = document.getElementById("tv-checklist-badge");
  const desc = document.getElementById("checklist-status-desc");

  if (badge) {
    badge.className = "status-indicator-badge badge-warning";
    badge.innerHTML = `<span class="pulse-dot"></span> CONSULTANDO PLANILHA...`;
  }

  let conferido = false;
  let valorB2 = "";

  // 1. Tentar Endpoint Local /api/check-checklist (bypasses browser CORS)
  try {
    const res = await fetch("/api/check-checklist?t=" + Date.now(), { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      if (data.status === "success") {
        valorB2 = (data.valor || "").trim();
        conferido = (data.conferido === true || valorB2 === "1");
      }
    }
  } catch (e1) {
    // Continua para o fallback
  }

  // 2. Tentar Google Apps Script (dbmlagoa@gmail.com) caso local não responda
  if (!valorB2 && appConfig && appConfig.portal && appConfig.portal.appsScriptUrl) {
    try {
      const scriptUrl = appConfig.portal.appsScriptUrl + "?action=checkChecklist&t=" + Date.now();
      const res2 = await fetch(scriptUrl, { cache: "no-store" });
      if (res2.ok) {
        const data2 = await res2.json();
        if (data2.status === "success") {
          valorB2 = (data2.valor || "").trim();
          conferido = (data2.conferido === true || valorB2 === "1");
        }
      }
    } catch (e2) {
      // Continua para o fallback
    }
  }

  // 3. Fallback direto CSV do Google Sheets
  if (!valorB2) {
    try {
      const csvUrl = (appConfig && appConfig.checklist && appConfig.checklist.csvUrl)
        ? appConfig.checklist.csvUrl
        : "https://docs.google.com/spreadsheets/d/e/2PACX-1vTu4q9jr-xN_divraeeFmyyDeoANph3559wXe3sXl54Oek2LvNt9zVhttk5Uivh_rKGlhfrgUTtCTOW/pub?output=csv";
      const res3 = await fetch(csvUrl + "&t=" + Date.now(), { cache: "no-store" });
      if (res3.ok) {
        const text = await res3.text();
        const linhas = text.split("\n").filter(l => l.trim() !== "");
        if (linhas.length > 1) {
          const colunas = linhas[1].split(",");
          valorB2 = (colunas[1] || "").trim();
          conferido = (valorB2 === "1");
        }
      }
    } catch (e3) {
      console.warn("Falha no checklist direto:", e3);
    }
  }

  // Atualizar visual na interface
  const cardBox = document.getElementById("checklist-card-box");
  const tvCardBox = document.getElementById("tv-checklist-card-box");
  if (conferido || valorB2 === "1") {
    const successHTML = `<span class="pulse-dot" style="background-color: #22c55e;"></span> ✅ PRONTO EMPREGO (CONFERIDO)`;
    const tvSuccessHTML = `<span class="pulse-dot" style="background-color: #22c55e;"></span> REALIZADO • CONFERIDO`;
    if (badge) {
      badge.className = "status-indicator-badge badge-success";
      badge.innerHTML = successHTML;
    }
    if (tvBadge) {
      tvBadge.className = "status-indicator-badge badge-success";
      tvBadge.innerHTML = tvSuccessHTML;
    }
    if (cardBox) {
      cardBox.classList.add("status-conferido");
      cardBox.classList.remove("status-pendente");
    }
    if (tvCardBox) {
      tvCardBox.classList.add("status-conferido");
      tvCardBox.classList.remove("status-pendente");
    }
    if (cardBox) {
      cardBox.classList.add("status-conferido");
      cardBox.classList.remove("status-pendente");
    }
    if (desc) {
      desc.textContent = "Conferência diária de material realizada com sucesso na planilha oficial.";
    }
  } else {
    const warningHTML = `<span class="pulse-dot" style="background-color: var(--gold-wings);"></span> ❌ CHECKLIST PENDENTE`;
    const tvWarningHTML = `<span class="pulse-dot" style="background-color: var(--gold-wings);"></span> PENDENTE DE REALIZAÇÃO`;
    if (badge) {
      badge.className = "status-indicator-badge badge-warning";
      badge.innerHTML = warningHTML;
    }
    if (tvBadge) {
      tvBadge.className = "status-indicator-badge badge-warning";
      tvBadge.innerHTML = tvWarningHTML;
    }
    if (cardBox) {
      cardBox.classList.add("status-pendente");
      cardBox.classList.remove("status-conferido");
    }
    if (tvCardBox) {
      tvCardBox.classList.add("status-pendente");
      tvCardBox.classList.remove("status-conferido");
    }
    if (cardBox) {
      cardBox.classList.add("status-pendente");
      cardBox.classList.remove("status-conferido");
    }
    if (desc) {
      desc.textContent = "Conferência diária de material ainda não registrada hoje na planilha oficial.";
    }
  }
}
window.verificarChecklistManual = verificarChecklistStatus;

function initChecklistStatusChecker() {
  verificarChecklistStatus();
  if (checklistPollInterval) clearInterval(checklistPollInterval);
  checklistPollInterval = setInterval(verificarChecklistStatus, 60000);
}

/* ==========================================================================
   4. TIMELINE DA ROTINA DIÁRIA OPERACIONAL (FILTRAGEM DINÂMICA REAL-TIME)
   ========================================================================== */
function parseRoutineTime(timeStr) {
  if (timeStr.includes("-")) {
    const parts = timeStr.split("-");
    const [sh, sm] = parts[0].trim().split(":").map(Number);
    const [eh, em] = parts[1].trim().split(":").map(Number);
    return {
      startMin: (sh || 0) * 60 + (sm || 0),
      endMin: (eh || 0) * 60 + (em || 0),
      startStr: parts[0].trim(),
      endStr: parts[1].trim()
    };
  } else {
    const [h, m] = timeStr.trim().split(":").map(Number);
    return {
      startMin: (h || 0) * 60 + (m || 0),
      endMin: (h || 0) * 60 + (m || 0) + 60,
      startStr: timeStr.trim(),
      endStr: ""
    };
  }
}

function initRotinaTimeline() {
  // Renderizar imediatamente
  renderRotinaDiaria();

  // Atualizar a cada 30 segundos para que atividades que terminaram sumam em tempo real
  setInterval(renderRotinaDiaria, 30000);
}

function renderRotinaDiaria() {
  const container = document.getElementById("rotina-timeline-container");
  const tvContainer = document.getElementById("tv-rotina-container");
  const liveBadge = document.getElementById("rotina-live-badge");

  if (!container && !tvContainer) return;

  const now = new Date();
  const nowMin = now.getHours() * 60 + now.getMinutes();
  const items = appConfig.rotinaDiaria || [];

  // 1. Filtrar apenas atividades que AINDA NÃO FORAM CONCLUÍDAS (sumindo as já realizadas)
  // Uma atividade é considerada realizada quando a hora atual já ultrapassou o horário de término (nowMin > endMin).
  const activeAndUpcoming = items.filter(item => {
    const parsed = parseRoutineTime(item.time);
    return nowMin <= parsed.endMin;
  });

  // Caso todas as atividades diárias do dia já tenham sido concluídas (ex: após 19:00)
  if (activeAndUpcoming.length === 0) {
    if (liveBadge) {
      liveBadge.className = "card-badge badge-warning";
      liveBadge.innerHTML = `<span class="pulse-dot" style="background: var(--orange-rescue);"></span> Prontidão Noturna`;
    }

    const completedHTML = `
      <div class="rotina-completed-card">
        <div class="rotina-completed-header">
          <span class="rotina-now-badge" style="background: var(--orange-rescue);">
            <span class="pulse-dot" style="background: #fff;"></span>
            ROTINA DIURNA CONCLUÍDA
          </span>
          <span class="rotina-now-time" style="color: var(--orange-rescue);">24H OPERACIONAL</span>
        </div>
        <div class="rotina-body" style="margin-top: 10px;">
          <h4 style="color: #fff; font-size: 1.05rem; font-weight: 800; margin-bottom: 6px;">
            Grupamento em Prontidão de Sobreaviso Noturno
          </h4>
          <p style="color: #cbd5e1; font-size: 0.85rem; line-height: 1.45;">
            Todas as atividades programadas da escala oficial foram realizadas com sucesso. As tripulações e aeronaves do DBM 1/GOA permanecem em estado de prontidão para acionamentos emergenciais.
          </p>
        </div>
      </div>
    `;

    if (container) container.innerHTML = completedHTML;
    if (tvContainer) tvContainer.innerHTML = completedHTML;
    return;
  }

  // 2. Identificar se a atividade no topo está acontecendo agora ou se é a próxima
  const firstItem = activeAndUpcoming[0];
  const firstParsed = parseRoutineTime(firstItem.time);
  const isCurrentNow = nowMin >= firstParsed.startMin && nowMin <= firstParsed.endMin;

  if (liveBadge) {
    if (isCurrentNow) {
      liveBadge.className = "card-badge badge-danger animate-pulse";
      liveBadge.innerHTML = `<span class="pulse-dot"></span> Hora Atual: Em Andamento`;
    } else {
      liveBadge.className = "card-badge badge-info";
      liveBadge.innerHTML = `<span class="pulse-dot"></span> Próxima Atividade`;
    }
  }

  // 3. Renderizar Container Principal (Mural Início)
  if (container) {
    let html = "";
    activeAndUpcoming.forEach((item, index) => {
      if (index === 0) {
        // Atividade no TOPO do container - Sinalizada com destaque em Laranja
        const badgeLabel = isCurrentNow ? "ATIVIDADE DA HORA ATUAL" : "PRÓXIMA ATIVIDADE";
        html += `
          <div class="rotina-item rotina-item-now active-now" data-time="${item.time}">
            <div class="rotina-item-now-header">
              <div class="rotina-now-badge">
                <span class="pulse-dot" style="background: #fff;"></span>
                ${badgeLabel}
              </div>
              <div class="rotina-now-time">${item.time}</div>
            </div>
            <div class="rotina-body">
              <h4 class="rotina-now-title">${item.title}</h4>
              <p class="rotina-now-desc">${item.desc}</p>
            </div>
          </div>
        `;
      } else {
        // Atividades posteriores que ainda vão acontecer
        html += `
          <div class="rotina-item rotina-item-upcoming" data-time="${item.time}">
            <div class="rotina-time">${item.time}</div>
            <div class="rotina-body">
              <h4>${item.title}</h4>
              <p>${item.desc}</p>
            </div>
          </div>
        `;
      }
    });
    container.innerHTML = html;
  }

  // 4. Renderizar Container na TV (Modo Mural TV): Exibir SOMENTE a atividade a ser realizada no momento
  if (tvContainer) {
    if (activeAndUpcoming.length > 0) {
      const currentItem = activeAndUpcoming[0];
      const parsed = parseRoutineTime(currentItem.time);
      const isCurrentNow = nowMin >= parsed.startMin && nowMin <= parsed.endMin;
      const badgeLabel = isCurrentNow ? "ATIVIDADE DA HORA ATUAL" : "PRÓXIMA ATIVIDADE";

      tvContainer.innerHTML = `
        <div class="tv-routine-card active-now" data-time="${currentItem.time}">
          <div class="tv-routine-card-meta">
            <span class="rotina-now-badge">
              <span class="pulse-dot" style="width: 6px; height: 6px; background: #fff;"></span>
              ${badgeLabel}
            </span>
            <div class="time">${currentItem.time}</div>
          </div>
          <div class="desc">
            <h4>${currentItem.title}</h4>
            <p>${currentItem.desc}</p>
          </div>
        </div>
      `;
    } else {
      tvContainer.innerHTML = `
        <div class="tv-routine-card tv-routine-card-completed">
          <div class="tv-routine-card-meta">
            <span class="card-badge badge-warning">
              <span class="pulse-dot" style="background: var(--orange-rescue);"></span>
              SOBREAVISO 24H
            </span>
            <div class="time">PRONTIDÃO</div>
          </div>
          <div class="desc">
            <h4>Rotina Diurna Concluída</h4>
            <p>Tripulações e aeronaves em prontidão operacional de sobreaviso noturno.</p>
          </div>
        </div>
      `;
    }
  }
}

/* ==========================================================================
   5. MURAL DE AVISOS ROTATIVO (CARROSSEL COM PROGRESS BAR)
   ========================================================================== */
function initMuralCarousel() {
  const container = document.getElementById("mural-slides-container");
  const dotsContainer = document.getElementById("mural-dots-container");
  const countBadge = document.getElementById("mural-counter-badge");
  const carouselBox = document.getElementById("mural-card") || document.getElementById("mural-carousel-box");
  const btnPrev = document.getElementById("btn-mural-prev");
  const btnNext = document.getElementById("btn-mural-next");
  const progressBar = document.getElementById("mural-progress-bar");
  const tvProgressBar = document.getElementById("tv-news-progress-bar");
  const tvBanner = document.getElementById("tv-urgent-banner");

  const tvAvisoTitulo = document.getElementById("tv-aviso-titulo");
  const tvAvisoTexto = document.getElementById("tv-aviso-texto");
  const tvAvisoBadge = document.getElementById("tv-aviso-badge");

  if (!container && !tvAvisoTitulo) return;

  // 1. Coletar TODAS as matérias da página Notícias (publicações do gestor + acervo)
  const escapeHtml = (s) => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const clip = (s, n) => (s.length > n ? s.slice(0, n).replace(/\s+\S*$/, "") + "…" : s);

  const articles = Array.from(document.querySelectorAll("#view-noticias article.news-article-card"));
  let noticias = articles.map((art, idx) => {
    if (!art.id) art.id = `news-art-${idx}`;
    const titulo = (art.querySelector("h3")?.textContent || "").trim();
    const meta = (art.querySelector(".meta")?.textContent || "").trim();
    const img = art.querySelector("img");
    // Primeiro parágrafo (ou bloco de texto) com conteúdo real
    let texto = "";
    const blocos = art.querySelectorAll("p, div[style*='white-space']");
    for (const b of blocos) {
      const t = b.textContent.replace(/\s+/g, " ").trim();
      if (t.length > 20) { texto = t; break; }
    }
    const isNova = art.id.startsWith("custom-news-");
    return {
      id: art.id,
      titulo,
      meta,
      texto: clip(texto, 260),
      imagem: img ? img.getAttribute("src") : "",
      tag: isNova ? "NOVA PUBLICAÇÃO" : "NOTÍCIA",
      badgeClass: isNova ? "badge-warning" : "badge-success"
    };
  }).filter(n => n.titulo);

  // Fallback: avisos da configuração, caso a página Notícias esteja vazia
  if (noticias.length === 0) {
    const avisos = (appConfig && appConfig.muralAvisos && appConfig.muralAvisos.length > 0)
      ? appConfig.muralAvisos : DEFAULT_CONFIG.muralAvisos;
    noticias = (avisos || []).map(a => ({
      id: "", titulo: a.titulo, meta: a.subtitulo || "", texto: a.texto, imagem: "",
      tag: (a.tipo || "aviso").toUpperCase(), badgeClass: "badge-info"
    }));
  }
  if (noticias.length === 0) return;

  const totalSlides = noticias.length;

  // 2. Renderizar slides
  if (container) {
    container.innerHTML = noticias.map((n, idx) => `
      <div class="mural-slide ${idx === 0 ? 'active' : ''}" data-index="${idx}">
        <div style="display: flex; gap: 16px; align-items: flex-start;">
          <div style="flex: 1;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
              <span class="mural-badge ${n.badgeClass}">
                <span class="pulse-dot" style="width: 6px; height: 6px; background: currentColor; margin-right: 4px;"></span>
                ${escapeHtml(n.tag)}
              </span>
            </div>
            <h3 style="color: #fff; font-size: 1.12rem; font-weight: 800; margin-bottom: 4px; line-height: 1.35;">${escapeHtml(n.titulo)}</h3>
            ${n.meta ? `<div class="mural-slide-sub">${escapeHtml(n.meta)}</div>` : ""}
            <p class="mural-slide-text">${escapeHtml(n.texto)}</p>
            <div class="mural-slide-action">
              <button type="button" class="btn-secondary" onclick="abrirNoticiaDoMural('${n.id}')" style="padding: 7px 16px; font-size: 0.82rem; border-color: rgba(255,107,0,0.4); color: #fff; display: inline-flex; align-items: center; gap: 6px;">
                Ler Matéria Completa ↗
              </button>
            </div>
          </div>
          ${n.imagem ? `<img src="${n.imagem}" alt="${escapeHtml(n.titulo)}" style="width: 110px; height: 100px; object-fit: cover; border-radius: var(--radius-sm); border: 1px solid var(--border-subtle); flex-shrink: 0;" loading="lazy">` : ""}
        </div>
      </div>
    `).join("");
  }

  // 3. Indicadores (bolinhas)
  if (dotsContainer) {
    dotsContainer.innerHTML = Array.from({ length: totalSlides }).map((_, idx) => `
      <span class="mural-dot ${idx === 0 ? 'active' : ''}" data-index="${idx}" title="Ir para notícia ${idx + 1}"></span>
    `).join("");

    dotsContainer.querySelectorAll(".mural-dot").forEach(dot => {
      dot.addEventListener("click", () => {
        goToSlide(Number(dot.getAttribute("data-index")));
      });
    });
  }

  // Contador "Aviso X de Y" removido a pedido do usuário
  if (countBadge) countBadge.style.display = "none";

  let isHovered = false;
  let progress = 0;
  const slideDuration = 8000;
  const updateInterval = 100;

  function showSlide(index) {
    currentAvisoIndex = index;
    const slides = document.querySelectorAll(".mural-slide");
    slides.forEach(s => s.classList.remove("active"));
    const target = document.querySelector(`.mural-slide[data-index="${index}"]`);
    if (target) target.classList.add("active");

    if (dotsContainer) {
      dotsContainer.querySelectorAll(".mural-dot").forEach((d, i) => {
        d.classList.toggle("active", i === index);
      });
    }

    // Atualizar Card de Notícias na TV (com Imagem relativa, Subtítulo, Badge e Texto)
    const n = noticias[index];
    if (n) {
      if (tvAvisoTitulo) tvAvisoTitulo.textContent = n.titulo;
      const tvAvisoSub = document.getElementById("tv-aviso-sub");
      if (tvAvisoSub) {
        tvAvisoSub.textContent = n.meta || "";
        tvAvisoSub.style.display = n.meta ? "block" : "none";
      }
      if (tvAvisoTexto) tvAvisoTexto.textContent = n.texto;
      if (tvAvisoBadge) {
        tvAvisoBadge.innerHTML = `<span class="pulse-dot" style="width: 6px; height: 6px; background: currentColor; margin-right: 4px;"></span> ${escapeHtml(n.tag)}`;
        tvAvisoBadge.className = `mural-badge ${n.badgeClass}`;
      }
      const tvAvisoImg = document.getElementById("tv-aviso-img");
      const tvAvisoImgBox = document.getElementById("tv-news-img-box");
      if (tvAvisoImg && tvAvisoImgBox) {
        tvAvisoImg.style.opacity = "0.3";
        setTimeout(() => {
          if (n.imagem) {
            tvAvisoImg.src = n.imagem;
            tvAvisoImg.alt = n.titulo;
            tvAvisoImgBox.style.display = "block";
          } else {
            tvAvisoImg.src = "assets/goa_hero_real.jpg";
            tvAvisoImg.alt = "GOA CBMERJ";
            tvAvisoImgBox.style.display = "block";
          }
          tvAvisoImg.style.opacity = "1";
        }, 120);
      }
    }
  }

  function goToSlide(index) {
    progress = 0;
    if (progressBar) progressBar.style.width = "0%";
    if (tvProgressBar) tvProgressBar.style.width = "0%";
    showSlide(index);
  }

  function nextSlide() {
    goToSlide((currentAvisoIndex + 1) % totalSlides);
  }

  function prevSlide() {
    goToSlide((currentAvisoIndex - 1 + totalSlides) % totalSlides);
  }

  // Eventos de clique para Anterior e Próximo
  if (btnPrev) {
    btnPrev.onclick = (e) => {
      e.preventDefault();
      prevSlide();
    };
  }
  if (btnNext) {
    btnNext.onclick = (e) => {
      e.preventDefault();
      nextSlide();
    };
  }

  // Pausar rotação ao passar o mouse por cima para permitir leitura confortável
  if (carouselBox) {
    carouselBox.onmouseenter = () => { isHovered = true; };
    carouselBox.onmouseleave = () => { isHovered = false; };
  }
  if (tvBanner) {
    tvBanner.onmouseenter = () => { isHovered = true; };
    tvBanner.onmouseleave = () => { isHovered = false; };
  }

  showSlide(0);

  if (muralInterval) clearInterval(muralInterval);

  muralInterval = setInterval(() => {
    if (!isHovered) {
      progress += (updateInterval / slideDuration) * 100;
      if (progressBar) progressBar.style.width = `${progress}%`;
      if (tvProgressBar) tvProgressBar.style.width = `${progress}%`;

      if (progress >= 100) {
        progress = 0;
        nextSlide();
      }
    }
  }, updateInterval);
}

// Abre a página Notícias rolando até a matéria clicada no mural
function abrirNoticiaDoMural(id) {
  navigateTo("noticias");
  if (!id) return;
  setTimeout(() => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, 120);
}

/* ==========================================================================
   6. CARDS DE FORMULÁRIOS RÁPIDOS DA PÁGINA INICIAL (CENTRALIZADOS)
   ========================================================================== */
function initQuickForms() {
  const container = document.getElementById("quick-forms-container");
  if (!container) return;

  const forms = (appConfig && appConfig.quickForms && appConfig.quickForms.length > 0)
    ? appConfig.quickForms
    : DEFAULT_CONFIG.quickForms;

  container.innerHTML = forms.map(form => {
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=8&data=${encodeURIComponent(form.url)}`;

    let iconSvg = '';
    if (form.id === 'form-checklist') {
      iconSvg = `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11l3 3L22 4"></path><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>`;
    } else if (form.id === 'form-experiencia') {
      iconSvg = `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg>`;
    } else {
      iconSvg = `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>`;
    }

    return `
      <div class="form-card-centered">
        <div class="form-card-centered-top">
          <div class="form-icon-centered">
            ${iconSvg}
          </div>
          <span class="badge-tag-center">${form.badge}</span>
        </div>
        <h4 class="form-title-centered">${form.title}</h4>
        <p class="form-desc-centered">${form.desc}</p>
        <div class="form-card-centered-actions">
          <a href="${form.url}" target="_blank" rel="noopener noreferrer" class="btn-primary" style="padding: 10px 18px; font-size: 0.85rem; font-weight: 700; width: 100%; justify-content: center; box-shadow: 0 4px 14px rgba(255, 107, 0, 0.25);">
            Preencher Formulário ↗
          </a>
          <button type="button" class="qr-trigger-btn" onclick="abrirModalQRCode('${form.title}', '${form.url}', '${qrUrl}')" style="width: 100%; justify-content: center; padding: 8px 14px;">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
            Ver QR Code no Celular
          </button>
        </div>
      </div>
    `;
  }).join("");
}

/* ==========================================================================
   7. MODO TV VERTICAL / TOTEM KIOSK
   ========================================================================== */
function initTvModeHandlers() {
  const btnTv = document.getElementById("btn-enter-tv-mode");
  const btnExit = document.getElementById("btn-exit-tv-mode");
  const btnFullscreen = document.getElementById("btn-fullscreen-toggle");

  if (btnTv) {
    btnTv.addEventListener("click", (e) => {
      e.preventDefault();
      ativarModoTv(true);
    });
  }

  if (btnExit) {
    btnExit.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      ativarModoTv(false);
    });
    btnExit.addEventListener("touchend", (e) => {
      e.preventDefault();
      e.stopPropagation();
      ativarModoTv(false);
    });
  }

  if (btnFullscreen) btnFullscreen.addEventListener("click", () => toggleFullscreen());

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && document.body.classList.contains("tv-mode-active")) {
      ativarModoTv(false);
    }
  });

  // Sincronizar saída caso o usuário saia do modo fullscreen do navegador
  document.addEventListener("fullscreenchange", () => {
    if (!document.fullscreenElement && document.body.classList.contains("tv-mode-active")) {
      ativarModoTv(false);
    }
  });

  // Atualizar QR code do formulário de manutenção com a URL real do portal
  const tvMntQr = document.getElementById("tv-qr-manutencao-img");
  if (tvMntQr) {
    const link = window.location.origin + window.location.pathname + "?form=manutencao";
    tvMntQr.src = "https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=" + encodeURIComponent(link);
  }

function ativarFallbackVideoTv() {
  const wrapper = document.getElementById("tv-video-wrapper");
  if (wrapper && !wrapper.querySelector("iframe")) {
    wrapper.innerHTML = `
      <div class="tv-video-tag">🎥 RECOMENDAÇÕES DE SEGURANÇA • GOA</div>
      <iframe id="tv-video-iframe" 
              src="https://drive.google.com/file/d/1x5rcnA3uGS-BICz-KsjbRdXVSWH4XSfp/preview" 
              allow="autoplay; encrypted-media; fullscreen" 
              allowfullscreen 
              style="width: 100%; height: 100%; border: none; background: #000; border-radius: var(--radius-sm);">
      </iframe>
    `;
  }
}
window.ativarFallbackVideoTv = ativarFallbackVideoTv;

  // Configuração avançada de loop contínuo do vídeo oficial na TV
  const tvVideo = document.getElementById("tv-video-player");
  if (tvVideo) {
    tvVideo.loop = true;
    tvVideo.muted = true;
    tvVideo.playsInline = true;

    // Se o elemento já tiver falhado antes da inicialização do script
    if (tvVideo.error) {
      ativarFallbackVideoTv();
    } else {
      tvVideo.addEventListener("error", ativarFallbackVideoTv);
      // Garantir loop infinito contínuo mesmo se o navegador ignorar o atributo 'loop' nativo
      tvVideo.addEventListener("ended", () => {
        tvVideo.currentTime = 0;
        tvVideo.play().catch(err => console.warn("Erro ao reiniciar vídeo em loop:", err));
      });
    }

    // Iniciar reprodução se já estiver no modo TV
    if (document.body.classList.contains("tv-mode-active")) {
      tvVideo.play().catch(() => {});
    }
  }
}

function ativarModoTv(ativar) {
  const tvContainer = document.getElementById("tv-kiosk-view");

  if (ativar) {
    document.body.classList.add("tv-mode-active");
    if (tvContainer) {
      tvContainer.style.display = "flex";
    }
    if (!document.fullscreenElement) {
      try {
        document.documentElement.requestFullscreen().catch(() => {});
      } catch (err) {}
    }
    // Atualizar rotina na TV imediatamente
    if (typeof renderRotinaDiaria === "function") {
      renderRotinaDiaria();
    }
    // Iniciar vídeo oficial em loop contínuo na TV
    const tvVideo = document.getElementById("tv-video-player");
    if (tvVideo) {
      tvVideo.loop = true;
      tvVideo.muted = true;
      try {
        if (tvVideo.paused || tvVideo.ended) {
          const playPromise = tvVideo.play();
          if (playPromise !== undefined) {
            playPromise.catch(err => {
              console.warn("TV video play deferred by browser policy:", err);
            });
          }
        }
      } catch (e) {}
    }
  } else {
    document.body.classList.remove("tv-mode-active");
    if (tvContainer) {
      tvContainer.style.display = "none";
    }
    if (document.fullscreenElement) {
      try {
        document.exitFullscreen().catch(() => {});
      } catch (err) {}
    }
    const tvVideo = document.getElementById("tv-video-player");
    if (tvVideo && typeof tvVideo.pause === "function") {
      try {
        tvVideo.pause();
      } catch (e) {}
    }
    if (window.location.hash === "#tv") {
      history.replaceState(null, null, window.location.pathname + window.location.search);
    }
  }
}
window.ativarModoTv = ativarModoTv;

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(err => {
      alert(`Não foi possível ativar tela cheia: ${err.message}`);
    });
  } else {
    document.exitFullscreen().catch(() => {});
  }
}

/* ==========================================================================
   8. MODAL DE QR CODE
   ========================================================================== */
function abrirModalQRCode(titulo, link, qrImgUrl) {
  const modal = document.getElementById("qr-modal");
  const modalTitle = document.getElementById("qr-modal-title");
  const modalImg = document.getElementById("qr-modal-img");
  const modalLink = document.getElementById("qr-modal-link");

  if (modalTitle) modalTitle.textContent = titulo;
  if (modalImg) modalImg.src = qrImgUrl;
  if (modalLink) {
    modalLink.href = link;
    modalLink.textContent = link;
  }

  if (modal) modal.classList.add("active");
}

function fecharModalQRCode() {
  const modal = document.getElementById("qr-modal");
  if (modal) modal.classList.remove("active");
}

/* ==========================================================================
   8.1 FORMULÁRIO DE SOLICITAÇÃO DE MANUTENÇÃO / OBRAS (planilha na pasta Obras do Drive)
   ========================================================================== */
function abrirFormManutencao() {
  const modal = document.getElementById("manutencao-modal");
  if (modal) modal.classList.add("active");
}

function fecharFormManutencao() {
  const modal = document.getElementById("manutencao-modal");
  if (modal) modal.classList.remove("active");
}

function abrirQRManutencao() {
  const link = window.location.origin + window.location.pathname + "?form=manutencao";
  const qr = "https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=8&data=" + encodeURIComponent(link);
  abrirModalQRCode("Solicitação de Manutenção / Obras", link, qr);
}

function alternarFotosManutencao() {
  const sim = document.querySelector('input[name="mnt-fotos-opt"][value="sim"]');
  const box = document.getElementById("mnt-fotos-box");
  if (box) box.style.display = (sim && sim.checked) ? "block" : "none";
}

function previewFotosManutencao() {
  const input = document.getElementById("mnt-fotos-input");
  const prev = document.getElementById("mnt-fotos-preview");
  if (!input || !prev) return;
  const files = Array.from(input.files).slice(0, 6);
  prev.innerHTML = "";
  files.forEach(f => {
    const img = document.createElement("img");
    img.src = URL.createObjectURL(f);
    img.style.cssText = "width: 72px; height: 72px; object-fit: cover; border-radius: 6px; border: 1px solid var(--border-subtle);";
    prev.appendChild(img);
  });
}

// Reduz a foto (máx. 1280px, JPEG) para o envio ser rápido e caber no Apps Script
function comprimirImagem(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const max = 1280;
      const scale = Math.min(1, max / Math.max(img.width, img.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      resolve({ mime: "image/jpeg", data: canvas.toDataURL("image/jpeg", 0.72).split(",")[1] });
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("Imagem inválida")); };
    img.src = url;
  });
}

function mostrarStatusManutencao(msg, tipo) {
  const el = document.getElementById("mnt-status");
  if (!el) return;
  el.style.display = "block";
  el.textContent = msg;
  const cores = { ok: ["rgba(34,197,94,0.15)", "#22c55e"], erro: ["rgba(239,68,68,0.15)", "#f87171"], info: ["rgba(255,107,0,0.15)", "#ffaa33"] };
  const c = cores[tipo] || cores.info;
  el.style.background = c[0];
  el.style.color = c[1];
}

async function enviarManutencao() {
  const btn = document.getElementById("mnt-submit-btn");
  const url = appConfig && appConfig.portal && appConfig.portal.appsScriptUrl;
  if (!url) {
    mostrarStatusManutencao("Integração com o Drive não configurada (appsScriptUrl).", "erro");
    return;
  }

  const payload = {
    action: "registrarManutencao",
    posto: document.getElementById("mnt-posto").value,
    nome: document.getElementById("mnt-nome").value.trim(),
    rg: document.getElementById("mnt-rg").value.trim(),
    descricao: document.getElementById("mnt-descricao").value.trim(),
    fotos: []
  };

  btn.disabled = true;
  const textoOriginal = btn.textContent;
  btn.textContent = "Enviando...";
  mostrarStatusManutencao("Enviando solicitação para o Drive...", "info");

  try {
    const querFotos = document.querySelector('input[name="mnt-fotos-opt"][value="sim"]').checked;
    const input = document.getElementById("mnt-fotos-input");
    if (querFotos && input && input.files.length > 0) {
      mostrarStatusManutencao("Preparando fotos...", "info");
      for (const f of Array.from(input.files).slice(0, 6)) {
        payload.fotos.push(await comprimirImagem(f));
      }
      mostrarStatusManutencao("Enviando solicitação e fotos para o Drive...", "info");
    }

    // text/plain evita o pré-voo CORS do Apps Script
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload)
    });
    const json = await res.json();
    if (json.status === "success") {
      mostrarStatusManutencao("✅ Solicitação registrada com sucesso! Obrigado pelo aviso.", "ok");
      document.getElementById("manutencao-form").reset();
      alternarFotosManutencao();
      document.getElementById("mnt-fotos-preview").innerHTML = "";
      setTimeout(fecharFormManutencao, 2500);
    } else {
      let msg = json.message || "falha ao registrar.";
      if (msg.includes("SpreadsheetApp") || msg.includes("permissão") || msg.includes("auth/spreadsheets")) {
        msg = "⚠️ Autorização pendente no Google Apps Script: abra o Apps Script e execute a função 'autorizarCriarPlanilhaObras' para liberar o acesso ao Google Planilhas.";
      }
      mostrarStatusManutencao(msg, "erro");
    }
  } catch (err) {
    console.error(err);
    mostrarStatusManutencao("Não foi possível confirmar o envio. Verifique a conexão e se o Apps Script foi reimplantado com a versão mais recente.", "erro");
  } finally {
    btn.disabled = false;
    btn.textContent = textoOriginal;
  }
}

/* ==========================================================================
   9. MODAL DE GESTÃO DO PORTAL (CMS)
   ========================================================================== */
function initManagerModal() {
  const btnOpen = document.getElementById("btn-open-cms");
  const btnClose = document.getElementById("btn-close-cms");
  const modal = document.getElementById("cms-modal");

  if (btnOpen) {
    btnOpen.addEventListener("click", () => {
      if (window.popularFormularioCMS) window.popularFormularioCMS();
      if (modal) modal.classList.add("active");
    });
  }

  if (btnClose) {
    btnClose.addEventListener("click", () => {
      if (modal) modal.classList.remove("active");
    });
  }
}
