/* Acha citações de artigos de lei num texto: "art. 112 da LEP", "arts. 33 e 35 da Lei 11.343/2006",
   "art. 5º, XI, da CF", "(art. 59)" quando a lei está clara pelo contexto.
   Usado no app (js/21-artigos.js) e no gerador dos textos (tools/leis/gerar.mjs), para os dois acharem igual.
   Não mexe em nada: só devolve onde está cada citação e de qual lei ela é. */
(function (raiz) {
  "use strict";
  const N = "(\\d{1,2}(?:\\.\\d{3})+|\\d{1,4})";                     // 5, 121, 1.035
  const ORD = "(?:\\s*(?:º|°|ª|o(?![a-zà-úA-Z])))?";                    // 5º, 5°, 5o
  const SUF = "(?:\\s*-\\s*([A-Z]{1,3})(?![a-zà-ú]))?";                  // 1º-A, 241-E
  const ROM = "[IVXLC]{1,8}(?![\\wÀ-ú])(?:-[A-Z](?![\\wÀ-ú]))?";              // III, LXVIII, I-B
  const ANO_VELHO = "(?!\\s*(?:\\/\\s*|de\\s+)(?:1[0-8]\\d\\d|19[0-7]\\d|[0-7]\\d(?!\\d)))";
  // "Art. 7.5 da Convenção Americana" (numeração de tratado) não é artigo de lei brasileira
  const CABECA = new RegExp("(?<![\\wÀ-ú])(Arts?\\.|arts?\\.|ARTS?\\.|Artigos?|artigos?)\\s*" + N + "(?!\\.\\d)" + ORD + SUF, "g");
  // partes depois do número: incisos, parágrafos, alíneas, itens e mais artigos ("arts. 33 e 35");
  // a última alternativa é a alínea solta ("art. 150, VI, c, da CF"), que só vale logo depois de inciso ou alínea
  const PARTE = new RegExp("(?:\\s*,\\s*|\\s+)(?:(e|ou|a|até|c\\/c)\\s+)?(?:(caput)(?![\\wÀ-ú])|(§§?)\\s*(\\d{1,3})" + ORD + "(?:-([A-Z]))?|(par[áa]grafo\\s+[úu]nico)|(?:incisos?|incs?\\.)\\s*(" + ROM + ")|(" + ROM + ")|al[íi]neas?\\s*[\"“'‘]?([a-z])[\"”'’]?(?![\\wÀ-ú])|[\"“'‘]([a-z])[\"”'’](?![\\wÀ-ú])|([a-z])\\)(?=[\\s,;.:])|itens?\\s+(\\d{1,2})|" + N + ORD + SUF + "|([a-z])(?=\\s*[,;.)]|\\s*$|\\s+(?:e|ou)\\s+[a-z](?![\\wÀ-ú])))", "y");
  const DE = "(?:\\s*,)?\\s+(?:d[oa]s?|n[oa]s?|pel[oa]s?|à|ao)\\s+";
  const SEGUINTES = /(?:\s*,)?\s+e\s+(?:seguintes|ss\.?)(?![\wÀ-ú])/y;          // "arts. 1.694 e seguintes do CC"
  const NUMERADA = "(Lei\\s+Complementar|LC|Lei|Decreto-[Ll]ei|DL|Decreto|EC|Emenda\\s+Constitucional)(?:\\s+n[º°.]?|\\s+nº)?\\s*" + N + "(?:\\s*\\/\\s*(\\d{4}|\\d{2})(?!\\d)|,?\\s+de\\s+\\d{1,2}º?\\s+de\\s+[a-zç]+\\s+de\\s+(\\d{4}))?";
  // fontes que não estão no app: depois delas, um "art. N" solto não é da lei do contexto
  const OUTRA = "(?:Convenção|Pacto|Carta(?:\\s+(?:da|das)\\s+[A-ZÀ-Ú][\\wÀ-ú]*)|Declaração|Tratado|Protocolo|Estatuto\\s+de\\s+Roma|Estatuto\\s+da\\s+Corte|Resolução|Provimento|Regimento|Instrução\\s+Normativa|Portaria|Medida\\s+Provisória|Código\\s+Comercial|Código\\s+Civil\\s+de\\s+1916|Código\\s+de\\s+Processo\\s+Civil\\s+de\\s+1973|CPC\\s*\\/\\s*(?:19)?73|Constituição\\s+(?:de\\s+(?:18|19[0-7])\\d\\d|do\\s+Império|[Ee]stadual|do\\s+Estado|dos\\s+Estados|de\\s+Weimar|mexicana|alemã|portuguesa|norte-americana|americana))(?![\\wÀ-ú])";
  const TIPOS = { "lei": "lei", "lei complementar": "lei.complementar", "lc": "lei.complementar", "decreto-lei": "decreto.lei", "dl": "decreto.lei", "decreto": "decreto", "ec": "emenda.constitucional", "emenda constitucional": "emenda.constitucional" };
  const esc = s => s.replace(/[.*+?^${}()|[\]\\\/]/g, "\\$&");
  let PREP = null;
  function preparar(idx) {
    if (PREP && PREP.idx === idx) return PREP;
    const ap = [], so = [];
    for (const id in idx) {
      const L = idx[id];
      (L.al || []).forEach(a => ap.push([a, id]));
      (L.c || []).forEach(a => so.push([a, id]));
    }
    const ord = l => l.sort((a, b) => b[0].length - a[0].length);
    ord(ap); ord(so);
    const mapa = {}; ap.concat(so).forEach(([a, id]) => mapa[a] = id);
    const alt = l => l.map(([a]) => esc(a).replace(/\s+/g, "\\s+")).join("|");
    const fimAp = "(?![\\wÀ-ú])" + ANO_VELHO + "(?!\\s+(?:[Ee]stadual|do\\s+Estado|dos\\s+Estados|do\\s+Império)(?![\\wÀ-ú]))";
    const AP = ap.length ? "(" + alt(ap) + ")" + fimAp : "(?!)";
    const SO = so.length ? "(" + alt(so) + ")" + fimAp : "(?!)";
    // designação logo depois da citação: lei conhecida, lei numerada, "desta Lei"/"do mesmo Código", ou outra fonte
    const DESIG = new RegExp(DE + "(?:" + AP + "|" + SO + "|" + NUMERADA + "|(mesm[oa]\\s+(?:lei|Lei|código|Código|diploma|estatuto|Estatuto)|referid[oa]\\s+(?:lei|Lei|código|Código))|" + OUTRA + "|(Lei|Código|Estatuto|Constituição|Regulamento)(?![\\wÀ-ú])(?!\\s+(?:n[º°.]|\\d))|([A-ZÀ-Ú][\\wÀ-ú]+))" + "|(?:\\s*,)?\\s+(dest[ae]\\s+(?:[Ll]ei|[Cc]ódigo|Constituição|[Ee]statuto|[Rr]egulamento))", "y");
    // designação só com vírgula, sem "do/da": "(art. 105, III, CF)", "(art. 15-A, Lei 14.321/2022)"
    const DESIG2 = new RegExp("\\s*,\\s*(?:" + AP + "|" + SO + "|" + NUMERADA + ")(?=\\s*[);.,]|\\s*$)", "y");
    // menções soltas a leis (mudam o contexto do bloco)
    const MENCAO = new RegExp("(?<![\\wÀ-ú])(?:" + AP + "|" + NUMERADA + "|(" + OUTRA + "))", "g");
    PREP = { idx, mapa, DESIG, DESIG2, MENCAO, porNum: indicePorNumero(idx) };
    return PREP;
  }
  function indicePorNumero(idx) {
    const m = {};
    for (const id in idx) { const L = idx[id]; if (L.tp && L.nu) (m[L.tp + ":" + L.nu] = m[L.tp + ":" + L.nu] || []).push(id) }
    return m;
  }
  function numerada(P, tipo, num, ano2, ano4) {
    const tp = TIPOS[tipo.toLowerCase().replace(/\s+/g, " ")] || "";
    const nu = String(num).replace(/\./g, "");
    const l = P.porNum[tp + ":" + nu];
    if (!l) return null;
    let ano = ano4 || ano2 || "";
    if (ano.length === 2) ano = (+ano > 30 ? "19" : "20") + ano;
    const c = l.filter(id => !ano || (P.idx[id].an || "") === ano);
    return c.length ? c[0] : null;
  }
  const ROMV = { I: 1, V: 5, X: 10, L: 50, C: 100 };
  function romano(r) { let n = 0; for (let i = 0; i < r.length; i++) { const v = ROMV[r[i]], w = ROMV[r[i + 1]] || 0; n += v < w ? -v : v } return n }
  function arabe(n) { const T = [[100, "C"], [90, "XC"], [50, "L"], [40, "XL"], [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"]]; let r = ""; for (const [v, s] of T) while (n >= v) { r += s; n -= v } return r }
  const chave = (n, suf) => String(n).replace(/\./g, "") + (suf ? "-" + suf : "");
  /* varrer(texto, idx, contexto): devolve as citações e as menções, em ordem.
     contexto: lei que vale para "art. N" sem lei (do bloco anterior ou da matéria); null = nenhuma.
     Cada citação: {i, j, arts:[{n:"112", p:[["inc","V"],["par","2"]]}], lei:"lep"|null, como:"explicita"|"contexto"|"outra"}
     ("art. 28 da mesma lei" vira explícita, com a última lei escrita ou mencionada no texto)
     (bloq: o texto falou antes de uma fonte que o app não tem, como uma convenção; aí o "art. N" solto não é ligado) */
  function varrer(texto, idx, contexto) {
    const P = preparar(idx);
    const ev = [];
    let m;
    P.MENCAO.lastIndex = 0;
    while ((m = P.MENCAO.exec(texto))) {
      let lei = null, outra = false;
      if (m[1]) lei = P.mapa[m[1].replace(/\s+/g, " ")] || null;
      else if (m[2]) { lei = numerada(P, m[2], m[3], m[4], m[5]); outra = !lei }
      else outra = true;
      ev.push({ t: "mencao", i: m.index, j: m.index + m[0].length, lei, outra });
    }
    CABECA.lastIndex = 0;
    const cits = [];
    while ((m = CABECA.exec(texto))) {
      const plural = /^(arts\.|artigos)$/i.test(m[1]);
      const arts = [{ n: chave(m[2], m[3]), p: [] }];
      let pos = m.index + m[0].length, ult = pos;
      let a = arts[0], tipo = null, emPar = false;
      // a.p: lista de alvos dentro do artigo; cada alvo é um caminho, ex.: [["par","2"],["inc","I"]] = §2º, I
      const ultimo = () => a.p[a.p.length - 1] || [];
      const ate = (caminho, t) => { const i = caminho.map(x => x[0]).lastIndexOf(t); return i < 0 ? caminho.slice() : caminho.slice(0, i) };
      const faixa = (t, de, para, base, conv) => {
        const x = conv(de), y = conv(para);
        if (!(x > 0 && y > x && y - x <= 12)) return false;
        for (let k = x + 1; k <= y; k++) a.p.push(base.concat([[t, conv === romano ? arabe(k) : String(k)]]));
        return true;
      };
      for (;;) {
        PARTE.lastIndex = pos;
        const t = PARTE.exec(texto);
        if (!t) break;
        const con = t[1] || "", seq = con === "a" || con === "até";
        if (t[15]) {                                        // alínea solta: só depois de inciso ou de outra alínea
          if (tipo !== "inc" && tipo !== "ali") break;
          a.p.push((tipo === "inc" && !con ? ultimo() : ate(ultimo(), "ali")).concat([["ali", t[15]]])); tipo = "ali";
        }
        else if (t[2]) { a.p.push([["caput", ""]]); tipo = "caput"; emPar = false }
        else if (t[3] || t[6]) {
          const v = t[6] ? "unico" : t[4] + (t[5] ? "-" + t[5] : "");
          const ant = tipo === "par" ? ultimo()[0] : null;
          if (!(seq && ant && faixa("par", ant[1], v, [], n => parseInt(n, 10)))) a.p.push([["par", v]]);
          tipo = "par"; emPar = t[3] === "§§";
        }
        else if (t[7] || t[8]) {
          const v = t[7] || t[8];
          const base = tipo === "par" && !con ? ultimo() : (tipo === "inc" || tipo === "ali" || tipo === "item") ? ate(ultimo(), "inc") : [];
          const ant = (tipo === "inc" || tipo === "ali") ? ultimo().filter(x => x[0] === "inc").pop() : null;
          if (!(seq && ant && faixa("inc", ant[1], v, base, romano))) a.p.push(base.concat([["inc", v]]));
          tipo = "inc"; emPar = false;
        }
        else if (t[9] || t[10] || t[11] || t[12]) {
          const tt = t[12] ? "item" : "ali", v = t[12] || t[9] || t[10] || t[11];
          const base = (tipo === "inc" || tipo === "par") && !con ? ultimo() : tipo === tt ? ate(ultimo(), tt) : ultimo();
          a.p.push(base.concat([[tt, v]])); tipo = tt;
        }
        else if (t[13]) {
          // "§§ 1º, 2º e 3º" são parágrafos; em "arts. 4º, §§2º e 3º, e 22", o ", e 22" já é outro artigo
          if (emPar && (!con || /^(e|a|até)$/.test(con)) && !(plural && con && /^\s*,/.test(t[0]))) {
            const ant = ultimo()[0];
            if (!(seq && ant && faixa("par", ant[1], t[13], [], n => parseInt(n, 10)))) a.p.push([["par", t[13]]]);
          }
          // número solto só é outro artigo quando a citação é plural ("arts. 33 e 35", "arts. 10 a 14")
          else if (!plural) break;
          else if (seq) {
            const ini = parseInt(a.n, 10), fim = parseInt(t[13].replace(/\./g, ""), 10);
            if (!(fim > ini && fim - ini <= 8)) break;
            for (let k = ini + 1; k <= fim; k++) arts.push(a = { n: String(k), p: [] });
            tipo = null;
          } else { arts.push(a = { n: chave(t[13], t[14]), p: [] }); tipo = null; emPar = false }
        }
        pos = PARTE.lastIndex; ult = pos;
      }
      // "(art. 112, VI, d)": o ")" fecha o parêntese do texto, não é da alínea "d)"
      if (texto[ult - 1] === ")") { const tr = texto.slice(m.index, ult); if ((tr.match(/\)/g) || []).length > (tr.match(/\(/g) || []).length) ult-- }
      // alvo que só repete o começo de outro (§2º, depois §2º, I) sai
      for (const x of arts) x.p = x.p.filter((c, i) => !x.p.some((d, j) => j !== i && d.length > c.length && c.every((e, k) => d[k][0] === e[0] && d[k][1] === e[1])));
      // de qual lei: logo depois da citação ("do CP", "da Lei 11.343/2006", "desta Lei") ou, se não tiver, do contexto
      let lei = null, como = "contexto", fim = ult;
      SEGUINTES.lastIndex = ult;
      if (SEGUINTES.test(texto)) ult = fim = SEGUINTES.lastIndex;
      P.DESIG.lastIndex = ult;
      let d = P.DESIG.exec(texto);
      if (!d) { P.DESIG2.lastIndex = ult; d = P.DESIG2.exec(texto) }
      if (d) {
        if (d[1] || d[2]) { lei = P.mapa[(d[1] || d[2]).replace(/\s+/g, " ")] || null; como = lei ? "explicita" : "outra"; fim = d.index + d[0].length }
        else if (d[3]) { lei = numerada(P, d[3], d[4], d[5], d[6]); como = lei ? "explicita" : "outra"; fim = d.index + d[0].length }
        else if (d[7]) { como = "mesma"; fim = d.index + d[0].length }
        else if (d[10]) { como = "contexto"; fim = d.index + d[0].length }
        else if (d[8]) como = "contexto";
        else como = "outra";          // Convenção, Pacto, Resolução, ou um nome que o app não tem
      }
      cits.push({ t: "cit", i: m.index, j: fim, arts, lei, como });
    }
    // "art. 5º, LXXIV, e art. 134 da CF": a lei escrita no fim vale para as citações ligadas por "e"/"ou"
    for (let k = cits.length - 2; k >= 0; k--) {
      const x = cits[k], y = cits[k + 1];
      if (x.como === "contexto" && y.como === "explicita" && /^\s*,?\s*(?:e|ou|c\/c)\s+$/.test(texto.slice(x.j, y.i))) { x.lei = y.lei; x.como = "explicita" }
    }
    /* contexto de quem não tem lei escrita:
       - lei mencionada na mesma frase ("O Jecrim, criado pela Lei 9.099/1995, julga ... (art. 61)");
       - "seu art. 33" depois de mencionar uma lei no parágrafo;
       - senão, a que veio de fora (título do tema ou nada; a lei padrão da matéria entra em escolher()).
       Citação com lei escrita ("art. 5º da CF") não muda o contexto: o "(art. 29)" seguinte continua sendo do CPP.
       Fonte que o app não tem (Convenção, Pacto...) bloqueia o resto do parágrafo, até outra lei ser mencionada. */
    const tudo = ev.concat(cits).sort((x, y) => x.i - y.i || (x.t === "cit" ? 1 : -1));
    const fronteiras = []; { const F = /[.!?:]\s+(?=[A-ZÀ-Ú"“(])/g; let f; while ((f = F.exec(texto))) fronteiras.push(f.index + 1) }
    const frase = i => { let k = 0; while (k < fronteiras.length && fronteiras[k] <= i) k++; return k };
    const base = contexto === undefined ? null : contexto;
    let leiTexto = null, fraseTexto = -1, bloqueio = false, ultExp = null, ultLei = null;
    const out = [];
    for (const e of tudo) {
      if (e.t === "mencao") {
        // menção que faz parte da própria citação ("da Lei 11.343/2006") já foi tratada
        if (out.length && out[out.length - 1].j >= e.j && out[out.length - 1].i <= e.i) continue;
        if (e.outra) { bloqueio = true; leiTexto = null; ultLei = null }
        else if (e.lei) { leiTexto = e.lei; fraseTexto = frase(e.i); bloqueio = false; ultLei = e.lei }
        continue;
      }
      if (e.como === "outra") e.lei = null;
      else if (e.como === "explicita") { ultExp = { lei: e.lei, frase: frase(e.i), j: e.j }; ultLei = e.lei }
      else if (e.como === "mesma") { e.lei = ultLei; e.como = ultLei ? "explicita" : "outra" }
      else if (e.como === "contexto") {
        // última lei escrita na mesma frase: só como último recurso ("(art. 102, I, b, da CF); os governadores (art. 105, I, a)")
        // (mas não dentro do mesmo parêntese depois de ";": "(art. 5º, XXXVIII, da Constituição; art. 74, §1º)" são fontes diferentes)
        if (ultExp && ultExp.frase === frase(e.i) && !/^[^)]*;/.test(texto.slice(ultExp.j, e.i))) e.exp = ultExp.lei;
        const anafora = /(?:^|[\s(])(?:[Ss]eus?|[Ss]uas?)\s+$/.test(texto.slice(Math.max(0, e.i - 8), e.i));
        if (leiTexto && (frase(e.i) === fraseTexto || anafora)) { e.lei = leiTexto; e.de = "texto" }
        else if (bloqueio || base === false) { e.lei = null; e.bloq = true }
        else { e.lei = base; e.de = "fora" }
      }
      out.push(e);
    }
    // num título, a última lei citada ou mencionada vale para a seção ("## O incidente (arts. 133 a 137 do CPC)")
    const ultima = ev.filter(e => !out.some(c => c.i <= e.i && c.j >= e.j)).concat(out.filter(c => c.como === "explicita" || c.como === "outra").map(c => ({ i: c.i, lei: c.lei, outra: c.como === "outra" }))).sort((x, y) => y.i - x.i)[0];
    // fim: a lei do texto para quem vem depois (só usado em títulos): a última mencionada, false se foi uma fonte de fora
    return { cits: out, fim: ultima ? (ultima.outra ? false : ultima.lei || base) : base };
  }
  /* o artigo (e o §, inciso, alínea citados) existe no texto da lei? L = {arts, nov} de leis/<id>.js;
     cada alvo é um caminho: [["par","2"],["inc","I"]] = §2º, I */
  function existeAlvo(linhas, caminho) {
    let escopo = linhas;
    for (const [tipo, v] of caminho) {
      if (tipo === "caput" || tipo === "item") continue;
      if (tipo === "par") {
        const re = v === "unico" ? /^Parágrafo único/i : new RegExp("^§\\s*" + v.replace(/-.*/, "") + "\\s*(?:º|°|o)?" + (v.includes("-") ? "\\s*-\\s*" + v.split("-")[1] : "(?![\\d-])"));
        const i = escopo.findIndex(l => re.test(l)); if (i < 0) return false;
        let j = i + 1; while (j < escopo.length && !/^(§|Parágrafo único)/i.test(escopo[j])) j++;
        escopo = escopo.slice(i, j);
      } else if (tipo === "inc") {
        const re = new RegExp("^" + v + "\\s*[-–—.]"); const i = escopo.findIndex(l => re.test(l)); if (i < 0) return false;
        let j = i + 1; while (j < escopo.length && /^[a-z]\)|^\d+\s*[.,)]/.test(escopo[j])) j++;   // alíneas e itens ("12, os Secretários": erro do texto oficial)
        escopo = escopo.slice(i, j);
      } else if (tipo === "ali") { if (!escopo.some(l => new RegExp("^" + v + "\\)").test(l))) return false }
    }
    return true;
  }
  const morto = linhas => linhas.length === 1 && /^Art\.\s*\S+\s*\((?:VETAD|Vetad|Revogad|REVOGAD)/.test(linhas[0]);
  function tem(L, a, comPartes) {
    const linhas = L && L.arts && L.arts[a.n];
    if (!linhas) return false;
    if (comPartes && morto(linhas)) return false;      // "Art. 85. (VETADO)": citação sem lei escrita não vai para artigo vetado
    if (!comPartes || !a.p.length) return true;
    if (a.p.every(c => existeAlvo(linhas, c))) return true;
    const nov = L.nov && L.nov[a.n];
    return !!nov && a.p.every(c => existeAlvo([].concat(...nov.map(x => x.linhas)), c));
  }
  /* de qual lei é a citação, conferindo no texto. leiDe(id) → {arts, nov} ou null (texto não carregado).
     Com a lei escrita ("do CP"), vale se o artigo existe (o § citado pode faltar: o artigo abre do mesmo jeito).
     Sem a lei escrita, tenta a do contexto (título do tema, fundamento da questão ou lei mencionada na frase) e depois a
     padrão da matéria: vale a primeira em que o artigo e o §/inciso citado existem; por último, a lei escrita numa citação
     anterior da mesma frase. Nenhuma? Fica sem link (melhor que link errado). */
  function escolher(c, padrao, leiDe) {
    if (c.como === "outra" || c.bloq) return null;
    if (c.como === "explicita") return c.lei && c.arts.every(a => tem(leiDe(c.lei), a, false)) ? c.lei : null;
    const cand = [];
    if (c.lei) cand.push(c.lei);
    if (padrao && !cand.includes(padrao)) cand.push(padrao);
    const ok = cand.filter(id => c.arts.every(a => tem(leiDe(id), a, true)));
    // lei só mencionada na frase ("na forma do CPC (art. 362)", "a Lei 9.455/1997 prevê (art. 1º)") e lei padrão da matéria
    // com o mesmo artigo: pode ser qualquer uma das duas, então fica sem link
    if (c.de === "texto" && ok.length > 1) return null;
    if (ok.length) return ok[0];
    if (c.exp && !cand.includes(c.exp) && c.arts.every(a => tem(leiDe(c.exp), a, true))) return c.exp;
    return null;
  }
  /* leis que escolher() pode precisar para esta citação (para carregar antes) */
  const candidatas = (c, padrao) => c.como === "outra" || c.bloq ? [] : c.como === "explicita" ? (c.lei ? [c.lei] : []) : [...new Set([c.lei, padrao, c.exp].filter(Boolean))];
  /* contexto dos títulos: o título que fala de uma lei ("# Lei de Drogas") vale para o texto abaixo dele, até o
     próximo título do mesmo nível; título sem lei herda o de cima. O contexto não passa de um parágrafo para outro.
     base: contexto de fora de qualquer título (nas questões, a lei do fundamento) */
  function titulos(base) {
    const niv = [];
    const ate = n => { for (let k = Math.min(n, niv.length) - 1; k >= 0; k--) if (niv[k] !== undefined) return niv[k]; return base === undefined ? null : base };
    return {
      texto: () => ate(99),
      tema: () => ate(1),           // "Teste-se" no fim do tema: vale o título do tema, não o do último subtítulo
      antesDoTitulo: n => ate(n - 1),
      titulo(n, fim, antes) { niv.length = Math.max(0, n - 1); niv[n - 1] = fim === antes ? undefined : fim }
    };
  }
  /* lei do fundamento da questão ("Art. 23 do EAOAB (Lei 8.906/1994)"): a primeira citada com lei escrita */
  const leiDoFundamento = (texto, idx) => { const c = varrer(String(texto || ""), idx, null).cits.find(c => c.como === "explicita" && c.lei); return c ? c.lei : null };
  const API = { varrer, leiDoFundamento, preparar, escolher, candidatas, titulos, tem, existeAlvo, versao: 2 };
  if (typeof module !== "undefined" && module.exports) module.exports = API; else raiz.ARTACHAR = API;
})(typeof window !== "undefined" ? window : globalThis);
