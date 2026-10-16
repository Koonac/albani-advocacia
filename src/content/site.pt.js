// Copy PT: transcrita LITERALMENTE de ../../copy.md (redator). Não parafrasear.
// Exceções escritas pelo desenvolvedor: textos de interface (aria-labels, rótulos de formulário
// não presentes na copy), meta descriptions de SEO e a mensagem padrão pré-preenchida do WhatsApp.
export default {
  meta: {
    siteName: 'Albani Advocacia',
    home: {
      title: 'Albani Advocacia | Imigração, nacionalidade e empresas em Portugal',
      description:
        'Vistos, residência, nacionalidade e empresas, conduzidos de ponta a ponta por um advogado inscrito na Ordem dos Advogados de Portugal (OA-PT) e na Ordem dos Advogados do Brasil (OAB-SC).',
    },
    about: {
      title: 'Sobre o escritório e o Dr. Ivan Albani | Albani Advocacia',
      description:
        'Escritório de advocacia com atuação no Brasil, nos EUA e em Portugal. Dr. Ivan Albani, Cédula Profissional OA 67498E · OAB/SC 62.722.',
    },
    areas: {
      title: 'Áreas de atuação | Albani Advocacia',
      description:
        'Serviços jurídicos completos para pessoas e empresas que vivem, investem ou empreendem entre Brasil e Portugal.',
    },
    blog: {
      title: 'Blog | Albani Advocacia',
      description: 'Guias práticos sobre imigração, documentos e negócios em Portugal.',
    },
    faq: {
      title: 'Perguntas frequentes | Albani Advocacia',
      description:
        'Respostas às dúvidas mais comuns sobre vistos, residência, nacionalidade portuguesa, documentos e empresas em Portugal.',
    },
    contact: {
      title: 'Contato | Albani Advocacia',
      description: 'Respondemos com rapidez. Escolha o canal mais conveniente.',
    },
  },

  whatsappDefault: 'Olá, Dr. Ivan! Gostaria de agendar uma consulta.',
  whatsappService: 'Olá, Dr. Ivan! Gostaria de falar sobre: ',

  nav: {
    home: 'Início',
    about: 'Sobre',
    areas: 'Áreas de atuação',
    blog: 'Blog',
    contact: 'Contato',
    cta: 'Agendar consulta',
    faq: 'Perguntas frequentes',
  },

  ui: {
    channels: 'Canais',
    credentials: 'Credenciais',
    mainNav: 'Navegação principal',
    skip: 'Ir para o conteúdo',
    openMenu: 'Abrir menu',
    closeMenu: 'Fechar menu',
    language: 'Idioma',
    switchTo: 'Read in English',
    playVideo: 'Reproduzir vídeo',
    prev: 'Anterior',
    next: 'Seguinte',
    minRead: 'min de leitura',
    serviceAria: 'Falar sobre este serviço:',
    backToBlog: 'Voltar ao blog',
    related: 'Outros artigos',
    newTab: '(abre numa nova aba)',
    mapTitle: 'Mapa do escritório Albani Advocacia em Palmela',
    reviewsFrom: 'Avaliação no Google',
    book: 'Agendar consulta',
    bookWa: 'Agendar consulta pelo WhatsApp',
  },

  megaMenu: {
    columns: [
      { title: 'Imigração e Nacionalidade', anchor: 'imigracao' },
      { title: 'Documentos e Registos', anchor: 'documentos' },
      { title: 'Empresarial e Societário', anchor: 'empresarial' },
      { title: 'Imobiliário e Investidores', anchor: 'imobiliario' },
      { title: 'Laboral', anchor: 'laboral' },
      { title: 'Outras áreas', anchor: 'outras' },
    ],
    footerLead: 'Não encontrou o seu caso?',
    footerLink: 'Fale com o Dr. Ivan →',
  },

  footer: {
    signature:
      'Escritório de advocacia com foco em direito imigratório e empresarial. Atuação no Brasil 🇧🇷, nos EUA 🇺🇸 e em Portugal 🇵🇹.',
    credentials: 'Dr. Ivan Albani · Cédula Profissional OA 67498E · OAB/SC 62.722',
    address: 'Estrada Nacional 379, Hab. 1, São Julião, 2950-302 Palmela, Portugal',
    whatsappPT: 'WhatsApp Portugal',
    whatsappBR: 'WhatsApp Brasil',
    instagram: 'Instagram',
    facebook: 'Facebook',
    devBy: 'Desenvolvido por',
    legal: '© Albani Advocacia. As informações deste site têm caráter informativo e não substituem uma consulta jurídica.',
    navTitle: 'Navegação',
    contactTitle: 'Contato',
    officeTitle: 'Escritório',
  },

  whatsappFloat: 'Fale com o escritório',

  home: {
    hero: {
      eyebrow: 'Advocacia luso-brasileira · Brasil · EUA · Portugal',
      headline: 'Sua vida em Portugal começa com o passo jurídico certo.',
      sub: 'Vistos, residência, nacionalidade e empresas, conduzidos de ponta a ponta por um advogado inscrito na Ordem dos Advogados de Portugal (OA-PT) e na Ordem dos Advogados do Brasil (OAB-SC).',
      ctaPrimary: 'Agendar consulta pelo WhatsApp',
      ctaSecondary: 'Ver áreas de atuação',
      proof: '★★★★★ 5,0 no Google · 46 avaliações',
      badge: { name: 'Dr. Ivan Albani', credentials: 'OA 67498E · OAB/SC 62.722' },
      photoAlt: 'Dr. Ivan Albani, advogado, de terno preto',
      mapLabels: { pt: 'Portugal', br: 'Brasil', us: 'EUA' },
    },
    video: {
      eyebrow: 'Conheça o escritório',
      title: 'Antes de decidir, ouça quem vai cuidar do seu processo.',
      iframeTitle: 'Vídeo de apresentação | Albani Advocacia',
      thumbAlt: 'Dr. Ivan Albani no escritório, em vídeo de apresentação',
    },
    stats: [
      { strong: '5,0 ★', text: 'no Google (46 avaliações)' },
      { strong: '3 países', text: 'de atuação: Brasil, EUA e Portugal' },
      { strong: 'Dupla inscrição', text: 'Ordem dos Advogados de Portugal (OA-PT) e Ordem dos Advogados do Brasil (OAB-SC)' },
      { strong: 'Atendimento', text: 'em português e inglês' },
    ],
    pains: {
      title: 'Reconhece alguma destas situações?',
      items: [
        'Seu processo está parado na AIMA há meses e ninguém responde.',
        'Precisa de um documento apostilado, traduzido ou de uma procuração, e com prazo.',
        'Quer investir ou abrir uma empresa em Portugal e não sabe por onde começar.',
        'Seu visto foi recusado ou o pedido ficou sem resposta.',
      ],
      closingStrong: 'É exatamente aqui que entramos.',
      closing: 'Cada caso começa com uma análise honesta do que é possível e do caminho mais seguro.',
      cta: 'Quero analisar o meu caso',
    },
    areas: {
      title: 'Do primeiro visto à sua empresa em Portugal.',
      intro: 'Atuamos nas questões que mais pesam na vida de quem se muda, investe ou empreende entre Brasil e Portugal.',
      link: 'Ver serviços →',
      items: [
        {
          title: 'Imigração e Nacionalidade',
          anchor: 'imigracao',
          text: 'Vistos D1 a D8, residência, reagrupamento familiar e nacionalidade portuguesa, com acompanhamento integral junto à AIMA.',
        },
        {
          title: 'Documentos e Registos',
          anchor: 'documentos',
          text: 'Troca de carta de condução, apostila de Haia, traduções certificadas, procurações e autenticações. Resolvido sem filas e sem idas e voltas.',
        },
        {
          title: 'Empresarial e Societário',
          anchor: 'empresarial',
          text: 'Abertura de empresas, holdings, startups, acordos de sócios e internacionalização, com planeamento societário e fiscal desde o primeiro dia.',
        },
        {
          title: 'Imobiliário e Investidores',
          anchor: 'imobiliario',
          text: 'Análise de imóveis, CPCV e escritura, com assessoria completa para quem investe em Portugal a partir do estrangeiro.',
        },
      ],
    },
    golden: {
      eyebrow: 'Autorização de Residência para Investimento',
      title: 'Golden Visa: residência europeia para quem investe em Portugal.',
      text: 'Para quem investe a partir de 500 mil euros em Portugal, a Autorização de Residência para Investimento abre o caminho para a nacionalidade portuguesa após 5 anos, sem obrigação de morar no país. Basta vir a Portugal pelo menos uma vez por ano.',
      bullets: [
        'Residência para você e a sua família',
        'Circulação livre no espaço Schengen',
        'Caminho para a nacionalidade portuguesa e o passaporte europeu',
        'Estruturação jurídica e fiscal do investimento do início ao fim',
      ],
      cta: 'Avaliar o meu Golden Visa',
      note: 'Requisitos, modalidades de investimento e prazos conforme a legislação em vigor à data do pedido.',
    },
    about: {
      eyebrow: 'Quem conduz o seu caso',
      title: 'Dr. Ivan Albani',
      text: 'Advogado inscrito na Ordem dos Advogados de Portugal (OA-PT) e na Ordem dos Advogados do Brasil (OAB-SC), o Dr. Ivan conhece por dentro os dois sistemas jurídicos e a realidade de quem atravessa o oceano para recomeçar ou expandir um negócio. Cada processo é acompanhado de perto, com resposta rápida e comunicação clara do início ao fim.',
      cta: 'Conheça o escritório →',
      photoAlt: 'Retrato do Dr. Ivan Albani, de terno e gravata',
    },
    steps: {
      title: 'Simples, do primeiro contato à decisão.',
      items: [
        { title: 'Conversa inicial', text: 'Você nos conta o seu caso pelo WhatsApp ou e-mail.' },
        {
          title: 'Análise e estratégia',
          text: 'Avaliamos a documentação e apresentamos o caminho mais seguro, com prazos realistas.',
        },
        {
          title: 'Execução',
          text: 'Preparamos o dossiê, damos entrada e tratamos com AIMA, Conservatórias, consulados e Finanças.',
        },
        {
          title: 'Acompanhamento',
          text: 'Você recebe atualizações a cada etapa, até o documento chegar às suas mãos.',
        },
      ],
    },
    reviews: {
      title: 'Quem confiou, recomenda.',
      sub: '5,0 ★ no Google · 46 avaliações',
      link: 'Ver todas as avaliações no Google →',
      items: [
        {
          text: 'Pedi a ajuda dele no processo de reunificação familiar e devo admitir que ele foi meu terceiro advogado. Ele conseguiu fazer o que os outros não tinham conseguido em um tempo muito curto.',
          author: 'Donya M.',
        },
        {
          text: 'Uma amiga recomendou-me o Dr. Já tinha o processo em análise há 1 ano. Tive o deferimento e 30 dias depois chegou meu título. Um advogado super comunicativo.',
          author: 'Laurete Gonçalves',
        },
        {
          text: 'Quero aqui agradecer ao Dr. Ivan Albani pela assessoria para o pedido de visto, sendo impecável a montagem do processo e também a entrega na VFS. Confiança, seriedade e transparência.',
          author: 'Cristian',
        },
        {
          text: 'Esteve acompanhando meu processo de perto, sempre atualizando, uma comunicação sempre muito clara e transparente. Tanto pra quem está aqui como pra quem está no Brasil, eu super recomendo.',
          author: 'Bia Foi Ver',
        },
        {
          text: 'Fui muito bem atendido pelo Dr. Ivan. A princípio foi muito assertivo nas suas análises do processo; os resultados iniciais foram exatamente como ele previu.',
          author: 'Thelcyo',
        },
        {
          text: 'Encontrar um advogado competente é ótimo, mas encontrar um com tanta ética, empatia e retidão é raro.',
          author: 'Juliane Souza',
        },
        {
          text: 'Gostaria de agradecer ao Dr. Ivan por nos ter auxiliado com o nosso visto D1 para Portugal. Ele nos ajudou com tudo, muito atencioso.',
          author: 'Célia Tomaz',
        },
        {
          text: 'Não conseguia de forma alguma um novo agendamento para a minha renovação de residência. Porém o Dr. Ivan conseguiu resolver com muita rapidez.',
          author: 'Sâmela Sauss',
        },
      ],
    },
    blog: {
      title: 'Guias para decidir com segurança.',
      link: 'Ver todos os artigos →',
    },
    final: {
      title: 'Seu próximo passo em Portugal merece segurança jurídica.',
      text: 'Conte o seu caso e receba uma orientação clara sobre o melhor caminho.',
      ctaPrimary: 'Agendar consulta pelo WhatsApp',
      ctaSecondary: 'Enviar e-mail',
    },
  },

  about: {
    eyebrow: 'O escritório',
    headline: 'Advocacia entre dois continentes, com um único compromisso: o seu resultado com segurança.',
    intro:
      'Somos um escritório de advocacia com atuação no Brasil, nos EUA e em Portugal, comprometidos em oferecer serviços jurídicos e compliance empresarial de excelência. Nossa missão é auxiliar indivíduos e empresas a navegarem com segurança e confiança no universo jurídico luso-brasileiro.',
    ivan: {
      title: 'Dr. Ivan Albani',
      credentials: 'Cédula Profissional OA 67498E · OAB/SC 62.722',
      text: 'Com inscrição na Ordem dos Advogados de Portugal (OA-PT) e na Ordem dos Advogados do Brasil (OAB-SC), o Dr. Ivan Albani acompanha pessoalmente cada processo, da análise inicial à entrega do documento. A atuação concentra-se em imigração e nacionalidade e em direito empresarial e societário, área em que apoia empreendedores e investidores a estruturarem negócios em Portugal com planeamento jurídico e fiscal desde o início.',
      photoAlt: 'Retrato do Dr. Ivan Albani, de terno e gravata',
    },
    valuesTitle: 'Valores',
    values: [
      { title: 'Honestidade', text: 'Dizemos o que é possível e o que não é, antes de qualquer compromisso.' },
      { title: 'Clareza', text: 'Linguagem simples, prazos realistas e atualizações a cada etapa.' },
      { title: 'Fidelidade', text: 'Ao seu lado até o fim do processo, sem desamparo.' },
      { title: 'Confiança', text: 'Sigilo profissional e responsabilidade em cada documento que assinamos.' },
    ],
    whereTitle: 'Onde atuamos',
    where: [
      { flag: '🇧🇷', title: 'Brasil', text: 'Inscrição na OAB/SC e apoio a quem prepara a mudança ou mantém interesses no Brasil.' },
      { flag: '🇺🇸', title: 'EUA', text: 'Orientação a clientes e empresas com operação nos Estados Unidos.' },
      { flag: '🇵🇹', title: 'Portugal', text: 'Sede em Palmela, com atendimento presencial e online em todo o país.' },
    ],
    cta: 'Agendar consulta pelo WhatsApp',
  },

  areas: {
    headline: 'Áreas de atuação',
    intro: 'Serviços jurídicos completos para pessoas e empresas que vivem, investem ou empreendem entre Brasil e Portugal.',
    serviceCta: 'Falar sobre este serviço',
    alsoLabel: 'Também',
    filterAll: 'Todos',
    categories: [
      {
        id: 'imigracao',
        title: 'Imigração e Nacionalidade',
        opening: 'Seu visto, sua residência e sua nacionalidade, com estratégia do início ao fim.',
        groups: [
          {
            title: 'Vistos de curta duração',
            items: ['Schengen de turismo', 'Negócios', 'Cultural, desportivo ou científico', 'Tratamento médico'],
          },
          {
            title: 'Vistos de estada temporária',
            items: [
              'Trabalho temporário',
              'Curso profissionalizante',
              'Estágio profissional',
              'Voluntariado',
              'Investigação científica',
              'Mobilidade CPLP',
            ],
          },
          {
            title: 'Vistos de residência',
            items: [
              'D1 Trabalho subordinado',
              'D2 Empreendedor / Startup',
              'D3 Altamente qualificados',
              'D4 Ensino superior',
              'D5 Transferência de estudos',
              'D6 Reagrupamento familiar',
              'D7 Rendimentos próprios',
              'D8 Nómadas digitais',
              'Atividade religiosa',
              'CPLP',
            ],
          },
        ],
        golden: true,
        nationality: {
          id: 'nacionalidade',
          title: 'Nacionalidade portuguesa',
          items: [
            { label: 'Naturalização' },
            { label: 'Descendência (filhos e netos de portugueses)' },
            { label: 'Bisnetos e gerações seguintes (quando demonstrado vínculo efetivo)', flag: 'nacionalidadeBisnetos' },
            { label: 'Atribuição' },
            { label: 'Casamento ou união de facto' },
            { label: 'Ascendência' },
            { label: 'Reaquisição por antigos portugueses' },
            { label: 'Investimento ou mérito (quando aplicável)' },
          ],
          relatedTitle: 'Serviços relacionados',
          related: [
            'planeamento estratégico',
            'dossiê documental completo',
            'ajuizamento',
            'acompanhamento nas Conservatórias',
            'recursos',
            'parecer de vínculo efetivo',
            'revisão de processos recusados',
          ],
        },
        complementary: {
          id: 'aima',
          title: 'Serviços complementares',
          items: [
            'acompanhamento integral junto à AIMA',
            'regularização documental',
            'renovação de títulos de residência',
            'recusa de entrada em aeroportos',
            'defesa em afastamento e expulsão',
            'contencioso imigratório',
          ],
        },
      },
      {
        id: 'documentos',
        title: 'Documentos e Registos',
        opening: 'Os documentos que travam a sua vida, resolvidos com rapidez.',
        highlights: [
          'Troca de carta de condução estrangeira',
          'Apostila de Haia e legalização',
          'Traduções jurídicas certificadas',
          'Reconhecimento de assinaturas',
          'Autenticação de documentos',
          'Procurações nacionais e internacionais',
        ],
        also: ['NIF (singular e coletivo)', 'NISS', 'Número de Utente do SNS', 'Representação fiscal', 'Atualização de dados fiscais'],
      },
      {
        id: 'empresarial',
        title: 'Empresarial e Societário',
        opening: 'Estruture o seu negócio em Portugal com base jurídica sólida desde o primeiro dia.',
        text: 'Da constituição da empresa ao planeamento de holdings e à preparação para IPO, desenhamos a estrutura societária e fiscal que protege o seu património e permite crescer com segurança na Europa.',
        groups: [
          {
            items: [
              'Abertura de empresas (unipessoais e pluripessoais)',
              'Sociedades anónimas',
              'Startups',
              'Holdings',
              'Planeamento para IPO',
              'Acordos de sócios',
              'Cessão de quotas',
              'Fusões e cisões',
              'Governança e compliance',
              'Reestruturação',
              'Marcas e patentes',
              'Contratos internacionais',
              'Internacionalização',
              'Due diligence',
              'Insolvência',
              'Assessoria contínua (avença)',
            ],
          },
        ],
        cta: 'Planear a minha empresa em Portugal',
      },
      {
        id: 'imobiliario',
        title: 'Imobiliário e Investidores',
        opening: 'Invista em imóveis em Portugal sabendo exatamente o que está a comprar.',
        featured: 'Assessoria a investidores estrangeiros',
        groups: [
          {
            items: [
              'Análise documental e de ónus',
              'CPCV',
              'Acompanhamento de escrituras',
              'Regularização predial',
              'Arrendamento urbano e comercial',
              'Contencioso e mediação imobiliária',
              'Usucapião',
            ],
          },
        ],
      },
      {
        id: 'laboral',
        title: 'Laboral',
        opening: 'Equipas em conformidade, empresa protegida.',
        text: 'Atuamos sobretudo ao lado de empresas, com compliance laboral e acompanhamento mensal, e também na defesa de trabalhadores.',
        featured: 'Compliance laboral',
        groups: [
          {
            items: [
              'Contratos de trabalho e para estrangeiros',
              'Acompanhamento mensal a empresas',
              'Processos disciplinares',
              'Rescisões e negociações',
              'Segurança Social',
              'Representação junto à ACT',
              'Contencioso laboral',
            ],
          },
        ],
      },
      {
        id: 'outras',
        title: 'Outras áreas',
        groups: [
          {
            title: 'Contencioso administrativo e fiscal',
            items: ['impugnações', 'execuções fiscais', 'reclamações graciosas', 'contraordenações'],
          },
          { title: 'Notarial e contratual', items: ['escrituras', 'contratos civis e comerciais', 'MoU', 'pareceres'] },
          { title: 'Direito penal', items: ['defesa criminal', 'crimes económicos e fiscais', 'recursos'] },
          {
            items: [
              'Família e sucessões',
              'Planeamento sucessório internacional',
              'Mediação e arbitragem',
              'RGPD',
              'Consumidor',
              'Direito digital',
              'ONGs e instituições religiosas',
            ],
          },
        ],
      },
    ],
  },

  blog: {
    headline: 'Blog',
    intro: 'Guias práticos sobre imigração, documentos e negócios em Portugal.',
    all: 'Todos',
    readMore: 'Leia mais',
    authorName: 'Dr. Ivan Albani',
    authorAvatar: '/img/dr-ivan-avatar-96.webp',
    share: 'Compartilhe',
    shareOn: 'Compartilhar no',
    endCtaTitle: 'Tem dúvidas sobre o seu caso?',
    endCta: 'Agendar consulta pelo WhatsApp',
    filterLabel: 'Filtrar artigos por categoria',
  },

  faq: {
    eyebrow: 'Perguntas frequentes',
    title: 'Dúvidas comuns, respostas claras.',
    intro: 'Reunimos as perguntas que mais recebemos. Se a sua não estiver aqui, fale connosco.',
    more: 'Ver todas as perguntas →',
    ctaLead: 'Não encontrou a resposta?',
    items: [
      {
        q: 'Preciso de estar em Portugal para iniciar o meu processo?',
        a: 'Não. Grande parte do trabalho pode ser feita à distância: a análise do caso, a preparação do dossiê e o acompanhamento junto às entidades. Atendemos clientes no Brasil, nos EUA e em Portugal, presencialmente em Palmela ou online.',
      },
      {
        q: 'Como funciona a primeira consulta?',
        a: 'Você agenda um horário, conta-nos o seu caso e analisamos a documentação disponível. Na consulta apresentamos o caminho mais seguro, os prazos realistas e o que será necessário para avançar.',
      },
      {
        q: 'Qual visto é o mais indicado para o meu caso?',
        a: 'Depende do motivo da mudança, da sua fonte de rendimento e da sua situação familiar. Os vistos D1 a D8 têm requisitos diferentes. Por isso, a escolha é feita depois de uma análise individual.',
      },
      {
        q: 'O meu processo está parado na AIMA. O que pode ser feito?',
        a: 'Avaliamos a fase do processo e os prazos legais aplicáveis e indicamos as medidas possíveis, administrativas ou judiciais, para que o pedido volte a andar.',
      },
      {
        q: 'Sou neto de portugueses. Posso pedir a nacionalidade portuguesa?',
        a: 'Em muitos casos, sim. Netos de portugueses podem pedir a nacionalidade, desde que cumpridos os requisitos legais. Verificamos a documentação da sua linha familiar e preparamos o pedido junto às Conservatórias.',
      },
      {
        q: 'Vocês tratam de apostila de Haia, traduções e procurações?',
        a: 'Sim. Tratamos de apostila e legalização, traduções jurídicas certificadas, procurações, reconhecimento de assinaturas e autenticação de documentos, para que os seus documentos tenham validade no país onde serão usados.',
      },
      {
        q: 'Posso abrir uma empresa em Portugal morando no Brasil ou nos EUA?',
        a: 'Sim. Acompanhamos a constituição da empresa, a obtenção do NIF, a estrutura societária e o planeamento fiscal, mesmo que você ainda não viva em Portugal.',
      },
      {
        q: 'Em que idiomas é feito o atendimento?',
        a: 'O atendimento é feito em português e em inglês.',
      },
    ],
  },

  contact: {
    headline: 'Vamos conversar sobre o seu caso.',
    intro: 'Respondemos com rapidez. Escolha o canal mais conveniente.',
    cards: [
      { key: 'waPT', title: 'WhatsApp Portugal', value: '+351 931 759 247', button: 'Conversar agora' },
      { key: 'waBR', title: 'WhatsApp Brasil', value: '+55 48 98458-6987', button: 'Conversar agora' },
      { key: 'email', title: 'E-mail', value: 'juridico@albaniadv.com', button: 'Enviar e-mail' },
      { key: 'instagram', title: 'Instagram', value: '@albaniadvocacia', button: 'Seguir' },
    ],
    officeTitle: 'Escritório',
    office: 'Estrada Nacional 379, Hab. 1, São Julião, 2950-302 Palmela, Portugal',
    directions: 'Como chegar',
    googleProfile: 'Ver no Google Maps',
    form: {
      name: 'Nome',
      country: 'País onde está',
      subject: 'Assunto',
      subjectPlaceholder: 'Selecione uma área',
      message: 'Mensagem',
      consent: 'Autorizo o uso destes dados apenas para responder ao meu contacto.',
      submit: 'Enviar pelo WhatsApp',
      required: 'Preencha o nome, o assunto e a mensagem, e marque a autorização para continuar.',
      waIntro: 'Olá, Dr. Ivan!',
      waName: 'Nome',
      waCountry: 'País',
      waSubject: 'Assunto',
      waMessage: 'Mensagem',
    },
  },
}
