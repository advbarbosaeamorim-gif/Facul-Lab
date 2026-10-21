/* Auxiliar para os lotes compactos: cada item é [assunto, enunciado, [correta, errada, errada, errada], comentário, fundamento, (opcional) [por que cada errada está errada]]. */
window.addQ=function(m,t,prefixo,inicio,lista){
  lista.forEach(function(x,i){
    window.QUESTOES.push({id:prefixo+String(inicio+i).padStart(2,"0"),m:m,t:t||m,a:x[0],q:x[1],o:x[2],e:x[3],f:x[4],x:x[5]});
  });
};
