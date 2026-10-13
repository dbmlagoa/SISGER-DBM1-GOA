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
    // Cadastro automático dos 134 itens oficiais do Almoxarifado Médico do DBM1/GOA
    var itensOficiais = [
  [
    "ALM-001",
    "ÁCIDO ACETIL SALICÍLICO 100MG COMPRIMIDO  (UNID)",
    "Padrão CBMERJ / DGOA",
    "2026-07-01",
    0,
    "LOT-20260701",
    10,
    10,
    "Fármaco Comum",
    "Almoxarifado Central UASA"
  ],
  [
    "ALM-002",
    "CLAMP  UMBILICAL  (UNID)",
    "Padrão CBMERJ / DGOA",
    "2026-06-01",
    0,
    "LOT-20260601",
    5,
    2,
    "Material/Descartável APH",
    "Almoxarifado Central UASA"
  ],
  [
    "ALM-003",
    "TOT Nº2,0  (UNID)",
    "Padrão CBMERJ / DGOA",
    "2027-10-01",
    0,
    "LOT-20271001",
    2,
    2,
    "Material/Descartável APH",
    "Almoxarifado Central UASA"
  ],
  [
    "ALM-004",
    "ÁCIDO TRANEXÂMICO 50MG/ML - AMPOLA",
    "Padrão CBMERJ / DGOA",
    "2027-04-01",
    0,
    "LOT-20270401",
    6,
    16,
    "Fármaco Comum",
    "Almoxarifado Central UASA"
  ],
  [
    "ALM-005",
    "ELETRODO DE ECG DESCARTÁVEL P/ MONITORIZAÇÃO CARDÍACA  ADULTO/ INFANTIL. (UNID)",
    "Padrão CBMERJ / DGOA",
    "",
    0,
    "LOTE-PADRÃO",
    43,
    70,
    "Material/Descartável APH",
    "Almoxarifado Central UASA"
  ],
  [
    "ALM-006",
    "TOT Nº2,5  (UNID)",
    "Padrão CBMERJ / DGOA",
    "2028-01-01",
    0,
    "LOT-20280101",
    2,
    2,
    "Material/Descartável APH",
    "Almoxarifado Central UASA"
  ],
  [
    "ALM-007",
    "ADRENALINA   1MG/ML  - 1ML/AMPOLA (UNID)",
    "Padrão CBMERJ / DGOA",
    "2026-12-01",
    0,
    "LOT-20261201",
    89,
    80,
    "Fármaco Comum",
    "Almoxarifado Central UASA"
  ],
  [
    "ALM-008",
    "EQUIPO DE BOMBA INFUSORA TERUMO  SIMPLES",
    "Padrão CBMERJ / DGOA",
    "2027-01-01",
    0,
    "LOT-20270101",
    4,
    10,
    "Material/Descartável APH",
    "Almoxarifado Central UASA"
  ],
  [
    "ALM-009",
    "TOT Nº3,0  (UNID)",
    "Padrão CBMERJ / DGOA",
    "2027-09-01",
    0,
    "LOT-20270901",
    5,
    2,
    "Material/Descartável APH",
    "Almoxarifado Central UASA"
  ],
  [
    "ALM-010",
    "ÁGUA DESTILADA  10ML/AMPOLA   (UNID)",
    "Padrão CBMERJ / DGOA",
    "",
    0,
    "LOTE-PADRÃO",
    0,
    20,
    "Fármaco Comum",
    "Almoxarifado Central UASA"
  ],
  [
    "ALM-011",
    "EQUIPO DE BOMBA INFUSORA TERUMO  FOTOSENSIVEL",
    "Padrão CBMERJ / DGOA",
    "",
    0,
    "LOTE-PADRÃO",
    0,
    10,
    "Material/Descartável APH",
    "Almoxarifado Central UASA"
  ],
  [
    "ALM-012",
    "TOT Nº3,5  (UNID)",
    "Padrão CBMERJ / DGOA",
    "2027-12-01",
    0,
    "LOT-20271201",
    2,
    2,
    "Material/Descartável APH",
    "Almoxarifado Central UASA"
  ],
  [
    "ALM-013",
    "AMIODARONA 50MG/ML 3ML/AMPOLA  (UNID)",
    "Padrão CBMERJ / DGOA",
    "2027-03-01",
    0,
    "LOT-20270301",
    12,
    12,
    "Fármaco Comum",
    "Almoxarifado Central UASA"
  ],
  [
    "ALM-014",
    "EQUIPO DE SORO MACROGOTAS COM INJETOR  LATERAL.(UNID)",
    "Padrão CBMERJ / DGOA",
    "2026-05-01",
    0,
    "LOT-20260501",
    24,
    30,
    "Material/Descartável APH",
    "Almoxarifado Central UASA"
  ],
  [
    "ALM-015",
    "TOT Nº4,0  (UNID)",
    "Padrão CBMERJ / DGOA",
    "2026-08-01",
    0,
    "LOT-20260801",
    2,
    2,
    "Material/Descartável APH",
    "Almoxarifado Central UASA"
  ],
  [
    "ALM-016",
    "ATROPINA  0,25MG/ML 1ML/AMPOLA  (UNID)",
    "Padrão CBMERJ / DGOA",
    "2027-01-01",
    0,
    "LOT-20270101",
    15,
    20,
    "Fármaco Comum",
    "Almoxarifado Central UASA"
  ],
  [
    "ALM-017",
    "ESPARADRAPO ROLO (UNID)",
    "Padrão CBMERJ / DGOA",
    "2027-10-01",
    0,
    "LOT-20271001",
    1,
    2,
    "Material/Descartável APH",
    "Almoxarifado Central UASA"
  ],
  [
    "ALM-018",
    "TOT Nº4,5  (UNID)",
    "Padrão CBMERJ / DGOA",
    "2027-12-01",
    0,
    "LOT-20271201",
    2,
    2,
    "Material/Descartável APH",
    "Almoxarifado Central UASA"
  ],
  [
    "ALM-019",
    "BICARBONATO DE SÓDIO 8,4% 10ML-AMPOLA",
    "Padrão CBMERJ / DGOA",
    "2026-10-01",
    0,
    "LOT-20261001",
    29,
    50,
    "Fármaco Comum",
    "Almoxarifado Central UASA"
  ],
  [
    "ALM-020",
    "FITA DE HGT Okmeter Match II",
    "Padrão CBMERJ / DGOA",
    "",
    0,
    "LOTE-PADRÃO",
    0,
    1,
    "Material/Descartável APH",
    "Almoxarifado Central UASA"
  ],
  [
    "ALM-021",
    "TOT Nº5,0  (UNID)",
    "Padrão CBMERJ / DGOA",
    "2028-02-01",
    0,
    "LOT-20280201",
    7,
    6,
    "Material/Descartável APH",
    "Almoxarifado Central UASA"
  ],
  [
    "ALM-022",
    "DIPIRONA 500MG/ML  2ML/AMPOLA   (UNID)",
    "Padrão CBMERJ / DGOA",
    "2027-03-01",
    0,
    "LOT-20270301",
    19,
    20,
    "Fármaco Comum",
    "Almoxarifado Central UASA"
  ],
  [
    "ALM-023",
    "FIXADOR DE TUBO OROTRAQUEAL AD/INF. (UNID)",
    "Padrão CBMERJ / DGOA",
    "",
    0,
    "LOTE-PADRÃO",
    16,
    10,
    "Material/Descartável APH",
    "Almoxarifado Central UASA"
  ],
  [
    "ALM-024",
    "TOT Nº5,5  (UNID)",
    "Padrão CBMERJ / DGOA",
    "2026-03-01",
    0,
    "LOT-20260301",
    6,
    6,
    "Material/Descartável APH",
    "Almoxarifado Central UASA"
  ],
  [
    "ALM-025",
    "DOBUTAMINA 250MG/ML  20ML/AMPOLA   (UNID)",
    "Padrão CBMERJ / DGOA",
    "2026-11-01",
    0,
    "LOT-20261101",
    11,
    4,
    "Fármaco Comum",
    "Almoxarifado Central UASA"
  ],
  [
    "ALM-026",
    "FRASCO DE SECREÇÃO PARA VIAS AÉREAS",
    "Padrão CBMERJ / DGOA",
    "",
    0,
    "LOTE-PADRÃO",
    11,
    4,
    "Material/Descartável APH",
    "Almoxarifado Central UASA"
  ],
  [
    "ALM-027",
    "TOT Nº6,0  (UNID)",
    "Padrão CBMERJ / DGOA",
    "2027-03-01",
    0,
    "LOT-20270301",
    6,
    6,
    "Material/Descartável APH",
    "Almoxarifado Central UASA"
  ],
  [
    "ALM-028",
    "FENOTEROL (BROMIDRATO)  5MG/ML - 20ML",
    "Padrão CBMERJ / DGOA",
    "",
    0,
    "LOTE-PADRÃO",
    0,
    1,
    "Fármaco Comum",
    "Almoxarifado Central UASA"
  ],
  [
    "ALM-029",
    "GAZE HIDRÓFILA ESTÉRIL 7,5 X 7,5.COMPRESSA (PCTE C/10 UNID)",
    "Padrão CBMERJ / DGOA",
    "1930-04-01",
    0,
    "LOT-19300401",
    18,
    60,
    "Material/Descartável APH",
    "Almoxarifado Central UASA"
  ],
  [
    "ALM-030",
    "TOT Nº6,5  (UNID)",
    "Padrão CBMERJ / DGOA",
    "2028-12-01",
    0,
    "LOT-20281201",
    8,
    6,
    "Material/Descartável APH",
    "Almoxarifado Central UASA"
  ],
  [
    "ALM-031",
    "FUROSEMIDA 10MG/ML -2ML/AMPOLA   (UNID)",
    "Padrão CBMERJ / DGOA",
    "2027-10-01",
    0,
    "LOT-20271001",
    15,
    8,
    "Fármaco Comum",
    "Almoxarifado Central UASA"
  ],
  [
    "ALM-032",
    "GEL PARA ECG (UNID)",
    "Padrão CBMERJ / DGOA",
    "2027-08-01",
    0,
    "LOT-20270801",
    3,
    2,
    "Material/Descartável APH",
    "Almoxarifado Central UASA"
  ],
  [
    "ALM-033",
    "TOT Nº7,0  (UNID)",
    "Padrão CBMERJ / DGOA",
    "2027-01-01",
    0,
    "LOT-20270101",
    13,
    10,
    "Material/Descartável APH",
    "Almoxarifado Central UASA"
  ],
  [
    "ALM-034",
    "GLICOSE HIPERTÔNICA 25%  10ML/AMPOLA  (UNID)",
    "Padrão CBMERJ / DGOA",
    "2026-06-01",
    0,
    "LOT-20260601",
    14,
    20,
    "Fármaco Comum",
    "Almoxarifado Central UASA"
  ],
  [
    "ALM-035",
    "JELCO INTRAVENOSO  Nº 14 (UNID)",
    "Padrão CBMERJ / DGOA",
    "2027-09-01",
    0,
    "LOT-20270901",
    18,
    10,
    "Material/Descartável APH",
    "Almoxarifado Central UASA"
  ],
  [
    "ALM-036",
    "TOT Nº7,5  (UNID)",
    "Padrão CBMERJ / DGOA",
    "2028-07-01",
    0,
    "LOT-20280701",
    8,
    10,
    "Material/Descartável APH",
    "Almoxarifado Central UASA"
  ],
  [
    "ALM-037",
    "HIDRALAZINA (CLORIDRATO)  20MG/ML 1ML - AMPOLA",
    "Padrão CBMERJ / DGOA",
    "2027-07-01",
    0,
    "LOT-20270701",
    4,
    4,
    "Fármaco Comum",
    "Almoxarifado Central UASA"
  ],
  [
    "ALM-038",
    "JELCO INTRAVENOSO  Nº 16 (UNID)",
    "Padrão CBMERJ / DGOA",
    "2027-09-01",
    0,
    "LOT-20270901",
    14,
    10,
    "Material/Descartável APH",
    "Almoxarifado Central UASA"
  ],
  [
    "ALM-039",
    "TOT Nº8,0  (UNID)",
    "Padrão CBMERJ / DGOA",
    "2026-08-01",
    0,
    "LOT-20260801",
    7,
    10,
    "Material/Descartável APH",
    "Almoxarifado Central UASA"
  ],
  [
    "ALM-040",
    "IPRATRÓPIO (BROMETO) 0,25MG/ML -  20ML",
    "Padrão CBMERJ / DGOA",
    "2026-06-01",
    0,
    "LOT-20260601",
    1,
    1,
    "Fármaco Comum",
    "Almoxarifado Central UASA"
  ],
  [
    "ALM-041",
    "JELCO INTRAVENOSO Nº 18 (UNID)",
    "Padrão CBMERJ / DGOA",
    "2027-04-01",
    0,
    "LOT-20270401",
    14,
    15,
    "Material/Descartável APH",
    "Almoxarifado Central UASA"
  ],
  [
    "ALM-042",
    "TOT Nº8,5  (UNID)",
    "Padrão CBMERJ / DGOA",
    "2026-06-01",
    0,
    "LOT-20260601",
    8,
    6,
    "Material/Descartável APH",
    "Almoxarifado Central UASA"
  ],
  [
    "ALM-043",
    "ISOSSORBIDA 5MG / COMPRIMIDO (UNID)",
    "Padrão CBMERJ / DGOA",
    "2026-09-01",
    0,
    "LOT-20260901",
    20,
    10,
    "Fármaco Comum",
    "Almoxarifado Central UASA"
  ],
  [
    "ALM-044",
    "JELCO INTRAVENOSO  Nº 20 (UNID)",
    "Padrão CBMERJ / DGOA",
    "2028-01-01",
    0,
    "LOT-20280101",
    19,
    20,
    "Material/Descartável APH",
    "Almoxarifado Central UASA"
  ],
  [
    "ALM-045",
    "MAGNÉSIO (SULFATO)  10%  10mL - AMPOLA",
    "Padrão CBMERJ / DGOA",
    "",
    0,
    "LOTE-PADRÃO",
    0,
    16,
    "Fármaco Comum",
    "Almoxarifado Central UASA"
  ],
  [
    "ALM-046",
    "JELCO INTRAVENOSO  Nº 22 (UNID)",
    "Padrão CBMERJ / DGOA",
    "2028-01-01",
    0,
    "LOT-20280101",
    8,
    10,
    "Material/Descartável APH",
    "Almoxarifado Central UASA"
  ],
  [
    "ALM-047",
    "ÁLCOOL GEL ANTI-SÉPTICO REFIL 500ML (UNID)",
    "Padrão CBMERJ / DGOA",
    "",
    0,
    "LOTE-PADRÃO",
    0,
    0,
    "Desinfetantes & Biossegurança",
    "Almoxarifado Central UASA"
  ],
  [
    "ALM-048",
    "METILPREDNISOLONA  (SUCCINATO SÓDICO) PÓ LIÓFILO INJETÁVEL 125MG-AMPOLA (SOLU-CORTEF)  (UNID)",
    "Padrão CBMERJ / DGOA",
    "2026-12-01",
    0,
    "LOT-20261201",
    2,
    2,
    "Fármaco Comum",
    "Almoxarifado Central UASA"
  ],
  [
    "ALM-049",
    "JELCO INTRAVENOSO  Nº 24 (UNID)",
    "Padrão CBMERJ / DGOA",
    "2027-09-01",
    0,
    "LOT-20270901",
    5,
    5,
    "Material/Descartável APH",
    "Almoxarifado Central UASA"
  ],
  [
    "ALM-050",
    "ÁLCOOL 70%  ALMOTOLIA 100ML",
    "Padrão CBMERJ / DGOA",
    "2026-05-01",
    0,
    "LOT-20260501",
    3,
    10,
    "Desinfetantes & Biossegurança",
    "Almoxarifado Central UASA"
  ],
  [
    "ALM-051",
    "METOPROLOL (SUCCINATO) SOLUÇÃO INJETÁVEL 1MG/ML AMPOLA (SELOKEN)",
    "Padrão CBMERJ / DGOA",
    "2027-05-01",
    0,
    "LOT-20270501",
    4,
    4,
    "Fármaco Comum",
    "Almoxarifado Central UASA"
  ],
  [
    "ALM-052",
    "KIT DE IDENTIFICAÇÃO PARA RECÉM NASCIDO (UNID)",
    "Padrão CBMERJ / DGOA",
    "",
    0,
    "LOTE-PADRÃO",
    3,
    2,
    "Material/Descartável APH",
    "Almoxarifado Central UASA"
  ],
  [
    "ALM-053",
    "COLETOR DE PERFURO CORTANTE CAIXA 7 LTS",
    "Padrão CBMERJ / DGOA",
    "",
    0,
    "LOTE-PADRÃO",
    3,
    2,
    "Desinfetantes & Biossegurança",
    "Almoxarifado Central UASA"
  ],
  [
    "ALM-054",
    "NITROGLICERINA SOLUÇÃO INJETÁVEL 5MG/ML 10ML-AMPOLA (TRIDIL)",
    "Padrão CBMERJ / DGOA",
    "2026-10-01",
    0,
    "LOT-20261001",
    4,
    4,
    "Fármaco Comum",
    "Almoxarifado Central UASA"
  ],
  [
    "ALM-055",
    "LÂMINA DE BISTURI COM CABO Nº10  (UNID)",
    "Padrão CBMERJ / DGOA",
    "",
    0,
    "LOTE-PADRÃO",
    0,
    6,
    "Material/Descartável APH",
    "Almoxarifado Central UASA"
  ],
  [
    "ALM-056",
    "CLOREXIDINA   ALCOÓLICA 0,5% ALMOTOLIA   100ML",
    "Padrão CBMERJ / DGOA",
    "2026-10-01",
    0,
    "LOT-20261001",
    4,
    4,
    "Desinfetantes & Biossegurança",
    "Almoxarifado Central UASA"
  ],
  [
    "ALM-057",
    "NOREPINEFRINA (HEMITARTARATO) SOLUÇÃO INJETÁVEL 2MG/4ML 4ML-AMPOLA.(NORADRENALINA)",
    "Padrão CBMERJ / DGOA",
    "2026-08-01",
    0,
    "LOT-20260801",
    6,
    4,
    "Fármaco Comum",
    "Almoxarifado Central UASA"
  ],
  [
    "ALM-058",
    "LANCETA PARA PUNÇÃO MANUAL (UNID)",
    "Padrão CBMERJ / DGOA",
    "",
    0,
    "LOTE-PADRÃO",
    10,
    20,
    "Material/Descartável APH",
    "Almoxarifado Central UASA"
  ],
  [
    "ALM-059",
    "HIPOCLORITO DE SÓDIO  5LT",
    "Padrão CBMERJ / DGOA",
    "2026-09-01",
    0,
    "LOT-20260901",
    3,
    1,
    "Desinfetantes & Biossegurança",
    "Almoxarifado Central UASA"
  ],
  [
    "ALM-060",
    "ONDANSETRONA  SOLUÇÃO INJETÁVEL 2 MG/ ML -  2 ML AMPOLA  (NAUSEDRON) UNID",
    "Padrão CBMERJ / DGOA",
    "2027-11-01",
    0,
    "LOT-20271101",
    6,
    10,
    "Fármaco Comum",
    "Almoxarifado Central UASA"
  ],
  [
    "ALM-061",
    "LENÇOL DESCARTAVÉL (PCTE C/10)",
    "Padrão CBMERJ / DGOA",
    "",
    0,
    "LOTE-PADRÃO",
    5,
    2,
    "Material/Descartável APH",
    "Almoxarifado Central UASA"
  ],
  [
    "ALM-062",
    "LUVA GROSSA PARA LIMPEZA  (UNID)",
    "Padrão CBMERJ / DGOA",
    "2026-04-01",
    0,
    "LOT-20260401",
    4,
    4,
    "Desinfetantes & Biossegurança",
    "Almoxarifado Central UASA"
  ],
  [
    "ALM-063",
    "PROMETAZINA 25MG/ML   2ML/AMPOLA (UNID)",
    "Padrão CBMERJ / DGOA",
    "2026-02-01",
    0,
    "LOT-20260201",
    1,
    4,
    "Fármaco Comum",
    "Almoxarifado Central UASA"
  ],
  [
    "ALM-064",
    "LUVA DE PROCEDIMENTO  P",
    "Padrão CBMERJ / DGOA",
    "2027-07-01",
    0,
    "LOT-20270701",
    5,
    3,
    "Material/Descartável APH",
    "Almoxarifado Central UASA"
  ],
  [
    "ALM-065",
    "MOP ÚMIDO  ESCOVÃO (UNID)",
    "Padrão CBMERJ / DGOA",
    "",
    0,
    "LOTE-PADRÃO",
    8,
    1,
    "Desinfetantes & Biossegurança",
    "Almoxarifado Central UASA"
  ],
  [
    "ALM-066",
    "TENOXICAN  PÓ LIÓFILO INJETÁVEL 20MG FRASCO-AMPOLA (TILATIL)",
    "Padrão CBMERJ / DGOA",
    "2027-04-01",
    0,
    "LOT-20270401",
    3,
    6,
    "Fármaco Comum",
    "Almoxarifado Central UASA"
  ],
  [
    "ALM-067",
    "LUVA DE PROCEDIMENTO  M",
    "Padrão CBMERJ / DGOA",
    "2027-02-01",
    0,
    "LOT-20270201",
    6,
    7,
    "Material/Descartável APH",
    "Almoxarifado Central UASA"
  ],
  [
    "ALM-068",
    "PILHAS PEQUENAS (UNID)",
    "Padrão CBMERJ / DGOA",
    "",
    0,
    "LOTE-PADRÃO",
    2,
    8,
    "Desinfetantes & Biossegurança",
    "Almoxarifado Central UASA"
  ],
  [
    "ALM-069",
    "LUVA DE PROCEDIMENTO  G",
    "Padrão CBMERJ / DGOA",
    "2026-11-01",
    0,
    "LOT-20261101",
    6,
    5,
    "Material/Descartável APH",
    "Almoxarifado Central UASA"
  ],
  [
    "ALM-070",
    "SABÃO LÍQUIDO NEUTRO  5LT",
    "Padrão CBMERJ / DGOA",
    "2026-02-01",
    0,
    "LOT-20260201",
    3,
    1,
    "Desinfetantes & Biossegurança",
    "Almoxarifado Central UASA"
  ],
  [
    "ALM-071",
    "SOLUÇÃO RINGER LACTATO  500ml  BOLSA/FRASCO (UNID)",
    "Padrão CBMERJ / DGOA",
    "2028-04-01",
    0,
    "LOT-20280401",
    21,
    15,
    "Soluções Parenterais",
    "Almoxarifado Central UASA"
  ],
  [
    "ALM-072",
    "MANTA TÉRMICA ALUMINIZADA (UNID)",
    "Padrão CBMERJ / DGOA",
    "",
    0,
    "LOTE-PADRÃO",
    0,
    15,
    "Material/Descartável APH",
    "Almoxarifado Central UASA"
  ],
  [
    "ALM-073",
    "SACO DE LIXO BRANCO INFECTANTE 60 LT",
    "Padrão CBMERJ / DGOA",
    "",
    0,
    "LOTE-PADRÃO",
    6,
    10,
    "Desinfetantes & Biossegurança",
    "Almoxarifado Central UASA"
  ],
  [
    "ALM-074",
    "SOLUÇÃO FISIOLÓGICA 0,9%   500ml  BOLSA/FRASCO (UNID)",
    "Padrão CBMERJ / DGOA",
    "2028-08-01",
    0,
    "LOT-20280801",
    19,
    15,
    "Soluções Parenterais",
    "Almoxarifado Central UASA"
  ],
  [
    "ALM-075",
    "MÁSCARA N95",
    "Padrão CBMERJ / DGOA",
    "1930-06-01",
    0,
    "LOT-19300601",
    17,
    20,
    "Material/Descartável APH",
    "Almoxarifado Central UASA"
  ],
  [
    "ALM-076",
    "MÁSCARA DESCARTÁVEL (UNID)",
    "Padrão CBMERJ / DGOA",
    "",
    0,
    "LOTE-PADRÃO",
    70,
    40,
    "Material/Descartável APH",
    "Almoxarifado Central UASA"
  ],
  [
    "ALM-077",
    "REGISTRO DE ATENDIMENTO  RAPH :",
    "Padrão CBMERJ / DGOA",
    "",
    0,
    "LOTE-PADRÃO",
    2,
    2,
    "Impressos Oficiais & RAPH",
    "Almoxarifado Central UASA"
  ],
  [
    "ALM-078",
    "AGULHA DESCARTÁVEL 25x07  (UNID)",
    "Padrão CBMERJ / DGOA",
    "2026-07-01",
    0,
    "LOT-20260701",
    13,
    20,
    "Material/Descartável APH",
    "Almoxarifado Central UASA"
  ],
  [
    "ALM-079",
    "POLIFIX EXTENSOR  ADULTO (UNID)",
    "Padrão CBMERJ / DGOA",
    "2027-05-01",
    0,
    "LOT-20270501",
    24,
    10,
    "Material/Descartável APH",
    "Almoxarifado Central UASA"
  ],
  [
    "ALM-080",
    "Nº INICIAL DO RAPH:",
    "Padrão CBMERJ / DGOA",
    "",
    0,
    "LOTE-PADRÃO",
    0,
    0,
    "Impressos Oficiais & RAPH",
    "Almoxarifado Central UASA"
  ],
  [
    "ALM-081",
    "AGULHA DESCARTÁVEL 40X12  (UNID)",
    "Padrão CBMERJ / DGOA",
    "2030-03-01",
    0,
    "LOT-20300301",
    12,
    30,
    "Material/Descartável APH",
    "Almoxarifado Central UASA"
  ],
  [
    "ALM-082",
    "SERINGA DESCARTÁVEL 10ML  (UNID)",
    "Padrão CBMERJ / DGOA",
    "2030-11-01",
    0,
    "LOT-20301101",
    2,
    20,
    "Material/Descartável APH",
    "Almoxarifado Central UASA"
  ],
  [
    "ALM-083",
    "Nº FINAL DO RAPH:",
    "Padrão CBMERJ / DGOA",
    "",
    0,
    "LOTE-PADRÃO",
    0,
    0,
    "Impressos Oficiais & RAPH",
    "Almoxarifado Central UASA"
  ],
  [
    "ALM-084",
    "ATADURA DE CREPOM  20CM (UNID)",
    "Padrão CBMERJ / DGOA",
    "2029-03-01",
    0,
    "LOT-20290301",
    5,
    20,
    "Material/Descartável APH",
    "Almoxarifado Central UASA"
  ],
  [
    "ALM-085",
    "SERINGA DESCARTÁVEL 20ML  (UNID)",
    "Padrão CBMERJ / DGOA",
    "2030-11-01",
    0,
    "LOT-20301101",
    15,
    20,
    "Material/Descartável APH",
    "Almoxarifado Central UASA"
  ],
  [
    "ALM-086",
    "FOLHA DE REGISTRO DE TIH",
    "Padrão CBMERJ / DGOA",
    "",
    0,
    "LOTE-PADRÃO",
    4,
    2,
    "Impressos Oficiais & RAPH",
    "Almoxarifado Central UASA"
  ],
  [
    "ALM-087",
    "AVENTAL DESCARTÁVEL (UNID)",
    "Padrão CBMERJ / DGOA",
    "",
    0,
    "LOTE-PADRÃO",
    20,
    10,
    "Material/Descartável APH",
    "Almoxarifado Central UASA"
  ],
  [
    "ALM-088",
    "SONDA ASPIRAÇÃO Nº 04  (UNID)",
    "Padrão CBMERJ / DGOA",
    "2027-03-01",
    0,
    "LOT-20270301",
    6,
    4,
    "Material/Descartável APH",
    "Almoxarifado Central UASA"
  ],
  [
    "ALM-089",
    "REGISTRO DE CHECKLIST",
    "Padrão CBMERJ / DGOA",
    "",
    0,
    "LOTE-PADRÃO",
    0,
    0,
    "Impressos Oficiais & RAPH",
    "Almoxarifado Central UASA"
  ],
  [
    "ALM-090",
    "BOUGIE DE INTUBAÇÃO (5cmX 60 OU 70 cm ), SEM LÚMEN",
    "Padrão CBMERJ / DGOA",
    "2026-03-01",
    0,
    "LOT-20260301",
    0,
    2,
    "Material/Descartável APH",
    "Almoxarifado Central UASA"
  ],
  [
    "ALM-091",
    "SONDA ASPIRAÇÃO Nº 06  (UNID)",
    "Padrão CBMERJ / DGOA",
    "2027-11-01",
    0,
    "LOT-20271101",
    4,
    4,
    "Material/Descartável APH",
    "Almoxarifado Central UASA"
  ],
  [
    "ALM-092",
    "REGISTRO DE  RECOLHIMENTO DE  VALORES",
    "Padrão CBMERJ / DGOA",
    "",
    0,
    "LOTE-PADRÃO",
    0,
    1,
    "Impressos Oficiais & RAPH",
    "Almoxarifado Central UASA"
  ],
  [
    "ALM-093",
    "CÂNULAS NASOFARÍNGEAS   ( 1 ) n°6  ( 2 ) n° 7",
    "Padrão CBMERJ / DGOA",
    "2028-08-01",
    0,
    "LOT-20280801",
    3,
    6,
    "Material/Descartável APH",
    "Almoxarifado Central UASA"
  ],
  [
    "ALM-094",
    "SONDA ASPIRAÇÃO Nº 08  (UNID)",
    "Padrão CBMERJ / DGOA",
    "2028-09-01",
    0,
    "LOT-20280901",
    13,
    6,
    "Material/Descartável APH",
    "Almoxarifado Central UASA"
  ],
  [
    "ALM-095",
    "REGISTRO DE PSICOTRÓPICO",
    "Padrão CBMERJ / DGOA",
    "",
    0,
    "LOTE-PADRÃO",
    5,
    4,
    "Impressos Oficiais & RAPH",
    "Almoxarifado Central UASA"
  ],
  [
    "ALM-096",
    "CIRCUITO P/ ASPIRAÇÃO  (UNID)",
    "Padrão CBMERJ / DGOA",
    "2026-09-01",
    0,
    "LOT-20260901",
    9,
    10,
    "Material/Descartável APH",
    "Almoxarifado Central UASA"
  ],
  [
    "ALM-097",
    "SONDA ASPIRAÇÃO Nº 12  (UNID)",
    "Padrão CBMERJ / DGOA",
    "",
    0,
    "LOTE-PADRÃO",
    0,
    10,
    "Material/Descartável APH",
    "Almoxarifado Central UASA"
  ],
  [
    "ALM-098",
    "REGISTRO DE ÓBITO",
    "Padrão CBMERJ / DGOA",
    "",
    0,
    "LOTE-PADRÃO",
    5,
    2,
    "Impressos Oficiais & RAPH",
    "Almoxarifado Central UASA"
  ],
  [
    "ALM-099",
    "CIRCUITO P/ OXIGENOTERAPIA  (UNID)",
    "Padrão CBMERJ / DGOA",
    "2027-05-01",
    0,
    "LOT-20270501",
    7,
    5,
    "Material/Descartável APH",
    "Almoxarifado Central UASA"
  ],
  [
    "ALM-100",
    "SONDA ASPIRAÇÃO Nº 16  (UNID)",
    "Padrão CBMERJ / DGOA",
    "",
    0,
    "LOTE-PADRÃO",
    0,
    10,
    "Material/Descartável APH",
    "Almoxarifado Central UASA"
  ],
  [
    "ALM-101",
    "AMBU ADULTO",
    "Padrão CBMERJ / DGOA",
    "2025-08-01",
    0,
    "LOT-20250801",
    17,
    10,
    "Equipamento Biomédico",
    "Almoxarifado Central UASA"
  ],
  [
    "ALM-102",
    "EQUIPO DE BOMBA INFUSORA LIFEMED  SIMPLES",
    "Padrão CBMERJ / DGOA",
    "2029-12-01",
    0,
    "LOT-20291201",
    13,
    10,
    "Impressos Oficiais & RAPH",
    "Almoxarifado Central UASA"
  ],
  [
    "ALM-103",
    "AMBU PEDIÁTRICO",
    "Padrão CBMERJ / DGOA",
    "2026-06-01",
    0,
    "LOT-20260601",
    5,
    4,
    "Equipamento Biomédico",
    "Almoxarifado Central UASA"
  ],
  [
    "ALM-104",
    "02 para troca",
    "Padrão CBMERJ / DGOA",
    "",
    0,
    "LOTE-PADRÃO",
    0,
    0,
    "Material/Descartável APH",
    "Almoxarifado Central UASA"
  ],
  [
    "ALM-105",
    "EQUIPO DE BOMBA INFUSORA LIFEMED FOTOSENSIVEL",
    "Padrão CBMERJ / DGOA",
    "1930-02-01",
    0,
    "LOT-19300201",
    32,
    10,
    "Impressos Oficiais & RAPH",
    "Almoxarifado Central UASA"
  ],
  [
    "ALM-106",
    "AMBU NEONATAL",
    "Padrão CBMERJ / DGOA",
    "",
    0,
    "LOTE-PADRÃO",
    5,
    2,
    "Equipamento Biomédico",
    "Almoxarifado Central UASA"
  ],
  [
    "ALM-107",
    "05 para troca",
    "Padrão CBMERJ / DGOA",
    "",
    0,
    "LOTE-PADRÃO",
    0,
    0,
    "Material/Descartável APH",
    "Almoxarifado Central UASA"
  ],
  [
    "ALM-108",
    "CIRCUITO DE RESPIRADOR OXYLOG 3000",
    "Padrão CBMERJ / DGOA",
    "2026-12-01",
    0,
    "LOT-20261201",
    7,
    6,
    "Equipamento Biomédico",
    "Almoxarifado Central UASA"
  ],
  [
    "ALM-109",
    "MASCARA DE OXIGENOTERAPIA ADULTO",
    "Padrão CBMERJ / DGOA",
    "2026-12-01",
    0,
    "LOT-20261201",
    26,
    10,
    "Equipamento Biomédico",
    "Almoxarifado Central UASA"
  ],
  [
    "ALM-110",
    "SONDA ASPIRAÇÃO Nº 14  (UNID)",
    "Padrão CBMERJ / DGOA",
    "2027-09-01",
    0,
    "LOT-20270901",
    16,
    4,
    "Impressos Oficiais & RAPH",
    "Almoxarifado Central UASA"
  ],
  [
    "ALM-111",
    "MASCARA DE OXIGENOTERAPIA PEDIÁTRICA",
    "Padrão CBMERJ / DGOA",
    "2026-12-01",
    0,
    "LOT-20261201",
    8,
    5,
    "Equipamento Biomédico",
    "Almoxarifado Central UASA"
  ],
  [
    "ALM-112",
    "MASCARA DE NEBULIZAÇÃO ADULTO",
    "Padrão CBMERJ / DGOA",
    "2026-12-01",
    0,
    "LOT-20261201",
    5,
    0,
    "Equipamento Biomédico",
    "Almoxarifado Central UASA"
  ],
  [
    "ALM-113",
    "MASCARA DE NEBULIZAÇÃO PEDIÁTRICA",
    "Padrão CBMERJ / DGOA",
    "2026-12-01",
    0,
    "LOT-20261201",
    2,
    0,
    "Equipamento Biomédico",
    "Almoxarifado Central UASA"
  ],
  [
    "ALM-114",
    "MASCARA LARÍNGEA nº 2",
    "Padrão CBMERJ / DGOA",
    "2026-12-01",
    0,
    "LOT-20261201",
    0,
    4,
    "Equipamento Biomédico",
    "Almoxarifado Central UASA"
  ],
  [
    "ALM-115",
    "MASCARA LARÍNGEA nº 3",
    "Padrão CBMERJ / DGOA",
    "2026-12-01",
    0,
    "LOT-20261201",
    7,
    4,
    "Equipamento Biomédico",
    "Almoxarifado Central UASA"
  ],
  [
    "ALM-116",
    "MASCARA LARÍNGEA nº 4",
    "Padrão CBMERJ / DGOA",
    "2026-12-01",
    0,
    "LOT-20261201",
    3,
    4,
    "Equipamento Biomédico",
    "Almoxarifado Central UASA"
  ],
  [
    "ALM-117",
    "MASCARA LARÍNGEA nº 5",
    "Padrão CBMERJ / DGOA",
    "2026-12-01",
    0,
    "LOT-20261201",
    6,
    4,
    "Equipamento Biomédico",
    "Almoxarifado Central UASA"
  ],
  [
    "ALM-118",
    "KIT COMPLETO DE CÂNULAS DE GUEDEL (0 - 5)",
    "Padrão CBMERJ / DGOA",
    "2026-12-01",
    0,
    "LOT-20261201",
    2,
    2,
    "Equipamento Biomédico",
    "Almoxarifado Central UASA"
  ],
  [
    "ALM-119",
    "+ (2 nº0) (1 nº1) (2 nº2) (3 nº3) (1 nº4)",
    "Padrão CBMERJ / DGOA",
    "",
    0,
    "LOTE-PADRÃO",
    0,
    0,
    "Material/Descartável APH",
    "Almoxarifado Central UASA"
  ],
  [
    "ALM-120",
    "COLAR CERVICAL RN",
    "Padrão CBMERJ / DGOA",
    "2026-12-01",
    0,
    "LOT-20261201",
    0,
    2,
    "Equipamento Biomédico",
    "Almoxarifado Central UASA"
  ],
  [
    "ALM-121",
    "COLAR CERVICAL PP",
    "Padrão CBMERJ / DGOA",
    "2026-12-01",
    0,
    "LOT-20261201",
    3,
    2,
    "Equipamento Biomédico",
    "Almoxarifado Central UASA"
  ],
  [
    "ALM-122",
    "+ 4 Inf",
    "Padrão CBMERJ / DGOA",
    "",
    0,
    "LOTE-PADRÃO",
    0,
    0,
    "Material/Descartável APH",
    "Almoxarifado Central UASA"
  ],
  [
    "ALM-123",
    "COLAR CERVICAL P",
    "Padrão CBMERJ / DGOA",
    "2026-12-01",
    0,
    "LOT-20261201",
    0,
    2,
    "Equipamento Biomédico",
    "Almoxarifado Central UASA"
  ],
  [
    "ALM-124",
    "COLAR CERVICAL M",
    "Padrão CBMERJ / DGOA",
    "2026-12-01",
    0,
    "LOT-20261201",
    2,
    2,
    "Equipamento Biomédico",
    "Almoxarifado Central UASA"
  ],
  [
    "ALM-125",
    "COLAR CERVICAL G",
    "Padrão CBMERJ / DGOA",
    "2026-12-01",
    0,
    "LOT-20261201",
    7,
    2,
    "Equipamento Biomédico",
    "Almoxarifado Central UASA"
  ],
  [
    "ALM-126",
    "+ 2 Reguláveis",
    "Padrão CBMERJ / DGOA",
    "",
    0,
    "LOTE-PADRÃO",
    0,
    0,
    "Material/Descartável APH",
    "Almoxarifado Central UASA"
  ],
  [
    "ALM-127",
    "DRENO DE TÓRAX nº 12",
    "Padrão CBMERJ / DGOA",
    "2026-12-01",
    0,
    "LOT-20261201",
    0,
    2,
    "Equipamento Biomédico",
    "Almoxarifado Central UASA"
  ],
  [
    "ALM-128",
    "1 nº 10 + 1 nº 24",
    "Padrão CBMERJ / DGOA",
    "",
    0,
    "LOTE-PADRÃO",
    0,
    0,
    "Material/Descartável APH",
    "Almoxarifado Central UASA"
  ],
  [
    "ALM-129",
    "DRENO DE TÓRAX nº 28",
    "Padrão CBMERJ / DGOA",
    "2026-12-01",
    0,
    "LOT-20261201",
    1,
    2,
    "Equipamento Biomédico",
    "Almoxarifado Central UASA"
  ],
  [
    "ALM-130",
    "DRENO DE TÓRAX nº 30",
    "Padrão CBMERJ / DGOA",
    "2026-12-01",
    0,
    "LOT-20261201",
    0,
    2,
    "Equipamento Biomédico",
    "Almoxarifado Central UASA"
  ],
  [
    "ALM-131",
    "DRENO DE TÓRAX nº 33",
    "Padrão CBMERJ / DGOA",
    "2026-12-01",
    0,
    "LOT-20261201",
    0,
    2,
    "Equipamento Biomédico",
    "Almoxarifado Central UASA"
  ],
  [
    "ALM-132",
    "1 nº 32",
    "Padrão CBMERJ / DGOA",
    "",
    0,
    "LOTE-PADRÃO",
    0,
    0,
    "Material/Descartável APH",
    "Almoxarifado Central UASA"
  ],
  [
    "ALM-133",
    "SELO D´ÁGUA",
    "Padrão CBMERJ / DGOA",
    "2025-10-01",
    0,
    "LOT-20251001",
    3,
    4,
    "Equipamento Biomédico",
    "Almoxarifado Central UASA"
  ],
  [
    "ALM-134",
    "TREE WAY",
    "Padrão CBMERJ / DGOA",
    "2026-12-01",
    0,
    "LOT-20261201",
    0,
    6,
    "Equipamento Biomédico",
    "Almoxarifado Central UASA"
  ]
];
    if (sheetItems.getLastRow() <= 2) {
      sheetItems.getRange(sheetItems.getLastRow() + 1, 1, itensOficiais.length, itensOficiais[0].length).setValues(itensOficiais);
      Logger.log("134 itens oficiais do Almoxarifado Médico DBM1/GOA inseridos com sucesso!");
    }
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
    // Garante automaticamente que todas as abas estejam criadas e formatadas na planilha
    inicializarPlanilhaAeromedico();

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
