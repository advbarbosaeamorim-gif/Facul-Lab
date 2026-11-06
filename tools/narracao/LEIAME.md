# Narração dos temas (voz de professora e professor)

O "Ouvir este tema" toca a narração gravada quando ela existe e confere com o texto atual; senão usa a voz do celular.

- `audio/indice.json`: quais temas têm áudio e em quais vozes (`f` professora, `m` professor).
- `audio/<voz>/<matéria>-<tema>.mp3` + `.json` (`h` = impressão dos trechos lidos, `t` = início de cada trecho em segundos).
  Se o texto do tema mudar, a impressão deixa de bater e o app volta à voz do celular até gravar de novo.

Gravar (motor OmniVoice, `pip install omnivoice num2words` + torch; com GPU é ~40x mais rápido que em CPU):

1. `python3 -m http.server 8765` na raiz e `node tools/narracao/trechos.mjs pen2 > trechos.json`
   (abre o app e pega os mesmos trechos que o leitor lê).
2. `python tools/narracao/gravar.py trechos.json f tools/narracao/ref-professora.wav "Olá, pessoal! Hoje a gente vai entender, com calma, o que é reincidência no Direito Penal. Prestem atenção, porque isso cai muito na prova." [pen2:1 ...]`

`fala.py` só troca abreviações por extenso (art. → artigo, § → parágrafo, números, siglas); o conteúdo é o da apostila.
O modelo OmniVoice tem licença CC-BY-NC: uso não comercial.
