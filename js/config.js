/**
 * SISGER DBM 1 / GOA - CBMERJ
 * Configuração Central do Portal (Headless Configuration)
 * Atualizado com horários oficiais, estrutura autêntica de Administração e Met/NOTAM
 */

const DEFAULT_CONFIG = {
  portal: {
    title: "SISGER DBM1/GOA",
    subtitle: "Sistema de Gestão do 1º Destacamento de Bombeiro Militar / Grupamento de Operações Aéreas",
    corporation: "CBMERJ - Corpo de Bombeiros Militar do Estado do Rio de Janeiro",
    unitEmail: "dbmlagoa@gmail.com",
    unitPhone: "(21) 98596-9351",
    version: "4.1.0-PROD",
    appsScriptUrl: "https://script.google.com/macros/s/AKfycbxAc4FFvitYtQB35psdhPu6XEkZF7p16y-ILr5YrmI5ilF_P1snMukF2qWGWUaM2dUeeQ/exec",
    tvVideoId: "1x5rcnA3uGS-BICz-KsjbRdXVSWH4XSfp" // Vídeo Recomendações de Segurança GOA
  },

  // 1. Vídeo Oficial: Recomendações de Segurança (Google Drive - Loop na TV e Home)
  videoRecomendacoes: {
    driveFileId: "1x5rcnA3uGS-BICz-KsjbRdXVSWH4XSfp",
    title: "Recomendações de Segurança",
    subtitle: "Briefing Operacional de Segurança de Voo • GOA / CBMERJ",
    previewUrl: "https://drive.google.com/file/d/1x5rcnA3uGS-BICz-KsjbRdXVSWH4XSfp/preview"
  },

  // 2. Check List de Pronto Emprego
  checklist: {
    title: "Check List - Material de Pronto Emprego",
    csvUrl: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTu4q9jr-xN_divraeeFmyyDeoANph3559wXe3sXl54Oek2LvNt9zVhttk5Uivh_rKGlhfrgUTtCTOW/pub?output=csv",
    formUrl: "https://forms.gle/SuLZ4WrT7N7UUVRQ7",
    targetHour: 7, // Horário limite diário para conferência (após o briefing)
    targetMinute: 15
  },

  // 3. Formulários Operacionais Rápidos na Página Inicial (Sem controle sanitário - realocado para Administração)
  quickForms: [
    {
      id: "form-checklist",
      title: "Checklist de Material de Pronto Emprego",
      desc: "Conferência diária obrigatória da carga operacional após o briefing matinal.",
      icon: "clipboard-check",
      badge: "Diário (06:40)",
      url: "https://forms.gle/SuLZ4WrT7N7UUVRQ7",
      color: "amber"
    },
    {
      id: "form-experiencia",
      title: "Registro de Experiência Operacional",
      desc: "Lançamento de horas de voo, missões SAR, resgates e ocorrências da tripulação.",
      icon: "award",
      badge: "Pós-Missão",
      url: "https://docs.google.com/forms/d/e/1FAIpQLSfJwFw_1cXWmDELPyB6v_aaVWKt3GfIDqwuEYj5qprN35EHjA/viewform?usp=sharing&ouid=111973117430697468606",
      color: "cyan"
    },
    {
      id: "form-cautela",
      title: "Cautela de EPIs",
      desc: "Retirada e devolução de Short John, Long John, botas e luvas de neoprene no DMOP.",
      icon: "shield",
      badge: "Cautela Individual",
      url: "https://docs.google.com/forms/d/e/1FAIpQLSfD7BpVW84JEsywaFGiBd-U7zSv86pkfxcZuWfM5XZKIKbe5Q/viewform?usp=header",
      color: "emerald"
    }
  ],

  // 4. Conexão com Google Calendar Oficial (dbmlagoa@gmail.com)
  googleCalendar: {
    calendarId: "dbmlagoa@gmail.com",
    apiKey: "AIzaSyBobA3sv6gXaWF4XKq18-pvbISiydQ8FPQ"
  },

  // 5. Rotina Diária Operacional Oficial (Extraída integralmente do Calendário do GOA)
  rotinaDiaria: [
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
  ],

  // 5.1 Quadro de Trabalho Semanal - Instrução Oficial (Outubro 2026 - GOA/CBMERJ)
  quadroTrabalho: [
    {
      dia: "06/10",
      horario: "09:30h às 10:45h",
      assunto: "VEÍCULOS AÉREOS NÃO TRIPULADOS",
      conteudo: "VISÃO GERAL DAS OPERAÇÕES COM RPA NO ÂMBITO DO CBMERJ: DO ACIONAMENTO AO PÓS-VOO",
      responsavel: "COVANT"
    },
    {
      dia: "07/10",
      horario: "09:30h às 10:45h",
      assunto: "VEÍCULOS AÉREOS NÃO TRIPULADOS",
      conteudo: "VISÃO GERAL DAS OPERAÇÕES COM RPA NO ÂMBITO DO CBMERJ: DO ACIONAMENTO AO PÓS-VOO",
      responsavel: "COVANT"
    },
    {
      dia: "08/10",
      horario: "09:30h às 10:45h",
      assunto: "VEÍCULOS AÉREOS NÃO TRIPULADOS",
      conteudo: "VISÃO GERAL DAS OPERAÇÕES COM RPA NO ÂMBITO DO CBMERJ: DO ACIONAMENTO AO PÓS-VOO",
      responsavel: "COVANT"
    },
    {
      dia: "09/10",
      horario: "09:30h às 10:45h",
      assunto: "VEÍCULOS AÉREOS NÃO TRIPULADOS",
      conteudo: "VISÃO GERAL DAS OPERAÇÕES COM RPA NO ÂMBITO DO CBMERJ: DO ACIONAMENTO AO PÓS-VOO",
      responsavel: "COVANT"
    },
    {
      dia: "13/10",
      horario: "09:30h às 10:45h",
      assunto: "ABASTECIMENTO",
      conteudo: "ABASTECIMENTO DE AERONAVES: QUALIDADE DE COMBUSTÍVEIS",
      responsavel: "TASA"
    },
    {
      dia: "14/10",
      horario: "09:30h às 10:45h",
      assunto: "ABASTECIMENTO",
      conteudo: "ABASTECIMENTO DE AERONAVES: QUALIDADE DE COMBUSTÍVEIS",
      responsavel: "TASA"
    },
    {
      dia: "15/10",
      horario: "09:30h às 10:45h",
      assunto: "ABASTECIMENTO",
      conteudo: "ABASTECIMENTO DE AERONAVES: QUALIDADE DE COMBUSTÍVEIS",
      responsavel: "TASA"
    },
    {
      dia: "16/10",
      horario: "09:30h às 10:45h",
      assunto: "ABASTECIMENTO",
      conteudo: "ABASTECIMENTO DE AERONAVES: QUALIDADE DE COMBUSTÍVEIS",
      responsavel: "TASA"
    },
    {
      dia: "19/10",
      horario: "09:30h às 10:45h",
      assunto: "VEÍCULOS AÉREOS NÃO TRIPULADOS",
      conteudo: "MODELOS E TECNOLOGIAS DE RPA NO ÂMBITO DO CBMERJ",
      responsavel: "COVANT"
    },
    {
      dia: "20/10",
      horario: "09:30h às 10:45h",
      assunto: "VEÍCULOS AÉREOS NÃO TRIPULADOS",
      conteudo: "MODELOS E TECNOLOGIAS DE RPA NO ÂMBITO DO CBMERJ",
      responsavel: "COVANT"
    },
    {
      dia: "21/10",
      horario: "09:30h às 10:45h",
      assunto: "VEÍCULOS AÉREOS NÃO TRIPULADOS",
      conteudo: "MODELOS E TECNOLOGIAS DE RPA NO ÂMBITO DO CBMERJ",
      responsavel: "COVANT"
    },
    {
      dia: "22/10",
      horario: "09:30h às 10:45h",
      assunto: "VEÍCULOS AÉREOS NÃO TRIPULADOS",
      conteudo: "MODELOS E TECNOLOGIAS DE RPA NO ÂMBITO DO CBMERJ",
      responsavel: "COVANT"
    },
    {
      dia: "26/10",
      horario: "09:30h às 10:45h",
      assunto: "PRÁTICA : SALVAMENTO EM ALTURA (EM SOLO)",
      conteudo: "PRÁTICA: PREPARAÇÃO PARA O SOCORRO / INSPEÇÃO DE EQUIPAMENTOS / SALVAMENTO COM MACA / SEGURANÇA DA OPERAÇÃO / POP",
      responsavel: "COPILOTO DE SERVIÇO / FIEL"
    },
    {
      dia: "27/10",
      horario: "09:30h às 10:45h",
      assunto: "PRÁTICA : SALVAMENTO EM ALTURA (EM SOLO)",
      conteudo: "PRÁTICA: PREPARAÇÃO PARA O SOCORRO / INSPEÇÃO DE EQUIPAMENTOS / SALVAMENTO COM MACA / SEGURANÇA DA OPERAÇÃO / POP",
      responsavel: "COPILOTO DE SERVIÇO / FIEL"
    },
    {
      dia: "28/10",
      horario: "09:30h às 10:45h",
      assunto: "PRÁTICA : SALVAMENTO EM ALTURA (EM SOLO)",
      conteudo: "PRÁTICA: PREPARAÇÃO PARA O SOCORRO / INSPEÇÃO DE EQUIPAMENTOS / SALVAMENTO COM MACA / SEGURANÇA DA OPERAÇÃO / POP",
      responsavel: "COPILOTO DE SERVIÇO / FIEL"
    },
    {
      dia: "29/10",
      horario: "09:30h às 10:45h",
      assunto: "PRÁTICA : SALVAMENTO EM ALTURA (EM SOLO)",
      conteudo: "PRÁTICA: PREPARAÇÃO PARA O SOCORRO / INSPEÇÃO DE EQUIPAMENTOS / SALVAMENTO COM MACA / SEGURANÇA DA OPERAÇÃO / POP",
      responsavel: "COPILOTO DE SERVIÇO / FIEL"
    }
  ],

  // 6. Mural de Avisos e Últimas Notícias (Extraído da Barra de Notícias do Site Original)
  muralAvisos: [
    {
      id: "aviso-padronizacao-epi",
      tipo: "operacional",
      titulo: "Padronização de EPI para Fiéis",
      subtitulo: "Salvamento Aquático com Aeronaves de Asa Rotativa",
      texto: "Padronização implementada para salvamento aquático no GOA: Short John (roupa de neoprene curta), luvas de neoprene e botas de neoprene. Equipagem obrigatória para fiéis escalados.",
      data: "EPI SAR",
      targetView: "noticias",
      targetLinkText: "Ler Notícia Completa ↗"
    },
    {
      id: "aviso-cautela-epi",
      tipo: "informativo",
      titulo: "Cautela de EPIs no DMOP",
      subtitulo: "Kits de Long John, Botas e Luvas de Neoprene",
      texto: "Encontram-se disponíveis para cautela no DMOP do DBM 1/GOA kits contendo Long John, botas e luvas de neoprene. Procure o militar de serviço de dia ao depósito.",
      data: "DMOP Carga",
      targetView: "noticias",
      targetLinkText: "Ver Instruções de Cautela ↗"
    },
    {
      id: "aviso-sigmat",
      tipo: "operacional",
      titulo: "Operação do SIG-MAT (Controle DMOP)",
      subtitulo: "Sistema Integrado de Gestão de Material Operacional",
      texto: "Concluída a entrada em operação definitiva do SIG-MAT para gestão, conferência e controle de carga de materiais de resgate e equipamentos helitransportados.",
      data: "SIG-MAT",
      targetView: "sigmat",
      targetLinkText: "Acessar Sistema SIG-MAT ↗"
    },
    {
      id: "aviso-aquisicao-material",
      tipo: "alerta",
      titulo: "Aquisição de Material Operacional",
      subtitulo: "Processo SEI nº 124235079 • Modernização da Unidade",
      texto: "Concluída a aquisição de novos equipamentos operacionais e têxteis para resgate aeromédico e salvamento em altura, elevando a prontidão operacional e segurança de voo.",
      data: "SEI-RJ",
      targetView: "noticias",
      targetLinkText: "Consultar Especificações ↗"
    },
    {
      id: "aviso-reforma-dbm",
      tipo: "operacional",
      titulo: "Reforma e Readequação do DBM 1/GOA",
      subtitulo: "1ª Fase de Obras • Alojamento e Almoxarifado",
      texto: "Instalação de containers provisórios para alojamento feminino, almoxarifado médico provisório e sanitários da empresa Argal. Atenção redobrada à circulação interna.",
      data: "Obras DBM 1",
      targetView: "noticias",
      targetLinkText: "Ver Detalhes da Reforma ↗"
    },
    {
      id: "aviso-quesito-eletronico",
      tipo: "urgente",
      titulo: "Orientações para Preenchimento do Quesito Eletrônico",
      subtitulo: "Normas Operacionais Vigentes • SISGEO e Oncall",
      texto: "Preenchimento obrigatório pelo Chefe de Guarnição (SAR/Aeromédico) e assinatura pelo Comandante da Aeronave. Atenção ao correto lançamento de atribuições no sistema Oncall.",
      data: "Atenção Geral",
      targetView: "noticias",
      targetLinkText: "Consultar Normas na Íntegra ↗"
    }
  ],

  // 6. Sistemas WebApps Integrados (Google Apps Script)
  sistemasIntegrados: {
    sigmat: {
      name: "SIG-MAT (Controle DMOP)",
      desc: "Gestão e controle de carga de material operacional",
      scriptUrl: "https://script.google.com/macros/s/AKfycbzd2tK8jWnw9hOOQY7bFDYo78MZMSPogTbPVVfaCOCHlgLGTtQ6Yix5awhLujtx7JU/exec"
    },
    aeromedico: {
      name: "SIG-Aeromédico",
      desc: "Controle de insumos, medicamentos e relatórios de resgate aeromédico",
      scriptUrl: "https://script.google.com/macros/s/AKfycbxsRBEHsZ6ngBlmLpB6_52Ho1iJwvcM1tL14O0RHuFfs2PEk4mr-mkZGSJqB57QEMp7/exec"
    }
  },

  // 7. Dados Oficiais da Página Administração (Estrutura Exata do Site Original)
  administracao: {
    controleFinanceiro: {
      titulo: "Controle financeiro",
      lancamento: {
        titulo: "Lançamento de informações",
        subtitulo: "Compras ou Crédito em conta",
        url: "https://docs.google.com/forms/d/e/1FAIpQLSfj4ptk-X8rqi3T_Yh11or6qqAW2-_XbmRKEHGyDVHLNCOmJA/viewform"
      },
      balancete: {
        titulo: "Balancete Interno",
        url: "https://docs.google.com/spreadsheets/d/1P1sOqpBGC_NIpHOysAmsZvQSrg6R1MiRyeitcExrCos/edit?gid=1759977811#gid=1759977811"
      },
      bradesco: {
        titulo: "Bradesco",
        subtitulo: "Acesso ao Net Empresa",
        url: "https://www.ne12.bradesconetempresa.b.br/ibpjlogin/login.jsf"
      }
    },
    planoChamada: {
      titulo: "Plano de chamada",
      url: "https://drive.google.com/file/d/1vqL6_PK9DkvgCWIvrXCE7GmcSEiSDWlW/view?usp=drive_link"
    },
    bensPatrimoniais: {
      titulo: "Bens patrimoniais",
      arrolamento: {
        titulo: "Arrolamento",
        url: "https://drive.google.com/drive/folders/1zSEMPDeWycPb0l76wrjDw1Pgq0yb7hI8"
      }
    },
    controleSanitario: {
      titulo: "Controle sanitário",
      potabilidade: {
        titulo: "Laudo de Potabilidade",
        url: "https://drive.google.com/file/d/1KOWe1KmjD-mSWR-NWzw3jKk1nccSk_4W/view?usp=drive_link"
      },
      desratizacao: {
        titulo: "Laudo de desratização e dedetização",
        url: "https://drive.google.com/file/d/1VEgPqFrL8pdRwt-Gt1TjS7PEy_ymiYPb/view?usp=drive_link"
      }
    },
    controleRadios: {
      titulo: "Controle de rádios",
      url: "https://docs.google.com/spreadsheets/d/14SSXdj1QgdX7qSSx6WJ74KQ8iPUYJ-WxFTQVILRFrmE/edit?usp=share_link"
    }
  },

  // 8. Meteorologia e NOTAM (Briefing Matinal Aeronáutico)
  aeroBriefing: {
    baseIcao: "SBJR", // Jacarepaguá / Roberto Marinho - Base Principal do GOA
    baseName: "Aeródromo de Jacarepaguá (SBJR) - Base GOA",
    redemetUrl: "https://redemet.decea.mil.br/",
    aiswebNotamUrl: "https://aisweb.decea.mil.br/?i=notam&id=SBJR",
    windyEmbedUrl: "https://embed.windy.com/embed.html?type=map&location=coordinates&metricRain=mm&metricTemp=%C2%B0C&metricWind=kt&zoom=10&overlay=wind&product=ecmwf&level=surface&lat=-22.987&lon=-43.370&message=true",
    aerodromosApoio: ["SBJR", "SBRJ", "SBGL", "SBAF", "SBES"]
  },

  // 9. Dashboards e Outros
  cardapioUrl: "https://datastudio.google.com/embed/reporting/8db989e0-5255-4226-9af9-e48869fcc0d6/page/p_bykjmpwrwd",
  planejamentoUrl: "https://reestruturacaogoa2026-t067zym.gamma.site/",
  popUrl: "https://sites.google.com/view/pop-goacbmerj/pops"
};

// Carrega configuração persistida no navegador ou usa a padrão
function carregarConfiguracao() {
  const chave = "SISGER_GOA_CONFIG_V4_1";
  const salvo = localStorage.getItem(chave);
  if (salvo) {
    try {
      const parsed = JSON.parse(salvo);
      if (parsed.portal && parsed.portal.version === DEFAULT_CONFIG.portal.version) {
        if (!parsed.muralAvisos || !Array.isArray(parsed.muralAvisos) || parsed.muralAvisos.length === 0) {
          parsed.muralAvisos = JSON.parse(JSON.stringify(DEFAULT_CONFIG.muralAvisos));
        }
        if (!parsed.quadroTrabalho || !Array.isArray(parsed.quadroTrabalho) || parsed.quadroTrabalho.length === 0) {
          parsed.quadroTrabalho = JSON.parse(JSON.stringify(DEFAULT_CONFIG.quadroTrabalho));
        }
        return parsed;
      }
    } catch (e) {
      console.warn("Falha ao analisar config local, usando padrão:", e);
    }
  }
  return JSON.parse(JSON.stringify(DEFAULT_CONFIG));
}

// Salva configuração no navegador
function salvarConfiguracaoLocal(novaConfig) {
  localStorage.setItem("SISGER_GOA_CONFIG_V4_1", JSON.stringify(novaConfig));
}
