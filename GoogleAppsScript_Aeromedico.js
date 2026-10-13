/**
 * ============================================================================
 * SISGER DBM 1 / GOA - CBMERJ
 * BACKEND GOOGLE APPS SCRIPT: SISTEMA DE CONTROLE AEROMÉDICO (SIG-AEROMÉDICO v2)
 * Unidade Avançada de Suporte Aeromédico (UASA) • DBM1/GOA - Aeroporto de Jacarepaguá (SBJR)
 * ============================================================================
 * 
 * Planilha Integrada Oficial:
 * https://docs.google.com/spreadsheets/d/1s6Fm1E4-4FzjHdXDtqlBzzSNiiZFs-S6xI42fR93bTw/edit
 * 
 * INSTRUÇÕES DE IMPLANTAÇÃO (2 MINUTOS):
 * ----------------------------------------------------------------------------
 * 1. Abra a planilha do Google Docs:
 *    https://docs.google.com/spreadsheets/d/1s6Fm1E4-4FzjHdXDtqlBzzSNiiZFs-S6xI42fR93bTw/edit
 * 2. No menu superior, clique em: Extensões > Apps Script.
 * 3. Apague o código existente no editor e cole TODO este arquivo.
 * 4. Na barra superior de funções (ao lado de 'Depurar'), selecione:
 *    👉 inicializarPlanilhaAeromedico
 * 5. Clique em ▶️ "Executar" e conceda as permissões de acesso da conta Google.
 *    (Isso criará automaticamente as abas de Kits de Bordo, Portaria 344 e Cilindros de O2
 *     preservando integralmente os itens já existentes!).
 * 6. Em seguida, clique no botão azul "Implantar" > "Gerenciar implantações":
 *    - Clique no ícone de lápis (Editar)
 *    - Versão: selecione "Nova versão"
 *    - Clique em "Implantar".
 * 7. Copie a URL do App da Web e certifique-se de que ela está configurada no
 *    arquivo modules/aeromedico.html.
 * ============================================================================
 */

// ID da Planilha Oficial de Controle Aeromédico do DBM1/GOA
var SPREADSHEET_ID = "1s6Fm1E4-4FzjHdXDtqlBzzSNiiZFs-S6xI42fR93bTw";

// Nomes oficiais das abas
var SHEET_ITEMS = "items";
var SHEET_TRANS = "transactions";
var SHEET_USERS = "users";
var SHEET_KITS = "kits_bordo";
var SHEET_CONTROLADOS = "livro_controlados";
var SHEET_O2 = "cilindros_o2";

function getSpreadsheet() {
  if (SPREADSHEET_ID && SPREADSHEET_ID.trim() !== "") {
    try {
      return SpreadsheetApp.openById(SPREADSHEET_ID);
    } catch (e) {
      // Se for container-bound
      return SpreadsheetApp.getActiveSpreadsheet();
    }
  }
  return SpreadsheetApp.getActiveSpreadsheet();
}

/**
 * ============================================================================
 * FUNÇÃO DE INICIALIZAÇÃO E FORMATAÇÃO AUTOMÁTICA DAS ABAS (EXECUTE NO EDITOR)
 * ============================================================================
 */
function inicializarPlanilhaAeromedico() {
  var ss = getSpreadsheet();
  
  // 1. Aba items (preserva se existir, garante cabeçalhos)
  var sheetItems = getOrCreateSheet(ss, SHEET_ITEMS);
  if (sheetItems.getLastRow() === 0) {
    sheetItems.appendRow([
      "ID", "Nome do Insumo / Equipamento", "Fabricante / Marca", "Data de Validade", 
      "Vida Útil", "Lote / Série", "Saldo Atual", "Saldo Mínimo", "Categoria", "Localização"
    ]);
    formatHeaderRow(sheetItems, "#002B49"); // Azul Naval CBMERJ
  }

  // 2. Aba transactions (preserva se existir)
  var sheetTrans = getOrCreateSheet(ss, SHEET_TRANS);
  if (sheetTrans.getLastRow() === 0) {
    sheetTrans.appendRow([
      "Data Movimentação", "Nome do Insumo", "Tipo", "Quantidade", 
      "Graduação Portador", "Nome Guerra Portador", "RG Portador", 
      "Nome Guerra Registrador", "Motivo / Ocorrência", "RG Registrador", 
      "Nº Missão / Oncall", "Lote"
    ]);
    formatHeaderRow(sheetTrans, "#004080");
  }

  // 3. Aba users
  var sheetUsers = getOrCreateSheet(ss, SHEET_USERS);
  if (sheetUsers.getLastRow() === 0) {
    sheetUsers.appendRow(["RG", "Nome de Guerra", "Graduação / Posto", "Senha", "Perfil"]);
    formatHeaderRow(sheetUsers, "#334155");
    // Usuários padrão operacionais do GOA
    sheetUsers.appendRow(["45317", "Liborio", "1º Ten BM", "salvamento193", "Gestor Farmácia"]);
    sheetUsers.appendRow(["49917", "Petrus", "Cap BM Méd", "salvamento193", "Médico de Voo"]);
  }

  // 4. Aba kits_bordo (Kits padronizados com lacres)
  var sheetKits = getOrCreateSheet(ss, SHEET_KITS);
  if (sheetKits.getLastRow() === 0) {
    sheetKits.appendRow([
      "ID_Kit", "Nome do Kit", "Aeronave Designada", "Nº Lacre Atual", 
      "Data Última Conferência", "Graduação Responsável", "Nome Responsável", 
      "RG Responsável", "Status", "Observações"
    ]);
    formatHeaderRow(sheetKits, "#B91C1C"); // Vermelho Resgate

    // Dados iniciais dos kits padrão do DBM1/GOA
    var hoje = Utilities.formatDate(new Date(), "America/Sao_Paulo", "yyyy-MM-dd HH:mm");
    sheetKits.appendRow(["KIT-01", "Mochila Vias Aéreas & Intubação", "Esquilo (Bombeiro 01)", "LAC-2026-0841", hoje, "Cap BM Méd", "Petrus", "49917", "LACRADO", "Conferido pós-briefing. Tudo em conformidade."]);
    sheetKits.appendRow(["KIT-02", "Mochila Acesso Venoso & Fármacos", "Esquilo (Bombeiro 01)", "LAC-2026-0842", hoje, "Cap BM Méd", "Petrus", "49917", "LACRADO", "Inclui drogas de PCR e sedativos."]);
    sheetKits.appendRow(["KIT-03", "Mochila de Trauma & Curativos Táticos", "Esquilo (Bombeiro 01)", "LAC-2026-0843", hoje, "1º Ten BM", "Liborio", "45317", "LACRADO", "Torniquetes CAT e agentes hemostáticos."]);
    sheetKits.appendRow(["KIT-04", "Kit Parto & Pediátrico Avançado", "Esquilo (Bombeiro 01)", "LAC-2026-0844", hoje, "1º Ten BM", "Liborio", "45317", "LACRADO", "Fita de Broselow e material estéril."]);
    sheetKits.appendRow(["KIT-05", "Mochila Completa UASA (Suporte Avançado)", "AW169 (Sobreaviso)", "LAC-2026-0910", hoje, "Cap BM Méd", "Petrus", "49917", "LACRADO", "Configuração UTI Aérea Completa."]);
  }

  // 5. Aba livro_controlados (Portaria SVS/MS nº 344/98)
  var sheetControlados = getOrCreateSheet(ss, SHEET_CONTROLADOS);
  if (sheetControlados.getLastRow() === 0) {
    sheetControlados.appendRow([
      "Data/Hora", "Fármaco / Substância", "Lote", "Qtd Sacada", "Qtd Aplicada", 
      "Qtd Descarte Sobras", "Nº Missão / Oncall", "Paciente / Ocorrência", 
      "Médico Prescritor", "CRM Médico", "Enfermeiro Testemunha", "COREN Enf", "Termo Status"
    ]);
    formatHeaderRow(sheetControlados, "#7C2D12"); // Amber escuro farmacêutico
  }

  // 6. Aba cilindros_o2
  var sheetO2 = getOrCreateSheet(ss, SHEET_O2);
  if (sheetO2.getLastRow() === 0) {
    sheetO2.appendRow([
      "ID_Cilindro", "Identificação / Modelo", "Aeronave / Localização", 
      "Capacidade (Litros)", "Pressão Atual (PSI)", "Data Teste Hidrostático", 
      "Validade Teste", "Status Carga"
    ]);
    formatHeaderRow(sheetO2, "#0369A1"); // Azul Celeste Aeronáutico

    sheetO2.appendRow(["O2-01", "Cilindro Fibra de Carbono Luxfer 4.7L", "Esquilo (Bombeiro 01)", 1000, 2000, "2024-01-15", "2029-01-15", "OPERACIONAL (100%)"]);
    sheetO2.appendRow(["O2-02", "Cilindro Alumínio Portátil ME 2.9L", "Mochila Vias Aéreas", 680, 1950, "2023-06-10", "2028-06-10", "OPERACIONAL (98%)"]);
    sheetO2.appendRow(["O2-03", "Cilindro Reserva Hangar UASA 10L", "Reserva DBM1", 2000, 2200, "2025-02-20", "2030-02-20", "OPERACIONAL (100%)"]);
  }

  Logger.log("✅ INICIALIZAÇÃO DO CONTROLE AEROMÉDICO DBM1/GOA CONCLUÍDA COM SUCESSO!");
}

function getOrCreateSheet(ss, sheetName) {
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
  }
  return sheet;
}

function formatHeaderRow(sheet, bgColor) {
  var numCols = sheet.getLastColumn() || 1;
  var range = sheet.getRange(1, 1, 1, numCols);
  range.setFontWeight("bold")
       .setBackground(bgColor)
       .setFontColor("#FFFFFF")
       .setHorizontalAlignment("center");
  sheet.setFrozenRows(1);
}

/**
 * ============================================================================
 * ENDPOINT GET: LEITURA COMPLETA DOS DADOS OPERACIONAIS
 * ============================================================================
 */
function doGet(e) {
  try {
    var ss = getSpreadsheet();
    var params = e ? e.parameter : {};
    var action = params.action || "getAll";

    // 1. Leitura de items
    var sheetItems = ss.getSheetByName(SHEET_ITEMS);
    var rawItems = [];
    if (sheetItems && sheetItems.getLastRow() > 1) {
      rawItems = sheetItems.getRange(2, 1, sheetItems.getLastRow() - 1, Math.max(sheetItems.getLastColumn(), 8)).getValues();
    }

    // 2. Leitura de transactions
    var sheetTrans = ss.getSheetByName(SHEET_TRANS);
    var rawTrans = [];
    if (sheetTrans && sheetTrans.getLastRow() > 1) {
      rawTrans = sheetTrans.getRange(2, 1, sheetTrans.getLastRow() - 1, Math.max(sheetTrans.getLastColumn(), 10)).getValues();
    }

    // 3. Leitura de kits_bordo
    var sheetKits = ss.getSheetByName(SHEET_KITS);
    var rawKits = [];
    if (sheetKits && sheetKits.getLastRow() > 1) {
      rawKits = sheetKits.getRange(2, 1, sheetKits.getLastRow() - 1, sheetKits.getLastColumn()).getValues();
    }

    // 4. Leitura de livro_controlados
    var sheetControlados = ss.getSheetByName(SHEET_CONTROLADOS);
    var rawControlados = [];
    if (sheetControlados && sheetControlados.getLastRow() > 1) {
      rawControlados = sheetControlados.getRange(2, 1, sheetControlados.getLastRow() - 1, sheetControlados.getLastColumn()).getValues();
    }

    // 5. Leitura de cilindros_o2
    var sheetO2 = ss.getSheetByName(SHEET_O2);
    var rawO2 = [];
    if (sheetO2 && sheetO2.getLastRow() > 1) {
      rawO2 = sheetO2.getRange(2, 1, sheetO2.getLastRow() - 1, sheetO2.getLastColumn()).getValues();
    }

    // Resposta padrão (preserva total compatibilidade com versões antigas: .items e .transactions)
    var response = {
      status: "success",
      unit: "DBM1/GOA - CBMERJ",
      timestamp: new Date().toISOString(),
      items: rawItems,
      transactions: rawTrans,
      kits: rawKits,
      controlados: rawControlados,
      cilindrosO2: rawO2
    };

    return jsonResponse(response);
  } catch (err) {
    return jsonResponse({ status: "error", message: err.toString() });
  }
}

/**
 * ============================================================================
 * ENDPOINT POST: GRAVAÇÕES E OPERAÇÕES DA TRIPULAÇÃO
 * ============================================================================
 */
function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(30000);

  try {
    var rawData = e.postData.contents;
    var data = JSON.parse(rawData);
    var action = data.action;
    var ss = getSpreadsheet();

    // ----------------------------------------------------
    // AÇÃO 1: Autenticação de Usuário (loginUser)
    // ----------------------------------------------------
    if (action === "loginUser") {
      var creds = data.credentials || {};
      var sheetUsers = ss.getSheetByName(SHEET_USERS);
      if (!sheetUsers || sheetUsers.getLastRow() <= 1) {
        // Fallback para militares administradores caso aba ainda não tenha dados
        if (String(creds.rg) === "45317" || String(creds.rg) === "49917" || String(creds.password) === "salvamento193") {
          return jsonResponse({
            status: "success",
            user: { rg: creds.rg, warName: "Tripulante", graduation: "Oficial BM", role: "Gestor" }
          });
        }
      } else {
        var usersData = sheetUsers.getRange(2, 1, sheetUsers.getLastRow() - 1, 5).getValues();
        for (var i = 0; i < usersData.length; i++) {
          if (String(usersData[i][0]).trim() === String(creds.rg).trim() && 
              String(usersData[i][3]).trim() === String(creds.password).trim()) {
            return jsonResponse({
              status: "success",
              user: {
                rg: String(usersData[i][0]),
                warName: String(usersData[i][1]),
                graduation: String(usersData[i][2]),
                role: String(usersData[i][4] || "Operador")
              }
            });
          }
        }
      }
      return jsonResponse({ status: "error", message: "RG ou senha incorretos." });
    }

    // ----------------------------------------------------
    // AÇÃO 2: Cadastro de Usuário (registerUser)
    // ----------------------------------------------------
    if (action === "registerUser") {
      var u = data.user || {};
      var sheetUsers = getOrCreateSheet(ss, SHEET_USERS);
      sheetUsers.appendRow([String(u.rg), String(u.warName), String(u.graduation), String(u.password), "Operador Aeromédico"]);
      return jsonResponse({ status: "success", message: "Militar cadastrado com sucesso!" });
    }

    // ----------------------------------------------------
    // AÇÃO 3: Salvar ou Atualizar Insumo (saveItem)
    // ----------------------------------------------------
    if (action === "saveItem") {
      var item = data.item || {};
      var sheetItems = getOrCreateSheet(ss, SHEET_ITEMS);
      var lastRow = sheetItems.getLastRow();
      var foundRow = -1;

      if (lastRow > 1) {
        var ids = sheetItems.getRange(2, 1, lastRow - 1, 1).getValues();
        for (var i = 0; i < ids.length; i++) {
          if (String(ids[i][0]) === String(item.id)) {
            foundRow = i + 2;
            break;
          }
        }
      }

      var rowValues = [
        item.id || ("ID-" + Date.now()),
        item.name,
        item.manufacturer || "",
        item.expirationDate || "",
        item.lifespan || 0,
        item.serialLot || "",
        Number(item.currentStock) || 0,
        Number(item.minStock) || 0,
        item.category || "Fármaco Comum",
        item.location || "Farmácia UASA"
      ];

      if (foundRow > 1) {
        sheetItems.getRange(foundRow, 1, 1, rowValues.length).setValues([rowValues]);
      } else {
        sheetItems.appendRow(rowValues);
      }

      return jsonResponse({ status: "success", message: "Insumo gravado com sucesso!" });
    }

    // ----------------------------------------------------
    // AÇÃO 4: Registro de Movimentação Individual (registerMovement)
    // ----------------------------------------------------
    if (action === "registerMovement") {
      var trans = data.trans || {};
      var newStock = data.newStock;
      var sheetTrans = getOrCreateSheet(ss, SHEET_TRANS);
      var sheetItems = getOrCreateSheet(ss, SHEET_ITEMS);

      // Grava no livro de movimentações
      sheetTrans.appendRow([
        trans.movementDate || new Date().toISOString(),
        trans.itemName,
        trans.type,
        Number(trans.quantity) || 1,
        trans.bearer ? trans.bearer.graduation : "---",
        trans.bearer ? trans.bearer.warName : "---",
        trans.bearer ? trans.bearer.rg : "---",
        trans.recorder ? trans.recorder.warName : "---",
        trans.reason || "Operação Aeromédica",
        trans.recorder ? trans.recorder.rg : "---",
        trans.missionNum || "",
        trans.lot || ""
      ]);

      // Atualiza o saldo na aba items caso tenha sido informado
      if (typeof newStock !== "undefined" && trans.itemId) {
        var lastRow = sheetItems.getLastRow();
        if (lastRow > 1) {
          var ids = sheetItems.getRange(2, 1, lastRow - 1, 1).getValues();
          for (var i = 0; i < ids.length; i++) {
            if (String(ids[i][0]) === String(trans.itemId)) {
              sheetItems.getRange(i + 2, 7).setValue(Number(newStock)); // Coluna 7: Saldo Atual
              break;
            }
          }
        }
      }

      return jsonResponse({ status: "success", message: "Movimentação registrada com sucesso!" });
    }

    // ----------------------------------------------------
    // AÇÃO 5: Conferência e Atualização de Lacre de Kit (updateKitLacre)
    // ----------------------------------------------------
    if (action === "updateKitLacre") {
      var kitId = data.kitId;
      var novoLacre = data.lacre;
      var responsavel = data.responsavel || {};
      var status = data.status || "LACRADO";
      var obs = data.obs || "";
      var sheetKits = getOrCreateSheet(ss, SHEET_KITS);

      var lastRow = sheetKits.getLastRow();
      var agora = Utilities.formatDate(new Date(), "America/Sao_Paulo", "yyyy-MM-dd HH:mm");

      if (lastRow > 1) {
        var kitsData = sheetKits.getRange(2, 1, lastRow - 1, 1).getValues();
        for (var i = 0; i < kitsData.length; i++) {
          if (String(kitsData[i][0]) === String(kitId)) {
            var r = i + 2;
            sheetKits.getRange(r, 4).setValue(novoLacre);
            sheetKits.getRange(r, 5).setValue(agora);
            sheetKits.getRange(r, 6).setValue(responsavel.graduation || "");
            sheetKits.getRange(r, 7).setValue(responsavel.warName || "");
            sheetKits.getRange(r, 8).setValue(responsavel.rg || "");
            sheetKits.getRange(r, 9).setValue(status);
            if (obs) sheetKits.getRange(r, 10).setValue(obs);
            return jsonResponse({ status: "success", message: "Lacre do kit atualizado com sucesso!" });
          }
        }
      }
      return jsonResponse({ status: "error", message: "Kit não encontrado." });
    }

    // ----------------------------------------------------
    // AÇÃO 6: Registro de Missão & Consumo APH (registerMissaoConsumo)
    // ----------------------------------------------------
    if (action === "registerMissaoConsumo") {
      var missao = data.missao || {};
      var itensConsumidos = data.itens || []; // [{ itemId, itemName, qty, lot, isControlled, descartado }]
      var sheetTrans = getOrCreateSheet(ss, SHEET_TRANS);
      var sheetItems = getOrCreateSheet(ss, SHEET_ITEMS);
      var sheetControlados = getOrCreateSheet(ss, SHEET_CONTROLADOS);
      var agora = Utilities.formatDate(new Date(), "America/Sao_Paulo", "yyyy-MM-dd HH:mm");

      for (var i = 0; i < itensConsumidos.length; i++) {
        var it = itensConsumidos[i];
        // 1. Registra saída no livro de movimentações
        sheetTrans.appendRow([
          agora,
          it.itemName,
          "saída (Missão APH)",
          Number(it.qty) || 1,
          missao.enfermeiro ? missao.enfermeiro.graduation : "Enfermeiro de Voo",
          missao.enfermeiro ? missao.enfermeiro.warName : "Tripulante",
          missao.enfermeiro ? missao.enfermeiro.rg : "---",
          missao.medico ? missao.medico.warName : "Médico de Voo",
          "Consumo Missão " + (missao.codigo || "") + " (" + (missao.aeronave || "") + ") - Paciente: " + (missao.paciente || "Atendimento"),
          missao.medico ? missao.medico.rg : "---",
          missao.codigo || "",
          it.lot || ""
        ]);

        // 2. Abate do saldo na aba items
        if (it.itemId) {
          var lastRowItems = sheetItems.getLastRow();
          if (lastRowItems > 1) {
            var ids = sheetItems.getRange(2, 1, lastRowItems - 1, 1).getValues();
            for (var k = 0; k < ids.length; k++) {
              if (String(ids[k][0]) === String(it.itemId)) {
                var cellSaldo = sheetItems.getRange(k + 2, 7);
                var saldoAtual = Number(cellSaldo.getValue()) || 0;
                cellSaldo.setValue(Math.max(0, saldoAtual - Number(it.qty)));
                break;
              }
            }
          }
        }

        // 3. Se for substância controlada (Portaria 344), grava no livro de controlados
        if (it.isControlled) {
          sheetControlados.appendRow([
            agora,
            it.itemName,
            it.lot || "---",
            Number(it.qtySacada || it.qty),
            Number(it.qty),
            Number(it.sobraDescartada || 0),
            missao.codigo || "Oncall",
            missao.paciente || "Ocorrência Aeromédica",
            missao.medico ? (missao.medico.graduation + " " + missao.medico.warName) : "Médico de Voo",
            missao.medico ? missao.medico.crm : "CRM Informado",
            missao.enfermeiro ? (missao.enfermeiro.graduation + " " + missao.enfermeiro.warName) : "Enfermeiro",
            missao.enfermeiro ? missao.enfermeiro.coren : "COREN Informado",
            it.sobraDescartada > 0 ? "DESCARTE ASSISTIDO EFETUADO" : "DOSE TOTAL ADMINISTRADA"
          ]);
        }
      }

      return jsonResponse({ status: "success", message: "Consumo da missão e baixa de estoque concluídos com sucesso!" });
    }

    // ----------------------------------------------------
    // AÇÃO 7: Atualizar Pressão de Cilindro O2 (updateCilindroO2)
    // ----------------------------------------------------
    if (action === "updateCilindroO2") {
      var cilId = data.cilindroId;
      var novaPressao = Number(data.pressaoPSI);
      var sheetO2 = getOrCreateSheet(ss, SHEET_O2);
      var lastRow = sheetO2.getLastRow();

      if (lastRow > 1) {
        var cils = sheetO2.getRange(2, 1, lastRow - 1, 1).getValues();
        for (var i = 0; i < cils.length; i++) {
          if (String(cils[i][0]) === String(cilId)) {
            var r = i + 2;
            sheetO2.getRange(r, 5).setValue(novaPressao);
            var statusStr = novaPressao >= 1800 ? "OPERACIONAL (100%)" : (novaPressao >= 1200 ? "ATENÇÃO (Carga Média)" : "CRÍTICO - RECARREGAR");
            sheetO2.getRange(r, 8).setValue(statusStr);
            return jsonResponse({ status: "success", message: "Pressão do cilindro atualizada!" });
          }
        }
      }
      return jsonResponse({ status: "error", message: "Cilindro não encontrado." });
    }

    return jsonResponse({ status: "error", message: "Ação POST desconhecida: " + action });
  } catch (err) {
    return jsonResponse({ status: "error", message: err.toString() });
  } finally {
    lock.releaseLock();
  }
}

/**
 * Resposta JSON utilitária
 */
function jsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
