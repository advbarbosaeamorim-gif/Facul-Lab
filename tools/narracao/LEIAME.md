# Narração dos temas (voz de professora e professor)

O "Ouvir este tema" toca a narração gravada quando ela existe e confere com o texto atual; senão usa a voz do celular.

- `audio/indice.json`: quais temas têm áudio e em quais vozes (`f` professora, `m` professor).
- `audio/<voz>/<matéria>-<tema>.mp3` + `.json` (`h` = impressão dos trechos, `t` = início de cada trecho em segundos,
  `v` = versão do áudio; o app pede o MP3 com `?v=` para não tocar uma gravação antiga guardada no aparelho;
  `r` = receita da gravação, que o `gravar.py` usa para saber se o tema já está pronto).
  Se o texto do tema mudar, a impressão deixa de bater e o app volta à voz do celular até gravar de novo.

## A aula falada

A voz não lê a apostila: ela explica, do jeito de quem dá aula. A fala de cada tema fica em
`tools/narracao/aulas/<matéria>-<tema>.txt`, uma linha por trecho da apostila (`n| fala`), na mesma ordem,
para o destaque do texto acompanhar a voz.

Regras do roteiro (o `conferir.py` barra o que fugir delas):

- o conteúdo é o da apostila: a fala muda o jeito de dizer, nunca a matéria;
- todo número, artigo, parágrafo, inciso, fração, data, valor e sigla do trecho aparece na fala, escrito do mesmo jeito
  ("art. 59", "1/6", "§1º", "Lei 7.210/1984"; a sigla pode vir por extenso);
- número que não está no trecho só entra se existir em outro lugar do tema; contagens novas vão por extenso ("três fases");
- sem aspas e sem palavras em maiúsculas (viram sigla soletrada); letra solta vai pelo nome ("alínea cê");
- os quadros, tabelas e ilustrações que o leitor pula vêm no campo `x` do trecho anterior: a fala desse trecho
  explica o que está neles.

`fala.py` transforma a escrita em fala (art. → artigo, § → parágrafo, números, frações, datas, valores, siglas).
Sem roteiro, o tema é lido como está na apostila.

## Gravar

Motor OmniVoice (`pip install omnivoice num2words` + torch; com GPU é dezenas de vezes mais rápido que em CPU).

1. `python3 -m http.server 8765` na raiz e `node tools/narracao/trechos.mjs pen2 > trechos.json`
   (abre o app e pega os mesmos trechos que o leitor lê).
2. `python tools/narracao/conferir.py trechos.json --carimba`
   (confere os roteiros e grava neles a impressão do texto conferido).
3. `python tools/narracao/gravar.py trechos.json f [pen2:1 ...]` (professor: `m`).
   As vozes de referência e os textos delas estão em `vozes.json`. Cada pedaço gravado fica guardado na pasta
   `NARR_CACHE` (padrão `./cache`), então dá para parar e retomar.

4. `python tools/narracao/ouvir.py trechos.json f [pen2:1 ...]` ouve cada pedaço gravado (whisper, `pip install
   faster-whisper librosa`) e mostra só onde o que se ouve difere do roteiro, números incluídos. A lista sai curta:
   leia e separe o engano do reconhecedor (latim, palavra rara, palavras emendadas) do defeito de verdade (palavra
   que sumiu ou saiu embolada). Para o defeito: `python tools/narracao/ouvir.py trechos.json f --regrava <hash>` e
   depois `NARR_REFAZ=1 python tools/narracao/gravar.py trechos.json f <tema>` para montar o tema de novo.

Ritmo: 0,3 s entre frases, 0,55 s entre trechos, 0,7 s antes de um título, e nenhuma pausa no meio da fala passa
de 0,45 s. Volume igual em todos os temas, MP3 mono de 64 kbps.

O modelo OmniVoice tem licença CC-BY-NC: uso não comercial.
