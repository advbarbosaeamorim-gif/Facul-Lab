"use strict";
/* ---------- simuladores de Civil e Processo Civil nas apostilas ----------
   ::calc bem   -> "Classifique o bem" (Civil I, Os bens)
   ::calc cumul -> "Monte a cumulação de pedidos" (Processo Civil I, Cumulação de pedidos)
   Estende CALC_DEF, calcWidget e calcResultado de js/01-base.js sem mexer nos simuladores penais. */
const BENS_CALC={
 heranca:["A herança",[
  "**Imóvel** por determinação legal: o direito à sucessão aberta é imóvel (art. 80, II), mesmo que a herança só tenha dinheiro.",
  "**Coletivo**: é universalidade de direito (art. 91), ainda que tenha um único bem.",
  "**Incorpóreo**: é um conjunto de direitos, e não uma coisa que se toca.",
  "**Indivisível** até a partilha, regida pelas regras do condomínio (art. 1.791, parágrafo único).",
  "Pegadinha: por ser imóvel, a **cessão de direitos hereditários** exige **escritura pública** (art. 1.793)."]],
 dinheiro:["O dinheiro",[
  "**Móvel** (art. 82) e **corpóreo**.",
  "**Fungível**: uma nota de R$ 100 se troca por outra igual (art. 85). Por isso o empréstimo de dinheiro é **mútuo** (art. 586).",
  "**Consumível**: usar dinheiro é gastá-lo; o uso acaba com ele para quem o tinha (art. 86).",
  "**Divisível** (art. 87) e **singular**."]],
 carronovo:["Um carro novo, igual a outros na loja",[
  "**Móvel** (art. 82) e **corpóreo**.",
  "**Fungível** enquanto for idêntico aos outros do estoque (mesma espécie, qualidade e quantidade, art. 85).",
  "**Consumível para o lojista**, porque é destinado à venda (art. 86, parte final).",
  "**Indivisível** (art. 87) e **singular** (art. 89)."]],
 carrousado:["O carro usado, com placa e chassi",[
  "**Móvel** (art. 82) e **corpóreo**.",
  "**Infungível**: é individualizado; não se troca por \"outro igual\". Por isso o empréstimo dele ao amigo é **comodato** (art. 579).",
  "**Inconsumível**: suporta uso continuado.",
  "**Indivisível** e **singular**.",
  "O pneu e o motor são **partes integrantes** (seguem o carro); o rádio e o insulfilme são **pertenças** e só acompanham a venda se a lei, o contrato ou as circunstâncias indicarem (arts. 93 e 94)."]],
 lapis:["O lápis",[
  "**Móvel** (art. 82), **corpóreo** e **fungível** (art. 85).",
  "**Consumível**: o uso vai acabando com a própria substância. Já caiu assim em prova da faculdade.",
  "**Indivisível**: partido ao meio, deixa de servir como antes (art. 87).",
  "Compare com a **roupa**: também indivisível, mas tratada como **inconsumível**, porque dura muito."]],
 energia:["A energia elétrica",[
  "**Móvel** por determinação legal: as energias que tenham valor econômico (art. 83, I).",
  "Não se pega com a mão, mas tem valor econômico e pode ser objeto de contrato. Por isso desviá-la é furto (art. 155, §3º, do Código Penal)."]],
 pet:["O cachorro de estimação",[
  "**Bem**, mesmo sem grande valor de mercado, porque pode ser objeto de relação jurídica (doação, venda, guarda).",
  "**Móvel semovente**: move-se por força própria (art. 82).",
  "O **STJ** o reconhece como **ser senciente** e já admitiu regras de convivência com o animal depois do fim da união estável (REsp 1.713.167, 2018).",
  "**Infungível** e **indivisível**."]],
 terreno:["Um terreno urbano grande",[
  "**Imóvel** por natureza: o solo (art. 79). Transfere-se pelo **registro**; acima de 30 salários mínimos exige escritura pública (art. 108).",
  "**Corpóreo**, **infungível** e **inconsumível**.",
  "**Divisível** (art. 87), mas a lei pode limitar: nenhum lote urbano pode ter menos de 125 m² (Lei 6.766/1979, art. 4º, II). É a indivisibilidade por **determinação da lei** (art. 88)."]],
 rebanho:["Um rebanho de gado",[
  "**Coletivo**: universalidade de **fato**, porque são vários bens singulares com destinação unitária (art. 90).",
  "Cada boi é **móvel semovente** e pode ser vendido sozinho (art. 90, parágrafo único).",
  "As crias são **frutos naturais**: nascem periodicamente sem diminuir o rebanho."]],
 aluguel:["O aluguel que o apartamento rende",[
  "**Acessório**: supõe o bem principal, o apartamento (art. 92). O acessório segue o principal (**gravitação jurídica**).",
  "**Fruto civil**: rendimento que a coisa dá por ser usada por outro. Os juros também são frutos civis.",
  "Compare: o minério tirado de uma mina é **produto**, porque esgota a substância."]],
 cotas:["As cotas de uma empresa",[
  "**Incorpóreas**: não têm existência física.",
  "**Móveis** por determinação legal: direitos pessoais de caráter patrimonial (art. 83, III).",
  "A empresa (pessoa jurídica) não é bem; as cotas do sócio são."]],
 praca:["A praça da cidade",[
  "**Bem público de uso comum do povo** (art. 99, I).",
  "**Inalienável** enquanto conservar essa qualificação (art. 100). Só depois da **desafetação** pode virar dominical.",
  "**Não pode ser usucapida** (art. 102). O uso pode ser gratuito ou retribuído (art. 103)."]],
 escola:["A escola pública",[
  "**Bem público de uso especial** (art. 99, II): está afetada a um serviço da administração.",
  "Pegadinha: **não** é de uso comum, porque só os alunos matriculados a usam.",
  "**Inalienável** enquanto afetada (art. 100) e **não usucapível** (art. 102)."]],
 dominical:["Um terreno público vazio, sem destinação",[
  "**Bem público dominical** (art. 99, III).",
  "**Pode ser vendido**, observadas as exigências da lei (art. 101).",
  "**Não pode ser usucapido**, como nenhum bem público (art. 102)."]],
 bb:["Uma agência do Banco do Brasil",[
  "**Bem particular**: o Banco do Brasil é sociedade de economia mista, pessoa de direito privado. O mesmo vale para a Caixa, empresa pública.",
  "Pode ser **penhorado**. Bens públicos são só os das pessoas jurídicas de direito público interno (art. 98).",
  "Exceção famosa: os **Correios** são empresa pública com tratamento de Fazenda Pública e pagam por **precatório** (STF)."]],
 honra:["A honra",[
  "**Não é tratada como bem**: é direito da personalidade e não pode ser negociada (art. 11).",
  "Compare com a **imagem**: também é direito da personalidade, mas o seu **uso econômico** pode ser autorizado e cobrado, e por isso a prova costuma colocá-la entre os bens **incorpóreos**."]]};
Object.assign(CALC_DEF,{bem:{item:"heranca"},cumul:{quer:"todos",dep:"nao",pref:"sim",juizo:"sim",proc:"sim",v1:"5000",v2:"10000"}});
const _calcWidgetBase=calcWidget,_calcResultadoBase=calcResultado;
calcWidget=function(tipo,tit){
 if(tipo!=="bem"&&tipo!=="cumul")return _calcWidgetBase(tipo,tit);
 const v=CALC_DEF[tipo];
 const sel=(n,rot,ops)=>`<label>${rot}<select data-c="${n}">${ops.map(([k,t])=>`<option value="${k}"${v[n]===k?" selected":""}>${t}</option>`).join("")}</select></label>`;
 const num=(n,rot)=>`<label>${rot}<input type="number" inputmode="numeric" min="0" step="1000" data-c="${n}" value="${v[n]}"></label>`;
 const campos=tipo==="bem"?sel("item","Escolha o bem",Object.keys(BENS_CALC).map(k=>[k,BENS_CALC[k][0]]))
  :`${sel("quer","O autor quer que o juiz acolha",[["todos","todos os pedidos"],["um","só um dos pedidos"]])}
  ${sel("dep","O 2º pedido depende do acolhimento do 1º? (se quer todos)",[["nao","não, são independentes"],["sim","sim"]])}
  ${sel("pref","Há ordem de preferência? (se quer só um)",[["sim","sim, o 1º é o preferido"],["nao","não, qualquer um serve"]])}
  ${sel("juizo","O mesmo juízo é competente para todos?",[["sim","sim"],["nao","não"]])}
  ${sel("proc","Todos seguem o mesmo procedimento?",[["sim","sim"],["nao","não: um é comum e outro especial"]])}
  <p class="calc-rot">Valor de cada pedido (R$)</p><div class="calc-l3">${num("v1","1º pedido")}${num("v2","2º pedido")}</div>`;
 return `<figure class="fig calc" data-calc="${tipo}"><figcaption>${ic("alvo")}${inl(tit)}</figcaption><p class="calc-dica">${tipo==="bem"?"Troque o bem e veja todas as classificações dele.":"Mude os dados e veja a resposta mudar na hora."}</p><div class="calc-in">${campos}</div>${calcSaida(tipo,v)}</figure>`};
const reais=n=>"R$ "+(Math.round(+n||0)).toLocaleString("pt-BR");
function calcCumulacao(v){
 const v1=+v.v1||0,v2=+v.v2||0,todos=v.quer==="todos",it=[];let ok=true,tit;
 if(v.juizo==="nao"){ok=false;it.push("✗ Sem o **mesmo juízo competente** não se cumula (art. 327, §1º, II). Ex.: alimentos (vara de família) e indenização (vara cível) vão em ações separadas.")}
 if(v.proc==="nao")it.push("Procedimentos diferentes: só cumula se o autor **optar pelo procedimento comum** na inicial (art. 327, §2º). Ex.: revisão do financiamento (comum) + consignação das parcelas (especial).");
 if(todos){
  const suc=v.dep==="sim";tit=suc?"Cumulação própria sucessiva":"Cumulação própria simples";
  it.push(suc?"O juiz só examina o 2º pedido se acolher o 1º; rejeitado o 1º, o 2º fica **prejudicado**. Ex.: investigação de paternidade + alimentos.":"Os pedidos são **independentes**: o juiz pode acolher todos, só um ou nenhum. Ex.: dano material + dano moral.");
  it.push("Os pedidos têm de ser **compatíveis** entre si (art. 327, §1º, I).");
  it.push(`**Valor da causa:** a **soma** de todos os pedidos (art. 292, VI): ${reais(v1)} + ${reais(v2)} = **${reais(v1+v2)}**.`)}
 else if(v.pref==="sim"){tit="Cumulação imprópria eventual (subsidiária)";
  it.push("O juiz só examina o 2º pedido se **não puder acolher o 1º** (art. 326, caput). Ex.: troca do produto ou, não sendo possível, devolução do dinheiro.");
  it.push("A **compatibilidade é dispensada**, porque só um pedido será acolhido (art. 327, §3º).");
  it.push("Se o juiz acolher só o subsidiário, o autor **tem interesse em recorrer** para tentar o principal.");
  it.push(`**Valor da causa:** o do **pedido principal** (art. 292, VIII): **${reais(v1)}**.`)}
 else{tit="Cumulação imprópria alternativa";
  it.push("Qualquer pedido acolhido satisfaz o autor, sem ordem de preferência (art. 326, parágrafo único). Ex.: substituição, restituição ou abatimento no vício do produto (art. 18 do CDC).");
  it.push("A **compatibilidade é dispensada** (art. 327, §3º), e o autor **não tem interesse em recorrer** se um dos pedidos for acolhido.");
  it.push(`**Valor da causa:** o do pedido de **maior valor** (art. 292, VII): **${reais(Math.max(v1,v2))}**.`);
  it.push("Não confunda com o **pedido alternativo** do art. 325: lá é um pedido só, e a obrigação pode ser cumprida de mais de um modo.")}
 return {ok,tit:ok?tit:`${tit}: não cabe neste processo`,it}}
calcResultado=function(tipo,v){
 if(tipo==="bem"){const b=BENS_CALC[v.item]||BENS_CALC.heranca;return {ok:null,tit:b[0],it:b[1]}}
 if(tipo==="cumul")return calcCumulacao(v);
 return _calcResultadoBase(tipo,v)};
