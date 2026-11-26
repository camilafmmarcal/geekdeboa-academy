
import { useEffect, useState } from "react";

import {
  BookOpen,
  Search,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  LoaderCircle
} from "lucide-react";

import {
  questaoService
} from "../services/questaoService";

import type {
  Disciplina,
  Assunto,
  QuestaoResumo,
  QuestaoDetalhe,
  FiltrosQuestoes
} from "../services/questaoService";

import "../styles/questoes.css";

export default function Questoes() {
  const [disciplinas, setDisciplinas] =
    useState<Disciplina[]>([]);

  const [assuntos, setAssuntos] =
    useState<Assunto[]>([]);

  const [disciplinaId, setDisciplinaId] =
    useState("");

  const [assuntoId, setAssuntoId] =
    useState("");

  const [dificuldade, setDificuldade] =
    useState("");

  const [pagina, setPagina] = useState(1);

  const [questoes, setQuestoes] =
    useState<QuestaoResumo[]>([]);

  const [selecionada, setSelecionada] =
    useState<QuestaoDetalhe | null>(null);

  const [carregando, setCarregando] =
    useState(true);

  const [erro, setErro] = useState("");

  const [erroAssuntos, setErroAssuntos] = useState("");

  const [atualizacao, setAtualizacao] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    questaoService.disciplinas(controller.signal)
      .then((resultado) => {
        if (!controller.signal.aborted) {
          setDisciplinas(resultado.dados);
        }
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setErro(
            "Não foi possível carregar as disciplinas."
          );
        }
      });

    return () => controller.abort();
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    setAssuntos([]);
    setAssuntoId("");
    setErroAssuntos("");

    if (!disciplinaId) {
      return () => controller.abort();
    }

    questaoService
      .assuntos(Number(disciplinaId), controller.signal)
      .then((resultado) => {
        if (!controller.signal.aborted) {
          setAssuntos(resultado.dados);
        }
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setErroAssuntos(
            "Não foi possível carregar os assuntos."
          );
        }
      });

    return () => controller.abort();
  }, [disciplinaId]);

  useEffect(() => {
    const controller = new AbortController();

    setCarregando(true);
    setErro("");
    setSelecionada(null);

    const filtros: FiltrosQuestoes = {
      pagina
    };

    if (disciplinaId) {
      filtros.disciplina_id = Number(disciplinaId);
    }

    if (assuntoId) {
      filtros.assunto_id = Number(assuntoId);
    }

    if (
      dificuldade === "FACIL" ||
      dificuldade === "MEDIA" ||
      dificuldade === "DIFICIL"
    ) {
      filtros.dificuldade = dificuldade;
    }

    questaoService.listar(filtros, controller.signal)
      .then((resultado) => {
        if (!controller.signal.aborted) {
          setQuestoes(resultado.dados);
        }
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setErro(
            "Não foi possível consultar o banco de questões."
          );
          setQuestoes([]);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setCarregando(false);
        }
      });

    return () => controller.abort();
  }, [
    disciplinaId,
    assuntoId,
    dificuldade,
    pagina,
    atualizacao
  ]);

  async function abrirQuestao(id: number) {
    setErro("");
    setSelecionada(null);

    try {
      const resultado = await questaoService.buscarPorId(id);
      setSelecionada(resultado);
    } catch {
      setErro(
        "Não foi possível carregar os detalhes da questão."
      );
    }
  }

  function limparFiltros() {
    setDisciplinaId("");
    setAssuntoId("");
    setDificuldade("");
    setPagina(1);
  }

  return (
    <div className="questoes-page">

      <section className="welcome">
        <h1>Banco de questões</h1>
        <p>
          Consulte questões de tecnologia e
          conheça diferentes estilos de avaliação.
        </p>
      </section>

      <section className="questoes-banner">
        <BookOpen size={38} />
        <div>
          <h2>Pratique seus conhecimentos</h2>
          <p>
            Filtre questões por disciplina,
            assunto ou dificuldade.
          </p>
        </div>
      </section>

      <section className="questoes-filtros">

        <div>
          <label htmlFor="disciplina">
            Disciplina
          </label>
          <select
            id="disciplina"
            value={disciplinaId}
            onChange={(e) => {
              setDisciplinaId(e.target.value);
              setPagina(1);
            }}
          >
            <option value="">Todas as disciplinas</option>
            {disciplinas.map((item) => (
              <option key={item.id} value={item.id}>
                {item.nome}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="assunto">Assunto</label>
          <select
            id="assunto"
            value={assuntoId}
            disabled={!disciplinaId || !!erroAssuntos}
            onChange={(e) => {
              setAssuntoId(e.target.value);
              setPagina(1);
            }}
          >
            <option value="">Todos os assuntos</option>
            {assuntos.map((item) => (
              <option key={item.id} value={item.id}>
                {item.nome}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="dificuldade">
            Dificuldade
          </label>
          <select
            id="dificuldade"
            value={dificuldade}
            onChange={(e) => {
              setDificuldade(e.target.value);
              setPagina(1);
            }}
          >
            <option value="">Todas</option>
            <option value="FACIL">Fácil</option>
            <option value="MEDIA">Média</option>
            <option value="DIFICIL">Difícil</option>
          </select>
        </div>

        <button
          type="button"
          className="questoes-limpar"
          onClick={limparFiltros}
        >
          Limpar filtros
        </button>
      </section>

      {erroAssuntos && (
        <p role="alert">{erroAssuntos}</p>
      )}

      {erro && (
        <div className="questoes-erro" role="alert">
          <AlertCircle size={20} />
          <span>{erro}</span>
          <button
            type="button"
            onClick={() => setAtualizacao((n) => n + 1)}
          >
            Tentar novamente
          </button>
        </div>
      )}

      {carregando ? (
        <div className="catalog-state" role="status">
          <LoaderCircle size={32} className="spinner" />
          <p>Consultando questões...</p>
        </div>
      ) : questoes.length === 0 ? (
        <div className="catalog-state">
          <Search size={36} />
          <h2>Nenhuma questão encontrada</h2>
          <p>
            Experimente outra combinação de filtros.
          </p>
        </div>
      ) : (
        <section className="questoes-lista">
          {questoes.map((questao) => (
            <article
              className="questao-card"
              key={questao.id}
            >
              <div className="questao-etiquetas">
                <span>{questao.disciplina}</span>
                <span>{questao.assunto}</span>
                <span>{questao.dificuldade}</span>
                {questao.banca && (
                  <span>{questao.banca}</span>
                )}
              </div>

              <h2>Questão #{questao.id}</h2>
              <p>{questao.enunciado}</p>

              <button
                className="questao-abrir"
                type="button"
                onClick={() => abrirQuestao(questao.id)}
              >
                Ver questão e alternativas
              </button>
            </article>
          ))}
        </section>
      )}

      <nav
        className="questoes-paginacao"
        aria-label="Paginação de questões"
      >
        <button
          type="button"
          disabled={pagina === 1 || carregando}
          onClick={() => setPagina((n) => n - 1)}
        >
          <ChevronLeft size={17} />
          Anterior
        </button>

        <span>Página {pagina}</span>

        <button
          type="button"
          disabled={carregando || questoes.length < 10}
          onClick={() => setPagina((n) => n + 1)}
        >
          Próxima
          <ChevronRight size={17} />
        </button>
      </nav>

      {selecionada && (
        <section
          className="questao-detalhe"
          aria-label="Detalhes da questão"
        >
          <div className="questao-detalhe-topo">
            <h2>Questão #{selecionada.id}</h2>

            <button
              type="button"
              onClick={() => setSelecionada(null)}
            >
              Fechar
            </button>
          </div>

          <p className="questao-enunciado">
            {selecionada.enunciado}
          </p>

          <div className="questao-alternativas">
            {selecionada.alternativas.map((alternativa) => (
              <div
                className="questao-alternativa"
                key={alternativa.id}
              >
                <strong>{alternativa.letra}</strong>
                <span>{alternativa.texto}</span>
              </div>
            ))}
          </div>

          <div className="demo-notice">
            Consulta demonstrativa. O envio de
            respostas e a correção automática
            serão implementados em outra etapa.
          </div>
        </section>
      )}
    </div>
  );
}
