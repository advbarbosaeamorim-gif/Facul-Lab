/* Roda a cada 15 minutos: para cada aparelho que chegou ao horário-surpresa do dia (entre 9h e 21h,
   no fuso dele) e ainda não recebeu nada hoje, escolhe o recado e envia. Só roda no site publicado. */
import { loja, agoraEm, alvoDoDia, recado, enviar, inscricaoMorta } from "../lib/lembretes.mjs";

const JANELA = 3 * 60; // se a rodada atrasar mais de 3 horas, o lembrete do dia já não faz sentido

export default async () => {
  const s = loja();
  const { blobs } = await s.list({ prefix: "a_" });
  let enviados = 0, apagados = 0;
  for (const { key } of blobs) {
    try {
      const reg = await s.get(key, { type: "json" });
      if (!reg || !reg.sub) continue;
      const { dia, min } = agoraEm(reg.tz);
      const alvo = alvoDoDia(key, dia);
      if (reg.env === dia || min < alvo || min >= alvo + JANELA) continue;
      const msg = recado(reg, dia, min);
      if (msg) {
        try { await enviar(reg, msg); enviados++; }
        catch (err) {
          if (inscricaoMorta(err)) { await s.delete(key); apagados++; continue; }
          console.error(key, err.statusCode || err.message);
          continue; // tenta de novo na próxima rodada
        }
      }
      /* relê antes de gravar, para não desfazer uma atualização que o app tenha mandado agora */
      const atual = await s.get(key, { type: "json" });
      if (atual) await s.setJSON(key, { ...atual, env: dia });
    } catch (err) { console.error(key, err); }
  }
  console.log(`lembretes: ${blobs.length} aparelhos, ${enviados} enviados, ${apagados} inscrições vencidas apagadas`);
};

export const config = { schedule: "*/15 * * * *" };
