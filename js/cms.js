/**
 * SISGER DBM 1 / GOA - CBMERJ
 * Painel de Gestão e Edição Simples (CMS Amigável para Próximos Gestores)
 */

window.popularFormularioCMS = function() {
  const cfg = carregarConfiguracao();

  // 1. Quadro de Trabalho / Vídeo
  const inputQuadroId = document.getElementById("cms-quadro-id");
  if (inputQuadroId) {
    inputQuadroId.value = (cfg.videoRecomendacoes && cfg.videoRecomendacoes.driveFileId) || (cfg.quadroDeTrabalho && cfg.quadroDeTrabalho.driveFileId) || "";
  }

  // 2. Checklist
  const inputChecklistForm = document.getElementById("cms-checklist-form");
  const inputChecklistCsv = document.getElementById("cms-checklist-csv");
  if (inputChecklistForm) inputChecklistForm.value = cfg.checklist.formUrl;
  if (inputChecklistCsv) inputChecklistCsv.value = cfg.checklist.csvUrl;

  // 3. Google Apps Script Web App (dbmlagoa@gmail.com)
  const inputScriptUrl = document.getElementById("cms-script-url");
  if (inputScriptUrl) inputScriptUrl.value = cfg.portal.appsScriptUrl || "";

  // 4. Renderizar Lista de Avisos do Mural
  renderizarListaAvisosCMS(cfg.muralAvisos);

  // 5. Renderizar Lista de Rotinas Diárias
  renderizarListaRotinasCMS(cfg.rotinaDiaria);
};

function renderizarListaAvisosCMS(avisos) {
  const container = document.getElementById("cms-avisos-list");
  if (!container) return;

  container.innerHTML = avisos.map((av, idx) => `
    <div class="cms-item-card" style="background: rgba(255,255,255,0.03); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); padding: 12px; margin-bottom: 10px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
        <span class="mural-badge ${av.tipo === 'urgente' ? 'badge-danger' : 'badge-info'}">${av.tipo.toUpperCase()}</span>
        <button type="button" class="btn-icon" style="width: 28px; height: 28px; color: var(--red-alert);" onclick="removerAvisoCMS(${idx})" title="Excluir Aviso">✕</button>
      </div>
      <input type="text" value="${av.titulo}" class="cms-aviso-titulo" data-idx="${idx}" placeholder="Título do Aviso" style="width:100%; font-weight:700; margin-bottom:6px; background:rgba(0,0,0,0.4); border:1px solid var(--border-subtle); color:#fff; padding:6px 10px; border-radius:4px;">
      <textarea class="cms-aviso-texto" data-idx="${idx}" placeholder="Conteúdo do aviso..." rows="2" style="width:100%; background:rgba(0,0,0,0.4); border:1px solid var(--border-subtle); color:#cbd5e1; padding:6px 10px; border-radius:4px; font-size:0.85rem;">${av.texto}</textarea>
    </div>
  `).join("");
}

function renderizarListaRotinasCMS(rotinas) {
  const container = document.getElementById("cms-rotinas-list");
  if (!container) return;

  container.innerHTML = rotinas.map((rt, idx) => `
    <div style="display: grid; grid-template-columns: 80px 1.2fr 1fr 32px; gap: 8px; align-items: center; margin-bottom: 8px;">
      <input type="text" value="${rt.time}" class="cms-rotina-time" data-idx="${idx}" placeholder="07:00" style="background:rgba(0,0,0,0.4); border:1px solid var(--border-subtle); color:var(--orange-rescue); font-weight:800; padding:6px; border-radius:4px; text-align:center;">
      <input type="text" value="${rt.title}" class="cms-rotina-title" data-idx="${idx}" placeholder="Atividade" style="background:rgba(0,0,0,0.4); border:1px solid var(--border-subtle); color:#fff; padding:6px; border-radius:4px;">
      <input type="text" value="${rt.desc}" class="cms-rotina-desc" data-idx="${idx}" placeholder="Detalhes" style="background:rgba(0,0,0,0.4); border:1px solid var(--border-subtle); color:#94a3b8; padding:6px; border-radius:4px; font-size:0.8rem;">
      <button type="button" class="btn-icon" style="width: 28px; height: 28px; color: var(--red-alert);" onclick="removerRotinaCMS(${idx})">✕</button>
    </div>
  `).join("");
}

window.adicionarNovoAvisoCMS = function() {
  const cfg = carregarConfiguracao();
  cfg.muralAvisos.unshift({
    id: "aviso-" + Date.now(),
    tipo: "informativo",
    titulo: "Novo Comunicado Operacional",
    texto: "Clique aqui para editar a mensagem deste aviso...",
    data: "Hoje"
  });
  salvarConfiguracaoLocal(cfg);
  window.popularFormularioCMS();
};

window.removerAvisoCMS = function(index) {
  const cfg = carregarConfiguracao();
  cfg.muralAvisos.splice(index, 1);
  salvarConfiguracaoLocal(cfg);
  window.popularFormularioCMS();
};

window.adicionarNovaRotinaCMS = function() {
  const cfg = carregarConfiguracao();
  cfg.rotinaDiaria.push({
    time: "15:00",
    title: "Nova Atividade Programada",
    desc: "Descrição da atividade ou treinamento"
  });
  salvarConfiguracaoLocal(cfg);
  window.popularFormularioCMS();
};

window.removerRotinaCMS = function(index) {
  const cfg = carregarConfiguracao();
  cfg.rotinaDiaria.splice(index, 1);
  salvarConfiguracaoLocal(cfg);
  window.popularFormularioCMS();
};

// Salvar todas as alterações do formulário
window.salvarAlteracoesCMS = async function() {
  const cfg = carregarConfiguracao();

  // 1. Quadro
  const inputQuadro = document.getElementById("cms-quadro-id");
  if (inputQuadro && inputQuadro.value.trim()) {
    let val = inputQuadro.value.trim();
    // Se o gestor colou o link inteiro do Drive, extrai apenas o ID
    const match = val.match(/[-\w]{25,}/);
    if (match) val = match[0];
    if (!cfg.quadroDeTrabalho) cfg.quadroDeTrabalho = {};
    cfg.quadroDeTrabalho.driveFileId = val;
    cfg.quadroDeTrabalho.previewUrl = `https://drive.google.com/file/d/${val}/preview`;
    if (cfg.videoRecomendacoes) cfg.videoRecomendacoes.driveFileId = val;
  }

  // 2. Checklist
  const inputChecklistForm = document.getElementById("cms-checklist-form");
  const inputChecklistCsv = document.getElementById("cms-checklist-csv");
  if (inputChecklistForm) cfg.checklist.formUrl = inputChecklistForm.value.trim();
  if (inputChecklistCsv) cfg.checklist.csvUrl = inputChecklistCsv.value.trim();

  // 3. Apps Script
  const inputScript = document.getElementById("cms-script-url");
  if (inputScript) cfg.portal.appsScriptUrl = inputScript.value.trim();

  // 4. Coletar Avisos editados
  const titulos = document.querySelectorAll(".cms-aviso-titulo");
  const textos = document.querySelectorAll(".cms-aviso-texto");
  titulos.forEach((el, idx) => {
    if (cfg.muralAvisos[idx]) {
      cfg.muralAvisos[idx].titulo = el.value;
      cfg.muralAvisos[idx].texto = textos[idx] ? textos[idx].value : "";
    }
  });

  // 5. Coletar Rotinas editadas
  const rTimes = document.querySelectorAll(".cms-rotina-time");
  const rTitles = document.querySelectorAll(".cms-rotina-title");
  const rDescs = document.querySelectorAll(".cms-rotina-desc");
  const novasRotinas = [];
  rTimes.forEach((el, idx) => {
    novasRotinas.push({
      time: el.value.trim(),
      title: rTitles[idx] ? rTitles[idx].value.trim() : "",
      desc: rDescs[idx] ? rDescs[idx].value.trim() : ""
    });
  });
  if (novasRotinas.length > 0) {
    cfg.rotinaDiaria = novasRotinas;
  }

  // Salva no navegador
  salvarConfiguracaoLocal(cfg);
  appConfig = cfg;

  // Atualiza componentes na tela
  if (window.initMuralCarousel) window.initMuralCarousel();
  if (window.initRotinaTimeline) window.initRotinaTimeline();
  if (window.initQuickForms) window.initQuickForms();

  // Atualiza iframes do Quadro de Trabalho
  const quadroIframe = document.getElementById("quadro-iframe");
  const tvQuadroIframe = document.getElementById("tv-quadro-iframe");
  if (quadroIframe) quadroIframe.src = cfg.quadroDeTrabalho.previewUrl;
  if (tvQuadroIframe) tvQuadroIframe.src = cfg.quadroDeTrabalho.previewUrl;

  // Se tiver WebApp Google Apps Script configurado, tenta sincronizar na nuvem
  if (cfg.portal.appsScriptUrl) {
    try {
      mostrarNotificacaoToast("Sincronizando com o Google Drive (dbmlagoa@gmail.com)...");
      await fetch(cfg.portal.appsScriptUrl, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "saveConfig", config: cfg })
      });
      mostrarNotificacaoToast("✅ Salvo com sucesso no Portal e no Google Drive!");
    } catch (err) {
      console.warn("Aviso ao sincronizar na nuvem:", err);
      mostrarNotificacaoToast("✅ Salvo localmente no navegador com sucesso!");
    }
  } else {
    mostrarNotificacaoToast("✅ Configurações salvas no navegador com sucesso!");
  }

  // Fecha o modal
  const modal = document.getElementById("cms-modal");
  if (modal) modal.classList.remove("active");
};

// Exportar backup em arquivo JSON
window.exportarBackupJSON = function() {
  const cfg = carregarConfiguracao();
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(cfg, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `SISGER_CONFIG_BACKUP_${new Date().toISOString().slice(0,10)}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
};

// Importar backup de arquivo JSON
window.importarBackupJSON = function(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const importedCfg = JSON.parse(e.target.result);
      if (importedCfg.portal && importedCfg.quadroDeTrabalho) {
        salvarConfiguracaoLocal(importedCfg);
        mostrarNotificacaoToast("✅ Backup restaurado com sucesso! Recarregando...");
        setTimeout(() => window.location.reload(), 1200);
      } else {
        alert("O arquivo selecionado não é um backup válido do SISGER.");
      }
    } catch (err) {
      alert("Erro ao ler arquivo de backup: " + err.message);
    }
  };
  reader.readAsText(file);
};

// Toast notification
function mostrarNotificacaoToast(msg) {
  let toast = document.getElementById("app-toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "app-toast";
    toast.style.cssText = `
      position: fixed;
      bottom: 24px;
      right: 24px;
      background: var(--bg-card);
      border: 1px solid var(--border-active);
      color: #fff;
      padding: 14px 22px;
      border-radius: var(--radius-sm);
      box-shadow: 0 10px 25px rgba(0,0,0,0.8);
      font-weight: 700;
      font-size: 0.9rem;
      z-index: 9999;
      display: flex;
      align-items: center;
      gap: 10px;
      backdrop-filter: blur(10px);
      transition: all 0.3s ease;
    `;
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.style.opacity = "1";
  toast.style.transform = "translateY(0)";
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(10px)";
  }, 4000);
}

/* ==========================================================================
   FERRAMENTA DO GESTOR: PUBLICAÇÃO E GESTÃO DE NOVAS NOTÍCIAS
   ========================================================================== */

window.uploadedNewsImgData = "";

// Inicializa o formulário de notícias (data atual, upload de imagem, etc.)
window.initNewsManager = function() {
  const dateInput = document.getElementById("new-post-date");
  if (dateInput && !dateInput.value) {
    const today = new Date().toISOString().split("T")[0];
    dateInput.value = today;
  }

  const fileInput = document.getElementById("new-post-img-file");
  if (fileInput) {
    fileInput.addEventListener("change", function(e) {
      const file = e.target.files[0];
      if (!file) return;
      if (file.size > 8 * 1024 * 1024) {
        alert("A imagem selecionada é muito grande (máximo 8MB).");
        return;
      }
      const reader = new FileReader();
      reader.onload = function(evt) {
        window.uploadedNewsImgData = evt.target.result;
        const previewBox = document.getElementById("new-post-img-preview-box");
        const previewImg = document.getElementById("new-post-img-preview");
        if (previewBox && previewImg) {
          previewImg.src = evt.target.result;
          previewBox.style.display = "block";
        }
      };
      reader.readAsDataURL(file);
    });
  }

  // Renderizar notícias salvas
  window.renderizarNoticiasCustomizadas();
};

window.renderizarNoticiasCustomizadas = function() {
  const feed = document.getElementById("custom-news-feed");
  if (!feed) return;

  const saved = localStorage.getItem("SISGER_NOTICIAS_CUSTOM");
  let noticias = [];
  try {
    if (saved) noticias = JSON.parse(saved);
  } catch (e) {
    console.error("Erro ao ler notícias personalizadas:", e);
  }

  if (noticias.length === 0) {
    feed.innerHTML = "";
    if (typeof initMuralCarousel === "function") initMuralCarousel();
    return;
  }

  feed.innerHTML = noticias.map((noticia, idx) => {
    // Formatar data
    let dataStr = noticia.data || "";
    if (dataStr.includes("-")) {
      const parts = dataStr.split("-");
      if (parts.length === 3) dataStr = `${parts[2]}/${parts[1]}/${parts[0]}`;
    }

    return `
      <article class="news-article-card" id="custom-news-${noticia.id}" style="border-left: 4px solid var(--orange-rescue);">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 14px; margin-bottom: 8px;">
          <div>
            <div style="display: flex; gap: 8px; align-items: center; margin-bottom: 6px;">
              <span class="card-badge badge-warning" style="background: rgba(255,85,0,0.2); color: var(--orange-rescue); border: 1px solid var(--orange-rescue);">NOVA PUBLICAÇÃO</span>
              <span style="font-size: 0.8rem; color: var(--text-muted); font-weight: 600;">Publicado em ${dataStr}</span>
            </div>
            <h3 style="margin-bottom: 4px;">${noticia.titulo}</h3>
            <div class="meta" style="margin-bottom: 12px;">${noticia.categoria || 'Informativo Operacional'}</div>
          </div>
          <button type="button" class="btn-icon" style="color: var(--red-alert); width: 32px; height: 32px;" onclick="excluirNoticiaCustomizada('${noticia.id}')" title="Excluir esta publicação">
            ✕
          </button>
        </div>

        ${noticia.imagem ? `
          <div class="news-img-banner-box" style="margin: 14px 0;">
            <img src="${noticia.imagem}" alt="${noticia.titulo}" class="news-img-banner" style="max-height: 420px; width: 100%; object-fit: cover; border-radius: var(--radius-sm); border: 1px solid var(--border-subtle);">
          </div>
        ` : ''}

        <div style="white-space: pre-line; font-size: 0.93rem; color: var(--text-secondary); line-height: 1.75;">
          ${noticia.texto}
        </div>
      </article>
    `;
  }).join("");
  if (typeof initMuralCarousel === "function") initMuralCarousel();
};

window.publicarNovaNoticia = function() {
  const inputTitulo = document.getElementById("new-post-title");
  const inputCat = document.getElementById("new-post-category");
  const inputData = document.getElementById("new-post-date");
  const inputTexto = document.getElementById("new-post-body");
  const inputImgUrl = document.getElementById("new-post-img-url");

  if (!inputTitulo || !inputTitulo.value.trim()) {
    alert("Por favor, digite o título da notícia.");
    if (inputTitulo) inputTitulo.focus();
    return;
  }

  if (!inputTexto || !inputTexto.value.trim()) {
    alert("Por favor, digite o conteúdo ou texto da notícia.");
    if (inputTexto) inputTexto.focus();
    return;
  }

  const imagemFinal = window.uploadedNewsImgData || (inputImgUrl ? inputImgUrl.value.trim() : "");

  const novaNoticia = {
    id: "noticia-" + Date.now(),
    titulo: inputTitulo.value.trim(),
    categoria: inputCat && inputCat.value.trim() ? inputCat.value.trim() : "Comunicado Oficial • DBM 1/GOA",
    data: inputData && inputData.value ? inputData.value : new Date().toISOString().split("T")[0],
    texto: inputTexto.value.trim(),
    imagem: imagemFinal,
    autor: "Gestão DBM 1 / GOA"
  };

  const saved = localStorage.getItem("SISGER_NOTICIAS_CUSTOM");
  let noticias = [];
  try {
    if (saved) noticias = JSON.parse(saved);
  } catch (e) {
    noticias = [];
  }

  noticias.unshift(novaNoticia);
  localStorage.setItem("SISGER_NOTICIAS_CUSTOM", JSON.stringify(noticias));

  // Limpar formulário
  inputTitulo.value = "";
  if (inputCat) inputCat.value = "";
  inputTexto.value = "";
  if (inputImgUrl) inputImgUrl.value = "";
  window.uploadedNewsImgData = "";
  const previewBox = document.getElementById("new-post-img-preview-box");
  if (previewBox) previewBox.style.display = "none";
  const fileInput = document.getElementById("new-post-img-file");
  if (fileInput) fileInput.value = "";

  window.renderizarNoticiasCustomizadas();
  mostrarNotificacaoToast("📢 Nova notícia publicada com sucesso no Mural!");

  // Rolar suavemente para a notícia publicada
  const feed = document.getElementById("custom-news-feed");
  if (feed) feed.scrollIntoView({ behavior: "smooth" });
};

window.excluirNoticiaCustomizada = function(id) {
  if (!confirm("Tem certeza que deseja remover esta notícia?")) return;

  const saved = localStorage.getItem("SISGER_NOTICIAS_CUSTOM");
  let noticias = [];
  try {
    if (saved) noticias = JSON.parse(saved);
  } catch (e) {
    noticias = [];
  }

  noticias = noticias.filter(n => n.id !== id);
  localStorage.setItem("SISGER_NOTICIAS_CUSTOM", JSON.stringify(noticias));
  window.renderizarNoticiasCustomizadas();
  mostrarNotificacaoToast("Notícia removida com sucesso.");
};
