
import {
  GraduationCap,
  ExternalLink,
  Award,
  Clock3,
  BookOpen,
  ShieldCheck
} from "lucide-react";

import "./../styles/euCapacito.css";

const portal =
  "https://on.fiap.com.br/local/programaeucapacito/";

const etapas = [
  {
    titulo: "Acesse o portal oficial",
    descricao:
      "Clique no botão de cadastro para acessar a plataforma FIAP ON."
  },
  {
    titulo: "Preencha seus dados",
    descricao:
      "Informe seu nome completo, e-mail e nível de escolaridade."
  },
  {
    titulo: "Crie uma senha",
    descricao:
      "Utilize pelo menos 8 caracteres, incluindo letras maiúsculas, minúsculas, números e caracteres especiais."
  },
  {
    titulo: "Leia os termos",
    descricao:
      "Leia os termos e condições e o termo de consentimento para tratamento de dados pessoais."
  },
  {
    titulo: "Finalize seu cadastro",
    descricao:
      "Clique em Finalizar Cadastro e siga as orientações apresentadas pela FIAP."
  },
  {
    titulo: "Escolha seus cursos",
    descricao:
      "Acesse os Nano Courses disponíveis e selecione os conteúdos de seu interesse."
  }
];

const beneficios = [
  {
    titulo: "Cursos gratuitos",
    descricao: "20 Nano Courses anunciados no programa.",
    icone: BookOpen
  },
  {
    titulo: "Carga horária",
    descricao: "Cursos entre 40 e 160 horas.",
    icone: Clock3
  },
  {
    titulo: "Certificação",
    descricao: "Mediante os critérios de aprovação da FIAP.",
    icone: Award
  },
  {
    titulo: "Flexibilidade",
    descricao: "Estude no seu ritmo, de onde estiver.",
    icone: GraduationCap
  }
];

export default function EuCapacito() {
  return (
    <div className="capacito-page">

      <section className="welcome">
        <h1>Programa Eu Capacito</h1>
        <p>
          Oportunidades gratuitas de formação
          e desenvolvimento profissional.
        </p>
      </section>

      <section className="capacito-hero">
        <span className="hero-label">
          OPORTUNIDADE EDUCACIONAL
        </span>

        <h2>Invista no seu futuro com a FIAP</h2>

        <p>
          Conheça o programa Eu Capacito,
          liderado pelo Instituto IT Mídia,
          com oferta de cursos gratuitos
          de tecnologia por meio da FIAP ON.
        </p>

        <a
          href={portal}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary"
        >
          Realizar cadastro gratuito
          <ExternalLink size={18} />
        </a>
      </section>

      <section className="capacito-beneficios">
        {beneficios.map(
          ({ titulo, descricao, icone: Icone }) => (
            <article
              className="capacito-card"
              key={titulo}
            >
              <Icone size={30} />
              <h3>{titulo}</h3>
              <p>{descricao}</p>
            </article>
          )
        )}
      </section>

      <section className="capacito-panel">
        <h2>Como realizar o cadastro</h2>

        <p>
          Siga as etapas abaixo para começar.
        </p>

        <ol className="capacito-steps">
          {etapas.map((etapa, index) => (
            <li key={etapa.titulo}>
              <span className="step-number">
                {index + 1}
              </span>

              <div>
                <h3>{etapa.titulo}</h3>
                <p>{etapa.descricao}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="capacito-panel">
        <h2>Perguntas frequentes</h2>

        <div className="capacito-faq">

          <details>
            <summary>
              Posso realizar mais de um curso?
            </summary>
            <p>
              Sim. O programa permite realizar
              vários cursos simultaneamente.
            </p>
          </details>

          <details>
            <summary>
              Como obtenho meu certificado?
            </summary>
            <p>
              É necessário concluir pelo menos
              75% do conteúdo e obter no mínimo
              70% de acertos na avaliação.
              Após a aprovação, o certificado
              poderá ser baixado na plataforma.
            </p>
          </details>

          <details>
            <summary>
              Qual é o prazo de acesso?
            </summary>
            <p>
              Segundo a FIAP, o prazo de acesso
              integral ao conteúdo é de dois anos
              após a criação da conta. Após esse
              período, permanece disponível
              o conteúdo em formato HTML.
            </p>
          </details>

          <details>
            <summary>
              Preciso criar uma conta na FIAP?
            </summary>
            <p>
              O acesso aos cursos é realizado
              mediante cadastro na plataforma
              FIAP ON. Caso já possua cadastro,
              utilize a opção correspondente
              no portal oficial.
            </p>
          </details>

          <details>
            <summary>
              Como entrar em contato com a FIAP?
            </summary>
            <p>
              O canal informado pelo programa é{" "}
              <a href="mailto:on@fiap.com.br">
                on@fiap.com.br
              </a>.
            </p>
          </details>

        </div>
      </section>

      <section className="capacito-cta">
        <h2>Comece sua jornada de aprendizado</h2>

        <p>
          Acesse o portal oficial e conheça
          as oportunidades disponíveis.
        </p>

        <a
          href={portal}
          target="_blank"
          rel="noopener noreferrer"
          className="course-button"
        >
          Acessar Programa Eu Capacito
          <ExternalLink size={18} />
        </a>
      </section>

      <div className="capacito-privacy">
        <ShieldCheck size={26} />

        <p>
          O Geek de Boa Academy atua exclusivamente
          na divulgação e curadoria educacional.
          Nenhum dado de cadastro na FIAP é
          coletado por esta página. A oferta,
          certificação e condições de acesso
          são de responsabilidade da instituição.
        </p>
      </div>

      <p className="capacito-source">
        Fonte das informações:{" "}
        <a
          href={portal}
          target="_blank"
          rel="noopener noreferrer"
        >
          Portal oficial FIAP — Eu Capacito
        </a>.
        Consulta em 24/11/2026.
      </p>

    </div>
  );
}
