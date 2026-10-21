/* Agrupamento dos assuntos das questões em tópicos maiores, para o desempenho por assunto.
   Formato: matéria -> "Tópico: assunto; assunto; ...". Assunto sem grupo aparece com o próprio nome. */
window.GRUPOS_ASS={
etica:`Honorários: Honorários
Prerrogativas e imunidade: Prerrogativas; Imunidade profissional
Inscrição e atividade de advocacia: Inscrição; Atividade de advocacia; Estagiário; Advocacia pública; OAB
Incompatibilidades e impedimentos: Incompatibilidades; Impedimentos
Infrações, sanções e processo disciplinar: Infrações e sanções; Sanções; Processo disciplinar
Mandato e deveres éticos: Mandato; Código de Ética; Deveres éticos; Conflito de interesses; Independência; Responsabilidade; Advocacia pro bono; Sigilo profissional
Publicidade: Publicidade
Advogado empregado e sociedades: Advogado empregado; Sociedade de advogados`,
filo:`Filosofia clássica e medieval: Platão; Aristóteles; Agostinho; Tomás de Aquino; Estoicos; Ética; Justiça
Contratualistas: Hobbes; Locke; Rousseau; Montesquieu
Kant, utilitarismo e críticos: Kant; Utilitarismo; Marxismo; Nietzsche
Jusnaturalismo e positivismo: Kelsen; Hart; Bobbio; Positivismo; Jusnaturalismo; Radbruch
Pós-positivismo: Dworkin; Alexy; Pós-positivismo; Habermas
Teorias da justiça: Rawls; Nozick; Comunitarismo
Argumentação e hermenêutica: Argumentação; Hermenêutica; Retórica; Tópica`,
const:`Teoria da Constituição e poder constituinte: Teoria da Constituição; Princípios fundamentais; Hermenêutica; Poder constituinte; Emendas
Direitos fundamentais: Direitos fundamentais; Direitos sociais
Nacionalidade e direitos políticos: Nacionalidade; Direitos políticos
Remédios constitucionais: Remédios constitucionais
Organização do Estado: Competências; Intervenção; Bens públicos; Organização do Estado
Poder Legislativo e processo legislativo: Poder Legislativo; Processo legislativo; Fiscalização
Poder Executivo: Poder Executivo
Poder Judiciário e funções essenciais: Poder Judiciário; Ministério Público; Funções essenciais
Controle de constitucionalidade: Controle de constitucionalidade
Defesa do Estado e ordem social: Defesa do Estado; Segurança pública; Ordem econômica; Ordem social`,
dh:`Sistema interamericano: Convenção Americana; Corte IDH; Sistema interamericano; Controle de convencionalidade
Sistema global (ONU e TPI): Sistema global; Sistema ONU; Tribunal Penal Internacional
Tratados no Brasil e federalização: Incorporação de tratados; Federalização; Instituições
Teoria dos direitos humanos: Características; Gerações; Princípios; Desenvolvimento
Grupos vulneráveis: Crianças; Igualdade racial; Migração; Mulheres; Pessoa com deficiência; Pessoa idosa; Povos indígenas; Refugiados; Trabalho escravo; Tortura`,
eleit:`Direitos políticos e elegibilidade: Alistamento; Analfabeto; Condições de elegibilidade; Direitos políticos; Elegibilidade; Idade mínima; Inelegibilidade; Inelegibilidade reflexa; Desincompatibilização; Reeleição; Súmula Vinculante 18; Vacância; Candidaturas
Partidos e sistema eleitoral: Partidos políticos; Federações; Coligações; Fidelidade partidária; Sistema eleitoral; Sistema proporcional; Financiamento
Propaganda e condutas vedadas: Propaganda; Pesquisas; Condutas vedadas; Captação ilícita de sufrágio; Calendário; Anterioridade eleitoral
Justiça Eleitoral, ações e crimes: Justiça Eleitoral; Ações eleitorais; AIME; Recursos; Crimes eleitorais`,
inter:`Direito internacional privado: LINDB; Competência internacional; Homologação; Cooperação; Cooperação jurídica; Documentos; Crianças; Direito interno
Tratados e fontes: Tratados; Tratados no Brasil; Fontes; Jus cogens; Princípios; Responsabilidade internacional
Nacionalidade, migração e extradição: Nacionalidade; Migração; Extradição; Asilo; Refúgio; Apatridia
Organizações e relações diplomáticas: Organizações internacionais; ONU; Mercosul; Comércio internacional; Diplomacia; Imunidade; Imunidade de jurisdição; Direito do mar; Espaços`,
fin:`Orçamento público: Leis orçamentárias; LOA; Princípios orçamentários; Processo orçamentário; Exclusividade; Não afetação; Emendas; Créditos adicionais; Vedações; Gastos mínimos
Receita, despesa e dívida: Receitas; Despesa pública; Regime contábil; Repartição de receitas; Dívida ativa; Dívida pública; Regra de ouro
Lei de Responsabilidade Fiscal: LRF
Fiscalização e Tribunais de Contas: Fiscalização; Tribunal de Contas
Precatórios e RPV: Precatórios; RPV`,
trib:`Princípios tributários: Anterioridade; Legalidade; Irretroatividade; Não confisco
Imunidades: Imunidades
Competência e espécies de tributo: Competência tributária; Competência residual; Conceito de tributo; Espécies tributárias; Contribuições; Empréstimo compulsório; Taxas; Iluminação pública; Normas gerais; Reforma tributária
Impostos em espécie: ICMS; Imposto de Renda; IPTU; ISS; ITBI; ITR; IPVA; ITCMD; IPI
Obrigação e responsabilidade tributária: Obrigação tributária; Sujeição passiva; Solidariedade; Responsabilidade; Responsabilidade tributária; Responsabilidade do sócio; Denúncia espontânea
Crédito tributário: Crédito tributário; Constituição do crédito; Lançamento; Suspensão da exigibilidade; Extinção do crédito; Exclusão do crédito; Garantias do crédito; Decadência; Prescrição; Compensação; Restituição; Repetição de indébito; Penalidades tributárias
Processo tributário: Processo tributário; Execução fiscal`,
adm:`Princípios e poderes: Princípios; Poderes; Poderes administrativos; Poder de polícia; Abuso de poder; Nepotismo
Organização da Administração: Administração indireta; Consórcios públicos; Terceiro setor
Atos administrativos: Atos administrativos; Atributos do ato; Anulação; Revogação
Licitações e contratos: Licitações; Contratação direta; Contratos
Serviços públicos e concessões: Serviços públicos; Concessões; Parcerias público-privadas
Servidores públicos: Servidores públicos; Acumulação de cargos; Estabilidade
Responsabilidade do Estado: Responsabilidade civil do Estado; Responsabilidade do Estado; Prescrição
Improbidade, controle e processo: Improbidade; Lei Anticorrupção; Controle; Acesso à informação; Processo administrativo; Recurso administrativo
Bens públicos e intervenção na propriedade: Bens públicos; Desapropriação; Intervenção na propriedade`,
amb:`Princípios, Constituição e competências: Constituição; Meio ambiente na Constituição; Princípios; Competência; LC 140/2011; PNMA; SISNAMA
Licenciamento e EIA: Licenciamento; EIA
Código Florestal: Código Florestal; Reserva legal; Propter rem
Unidades de conservação: SNUC; Unidades de conservação
Responsabilidade ambiental: Responsabilidade; Responsabilidade civil; Responsabilidade penal; Ônus da prova; Prescrição; Jurisprudência
Crimes ambientais: Crimes ambientais
Recursos hídricos e resíduos: Recursos hídricos; Resíduos sólidos`,
civil:`Pessoas: Pessoa natural; Capacidade; Ausência; Direitos da personalidade; Domicílio; Pessoa jurídica; Associações; Fundações
Bens: Bens; Bem de família
Negócio jurídico: Negócio jurídico; Defeitos; Defeitos do negócio jurídico; Invalidade; Condição; Termo; Objeto
Prescrição e decadência: Prescrição; Decadência
Obrigações: Obrigações; Obrigação alternativa; Obrigação de fazer; Obrigação de não fazer; Solidariedade; Pagamento; Pagamento indevido; Extinção das obrigações; Transmissão; Inadimplemento; Cláusula penal; Enriquecimento sem causa; Extinção
Responsabilidade civil: Responsabilidade civil; Atos ilícitos
Contratos em geral: Contratos; Formação; Formação dos contratos; Princípios contratuais; Contrato com pessoa a declarar; Contrato de adesão; Contrato preliminar; Contratos atípicos; Estipulação; Evicção
Contratos em espécie: Compra e venda; Promessa de compra e venda; Troca; Doação; Locação; Empréstimo; Depósito; Mandato; Corretagem; Transporte; Seguro; Fiança; Empreitada; Prestação de serviço; Transação
Posse: Posse; Composse; Ações possessórias
Propriedade e usucapião: Propriedade; Usucapião; Acessão; Descoberta; Perda da propriedade; Propriedade móvel; Propriedade resolúvel; Propriedade fiduciária; Alienação fiduciária; Vizinhança; Condomínio; Condomínio edilício; Laje
Direitos reais sobre coisa alheia: Direitos reais; Superfície; Servidão; Usufruto; Habitação; Hipoteca; Direitos reais de garantia
Família: Família; Casamento; Divórcio; União estável; Regime de bens; Filiação; Poder familiar; Alienação parental; Alimentos; Curatela
Sucessões: Sucessões; Sucessão legítima; Testamento; Codicilo; Colação; Herança jacente; Inventário`,
eca:`Adoção e família substituta: Adoção; Adoção internacional; Família substituta; Guarda; Tutela; Apadrinhamento; Entrega voluntária; Família; Acolhimento; Convivência familiar
Ato infracional e medidas socioeducativas: Ato infracional; Medidas socioeducativas; Internação; Remissão; Maioridade
Direitos e proteção integral: Conceitos; Direitos fundamentais; Prioridade absoluta; Proteção integral; Trabalho; Viagem
Conselho Tutelar e Justiça da Infância: Conselho Tutelar; Competência; Procedimentos; Recursos; Crimes; Crimes do ECA; Jurisprudência`,
cdc:`Conceitos e direitos básicos: Conceitos; Consumidor; Direitos básicos; Ônus da prova; Serviços públicos; Instituições financeiras
Responsabilidade por fato e vício: Fato do produto; Fato do serviço; Vício do produto; Vício do serviço; Fortuito interno; Responsabilidade; Garantia; Decadência; Prazos; Recall; Desconsideração
Práticas comerciais: Oferta; Publicidade; Práticas abusivas; Cobrança; Cobrança indevida; Cadastros; Banco de dados; Arrependimento
Proteção contratual e superendividamento: Cláusulas abusivas; Contrato de adesão; Compra a prestação; Crédito; Superendividamento
Tutela coletiva e sanções: Tutela coletiva; Competência; Crimes; Sanções; Jurisprudência`,
emp:`Empresário e estabelecimento: Empresário; Capacidade; Registro; Escrituração; Nome empresarial; Estabelecimento; Microempresa
Propriedade industrial: Propriedade industrial
Sociedades: Sociedades; Sociedade limitada; Sociedade simples; Sociedade anônima; Sociedades por ações; Sociedade entre cônjuges; Operações societárias; Desconsideração
Títulos de crédito: Títulos de crédito; Aval; Endosso; Cheque; Duplicata; Nota promissória; Letra de câmbio
Falência e recuperação: Falência; Recuperação judicial; Recuperação extrajudicial
Contratos empresariais: Contratos empresariais`,
pc:`Normas fundamentais e jurisdição: Normas fundamentais; Jurisdição; Jurisdição voluntária; Ação; Processo; Formas de solução; Negócios processuais
Competência: Competência
Partes, juiz e terceiros: Capacidade; Deveres das partes; Gratuidade; Litisconsórcio; Intervenção de terceiros; Desconsideração; Juiz; Ministério Público; Defensoria Pública; Fazenda Pública
Atos processuais e prazos: Atos do juiz; Comunicação dos atos; Prazos; Nulidades; Valor da causa; Suspensão; Extinção
Tutela provisória: Tutela de urgência; Tutela provisória
Procedimento comum: Petição inicial; Indeferimento; Pedido; Audiência; Audiência de conciliação; Contestação; Resposta do réu; Revelia; Providências preliminares; Julgamento conforme o estado; Saneamento
Provas: Provas
Sentença e coisa julgada: Sentença; Coisa julgada; Ação rescisória; Remessa necessária
Recursos e precedentes: Recursos; Teoria dos recursos; Apelação; Agravo de instrumento; Agravo interno; Embargos de declaração; Embargos de divergência; Recursos especiais; Recursos repetitivos; Técnica de julgamento; Precedentes; Assunção de competência; Reclamação
Execução e cumprimento de sentença: Execução; Cumprimento de sentença; Liquidação; Penhora; Expropriação; Defesas do executado; Fraude à execução; Execução de alimentos; Obrigação de fazer; Embargos de terceiro; Monitória
Procedimentos especiais e processo coletivo: Procedimentos especiais; Processo coletivo`,
penal:`Princípios e aplicação da lei penal: Princípios; Aplicação da lei penal; Lei penal no espaço; Lei penal no tempo; Imunidades
Fato típico: Teoria do crime; Classificação; Causalidade; Dolo; Culpa; Omissão; Resultado agravador; Iter criminis; Tentativa; Crime impossível; Erro
Ilicitude e culpabilidade: Ilicitude; Excludentes de ilicitude; Culpabilidade; Imputabilidade
Concurso de pessoas e de crimes: Concurso de pessoas; Concurso de crimes
Penas e execução: Espécies de pena; Penas restritivas; Multa; Dosimetria; Atenuantes; Concurso de circunstâncias; Reincidência; Regimes; Sursis; Livramento condicional; Efeitos da condenação; Reabilitação; Medida de segurança; Execução; Perdão judicial; Indulto
Prescrição e extinção da punibilidade: Prescrição; Extinção da punibilidade; Imprescritibilidade; Prazos
Crimes contra a pessoa: Crimes contra a vida; Crimes contra a pessoa; Homicídio; Aborto; Lesão corporal; Vida; Periclitação; Honra; Crimes contra a honra; Liberdade individual; Liberdade pessoal; Dignidade sexual
Crimes contra o patrimônio: Crimes contra o patrimônio; Patrimônio; Furto; Roubo; Extorsão; Estelionato; Apropriação
Crimes contra a Administração e leis especiais: Administração pública; Crimes contra a Administração; Administração da justiça; Fé pública; Paz pública; Drogas; Trânsito; Leis penais especiais; Violência doméstica; Crimes contra o Estado Democrático`,
pp:`Inquérito e investigação: Inquérito; Juiz das garantias; Acordo de não persecução
Ação penal: Ação penal; Ação penal privada; Ação civil; Vítima
Competência: Competência
Questões e processos incidentes: Questões e processos incidentes
Provas: Provas
Prisões e medidas cautelares: Prisões; Prisão preventiva; Prisão domiciliar; Flagrante; Audiência de custódia; Liberdade provisória; Fiança; Medidas cautelares
Procedimentos e júri: Procedimento; Procedimentos; Júri; Juizados; Citação; Violência doméstica; Sentença; Nulidades
Recursos e ações autônomas: Recursos; Ações autônomas; Habeas corpus; Revisão criminal; Execução penal`,
prev:`Seguridade social e custeio: Seguridade social; Princípios; Custeio; Assistência social; BPC; Previdência complementar; RPPS
Segurados, dependentes e carência: Segurados; Segurado facultativo; Qualidade de segurado; Período de graça; Dependentes; Carência
Aposentadorias: Aposentadoria; Aposentadoria do professor; Professor; Aposentadoria especial; Aposentadoria por incapacidade; Cálculo; Contagem recíproca; Acumulação
Auxílios, pensão e salários: Benefícios; Auxílio por incapacidade; Incapacidade; Auxílio-acidente; Acidente do trabalho; Auxílio-reclusão; Pensão por morte; Salário-família; Salário-maternidade
Processo previdenciário: Competência; Decadência; Prescrição; Prescrição e decadência; Requerimento administrativo; Jurisprudência`,
trab:`Relação de emprego: Relação de emprego; Contrato de trabalho; Carteira de Trabalho; Empregador; Grupo econômico; Terceirização; Doméstico; Aprendiz; Trabalho intermitente; Teletrabalho
Jornada e intervalos: Jornada; Intervalo; Intervalos; Trabalho noturno; Tempo à disposição
Remuneração e FGTS: Remuneração; Salário; Adicionais; Equiparação salarial; FGTS
Férias: Férias
Alteração do contrato e estabilidade: Alteração do contrato; Transferência; Estabilidade; Suspensão e interrupção
Maternidade, paternidade e menor: Proteção à maternidade; Licença-paternidade; Trabalho do menor
Extinção do contrato: Extinção; Extinção do contrato; Extinção por acordo; Justa causa; Rescisão indireta; Aviso prévio; Verbas rescisórias
Direito coletivo e dano extrapatrimonial: Negociação coletiva; Sindicatos; Greve; Dano extrapatrimonial`,
pt:`Competência: Competência; Exceção de incompetência; Incompetência territorial
Petição inicial, audiência e defesa: Petição inicial; Notificação; Audiência; Conciliação; Preposto; Revelia; Confissão; Jus postulandi; Desistência; Procedimentos; Rito sumaríssimo
Provas: Provas; Ônus da prova
Prazos, custas e honorários: Prazos; Prescrição; Prescrição intercorrente; Custas; Honorários; Justiça gratuita
Recursos: Recursos; Recurso de revista; Depósito recursal; Interlocutórias; Agravo de petição
Execução: Execução; Execução de ofício; Embargos à execução
Ações especiais: Ação rescisória; Mandado de segurança; Inquérito; Inquérito de falta grave; Dissídio coletivo; Acordo extrajudicial; Jurisdição voluntária`
};
