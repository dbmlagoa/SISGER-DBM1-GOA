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

/**
 * ============================================================================
 * PROCEDIMENTO DE AUTORIZAÇÃO DE E-MAIL (EXECUTAR UMA VEZ NO APPS SCRIPT):
 * ============================================================================
 * Se o sistema apresentar mensagem de permissão para MailApp.sendEmail:
 * 1. Na planilha Google, acesse: Extensões > Apps Script.
 * 2. No menu suspenso de funções no topo, selecione: AUTORIZAR_ENVIO_DE_EMAIL
 * 3. Clique em 'Executar' (botão de Play).
 * 4. Uma janela do Google solicitará autorização: clique em 'Revisar permissões',
 *    selecione sua conta Google (ex: dbmlagoa@gmail.com), clique em 'Avançado' >
 *    'Acessar SIG-Aeromédico (não seguro)' e clique em 'Permitir'.
 * 5. Pronto! O envio de e-mails via Web App estará 100% liberado e operacional.
 * ============================================================================
 */
function AUTORIZAR_ENVIO_DE_EMAIL() {
  var userEmail = Session.getActiveUser().getEmail() || Session.getEffectiveUser().getEmail() || "dbmlagoa@gmail.com";
  Logger.log("Iniciando concessão de permissão de e-mail para: " + userEmail);
  try {
    MailApp.sendEmail({
      to: userEmail,
      subject: "[SIG-AEROMÉDICO] Autorização de Envio de E-mail Concedida com Sucesso",
      body: "A autorização do Google Apps Script para envio de e-mails automáticos do SIG-Aeromédico foi concluída com êxito!"
    });
    Logger.log("Permissão concedida e e-mail de teste enviado para " + userEmail);
    return "SUCESSO: Permissão concedida! E-mail de teste enviado para " + userEmail;
  } catch (err) {
    Logger.log("Erro ao conceder autorização: " + err.toString());
    throw err;
  }
}

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
  return getOrCreateSheet(ss, "AM_USUARIOS", ["Graduação", "Nome de Guerra", "RG", "Senha", "Função", "Email", "Data Cadastro"]);
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

    if (action === "getData") {
      return jsonResponse(getData());
    } else if (action === "authenticateOperator") {
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
    } else if (action === "sendChecklistEmail") {
      return jsonResponse(sendChecklistEmail(data));
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

  // Leitura consolidada dos registros de realização do checklist
  var resumoSheet = getOrCreateSheet(ss, "AM_CHECKLIST_RESUMO", [
    "ID", "Data", "Aeronave", "Status", "Total Conferidos", "Alterações Relatadas", 
    "Observações Gerais", "Responsável", "RG Responsável", "Email", "DataHora Registro"
  ]);
  var checklistResumo = [];
  if (resumoSheet && resumoSheet.getLastRow() > 1) {
    var lastCol = Math.max(11, resumoSheet.getLastColumn());
    var rawRes = resumoSheet.getRange(2, 1, resumoSheet.getLastRow() - 1, lastCol).getValues();
    var firstRowHeaders = resumoSheet.getRange(1, 1, 1, lastCol).getValues()[0] || [];
    var hasLacre = firstRowHeaders.some(function(h) { return String(h).toLowerCase().indexOf("lacre") !== -1; });

    checklistResumo = rawRes.map(function(r) {
      if (hasLacre) {
        return {
          id: String(r[0] || ""),
          data: String(r[1] || ""),
          aeronave: String(r[2] || ""),
          status: String(r[3] || ""),
          totalConferidos: Number(r[4]) || 0,
          totalNCs: Number(r[5]) || 0,
          observacoesGerais: String(r[7] || ""),
          operator: String(r[8] || ""),
          rg: String(r[9] || ""),
          email: String(r[10] || ""),
          dataHoraRegistro: String(r[11] || "")
        };
      } else {
        return {
          id: String(r[0] || ""),
          data: String(r[1] || ""),
          aeronave: String(r[2] || ""),
          status: String(r[3] || ""),
          totalConferidos: Number(r[4]) || 0,
          totalNCs: Number(r[5]) || 0,
          observacoesGerais: String(r[6] || ""),
          operator: String(r[7] || ""),
          rg: String(r[8] || ""),
          email: String(r[9] || ""),
          dataHoraRegistro: String(r[10] || "")
        };
      }
    });
  }

  var voos = [];
  if (voosSheet && voosSheet.getLastRow() > 1) {
    voos = voosSheet.getRange(2, 1, voosSheet.getLastRow() - 1, 24).getValues();
  }

  var passagens = [];
  if (passagemSheet && passagemSheet.getLastRow() > 1) {
    passagens = passagemSheet.getRange(2, 1, passagemSheet.getLastRow() - 1, 14).getValues();
  }

  var usersSheet = getUsersSheet(ss);
  var users = [];
  if (usersSheet && usersSheet.getLastRow() > 1) {
    var uRows = usersSheet.getRange(2, 1, usersSheet.getLastRow() - 1, 6).getValues();
    users = uRows.map(function(r) {
      return {
        grad: String(r[0] || "").trim(),
        warName: String(r[1] || "").trim(),
        rg: String(r[2] || "").trim(),
        role: String(r[4] || "").trim(),
        email: String(r[5] || "").trim()
      };
    });
  }

  return {
    success: true,
    almox: almox,
    socorros: socorros,
    checklists: checklists,
    checklistResumo: checklistResumo,
    voos: voos,
    passagens: passagens,
    users: users,
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

  var users = usersSheet.getRange(2, 1, usersSheet.getLastRow() - 1, 6).getValues();
  var inputRgRaw = String(data.rg || "").trim();
  var inputRgDigits = inputRgRaw.replace(/\D/g, "");
  var inputPass = String(data.password || data.pass || "").trim();

  for (var i = 0; i < users.length; i++) {
    var row = users[i];
    var grad = String(row[0] || "").trim();
    var name = String(row[1] || "").trim();
    var rg = String(row[2] || "").trim();
    var pass = String(row[3] || "").trim();
    var role = String(row[4] || "Oficial Aeromédico").trim();
    var email = String(row[5] || "").trim();
    var rowRgDigits = rg.replace(/\D/g, "");

    if (rg === inputRgRaw || (inputRgDigits && rowRgDigits === inputRgDigits)) {
      if (pass === inputPass) {
        return {
          success: true,
          user: { grad: grad, name: name, rg: rg, role: role, email: email }
        };
      } else {
        return { success: false, message: "Senha incorreta para o RG informado." };
      }
    }
  }

  return { success: false, message: "RG não encontrado. Por favor, cadastre sua conta." };
}

/**
 * Registro / Redefinição de Senha do Militar no SIG-AEROMÉDICO
 */
function registerOperator(data) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    var ss = getSpreadsheet();
    var usersSheet = getUsersSheet(ss);

    var inputRgRaw = String(data.rg || "").trim();
    var inputRgDigits = inputRgRaw.replace(/\D/g, "");
    if (!inputRgRaw) {
      return { success: false, message: "O RG do militar é obrigatório." };
    }

    var grad = String(data.grad || "").trim().toUpperCase();
    var name = String(data.name || data.warName || "").trim().toUpperCase();
    var pass = String(data.password || data.pass || "").trim();
    var role = String(data.role || "Médico de Voo").trim();
    var email = String(data.email || "").trim().toLowerCase();
    var dataCad = new Date().toISOString();

    if (!pass) {
      return { success: false, message: "A senha de acesso é obrigatória." };
    }

    var existingRow = -1;
    if (usersSheet.getLastRow() > 1) {
      var existingData = usersSheet.getRange(2, 1, usersSheet.getLastRow() - 1, 6).getValues();
      for (var i = 0; i < existingData.length; i++) {
        var rRg = String(existingData[i][2] || "").trim();
        var rRgDigits = rRg.replace(/\D/g, "");
        if (rRg === inputRgRaw || (inputRgDigits && rRgDigits === inputRgDigits)) {
          existingRow = i + 2;
          break;
        }
      }
    }

    if (existingRow !== -1) {
      // Atualização de cadastro existente / nova senha
      var curGrad = usersSheet.getRange(existingRow, 1).getValue();
      var curName = usersSheet.getRange(existingRow, 2).getValue();
      var curRole = usersSheet.getRange(existingRow, 5).getValue();
      var curEmail = usersSheet.getRange(existingRow, 6).getValue();

      usersSheet.getRange(existingRow, 1, 1, 7).setValues([[
        grad || curGrad,
        name || curName,
        inputRgRaw,
        pass,
        role || curRole,
        email || curEmail,
        dataCad
      ]]);

      return {
        success: true,
        message: "Cadastro e senha atualizados com sucesso no banco de dados!",
        user: { grad: grad || curGrad, name: name || curName, rg: inputRgRaw, role: role || curRole, email: email || curEmail }
      };
    }

    // Novo cadastro
    usersSheet.appendRow([grad, name, inputRgRaw, pass, role, email, dataCad]);

    return {
      success: true,
      message: "Operador aeromédico registrado com sucesso!",
      user: { grad: grad, name: name, rg: inputRgRaw, role: role, email: email }
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
    if (s.reporAlmox) {
      var almoxQtd = Number(s.reporQtd) || Number(s.quantity) || 1;
      if (s.almoxItemId) {
        moveAlmox({
          itemId: s.almoxItemId,
          type: "SAIDA",
          quantity: almoxQtd
        });
      } else if (s.itemName) {
        try {
          var almoxSh = getAlmoxSheet(ss);
          if (almoxSh.getLastRow() >= 2) {
            var almoxData = almoxSh.getRange(2, 1, almoxSh.getLastRow() - 1, 5).getValues();
            for (var a = 0; a < almoxData.length; a++) {
              var rowName = String(almoxData[a][1] || "").toLowerCase().trim();
              var targetName = String(s.itemName).toLowerCase().trim();
              if (rowName === targetName || (rowName && (targetName.indexOf(rowName) !== -1 || rowName.indexOf(targetName) !== -1))) {
                var curStock = Number(almoxData[a][4]) || 0;
                almoxSh.getRange(a + 2, 5).setValue(Math.max(0, curStock - almoxQtd));
                break;
              }
            }
          }
        } catch(eAlmox) {
          Logger.log("Aviso ao baixar almoxarifado por nome: " + eAlmox);
        }
      }
    }

    return { success: true, message: "Lançamento de socorro registrado com sucesso!" };
  } catch (err) {
    return { success: false, message: "Erro ao registrar socorro: " + err.toString() };
  } finally {
    lock.releaseLock();
  }
}

/**
 * Grava conferência do Checklist Diário e Interage com Almoxarifado
 */
function saveChecklist(payload) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(15000);
    var ss = getSpreadsheet();
    var chkSheet = getChecklistSheet(ss);
    
    var chk = payload.checklist || payload || {};
    var items = payload.items || chk.items || [];
    var op = payload.operator || chk.operator || {};
    var aero = payload.aeronave || chk.aeronave || "Bombeiro 02";
    var dataConf = payload.data || chk.data || new Date().toISOString().split("T")[0];
    var obsGerais = payload.observacoes || chk.observacoesGerais || chk.obs || "";
    var nowIso = new Date().toISOString();

    var opNome = op.warName ? (op.grad + " " + op.warName) : (typeof op === "string" ? op : "Oficial Aeromédico");
    var opRg = op.rg || "---";
    var opEmail = op.email || "";

    // 1. Grava na aba AM_CHECKLIST APENAS as alterações relatadas (NCs / Anomalias)
    // Para os itens sem alteração, NÃO gera 220 linhas; registra apenas as alterações apontadas
    var alterations = payload.alterations || payload.ncs || chk.ncs || [];
    var rowsToAppend = [];

    // Se foram passadas alterações explícitas
    if (alterations && alterations.length > 0) {
      for (var i = 0; i < alterations.length; i++) {
        var alt = alterations[i];
        rowsToAppend.push([
          dataConf,
          aero,
          alt.aba || "MATERIAIS",
          alt.nome || alt.itemName || alt.name || "Item",
          "ALTERAÇÃO RELATADA (NC)",
          alt.tipoNc || alt.ncType || "NÃO CONFORME",
          alt.foto || alt.photo || "",
          alt.obs || alt.notes || "",
          opNome,
          opRg,
          nowIso
        ]);
      }
    } else if (items && items.length > 0) {
      // Fallback: filtra dos itens apenas os que possuem status NC ou tipo de NC
      for (var j = 0; j < items.length; j++) {
        var it = items[j];
        if (it.status === "NC" || (it.ncType && it.ncType.trim() !== "")) {
          rowsToAppend.push([
            dataConf,
            aero,
            it.aba || "MATERIAIS",
            it.nome || it.name || "Item",
            "ALTERAÇÃO RELATADA (NC)",
            it.tipoNc || it.ncType || "NÃO CONFORME",
            it.foto || "",
            it.obs || it.notes || "",
            opNome,
            opRg,
            nowIso
          ]);
        }
      }
    }

    if (rowsToAppend.length > 0) {
      var startRow = chkSheet.getLastRow() + 1;
      chkSheet.getRange(startRow, 1, rowsToAppend.length, 11).setValues(rowsToAppend);
    }

    // 2. Grava na aba AM_CHECKLIST_RESUMO a informação consolidada de que o checklist foi realizado
    var totalAlt = rowsToAppend.length;
    var totalConf = Number(payload.totalConferidos !== undefined ? payload.totalConferidos : (chk.totalConferidos || 0));
    var isCompleto = totalConf >= 210;
    var statusRealizacao = isCompleto 
      ? (totalAlt > 0 ? "REALIZADO COM ALTERAÇÕES (" + totalAlt + " NC)" : "REALIZADO SEM ALTERAÇÕES (100% OPERANTE)") 
      : "INCOMPLETO PENDENTE (" + totalConf + "/210)";

    var resumoSheet = getOrCreateSheet(ss, "AM_CHECKLIST_RESUMO", [
      "ID", "Data", "Aeronave", "Status", "Total Conferidos", "Alterações Relatadas", 
      "Observações Gerais", "Responsável", "RG Responsável", "Email", "DataHora Registro"
    ]);

    var lastColResumo = Math.max(1, resumoSheet.getLastColumn());
    var firstRowResumo = resumoSheet.getRange(1, 1, 1, lastColResumo).getValues()[0] || [];
    var hasLacreResumo = firstRowResumo.some(function(h) { return String(h).toLowerCase().indexOf("lacre") !== -1; });

    if (hasLacreResumo) {
      resumoSheet.appendRow([
        chk.id || ("CHK-" + Date.now()),
        dataConf,
        aero,
        statusRealizacao,
        totalConf,
        totalAlt,
        "---", // Lacre eliminado
        obsGerais,
        opNome,
        opRg,
        opEmail,
        nowIso
      ]);
    } else {
      resumoSheet.appendRow([
        chk.id || ("CHK-" + Date.now()),
        dataConf,
        aero,
        statusRealizacao,
        totalConf,
        totalAlt,
        obsGerais,
        opNome,
        opRg,
        opEmail,
        nowIso
      ]);
    }

    // 3. Interação direta com o banco de dados do Almoxarifado
    var almoxSheet = getAlmoxSheet(ss);
    if (almoxSheet && almoxSheet.getLastRow() > 1) {
      var almoxValues = almoxSheet.getRange(2, 1, almoxSheet.getLastRow() - 1, 13).getValues();
      
      // Aponta pendências de itens NC no Almoxarifado
      var ncs = chk.ncs || payload.ncs || [];
      for (var n = 0; n < ncs.length; n++) {
        var ncItem = ncs[n];
        var ncName = String(ncItem.itemName || ncItem.nome || "").toLowerCase().trim();
        for (var a = 0; a < almoxValues.length; a++) {
          var aName = String(almoxValues[a][1] || "").toLowerCase().trim();
          if (aName && (ncName.indexOf(aName) !== -1 || aName.indexOf(ncName) !== -1)) {
            var curObs = String(almoxValues[a][12] || "");
            var alerta = "[NC CHECKLIST " + dataConf + " " + aero + ": " + (ncItem.ncType || "NC") + " - " + (ncItem.notes || "") + " por " + opNome + "]";
            if (curObs.indexOf(alerta) === -1) {
              almoxSheet.getRange(a + 2, 13).setValue((curObs + " " + alerta).trim());
            }
            break;
          }
        }
      }

      // Processa Psicotrópicos com baixa de reposição no almoxarifado
      var psico = chk.psicotropicos || payload.psicotropicos || [];
      for (var p = 0; p < psico.length; p++) {
        var med = psico[p];
        var used = Number(med.utilizados) || 0;
        var rep = Number(med.reposto) || 0;
        if (used > 0 || rep > 0) {
          var medName = String(med.name || "").toLowerCase().trim();
          for (var a2 = 0; a2 < almoxValues.length; a2++) {
            var rowName = String(almoxValues[a2][1] || "").toLowerCase().trim();
            if (rowName.indexOf(medName) !== -1) {
              var curStock = Number(almoxValues[a2][4]) || 0;
              var newStock = Math.max(0, curStock - rep);
              almoxSheet.getRange(a2 + 2, 5).setValue(newStock);
              break;
            }
          }
          if (used > 0) {
            getSocorrosSheet(ss).appendRow([
              nowIso,
              med.name + " (Psicotrópico)",
              "CONSUMO_AERONAVE",
              used,
              "CHECKLIST-" + aero,
              "---",
              "Consumo Operacional",
              opNome,
              opRg,
              rep > 0 ? ("SIM (" + rep + " reposto)") : "NÃO",
              med.obs || obsGerais
            ]);
          }
        }
      }
    }

    return { 
      success: true, 
      message: "Checklist salvo com sucesso no banco de dados e sincronizado com o Almoxarifado!",
      id: chk.id || ("CHK-" + Date.now())
    };
  } catch (err) {
    return { success: false, message: "Erro ao salvar checklist: " + err.toString() };
  } finally {
    lock.releaseLock();
  }
}

/**
 * Envia Relatório de Checklist por E-mail ao Militar Responsável
 */
function sendChecklistEmail(payload) {
  try {
    var to = String(payload.to || (payload.operator && payload.operator.email) || "").trim();
    if (!to || to.indexOf("@") === -1) {
      return { success: false, message: "E-mail do operador não informado ou inválido." };
    }

    var aero = payload.aeronave || "Bombeiro Aeromédico";
    var dataStr = payload.data || new Date().toISOString().split("T")[0];
    var opNome = payload.operator ? (payload.operator.grad + " " + payload.operator.warName + " (RG " + payload.operator.rg + ")") : "Oficial";
    var totalItens = payload.totalItens || 0;
    var totalNCs = payload.totalNCs || 0;
    var obs = payload.observacoes || "Nenhuma observação informada.";

    var subject = "[SIG-AEROMÉDICO] Checklist Diário • " + aero + " • " + dataStr;
    
    var htmlBody = "<div style='font-family: Arial, sans-serif; color: #2b261f; line-height: 1.5; max-width: 650px; margin: 0 auto; border: 1px solid #e2d7c7; border-radius: 12px; overflow: hidden;'>" +
      "<div style='background-color: #dc2626; color: #ffffff; padding: 18px 24px;'>" +
      "<h2 style='margin: 0; font-size: 18px;'>CORPO DE BOMBEIROS MILITAR DO ESTADO DO RIO DE JANEIRO</h2>" +
      "<h3 style='margin: 4px 0 0; font-size: 14px; font-weight: normal;'>DBM 1 / GOA • SIG-AEROMÉDICO</h3>" +
      "</div>" +
      "<div style='padding: 24px; background-color: #fcfbf9;'>" +
      "<p style='font-size: 14px; margin-top: 0;'>Prezado(a) <strong>" + opNome + "</strong>,</p>" +
      "<p style='font-size: 13px; color: #575043;'>Seu Checklist Diário foi registrado com sucesso no banco de dados do SIG-Aeromédico.</p>" +
      "<table style='width: 100%; border-collapse: collapse; margin: 20px 0; background: #ffffff; border: 1px solid #e8dfd3; border-radius: 8px;'>" +
      "<tr><td style='padding: 10px 14px; border-bottom: 1px solid #eee; font-weight: bold; width: 40%;'>Aeronave:</td><td style='padding: 10px 14px; border-bottom: 1px solid #eee; color: #dc2626; font-weight: bold;'>" + aero + "</td></tr>" +
      "<tr><td style='padding: 10px 14px; border-bottom: 1px solid #eee; font-weight: bold;'>Data da Conferência:</td><td style='padding: 10px 14px; border-bottom: 1px solid #eee;'>" + dataStr + "</td></tr>" +
      "<tr><td style='padding: 10px 14px; border-bottom: 1px solid #eee; font-weight: bold;'>Total de Itens Conferidos:</td><td style='padding: 10px 14px; border-bottom: 1px solid #eee;'>" + totalItens + "</td></tr>" +
      "<tr><td style='padding: 10px 14px; border-bottom: 1px solid #eee; font-weight: bold;'>Não Conformidades (NCs):</td><td style='padding: 10px 14px; border-bottom: 1px solid #eee; color: " + (totalNCs > 0 ? "#dc2626" : "#16a34a") + "; font-weight: bold;'>" + totalNCs + "</td></tr>" +
      "<tr><td style='padding: 10px 14px; font-weight: bold;'>Observações Gerais:</td><td style='padding: 10px 14px;'>" + obs + "</td></tr>" +
      "</table>" +
      "<p style='font-size: 12px; color: #8c8273;'>Comprovante oficial gerado pelo SIG-Aeromédico DBM 1 / GOA.</p>" +
      "</div>" +
      "</div>";

    var attachments = [];
    if (payload.pdfBase64) {
      var pdfBlob = Utilities.newBlob(Utilities.base64Decode(payload.pdfBase64), "application/pdf", "Checklist_" + aero.replace(/\s+/g, "_") + "_" + dataStr + ".pdf");
      attachments.push(pdfBlob);
    }

    try {
      MailApp.sendEmail({
        to: to,
        subject: subject,
        htmlBody: htmlBody,
        attachments: attachments
      });
      return { success: true, message: "E-mail com checklist enviado com sucesso para " + to + "!" };
    } catch (sendErr) {
      var errStr = sendErr.toString();
      if (errStr.indexOf("permissão") !== -1 || errStr.indexOf("permission") !== -1 || errStr.indexOf("MailApp") !== -1) {
        return {
          success: false,
          needsAuth: true,
          message: "⚠️ Permissão de e-mail pendente no Google Apps Script.\n\n" +
                   "Para habilitar o envio em 30 segundos:\n" +
                   "1. Abra a planilha vinculada > Extensões > Apps Script\n" +
                   "2. Selecione a função 'AUTORIZAR_ENVIO_DE_EMAIL' e clique em 'Executar'\n" +
                   "3. Conceda a autorização do Google.\n\n" +
                   "O arquivo PDF do checklist já foi baixado no seu computador!"
        };
      }
      return { success: false, message: "Erro ao enviar e-mail: " + errStr };
    }
  } catch (e) {
    return { success: false, message: "Erro ao processar e-mail: " + e.toString() };
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
