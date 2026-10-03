# Manual Operacional & Guia do Gestor: SISGER DBM 1/GOA

**Unidade:** 1º Destacamento de Bombeiro Militar / Grupamento de Operações Aéreas (CBMERJ)  
**Conta Institucional:** `dbmlagoa@gmail.com`  
**Versão:** 2.5.0 (Aero-Tactical SPA)

---

## 1. Visão Geral da Nova Plataforma

O novo **SISGER DBM 1/GOA** foi estruturado especificamente para resolver os três grandes problemas do antigo Google Sites:
1. **Fluidez e Responsividade Total:** Acabaram os travamentos e barras de rolagem duplas. Os sistemas **SIG-MAT** e **SIG-Aeromédico** rodam integrados e com visual moderno.
2. **Mural de Prontidão para TV Vertical:** A página inicial possui um modo dedicado para TVs e totens instalados na vertical (modo retrato), com relógio gigante, rotina da escala, avisos ao vivo e QR Codes de escaneamento rápido.
3. **Edição Intuitiva para Pessoas Leigas:** Os próximos gestores e oficiais de dia não precisam saber programação. Qualquer alteração (escalas, comunicados, links) é feita por um painel visual simples ou sincronizada diretamente com o Google Drive.

---

## 2. Como Utilizar o Modo Mural TV Vertical

A página inicial do portal foi projetada para operar continuamente em uma **Smart TV ou Monitor posicionado na vertical** no salão de prontidão ou corpo da guarda.

### Como Iniciar na TV:
1. Abra o navegador da TV (ou computador conectado a ela) no endereço do portal.
2. Clique no botão laranja **"🖥️ Modo Mural TV"** na barra lateral esquerda (ou no botão central do banner).
3. Pressione a tecla **F11** do teclado (ou o botão de tela cheia no topo) para preencher 100% da tela.

### O que a Tripulação Visualiza na TV:
- **Relógio e Data Operacional:** Horário com segundos e data completa para controle de prontidão.
- **Status do Checklist Diário:** Indicador luminoso (*Verde:* Pronto Emprego conferido hoje; *Amarelo:* Checklist pendente).
- **Quadro de Trabalho do Dia:** Exibição da escala de serviço diretamente do Google Drive.
- **Rotina da Escala:** Destaque automático da atividade do horário atual (ex: 06:00 Assunção de Serviço, 06:20 Briefing Matinal, 06:40 Conferência de Material/Checklist, 07:30 Prontidão Plena, 11:30 Almoço).
- **Mural de Avisos Dinâmico:** Rotação automática dos comunicados com barra de progresso a cada 8 segundos.
- **3 QR Codes Oficiais:** As tripulações que chegam para o serviço só precisam apontar a câmera do celular para a tela da TV para abrir imediatamente:
  - *QR Code 1:* Checklist de Pronto Emprego.
  - *QR Code 2:* Registro de Experiência Operacional (Horas de voo e missões).
  - *QR Code 3:* Cautela de EPIs (Neoprene, botas e luvas).

---

## 3. Guia de Edição Rápida para Próximos Gestores

No canto superior direito do portal, clique no ícone de engrenagem **⚙️ (Painel de Gestão)**. Um painel visual amigável se abrirá:

### Como Atualizar o Quadro de Trabalho do Dia:
1. No seu Google Drive (`dbmlagoa@gmail.com`), abra o PDF ou documento da escala do dia.
2. Copie o link de compartilhamento ou o ID do arquivo (código longo no meio da URL).
3. Abra o **Painel de Gestão ⚙️**, cole o link no campo *"ID ou Link do Quadro de Trabalho"* e clique em **Salvar**.
4. O portal e a TV atualizam a escala imediatamente.

### Como Publicar Notícias de Maneira Padronizada (Com Textos e Fotos):
1. Acesse a aba **"Notícias"** na barra lateral.
2. Clique no botão azul **"✍️ Nova Postagem (Gestor)"** (ou utilize o atalho dentro do **Painel de Gestão ⚙️**).
3. Preencha:
   - **Título da Notícia:** Nome claro do fato ou comunicado.
   - **Data da Publicação:** Já vem pré-preenchida com o dia de hoje, mas pode ser alterada.
   - **Subtítulo / Categoria:** Ex: *Material Operacional*, *Instrução de Voo*, etc.
   - **Conteúdo da Notícia:** Texto completo da matéria.
   - **Imagem Ilustrativa:** Você pode colar um link direto de foto OU clicar em **"📁 Escolher Imagem"** para carregar do computador (com preview instantâneo).
4. Clique em **"📢 Publicar Notícia no Portal"**. A matéria será instantaneamente adicionada ao topo do mural com formatação padronizada e persistida localmente e no backup.

### Exibição do Vídeo na TV Vertical:
- Na TV, apenas o vídeo oficial de **Recomendações de Segurança** (`1x5rcnA3uGS-BICz-KsjbRdXVSWH4XSfp`) é exibido em destaque contínuo em loop. O vídeo secundário foi removido para manter a tela limpa e focada.

### Como Publicar um Novo Aviso no Mural da TV:
1. Abra o **Painel de Gestão ⚙️**.
2. Na seção *"Avisos no Mural da TV Vertical"*, clique em **"+ Adicionar Novo Aviso"**.
3. Escolha o tipo (*Urgente, Operacional ou Informativo*), digite o título e o texto.
4. Clique em **Salvar Alterações**. O aviso já entra na rotação da TV instantaneamente.

### Como Alterar Horários da Rotina Diária:
1. No mesmo painel, você pode editar qualquer horário (ex: assunção às 06:00, briefing às 06:20, conferência às 06:40) ou clicar em **"+ Adicionar Horário"**.
2. Clique em **Salvar**.

### Backup e Segurança:
- Você pode clicar em **"📥 Baixar Backup (.json)"** para guardar uma cópia das configurações.
- Para transferir para outro computador ou restaurar, basta clicar em **"📤 Restaurar"** e selecionar o arquivo `.json`.

---

## 4. Conexão Autônoma com o Google Drive (`dbmlagoa@gmail.com`)

Adotamos a **Opção 1 (Ponte via Google Apps Script)** para que o portal acerte a leitura e gravação no Drive da conta institucional sem necessidade de senhas:

### Passo a Passo de Instalação (Leva 2 minutos):
1. No seu computador, entre na sua conta Google: **`dbmlagoa@gmail.com`**.
2. Acesse o endereço oficial: [https://script.google.com/](https://script.google.com/).
3. Clique em **"+ Novo projeto"** (canto superior esquerdo).
4. No topo, dê o nome de: **`SISGER GOA - Ponte Drive API`**.
5. Abra o arquivo [GoogleAppsScript_Bridge.js](file:///c:/Users/Acer/Documents/Projetos%20Antigravity/SISGER%20DBM1-GOA/GoogleAppsScript_Bridge.js) deste projeto, copie todo o conteúdo e cole no editor do Google.
6. Clique no botão azul **"Implantar"** (canto superior direito) > selecione **"Nova implantação"**.
7. Clique na engrenagem (*Selecione o tipo*) e escolha **"App da Web"**.
8. Preencha os campos:
   - **Descrição:** `SISGER API Produção`
   - **Executar como:** `Eu (dbmlagoa@gmail.com)`
   - **Quem tem acesso:** `Qualquer pessoa` (necessário para que o portal consiga ler as configurações sem pedir login toda hora).
9. Clique em **"Implantar"** e confirme a autorização de acesso ao Drive da conta.
10. Copie a **URL do app da Web** gerada (começa com `https://script.google.com/macros/s/.../exec`).
11. Abra o portal do SISGER, clique em **⚙️ Painel de Gestão**, cole essa URL no campo *"URL do Google Apps Script"* e clique em **Salvar**.

> [!TIP]
> A partir desse momento, tudo o que for editado no portal será salvo na nuvem diretamente dentro de uma pasta chamada **`[SISGER GOA] - Sistema de Gestão`** no Google Drive da conta `dbmlagoa@gmail.com`!

---

## 5. Como Executar e Hospedar o Portal

### Opção 1: Uso Local Imediato (No computador da Sala de Operações/TV)
Basta abrir o arquivo [index.html](file:///c:/Users/Acer/Documents/Projetos%20Antigravity/SISGER%20DBM1-GOA/index.html) diretamente no Google Chrome ou Microsoft Edge.

Se desejar rodar via servidor local (recomendado para a TV):
```powershell
# Abra o terminal na pasta do projeto e execute:
python -m http.server 8080
# Depois acesse no navegador: http://localhost:8080
```

### Opção 2: Hospedagem Gratuita na Nuvem (Para acesso por qualquer militar via internet)
Você pode subir esta pasta completa do projeto para o **GitHub Pages**, **Vercel** ou **Firebase Hosting** com custo zero e disponibilidade 24/7 permanente. Todas as conexões já apontam para os servidores oficiais do Google e funcionarão perfeitamente.
