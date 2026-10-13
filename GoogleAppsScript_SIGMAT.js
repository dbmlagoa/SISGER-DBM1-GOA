/**
 * ============================================================================
 * SISGER DBM 1 / GOA - CBMERJ
 * SIG-MAT • GESTÃO DE MATERIAL OPERACIONAL & CARGA DMOP
 * ============================================================================
 * 
 * Script do Google Apps Script vinculado à Planilha de Controle DMOP (SIG-MAT):
 * Link: https://docs.google.com/spreadsheets/d/1R5flENBR4yAh0g_9lUuMjUHdFN5NC3wMPq7xveupSxg/edit
 * ID da Planilha: 1R5flENBR4yAh0g_9lUuMjUHdFN5NC3wMPq7xveupSxg
 * 
 * Eixos Operacionais Atendidos:
 *  - 🚁 CIF / Helibalde (Bambi Bucket SEI Industries)
 *  - 🧗 SAR Altura / Vertical (CSMont / CCOA - Cordas, Freios, Descensores, Cintos)
 *  - 🌊 SAR Aquático / Mergulho (Neoprene, Facas Blade Sea, Coletes)
 *  - 🪂 Puçá & Resgate Aéreo (Puçás de Salvamento/Cadáver, Cestos, Macas Envelope)
 *  - ⚡ Desencarceramento (Desencarcerador a Bateria GCT4150, Baterias Akkuli/BPA)
 *  - 📻 Telecomunicações (Rádios Aeronáuticos ICOM VHF, Motorola TETRA, Hytera)
 *  - 🏕️ Logística & Campanha (Iluminação, Barracas Nepal 2, Geradores)
 *  - 🦺 EPIs e Carga Individual de Voo
 * 
 * INSTRUÇÕES DE IMPLANTAÇÃO / ATUALIZAÇÃO NO GOOGLE APPS SCRIPT:
 * 1. Abra a planilha do SIG-MAT: https://docs.google.com/spreadsheets/d/1R5flENBR4yAh0g_9lUuMjUHdFN5NC3wMPq7xveupSxg/edit
 * 2. No menu superior, clique em 'Extensões' > 'Apps Script'.
 * 3. Substitua o código existente por este conteúdo.
 * 4. Clique no botão azul 'Implantar' > 'Gerenciar implantações'.
 * 5. Clique no ícone de lápis (Editar) na implantação ativa do App da Web:
 *    - Versão: Nova versão
 *    - Executar como: Eu (dbmlagoa@gmail.com)
 *    - Quem tem acesso: Qualquer pessoa
 * 6. Clique em 'Implantar'.
 * ============================================================================
 */

var SPREADSHEET_ID = "1R5flENBR4yAh0g_9lUuMjUHdFN5NC3wMPq7xveupSxg";

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
 * Endpoint de Leitura (GET)
 */
function doGet(e) {
  var action = (e && e.parameter && e.parameter.action) ? e.parameter.action : "getData";

  if (action === "getData") {
    return jsonResponse(getData());
  } else if (action === "ping") {
    return jsonResponse({ success: true, message: "Ponte SIG-MAT Ativa!", time: new Date().toISOString() });
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
    } else if (action === "saveItem") {
      return jsonResponse(saveItem(data));
    } else if (action === "registerMovement") {
      return jsonResponse(registerMovement(data));
    }

    return jsonResponse({ success: false, message: "Ação POST desconhecida: " + action });
  } catch (err) {
    return jsonResponse({ success: false, message: "Erro no processamento POST: " + err.toString() });
  }
}

/**
 * Retorna todos os Itens e Transações da Planilha
 */
function getData() {
  var ss = getSpreadsheet();
  var itemsSheet = ss.getSheetByName("items") || ss.getSheets()[0];
  var transSheet = ss.getSheetByName("transactions") || (ss.getSheets().length > 1 ? ss.getSheets()[1] : null);

  var items = [];
  if (itemsSheet && itemsSheet.getLastRow() > 1) {
    items = itemsSheet.getRange(2, 1, itemsSheet.getLastRow() - 1, 8).getValues();
  }

  var transactions = [];
  if (transSheet && transSheet.getLastRow() > 1) {
    transactions = transSheet.getRange(2, 1, transSheet.getLastRow() - 1, 10).getValues();
  }

  return { items: items, transactions: transactions };
}

/**
 * Autenticação do Operador Militar pelo RG
 */
function authenticateOperator(data) {
  var ss = getSpreadsheet();
  var usersSheet = ss.getSheetByName("users");
  if (!usersSheet || usersSheet.getLastRow() < 2) {
    return { success: false, message: "Nenhum operador cadastrado no sistema. Por favor, crie uma conta." };
  }

  var users = usersSheet.getRange(2, 1, usersSheet.getLastRow() - 1, 4).getValues();
  var inputRg = String(data.rg || "").trim();
  var inputPass = String(data.password || "").trim();

  for (var i = 0; i < users.length; i++) {
    var row = users[i];
    var grad = String(row[0] || "").trim();
    var name = String(row[1] || "").trim();
    var rg = String(row[2] || "").trim();
    var pass = String(row[3] || "").trim();

    if (rg === inputRg) {
      if (pass === inputPass) {
        return {
          success: true,
          user: { grad: grad, name: name, rg: rg }
        };
      } else {
        return { success: false, message: "Senha incorreta para o RG informado." };
      }
    }
  }

  return { success: false, message: "RG não encontrado. Por favor, crie uma conta." };
}

/**
 * Registro de Novo Operador com Validação de RG Único
 */
function registerOperator(data) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    var ss = getSpreadsheet();
    var usersSheet = ss.getSheetByName("users");
    if (!usersSheet) {
      usersSheet = ss.insertSheet("users");
      usersSheet.appendRow(["Graduação", "Nome de Guerra", "RG", "Senha", "Data Cadastro"]);
      usersSheet.getRange(1, 1, 1, 5).setFontWeight("bold").setBackground("#0f172a").setFontColor("#ffffff");
    }

    var inputRg = String(data.rg || "").trim();
    if (!inputRg) {
      return { success: false, message: "O RG do militar é obrigatório." };
    }

    // Validação contra duplicação de RG
    if (usersSheet.getLastRow() > 1) {
      var existingRgs = usersSheet.getRange(2, 3, usersSheet.getLastRow() - 1, 1).getValues();
      for (var i = 0; i < existingRgs.length; i++) {
        if (String(existingRgs[i][0]).trim() === inputRg) {
          return { success: false, message: "Este RG já possui cadastro ativo no sistema. Faça login diretamente." };
        }
      }
    }

    var grad = String(data.grad || "").trim().toUpperCase();
    var name = String(data.name || "").trim().toUpperCase();
    var pass = String(data.password || "").trim();
    var dataCad = new Date().toISOString();

    usersSheet.appendRow([grad, name, inputRg, pass, dataCad]);

    return {
      success: true,
      message: "Operador registrado com sucesso!",
      user: { grad: grad, name: name, rg: inputRg }
    };
  } catch (err) {
    return { success: false, message: "Erro ao registrar operador: " + err.toString() };
  } finally {
    lock.releaseLock();
  }
}

/**
 * Salva ou Atualiza Equipamento no Prontuário
 */
function saveItem(payload) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    var ss = getSpreadsheet();
    var itemsSheet = ss.getSheetByName("items") || ss.getSheets()[0];
    var item = payload.item;

    var rows = itemsSheet.getLastRow() > 1 
      ? itemsSheet.getRange(2, 1, itemsSheet.getLastRow() - 1, 8).getValues() 
      : [];
    
    var rowIndex = -1;
    for (var i = 0; i < rows.length; i++) {
      if (String(rows[i][0]).trim() === String(item.id).trim()) {
        rowIndex = i + 2;
        break;
      }
    }

    var rowValues = [
      item.id,
      item.name,
      item.manufacturer,
      Number(item.mfgYear) || 2024,
      Number(item.lifespan) || 5,
      item.color || "",
      Number(item.currentStock) || 0,
      Number(item.minStock) || 1
    ];

    if (rowIndex > 0) {
      itemsSheet.getRange(rowIndex, 1, 1, 8).setValues([rowValues]);
    } else {
      itemsSheet.appendRow(rowValues);
    }

    return { success: true, message: "Equipamento salvo com sucesso no SIG-MAT!" };
  } catch (err) {
    return { success: false, message: "Erro ao salvar equipamento: " + err.toString() };
  } finally {
    lock.releaseLock();
  }
}

/**
 * Registra Cautela / Movimentação / Avaria e Atualiza Saldo
 */
function registerMovement(payload) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    var ss = getSpreadsheet();
    var transSheet = ss.getSheetByName("transactions") || (ss.getSheets().length > 1 ? ss.getSheets()[1] : null);
    var itemsSheet = ss.getSheetByName("items") || ss.getSheets()[0];

    var trans = payload.trans;
    var newStock = Number(payload.newStock);

    // 1. Atualiza o estoque do item na aba items
    if (itemsSheet && itemsSheet.getLastRow() > 1) {
      var itemRows = itemsSheet.getRange(2, 1, itemsSheet.getLastRow() - 1, 1).getValues();
      for (var i = 0; i < itemRows.length; i++) {
        if (String(itemRows[i][0]).trim() === String(trans.itemId).trim()) {
          itemsSheet.getRange(i + 2, 7).setValue(newStock); // Coluna 7: Saldo Atual
          break;
        }
      }
    }

    // 2. Grava a movimentação no Livro de Cautelas (aba transactions)
    if (!transSheet) {
      transSheet = ss.insertSheet("transactions");
      transSheet.appendRow(["Data", "Equipamento", "Tipo", "Quantidade", "Graduação Portador", "Nome Guerra Portador", "RG Portador", "Fiel Registrador", "Finalidade/Motivo", "RG Registrador"]);
    }

    var movementRow = [
      trans.movementDate || new Date().toISOString(),
      trans.itemName || "",
      trans.type || "saída",
      Number(trans.quantity) || 1,
      (trans.bearer && trans.bearer.graduation) || "---",
      (trans.bearer && trans.bearer.warName) || "N/A",
      (trans.bearer && trans.bearer.rg) || "---",
      (trans.recorder && trans.recorder.warName) || "---",
      trans.reason || "",
      (trans.recorder && trans.recorder.rg) || "---"
    ];

    transSheet.appendRow(movementRow);

    return { success: true, message: "Movimentação registrada com sucesso!" };
  } catch (err) {
    return { success: false, message: "Erro ao registrar movimentação: " + err.toString() };
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
