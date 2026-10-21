# Facul Lab

App de estudo para Direito: simulados por período (1º ao 10º) e para o Exame da OAB, apostilas, resumos, lei seca e flashcards.

É um PWA em HTML, CSS e JavaScript puro, sem etapa de build. Para rodar localmente, sirva a pasta com qualquer servidor estático, por exemplo:

```
python3 -m http.server 8000
```

Ao atualizar conteúdo, troque `CACHE_NAME` em `sw.js` para que os aparelhos baixem a versão nova.
