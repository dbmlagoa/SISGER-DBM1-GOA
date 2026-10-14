/**
 * ============================================================================
 * SISGER DBM 1 / GOA - CBMERJ
 * SIG-AEROMÉDICO • GESTÃO DE SAÚDE, INSUMOS, CHECKLIST & MISSÕES UASA
 * ============================================================================
 * 
 * Script do Google Apps Script vinculado à Planilha Dedicada do SIG-AEROMÉDICO.
 * 
 * Eixos Operacionais Atendidos:
 *  - 📋 Checklist Diário (Materiais por compartimento, Eletrônicos Biomédicos, Psicotrópicos)
 *  - 🚑 Socorros & Lançamentos do Serviço (Uso de insumos com RAPH/TIH e baixa automática)
 *  - 📦 Almoxarifado Central Médico (Controle de saldos, lotes e validades FEFO)
 *  - 🚁 Dados de Voos Aeromédicos (Tripulação, paciente, gravidade e estatísticas de voo)
 *  - 🔄 Passagem de Serviço (Transmissão de plantão e pendências entre equipes)
 *  - 🦺 Autenticação Operacional (RG Militar + Senha criptografada/verificada)
 * 
 * INSTRUÇÕES DE IMPLANTAÇÃO NA NOVA PLANILHA GOOGLE:
 * 1. Crie uma nova planilha no Google Drive da conta oficial (dbmlagoa@gmail.com):
 *    Nome sugerido: "SIG-AEROMEDICO DBM1-GOA"
 * 2. Copie o ID da planilha recém-criada (código entre /d/ e /edit no link)
 *    e cole na variável SPREADSHEET_ID abaixo (ou deixe vazio se o script for criado direto em 'Extensões > Apps Script' da planilha).
 * 3. No menu superior da planilha, clique em 'Extensões' > 'Apps Script'.
 * 4. Substitua o código existente por todo este conteúdo e salve (Ctrl + S).
 * 5. Clique no botão azul 'Implantar' > 'Nova implantação':
 *    - Tipo: 'App da Web'
 *    - Descrição: 'SIG-Aeromédico API Produção'
 *    - Executar como: 'Eu (dbmlagoa@gmail.com)'
 *    - Quem tem acesso: 'Qualquer pessoa'
 * 6. Clique em 'Implantar' e conceda as permissões.
 * 7. Copie o 'URL do app da Web' gerado (termina em /exec) e cole na constante SCRIPT_URL
 *    do arquivo modules/aeromedico.html.
 * ============================================================================
 */

var SPREADSHEET_ID = ""; // Deixe vazio se vinculado diretamente à planilha

function getSpreadsheet() {
  if (SPREADSHEET_ID && SPREADSHEET_ID.trim() !== "") {
    try {
      return SpreadsheetApp.openById(SPREADSHEET_ID);
    } catch (e) {
      return SpreadsheetApp.getActiveSpreadsheet();
    }
  }
  return SpreadsheetApp.getActiveSpreadsheet();
}

/**
 * Normaliza nomes de abas (ignora maiúsculas, minúsculas e acentos)
 */
function normSheetName(name) {
  return String(name || "").trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

/**
 * Localiza ou cria abas garantindo nomes padronizados
 */
function getOrCreateSheet(ss, sheetName, defaultHeaders) {
  var sheets = ss.getSheets();
  var targetNorm = normSheetName(sheetName);
  for (var i = 0; i < sheets.length; i++) {
    if (normSheetName(sheets[i].getName()) === targetNorm) {
      return sheets[i];
    }
  }
  var newSheet = ss.insertSheet(sheetName);
  if (defaultHeaders && defaultHeaders.length > 0) {
    newSheet.appendRow(defaultHeaders);
    newSheet.getRange(1, 1, 1, defaultHeaders.length)
      .setFontWeight("bold")
      .setBackground("#0f172a")
      .setFontColor("#ffffff");
    newSheet.setFrozenRows(1);
  }
  return newSheet;
}

function getUsersSheet(ss) {
  var sheets = ss.getSheets();
  for (var i = 0; i < sheets.length; i++) {
    var norm = normSheetName(sheets[i].getName());
    if (norm === "am_usuarios" || norm === "usuarios" || norm === "users" || norm.indexOf("usuario") !== -1) return sheets[i];
  }
  return getOrCreateSheet(ss, "AM_USUARIOS", ["Graduação", "Nome de Guerra", "RG", "Senha", "Função", "Data Cadastro"]);
}

function getAlmoxSheet(ss) {
  var sheets = ss.getSheets();
  for (var i = 0; i < sheets.length; i++) {
    var norm = normSheetName(sheets[i].getName());
    if (norm === "am_almoxarifado" || norm === "almoxarifado" || norm === "estoque" || norm.indexOf("almox") !== -1) return sheets[i];
  }
  return getOrCreateSheet(ss, "AM_ALMOXARIFADO", [
    "ID", "Nome do Item", "Categoria", "Unidade", "Saldo Estoque", "Estoque Mínimo", "Qtd Ideal", 
    "1ª Validade", "2ª Validade", "Lote", "Fabricante", "Localização", "Observações"
  ]);
}

function getSocorrosSheet(ss) {
  var sheets = ss.getSheets();
  for (var i = 0; i < sheets.length; i++) {
    var norm = normSheetName(sheets[i].getName());
    if (norm === "am_socorros" || norm === "socorros" || norm.indexOf("socorro") !== -1) return sheets[i];
  }
  return getOrCreateSheet(ss, "AM_SOCORROS", [
    "DataHora", "Item", "Tipo Lançamento", "Quantidade", "Nº Evento", "RAPH/TIH", "Tipo Ocorrência", 
    "Militar Registrador", "RG Registrador", "Baixa Almoxarifado", "Observações"
  ]);
}

function getChecklistSheet(ss) {
  var sheets = ss.getSheets();
  for (var i = 0; i < sheets.length; i++) {
    var norm = normSheetName(sheets[i].getName());
    if (norm === "am_checklist" || norm === "checklist" || norm.indexOf("checklist") !== -1) return sheets[i];
  }
  return getOrCreateSheet(ss, "AM_CHECKLIST", [
    "Data Conferência", "Aeronave", "Aba", "Item", "Status", "Tipo NC", "Foto", "Observações", "Militar Responsável", "RG Responsável", "DataHora Registro"
  ]);
}

function getVoosSheet(ss) {
  var sheets = ss.getSheets();
  for (var i = 0; i < sheets.length; i++) {
    var norm = normSheetName(sheets[i].getName());
    if (norm === "am_voos" || norm === "voos" || norm.indexOf("voo") !== -1) return sheets[i];
  }
  return getOrCreateSheet(ss, "AM_VOOS", [
    "ID Voo", "Data", "Aeronave", "Nº Evento", "Nº RAPH/TIH", "Solicitante", "Local", "Tipo Missão", "Subtipo", 
    "Com Vítima", "Nome Vítima", "Idade", "Sexo", "Gravidade/Cor", "Diagnóstico", "Removida Aeronave", "Hospital Destino", 
    "Pilotos", "Médicos", "Enfermeiros", "OAT/Técnicos", "Hora Partida", "Hora Regresso", "Minutos Voo", "Observações"
  ]);
}

function getPassagemSheet(ss) {
  var sheets = ss.getSheets();
  for (var i = 0; i < sheets.length; i++) {
    var norm = normSheetName(sheets[i].getName());
    if (norm === "am_passagem" || norm === "passagem" || norm.indexOf("passagem") !== -1) return sheets[i];
  }
  return getOrCreateSheet(ss, "AM_PASSAGEM", [
    "ID Passagem", "Data Plantão", "Aeronave", "Ocorrências do Dia", "Material e Equipamentos", "Medicamentos e Insumos", 
    "Aeronaves Situação", "Pendências Próximo Plantão", "Observações Gerais", "Equipe Transmite", "RG Transmite", "Equipe Assume", "RG Assume", "DataHora Registro"
  ]);
}

/**
 * Endpoint de Leitura (GET)
 */
function doGet(e) {
  var action = (e && e.parameter && e.parameter.action) ? e.parameter.action : "getData";

  if (action === "getData") {
    return jsonResponse(getData());
  } else if (action === "ping") {
    return jsonResponse({ success: true, message: "Ponte SIG-AEROMÉDICO Ativa!", time: new Date().toISOString() });
  }

  return jsonResponse({ success: false, message: "Ação GET desconhecida: " + action });
}

/**
 * Endpoint de Gravação (POST)
 */
function doPost(e) {
  try {
    var raw = e.postData.contents;
    var data = JSON.parse(raw);
    var action = data.action || "";

    if (action === "authenticateOperator") {
      return jsonResponse(authenticateOperator(data));
    } else if (action === "registerOperator") {
      return jsonResponse(registerOperator(data));
    } else if (action === "saveAlmoxItem") {
      return jsonResponse(saveAlmoxItem(data));
    } else if (action === "moveAlmox") {
      return jsonResponse(moveAlmox(data));
    } else if (action === "registerSocorro") {
      return jsonResponse(registerSocorro(data));
    } else if (action === "saveChecklist") {
      return jsonResponse(saveChecklist(data));
    } else if (action === "saveVoo") {
      return jsonResponse(saveVoo(data));
    } else if (action === "savePassagem") {
      return jsonResponse(savePassagem(data));
    }

    return jsonResponse({ success: false, message: "Ação POST desconhecida: " + action });
  } catch (err) {
    return jsonResponse({ success: false, message: "Erro no processamento POST: " + err.toString() });
  }
}

/**
 * Leitura consolidada de todo o banco aeromédico
 */
function getData() {
  var ss = getSpreadsheet();
  
  var almoxSheet = getAlmoxSheet(ss);
  var socorrosSheet = getSocorrosSheet(ss);
  var checklistSheet = getChecklistSheet(ss);
  var voosSheet = getVoosSheet(ss);
  var passagemSheet = getPassagemSheet(ss);

  var almox = [];
  if (almoxSheet && almoxSheet.getLastRow() > 1) {
    almox = almoxSheet.getRange(2, 1, almoxSheet.getLastRow() - 1, 13).getValues();
  }

  var socorros = [];
  if (socorrosSheet && socorrosSheet.getLastRow() > 1) {
    socorros = socorrosSheet.getRange(2, 1, socorrosSheet.getLastRow() - 1, 11).getValues();
  }

  var checklists = [];
  if (checklistSheet && checklistSheet.getLastRow() > 1) {
    checklists = checklistSheet.getRange(2, 1, checklistSheet.getLastRow() - 1, 11).getValues();
  }

  var voos = [];
  if (voosSheet && voosSheet.getLastRow() > 1) {
    voos = voosSheet.getRange(2, 1, voosSheet.getLastRow() - 1, 24).getValues();
  }

  var passagens = [];
  if (passagemSheet && passagemSheet.getLastRow() > 1) {
    passagens = passagemSheet.getRange(2, 1, passagemSheet.getLastRow() - 1, 14).getValues();
  }

  return {
    success: true,
    almox: almox,
    socorros: socorros,
    checklists: checklists,
    voos: voos,
    passagens: passagens,
    time: new Date().toISOString()
  };
}

/**
 * Autenticação por RG e Senha na aba AM_USUARIOS
 */
function authenticateOperator(data) {
  var ss = getSpreadsheet();
  var usersSheet = getUsersSheet(ss);
  if (!usersSheet || usersSheet.getLastRow() < 2) {
    return { success: false, message: "Nenhum operador cadastrado no sistema. Por favor, crie sua conta." };
  }

  var users = usersSheet.getRange(2, 1, usersSheet.getLastRow() - 1, 5).getValues();
  var inputRg = String(data.rg || "").trim();
  var inputPass = String(data.password || "").trim();

  for (var i = 0; i < users.length; i++) {
    var row = users[i];
    var grad = String(row[0] || "").trim();
    var name = String(row[1] || "").trim();
    var rg = String(row[2] || "").trim();
    var pass = String(row[3] || "").trim();
    var role = String(row[4] || "Oficial Aeromédico").trim();

    if (rg === inputRg) {
      if (pass === inputPass) {
        return {
          success: true,
          user: { grad: grad, name: name, rg: rg, role: role }
        };
      } else {
        return { success: false, message: "Senha incorreta para o RG informado." };
      }
    }
  }

  return { success: false, message: "RG não encontrado. Por favor, cadastre sua conta." };
}

/**
 * Registro de Novo Militar no SIG-AEROMÉDICO
 */
function registerOperator(data) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    var ss = getSpreadsheet();
    var usersSheet = getUsersSheet(ss);

    var inputRg = String(data.rg || "").trim();
    if (!inputRg) {
      return { success: false, message: "O RG do militar é obrigatório." };
    }

    if (usersSheet.getLastRow() > 1) {
      var existingRgs = usersSheet.getRange(2, 3, usersSheet.getLastRow() - 1, 1).getValues();
      for (var i = 0; i < existingRgs.length; i++) {
        if (String(existingRgs[i][0]).trim() === inputRg) {
          return { success: false, message: "Este RG já possui cadastro ativo no SIG-Aeromédico. Faça login diretamente." };
        }
      }
    }

    var grad = String(data.grad || "").trim().toUpperCase();
    var name = String(data.name || "").trim().toUpperCase();
    var pass = String(data.password || "").trim();
    var role = String(data.role || "Médico de Voo").trim();
    var dataCad = new Date().toISOString();

    usersSheet.appendRow([grad, name, inputRg, pass, role, dataCad]);

    return {
      success: true,
      message: "Operador aeromédico registrado com sucesso!",
      user: { grad: grad, name: name, rg: inputRg, role: role }
    };
  } catch (err) {
    return { success: false, message: "Erro ao registrar militar: " + err.toString() };
  } finally {
    lock.releaseLock();
  }
}

/**
 * Salva ou atualiza item no Almoxarifado Médico
 */
function saveAlmoxItem(payload) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    var ss = getSpreadsheet();
    var sh = getAlmoxSheet(ss);
    var item = payload.item || {};
    var id = String(item.id || "ALM-" + Date.now()).trim();

    var rows = sh.getLastRow() > 1 ? sh.getRange(2, 1, sh.getLastRow() - 1, 1).getValues() : [];
    var targetRow = -1;
    for (var i = 0; i < rows.length; i++) {
      if (String(rows[i][0]).trim() === id) {
        targetRow = i + 2;
        break;
      }
    }

    var rowData = [
      id,
      item.name || "",
      item.category || "Insumos APH",
      item.unit || "un",
      Number(item.currentStock) || 0,
      Number(item.minStock) || 0,
      Number(item.idealStock) || 0,
      item.expirationDate || "",
      item.expirationDate2 || "",
      item.serialLot || "",
      item.manufacturer || "CBMERJ",
      item.location || "Almoxarifado Central UASA",
      item.obs || ""
    ];

    if (targetRow !== -1) {
      sh.getRange(targetRow, 1, 1, 13).setValues([rowData]);
    } else {
      sh.appendRow(rowData);
    }

    return { success: true, message: "Item salvo com sucesso no Almoxarifado!", id: id };
  } catch (err) {
    return { success: false, message: "Erro ao salvar item no Almoxarifado: " + err.toString() };
  } finally {
    lock.releaseLock();
  }
}

/**
 * Movimentação de estoque no Almoxarifado (Entrada, Saída ou Ajuste)
 */
function moveAlmox(payload) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    var ss = getSpreadsheet();
    var sh = getAlmoxSheet(ss);
    var itemId = String(payload.itemId || "").trim();
    var tipo = String(payload.type || "SAIDA").toUpperCase();
    var qty = Number(payload.quantity) || 0;

    if (sh.getLastRow() < 2) return { success: false, message: "Almoxarifado vazio." };
    var ids = sh.getRange(2, 1, sh.getLastRow() - 1, 1).getValues();
    var targetRow = -1;
    for (var i = 0; i < ids.length; i++) {
      if (String(ids[i][0]).trim() === itemId) {
        targetRow = i + 2;
        break;
      }
    }

    if (targetRow === -1) return { success: false, message: "Item não encontrado no Almoxarifado." };

    var curStock = Number(sh.getRange(targetRow, 5).getValue()) || 0;
    var newStock = curStock;

    if (tipo === "ENTRADA") newStock += qty;
    else if (tipo === "SAIDA") newStock = Math.max(0, curStock - qty);
    else if (tipo === "AJUSTE") newStock = qty;

    sh.getRange(targetRow, 5).setValue(newStock);

    return { success: true, message: "Estoque atualizado com sucesso!", newStock: newStock };
  } catch (err) {
    return { success: false, message: "Erro ao movimentar almoxarifado: " + err.toString() };
  } finally {
    lock.releaseLock();
  }
}

/**
 * Registra lançamento de Socorros com baixa automática no Almoxarifado
 */
function registerSocorro(payload) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    var ss = getSpreadsheet();
    var socSheet = getSocorrosSheet(ss);
    var s = payload.socorro || {};
    var op = payload.operator || {};

    var row = [
      new Date().toISOString(),
      s.itemName || "Material",
      s.type || "USO",
      Number(s.quantity) || 1,
      s.numEvento || "N/A",
      s.raphTih || "---",
      s.ocorrTipo || "Atendimento Aeromédico",
      op.warName ? (op.grad + " " + op.warName) : "Oficial Aeromédico",
      op.rg || "---",
      s.reporAlmox ? "SIM (" + (s.reporQtd || s.quantity) + " un)" : "NÃO",
      s.obs || ""
    ];

    socSheet.appendRow(row);

    // Se solicitado reposição imediata, realiza a baixa no estoque do almoxarifado
    if (s.reporAlmox && s.almoxItemId) {
      moveAlmox({
        itemId: s.almoxItemId,
        type: "SAIDA",
        quantity: Number(s.reporQtd) || Number(s.quantity) || 1
      });
    }

    return { success: true, message: "Lançamento de socorro registrado com sucesso!" };
  } catch (err) {
    return { success: false, message: "Erro ao registrar socorro: " + err.toString() };
  } finally {
    lock.releaseLock();
  }
}

/**
 * Grava conferência do Checklist Diário
 */
function saveChecklist(payload) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    var ss = getSpreadsheet();
    var chkSheet = getChecklistSheet(ss);
    var items = payload.items || [];
    var op = payload.operator || {};
    var aero = payload.aeronave || "Esquilo (Bombeiro 01)";
    var dataConf = payload.data || new Date().toISOString().split("T")[0];
    var nowIso = new Date().toISOString();

    for (var i = 0; i < items.length; i++) {
      var it = items[i];
      chkSheet.appendRow([
        dataConf,
        aero,
        it.aba || "MATERIAIS",
        it.nome || "",
        it.status || "OK",
        it.tipoNc || "",
        it.foto || "",
        it.obs || "",
        op.warName ? (op.grad + " " + op.warName) : "Oficial Aeromédico",
        op.rg || "---",
        nowIso
      ]);
    }

    return { success: true, message: "Checklist do dia salvo com sucesso!" };
  } catch (err) {
    return { success: false, message: "Erro ao salvar checklist: " + err.toString() };
  } finally {
    lock.releaseLock();
  }
}

/**
 * Salva Registro de Voo Aeromédico
 */
function saveVoo(payload) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    var ss = getSpreadsheet();
    var voosSheet = getVoosSheet(ss);
    var v = payload.voo || {};

    var row = [
      v.id || ("VOO-" + Date.now()),
      v.data || new Date().toISOString().split("T")[0],
      v.aeronave || "Bombeiro 01",
      v.numEvento || "",
      v.raph || "",
      v.solicitante || "COCB",
      v.local || "",
      v.tipo || "Primário",
      v.subtipo || "",
      v.comVitima ? "SIM" : "NÃO",
      v.vitimaNome || "NFPA",
      v.vitimaIdade || "",
      v.vitimaSexo || "",
      v.vitimaCor || "Vermelho",
      v.diagnostico || "",
      v.removida ? "SIM" : "NÃO",
      v.hospital || "",
      (v.pilotos || []).join(", "),
      (v.medicos || []).join(", "),
      (v.enfermeiros || []).join(", "),
      (v.tecnicos || []).join(", "),
      v.partida || "",
      v.regresso || "",
      Number(v.minutosVoo) || 0,
      v.obs || ""
    ];

    voosSheet.appendRow(row);

    return { success: true, message: "Voo aeromédico registrado com sucesso!" };
  } catch (err) {
    return { success: false, message: "Erro ao registrar voo: " + err.toString() };
  } finally {
    lock.releaseLock();
  }
}

/**
 * Salva Passagem de Serviço
 */
function savePassagem(payload) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    var ss = getSpreadsheet();
    var passSheet = getPassagemSheet(ss);
    var p = payload.passagem || {};
    var op = payload.operator || {};

    var row = [
      p.id || ("PAS-" + Date.now()),
      p.data || new Date().toISOString().split("T")[0],
      p.aeronave || "Bombeiro 01",
      p.ocorrencias || "",
      p.material || "",
      p.medicamentos || "",
      p.aeronaves || "",
      p.pendencias || "",
      p.observacoes || "",
      p.equipeTransmite || (op.grad + " " + op.warName),
      p.rgTransmite || op.rg || "---",
      p.equipeAssume || "",
      p.rgAssume || "",
      new Date().toISOString()
    ];

    passSheet.appendRow(row);

    return { success: true, message: "Passagem de serviço registrada com sucesso!" };
  } catch (err) {
    return { success: false, message: "Erro ao registrar passagem de serviço: " + err.toString() };
  } finally {
    lock.releaseLock();
  }
}

/**
 * Resposta Padronizada JSON com cabeçalhos CORS
 */
function jsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
