# SISGER DBM1 / GOA - CBMERJ
> **Sistema de Gestão do 1º Destacamento de Bombeiro Militar / Grupamento de Operações Aéreas**  
> Corpo de Bombeiros Militar do Estado do Rio de Janeiro

---

## 📌 Visão Geral
O **SISGER DBM1/GOA** é o portal operacional e mural de prontidão do Grupamento de Operações Aéreas (GOA), projetado para:
- **Mural & Início:** Acompanhamento da rotina diária em tempo real, mural rotativo de notícias e comunicados, e status de prontidão das aeronaves.
- **Modo TV Vertical (Totem Kiosk):** Exibição contínua para televisores verticais no salão de prontidão com vídeo de segurança em loop contínuo, rotina da escala do dia e 4 QR Codes rápidos para as tripulações.
- **Check List de Material de Pronto Emprego:** Verificação em tempo real integrada com a planilha oficial do Google Drive.
- **Briefing Matinal:** Consulta meteorológica integrada (REDEMET, Windy) e NOTAMs para SBJR e operações de helicópteros no RJ.
- **Controle DMOP (SIG-MAT) e Aeromédico:** Painéis operacionais da unidade.
- **Formulário de Manutenção / Obras:** Registro rápido de reparos prediais com envio opcional de fotos direto para a pasta *Obras* no Drive da unidade (`dbmlagoa@gmail.com`).

---

## 🚀 Como Hospedar no GitHub Pages (100% Gratuito)

1. Crie um repositório no GitHub (ex: `sisger-goa`) e envie estes arquivos.
2. Acesse as configurações do repositório: **Settings** > **Pages**.
3. Na seção **Build and deployment**:
   - **Source:** `Deploy from a branch`
   - **Branch:** `main` (ou `master`) / pasta `/ (root)`
4. Clique em **Save**.
5. Em cerca de 1 a 2 minutos, o portal estará no ar em:
   `https://<seu-usuario>.github.io/sisger-goa/`

---

## ☁️ Conexão com Google Drive & Planilhas (dbmlagoa@gmail.com)

O backend do portal utiliza o **Google Apps Script** como ponte segura e serverless:
- O código da ponte está no arquivo [`GoogleAppsScript_Bridge.js`](GoogleAppsScript_Bridge.js).
- Ele é implantado como **App da Web** na conta `dbmlagoa@gmail.com`.
- Para configurar ou atualizar o URL da API, edite o arquivo [`js/config.js`](js/config.js).

---

## 💻 Execução Local (Opcional)

Para rodar localmente no computador:
```bash
python server.py 8080
```
Acesse no navegador: `http://localhost:8080` (ou adicione `?tv=1` para entrar direto no modo TV).
