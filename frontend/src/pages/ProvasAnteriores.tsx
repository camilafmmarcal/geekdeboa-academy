
import { useMemo, useState } from "react";

import {
  Files,
  Search,
  ExternalLink,
  FileText,
  ClipboardCheck,
  ShieldCheck,
  Info
} from "lucide-react";

import {
  provasAnteriores
} from "../data/provasAnteriores";

import "../styles/provasAnteriores.css";

export default function ProvasAnteriores() {
  const [busca, setBusca] = useState("");
  const [ano, setAno] = useState("TODOS");
  const [banca, setBanca] = useState("TODAS");

  const anos = [...new Set(
    provasAnteriores.map((prova) => prova.ano)
  )].sort((a, b) => b - a);

  const bancas = [...new Set(
    provasAnteriores.map((prova) => prova.banca)
  )].sort();

  const resultados = useMemo(() => {
    const termo = busca.trim().toLocaleLowerCase("pt-BR");

    return provasAnteriores.filter((prova) => {
      const texto = [
        prova.instituicao,
        prova.cargo,
        prova.concurso,
        prova.banca
      ].join(" ").toLocaleLowerCase("pt-BR");

      return (
        (!termo || texto.includes(termo)) &&
        (ano === "TODOS" || prova.ano === Number(ano)) &&
        (banca === "TODAS" || prova.banca === banca)
      );
    });
  }, [busca, ano, banca]);

  return (
    <div className="provas-page">

      <section className="welcome">
        <h1>Provas anteriores</h1>
        <p>
          Consulte cadernos completos e gabaritos
          de concursos públicos da área de tecnologia.
        </p>
      </section>

      <section className="provas-hero">
        <Files size={38} />

        <div>
          <h2>Estude com provas oficiais</h2>
          <p>
            Familiarize-se com o estilo das bancas,
            a estrutura dos cadernos e os conteúdos
            cobrados em concursos anteriores.
          </p>
        </div>
      </section>

      <section className="provas-filtros">
        <div>
          <label htmlFor="provas-busca">
            Buscar concurso ou cargo
          </label>

          <div className="provas-busca">
            <Search size={18} />

            <input
              id="provas-busca"
              type="search"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Ex.: desenvolvimento, DATAPREV..."
            />
          </div>
        </div>

        <div>
          <label htmlFor="provas-ano">Ano</label>

          <select
            id="provas-ano"
            value={ano}
            onChange={(e) => setAno(e.target.value)}
          >
            <option value="TODOS">Todos os anos</option>

            {anos.map((item) => (
              <option value={item} key={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="provas-banca">Banca</label>

          <select
            id="provas-banca"
            value={banca}
            onChange={(e) => setBanca(e.target.value)}
          >
            <option value="TODAS">Todas as bancas</option>

            {bancas.map((item) => (
              <option value={item} key={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
      </section>

      <div className="provas-contagem" role="status">
        {resultados.length} prova(s) encontrada(s)
      </div>

      {resultados.length === 0 ? (
        <section className="catalog-state">
          <Search size={36} />
          <h2>Nenhuma prova encontrada</h2>
          <p>Altere os filtros para realizar outra consulta.</p>
        </section>
      ) : (
        <section className="provas-grid">
          {resultados.map((prova) => (
            <article
              className="prova-card"
              key={prova.id}
            >
              <div className="prova-card-topo">
                <FileText size={27} />

                <span className="prova-ano">
                  {prova.ano}
                </span>
              </div>

              <div className="prova-card-conteudo">
                <h2>{prova.instituicao}</h2>

                <div className="prova-tags">
                  <span>{prova.banca}</span>
                  <span>{prova.tipo}</span>
                </div>

                <h3>{prova.cargo}</h3>

                <p>{prova.descricao}</p>

                <div className="prova-documentos">
                  <a
                    href={prova.urlProva}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="prova-link"
                  >
                    <FileText size={17} />
                    Abrir prova completa
                    <ExternalLink size={15} />
                  </a>

                  <a
                    href={prova.urlGabarito}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="prova-link"
                  >
                    <ClipboardCheck size={17} />
                    Gabarito {
                      prova.tipoGabarito.toLowerCase()
                    }
                    <ExternalLink size={15} />
                  </a>

                  <a
                    href={prova.urlFonte}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="prova-link prova-fonte"
                  >
                    Consultar página oficial
                    <ExternalLink size={15} />
                  </a>
                </div>
              </div>
            </article>
          ))}
        </section>
      )}

      <section className="provas-orientacoes">
        <h2>Como utilizar as provas anteriores</h2>

        <ol>
          <li>
            Selecione um concurso e confira o cargo,
            o ano e o tipo de caderno.
          </li>
          <li>
            Abra a prova e tente resolvê-la antes
            de consultar o gabarito.
          </li>
          <li>
            Confira se o gabarito corresponde
            exatamente ao tipo do seu caderno.
          </li>
          <li>
            Consulte a página oficial para verificar
            retificações, anulações e documentos posteriores.
          </li>
        </ol>
      </section>

      <section className="provas-aviso">
        <ShieldCheck size={24} />
        <p>
          Os documentos são disponibilizados por
          organizadoras e órgãos públicos.
          O Geek de Boa Academy oferece links
          de consulta, sem reproduzir os cadernos
          ou garantir a disponibilidade permanente.
        </p>
      </section>

      <section className="provas-aviso">
        <Info size={24} />
        <p>
          Esta versão permite consultar os documentos.
          A realização de provas completas com cronômetro,
          respostas e correção automática ainda não foi
          implementada.
        </p>
      </section>
    </div>
  );
}
