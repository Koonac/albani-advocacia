// Copy PT: transcrita LITERALMENTE de ../../copy.md (redator). Não parafrasear.
// Exceções escritas pelo desenvolvedor: textos de interface (aria-labels, rótulos de formulário
// não presentes na copy), meta descriptions de SEO e a mensagem padrão pré-preenchida do WhatsApp.
export default {
  meta: {
    siteName: 'Albani Advocacia',
    // Títulos até ~60 caracteres e descriptions até ~160, com as buscas principais no início.
    // `keywords` alimenta a meta keywords (ignorada pelo Google, lida por Bing e outros buscadores).
    home: {
      title: 'Advogado em Portugal para Brasileiros | Albani Advocacia',
      description:
        'Advogado em Portugal para brasileiros, inscrito na Ordem dos Advogados e na OAB: vistos D7 e D8, residência, nacionalidade portuguesa, AIMA e empresas.',
      keywords:
        'advogado em Portugal para brasileiros, advogado em Portugal, advogado brasileiro em Portugal, advogado de imigração Portugal, morar em Portugal, visto para Portugal, visto D7, visto D8, nacionalidade portuguesa, autorização de residência, AIMA, abrir empresa em Portugal',
    },
    about: {
      title: 'Dr. Ivan Albani | Advogado em Portugal e no Brasil',
      description:
        'Conheça o Dr. Ivan Albani, advogado inscrito na Ordem dos Advogados de Portugal (67498E) e na OAB/SC (62.722), com atuação em imigração, nacionalidade e direito empresarial.',
      keywords:
        'Ivan Albani, Dr. Ivan Albani, advogado luso-brasileiro, advogado OA e OAB, escritório de advocacia em Portugal, advogado em Palmela, Albani Advocacia',
    },
    areas: {
      title: 'Vistos, Nacionalidade e Empresas em Portugal | Albani',
      description:
        'Vistos D1 a D8, golden visa, autorização de residência, nacionalidade portuguesa, apostila de Haia, abertura de empresa, holding e imobiliário em Portugal.',
      keywords:
        'vistos para Portugal, visto de trabalho Portugal, visto D2 empreendedor, visto D7, visto D8 nómada digital, golden visa Portugal, reagrupamento familiar, nacionalidade portuguesa, apostila de Haia, abrir empresa em Portugal, holding em Portugal, comprar imóvel em Portugal',
    },
    blog: {
      title: 'Blog sobre Imigração em Portugal | Albani Advocacia',
      description:
        'Guias práticos para morar em Portugal: vistos, processos na AIMA, nacionalidade portuguesa, apostila de Haia, carta de condução e como abrir empresa em Portugal.',
      keywords:
        'como morar em Portugal, imigração Portugal, guia visto Portugal, processo AIMA, nacionalidade portuguesa para netos, troca de carta de condução, apostila de Haia, golden visa',
    },
    faq: {
      title: 'Dúvidas sobre Imigração em Portugal | Albani Advocacia',
      description:
        'Respostas às dúvidas mais comuns sobre imigração em Portugal: vistos, regularização, CPLP, renovação da residência, processos na AIMA e reagrupamento familiar.',
      keywords:
        'dúvidas imigração Portugal, visto ou autorização de residência, autorização de residência CPLP, renovação de residência AIMA, reagrupamento familiar Portugal, regularização em Portugal',
    },
    contact: {
      title: 'Contato | Advogado em Palmela, Portugal | Albani Advocacia',
      description:
        'Agende uma consulta com advogado em Portugal pelo WhatsApp de Portugal ou do Brasil, ou por e-mail. Escritório em Palmela, distrito de Setúbal.',
      keywords:
        'contato advogado Portugal, consulta advogado imigração, advogado Palmela, advogado Setúbal, WhatsApp advogado Portugal',
    },
    // Meta keywords dos artigos, por categoria (somadas ao título do artigo)
    categoryKeywords: {
      imigracao: 'imigração Portugal, visto para Portugal, autorização de residência, AIMA',
      nacionalidade: 'nacionalidade portuguesa, cidadania portuguesa, passaporte português',
      documentos: 'documentos para Portugal, apostila de Haia, reconhecimento de documentos',
      empresas: 'abrir empresa em Portugal, empresa em Portugal, direito empresarial Portugal',
      investimento: 'investir em Portugal, golden visa Portugal, imóveis em Portugal',
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
    close: 'Fechar',
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
      eyebrow: 'Brasil · Portugal · Estados Unidos',
      headline: 'Seu próximo passo começa com',
      headlineEm: 'orientação jurídica.',
      lead: 'Para viver e empreender em Portugal ou nos Estados Unidos.',
      description:
        'Imigração, nacionalidade e negócios em Portugal. Vistos de imigrante e de não imigrante e abertura de LLC nos Estados Unidos.',
      ctaSecondary: 'Fale com o escritório',
      credential: 'Advogado inscrito no Brasil e em Portugal',
      credentialNumbers: 'OA 67498E · OAB/SC 62.722',
      proof: '★★★★★ {nota} no Google · {total} avaliações',
      badge: { name: 'Dr. Ivan Albani', role: 'Imigração e direito empresarial' },
      scrollNote: 'Conheça nossas áreas',
      photoAlt: 'Dr. Ivan Albani, advogado luso-brasileiro em Portugal, de terno preto',
      mapLabels: { pt: 'Portugal', br: 'Brasil', us: 'EUA' },
    },
    video: {
      eyebrow: 'Conheça o escritório',
      title: 'Antes de decidir, ouça quem vai cuidar do seu processo.',
      iframeTitle: 'Vídeo de apresentação | Albani Advocacia',
      thumbAlt: 'Dr. Ivan Albani no escritório, em vídeo de apresentação',
      mainLabel: 'Apresentação do escritório',
      more: 'Mais vídeos',
    },
    stats: [
      { strong: '{nota} ★', text: 'no Google ({total} avaliações)' },
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
    services: {
      eyebrow: 'Áreas de atuação',
      title: 'Novos caminhos.',
      titleEm: 'Decisões bem orientadas.',
      intro: 'Encontre o atendimento para o seu momento — da mudança de país à estruturação de um negócio.',
      cardLink: 'Conhecer o serviço',
      footLead: 'Não encontrou o que procura?',
      footLink: 'Conte seu caso ao escritório →',
      dialogNote: 'O escopo, os responsáveis por cada etapa e as condições são definidos antes da contratação.',
      items: [
        {
          country: 'Portugal',
          title: 'Imigração e nacionalidade',
          summary: 'Vistos, residência, reagrupamento familiar e nacionalidade portuguesa.',
          description:
            'Analisamos seu objetivo e a documentação para identificar o enquadramento adequado. O atendimento pode envolver preparação do pedido, acompanhamento e análise de questões relacionadas à residência e à nacionalidade.',
          bullets: ['Análise da situação e dos documentos', 'Preparação das etapas contratadas', 'Orientação durante o procedimento'],
        },
        {
          country: 'Portugal',
          title: 'Empresas e negócios',
          summary: 'Constituição de empresas, contratos, estrutura societária e compliance jurídico.',
          description:
            'Apoiamos empreendedores na organização jurídica dos seus negócios em Portugal. O trabalho é definido conforme o projeto, a estrutura pretendida e as necessidades da empresa.',
          bullets: ['Constituição e organização societária', 'Contratos e acordos de sócios', 'Assessoria empresarial e compliance'],
        },
        {
          country: 'Documentação',
          title: 'Documentos e registos',
          summary: 'Procurações, autenticações, apostilas e documentação para diferentes procedimentos.',
          description:
            'A documentação necessária varia conforme o país e a entidade que irá recebê-la. A análise inicial permite conferir a finalidade do documento e os serviços necessários.',
          bullets: ['Procurações e autenticações', 'Apostila e legalização documental', 'Orientação sobre documentos e registos'],
        },
        {
          country: 'Portugal',
          title: 'Imobiliário e investidores',
          summary: 'Análise documental e acompanhamento jurídico em operações imobiliárias.',
          description:
            'Apoiamos a análise jurídica de operações imobiliárias em Portugal, com atenção à documentação, aos contratos e às responsabilidades envolvidas.',
          bullets: ['Análise documental do imóvel', 'Contratos e acompanhamento de escrituras', 'Orientação para investidores'],
        },
        {
          country: 'Estados Unidos',
          title: 'Vistos americanos',
          summary: 'Assessoria em vistos de imigrante e de não imigrante, conforme seu objetivo.',
          description:
            'Atendemos interessados em vistos de imigrante e de não imigrante para os Estados Unidos. O primeiro passo é compreender o objetivo da mudança ou viagem e o perfil do interessado. As categorias atendidas e o escopo da assessoria são confirmados na análise inicial.',
          bullets: ['Compreensão do objetivo e do perfil', 'Orientação sobre a documentação', 'Definição do escopo da assessoria'],
        },
        {
          country: 'Estados Unidos',
          title: 'Abertura de LLC',
          summary: 'Apoio à constituição de empresas LLC, com escopo definido para cada contratação.',
          description:
            'Apoiamos a abertura de empresas LLC nos Estados Unidos. Antes da contratação, são definidos os serviços incluídos, os custos de terceiros e as necessidades específicas do projeto. A constituição da empresa é tratada separadamente de qualquer pedido migratório.',
          bullets: ['Análise do projeto empresarial', 'Definição dos itens incluídos', 'Apoio às etapas de constituição'],
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
      title: 'Clareza em cada etapa.',
      items: [
        {
          title: 'Conte o seu caso',
          text: 'Informe seu objetivo e o serviço que procura. Orientamos os próximos passos para a consulta e os documentos necessários à análise.',
        },
        {
          title: 'Conheça as possibilidades',
          text: 'Na consulta, analisamos sua situação e esclarecemos os caminhos possíveis. O escopo do trabalho e os honorários são definidos antes da contratação.',
        },
        {
          title: 'Tenha acompanhamento',
          text: 'Após a contratação, conduzimos as etapas acordadas e orientamos sobre documentos, providências e andamento do caso.',
        },
      ],
    },
    reviews: {
      title: 'Quem confiou, recomenda.',
      sub: '{nota} ★ no Google · {total} avaliações',
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
      eyebrow: 'Conheça o advogado',
      title: 'Dr. Ivan Albani',
      credentials: 'OA 67498E · OAB/SC 62.722',
      paragraphs: [
        'Sou advogado inscrito no Brasil e em Portugal, com atuação em imigração e direito empresarial.',
        'Minha trajetória também passa pela experiência de recomeçar em outro país. Como imigrante, conheço de perto as dúvidas e decisões que acompanham essa mudança.',
        'Na Albani Advocacia, essa experiência se soma ao trabalho jurídico para orientar pessoas, famílias e empreendedores com clareza e responsabilidade.',
      ],
      photoAlt: 'Retrato do Dr. Ivan Albani, de terno e gravata',
    },
    story: {
      eyebrow: 'Minha história',
      title: 'O “Advogado dos Anjos”',
      teaser: 'Da infância difícil à construção do escritório, conheça o caminho que me trouxe até aqui.',
      open: 'Conheça minha história',
      lead: 'Muito antes de conhecer o Direito, ganhei de uma tia o apelido de “Advogado dos Anjos”. Eu era uma criança comunicativa, que sempre tinha algo a dizer.',
      sections: [
        {
          title: 'De onde eu vim',
          paragraphs: [
            'Minha infância foi marcada pela rejeição paterna, pela violência doméstica e por dificuldades financeiras. Aos 13 anos, fui morar com minha mãe em uma comunidade de Curitiba e comecei a trabalhar recolhendo papelão e materiais recicláveis.',
            'Na adolescência, abandonei a escola e enfrentei a dependência de drogas. Foram anos difíceis, que interromperam meus estudos e me afastaram de qualquer perspectiva de futuro.',
          ],
        },
        {
          title: 'A decisão de recomeçar',
          paragraphs: [
            'Aos 23 anos, um encontro com Deus marcou uma mudança profunda na minha vida. Deixei as drogas, encontrei na fé um novo sentido e comecei a reconstruir minha trajetória.',
            'Trabalhava como ajudante de pedreiro durante o dia e estudava à noite. Retomei a educação básica, concluí o ensino médio e ingressei na faculdade de Direito. Em 2021, fui aprovado no exame da OAB e iniciei minha trajetória à frente do próprio escritório.',
          ],
        },
        {
          title: 'A construção da Albani Advocacia',
          paragraphs: [
            'Em 2022, mudei-me para Portugal. A experiência de ser imigrante trouxe uma dimensão pessoal ao meu trabalho. Aprofundei minha atuação em Direito Imigratório e Empresarial. Em 2023, com uma carteira de clientes formada por indicações e parcerias com advogados experientes em Portugal, nasceu a Albani Advocacia.',
            'Sou marido da Mari, pai do Calebe e da Ana Laura, pastor e escritor em construção. Sei o quanto um recomeço pode trazer esperança e incerteza. Essa experiência orienta minha forma de atender: ouvir com atenção, explicar as possibilidades com clareza e conduzir cada caso com responsabilidade.',
          ],
        },
      ],
      signature: 'Ivan Albani',
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
    title: 'Perguntas frequentes sobre imigração em Portugal',
    intro: 'Reunimos as perguntas que mais recebemos. Se a sua não estiver aqui, fale connosco.',
    // {q} = total de perguntas, {t} = total de temas
    count: '{q} perguntas · {t} temas',
    navLabel: 'Temas das perguntas',
    search: {
      label: 'Buscar nas perguntas',
      placeholder: 'Buscar: CPLP, renovação, AIMA...',
      clear: 'Limpar busca',
      // {n} = número de perguntas encontradas
      results: '{n} perguntas encontradas',
      resultsOne: '1 pergunta encontrada',
      empty: 'Nenhuma pergunta encontrada para “{q}”.',
      emptyHint: 'Tente outras palavras, ou fale connosco: respondemos à sua dúvida diretamente.',
    },
    more: 'Ver todas as perguntas →',
    ctaLead: 'Não encontrou a resposta?',
    groups: [
      {
        id: 'vistos',
        short: 'Vistos',
        title: 'Vistos para Portugal',
        items: [
          {
            q: 'Estou decidido a sair do Brasil e vir morar em Portugal, mas não sei nem por onde começar. O que eu faço primeiro?',
            a: 'O ponto de partida é definir o motivo da mudança: trabalhar, empreender, estudar, viver de rendimentos ou acompanhar um familiar. É isso que define o visto, a documentação e as etapas. No nosso escritório, começamos sempre por esse enquadramento, porque juntar documentos sem ele é o erro mais comum que encontramos.',
          },
          {
            q: 'Sempre confundo visto com autorização de residência. Não é a mesma coisa?',
            a: 'Não. O visto autoriza a entrada em Portugal para uma finalidade específica. O visto de residência serve, em regra, para você entrar e então pedir a autorização de residência, que é o que permite morar legalmente no país durante a validade dela.',
          },
          {
            q: 'Recebi uma proposta de emprego de uma empresa portuguesa. Com isso eu já consigo o visto de trabalho?',
            a: 'A proposta ou o contrato pode fundamentar o pedido, conforme a modalidade e os requisitos. Na nossa análise, também verificamos seus documentos pessoais, as condições da contratação e, se a profissão exigir, a habilitação para exercê-la.',
          },
          {
            q: 'Penso em abrir uma empresa ou trabalhar por conta própria aí. Existe visto para isso?',
            a: 'Existe, é o chamado D2, para empreendedores e profissionais independentes. É preciso demonstrar o projeto ou a atividade e cumprir os requisitos documentais e financeiros. Alertamos nossos clientes: abrir uma empresa, por si só, não garante o visto.',
          },
          {
            q: 'Sou aposentado e queria passar essa fase da vida em Portugal. Tem visto para mim?',
            a: 'O D7 costuma ser o caminho para aposentados e para quem vive de rendimentos próprios. Na análise, pesam a origem, a regularidade e a disponibilidade desses recursos, além dos demais requisitos.',
          },
          {
            q: 'Trabalho home office para uma empresa do Brasil. Dá para continuar trabalhando assim morando em Portugal?',
            a: 'Dá, pelo visto de trabalho remoto, o D8, para quem presta serviços a pessoas ou empresas fora de Portugal. Será necessário comprovar o vínculo ou os serviços prestados, os rendimentos exigidos e os demais requisitos.',
          },
          {
            q: 'Fui aceito num curso em Portugal! Isso já garante meu visto de estudante?',
            a: 'Não. A matrícula ou admissão é apenas parte da documentação. O pedido também depende do enquadramento da instituição e do curso, dos meios de subsistência, do alojamento e dos demais requisitos.',
          },
          {
            q: 'Ouvi falar de um visto para ir procurar emprego aí. Ele ainda existe?',
            a: 'A lei passou a prever o visto para procura de trabalho qualificado. Não parta do princípio de que o modelo antigo continua igual: antes de qualquer pedido, confirmamos a regulamentação e se o consulado está aceitando essa modalidade.',
          },
          {
            q: 'Quanto dinheiro eu preciso ter na conta para pedir o visto?',
            a: 'Não existe um valor único. Depende da modalidade, de quantas pessoas vão com você e dos critérios em vigor. E não basta ter o dinheiro: é preciso demonstrar de onde ele vem e que está disponível. Fazemos esse cálculo caso a caso.',
          },
          {
            q: 'Quanto tempo demora e quanto vou gastar com o processo todo?',
            a: 'Varia conforme a modalidade, o local do pedido e a necessidade de documentos adicionais. Nos nossos orçamentos, separamos taxas oficiais, despesas com documentos e honorários, para que você saiba exatamente o que está pagando. Prazo de aprovação, porém, nenhum escritório sério pode garantir.',
          },
        ],
      },
      {
        id: 'regularizacao',
        short: 'Regularização',
        title: 'Regularização de quem já está em Portugal',
        items: [
          {
            q: 'Entrei em Portugal como turista e acabei ficando. Consigo me regularizar sem ter que voltar ao Brasil?',
            a: 'Ter entrado como turista não gera, por si só, direito à residência. O nosso trabalho é verificar se existe alguma hipótese legal no seu caso que permita o pedido em Portugal, incluindo regras transitórias.',
          },
          {
            q: 'Já tenho NIF, NISS e contrato de trabalho. Isso quer dizer que estou legal, certo?',
            a: 'Não. Esses documentos mostram sua situação fiscal, contributiva ou profissional, mas não substituem um visto, uma autorização de residência ou outro fundamento válido de permanência.',
          },
          {
            q: 'Ainda dá para fazer uma manifestação de interesse?',
            a: 'Como via geral, não. A manifestação de interesse foi revogada em junho de 2024. Processos anteriores e situações abrangidas pelas normas transitórias exigem análise específica, que podemos fazer para você.',
          },
          {
            q: 'Eu já trabalhava e descontava antes de junho de 2024. Isso conta a meu favor?',
            a: 'Pode contar, para verificar o enquadramento no regime transitório. Analisamos a sua situação naquela data, os documentos e se o prazo legal foi cumprido. Os descontos, sozinhos, não garantem o direito.',
          },
          {
            q: 'Já moro em Portugal há anos. Depois de tanto tempo, a residência não sai automaticamente?',
            a: 'Não sai. O tempo de permanência, sozinho, não substitui os requisitos da autorização. Avaliamos o seu histórico migratório, seus vínculos familiares e profissionais e as hipóteses legais disponíveis.',
          },
          {
            q: 'Recebi uma notificação mandando eu sair de Portugal. Estou desesperado, o que eu faço?',
            a: 'Procure-nos o quanto antes: o fundamento da notificação e o prazo de resposta são decisivos. Guarde o documento completo e a prova da data em que o recebeu. As medidas possíveis dependem do seu caso.',
          },
        ],
      },
      {
        id: 'cplp',
        short: 'CPLP',
        title: 'Autorização de residência CPLP',
        items: [
          {
            q: 'Todo mundo fala da CPLP. O que é isso, afinal?',
            a: 'É uma autorização de residência para cidadãos dos países abrangidos pelo Acordo de Mobilidade da Comunidade dos Países de Língua Portuguesa, desde que cumpram os requisitos legais.',
          },
          {
            q: 'Sou brasileiro. Então a CPLP é automática para mim?',
            a: 'Não. A nacionalidade brasileira permite o enquadramento no acordo, mas não dispensa os requisitos para a concessão.',
          },
          {
            q: 'Posso entrar como turista e pedir a CPLP só por ser brasileiro?',
            a: 'Não recomendamos contar com isso. Para pedidos novos, a regra atual exige visto de residência prévio. Situações antigas ou transitórias precisam de análise própria.',
          },
          {
            q: 'O visto CPLP e a autorização de residência CPLP são o mesmo papel?',
            a: 'Não. O visto é obtido no consulado. A autorização de residência é pedida em Portugal, junto da AIMA. Ter o visto não elimina as etapas para emissão do título.',
          },
          {
            q: 'Com a CPLP eu posso trabalhar normalmente?',
            a: 'Pode, nos termos aplicáveis aos residentes. Se a sua profissão for regulamentada, pode ser necessário o reconhecimento das qualificações ou a inscrição na ordem profissional.',
          },
          {
            q: 'Tendo a CPLP, já sou cidadão português?',
            a: 'Não. A CPLP é uma autorização de residência. A nacionalidade portuguesa tem procedimento e requisitos próprios.',
          },
        ],
      },
      {
        id: 'troca-cplp',
        short: 'Troca da CPLP',
        title: 'Troca da CPLP pelo cartão de residência',
        items: [
          {
            q: 'Meu certificado CPLP é aquele de papel. Dá para trocar pelo cartão?',
            a: 'Dá. Foi criado um procedimento de renovação e substituição do certificado CPLP pelo título de residência no modelo uniforme.',
          },
          {
            q: 'Essa troca acontece sozinha ou eu tenho que fazer alguma coisa?',
            a: 'Não é automática. O procedimento envolve validação de dados, pagamento quando houver taxa, apresentação de documentos e atendimento para recolha da biometria.',
          },
          {
            q: 'Por onde eu começo o pedido da troca?',
            a: 'Consulte o procedimento oficial da AIMA e a notificação enviada para o seu caso. A AIMA disponibilizou a opção “Renovar AR CPLP” na plataforma de serviços para esse pedido.',
          },
          {
            q: 'Preciso ir pessoalmente ou o escritório resolve por mim?',
            a: 'O procedimento prevê atendimento presencial para a biometria. Podemos acompanhar e preparar todo o processo, mas isso não substitui a sua presença quando ela é exigida.',
          },
          {
            q: 'Que documentos eu levo no dia da troca?',
            a: 'Siga a lista da sua notificação e leve tudo atualizado. Confira com atenção a identificação, o certificado anterior e os comprovativos solicitados. Se preferir, revisamos a documentação com você antes do atendimento.',
          },
          {
            q: 'Nunca recebi o e-mail da troca, ou então perdi acesso ao e-mail antigo. E agora?',
            a: 'Verifique primeiro o spam e os dados associados ao processo. Se o e-mail estiver errado ou inacessível, use o procedimento oficial de atualização. Guarde prova de todas as tentativas e pedidos.',
          },
          {
            q: 'Trocando o papel pelo cartão, minha residência passa a ser de trabalho?',
            a: 'Não. A substituição muda o documento, não o fundamento da residência. Alterar o fundamento é outra questão, com enquadramento e procedimento próprios.',
          },
        ],
      },
      {
        id: 'renovacao',
        short: 'Renovação',
        title: 'Renovação da autorização de residência',
        items: [
          {
            q: 'Com quanto tempo de antecedência eu começo a cuidar da renovação?',
            a: 'Antes do vencimento, sem deixar para a última hora. Confira a validade do passaporte, organize os documentos e acompanhe a abertura do procedimento do seu título.',
          },
          {
            q: 'Toda renovação é feita no mesmo portal?',
            a: 'Não. O canal varia conforme o tipo de autorização e a situação do documento. A CPLP, por exemplo, tem procedimento próprio.',
          },
          {
            q: 'Minha residência venceu. Perdi tudo?',
            a: 'Não existe resposta única. Precisamos verificar a data de caducidade, as regras aplicáveis e se há pedido de renovação. Não presuma que prorrogações antigas continuam valendo para o seu caso.',
          },
          {
            q: 'O comprovativo de renovação vale como cartão?',
            a: 'Ele comprova o pedido e produz os efeitos previstos no regime aplicável, durante a sua validade. Mas não equivale ao cartão para todas as finalidades, especialmente em viagens internacionais.',
          },
          {
            q: 'Fiquei desempregado. Ainda consigo renovar?',
            a: 'O ponto central passa a ser como demonstrar meios de subsistência e os demais requisitos. Avaliamos a sua modalidade de residência, os recursos disponíveis e as suas circunstâncias pessoais.',
          },
          {
            q: 'Tenho dívidas nas Finanças ou na Segurança Social. Isso atrapalha a renovação?',
            a: 'Pode atrapalhar. A situação fiscal e contributiva é relevante para o pedido. Orientamos a verificar as pendências e regularizá-las, ou comprovar um acordo de pagamento válido.',
          },
          {
            q: 'Mudei de endereço, de passaporte ou casei. Tenho que avisar alguém?',
            a: 'Sim, pelo procedimento adequado. Dados desatualizados podem prejudicar notificações, a análise documental e a entrega do cartão.',
          },
        ],
      },
      {
        id: 'aima',
        short: 'AIMA',
        title: 'Processos parados na AIMA',
        items: [
          {
            q: 'Meu processo está parado há meses e ninguém me dá resposta. Por onde começo?',
            a: 'Identificando exatamente em que etapa ele está: agendamento, análise, documentos em falta, decisão ou emissão do cartão. Reúna o número do processo, os comprovativos de entrega e pagamento e todas as comunicações da AIMA. Com isso, conseguimos traçar o próximo passo.',
          },
          {
            q: 'Não consigo agendamento de jeito nenhum. O escritório consegue ajudar?',
            a: 'Sim: identificamos o canal adequado, preparamos requerimentos e avaliamos medidas administrativas ou judiciais. Somos transparentes, porém: a contratação não garante vaga imediata nem dispensa os requisitos do pedido.',
          },
          {
            q: 'Posso processar a AIMA pela demora?',
            a: 'Pode haver fundamento, conforme o dever de atuação da AIMA, o prazo aplicável e o histórico do seu processo. Avaliamos qual medida corresponde à sua situação concreta.',
          },
          {
            q: 'Qualquer processo atrasado dá direito a uma ação urgente?',
            a: 'Não. A intimação para proteção de direitos, liberdades e garantias tem requisitos específicos. A demora, isoladamente, não torna o processo elegível para esse meio urgente.',
          },
          {
            q: 'Que provas mostram que meu caso é urgente?',
            a: 'Documentos que comprovem prejuízo concreto: risco de perder o emprego, questões de saúde, impacto grave na vida familiar. A prova precisa mostrar a ligação entre a omissão da AIMA e o direito afetado.',
          },
          {
            q: 'Se eu ganhar na Justiça, minha residência está aprovada?',
            a: 'Não necessariamente. A decisão pode obrigar a AIMA a praticar um ato ou decidir o pedido, o que não equivale, por si só, à concessão da residência.',
          },
          {
            q: 'Já fiz a biometria, já paguei, e o cartão nunca chegou. O que eu faço?',
            a: 'Confirme se já houve decisão, se há alguma exigência pendente e se o endereço está correto. Pagamento e biometria não comprovam, sozinhos, a aprovação. Com o histórico organizado, avaliamos um pedido de informação ou outra medida adequada.',
          },
        ],
      },
      {
        id: 'familia',
        short: 'Família',
        title: 'Família e reagrupamento familiar',
        items: [
          {
            q: 'Quero trazer minha esposa e meus filhos. É possível?',
            a: 'Pode haver uma via de acompanhamento ou reagrupamento familiar, conforme o seu título e a situação dos familiares. Verificamos vínculos, idades, onde estão os familiares e os requisitos de residência, alojamento e subsistência.',
          },
          {
            q: 'Não sou casado no papel, tenho união estável. Isso vale?',
            a: 'A união de facto pode ser considerada para o reagrupamento, se cumprir os requisitos e estiver bem comprovada. Analisamos o documento brasileiro quanto ao conteúdo, às formalidades e à suficiência como prova.',
          },
          {
            q: 'E meus pais, ou meus filhos que já são maiores de idade? Posso trazê-los?',
            a: 'Há hipóteses legais, mas o parentesco sozinho pode não bastar. Dependência econômica, idade, estudos e outras condições costumam ser determinantes.',
          },
          {
            q: 'Minha família já está aqui em Portugal comigo. Dá para pedir o reagrupamento daqui?',
            a: 'Depende de onde o familiar está, como entrou, da idade e da data do pedido. As regras para pedidos dentro do país mudaram, e nem todos os familiares podem usar a mesma via.',
          },
        ],
      },
      {
        id: 'viagens',
        short: 'Viagens e documentos',
        title: 'Viagens, documentos e análise do caso',
        items: [
          {
            q: 'Posso ir ao Brasil enquanto espero a residência ou a renovação?',
            a: 'Antes de viajar, verifique os documentos necessários para sair, fazer escala e regressar a Portugal. Agendamento ou comprovativo de pedido não deve ser considerado suficiente para embarque ou reentrada. Na dúvida, consulte-nos antes de comprar a passagem.',
          },
          {
            q: 'Com a residência portuguesa, posso morar e trabalhar em qualquer país da Europa?',
            a: 'Não automaticamente. Viagens de curta duração e mudança de residência são situações diferentes, e a mudança segue as regras do país de destino.',
          },
          {
            q: 'Quero marcar uma consulta com o escritório. O que eu levo?',
            a: 'Passaporte, visto ou título de residência, comprovativos de entrada, notificações, número do processo, pagamentos e comunicações com a AIMA. Conforme o caso, documentos profissionais, familiares e de alojamento. Uma linha do tempo simples, com as datas principais, ajuda a nossa equipe a identificar o problema e as opções disponíveis.',
          },
        ],
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
