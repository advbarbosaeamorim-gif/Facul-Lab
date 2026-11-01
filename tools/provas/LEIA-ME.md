# Provas anteriores da OAB

As provas reais da 1ª fase da FGV que aparecem na tela **Provas anteriores da OAB** (`js/23-provas.js`).
Cada prova fica em `provas/oab-<n>.js` (as 80 questões, na ordem do caderno Tipo 1) e a lista em `provas/indice.js`.
Os arquivos são gerados por `gerar.py` a partir dos PDFs oficiais: ninguém digita questão à mão.

- **Enunciado e alternativas:** caderno Tipo 1.
- **Resposta certa:** gabarito definitivo (depois dos recursos).
- **Anuladas:** o definitivo marca com `*`; o app dá o ponto para todos e mostra a letra do gabarito preliminar.
- **Matérias:** a tabela de correspondência dos quatro tipos de caderno confirma a divisão (a mesma `DIST` do app).
  Por isso a lista começa no 38º Exame: as provas anteriores têm outra divisão de matérias.

## Pôr uma prova nova (ex.: 48º Exame)

1. Espere o **gabarito definitivo** sair (vem depois dos recursos).
2. Em `fontes.json`, copie o bloco de uma prova e troque os links pelos da página da prova em `https://oab.fgv.br`
   (caderno Tipo 1, gabarito definitivo e gabarito preliminar).
3. Rode:

   ```
   pip install pdfplumber
   python3 -I tools/provas/gerar.py 48
   ```

   O gerador para com erro se algo não bater: 80 questões numeradas, 4 alternativas cada, gabarito com 80 respostas,
   divisão das matérias, data da prova e nenhuma letra que a fonte do PDF não deixe ler.
4. Rode o robô de testes (`node tools/teste/telas.mjs`) e confira a prova nova no app.
5. Faça o commit de `provas/oab-48.js` e `provas/indice.js`. Não precisa mexer em `sw.js`: cada prova é guardada
   no celular na primeira vez que abre e depois funciona sem internet.

Os PDFs ficam em `/tmp/facul-lab-provas` (ou na pasta de `--pdfs`) e não vão para o repositório.
