/* GET: chave pública para o aparelho se inscrever.
   POST {acao:"salvar"}: guarda ou atualiza a inscrição e o estado mínimo.
   POST {acao:"remover"}: apaga a inscrição.  POST {acao:"teste"}: envia agora o lembrete de boas-vindas. */
import { loja, chaveDe, vapid, limpar, enviar, inscricaoMorta } from "../lib/lembretes.mjs";

const resp = (dados, status = 200) => new Response(JSON.stringify(dados), { status, headers: { "content-type": "application/json", "cache-control": "no-store" } });

export default async req => {
  try {
    if (req.method === "GET") return resp({ publicKey: (await vapid()).publicKey });
    if (req.method !== "POST") return resp({ erro: "método" }, 405);
    const texto = await req.text();
    if (texto.length > 20000) return resp({ erro: "grande" }, 413);
    let corpo;
    try { corpo = JSON.parse(texto); } catch (e) { return resp({ erro: "json" }, 400); }
    const s = loja();

    if (corpo.acao === "remover") {
      if (typeof corpo.endpoint !== "string") return resp({ erro: "endpoint" }, 400);
      await s.delete(chaveDe(corpo.endpoint));
      return resp({ ok: true });
    }

    const reg = limpar(corpo);
    if (!reg) return resp({ erro: "dados" }, 400);
    const chave = chaveDe(reg.sub.endpoint);

    if (corpo.acao === "teste") {
      try {
        await enviar(reg, { title: "Lembretes ligados!", body: "Uma vez por dia, em um horário-surpresa, o Facul Lab te chama para estudar. Até já!", image: "./lembretes/balanca.png", tag: "facul-lab", url: "./" });
      } catch (err) {
        if (inscricaoMorta(err)) { await s.delete(chave); return resp({ erro: "inscricao" }, 410); }
        throw err;
      }
      return resp({ ok: true });
    }

    if (corpo.acao === "salvar") {
      const antes = await s.get(chave, { type: "json" });
      reg.env = antes && antes.env || "";
      reg.criado = antes && antes.criado || Date.now();
      reg.atualizado = Date.now();
      await s.setJSON(chave, reg);
      return resp({ ok: true });
    }
    return resp({ erro: "acao" }, 400);
  } catch (err) {
    console.error(err);
    return resp({ erro: "servidor" }, 500);
  }
};

export const config = { path: "/api/lembretes" };
