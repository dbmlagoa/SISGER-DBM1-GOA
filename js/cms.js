/**
 * SISGER DBM 1 / GOA - CBMERJ
 * Painel de Gestão & Edição Fácil (CMS Amigável com Autenticação do Gestor)
 * Conta Oficial: dbmlagoa@gmail.com
 * Pasta no Drive: "SisGer DBM 1/GOA"
 */

// Credenciais Oficiais de Acesso ao Painel de Edição
const CMS_AUTH_USER = "dbmlagoa";
const CMS_AUTH_PASS = "salvamento193";

const STORAGE_KEY_AUTH = "SISGER_GESTOR_AUTH";

// Grade Oficial Padrão de Horários da Rotina Diária do DBM 1/GOA
const ROTINA_PADRAO_GOA = [
  { time: "05:00 - 05:30", title: "Transporte de refeição matinal", desc: "Designação de militar para buscar pães para o desjejum matinal." },
  { time: "05:45 - 06:00", title: "ESTABELECIMENTO DAS AERONAVES NO SPOT E ATIVAÇÃO DO SERVIÇO", desc: "Estabelecer aeronaves nos Spots configuradas e abastecidas (50% SAR / 60% Aeromédico). Rendição da equipe saindo de serviço, ativação e início da equipagem das aeronaves." },
  { time: "06:20 - 07:00", title: "Formatura e Briefing matinal", desc: "Formatura com todo o efetivo de serviço no DBM 1/GOA e retirada de faltas. Reunião conduzida pelo oficial piloto mais antigo: apresentação Aeromédico, TIHN, SAR e explanação de Segurança de Voo / Meteorologia RJ." },
  { time: "07:00 - 08:00", title: "CAFÉ DA MANHÃ", desc: "Período do desjejum matinal. Verificação dos alimentos disponibilizados para consumo aos militares de serviço." },
  { time: "08:00 - 09:30", title: "TFM (Treinamento Físico Militar)", desc: "Treinamento Físico Militar - Intensidade LEVE. SOMENTE DENTRO DO COMPLEXO DO DGOA. Período destinado ao treinamento físico." },
  { time: "10:45 - 12:00", title: "TRANSPORTE DE REFEIÇÃO (ALMOÇO)", desc: "Conferir as condições dos recipientes para armazenamento da alimentação e designação de militar para buscar a refeição." },
  { time: "12:00 - 13:00", title: "ALMOÇO", desc: "Fiscalizar que apenas militares em serviço (DBM 1/GOA) realizem a refeição; separar alimentação de equipes em socorro ou missão externa e permanência 24h." },
  { time: "14:30 - 16:30", title: "MANUTENÇÃO", desc: "Manutenção de viaturas e materiais operacionais (1º escalão e limpeza)." },
  { time: "17:00 - 18:00", title: "LIMPEZA DAS DEPENDÊNCIAS DA UNIDADE", desc: "Fiscalizar a faxina diária e manutenção da limpeza das dependências do DBM e Anexos pelo efetivo de serviço." },
  { time: "18:00 - 18:15", title: "DESATIVAÇÃO DO SERVIÇO", desc: "Formatura de encerramento do serviço, caso não haja aeronave em voo." },
  { time: "18:30 - 19:00", title: "HANGARAGEM DAS AERONAVES", desc: "Limpeza, abastecimento e reboque das aeronaves de serviço para o hangar." }
];

/* ==========================================================================
   1. SISTEMA DE AUTENTICAÇÃO E LOGIN DO GESTOR
   ========================================================================== */

window.isGestorAutenticado = function() {
  return sessionStorage.getItem(STORAGE_KEY_AUTH) === "true" ||
         localStorage.getItem(STORAGE_KEY_AUTH) === "true";
};

window.pendingNewsPublishAction = false;

window.solicitarAberturaNovaPostagem = function() {
  if (window.isGestorAutenticado && window.isGestorAutenticado()) {
    const p = document.getElementById('news-publish-card');
    if (p) {
      p.style.display = p.style.display === 'none' ? 'block' : 'none';
      if (p.style.display !== 'none') {
        p.scrollIntoView({ behavior: "smooth", block: "start" });
        const titleEl = document.getElementById('new-post-title');
        if (titleEl) titleEl.focus();
      }
    }
  } else {
    window.pendingNewsPublishAction = true;
    window.abrirModalLoginGestor();
  }
};

window.abrirPainelGestaoComLogin = function() {
  window.pendingNewsPublishAction = false;
  if (window.isGestorAutenticado()) {
    window.abrirModalCMS();
  } else {
    window.abrirModalLoginGestor();
  }
};

window.abrirModalLoginGestor = function() {
  const modalLogin = document.getElementById("cms-login-modal");
  const userInput = document.getElementById("cms-user-input");
  const passInput = document.getElementById("cms-pass-input");
  const msgBox = document.getElementById("cms-login-msg");

  if (msgBox) msgBox.style.display = "none";
  if (passInput) passInput.value = "";
  if (userInput && !userInput.value) userInput.value = "dbmlagoa";

  if (modalLogin) {
    modalLogin.classList.add("active");
    setTimeout(() => {
      if (passInput) passInput.focus();
    }, 200);
  }
};

window.fecharLoginCMS = function() {
  const modalLogin = document.getElementById("cms-login-modal");
  if (modalLogin) modalLogin.classList.remove("active");
};

window.submeterLoginCMS = function() {
  const userInput = document.getElementById("cms-user-input");
  const passInput = document.getElementById("cms-pass-input");
  const rememberCheck = document.getElementById("cms-remember-check");
  const msgBox = document.getElementById("cms-login-msg");

  const user = (userInput ? userInput.value : "").trim().toLowerCase();
  const pass = (passInput ? passInput.value : "").trim();

  if (user === CMS_AUTH_USER.toLowerCase() && pass === CMS_AUTH_PASS) {
    // Autenticação com Sucesso
    const remember = rememberCheck ? rememberCheck.checked : false;
    if (remember) {
      localStorage.setItem(STORAGE_KEY_AUTH, "true");
    } else {
      sessionStorage.setItem(STORAGE_KEY_AUTH, "true");
    }

    if (msgBox) {
      msgBox.style.display = "block";
      msgBox.style.background = "rgba(34, 197, 94, 0.15)";
      msgBox.style.border = "1px solid rgba(34, 197, 94, 0.4)";
      msgBox.style.color = "#22c55e";
      msgBox.innerHTML = "✅ Credenciais autorizadas. Abrindo...";
    }

    setTimeout(() => {
      window.fecharLoginCMS();
      if (window.pendingNewsPublishAction) {
        window.pendingNewsPublishAction = false;
        const p = document.getElementById('news-publish-card');
        if (p) {
          p.style.display = 'block';
          p.scrollIntoView({ behavior: "smooth", block: "start" });
          const titleEl = document.getElementById('new-post-title');
          if (titleEl) titleEl.focus();
        }
        mostrarNotificacaoToast("🔓 Sessão autorizada! Formulário de publicação pronto.");
      } else {
        window.abrirModalCMS();
        mostrarNotificacaoToast("🔓 Sessão administrativa iniciada como dbmlagoa!");
      }
    }, 450);

  } else {
    // Falha de Autenticação
    if (msgBox) {
      msgBox.style.display = "block";
      msgBox.style.background = "rgba(239, 68, 68, 0.15)";
      msgBox.style.border = "1px solid rgba(239, 68, 68, 0.4)";
      msgBox.style.color = "#ef4444";
      msgBox.innerHTML = "❌ Usuário ou senha incorretos. Verifique suas credenciais.";
    }
    if (passInput) {
      passInput.value = "";
      passInput.focus();
    }
  }
};

window.logoutGestorCMS = function() {
  sessionStorage.removeItem(STORAGE_KEY_AUTH);
  localStorage.removeItem(STORAGE_KEY_AUTH);

  const modalCMS = document.getElementById("cms-modal");
  if (modalCMS) modalCMS.classList.remove("active");

  mostrarNotificacaoToast("🔒 Sessão de gestão encerrada com sucesso.");
};

window.toggleVisibilidadeSenhaCMS = function() {
  const passInput = document.getElementById("cms-pass-input");
  if (!passInput) return;
  passInput.type = (passInput.type === "password") ? "text" : "password";
};

/* ==========================================================================
   2. CONTROLE DE ABAS DO PAINEL DE GESTÃO (CMS TABS)
   ========================================================================== */

window.switchCmsTab = function(tabId) {
  // Desativar todos os botões de aba
  document.querySelectorAll(".cms-tab-btn").forEach(btn => {
    btn.classList.remove("active");
  });

  // Ocultar todos os painéis
  document.querySelectorAll(".cms-tab-pane").forEach(pane => {
    pane.classList.remove("active");
  });

  // Ativar aba selecionada
  const targetPane = document.getElementById(`cms-tab-${tabId}`);
  if (targetPane) targetPane.classList.add("active");

  // Ativar botão correspondente
  const buttons = document.querySelectorAll(".cms-tab-btn");
  buttons.forEach(btn => {
    if (btn.getAttribute("onclick") && btn.getAttribute("onclick").includes(`'${tabId}'`)) {
      btn.classList.add("active");
    }
  });
};

/* ==========================================================================
   3. ABERTURA E PREENCHIMENTO DO PAINEL DE GESTÃO
   ========================================================================== */

window.abrirModalCMS = function() {
  window.popularFormularioCMS();
  const modal = document.getElementById("cms-modal");
  if (modal) modal.classList.add("active");
};

window.popularFormularioCMS = function() {
  const cfg = carregarConfiguracao();

  // 1. Aba TV: Vídeo Alternativo / Google Drive ID
  const inputQuadroId = document.getElementById("cms-quadro-id");
  if (inputQuadroId) {
    inputQuadroId.value = (cfg.videoRecomendacoes && cfg.videoRecomendacoes.driveFileId) || "";
  }

  // 2. Aba TV: Lista de Avisos / Notícias do Carrossel
  renderizarListaAvisosCMS(cfg.muralAvisos);

  // 3. Aba Rotina: Lista de Horários da Rotina Diária
  renderizarListaRotinasCMS(cfg.rotinaDiaria);

  // 4. Aba Formulários: Links dos 4 Formulários Operacionais e CSV
  const inputChecklistForm = document.getElementById("cms-checklist-form");
  const inputExperienciaForm = document.getElementById("cms-experiencia-form");
  const inputCautelaForm = document.getElementById("cms-cautela-form");
  const inputChecklistCsv = document.getElementById("cms-checklist-csv");

  if (inputChecklistForm) {
    inputChecklistForm.value = (cfg.checklist && cfg.checklist.formUrl) || "https://forms.gle/SuLZ4WrT7N7UUVRQ7";
  }

  if (inputExperienciaForm) {
    const qfExp = (cfg.quickForms || []).find(f => f.id === "form-experiencia");
    inputExperienciaForm.value = qfExp ? qfExp.url : "https://docs.google.com/forms/d/e/1FAIpQLSfJwFw_1cXWmDELPyB6v_aaVWKt3GfIDqwuEYj5qprN35EHjA/viewform";
  }

  if (inputCautelaForm) {
    const qfCaut = (cfg.quickForms || []).find(f => f.id === "form-cautela");
    inputCautelaForm.value = qfCaut ? qfCaut.url : "https://docs.google.com/forms/d/e/1FAIpQLSfD7BpVW84JEsywaFGiBd-U7zSv86pkfxcZuWfM5XZKIKbe5Q/viewform";
  }

  if (inputChecklistCsv) {
    inputChecklistCsv.value = (cfg.checklist && cfg.checklist.csvUrl) || "https://docs.google.com/spreadsheets/d/e/2PACX-1vTu4q9jr-xN_divraeeFmyyDeoANph3559wXe3sXl54Oek2LvNt9zVhttk5Uivh_rKGlhfrgUTtCTOW/pub?output=csv";
  }

  // 5. Aba Google Drive: URL do Google Apps Script
  const inputScriptUrl = document.getElementById("cms-script-url");
  if (inputScriptUrl) {
    inputScriptUrl.value = (cfg.portal && cfg.portal.appsScriptUrl) || "https://script.google.com/macros/s/AKfycbxAc4FFvitYtQB35psdhPu6XEkZF7p16y-ILr5YrmI5ilF_P1snMukF2qWGWUaM2dUeeQ/exec";
  }

  // 6. Aba Notícias: Lista de Notícias do Gestor
  if (typeof window.renderizarListaNoticiasCMS === "function") {
    window.renderizarListaNoticiasCMS();
  }
};

/* ==========================================================================
   4. RENDERIZAÇÃO DOS ITENS EDITÁVEIS (NOTÍCIAS & ROTINA)
   ========================================================================== */

function renderizarListaAvisosCMS(avisos) {
  const container = document.getElementById("cms-avisos-list");
  if (!container) return;

  const lista = avisos || [];
  container.innerHTML = lista.map((av, idx) => `
    <div class="cms-item-card" data-idx="${idx}">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
        <div style="display: flex; gap: 8px; align-items: center;">
          <select class="cms-aviso-tipo" data-idx="${idx}" style="background: rgba(0,0,0,0.6); border: 1px solid var(--border-subtle); color: #ffaa33; font-weight: 800; font-size: 0.74rem; padding: 4px 8px; border-radius: 4px;">
            <option value="operacional" ${av.tipo === 'operacional' ? 'selected' : ''}>OPERACIONAL</option>
            <option value="urgente" ${av.tipo === 'urgente' ? 'selected' : ''}>URGENTE</option>
            <option value="informativo" ${av.tipo === 'informativo' ? 'selected' : ''}>INFORMATIVO</option>
          </select>
          <span style="font-size: 0.72rem; color: var(--text-muted); font-weight: 600;">Slide ${idx + 1}</span>
        </div>
        <button type="button" class="btn-icon" style="width: 28px; height: 28px; color: var(--red-alert);" onclick="removerAvisoCMS(${idx})" title="Excluir Matéria">✕</button>
      </div>

      <input type="text" value="${escapeAttr(av.titulo || '')}" class="cms-aviso-titulo" data-idx="${idx}" placeholder="Título principal da notícia na TV" style="width:100%; font-weight:800; font-size: 0.95rem; margin-bottom:6px; background:rgba(0,0,0,0.5); border:1px solid var(--border-subtle); color:#fff; padding:8px 12px; border-radius:4px;">

      <input type="text" value="${escapeAttr(av.subtitulo || '')}" class="cms-aviso-sub" data-idx="${idx}" placeholder="Subtítulo em tom dourado (Ex: Padronização DMOP • GOA)" style="width:100%; font-weight:700; font-size: 0.8rem; margin-bottom:6px; background:rgba(0,0,0,0.5); border:1px solid var(--border-subtle); color:var(--gold-wings); padding:6px 12px; border-radius:4px;">

      <textarea class="cms-aviso-texto" data-idx="${idx}" placeholder="Resumo do texto exibido na TV..." rows="2" style="width:100%; background:rgba(0,0,0,0.5); border:1px solid var(--border-subtle); color:#cbd5e1; padding:8px 12px; border-radius:4px; font-size:0.85rem; margin-bottom: 6px;">${escapeHtml(av.texto || '')}</textarea>

      <input type="text" value="${escapeAttr(av.imagem || '')}" class="cms-aviso-img" data-idx="${idx}" placeholder="URL ou caminho da imagem (Ex: assets/noticias/noticias_img_10.jpg)" style="width:100%; font-size: 0.78rem; background:rgba(0,0,0,0.5); border:1px solid var(--border-subtle); color:#94a3b8; padding:6px 12px; border-radius:4px;">
    </div>
  `).join("");
}

function renderizarListaRotinasCMS(rotinas) {
  const container = document.getElementById("cms-rotinas-list");
  if (!container) return;

  const lista = rotinas || [];
  container.innerHTML = lista.map((rt, idx) => `
    <div style="display: grid; grid-template-columns: 140px 1.2fr 1.2fr 34px; gap: 8px; align-items: center; background: rgba(13, 21, 39, 0.6); padding: 8px 10px; border-radius: 6px; border: 1px solid var(--border-subtle);">
      <input type="text" value="${escapeAttr(rt.time || '')}" class="cms-rotina-time" data-idx="${idx}" placeholder="06:20 - 07:00" style="background:rgba(0,0,0,0.6); border:1px solid var(--border-subtle); color:#ffaa33; font-weight:800; font-size: 0.85rem; padding:6px; border-radius:4px; text-align:center;">
      <input type="text" value="${escapeAttr(rt.title || '')}" class="cms-rotina-title" data-idx="${idx}" placeholder="Título da Atividade" style="background:rgba(0,0,0,0.6); border:1px solid var(--border-subtle); color:#fff; font-weight: 700; padding:6px 10px; border-radius:4px; font-size: 0.85rem;">
      <input type="text" value="${escapeAttr(rt.desc || '')}" class="cms-rotina-desc" data-idx="${idx}" placeholder="Descrição / Local" style="background:rgba(0,0,0,0.6); border:1px solid var(--border-subtle); color:#cbd5e1; padding:6px 10px; border-radius:4px; font-size:0.8rem;">
      <button type="button" class="btn-icon" style="width: 28px; height: 28px; color: var(--red-alert);" onclick="removerRotinaCMS(${idx})" title="Remover Atividade">✕</button>
    </div>
  `).join("");
}

window.adicionarNovoAvisoCMS = function() {
  const cfg = carregarConfiguracao();
  if (!cfg.muralAvisos) cfg.muralAvisos = [];
  cfg.muralAvisos.unshift({
    id: "aviso-" + Date.now(),
    tipo: "operacional",
    titulo: "Nova Notícia Operacional",
    subtitulo: "Informativo DBM 1 / GOA",
    texto: "Descreva aqui os detalhes desta notícia a ser exibida no carrossel da TV...",
    imagem: "assets/goa_hero_real.jpg",
    data: "Hoje"
  });
  salvarConfiguracaoLocal(cfg);
  renderizarListaAvisosCMS(cfg.muralAvisos);
};

window.removerAvisoCMS = function(index) {
  const cfg = carregarConfiguracao();
  if (cfg.muralAvisos && cfg.muralAvisos[index]) {
    cfg.muralAvisos.splice(index, 1);
    salvarConfiguracaoLocal(cfg);
    renderizarListaAvisosCMS(cfg.muralAvisos);
  }
};

window.adicionarNovaRotinaCMS = function() {
  const cfg = carregarConfiguracao();
  if (!cfg.rotinaDiaria) cfg.rotinaDiaria = [];
  cfg.rotinaDiaria.push({
    time: "15:00 - 16:00",
    title: "Nova Atividade Programada",
    desc: "Descrição ou local da atividade no DBM 1/GOA"
  });
  salvarConfiguracaoLocal(cfg);
  renderizarListaRotinasCMS(cfg.rotinaDiaria);
};

window.removerRotinaCMS = function(index) {
  const cfg = carregarConfiguracao();
  if (cfg.rotinaDiaria && cfg.rotinaDiaria[index]) {
    cfg.rotinaDiaria.splice(index, 1);
    salvarConfiguracaoLocal(cfg);
    renderizarListaRotinasCMS(cfg.rotinaDiaria);
  }
};

window.restaurarRotinaPadraoCMS = function() {
  if (!confirm("Deseja restaurar a grade de horários oficiais padrão do DBM 1/GOA?")) return;
  const cfg = carregarConfiguracao();
  cfg.rotinaDiaria = JSON.parse(JSON.stringify(ROTINA_PADRAO_GOA));
  salvarConfiguracaoLocal(cfg);
  renderizarListaRotinasCMS(cfg.rotinaDiaria);
  mostrarNotificacaoToast("Grade oficial da rotina restaurada com sucesso.");
};

/* ==========================================================================
   5. SALVAR ALTERAÇÕES (LOCAL E NUVEM)
   ========================================================================== */

window.salvarAlteracoesCMS = async function() {
  const cfg = carregarConfiguracao();

  // 1. Vídeo da TV
  const inputQuadro = document.getElementById("cms-quadro-id");
  if (inputQuadro) {
    let val = inputQuadro.value.trim();
    const match = val.match(/[-\w]{25,}/);
    if (match) val = match[0];
    if (!cfg.videoRecomendacoes) cfg.videoRecomendacoes = {};
    cfg.videoRecomendacoes.driveFileId = val;
    if (val) {
      cfg.videoRecomendacoes.previewUrl = `https://drive.google.com/file/d/${val}/preview`;
    }
  }

  // 2. Formulários e QR Codes
  const inputChecklistForm = document.getElementById("cms-checklist-form");
  const inputExperienciaForm = document.getElementById("cms-experiencia-form");
  const inputCautelaForm = document.getElementById("cms-cautela-form");
  const inputChecklistCsv = document.getElementById("cms-checklist-csv");

  if (inputChecklistForm && inputChecklistForm.value.trim()) {
    cfg.checklist.formUrl = inputChecklistForm.value.trim();
    if (cfg.quickForms && cfg.quickForms[0]) cfg.quickForms[0].url = inputChecklistForm.value.trim();
  }

  if (inputExperienciaForm && inputExperienciaForm.value.trim()) {
    if (cfg.quickForms) {
      const fExp = cfg.quickForms.find(f => f.id === "form-experiencia");
      if (fExp) fExp.url = inputExperienciaForm.value.trim();
    }
  }

  if (inputCautelaForm && inputCautelaForm.value.trim()) {
    if (cfg.quickForms) {
      const fCaut = cfg.quickForms.find(f => f.id === "form-cautela");
      if (fCaut) fCaut.url = inputCautelaForm.value.trim();
    }
  }

  if (inputChecklistCsv && inputChecklistCsv.value.trim()) {
    cfg.checklist.csvUrl = inputChecklistCsv.value.trim();
  }

  // 3. Google Apps Script WebApp
  const inputScript = document.getElementById("cms-script-url");
  if (inputScript && inputScript.value.trim()) {
    if (!cfg.portal) cfg.portal = {};
    cfg.portal.appsScriptUrl = inputScript.value.trim();
  }

  // 4. Coletar Avisos da TV editados
  const tipos = document.querySelectorAll(".cms-aviso-tipo");
  const titulos = document.querySelectorAll(".cms-aviso-titulo");
  const subtitulos = document.querySelectorAll(".cms-aviso-sub");
  const textos = document.querySelectorAll(".cms-aviso-texto");
  const imagens = document.querySelectorAll(".cms-aviso-img");

  const novosAvisos = [];
  titulos.forEach((el, idx) => {
    novosAvisos.push({
      id: "aviso-" + idx,
      tipo: tipos[idx] ? tipos[idx].value : "operacional",
      titulo: el.value.trim(),
      subtitulo: subtitulos[idx] ? subtitulos[idx].value.trim() : "",
      texto: textos[idx] ? textos[idx].value.trim() : "",
      imagem: imagens[idx] ? imagens[idx].value.trim() : "",
      data: "Hoje"
    });
  });
  if (novosAvisos.length > 0) {
    cfg.muralAvisos = novosAvisos;
  }

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

  // Salva no armazenamento local do navegador
  salvarConfiguracaoLocal(cfg);
  appConfig = cfg;

  // Atualiza componentes visuais na tela imediatamente
  if (typeof initMuralCarousel === "function") initMuralCarousel();
  if (typeof initRotinaTimeline === "function") initRotinaTimeline();
  if (typeof initQuickForms === "function") initQuickForms();

  // Atualizar QR codes da TV com novas URLs se fornecidas
  atualizarQrCodesDaTv(cfg);

  // Sincronizar na nuvem (Google Drive dbmlagoa@gmail.com) caso Apps Script configurado
  if (cfg.portal && cfg.portal.appsScriptUrl) {
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

function atualizarQrCodesDaTv(cfg) {
  const qrBoxes = document.querySelectorAll(".tv-footer-qr .tv-qr-box");
  if (qrBoxes.length >= 3) {
    // 1. Checklist
    if (cfg.checklist && cfg.checklist.formUrl) {
      const img1 = qrBoxes[0].querySelector("img.tv-qr-img");
      if (img1) img1.src = "https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=" + encodeURIComponent(cfg.checklist.formUrl);
    }
    // 2. Experiência
    const expForm = (cfg.quickForms || []).find(f => f.id === "form-experiencia");
    if (expForm && expForm.url) {
      const img2 = qrBoxes[1].querySelector("img.tv-qr-img");
      if (img2) img2.src = "https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=" + encodeURIComponent(expForm.url);
    }
    // 3. Cautela
    const cautForm = (cfg.quickForms || []).find(f => f.id === "form-cautela");
    if (cautForm && cautForm.url) {
      const img3 = qrBoxes[2].querySelector("img.tv-qr-img");
      if (img3) img3.src = "https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=" + encodeURIComponent(cautForm.url);
    }
  }
}

/* ==========================================================================
   6. SINCRONIZAÇÃO DO MANUAL COM O GOOGLE DRIVE (PASTA "SisGer DBM 1/GOA")
   ========================================================================== */

window.salvarManualNoGoogleDriveCMS = async function() {
  const cfg = carregarConfiguracao();
  const scriptUrl = (cfg.portal && cfg.portal.appsScriptUrl) || "https://script.google.com/macros/s/AKfycbxAc4FFvitYtQB35psdhPu6XEkZF7p16y-ILr5YrmI5ilF_P1snMukF2qWGWUaM2dUeeQ/exec";

  if (!scriptUrl) {
    alert("Por favor, configure a URL do Google Apps Script na aba Google Drive antes de salvar.");
    return;
  }

  mostrarNotificacaoToast("☁️ Enviando Manual para a pasta 'SisGer DBM 1/GOA' do Drive...");

  const manualContent = obterTextoDoManualCompleto();

  try {
    await fetch(scriptUrl, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "saveManualToDrive",
        folderName: "SisGer DBM 1/GOA",
        manualContent: manualContent
      })
    });
    mostrarNotificacaoToast("✅ Manual salvo com sucesso na pasta 'SisGer DBM 1/GOA' do Google Drive (dbmlagoa@gmail.com)!");
  } catch (err) {
    console.error("Erro ao salvar manual no Drive:", err);
    alert("Não foi possível conectar ao Google Apps Script. Verifique a URL e sua conexão: " + err.message);
  }
};

window.testarConexaoAppsScript = async function() {
  const cfg = carregarConfiguracao();
  const scriptUrl = (cfg.portal && cfg.portal.appsScriptUrl) || document.getElementById("cms-script-url")?.value?.trim();

  if (!scriptUrl) {
    alert("Informe a URL do Google Apps Script para testar.");
    return;
  }

  mostrarNotificacaoToast("🔄 Testando comunicação com o Google Apps Script...");

  try {
    const urlPing = scriptUrl + (scriptUrl.includes("?") ? "&" : "?") + "action=ping&t=" + Date.now();
    const resp = await fetch(urlPing);
    const data = await resp.json();
    if (data.status === "success") {
      alert(`✅ Conexão Estabelecida com Sucesso!\nConta: ${data.account || 'dbmlagoa@gmail.com'}\nPasta Raiz: ${data.folder || 'SisGer DBM 1/GOA'}`);
    } else {
      alert("Aviso retornado pela API: " + JSON.stringify(data));
    }
  } catch (e) {
    // Mode no-cors fallback
    mostrarNotificacaoToast("📡 Teste enviado (modo protegido por política Google). Verifique o Drive.");
  }
};

/* ==========================================================================
   7. LEITOR E DOWNLOAD DO MANUAL DO GESTOR
   ========================================================================== */

function obterTextoDoManualCompleto() {
  return `# MANUAL DE GESTÃO & EDIÇÃO DO SISGER DBM 1 / GOA

**Unidade:** 1º Destacamento de Bombeiro Militar / Grupamento de Operações Aéreas (CBMERJ)
**Conta Institucional:** dbmlagoa@gmail.com
**Pasta no Drive:** SisGer DBM 1/GOA
**Versão:** 4.2.0

------------------------------------------------------------------------
1. CREDENCIAIS DE ACESSO AO PAINEL DE GESTÃO:
- Endereço do Portal: https://dbmlagoa.github.io/SISGER-DBM1-GOA/
- Acesso: Ícone de engrenagem ⚙️ no canto superior direito do menu
- Login / Usuário: dbmlagoa
- Senha de Acesso: salvamento193
------------------------------------------------------------------------

2. MODO TV VERTICAL (MURAL 24H):
- Como Iniciar: Acesse o portal e adicione "#tv" ao final da URL, ou clique no botão "Exibição TV (Mural 24h)".
- Pressione F11 no teclado para tela cheia sem barras.
- Vídeo Oficial: O vídeo "assets/video_recomendacoes_goa.mp4" roda automaticamente em loop silencioso no centro da tela.
- Rotina Diária: Exibe apenas a atividade do momento presente (calculada automaticamente).
- QR Codes: 4 QR codes ampliados (88px) posicionados logo abaixo da rotina diária para acesso rápido a Checklist, Horas de Voo, Cautela e Manutenção.

3. COMO REALIZAR EDIÇÕES PELO PAINEL:
- Aba 1 (TV & Telão): Trocar link do vídeo oficial ou editar avisos do carrossel com fotos.
- Aba 2 (Notícias & Publicações): Publicar e gerenciar notícias personalizadas com layout de 1 ou 2 fotos, excluir matérias antigas e ver contagem.
- Aba 3 (Rotina Diária): Adicionar ou editar atividades e horários (formato HH:MM - HH:MM).
- Aba 4 (Formulários & QR Codes): Atualizar links do Checklist, Horas de Voo, Cautela e Manutenção. Ao salvar, os QR codes são atualizados na hora.
- Aba 5 (Google Drive): Conectar o portal com a conta dbmlagoa@gmail.com e salvar o manual na nuvem.
- Aba 6 (Backup & Manual): Fazer download de cópia de segurança em .json ou do manual em .md.

4. PUBLICAÇÃO DE NOTÍCIAS COM LAYOUT DE 1 OU 2 FOTOS:
- Acesse pelo menu "Notícias" no botão "✍️ Nova Postagem (Gestor)" ou pela Aba "Notícias & Publicações" no Painel de Gestão.
- Escolha o layout desejado:
  * [1 Foto]: Banner panorâmico em destaque principal com legenda individual.
  * [2 Fotos]: Grid de 2 fotos lado a lado comparativas com legendas individuais para cada uma.
- Para cada foto, você pode anexar um arquivo do seu computador (com preview e otimização automática) ou colar uma URL.
- Preencha o título, subtítulo e o texto da notícia.
- Clique em "📢 Publicar Notícia no Portal". A matéria é veiculada imediatamente no topo do feed, no Mural rotativo da tela inicial e no telão da TV vertical!

Suporte: dbmlagoa@gmail.com | (21) 98596-9351`;
}

window.baixarManualMarkdownCMS = function() {
  const content = obterTextoDoManualCompleto();
  const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "MANUAL_DE_GESTAO_E_EDICAO_SISGER.md";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  mostrarNotificacaoToast("📥 Download do Manual iniciado!");
};

window.abrirLeitorManualCMS = function() {
  const modalViewer = document.getElementById("manual-viewer-modal");
  const contentEl = document.getElementById("manual-viewer-content");

  if (!modalViewer || !contentEl) return;

  const rawText = obterTextoDoManualCompleto();
  // Formatar texto simples em HTML legível
  contentEl.innerHTML = `
    <div style="background: rgba(0,0,0,0.4); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); padding: 18px; margin-bottom: 16px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
        <span class="card-badge badge-warning">CREDENCIAIS OFICIAIS</span>
        <span style="font-size: 0.74rem; color: var(--text-muted);">Uso Restrito do Gestor</span>
      </div>
      <div style="font-size: 1.05rem; font-weight: 800; color: #fff; margin-bottom: 4px;">
        Login: <span style="color: var(--orange-rescue); font-family: var(--font-mono);">dbmlagoa</span>
      </div>
      <div style="font-size: 1.05rem; font-weight: 800; color: #fff;">
        Senha: <span style="color: var(--orange-rescue); font-family: var(--font-mono);">salvamento193</span>
      </div>
    </div>
    <pre style="white-space: pre-wrap; font-family: var(--font-mono); font-size: 0.82rem; color: #cbd5e1; line-height: 1.55; margin: 0;">${escapeHtml(rawText)}</pre>
  `;

  modalViewer.classList.add("active");
};

/* ==========================================================================
   8. BACKUP E RESTAURAÇÃO (JSON)
   ========================================================================== */

window.exportarBackupJSON = function() {
  const cfg = carregarConfiguracao();
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(cfg, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `SISGER_CONFIG_BACKUP_${new Date().toISOString().slice(0,10)}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
  mostrarNotificacaoToast("📥 Backup baixado com sucesso!");
};

window.importarBackupJSON = function(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const importedCfg = JSON.parse(e.target.result);
      if (importedCfg.portal && importedCfg.checklist) {
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

/* ==========================================================================
   9. NOTIFICAÇÃO TOAST & UTILITÁRIOS
   ========================================================================== */

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
      z-index: 99999;
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

function escapeHtml(s) {
  return String(s || "").replace(/[&<>"']/g, c => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[c]));
}

function escapeAttr(s) {
  return String(s || "").replace(/"/g, "&quot;");
}

/* ==========================================================================
   10. GESTÃO E PUBLICAÇÃO DE NOTÍCIAS (LAYOUT COM 1 OU 2 FOTOS)
   ========================================================================== */

window.uploadedNewsImg1Data = "";
window.uploadedNewsImg2Data = "";
window.currentNewsLayout = "1-foto";

/**
 * Redimensiona e comprime imagens via Canvas antes de salvar no localStorage,
 * garantindo altíssima qualidade visual sem estourar o limite de armazenamento.
 */
function otimizarImagemBase64(file, maxWidth = 1600, maxHeight = 1200, qualidade = 0.85) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = function(e) {
      const img = new Image();
      img.onload = function() {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          if (width / height > maxWidth / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL("image/jpeg", qualidade);
        resolve(dataUrl);
      };
      img.onerror = () => resolve(e.target.result);
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Alterna entre os layouts de exibição de imagens: 1 Foto (Destaque) ou 2 Fotos (Lado a Lado).
 */
window.selecionarLayoutFotos = function(layout) {
  window.currentNewsLayout = layout;
  const btn1 = document.getElementById("btn-layout-1foto");
  const btn2 = document.getElementById("btn-layout-2fotos");
  const inputLayout = document.getElementById("new-post-layout");
  const group2 = document.getElementById("news-photo-group-2");
  const label1Tipo = document.getElementById("label-foto-1-tipo");

  if (inputLayout) inputLayout.value = layout;

  if (layout === "2-fotos") {
    if (btn1) btn1.classList.remove("active");
    if (btn2) btn2.classList.add("active");
    if (group2) group2.style.display = "block";
    if (label1Tipo) label1Tipo.textContent = "(Foto 1 • Esquerda / Destaque)";
  } else {
    if (btn1) btn1.classList.add("active");
    if (btn2) btn2.classList.remove("active");
    if (group2) group2.style.display = "none";
    if (label1Tipo) label1Tipo.textContent = "(Destaque Principal / Banner)";
  }
};

/**
 * Processa upload de arquivo local de imagem para Foto 1 ou Foto 2 com compressão e preview instantâneo.
 */
window.processarArquivoFoto = async function(event, num) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;

  if (file.size > 15 * 1024 * 1024) {
    alert("O arquivo selecionado é muito grande. Escolha uma imagem de até 15MB.");
    event.target.value = "";
    return;
  }

  try {
    mostrarNotificacaoToast("Processando imagem...");
    const dataUrl = await otimizarImagemBase64(file);
    if (num === 1) {
      window.uploadedNewsImg1Data = dataUrl;
      const previewBox = document.getElementById("new-post-img-preview-box");
      const previewImg = document.getElementById("new-post-img-preview");
      const btnRemover = document.getElementById("btn-remover-foto-1");
      const urlInput = document.getElementById("new-post-img-url");
      if (previewImg) previewImg.src = dataUrl;
      if (previewBox) previewBox.style.display = "block";
      if (btnRemover) btnRemover.style.display = "inline-block";
      if (urlInput) urlInput.value = "";
    } else if (num === 2) {
      window.uploadedNewsImg2Data = dataUrl;
      const previewBox = document.getElementById("new-post-img2-preview-box");
      const previewImg = document.getElementById("new-post-img2-preview");
      const btnRemover = document.getElementById("btn-remover-foto-2");
      const urlInput = document.getElementById("new-post-img2-url");
      if (previewImg) previewImg.src = dataUrl;
      if (previewBox) previewBox.style.display = "block";
      if (btnRemover) btnRemover.style.display = "inline-block";
      if (urlInput) urlInput.value = "";
    }
    mostrarNotificacaoToast(`📷 Foto ${num} carregada com sucesso!`);
  } catch (err) {
    console.error("Erro ao processar imagem:", err);
    alert("Não foi possível carregar a imagem. Tente outro arquivo.");
  }
};

/**
 * Atualiza preview quando o usuário digita ou cola uma URL de imagem.
 */
window.atualizarPreviewFoto = function(num) {
  if (num === 1) {
    const urlInput = document.getElementById("new-post-img-url");
    const previewBox = document.getElementById("new-post-img-preview-box");
    const previewImg = document.getElementById("new-post-img-preview");
    const btnRemover = document.getElementById("btn-remover-foto-1");
    const val = (urlInput ? urlInput.value : "").trim();
    if (val && !window.uploadedNewsImg1Data) {
      if (previewImg) previewImg.src = val;
      if (previewBox) previewBox.style.display = "block";
      if (btnRemover) btnRemover.style.display = "inline-block";
    } else if (!val && !window.uploadedNewsImg1Data) {
      if (previewBox) previewBox.style.display = "none";
      if (btnRemover) btnRemover.style.display = "none";
    }
  } else if (num === 2) {
    const urlInput = document.getElementById("new-post-img2-url");
    const previewBox = document.getElementById("new-post-img2-preview-box");
    const previewImg = document.getElementById("new-post-img2-preview");
    const btnRemover = document.getElementById("btn-remover-foto-2");
    const val = (urlInput ? urlInput.value : "").trim();
    if (val && !window.uploadedNewsImg2Data) {
      if (previewImg) previewImg.src = val;
      if (previewBox) previewBox.style.display = "block";
      if (btnRemover) btnRemover.style.display = "inline-block";
    } else if (!val && !window.uploadedNewsImg2Data) {
      if (previewBox) previewBox.style.display = "none";
      if (btnRemover) btnRemover.style.display = "none";
    }
  }
};

/**
 * Remove a foto selecionada (arquivo ou URL) e oculta seu preview.
 */
window.removerFoto = function(num) {
  if (num === 1) {
    window.uploadedNewsImg1Data = "";
    const urlInput = document.getElementById("new-post-img-url");
    const fileInput = document.getElementById("new-post-img-file");
    const previewBox = document.getElementById("new-post-img-preview-box");
    const previewImg = document.getElementById("new-post-img-preview");
    const btnRemover = document.getElementById("btn-remover-foto-1");
    if (urlInput) urlInput.value = "";
    if (fileInput) fileInput.value = "";
    if (previewImg) previewImg.src = "";
    if (previewBox) previewBox.style.display = "none";
    if (btnRemover) btnRemover.style.display = "none";
  } else if (num === 2) {
    window.uploadedNewsImg2Data = "";
    const urlInput = document.getElementById("new-post-img2-url");
    const fileInput = document.getElementById("new-post-img2-file");
    const previewBox = document.getElementById("new-post-img2-preview-box");
    const previewImg = document.getElementById("new-post-img2-preview");
    const btnRemover = document.getElementById("btn-remover-foto-2");
    if (urlInput) urlInput.value = "";
    if (fileInput) fileInput.value = "";
    if (previewImg) previewImg.src = "";
    if (previewBox) previewBox.style.display = "none";
    if (btnRemover) btnRemover.style.display = "none";
  }
};

/**
 * Publica uma nova notícia formatada com layout de 1 ou 2 fotos.
 */
window.publicarNovaNoticia = async function() {
  const inputTitulo = document.getElementById("new-post-title");
  const inputCat = document.getElementById("new-post-category");
  const inputData = document.getElementById("new-post-date");
  const inputTexto = document.getElementById("new-post-body");
  const inputLayout = document.getElementById("new-post-layout");

  const inputImg1Url = document.getElementById("new-post-img-url");
  const inputImg1Caption = document.getElementById("new-post-img-caption");
  const inputImg2Url = document.getElementById("new-post-img2-url");
  const inputImg2Caption = document.getElementById("new-post-img2-caption");

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

  const layout = (inputLayout ? inputLayout.value : "") || window.currentNewsLayout || "1-foto";
  const img1 = window.uploadedNewsImg1Data || (inputImg1Url ? inputImg1Url.value.trim() : "");
  const caption1 = (inputImg1Caption ? inputImg1Caption.value.trim() : "");
  const img2 = window.uploadedNewsImg2Data || (inputImg2Url ? inputImg2Url.value.trim() : "");
  const caption2 = (inputImg2Caption ? inputImg2Caption.value.trim() : "");

  const novaNoticia = {
    id: "noticia-" + Date.now(),
    titulo: inputTitulo.value.trim(),
    categoria: inputCat && inputCat.value.trim() ? inputCat.value.trim() : "Comunicado Oficial • DBM 1/GOA",
    data: inputData && inputData.value ? inputData.value : new Date().toISOString().split("T")[0],
    texto: inputTexto.value.trim(),
    layoutFotos: layout,
    imagem: img1,
    legenda: caption1,
    imagem2: img2,
    legenda2: caption2,
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
  try {
    localStorage.setItem("SISGER_NOTICIAS_CUSTOM", JSON.stringify(noticias));
  } catch (storageErr) {
    console.error("Erro ao salvar no localStorage:", storageErr);
    alert("Atenção: Limite de armazenamento local atingido. Tente usar imagens menores ou links.");
    return;
  }

  // Limpar formulário de publicação
  inputTitulo.value = "";
  if (inputCat) inputCat.value = "";
  inputTexto.value = "";
  window.removerFoto(1);
  window.removerFoto(2);
  if (inputImg1Caption) inputImg1Caption.value = "";
  if (inputImg2Caption) inputImg2Caption.value = "";
  window.selecionarLayoutFotos("1-foto");

  // Renderizar notícias no feed e no CMS
  window.renderizarNoticiasCustomizadas();
  if (typeof window.renderizarListaNoticiasCMS === "function") {
    window.renderizarListaNoticiasCMS();
  }

  mostrarNotificacaoToast("📢 Nova notícia veiculada com sucesso no Portal e Mural!");

  // Sincronizar em segundo plano com o Google Apps Script se configurado
  const cfg = carregarConfiguracao();
  if (cfg.portal && cfg.portal.appsScriptUrl) {
    try {
      fetch(cfg.portal.appsScriptUrl, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "saveNews", news: noticias })
      }).catch(e => console.warn("Sync news bg error:", e));
    } catch (e) {}
  }

  // Rolar suavemente para a notícia publicada
  const feed = document.getElementById("custom-news-feed");
  if (feed) feed.scrollIntoView({ behavior: "smooth" });
};

/**
 * Remove uma notícia personalizada salva no localStorage.
 */
window.excluirNoticiaCustomizada = function(id) {
  if (!confirm("Tem certeza que deseja remover esta notícia do portal?")) return;

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
  if (typeof window.renderizarListaNoticiasCMS === "function") {
    window.renderizarListaNoticiasCMS();
  }
  mostrarNotificacaoToast("Notícia removida com sucesso.");
};

/**
 * Renderiza todas as notícias personalizadas salvas no feed `#custom-news-feed`.
 */
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

  feed.innerHTML = noticias.map((noticia) => {
    // Formatar data para DD/MM/AAAA
    let dataStr = noticia.data || "";
    if (dataStr.includes("-")) {
      const parts = dataStr.split("-");
      if (parts.length === 3) dataStr = `${parts[2]}/${parts[1]}/${parts[0]}`;
    }

    // Montar bloco de imagens de acordo com o layout (1 Foto ou 2 Fotos)
    let mediaHtml = "";
    const hasImg1 = !!(noticia.imagem && noticia.imagem.trim());
    const hasImg2 = !!(noticia.imagem2 && noticia.imagem2.trim());

    if (noticia.layoutFotos === "2-fotos" && (hasImg1 || hasImg2)) {
      mediaHtml = `
        <div class="news-img-grid two-cols">
          ${hasImg1 ? `
            <div class="news-img-item">
              <img src="${noticia.imagem}" alt="${escapeAttr(noticia.titulo)}" loading="lazy">
              ${noticia.legenda ? `<div class="news-img-caption">${escapeHtml(noticia.legenda)}</div>` : ''}
            </div>
          ` : ''}
          ${hasImg2 ? `
            <div class="news-img-item">
              <img src="${noticia.imagem2}" alt="${escapeAttr(noticia.titulo)}" loading="lazy">
              ${noticia.legenda2 ? `<div class="news-img-caption">${escapeHtml(noticia.legenda2)}</div>` : ''}
            </div>
          ` : ''}
        </div>
      `;
    } else if (hasImg1) {
      mediaHtml = `
        <div class="news-img-banner-box" style="margin: 16px 0;">
          <img src="${noticia.imagem}" alt="${escapeAttr(noticia.titulo)}" class="news-img-banner" loading="lazy">
          ${noticia.legenda ? `<div class="news-img-caption" style="margin-top: -6px; margin-bottom: 14px; border-radius: 0 0 var(--radius-sm) var(--radius-sm); font-size: 0.78rem;">${escapeHtml(noticia.legenda)}</div>` : ''}
        </div>
      `;
    }

    const layoutTag = noticia.layoutFotos === "2-fotos" ? "LAYOUT: 2 FOTOS" : "LAYOUT: 1 FOTO";

    return `
      <article class="news-article-card" id="custom-news-${noticia.id}" style="border-left: 4px solid var(--orange-rescue); margin-bottom: 24px;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 14px; margin-bottom: 8px;">
          <div>
            <div style="display: flex; gap: 8px; align-items: center; margin-bottom: 6px; flex-wrap: wrap;">
              <span class="card-badge badge-warning" style="background: rgba(255,85,0,0.2); color: var(--orange-rescue); border: 1px solid var(--orange-rescue); font-weight: 800;">NOVA PUBLICAÇÃO</span>
              <span class="card-badge badge-info" style="font-size: 0.7rem;">${layoutTag}</span>
              <span style="font-size: 0.8rem; color: var(--text-muted); font-weight: 600;">Publicado em ${dataStr}</span>
            </div>
            <h3 style="margin-bottom: 4px; font-size: 1.25rem; font-weight: 800; color: #fff;">${escapeHtml(noticia.titulo)}</h3>
            <div class="meta" style="margin-bottom: 12px; color: var(--gold-wings); font-size: 0.82rem; font-weight: 700;">${escapeHtml(noticia.categoria || 'Informativo Operacional')}</div>
          </div>
          <button type="button" class="btn-icon" style="color: var(--red-alert); width: 34px; height: 34px; font-size: 1.1rem; border-color: rgba(239,68,68,0.3);" onclick="excluirNoticiaCustomizada('${noticia.id}')" title="Excluir esta publicação">
            ✕
          </button>
        </div>

        ${mediaHtml}

        <div style="white-space: pre-line; font-size: 0.94rem; color: var(--text-secondary); line-height: 1.75; margin-top: 10px;">
          ${escapeHtml(noticia.texto)}
        </div>
      </article>
    `;
  }).join("");

  // Atualizar carrossel do mural e telão da TV com a nova notícia
  if (typeof initMuralCarousel === "function") initMuralCarousel();
};

/**
 * Renderiza a lista de notícias publicadas dentro da aba de gestão do CMS (`#cms-tab-noticias`).
 */
window.renderizarListaNoticiasCMS = function() {
  const container = document.getElementById("cms-noticias-gestao-list");
  const badge = document.getElementById("cms-noticias-count-badge");
  if (!container) return;

  const saved = localStorage.getItem("SISGER_NOTICIAS_CUSTOM");
  let noticias = [];
  try {
    if (saved) noticias = JSON.parse(saved);
  } catch (e) {
    noticias = [];
  }

  if (badge) {
    badge.textContent = `${noticias.length} ${noticias.length === 1 ? 'Publicação' : 'Publicações'}`;
  }

  if (noticias.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 24px 16px; background: rgba(0,0,0,0.3); border-radius: var(--radius-sm); border: 1px dashed var(--border-subtle);">
        <span style="font-size: 2rem; display: block; margin-bottom: 6px;">📰</span>
        <p style="color: var(--text-secondary); font-size: 0.85rem; margin: 0 0 10px 0;">Nenhuma notícia personalizada publicada até o momento.</p>
        <button type="button" class="btn-primary" style="padding: 7px 16px; font-size: 0.8rem;" onclick="abrirPublicacaoDeNoticiaPeloCms()">
          + Publicar Primeira Notícia
        </button>
      </div>
    `;
    return;
  }

  container.innerHTML = noticias.map((n) => {
    const is2Fotos = n.layoutFotos === "2-fotos";
    return `
      <div class="cms-noticia-item">
        <div style="display: flex; gap: 12px; align-items: center; flex: 1; min-width: 0;">
          <div style="display: flex; gap: 4px; flex-shrink: 0;">
            ${n.imagem ? `<img src="${n.imagem}" alt="Foto 1" style="width: 48px; height: 42px; object-fit: cover; border-radius: 4px; border: 1px solid var(--border-subtle);">` : ''}
            ${n.imagem2 ? `<img src="${n.imagem2}" alt="Foto 2" style="width: 48px; height: 42px; object-fit: cover; border-radius: 4px; border: 1px solid var(--border-subtle);">` : ''}
            ${!n.imagem && !n.imagem2 ? `<div style="width: 48px; height: 42px; background: rgba(255,255,255,0.05); border-radius: 4px; display: flex; align-items: center; justify-content: center; font-size: 1.2rem;">📰</div>` : ''}
          </div>
          <div style="min-width: 0; flex: 1;">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 2px; flex-wrap: wrap;">
              <span class="card-badge ${is2Fotos ? 'badge-info' : 'badge-warning'}" style="font-size: 0.68rem; padding: 2px 6px;">
                ${is2Fotos ? '2 FOTOS' : '1 FOTO'}
              </span>
              <span style="font-size: 0.72rem; color: var(--text-muted);">${n.data || 'Sem data'}</span>
            </div>
            <div style="font-weight: 800; font-size: 0.88rem; color: #fff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
              ${escapeHtml(n.titulo)}
            </div>
            <div style="font-size: 0.75rem; color: var(--text-secondary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
              ${escapeHtml(n.texto || '')}
            </div>
          </div>
        </div>
        <div style="display: flex; gap: 8px; align-items: center; flex-shrink: 0;">
          <button type="button" class="btn-secondary" style="padding: 6px 10px; font-size: 0.75rem;" onclick="abrirNoticiaPeloCms('${n.id}')" title="Ver Notícia no Mural">
            👁️ Ver
          </button>
          <button type="button" class="btn-icon" style="color: var(--red-alert); width: 32px; height: 32px;" onclick="excluirNoticiaCustomizada('${n.id}')" title="Excluir Notícia">
            🗑️
          </button>
        </div>
      </div>
    `;
  }).join("");
};

/**
 * Abre o formulário de publicação na página de notícias a partir do CMS.
 */
window.abrirPublicacaoDeNoticiaPeloCms = function() {
  const modal = document.getElementById("cms-modal");
  if (modal) modal.classList.remove("active");
  if (typeof switchView === "function") switchView("noticias");
  const card = document.getElementById("news-publish-card");
  if (card) {
    card.style.display = "block";
    setTimeout(() => {
      card.scrollIntoView({ behavior: "smooth", block: "start" });
      const inputTitle = document.getElementById("new-post-title");
      if (inputTitle) inputTitle.focus();
    }, 200);
  }
};

/**
 * Navega do CMS para a página de Notícias no portal.
 */
window.irParaMuralNoticias = function() {
  const modal = document.getElementById("cms-modal");
  if (modal) modal.classList.remove("active");
  if (typeof switchView === "function") switchView("noticias");
  const feed = document.getElementById("custom-news-feed");
  if (feed) {
    setTimeout(() => {
      feed.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 200);
  }
};

/**
 * Fecha o CMS e navega diretamente para a notícia específica no mural.
 */
window.abrirNoticiaPeloCms = function(id) {
  const modal = document.getElementById("cms-modal");
  if (modal) modal.classList.remove("active");
  if (typeof switchView === "function") switchView("noticias");
  setTimeout(() => {
    const el = document.getElementById("custom-news-" + id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, 200);
};

/**
 * Inicializa os ouvintes e estado padrão do formulário de notícias.
 */
window.initNewsManager = function() {
  const dateInput = document.getElementById("new-post-date");
  if (dateInput && !dateInput.value) {
    const today = new Date().toISOString().split("T")[0];
    dateInput.value = today;
  }

  // Renderizar notícias existentes salvas no localStorage
  window.renderizarNoticiasCustomizadas();
};

