# Manual de Implantação e Operação • SIG-Aeromédico v2
> **1º Destacamento de Bombeiro Militar / Grupamento de Operações Aéreas (DBM1/GOA - Lagoa)**  
> **Avenida Borges de Medeiros, 1444 - Lagoa Rodrigo de Freitas, Rio de Janeiro - RJ**

---

## 📌 Visão Geral da Atualização

O **SIG-Aeromédico v2** foi reestruturado para atender às necessidades específicas das tripulações médicas e de enfermagem do GOA, integrando a gestão de insumos de saúde e APH aos procedimentos operacionais padrão (POPs) do CBMERJ:

1. **Conferência de Mochilas e Kits de Bordo por Lacre de Segurança (06:40 pós-briefing):**
   - Elimina a necessidade de conferir centenas de ampolas avulsas na rotina diária matinal;
   - As mochilas padronizadas (*Vias Aéreas*, *Acesso & Fármacos*, *Trauma & Hemostáticos*, *Parto & Pediátrico*, *UTI Aérea AW169*) possuem lacres numerados. A conferência consiste na verificação da integridade do lacre ativo;
   - Botão de **Homologação Rápida dos Lacres** registra a checagem com data, hora e dados do militar de serviço.

2. **Gestão de Validades Farmacêuticas (FEFO - *First Expire, First Out*):**
   - Semáforo visual automatizado com contagem regressiva em dias;
   - Alerta antecipado para fármacos que vencem nos próximos 30 a 60 dias para priorização de consumo ou troca preventiva.

3. **Registro de Consumo Pós-Missão APH:**
   - Registro vinculado ao número da missão / Oncall do COBOM, prefixo da aeronave (*Bombeiro 01, Bombeiro 02 ou AW169*), identificação do paciente, Médico de Voo (CRM) e Enfermeiro de Voo (COREN);
   - Baixa automática no saldo do lote correspondente.

4. **Livro de Psicotrópicos & Entorpecentes (Portaria SVS/MS nº 344/98):**
   - Rastreabilidade de dosagens utilizadas de sedativos e analgésicos fortes (Midazolam, Fentanil, Cetamina, Morfina);
   - Registro de termo de descarte assistido de sobras com testemunho mútuo do médico e do enfermeiro.

5. **Calculadora Aeronáutica de Oxigênio Medicinal (O2):**
   - Cálculo em tempo real da **autonomia de voo em minutos** a partir da leitura do manômetro (PSI) e do fluxo prescrito (L/min), considerando margem de segurança de 200 PSI residual.

6. **Emissão de Relatório Oficial em PDF:**
   - Relatório A4 padronizado para impressão, solicitação de reposição junto ao DMOP/Farmácia Central e arquivo do DBM1.

---

## 🚀 Como Atualizar o Backend na Planilha Google (2 Minutos)

A planilha oficial do sistema está hospedada em:  
🔗 `https://docs.google.com/spreadsheets/d/1s6Fm1E4-4FzjHdXDtqlBzzSNiiZFs-S6xI42fR93bTw/edit`

Siga estes passos simples para ativar todas as novas tabelas e funções:

1. Abra a planilha no seu navegador.
2. No menu superior, clique em **Extensões** > **Apps Script**.
3. Apague o código que estiver no editor e cole todo o conteúdo do arquivo local:  
   📂 [`GoogleAppsScript_Aeromedico.js`](GoogleAppsScript_Aeromedico.js)
4. Na barra superior de ferramentas (ao lado do botão *Depurar*), selecione no seletor de funções:  
   👉 `inicializarPlanilhaAeromedico`
5. Clique no botão ▶️ **Executar**.
   - O Google solicitará autorização de acesso. Clique em *Revisar permissões* > escolha sua conta institucional > *Avançado* > *Acessar (não seguro)* > *Permitir*.
   - A função criará e formatará automaticamente as abas `kits_bordo`, `livro_controlados`, `cilindros_o2` e `users`, preservando integralmente todos os seus itens já cadastrados!
6. Clique no botão azul **Implantar** (canto superior direito) > **Gerenciar implantações**.
   - Clique no ícone de lápis (*Editar*).
   - Em **Versão**, escolha **Nova versão**.
   - Clique em **Implantar**.
7. Pronto! O Google Apps Script estará 100% atualizado e compatível com a nova interface.

---

## 💻 Teste e Visualização Local

Para testar a nova interface no seu navegador:

- **Dentro do Portal SISGER:**  
  Abra o arquivo [`index.html`](index.html) ou acesse via servidor local (`python server.py 8080`) e clique no menu lateral em **Controle Aeromédico**.
- **Janela Dedicada do SIG-Aeromédico:**  
  Abra diretamente o arquivo [`modules/aeromedico.html`](modules/aeromedico.html) no navegador.
