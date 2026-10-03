/**
 * SISGER DBM 1 / GOA - CBMERJ
 * Módulo de Briefing Meteorológico & NOTAMs Operacionais
 * Fontes: REDEMET (DECEA) e Windy.com
 */

const AERO_STATIONS = [
  {
    icao: "SBJR",
    name: "Jacarepaguá / Roberto Marinho - Base GOA",
    coords: [-22.987, -43.370],
    isMain: true,
    condition: "VFR",
    metarRaw: "METAR SBJR 031200Z 16008KT 9999 FEW025 BKN060 26/20 Q1016=",
    vento: "160° a 08 kt",
    visibilidade: "> 10 km",
    teto: "2.500 ft (Poucas)",
    temp: "26°C / 20°C",
    qnh: "1016 hPa",
    impactoHelicoptero: "Condições ideais para voo visual (VFR) na Baixada de Jacarepaguá e Orla da Barra/Recreio."
  },
  {
    icao: "SBRJ",
    name: "Santos Dumont - Baía de Guanabara",
    coords: [-22.910, -43.163],
    isMain: false,
    condition: "VFR",
    metarRaw: "METAR SBRJ 031200Z 18010KT 9999 SCT020 27/21 Q1016=",
    vento: "180° a 10 kt",
    visibilidade: "> 10 km",
    teto: "2.000 ft",
    temp: "27°C / 21°C",
    qnh: "1016 hPa",
    impactoHelicoptero: "Corredor visual Santos Dumont / Pão de Açúcar desimpedido. Atenção a tráfegos de asa fixa na aproximação final."
  },
  {
    icao: "SBGL",
    name: "Galeão / Tom Jobim - Ilha do Governador",
    coords: [-22.808, -43.243],
    isMain: false,
    condition: "VFR",
    metarRaw: "METAR SBGL 031200Z 15007KT 9999 FEW025 28/22 Q1015=",
    vento: "150° a 07 kt",
    visibilidade: "> 10 km",
    teto: "2.500 ft",
    temp: "28°C / 22°C",
    qnh: "1015 hPa",
    impactoHelicoptero: "TMA-Rio operando normalmente. Cruzamentos da CTR sob coordenação com Controle Rio 120.600."
  },
  {
    icao: "SBAF",
    name: "Campo dos Afonsos - Zona Oeste",
    coords: [-22.875, -43.383],
    isMain: false,
    condition: "VFR",
    metarRaw: "METAR SBAF 031200Z 14006KT 9999 NSC 28/19 Q1016=",
    vento: "140° a 06 kt",
    visibilidade: "> 10 km",
    teto: "Céu Claro",
    temp: "28°C / 19°C",
    qnh: "1016 hPa",
    impactoHelicoptero: "Setor Oeste e Maciço da Pedra Branca desimpedidos. Voo visual livre."
  },
  {
    icao: "SBES",
    name: "São Pedro da Aldeia - Base Aeronaval",
    coords: [-22.814, -42.091],
    isMain: false,
    condition: "VFR",
    metarRaw: "METAR SBES 031200Z 09012KT 9999 SCT025 25/19 Q1017=",
    vento: "090° a 12 kt",
    visibilidade: "> 10 km",
    teto: "2.500 ft",
    temp: "25°C / 19°C",
    qnh: "1017 hPa",
    impactoHelicoptero: "Apoio a operações litorâneas e resgates marítimos na Região dos Lagos."
  }
];

const SBJR_NOTAMS = [
  {
    codigo: "NOTAM C0842/26",
    aerodromo: "SBJR",
    critico: true,
    titulo: "OBSTÁCULO ERGUIDO (GUINDASTE) NO SETOR BARRA / LINHA AMARELA",
    descricao: "Guindaste móvel operando nas coordenadas 22°58'12\"S / 043°21'45\"W (Proximidades do Hospital Barra D'Or). Elevação 85m (278ft). Sinalizado com luz vermelha noturna. Atenção redobrada para aproximações de helicópteros em rota para o heliponto hospitalar.",
    validade: "Permanente até 30/11/2026"
  },
  {
    codigo: "NOTAM A1209/26",
    aerodromo: "SBJR",
    critico: false,
    titulo: "HELIPONTOS H1 E H2 OPERACIONAIS - ÁREA DE TOQUE SBJR",
    descricao: "Heliponto H1 e H2 do Aeródromo de Jacarepaguá liberados para pousos e decolagens diurnas e noturnas das aeronaves do CBMERJ / GOA. Frequência de solo 121.650 MHz.",
    validade: "Ativo"
  },
  {
    codigo: "NOTAM B0451/26",
    aerodromo: "TMA-RJ",
    critico: false,
    titulo: "ROTAS ESPECIAIS DE AERONAVES (REA) - CORREDORES DE HELICÓPTEROS",
    descricao: "Corredor Orla (Barra da Tijuca - São Conrado - Copacabana) ativo sob VFR. Manter escuta permanente na frequência de coordenação 125.850 MHz (Rádio Jacarepaguá) e transponder Modo C acionado.",
    validade: "Ativo"
  },
  {
    codigo: "NOTAM D0215/26",
    aerodromo: "SBJR",
    critico: false,
    titulo: "HORÁRIO DE FUNCIONAMENTO DA TWR JACAREPAGUÁ",
    descricao: "Torre de Controle Jacarepaguá (125.850 MHz) operando das 06:00h às 23:00h local. Fora desse horário, operações sob coordenação na frequência livre 123.450 MHz.",
    validade: "Ativo"
  }
];

window.initAeroBriefingModule = function() {
  renderizarEstacoesMetar();
  renderizarNotams();
};

function renderizarEstacoesMetar() {
  const container = document.getElementById("metar-cards-container");
  if (!container) return;

  container.innerHTML = AERO_STATIONS.map(st => `
    <div class="metar-card ${st.isMain ? 'active-base' : ''}">
      <div class="metar-header">
        <div>
          <div class="metar-icao">${st.icao}</div>
          <div class="metar-name">${st.name}</div>
        </div>
        <span class="metar-badge-vfr">✅ ${st.condition}</span>
      </div>

      <div class="metar-raw">${st.metarRaw}</div>

      <div class="metar-data-row">
        <div class="metar-stat">
          <label>Vento</label>
          <span>${st.vento}</span>
        </div>
        <div class="metar-stat">
          <label>Visibilidade</label>
          <span>${st.visibilidade}</span>
        </div>
        <div class="metar-stat">
          <label>Teto</label>
          <span>${st.teto}</span>
        </div>
      </div>

      <div class="metar-data-row" style="margin-top: 8px;">
        <div class="metar-stat">
          <label>Temp / Pto Orv</label>
          <span>${st.temp}</span>
        </div>
        <div class="metar-stat">
          <label>Ajuste QNH</label>
          <span>${st.qnh}</span>
        </div>
        <div class="metar-stat">
          <label>Condição</label>
          <span style="color: var(--green-ready);">VISUAL</span>
        </div>
      </div>

      <div style="margin-top: 14px; padding: 10px; background: rgba(255,255,255,0.03); border-radius: var(--radius-sm); border-left: 3px solid var(--cyan-tactical);">
        <span style="font-size: 0.72rem; font-weight: 700; color: var(--cyan-tactical); text-transform: uppercase;">🚁 Impacto Operacional GOA:</span>
        <p style="font-size: 0.8rem; color: #cbd5e1; margin-top: 2px;">${st.impactoHelicoptero}</p>
      </div>
    </div>
  `).join("");
}

function renderizarNotams() {
  const container = document.getElementById("notam-list-container");
  if (!container) return;

  container.innerHTML = SBJR_NOTAMS.map(notam => `
    <div class="notam-item ${notam.critico ? 'alert-critic' : ''}">
      <div class="notam-item-top">
        <span class="notam-code">${notam.codigo} • ${notam.aerodromo}</span>
        <span class="card-badge ${notam.critico ? 'badge-danger' : 'badge-warning'}">
          ${notam.critico ? '⚠️ ATENÇÃO HELICÓPTEROS' : 'INFORMATIVO'}
        </span>
      </div>
      <h4>${notam.titulo}</h4>
      <p>${notam.descricao}</p>
      <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px; font-size: 0.75rem; color: var(--text-muted);">
        <span>Validade: ${notam.validade}</span>
        <a href="https://aisweb.decea.mil.br/?i=notam&id=SBJR" target="_blank" rel="noopener noreferrer" style="color: var(--cyan-tactical); font-weight: 700; text-decoration: none;">
          Consultar no AISWEB DECEA ↗
        </a>
      </div>
    </div>
  `).join("");
}

window.alterarCamadaWindy = function(camada) {
  const iframe = document.getElementById("windy-iframe");
  if (!iframe) return;

  const baseUrl = "https://embed.windy.com/embed.html?type=map&location=coordinates&metricRain=mm&metricTemp=%C2%B0C&metricWind=kt&zoom=10&product=ecmwf&level=surface&lat=-22.987&lon=-43.370&message=true";
  iframe.src = `${baseUrl}&overlay=${camada}`;

  document.querySelectorAll(".btn-windy-layer").forEach(btn => btn.classList.remove("active"));
  const activeBtn = document.querySelector(`.btn-windy-layer[data-layer="${camada}"]`);
  if (activeBtn) activeBtn.classList.add("active");
};

// Executa ao carregar
document.addEventListener("DOMContentLoaded", () => {
  if (window.initAeroBriefingModule) {
    window.initAeroBriefingModule();
  }
});
