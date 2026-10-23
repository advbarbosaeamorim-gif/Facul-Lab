/* Lembretes do Facul Lab (Web Push).
   O servidor não conhece o progresso do estudante: o app envia só o horário escolhido, o fuso,
   o último dia com estudo, a ofensiva, a meta e as próximas provas. Cada aparelho é uma entrada
   no Netlify Blobs, com a chave tirada do endereço da inscrição (sem conta, sem e-mail). */
import { getStore } from "@netlify/blobs";
import webpush from "web-push";
import { createHash } from "node:crypto";

export const loja = () => getStore("facul-lab-lembretes");
export const chaveDe = endpoint => "a_" + createHash("sha256").update(String(endpoint)).digest("hex").slice(0, 40);

/* Chaves VAPID: usa as variáveis de ambiente se existirem; senão gera uma vez e guarda no Blobs. */
let vapidCache = null;
export async function vapid() {
  if (vapidCache) return vapidCache;
  const env = process.env;
  if (env.VAPID_PUBLIC_KEY && env.VAPID_PRIVATE_KEY) {
    vapidCache = { publicKey: env.VAPID_PUBLIC_KEY, privateKey: env.VAPID_PRIVATE_KEY };
  } else {
    const s = loja();
    let k = await s.get("_vapid", { type: "json" });
    if (!k || !k.publicKey) {
      const novo = webpush.generateVAPIDKeys();
      await s.setJSON("_vapid", novo, { onlyIfNew: true });
      k = (await s.get("_vapid", { type: "json" })) || novo;
    }
    vapidCache = { publicKey: k.publicKey, privateKey: k.privateKey };
  }
  webpush.setVapidDetails(env.VAPID_SUBJECT || "mailto:lembretes@faculab.app", vapidCache.publicKey, vapidCache.privateKey);
  return vapidCache;
}

const DIA_RE = /^\d{4}-\d{2}-\d{2}$/;
const HORA_RE = /^([01]\d|2[0-3]):[0-5]\d$/;
const txt = (v, n) => String(v || "").replace(/[\u0000-\u001f]/g, "").slice(0, n);
const num = (v, max) => Math.max(0, Math.min(max, Math.round(+v || 0)));

/* Confere e limpa o que o app mandou, para não guardar nada além do combinado. */
export function limpar(corpo) {
  const sub = corpo && corpo.sub;
  if (!sub || typeof sub.endpoint !== "string" || !/^https:\/\//.test(sub.endpoint) || sub.endpoint.length > 1000) return null;
  const k = sub.keys || {};
  if (typeof k.p256dh !== "string" || typeof k.auth !== "string" || k.p256dh.length > 200 || k.auth.length > 100) return null;
  const tz = txt(corpo.tz, 64);
  try { new Intl.DateTimeFormat("pt-BR", { timeZone: tz || "America/Sao_Paulo" }); } catch (e) { return null; }
  const t = corpo.tipos || {};
  const e = corpo.estado || {};
  const provas = (Array.isArray(e.provas) ? e.provas : []).filter(p => p && DIA_RE.test(p.dt)).slice(0, 20).map(p => ({ dt: p.dt, nome: txt(p.nome, 80) }));
  return {
    sub: { endpoint: sub.endpoint, keys: { p256dh: k.p256dh, auth: k.auth } },
    tz: tz || "America/Sao_Paulo",
    hora: HORA_RE.test(corpo.hora) ? corpo.hora : "20:00",
    tipos: { fogo: t.fogo !== false, meta: t.meta !== false, prova: t.prova !== false },
    estado: {
      ult: DIA_RE.test(e.ult) ? e.ult : "",
      seq: num(e.seq, 5000),
      q: num(e.q, 100000),
      meta: num(e.meta, 10000),
      provas
    }
  };
}

/* Data e hora no fuso do estudante. */
export function agoraEm(tz, quando = new Date()) {
  const p = Object.fromEntries(new Intl.DateTimeFormat("en-CA", { timeZone: tz, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23" })
    .formatToParts(quando).map(x => [x.type, x.value]));
  return { dia: `${p.year}-${p.month}-${p.day}`, min: (+p.hour) * 60 + (+p.minute) };
}
const diasEntre = (a, b) => Math.round((Date.parse(b + "T12:00:00Z") - Date.parse(a + "T12:00:00Z")) / 864e5);
const nDias = n => n === 1 ? "1 dia" : n + " dias";
const sorteia = (L, semente) => L[Math.abs(semente) % L.length];

/* Escolhe o recado do dia. Uma notificação por dia, no máximo, com a prova próxima em primeiro lugar. */
export function recado(reg, dia) {
  const e = reg.estado || {}, t = reg.tipos || {};
  const semente = +dia.replace(/-/g, "");
  const estudouHoje = e.ult === dia;
  const qHoje = estudouHoje ? e.q || 0 : 0;
  const ontem = e.ult && diasEntre(e.ult, dia) === 1;
  const seq = estudouHoje || ontem ? e.seq || 0 : 0;

  if (t.prova) {
    const prox = (e.provas || []).map(p => ({ ...p, n: diasEntre(dia, p.dt) })).filter(p => p.n >= 0 && p.n <= 7).sort((a, b) => a.n - b.n)[0];
    if (prox && [0, 1, 3, 7].includes(prox.n)) {
      const nome = prox.nome || "a prova";
      const quando = prox.n === 0 ? "é hoje" : prox.n === 1 ? "é amanhã" : `é daqui a ${prox.n} dias`;
      const corpo = prox.n === 0 ? "Respire fundo e confie no que você estudou. Uma revisão leve dos resumos já ajuda."
        : prox.n === 1 ? "Revise os erros e os resumos, sem começar matéria nova. E durma bem!"
        : prox.n === 3 ? "Reta final: priorize questões e a revisão das que você errou."
        : "Ainda dá tempo de ler a apostila e treinar questões. O plano de hoje já está pronto.";
      return { title: `${nome[0].toUpperCase() + nome.slice(1)} ${quando}`, body: corpo, tag: "prova", url: "./" };
    }
  }
  if (t.fogo && !estudouHoje) {
    if (seq > 0) return { ...sorteia([
      { title: "Não perca seu foguinho!", body: `Você está com ${nDias(seq)} de ofensiva. Uma questão ou um cartão hoje mantém a chama acesa.` },
      { title: `${nDias(seq)} seguidos: não pare agora`, body: "Dez minutos bastam. Responda algumas questões e a ofensiva continua." },
      { title: "Sua chama está esperando", body: `O dia está acabando e a ofensiva de ${nDias(seq)} depende de você.` }
    ], semente), tag: "fogo", url: "./" };
    return { ...sorteia([
      { title: "Bora acender a chama?", body: "Uma questão hoje já começa uma nova ofensiva. O plano do dia está pronto para você." },
      { title: "Recomeçar também é avançar", body: "Todo aprovado já recomeçou um dia. Que tal dez minutos de estudo agora?" },
      { title: "Seu plano de hoje está esperando", body: "Um tema da apostila, alguns cartões e poucas questões. Vamos?" }
    ], semente), tag: "fogo", url: "./" };
  }
  if (t.meta && e.meta && qHoje < e.meta) {
    const falta = e.meta - qHoje;
    return { title: `Faltam ${falta} ${falta === 1 ? "questão" : "questões"} para a meta`, body: `Você já fez ${qHoje} de ${e.meta} hoje. Termine e veja a comemoração!`, tag: "meta", url: "./" };
  }
  return null;
}

export async function enviar(reg, msg) {
  await vapid();
  return webpush.sendNotification(reg.sub, JSON.stringify(msg), { TTL: 4 * 3600, urgency: "normal" });
}
/* inscrição vencida ou cancelada no aparelho: apagar */
export const inscricaoMorta = err => err && (err.statusCode === 404 || err.statusCode === 410);
