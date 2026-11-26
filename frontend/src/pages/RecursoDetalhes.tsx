
import { Link, useParams } from "react-router-dom";

import {
  ArrowLeft,
  ExternalLink,
  BookOpen,
  GraduationCap,
  ListChecks,
  Info,
  ShieldCheck
} from "lucide-react";

import { recursos } from "../data/recursos";

import "../styles/recursoDetalhes.css";

export default function RecursoDetalhes() {
  const { slug } = useParams<{ slug: string }>();

  const recurso = slug
    ? Object.prototype.hasOwnProperty.call(recursos, slug)
      ? recursos[slug]
      : undefined
    : undefined;

  if (!recurso) {
    return (
      <section className="recurso-estado">
        <h1>Recurso não encontrado</h1>
        <p>
          O conteúdo solicitado não está disponível.
        </p>

        <Link to="/" className="text-link">
          Voltar para a página inicial
        </Link>
      </section>
    );
  }

  const documentacao =
    recurso.tipo === "Documentação técnica";

  return (
    <div className="recurso-page">

      <Link to="/" className="recurso-voltar">
        <ArrowLeft size={18} />
        Voltar à página inicial
      </Link>

      <section className="recurso-hero">
        <span className="recurso-etiqueta">
          {recurso.tipo.toUpperCase()}
        </span>

        {documentacao ? (
          <BookOpen size={42} />
        ) : (
          <GraduationCap size={42} />
        )}

        <h1>{recurso.titulo}</h1>
        <h2>{recurso.subtitulo}</h2>

        <p>{recurso.descricao}</p>

        <a
          href={recurso.links[0].url}
          target="_blank"
          rel="noopener noreferrer"
          className="recurso-botao-principal"
        >
          {documentacao
            ? "Acessar documentação oficial"
            : "Explorar plataforma"}

          <ExternalLink size={17} />
        </a>
      </section>

      <section className="recurso-beneficios">
        {recurso.beneficios.map((beneficio) => (
          <article
            className="recurso-beneficio"
            key={beneficio.titulo}
          >
            <BookOpen size={28} />

            <h3>{beneficio.titulo}</h3>
            <p>{beneficio.descricao}</p>
          </article>
        ))}
      </section>

      <section className="recurso-painel">
        <div className="recurso-titulo-secao">
          <ListChecks size={25} />
          <h2>
            {documentacao
              ? "Como utilizar a documentação"
              : "Como começar a estudar"}
          </h2>
        </div>

        <ol className="recurso-etapas">
          {recurso.passos.map((passo, index) => (
            <li key={passo.titulo}>
              <span className="recurso-numero">
                {index + 1}
              </span>

              <div>
                <h3>{passo.titulo}</h3>
                <p>{passo.descricao}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="recurso-painel">
        <div className="recurso-titulo-secao">
          <ExternalLink size={23} />
          <h2>Links úteis</h2>
        </div>

        <div className="recurso-links">
          {recurso.links.map((link) => (
            <a
              key={link.url}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="recurso-link-card"
            >
              <div>
                <strong>{link.titulo}</strong>
                <p>{link.descricao}</p>
              </div>

              <ExternalLink size={19} />
            </a>
          ))}
        </div>
      </section>

      <section className="recurso-aviso">
        <Info size={24} />

        <p>{recurso.observacao}</p>
      </section>

      <section className="recurso-privacidade">
        <ShieldCheck size={22} />

        <p>
          O Geek de Boa Academy organiza recursos
          externos para fins educacionais.
          Ao acessar os links, você será direcionado
          à instituição responsável, sujeitando-se
          às suas próprias condições de uso e
          políticas de privacidade.
        </p>
      </section>

    </div>
  );
}
