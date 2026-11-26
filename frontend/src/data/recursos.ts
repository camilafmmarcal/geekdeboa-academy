
export interface RecursoEducacional {
  titulo: string;
  tipo: "Plataforma educacional" | "Documentação técnica";
  subtitulo: string;
  descricao: string;
  beneficios: {
    titulo: string;
    descricao: string;
  }[];
  passos: {
    titulo: string;
    descricao: string;
  }[];
  links: {
    titulo: string;
    descricao: string;
    url: string;
  }[];
  observacao: string;
}

export const recursos: Record<
  string,
  RecursoEducacional
> = {
  freecodecamp: {
    titulo: "freeCodeCamp",
    tipo: "Plataforma educacional",
    subtitulo: "Aprenda programação na prática",
    descricao:
      "O freeCodeCamp é uma plataforma gratuita de aprendizagem de programação, com exercícios interativos, projetos e formações orientadas ao desenvolvimento de habilidades técnicas.",

    beneficios: [
      {
        titulo: "Exercícios práticos",
        descricao: "Aprenda resolvendo desafios de programação."
      },
      {
        titulo: "Projetos",
        descricao: "Aplique os conhecimentos em atividades práticas."
      },
      {
        titulo: "Certificações",
        descricao: "Consulte as formações e os requisitos de certificação."
      }
    ],

    passos: [
      {
        titulo: "Acesse o freeCodeCamp",
        descricao: "Abra a plataforma pelo link disponibilizado abaixo."
      },
      {
        titulo: "Crie sua conta",
        descricao: "Utilize a opção de cadastro ou login para acompanhar seu progresso."
      },
      {
        titulo: "Escolha uma formação",
        descricao: "Explore os conteúdos disponíveis e escolha sua área de interesse."
      },
      {
        titulo: "Resolva os exercícios",
        descricao: "Siga as atividades e desenvolva os projetos propostos."
      },
      {
        titulo: "Acompanhe sua evolução",
        descricao: "Consulte seu progresso e os requisitos de certificação na plataforma."
      }
    ],

    links: [
      {
        titulo: "Acessar plataforma de aprendizagem",
        descricao: "Catálogo de cursos e exercícios",
        url: "https://www.freecodecamp.org/learn/"
      },
      {
        titulo: "Conhecer o freeCodeCamp",
        descricao: "Página institucional",
        url: "https://www.freecodecamp.org/"
      }
    ],

    observacao:
      "O conteúdo é disponibilizado pelo freeCodeCamp. Os critérios de progresso e certificação são definidos pela própria plataforma."
  },

  "microsoft-learn": {
    titulo: "Microsoft Learn",
    tipo: "Plataforma educacional",
    subtitulo: "Aprenda tecnologias Microsoft",
    descricao:
      "O Microsoft Learn reúne treinamentos, módulos e roteiros de aprendizagem para o desenvolvimento de conhecimentos em tecnologia, incluindo computação em nuvem, dados, inteligência artificial e segurança.",

    beneficios: [
      {
        titulo: "Módulos",
        descricao: "Estude assuntos específicos conforme sua necessidade."
      },
      {
        titulo: "Roteiros de aprendizagem",
        descricao: "Explore sequências organizadas de conteúdos."
      },
      {
        titulo: "Busca por temas",
        descricao: "Utilize filtros para encontrar treinamentos relevantes."
      }
    ],

    passos: [
      {
        titulo: "Abra o catálogo",
        descricao: "Acesse a página oficial de treinamentos do Microsoft Learn."
      },
      {
        titulo: "Pesquise o assunto",
        descricao: "Utilize a busca e os filtros para encontrar os conteúdos."
      },
      {
        titulo: "Escolha o módulo ou roteiro",
        descricao: "Leia a apresentação e os pré-requisitos do conteúdo."
      },
      {
        titulo: "Entre na sua conta, se necessário",
        descricao: "Use as opções de acesso oferecidas pela Microsoft para aproveitar os recursos associados ao seu perfil."
      },
      {
        titulo: "Acompanhe seus estudos",
        descricao: "Conclua as atividades e verifique as condições aplicáveis a cada treinamento."
      }
    ],

    links: [
      {
        titulo: "Explorar treinamentos",
        descricao: "Catálogo atualizado do Microsoft Learn",
        url: "https://learn.microsoft.com/pt-br/training/browse/"
      },
      {
        titulo: "Página principal",
        descricao: "Visão geral do Microsoft Learn",
        url: "https://learn.microsoft.com/pt-br/training/"
      }
    ],

    observacao:
      "Módulos de aprendizagem não equivalem necessariamente a certificações profissionais. Verifique os requisitos e eventuais custos de exames separadamente."
  },

  nodejs: {
    titulo: "Node.js",
    tipo: "Documentação técnica",
    subtitulo: "JavaScript no lado do servidor",
    descricao:
      "Node.js é um ambiente de execução JavaScript utilizado para construir servidores, APIs, ferramentas de linha de comando e aplicações backend. Sua documentação oficial é uma referência para desenvolvimento e consulta técnica.",

    beneficios: [
      {
        titulo: "Aprendizado",
        descricao: "Guias introdutórios e conceitos fundamentais."
      },
      {
        titulo: "APIs nativas",
        descricao: "Referência dos recursos e módulos do Node.js."
      },
      {
        titulo: "Desenvolvimento backend",
        descricao: "Conhecimentos úteis para servidores e APIs REST."
      }
    ],

    passos: [
      {
        titulo: "Conheça o Node.js",
        descricao: "Leia a introdução e entenda suas principais aplicações."
      },
      {
        titulo: "Prepare o ambiente",
        descricao: "Consulte as instruções oficiais de instalação."
      },
      {
        titulo: "Estude os fundamentos",
        descricao: "Explore módulos, execução de scripts e operações assíncronas."
      },
      {
        titulo: "Consulte a referência",
        descricao: "Utilize a documentação das APIs quando precisar implementar funcionalidades."
      },
      {
        titulo: "Pratique",
        descricao: "Crie pequenos scripts ou uma API REST para aplicar o aprendizado."
      }
    ],

    links: [
      {
        titulo: "Aprender Node.js",
        descricao: "Guias oficiais de aprendizagem",
        url: "https://nodejs.org/en/learn"
      },
      {
        titulo: "Documentação das APIs",
        descricao: "Referência técnica oficial",
        url: "https://nodejs.org/docs/latest/api/"
      },
      {
        titulo: "Site oficial",
        descricao: "Informações e downloads",
        url: "https://nodejs.org/"
      }
    ],

    observacao:
      "Trata-se de documentação técnica, não de um curso com carga horária ou certificação próprios."
  },

  react: {
    titulo: "React",
    tipo: "Documentação técnica",
    subtitulo: "Desenvolvimento de interfaces com componentes",
    descricao:
      "React é uma biblioteca JavaScript para construção de interfaces de usuário. A documentação oficial apresenta conceitos, exemplos e referências para desenvolver aplicações baseadas em componentes.",

    beneficios: [
      {
        titulo: "Componentes",
        descricao: "Aprenda a organizar interfaces em partes reutilizáveis."
      },
      {
        titulo: "Estado e interatividade",
        descricao: "Entenda como construir interfaces dinâmicas."
      },
      {
        titulo: "Referência técnica",
        descricao: "Consulte APIs, Hooks e funcionalidades da biblioteca."
      }
    ],

    passos: [
      {
        titulo: "Abra a introdução",
        descricao: "Comece pela seção Aprender React, disponível em português."
      },
      {
        titulo: "Conheça os componentes",
        descricao: "Estude JSX, propriedades e composição."
      },
      {
        titulo: "Aprenda interatividade",
        descricao: "Explore gerenciamento de estado e eventos."
      },
      {
        titulo: "Pratique os exemplos",
        descricao: "Reproduza os exemplos em um ambiente React."
      },
      {
        titulo: "Consulte a referência",
        descricao: "Utilize a documentação para esclarecer dúvidas durante o desenvolvimento."
      }
    ],

    links: [
      {
        titulo: "Aprender React",
        descricao: "Guia inicial em português",
        url: "https://pt-br.react.dev/learn"
      },
      {
        titulo: "Referência do React",
        descricao: "APIs e Hooks",
        url: "https://pt-br.react.dev/reference/react"
      },
      {
        titulo: "Configuração do ambiente",
        descricao: "Instruções oficiais",
        url: "https://pt-br.react.dev/learn/installation"
      }
    ],

    observacao:
      "A documentação é uma fonte de estudo e consulta, não uma formação certificada por si só."
  }
};
