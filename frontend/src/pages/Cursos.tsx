
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import {
  Search,
  SlidersHorizontal,
  BookOpen,
  LoaderCircle,
  AlertCircle,
  RotateCcw
} from "lucide-react";

import CourseCard from "../components/CourseCard";
import { cursoService } from "../services/cursoService";

import type {
  Curso,
  CategoriaCurso,
  NivelCurso
} from "../types/curso";

export default function Cursos() {
  const [searchParams, setSearchParams] =
    useSearchParams();

  const [cursos, setCursos] = useState<Curso[]>([]);

  const [categorias, setCategorias] =
    useState<CategoriaCurso[]>([]);

  const [busca, setBusca] = useState("");

  const [nivel, setNivel] =
    useState<NivelCurso | "">("");

  const [carregando, setCarregando] =
    useState(true);

  const [erro, setErro] = useState("");

  const [erroCategorias, setErroCategorias] =
    useState("");

  const [total, setTotal] = useState(0);

  const [atualizacao, setAtualizacao] = useState(0);

  const categoria =
    searchParams.get("categoria") || "";

  // Carrega as categorias disponíveis
  useEffect(() => {
    const controller = new AbortController();

    setErroCategorias("");

    cursoService
      .listarCategorias(controller.signal)
      .then((resposta) => {
        setCategorias(resposta.dados);
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setErroCategorias(
            "Não foi possível carregar as categorias."
          );
        }
      });

    return () => controller.abort();

  }, [atualizacao]);

  // Consulta os cursos conforme os filtros
  useEffect(() => {
    const controller = new AbortController();

    setCarregando(true);
    setErro("");

    const timer = window.setTimeout(async () => {
      try {
        const resposta = await cursoService.listar(
          {
            busca: busca.trim() || undefined,
            categoria: categoria || undefined,
            nivel: nivel || undefined
          },
          controller.signal
        );

        if (!controller.signal.aborted) {
          setCursos(resposta.dados);
          setTotal(resposta.total);
        }

      } catch {
        if (!controller.signal.aborted) {
          setErro(
            "Não foi possível carregar os cursos. " +
            "Verifique se o backend está em execução."
          );

          setCursos([]);
          setTotal(0);
        }

      } finally {
        if (!controller.signal.aborted) {
          setCarregando(false);
        }
      }
    }, 350);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };

  }, [busca, categoria, nivel, atualizacao]);

  function alterarCategoria(valor: string) {
    const parametros =
      new URLSearchParams(searchParams);

    if (valor) {
      parametros.set("categoria", valor);
    } else {
      parametros.delete("categoria");
    }

    setSearchParams(parametros, { replace: true });
  }

  function limparFiltros() {
    setBusca("");
    setNivel("");
    setSearchParams({}, { replace: true });
  }

  return (
    <div className="courses-page">

      <section className="welcome">
        <h1>Catálogo de cursos</h1>

        <p>
          Explore oportunidades de aprendizado
          e desenvolva suas habilidades em tecnologia.
        </p>
      </section>

      <section className="catalog-banner">
        <BookOpen size={42} />

        <div>
          <h2>Conhecimento ao seu alcance</h2>

          <p>
            Recursos educacionais selecionados
            de diferentes plataformas de ensino.
          </p>
        </div>
      </section>

      <section className="course-filters">

        <div className="filter-heading">
          <SlidersHorizontal size={20} />
          <h3>Encontre seu próximo curso</h3>
        </div>

        <div className="filter-grid">

          <div className="filter-field">
            <label htmlFor="busca">
              Pesquisar
            </label>

            <div className="search-input">
              <Search size={19} />

              <input
                id="busca"
                type="search"
                placeholder="Nome ou descrição..."
                value={busca}
                maxLength={255}
                onChange={(event) =>
                  setBusca(event.target.value)
                }
              />
            </div>
          </div>

          <div className="filter-field">
            <label htmlFor="categoria">
              Categoria
            </label>

            <select
              id="categoria"
              value={categoria}
              onChange={(event) =>
                alterarCategoria(event.target.value)
              }
            >
              <option value="">
                Todas as categorias
              </option>

              {categoria &&
                !categorias.some(
                  (item) =>
                    item.categoria === categoria
                ) && (
                  <option value={categoria}>
                    {categoria}
                  </option>
                )}

              {categorias.map((item) => (
                <option
                  key={item.categoria}
                  value={item.categoria}
                >
                  {item.categoria} ({item.quantidade})
                </option>
              ))}
            </select>
          </div>

          <div className="filter-field">
            <label htmlFor="nivel">
              Nível
            </label>

            <select
              id="nivel"
              value={nivel}
              onChange={(event) =>
                setNivel(
                  event.target.value as NivelCurso | ""
                )
              }
            >
              <option value="">
                Todos os níveis
              </option>

              <option value="INICIANTE">
                Iniciante
              </option>

              <option value="INTERMEDIARIO">
                Intermediário
              </option>

              <option value="AVANCADO">
                Avançado
              </option>
            </select>
          </div>

        </div>

        {erroCategorias && (
          <p role="alert" className="filter-warning">
            {erroCategorias}
          </p>
        )}

        <div className="filter-footer">

          <span aria-live="polite">
            {carregando
              ? "Consultando catálogo..."
              : `${total} recurso(s) encontrado(s)`}
          </span>

          <button
            type="button"
            className="clear-button"
            onClick={limparFiltros}
          >
            <RotateCcw size={16} />
            Limpar filtros
          </button>

        </div>

      </section>

      {carregando ? (

        <div className="catalog-state" role="status">
          <LoaderCircle
            className="spinner"
            size={38}
          />

          <h3>Carregando cursos...</h3>
        </div>

      ) : erro ? (

        <div className="catalog-state error-state"
             role="alert">

          <AlertCircle size={38} />

          <h3>Falha na comunicação</h3>
          <p>{erro}</p>

          <button
            className="retry-button"
            onClick={() =>
              setAtualizacao((valor) => valor + 1)
            }
          >
            Tentar novamente
          </button>

        </div>

      ) : cursos.length === 0 ? (

        <div className="catalog-state">

          <Search size={38} />

          <h3>Nenhum curso encontrado</h3>

          <p>
            Experimente alterar ou remover os filtros.
          </p>

          <button
            className="retry-button"
            onClick={limparFiltros}
          >
            Limpar filtros
          </button>

        </div>

      ) : (

        <section className="courses-grid">
          {cursos.map((curso) => (
            <CourseCard
              key={curso.id}
              curso={curso}
            />
          ))}
        </section>

      )}

      <div className="demo-notice">
        O Geek de Boa Academy realiza a curadoria
        de recursos educacionais externos.
        Inscrições, disponibilidade, certificações
        e condições de acesso são de responsabilidade
        das respectivas instituições.
      </div>

    </div>
  );
}
