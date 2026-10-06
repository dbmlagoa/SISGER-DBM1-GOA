# Manual de Gestão & Edição do SISGER DBM 1 / GOA

**Unidade:** 1º Destacamento de Bombeiro Militar / Grupamento de Operações Aéreas (CBMERJ)  
**Conta Institucional:** `dbmlagoa@gmail.com`  
**Pasta Oficial no Google Drive:** `SisGer DBM 1/GOA`  
**Versão do Sistema:** 4.2.0 • SPA Aero-Tática Oficial  
**Data de Emissão:** Outubro de 2026  

---

## 🔐 1. Credenciais de Acesso Administrativo

Para acessar o **Painel de Gestão & Edição Fácil** do portal:

- **Endereço do Portal:** [https://dbmlagoa.github.io/SISGER-DBM1-GOA/](https://dbmlagoa.github.io/SISGER-DBM1-GOA/) (ou no servidor local da unidade)
- **Local de Acesso:** Clique no ícone de engrenagem **⚙️** no canto superior direito do menu.
- **Login / Usuário:** `dbmlagoa`
- **Senha de Acesso:** `salvamento193`

> [!IMPORTANT]
> Estas credenciais são restritas aos oficiais e militares encarregados da gestão, escalas e comunicações do DBM 1/GOA. Não repassar a pessoal não autorizado.

---

## 📺 2. Modo TV Vertical (Mural 24 Horas de Prontidão)

A página de exibição na TV vertical opera nos totens e monitores em modo retrato (vertical) no corpo da guarda e sala de prontidão.

### Como Iniciar a TV Vertical:
1. Abra o navegador da TV ou do computador conectado à tela vertical.
2. Acesse a URL do portal adicionando `#tv` no final: `https://dbmlagoa.github.io/SISGER-DBM1-GOA/#tv` (ou clique no botão **"Exibição TV (Mural 24h)"** no menu superior).
3. Pressione a tecla **F11** do teclado (ou o botão de tela cheia no topo) para remover barras do navegador.

### Elementos da TV Vertical:
1. **Cabeçalho:** Relógio digital de alta precisão em tempo real, data operacional e o card de status do **Checklist Pronto Emprego** (*Verde: Realizado Hoje* / *Amarelo: Pendente*).
2. **Container Superior de Notícias:** Banner ampliado com rotação automática a cada 8 segundos, exibindo categoria com ponto pulsante, título em destaque, subtítulo em tom ouro/âmbar, resumo de texto e **imagem real da matéria mostrada no momento**, com barra de progresso contínua.
3. **Linha Central (Vídeo Oficial):** Reprodução nativa do vídeo oficial de **Recomendações de Segurança** (`assets/video_recomendacoes_goa.mp4`) em loop contínuo e silencioso, centralizado verticalmente na tela.
4. **Rotina Diária Oficial:** Exibe **apenas o card da atividade correspondente ao momento atual** (identificado automaticamente pelos horários da escala diária).
5. **Rodapé de QR Codes Rápidos:** 4 QR codes em tamanho ampliado (88px) posicionados logo abaixo da rotina diária para leitura fácil por smartphones à distância:
   - **QR 1:** *Checklist Pronto Emprego* (Conferência obrigatória pós-briefing).
   - **QR 2:** *Experiência Operacional* (Horas de voo, missões e ocorrências da tripulação).
   - **QR 3:** *Cautela de EPIs* (Short John, Long John, botas e luvas de neoprene).
   - **QR 4:** *Manutenção / Obras* (Solicitação de reparos prediais e necessidades da rotina).

---

## ⚙️ 3. Como Realizar Edições pelo Painel de Gestão

Ao clicar na engrenagem **⚙️** e inserir o login (`dbmlagoa`) e senha (`salvamento193`), o painel é aberto com 5 abas organizadas:

### Aba 1: 📺 Exibição TV Vertical
- **Vídeo Oficial de Recomendações:**
  - O sistema já carrega o vídeo padrão otimizado de 48.8 MB em loop contínuo.
  - Se a unidade desejar trocar o vídeo futuramente por um novo arquivo ou link do Google Drive/YouTube, basta colar o ID ou link no campo correspondente e clicar em Salvar.
- **Avisos do Carrossel da TV:**
  - Permite adicionar, editar o texto, subtítulo, link de foto e categoria de cada aviso que roda no topo da TV vertical.

### Aba 2: 🕒 Rotina Diária Oficial
- **Formato dos Horários:** Utilize `HH:MM - HH:MM` (ex: `06:20 - 07:00`) ou horário simples `07:00`.
- O sistema calcula automaticamente:
  - Quando a hora atual estiver dentro do intervalo, a atividade ganha badge vermelho pulsante **"ATIVIDADE DA HORA ATUAL"** e aparece na TV vertical.
  - Atividades passadas saem automaticamente da tela para não poluir a visão operacional.
  - Se todas as atividades do dia forem concluídas (ex: após as 19h), a TV assume automaticamente o status **"Sobreaviso Noturno 24h"**.
- É possível adicionar novos horários, alterar descrições ou restaurar a grade oficial do DBM 1/GOA com 1 clique.

### Aba 3: 📱 Formulários & QR Codes da TV
- Permite alterar os 4 links dos formulários do Google Forms / SISGER:
  1. *Link do Checklist de Pronto Emprego*
  2. *Link da Experiência Operacional (Horas de Voo)*
  3. *Link da Cautela de EPIs de Neoprene*
  4. *Link da Solicitação de Manutenção / Obras*
- **Importante:** Ao alterar qualquer um dos links e salvar, o QR code correspondente na TV vertical e na página inicial é regerado e atualizado na hora!
- **Link da Planilha CSV do Checklist:** Link da planilha publicada na web que permite ao portal conferir se o checklist do dia já foi preenchido.

### Aba 4: ☁️ Google Drive & Nuvem (`dbmlagoa@gmail.com`)
- Exibe o status da comunicação com a conta Google institucional da unidade.
- **URL do Google Apps Script:** Endpoint da ponte com o Drive.
- **Botão "Salvar Manual na Pasta SisGer DBM 1/GOA":** Envia e salva este manual diretamente na pasta oficial do Google Drive da conta `dbmlagoa@gmail.com`.

### Aba 5: 💾 Backup & Manual
- **📥 Baixar Backup (.json):** Gera um arquivo contendo todas as configurações atuais do portal (notícias, horários, links). Guarde este arquivo em caso de troca de computador.
- **📤 Restaurar Backup:** Carrega um arquivo `.json` salvo anteriormente para restabelecer tudo em 2 segundos.
- **📥 Baixar Manual (.md):** Baixa este manual completo para consulta offline.

---

## ✍️ 4. Como Publicar Notícias com Escolha de Layout (1 ou 2 Fotos)

1. Você pode iniciar a publicação de duas maneiras:
   - Na barra lateral esquerda do portal, clique em **"Notícias"** e depois no botão **"✍️ Nova Postagem (Gestor)"**.
   - OU clique no ícone de engrenagem ⚙️ (Painel de Gestão), faça login e vá na aba **"📰 Notícias & Publicações"** ➔ clique em **"✍️ Abrir Formulário de Nova Notícia"**.
2. **Escolha o Layout de Imagens desejado:**
   - **🖼️ 1 Foto (Destaque Principal):** Banner panorâmico em largura total com campo de legenda individual.
   - **🖼️🖼️ 2 Fotos (Lado a Lado):** Grid moderno de 2 fotos lado a lado comparativas, cada uma com seu botão de anexo/URL e legenda individual.
3. Preencha os campos da matéria:
   - **Título da Notícia:** Ex: *Aquisição de Novos Equipamentos de Salvamento*.
   - **Data da Publicação:** Preenchida automaticamente com a data atual.
   - **Subtítulo / Categoria:** Ex: *Material Operacional • DMOP / Instrução Especializada*.
   - **Texto da Notícia:** Descrição detalhada do informe com quebras de linha automáticas.
   - **Fotos (Foto 1 e Foto 2 se selecionado 2 Fotos):**
     * Clique em **"📁 Anexar Arquivo"** para selecionar fotos do seu computador (o sistema comprime e otimiza automaticamente para máxima velocidade e sem sobrecarregar a memória) **OU** cole uma URL de imagem.
     * Insira a legenda descritiva de cada foto no campo correspondente (opcional).
     * O preview da imagem aparece na hora com botão para remover se desejar trocar.
4. Clique no botão **"📢 Publicar Notícia no Portal"**.
5. **Veiculação Instantânea:**
   - A notícia é publicada no topo da página de **Notícias** com o layout escolhido e selo identificador.
   - Entra automaticamente no **Mural de Avisos da Tela Inicial** com thumbnail e link de leitura completa.
   - Entra automaticamente na rotação de matérias no topo da **TV Vertical (Mural 24h)**.
   - Fica listada no **Painel de Gestão (Aba Notícias & Publicações)** para acompanhamento e exclusão quando necessário.

---

## ☁️ 5. Conexão com o Google Drive (`dbmlagoa@gmail.com`)

O SISGER utiliza um script do **Google Apps Script** para se comunicar de forma 100% autônoma com o Google Drive da conta `dbmlagoa@gmail.com`.

### Estrutura da Pasta no Google Drive:
- Pasta Raiz: **`SisGer DBM 1/GOA`**
  - Subpasta: `Obras` (recebe as fotos e registros do formulário de manutenção predial).
  - Arquivo: `config_portal_sisger.json` (backup em nuvem das configurações do portal).
  - Arquivo: `MANUAL_DE_GESTAO_E_EDICAO_SISGER.md` (cópia deste manual).

### Como Reativar ou Atualizar a Ponte Apps Script (se necessário):
1. Entre na conta Google: **`dbmlagoa@gmail.com`**.
2. Acesse: [https://script.google.com/](https://script.google.com/).
3. Abra o projeto **"SISGER GOA - Ponte Drive API"** (ou crie um novo caso não exista).
4. Cole o código presente no arquivo `GoogleAppsScript_Bridge.js` do projeto.
5. Clique em **Implantar > Nova Implantação**:
   - Tipo: **App da Web**
   - Executar como: **Eu (`dbmlagoa@gmail.com`)**
   - Quem tem acesso: **Qualquer pessoa**
6. Copie a URL gerada (terminada em `/exec`) e cole na **Aba 4 (Google Drive)** do Painel de Gestão do portal.

---

## 📞 6. Suporte & Contatos da Unidade

- **Unidade:** 1º DBM / GOA - CBMERJ  
- **Telefone da Sala de Operações:** (21) 98596-9351  
- **E-mail Institucional:** `dbmlagoa@gmail.com`  
- **Endereço do Repositório Git:** [https://github.com/dbmlagoa/SISGER-DBM1-GOA](https://github.com/dbmlagoa/SISGER-DBM1-GOA)  

---
*Documento homologado para uso administrativo e operacional do DBM 1/GOA.*
