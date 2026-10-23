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
/* ilustrações das notificações (em lembretes/, na raiz do site): a quadrada vai como ícone ao lado do texto
   e a larga aparece quando a pessoa expande o recado */
const IMG = n => `./lembretes/${n}.png`;
const ICONE = n => `./lembretes/ic-${n}.png`;

/* Recados curtos, para caber sem expandir no celular: título até 28 caracteres e texto até 56. */
export const LIMITE = { title: 28, body: 56 };
const FOGO = {
  manha: s => [
    { title: "Bom dia! A chama acordou", body: `${nDias(s)} de ofensiva. Começa o dia com 5 questões?`, img: "chama" },
    { title: "Café, apostila e ofensiva", body: `${nDias(s)} seguidos. Um tema da apostila já conta.`, img: "cafe" },
    { title: "Manhã boa para aprender", body: `Uns minutos de estudo mantêm ${nDias(s)} de ofensiva.`, img: "livro" }],
  tarde: s => [
    { title: "Não perca seu foguinho!", body: `${nDias(s)} de ofensiva. Uma questão mantém a chama.`, img: "chama" },
    { title: "Não pare agora!", body: `${nDias(s)} seguidos. Dez minutos bastam hoje.`, img: "foguete" },
    { title: "Uma pausa que vale ponto", body: `Vire uns cartões e salve ${nDias(s)} de ofensiva.`, img: "cartas" }],
  noite: s => [
    { title: "Sua chama está esperando", body: `O dia acaba logo. Salve ${nDias(s)} de ofensiva!`, img: "lua" },
    { title: "Ainda dá tempo!", body: `5 questões antes de dormir e ${nDias(s)} continuam.`, img: "chama" },
    { title: "Último chamado do dia", body: "Uns cartões no sofá mesmo. Não deixe a chama apagar.", img: "cartas" }]
};
const VOLTA = {
  manha: [
    { title: "Bom dia, futuro advogado!", body: "Uma questão hoje já acende uma nova ofensiva.", img: "balanca" },
    { title: "Ótimo dia para recomeçar", body: "Todo aprovado já recomeçou um dia. Bora?", img: "cafe" }],
  tarde: [
    { title: "Bora acender a chama?", body: "Uma questão, um cartão ou uma página. Começa agora.", img: "chama" },
    { title: "O que aprendeu não sumiu", body: "Voltar é o que separa quem passa. Um tema rapidinho?", img: "livro" }],
  noite: [
    { title: "Fechar o dia estudando?", body: "Poucas questões antes de dormir já contam.", img: "lua" },
    { title: "Seu plano está esperando", body: "Um tema, uns cartões e poucas questões. Vamos?", img: "balanca" }]
};
const qs = n => n + (n === 1 ? " questão" : " questões");
const META = (f, q, m) => [
  { title: `Faltam ${qs(f)}!`, body: `Você fez ${q} de ${m} hoje. Termine e comemore!`, img: "alvo" },
  { title: "Você está quase lá!", body: `Mais ${qs(f)} e a meta de hoje está batida.`, img: "trofeu" },
  { title: "A meta está logo ali", body: `${q} de ${m} feitas. Cada uma conta para a prova.`, img: "alvo" }];

/* Inspiração: versículos curtos sobre estudo e sabedoria (NVI) e frases de motivação. */
const VERSOS = [
  ["Tudo posso naquele que me fortalece.", "Filipenses 4:13"],
  ["Os planos bem elaborados levam à fartura.", "Provérbios 21:5"],
  ["Consagre ao Senhor tudo o que você faz.", "Provérbios 16:3"],
  ["Seja forte e corajoso! Não se apavore nem desanime.", "Josué 1:9"],
  ["O conselho da sabedoria é: procure obter sabedoria.", "Provérbios 4:7"],
  ["Tudo o que fizerem, façam de todo o coração.", "Colossenses 3:23"],
  ["No tempo próprio colheremos, se não desanimarmos.", "Gálatas 6:9"],
  ["O Senhor é quem dá sabedoria.", "Provérbios 2:6"],
  ["Aqueles que esperam no Senhor renovam as suas forças.", "Isaías 40:31"],
  ["Os desejos do diligente são amplamente satisfeitos.", "Provérbios 13:4"]
];
const FRASES = [
  ["Constância vence talento", "Um pouco por dia leva mais longe que muito às vezes."],
  ["A OAB se conquista assim", "Uma questão de cada vez, um dia de cada vez."],
  ["Seu eu do futuro agradece", "Cada tema de hoje é um ponto a mais no dia da prova."],
  ["Errar aqui é acertar lá", "Cada erro no app é um acerto garantido na prova."],
  ["Difícil é sinal de avanço", "Se a matéria pesa, é porque você está aprendendo."],
  ["Disciplina é liberdade", "Quem estuda com constância chega tranquilo na prova."],
  ["Rotina vence motivação", "Abra o app, dê o primeiro passo e o resto vem."],
  ["Todo advogado começou assim", "Quem passou já esteve exatamente onde você está."]
];
function inspira(semente) {
  if ((semente >> 3) % 2 === 0) { const [v, ref] = VERSOS[semente % VERSOS.length]; return { title: ref, body: `“${v}”`, img: "luz" }; }
  const [t, f] = FRASES[semente % FRASES.length];
  return { title: t, body: f, img: "montanha" };
}
const curto = (t, n) => t.length <= n ? t : t.slice(0, n - 1).trimEnd() + "…";

/* Escolhe o recado do dia: prova próxima primeiro; em cerca de 1 a cada 3 dias, um versículo ou uma frase de
   motivação; senão a ofensiva ou a meta. Se a pessoa já estudou e bateu a meta, recebe só a inspiração do dia. */
export function recado(reg, dia, min = 15 * 60) {
  const e = reg.estado || {};
  const ep = reg.sub && reg.sub.endpoint || "";
  const semente = hashN(dia + "|" + ep); // decide o tipo do recado
  const escolha = hashN("r|" + dia + "|" + ep); // decide qual texto, sem depender do tipo
  const per = periodo(min);
  const estudouHoje = e.ult === dia;
  const qHoje = estudouHoje ? e.q || 0 : 0;
  const ontem = e.ult && diasEntre(e.ult, dia) === 1;
  const seq = estudouHoje || ontem ? e.seq || 0 : 0;
  const com = m => ({ title: curto(m.title, LIMITE.title), body: curto(m.body, LIMITE.body), icon: ICONE(m.img), image: IMG(m.img), tag: "facul-lab", url: "./" });

  const prox = (e.provas || []).map(p => ({ ...p, n: diasEntre(dia, p.dt) })).filter(p => p.n >= 0 && p.n <= 7).sort((a, b) => a.n - b.n)[0];
  if (prox && [0, 1, 2, 3, 5, 7].includes(prox.n)) {
    const nome = cap(prox.nome || "a prova");
    const title = prox.n === 0 ? "Hoje é dia de prova!" : prox.n === 1 ? "Prova amanhã!" : `Prova em ${prox.n} dias`;
    const dica = prox.n === 0 ? "Boa prova!" : prox.n === 1 ? "Revise e durma bem." : prox.n <= 3 ? "Foque nas erradas." : "Bora treinar!";
    if (!(estudouHoje && prox.n > 1 && qHoje >= (e.meta || 1))) return com({ title, body: (nome + ". " + dica).length <= LIMITE.body ? `${nome}. ${dica}` : nome, img: prox.n <= 1 ? "calendario" : sorteia(["calendario", "balanca", "livro"], escolha) });
  }
  const falta = e.meta && qHoje < e.meta ? e.meta - qHoje : 0;
  if (semente % 3 === 0) return com(inspira(escolha));
  if (!estudouHoje) return com(seq > 0 ? sorteia(FOGO[per](seq), escolha) : sorteia(VOLTA[per], escolha));
  if (falta) return com(sorteia(META(falta, qHoje, e.meta), escolha));
  return com(inspira(escolha));
}

export async function enviar(reg, msg) {
  await vapid();
  return webpush.sendNotification(reg.sub, JSON.stringify(msg), { TTL: 4 * 3600, urgency: "normal" });
}
/* inscrição vencida ou cancelada no aparelho: apagar */
export const inscricaoMorta = err => err && (err.statusCode === 404 || err.statusCode === 410);
