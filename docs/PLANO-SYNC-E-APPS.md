# Plano: sincronização entre aparelhos e apps instaláveis

Este é um plano curto e ainda não foi implementado. Ele parte do app como está hoje: um PWA estático no GitHub Pages, que guarda todo o progresso num único objeto `S` no `localStorage` (chave `simuladoOAB.v2`).

## 1. Sincronização com Supabase

**Problema.** A sincronização atual (`window.claude.use("db")`) só funciona com o app aberto dentro do claude.ai. No GitHub Pages, no celular ou no computador, cada aparelho guarda o próprio progresso.

**Proposta.** Usar o Supabase, que tem plano gratuito, login pronto e Postgres com regras de acesso por usuário.

1. **Login.** Usar link mágico por e-mail e o botão "Entrar com Google". Não há senha para esquecer. O app continua funcionando sem login, como hoje.
2. **Tabela.** Criar uma tabela `progresso`, com:
   - `user_id uuid primary key references auth.users`;
   - `dados jsonb`, que guarda o próprio `S`;
   - `atualizado bigint`.

   Uma linha por aluno. RLS: cada usuário só lê e escreve a própria linha (`auth.uid() = user_id`).
3. **Regra de fusão.**
   - **Hoje:** vence o `atualizado` mais recente, a mesma regra de `conectar()`.
   - **Melhoria simples:** fundir campo a campo.
     - `stats`, `cards` e `qrev`: para cada questão ou cartão, fica o registro com mais respostas ou com a data mais nova.
     - `dias`: soma por dia, sem duplicar.
     - `hist`: une por `id`.
     - `cfg`: vence o mais recente.

     Assim ninguém perde progresso ao estudar em dois aparelhos sem internet.
4. **Quando gravar.**
   - Logo depois de `salvar()`, com espera de 3 segundos para agrupar várias respostas.
   - Ao fechar a aba (`visibilitychange`).
   - Offline, marca como pendente e envia quando a conexão voltar.
5. **Código.**
   - Trocar o bloco `conectar()`/`gravarDb()` por um adaptador com a mesma interface (`ler()`, `gravar(S)`).
   - O cliente `@supabase/supabase-js` entra por CDN com versão fixa.
   - A chave pública (anon) pode ficar no código; a proteção vem do RLS.
6. **Tela.** Em Configurações, criar a seção "Sua conta", com o e-mail conectado, a última sincronização e o botão "Sair".

Estimativa: 1 a 2 dias de trabalho, mais os testes em dois aparelhos.

## 2. Apps instaláveis

O app já é um PWA (manifesto e service worker com cache offline). Os dois empacotadores reaproveitam a mesma pasta, sem reescrever nada.

### Celular (Android e iOS): Capacitor

1. Criar `package.json` e rodar `npx cap init "Facul Lab" br.com.facullab`, com `webDir` apontando para uma pasta `www/` montada a partir dos arquivos atuais. Um script simples de cópia basta, porque não há build.
2. Rodar `npx cap add android` e `npx cap add ios`. Os ícones saem de `icon-512.png` com `@capacitor/assets`.
3. Plugins úteis:
   - `@capacitor/local-notifications`, para o lembrete diário de estudo e para avisar quando a ofensiva estiver para apagar;
   - `@capacitor/haptics`, para vibrar ao acertar ou errar;
   - `@capacitor/status-bar`.
4. Publicação:
   - **Android:** Play Store, com conta de desenvolvedor de US$ 25, paga uma vez.
   - **iOS:** precisa de Mac com Xcode e de conta Apple de US$ 99 por ano.
5. Dentro do app, o service worker não é necessário, porque os arquivos já vêm no pacote. Basta não registrá-lo quando `window.Capacitor` existir.

### Computador (Windows, macOS e Linux): Tauri

1. Usar Tauri 2 (`npm create tauri-app`), com `frontendDist` apontando para a mesma pasta `www/`. Gera instaladores pequenos (cerca de 10 MB), contra mais de 100 MB do Electron.
2. Janela mínima de 380 × 640, que já funciona com o layout atual de celular e de computador.
3. Builds para os três sistemas pelo GitHub Actions (`tauri-action`), sem precisar de cada máquina.
4. Alternativa sem instalador: o próprio PWA já pode ser instalado pelo Chrome e pelo Edge ("Instalar app").

## Ordem sugerida

1. Supabase primeiro: é o que resolve o progresso entre aparelhos e vale também para os apps.
2. Android com Capacitor, porque é o mais barato e rápido de publicar.
3. Tauri para o computador.
4. iOS por último, por causa do custo e da exigência de Mac.
