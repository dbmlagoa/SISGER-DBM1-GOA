/**
 * ============================================================================
 * SISGER DBM 1 / GOA - CBMERJ
 * SCRIPT PONTE GOOGLE APPS SCRIPT (OPÇÃO 1 - GOOGLE DRIVE & PLANILHAS)
 * ============================================================================
 * 
 * Este script roda diretamente dentro da conta Google: dbmlagoa@gmail.com
 * Ele permite que o portal do SISGER leia e atualize de forma 100% autônoma
 * as pastas do Google Drive, o Quadro de Trabalho, avisos e configurações,
 * sem que nenhum militar precise mexer em código!
 * 
 * ----------------------------------------------------------------------------
 * MANUAL DE IMPLANTAÇÃO RÁPIDA (LEVA 2 MINUTOS - PARA QUALQUER PESSOA LEIGA)
 * ----------------------------------------------------------------------------
 * 1. Abra o navegador logado no e-mail: dbmlagoa@gmail.com
 * 2. Acesse o site: https://script.google.com/
 * 3. Clique no botão azul "+ Novo projeto" no canto superior esquerdo.
 * 4. Dê o nome ao projeto de: "SISGER GOA - Ponte Drive API"
 * 5. Apague todo o conteúdo que estiver na tela e COLE TODO ESTE CÓDIGO.
 * 6. Clique no botão azul "Implantar" (canto superior direito) > "Nova implantação".
 * 7. Em "Selecione o tipo" (ícone de engrenagem), escolha: "App da Web".
 * 8. Preencha os campos exatamente assim:
 *    - Descrição: SISGER API Produção
 *    - Executar como: "Eu (dbmlagoa@gmail.com)"
 *    - Quem tem acesso: "Qualquer pessoa" (permite que o portal se comunique com o Drive)
 * 9. Clique em "Implantar" e conceda as permissões de acesso da sua conta Google.
 * 10. COPIE o "URL do app da Web" gerado (termina com /exec) e cole no Painel do Gestor
 *     dentro do portal do SISGER (ou no arquivo js/config.js).
 * 
 * PRONTO! O Portal estará 100% conectado ao Drive da conta dbmlagoa@gmail.com!
 * ============================================================================
 */

// Nome da pasta raiz criada automaticamente no seu Google Drive
var FOLDER_ROOT_NAME = "[SISGER GOA] - Sistema de Gestão";
var CONFIG_FILE_NAME = "config_portal_sisger.json";

/**
 * Endpoint de Leitura (GET)
 */
function doGet(e) {
  var params = e ? e.parameter : {};
  var action = params.action || "getConfig";

  try {
    if (action === "getConfig") {
      return jsonResponse(loadOrCreateConfig());
    } 
    else if (action === "listDriveFiles") {
      var folderId = params.folderId;
      return jsonResponse(listFilesFromFolder(folderId));
    } 
    else if (action === "checkChecklist") {
      var csvUrl = params.csvUrl || "https://docs.google.com/spreadsheets/d/e/2PACX-1vTu4q9jr-xN_divraeeFmyyDeoANph3559wXe3sXl54Oek2LvNt9zVhttk5Uivh_rKGlhfrgUTtCTOW/pub?output=csv";
      var resp = UrlFetchApp.fetch(csvUrl + "&t=" + new Date().getTime());
      var textData = resp.getContentText();
      var linhas = textData.split('\n').filter(function(l){ return l.trim() !== ''; });
      var conferido = false;
      var valorB2 = "";
      if (linhas.length > 1) {
        var colunas = linhas[1].split(',');
        valorB2 = (colunas[1] || "").trim();
        if (valorB2 === "1") conferido = true;
      }
      return jsonResponse({ status: "success", conferido: conferido, valor: valorB2, raw: linhas[0] || "" });
    }
    else if (action === "ping") {
      return jsonResponse({ status: "success", message: "Ponte SISGER Ativa", account: Session.getActiveUser().getEmail() });
    }
    
    return jsonResponse({ status: "error", message: "Ação inválida: " + action });
  } catch (err) {
    return jsonResponse({ status: "error", message: err.toString() });
  }
}

/**
 * Endpoint de Gravação (POST)
 */
function doPost(e) {
  try {
    var rawData = e.postData.contents;
    var data = JSON.parse(rawData);
    var action = data.action || "saveConfig";

    if (action === "saveConfig") {
      saveConfigToDrive(data.config);
      return jsonResponse({ status: "success", message: "Configurações salvas no Google Drive com sucesso!" });
    }
    else if (action === "addAviso") {
      var cfg = loadOrCreateConfig();
      cfg.muralAvisos.unshift(data.aviso);
      saveConfigToDrive(cfg);
      return jsonResponse({ status: "success", message: "Aviso publicado no Mural com sucesso!" });
    }
    else if (action === "updateQuadroId") {
      var cfg = loadOrCreateConfig();
      cfg.quadroDeTrabalho.driveFileId = data.driveFileId;
      cfg.quadroDeTrabalho.previewUrl = "https://drive.google.com/file/d/" + data.driveFileId + "/preview";
      saveConfigToDrive(cfg);
      return jsonResponse({ status: "success", message: "Quadro de Trabalho atualizado!" });
    }
    else if (action === "registrarManutencao") {
      return jsonResponse(registrarManutencao(data));
    }

    return jsonResponse({ status: "error", message: "Ação POST desconhecida: " + action });
  } catch (err) {
    return jsonResponse({ status: "error", message: err.toString() });
  }
}

/**
 * Obtém ou cria a pasta raiz do SISGER no Drive
 */
function getOrCreateRootFolder() {
  var folders = DriveApp.getFoldersByName(FOLDER_ROOT_NAME);
  if (folders.hasNext()) {
    return folders.next();
  }
  return DriveApp.createFolder(FOLDER_ROOT_NAME);
}

/**
 * Carrega a configuração do Drive ou cria a padrão
 */
function loadOrCreateConfig() {
  var rootFolder = getOrCreateRootFolder();
  var files = rootFolder.getFilesByName(CONFIG_FILE_NAME);

  if (files.hasNext()) {
    var file = files.next();
    var content = file.getBlob().getDataAsString();
    return JSON.parse(content);
  }

  // Se ainda não existir, cria com configuração padrão do GOA
  var defaultConfig = {
    updatedAt: new Date().toISOString(),
    quadroDeTrabalho: {
      driveFileId: "1x5rcnA3uGS-BICz-KsjbRdXVSWH4XSfp",
      previewUrl: "https://drive.google.com/file/d/1x5rcnA3uGS-BICz-KsjbRdXVSWH4XSfp/preview"
    },
    checklist: {
      formUrl: "https://forms.gle/SuLZ4WrT7N7UUVRQ7",
      csvUrl: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTu4q9jr-xN_divraeeFmyyDeoANph3559wXe3sXl54Oek2LvNt9zVhttk5Uivh_rKGlhfrgUTtCTOW/pub?output=csv"
    },
    muralAvisos: [
      {
        id: "aviso-1",
        tipo: "urgente",
        titulo: "Checklist Eletrônico Obrigatório",
        texto: "Conferência diária de material de pronto emprego até as 08:30h.",
        data: "Hoje"
      }
    ]
  };

  rootFolder.createFile(CONFIG_FILE_NAME, JSON.stringify(defaultConfig, null, 2), MimeType.PLAIN_TEXT);
  return defaultConfig;
}

/**
 * Salva a nova configuração no Google Drive
 */
function saveConfigToDrive(newConfig) {
  var rootFolder = getOrCreateRootFolder();
  var files = rootFolder.getFilesByName(CONFIG_FILE_NAME);
  newConfig.updatedAt = new Date().toISOString();
  var content = JSON.stringify(newConfig, null, 2);

  if (files.hasNext()) {
    var file = files.next();
    file.setContent(content);
  } else {
    rootFolder.createFile(CONFIG_FILE_NAME, content, MimeType.PLAIN_TEXT);
  }
}

/**
 * Lista arquivos de uma pasta específica do Drive
 */
function listFilesFromFolder(folderId) {
  try {
    var folder = folderId ? DriveApp.getFolderById(folderId) : getOrCreateRootFolder();
    var files = folder.getFiles();
    var results = [];

    while (files.hasNext()) {
      var f = files.next();
      results.push({
        id: f.getId(),
        name: f.getName(),
        mimeType: f.getMimeType(),
        url: f.getUrl(),
        downloadUrl: f.getDownloadUrl(),
        size: f.getSize(),
        lastUpdated: f.getLastUpdated()
      });
    }

    return { status: "success", folderName: folder.getName(), files: results };
  } catch (e) {
    return { status: "error", message: e.toString() };
  }
}

/**
 * ============================================================================
 * FORMULÁRIO DE MANUTENÇÃO PREDIAL / NECESSIDADES DO DBM1/GOA
 * Pasta no Drive: "Obras"  |  Planilha: "Solicitações de Manutenção DBM1-GOA"
 * ============================================================================
 */
var OBRAS_FOLDER_NAME = "Obras";
var MANUTENCAO_SHEET_NAME = "Solicitações de Manutenção DBM1-GOA";
var MANUTENCAO_HEADERS = ["Data/Hora", "Posto/Graduação", "Nome", "RG", "Descrição do Problema", "Fotos", "Qtd. Fotos", "Situação"];

// Usa a pasta "Obras" já existente no Drive; se não existir, cria na raiz
function getOrCreateObrasFolder() {
  var folders = DriveApp.getFoldersByName(OBRAS_FOLDER_NAME);
  if (folders.hasNext()) return folders.next();
  return DriveApp.createFolder(OBRAS_FOLDER_NAME);
}

function getOrCreateManutencaoSheet(obrasFolder) {
  var files = obrasFolder.getFilesByName(MANUTENCAO_SHEET_NAME);
  if (files.hasNext()) {
    return SpreadsheetApp.open(files.next());
  }
  var ss = SpreadsheetApp.create(MANUTENCAO_SHEET_NAME);
  var file = DriveApp.getFileById(ss.getId());
  obrasFolder.addFile(file);
  DriveApp.getRootFolder().removeFile(file);
  var sheet = ss.getSheets()[0];
  sheet.setName("Solicitações");
  sheet.appendRow(MANUTENCAO_HEADERS);
  sheet.getRange(1, 1, 1, MANUTENCAO_HEADERS.length)
       .setFontWeight("bold").setBackground("#FF6B00").setFontColor("#FFFFFF");
  sheet.setFrozenRows(1);
  sheet.setColumnWidth(5, 420);
  sheet.setColumnWidth(6, 300);
  return ss;
}

function registrarManutencao(data) {
  var posto = String(data.posto || "").trim();
  var nome = String(data.nome || "").trim();
  var rg = String(data.rg || "").trim();
  var descricao = String(data.descricao || "").trim();
  if (!posto || !nome || !rg || !descricao) {
    return { status: "error", message: "Preencha posto/graduação, nome, RG e descrição." };
  }

  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var obras = getOrCreateObrasFolder();
    var ss = getOrCreateManutencaoSheet(obras);
    var sheet = ss.getSheets()[0];
    var agora = new Date();
    var carimbo = Utilities.formatDate(agora, "America/Sao_Paulo", "dd/MM/yyyy HH:mm:ss");

    // Fotos opcionais: salvas na subpasta "Fotos Manutenção" dentro de Obras
    var linksFotos = [];
    var fotos = data.fotos || [];
    if (fotos.length > 0) {
      var subs = obras.getFoldersByName("Fotos Manutenção");
      var fotosFolder = subs.hasNext() ? subs.next() : obras.createFolder("Fotos Manutenção");
      var prefixo = Utilities.formatDate(agora, "America/Sao_Paulo", "yyyyMMdd_HHmmss") + "_" + rg;
      for (var i = 0; i < fotos.length && i < 6; i++) {
        var f = fotos[i];
        var blob = Utilities.newBlob(Utilities.base64Decode(f.data), f.mime || "image/jpeg", prefixo + "_" + (i + 1) + ".jpg");
        var arq = fotosFolder.createFile(blob);
        linksFotos.push(arq.getUrl());
      }
    }

    sheet.appendRow([carimbo, posto, nome, rg, descricao, linksFotos.join("\n"), linksFotos.length, "Pendente"]);
    return { status: "success", message: "Solicitação registrada com sucesso!", planilha: ss.getUrl(), fotos: linksFotos.length };
  } finally {
    lock.releaseLock();
  }
}


/**
 * Helper de resposta JSON com CORS liberado
 */
function jsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
