# Facul Lab

App de estudo para Direito: simulados por período (1º ao 10º) e para o Exame da OAB, apostilas, resumos, lei seca e flashcards.

No ar: https://facul-lab.netlify.app (oficial, com lembretes) e https://advbarbosaeamorim-gif.github.io/Facul-Lab/.

**Publicar no Netlify:** merges na main não publicam sozinhos (economia de créditos). Só publica quando a mensagem do commit ou o título do PR tiver `[publicar]`.

É um PWA em HTML, CSS e JavaScript puro, sem etapa de build. Para rodar localmente, sirva a pasta com qualquer servidor estático, por exemplo:

```
python3 -m http.server 8000
```

Os arquivos do app são buscados na rede primeiro pelo `sw.js` (cache só offline), então atualizações de conteúdo chegam sozinhas. **Não troque `CACHE_NAME` nos PRs**: só quando a lista `CORE` mudar, e depois de mergear na main.
