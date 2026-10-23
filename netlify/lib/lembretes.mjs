/* Lembretes do Facul Lab (Web Push).
   O servidor não conhece o progresso do estudante: o app envia só o fuso, o último dia com estudo,
   a ofensiva, as questões desse dia, a meta e as próximas provas. Cada aparelho é uma entrada
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
}const DIA_RE = /^\d{4}-\d{2}-\d{2}$/;
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
  const e = corpo.estado || {};
  const provas = (Array.isArray(e.provas) ? e.provas : []).filter(p => p && DIA_RE.test(p.dt)).slice(0, 20).map(p => ({ dt: p.dt, nome: txt(p.nome, 80) }));
  return {
    sub: { endpoint: sub.endpoint, keys: { p256dh: k.p256dh, auth: k.auth } },
    tz: tz || "America/Sao_Paulo",
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

/* Horário-surpresa do dia, entre 9h e 21h: muda todo dia e é diferente para cada aparelho. */
const INICIO = 9 * 60, FIM = 21 * 60;
const hashN = t => createHash("sha256").update(t).digest().readUInt32BE(0);
export const alvoDoDia = (chave, dia) => INICIO + hashN(chave + "|" + dia) % (FIM - INICIO);

const diasEntre = (a, b) => Math.round((Date.parse(b + "T12:00:00Z") - Date.parse(a + "T12:00:00Z")) / 864e5);
const nDias = n => n === 1 ? "1 dia" : n + " dias";
const periodo = min => min < 12 * 60 ? "manha" : min < 18 * 60 ? "tarde" : "noite";
const sorteia = (L, semente) => L[semente % L.length];
const cap = t => t[0].toUpperCase() + t.slice(1);
/* ilustrações das notificações (em lembretes/, na raiz do site) */
const IMG = n => `./lembretes/${n}.png`;

/* Recados: cada um tem título, texto e ilustração. Variam com a hora do dia e com a situação. */
const FOGO = {
  manha: s => [
    { title: "Bom dia! Sua chama acordou com você", body: `São ${nDias(s)} de ofensiva. Que tal começar o dia com cinco questões?`, img: "chama" },
    { title: "Café, apostila e ofensiva", body: `Seus ${nDias(s)} seguidos merecem continuar. Um tema da apostila já conta.`, img: "cafe" },
    { title: "Manhã é ótima para aprender", body: `O cérebro está descansado. Mantenha a ofensiva de ${nDias(s)} com uns minutos de estudo.`, img: "livro" }],
  tarde: s => [
    { title: "Não perca seu foguinho!", body: `Você está com ${nDias(s)} de ofensiva. Uma questão ou um cartão hoje mantém a chama acesa.`, img: "chama" },
    { title: `${nDias(s)} seguidos: não pare agora`, body: "Dez minutos bastam. Responda algumas questões e a ofensiva continua.", img: "foguete" },
    { title: "Uma pausa que vale ponto", body: `Entre uma tarefa e outra, vire uns cartões. A ofensiva de ${nDias(s)} agradece.`, img: "cartas" }],
  noite: s => [
    { title: "Sua chama está esperando", body: `O dia está acabando e a ofensiva de ${nDias(s)} depende de você. Bora?`, img: "lua" },
    { title: "Ainda dá tempo!", body: `Cinco questões antes de dormir e seus ${nDias(s)} de ofensiva continuam.`, img: "chama" },
    { title: "Último chamado do dia", body: "Revise alguns cartões no sofá mesmo. O que importa é não deixar a chama apagar.", img: "cartas" }]
};
const VOLTA = {
  manha: [
    { title: "Bom dia, futuro advogado!", body: "Uma questão hoje já acende uma nova ofensiva. O plano do dia está pronto.", img: "balanca" },
    { title: "Hoje é um ótimo dia para recomeçar", body: "Todo aprovado já recomeçou um dia. Dez minutos de manhã fazem diferença.", img: "cafe" }],
  tarde: [
    { title: "Bora acender a chama?", body: "Responda uma questão, vire um cartão ou leia uma página. A ofensiva começa agora.", img: "chama" },
    { title: "O que você aprendeu não foi embora", body: "Voltar é o que separa quem passa de quem desiste. Que tal um tema rapidinho?", img: "livro" }],
  noite: [
    { title: "Que tal fechar o dia estudando?", body: "Poucas questões antes de dormir já contam. Amanhã a chama cresce.", img: "lua" },
    { title: "Seu plano de hoje está esperando", body: "Um tema da apostila, alguns cartões e poucas questões. Vamos?", img: "balanca" }]
};
const META = (f, q, m) => [
  { title: `Faltam ${f} ${f === 1 ? "questão" : "questões"} para a meta`, body: `Você já fez ${q} de ${m} hoje. Termine e veja a comemoração!`, img: "alvo" },
  { title: "Você está quase lá!", body: `Mais ${f} ${f === 1 ? "questão" : "questões"} e a meta de hoje está batida.`, img: "trofeu" },
  { title: "A meta está logo ali", body: `${q} de ${m} questões feitas. Cada uma conta para a prova.`, img: "alvo" }];

/* Escolhe o recado do dia: prova próxima primeiro, depois a ofensiva e, por fim, a meta.
   Se a pessoa já estudou e bateu a meta, não manda nada. */
export function recado(reg, dia, min = 15 * 60) {
  const e = reg.estado || {};
  const semente = hashN(dia + "|" + (reg.sub && reg.sub.endpoint || ""));
  const per = periodo(min);
  const estudouHoje = e.ult === dia;
  const qHoje = estudouHoje ? e.q || 0 : 0;
  const ontem = e.ult && diasEntre(e.ult, dia) === 1;
  const seq = estudouHoje || ontem ? e.seq || 0 : 0;
  const com = m => ({ title: m.title, body: m.body, image: IMG(m.img), tag: "facul-lab", url: "./" });

  const prox = (e.provas || []).map(p => ({ ...p, n: diasEntre(dia, p.dt) })).filter(p => p.n >= 0 && p.n <= 7).sort((a, b) => a.n - b.n)[0];
  if (prox && [0, 1, 2, 3, 5, 7].includes(prox.n)) {
    const nome = cap(prox.nome || "a prova");
    const quando = prox.n === 0 ? "é hoje" : prox.n === 1 ? "é amanhã" : `é daqui a ${prox.n} dias`;
    const corpo = prox.n === 0 ? sorteia(["Respire fundo e confie no que você estudou. Uma revisão leve dos resumos já ajuda.", "Você se preparou para isso. Leia os resumos com calma e boa prova!"], semente)
      : prox.n === 1 ? sorteia(["Revise os erros e os resumos, sem começar matéria nova. E durma bem!", "Hoje é dia de revisão leve: erradas, resumos e uma boa noite de sono."], semente)
      : prox.n <= 3 ? sorteia(["Reta final: priorize questões e a revisão das que você errou.", "Hora de treinar questões da matéria e revisar os cartões."], semente)
      : "Ainda dá tempo de ler a apostila e treinar questões. O plano de hoje já está pronto.";
    if (!(estudouHoje && prox.n > 1 && qHoje >= (e.meta || 1))) return com({ title: `${nome} ${quando}`, body: corpo, img: prox.n <= 1 ? "calendario" : sorteia(["calendario", "balanca", "livro"], semente) });
  }
  if (!estudouHoje) return com(seq > 0 ? sorteia(FOGO[per](seq), semente) : sorteia(VOLTA[per], semente));
  if (e.meta && qHoje < e.meta) { const f = e.meta - qHoje; return com(sorteia(META(f, qHoje, e.meta), semente)); }
  return null;
}



export async function enviar(reg, msg) {
  await vapid();
  return webpush.sendNotification(reg.sub, JSON.stringify(msg), { TTL: 4 * 3600, urgency: "normal" });
}
/* inscrição vencida ou cancelada no aparelho: apagar */
export const inscricaoMorta = err => err && (err.statusCode === 404 || err.statusCode === 410);
