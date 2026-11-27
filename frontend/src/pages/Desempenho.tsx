
import {
  useCallback,
  useEffect,
  useMemo,
  useState
} from "react";

import { Link } from "react-router-dom";
import { isAxiosError } from "axios";

import {
  Activity,
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  RefreshCw,
  Target,
  TrendingUp
} from "lucide-react";

import {
  authService
} from "../services/authService";

import {
  tentativaService
} from "../services/tentativaService";

import type {
  HistoricoTentativa
} from "../services/tentativaService";

import "../styles/desempenho.css";

function formatarData(valor: string | null): string {
  if (!valor) return "—";

  const data = new Date(valor);

  if (Number.isNaN(data.getTime())) {
    return "Data indisponível";
  }

  return data.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function calcularPercentual(
  acertos: number | null,
  total: number | null
): number {
  if (
    acertos === null ||
    total === null ||
    total <= 0
  ) {
    return 0;
  }

  return (acertos / total) * 100;
}

function statusLegivel(status: string): string {
  switch (status) {
    case "FINALIZADA":
      return "Finalizada";
    case "EXPIRADA":
      return "Expirada";
    case "EM_ANDAMENTO":
      return "Em andamento";
    default:
      return status;
  }
}

function mensagemErro(error: unknown): string {
  if (isAxiosError(error)) {
    if (error.response?.status === 401) {
      return "Sua sessão expirou. Entre novamente.";
    }

    const mensagem = error.response?.data?.erro;

    if (typeof mensagem === "string") {
      return mensagem;
    }
  }

  return "Não foi possível carregar seu histórico.";
}

export default function Desempenho() {
  const [historico, setHistorico] =
    useState<HistoricoTentativa[]>([]);

  const [carregando, setCarregando] =
    useState(true);

  const [erro, setErro] = useState("");

  const [filtro, setFiltro] = useState<
  "TODAS" | "FINALIZADA" | "EXPIRADA" | "EM_ANDAMENTO"
>("FINALIZADA");

  const [autenticado, setAutenticado] =
    useState(!!authService.obterToken());

  const carregar = useCallback(async () => {
    if (!authService.obterToken()) {
      setAutenticado(false);
      setHistorico([]);
      setCarregando(false);
      return;
    }

    setCarregando(true);
    setErro("");

    try {
      const resposta = await tentativaService.historico();

      setHistorico(resposta.dados);
      setAutenticado(true);
    } catch (error) {
      setErro(mensagemErro(error));
      setHistorico([]);

      if (
        isAxiosError(error) &&
        error.response?.status === 401
      ) {
        setAutenticado(false);
      }
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    void carregar();
  }, [carregar]);

  const estatisticas = useMemo(() => {
    const finalizadas = historico.filter(
      (item) => item.status === "FINALIZADA"
    );

    const expiradas = historico.filter(
      (item) => item.status === "EXPIRADA"
    );

    const emAndamento = historico.filter(
      (item) => item.status === "EM_ANDAMENTO"
    );

    const totalAcertos = finalizadas.reduce(
      (soma, item) => soma + Number(item.acertos ?? 0),
      0
    );

    const totalQuestoes = finalizadas.reduce(
      (soma, item) =>
        soma + Number(item.total_questoes ?? 0),
      0
    );

    const aproveitamento =
      totalQuestoes > 0
        ? (totalAcertos / totalQuestoes) * 100
        : 0;

    return {
      finalizadas: finalizadas.length,
      expiradas: expiradas.length,
      emAndamento: emAndamento.length,
      totalAcertos,
      totalQuestoes,
      aproveitamento
    };
  }, [historico]);

  const finalizadasOrdenadas = useMemo(() => {
    return historico
      .filter((item) => item.status === "FINALIZADA")
      .slice()
      .sort(
        (a, b) =>
          new Date(a.finalizado_em ?? a.iniciado_em).getTime() -
          new Date(b.finalizado_em ?? b.iniciado_em).getTime()
      )
      .slice(-10);
  }, [historico]);

  const historicoFiltrado = useMemo(() => {
    const dados =
      filtro === "TODAS"
        ? historico
        : historico.filter(
            (item) => item.status === filtro
          );

    return dados.slice().sort(
      (a, b) => b.id - a.id
    );
  }, [historico, filtro]);

  if (!autenticado && !carregando) {
    return (
      <div className="desempenho-page">
        <section className="welcome">
          <h1>Meu desempenho</h1>
          <p>Acompanhe seus resultados nos simulados.</p>
        </section>

        <section className="desempenho-estado">
          <Activity size={40} />

          <h2>Entre para consultar seu desempenho</h2>

          <p>
            O histórico é individual e fica associado
            à sua conta de estudante.
          </p>

          <Link to="/entrar" className="desempenho-botao">
            Fazer login
            <ArrowRight size={17} />
          </Link>
        </section>
      </div>
    );
  }

  return (
    <div className="desempenho-page">
      <section className="welcome">
        <h1>Meu desempenho</h1>

        <p>
          Acompanhe seus resultados e sua evolução
          nas avaliações realizadas.
        </p>
      </section>

      <div className="desempenho-topo">
        <div>
          <h2>Visão geral</h2>
          <p>
            Dados das tentativas registradas
            na sua conta.
          </p>
        </div>

        <button
          type="button"
          className="desempenho-secundario"
          onClick={() => void carregar()}
          disabled={carregando}
        >
          <RefreshCw size={17} />
          Atualizar
        </button>
      </div>

      {erro && (
        <div className="desempenho-erro" role="alert">
          <AlertCircle size={19} />
          <span>{erro}</span>
        </div>
      )}

      {carregando ? (
        <section
          className="desempenho-estado"
          role="status"
        >
          Carregando seu desempenho...
        </section>
      ) : (
        <>
          <section
            className="desempenho-indicadores"
            aria-label="Indicadores de desempenho"
          >
            <article className="desempenho-indicador">
              <ClipboardCheck size={23} />

              <strong>{estatisticas.finalizadas}</strong>
              <span>Simulados concluídos</span>
            </article>

            <article className="desempenho-indicador">
              <Target size={23} />

              <strong>
                {estatisticas.aproveitamento.toFixed(1)}%
              </strong>
              <span>Aproveitamento geral</span>
            </article>

            <article className="desempenho-indicador">
              <CheckCircle2 size={23} />

              <strong>
                {estatisticas.totalAcertos}
              </strong>
              <span>Questões corretas</span>
            </article>

            <article className="desempenho-indicador">
              <Clock3 size={23} />

              <strong>
                {estatisticas.emAndamento}
              </strong>
              <span>Tentativas em andamento</span>
            </article>
          </section>

          <section className="desempenho-painel">
            <div className="desempenho-secao-titulo">
              <TrendingUp size={22} />

              <div>
                <h2>Evolução dos resultados</h2>
                <p>
                  Aproveitamento nas últimas dez
                  avaliações concluídas.
                </p>
              </div>
            </div>

            {finalizadasOrdenadas.length === 0 ? (
              <div className="desempenho-vazio">
                <p>
                  Ainda não há avaliações concluídas.
                </p>

                <Link
                  to="/simulados"
                  className="desempenho-botao"
                >
                  Realizar simulado
                  <ArrowRight size={17} />
                </Link>
              </div>
            ) : (
              <div
                className="desempenho-grafico"
                aria-label="Evolução do percentual de acertos"
              >
                {finalizadasOrdenadas.map((item) => {
                  const percentual = calcularPercentual(
                    item.acertos,
                    item.total_questoes
                  );

                  return (
                    <div
                      className="desempenho-barra-item"
                      key={item.id}
                      title={
                        `${item.simulado}: ` +
                        `${percentual.toFixed(1)}%`
                      }
                    >
                      <span>
                        {percentual.toFixed(0)}%
                      </span>

                      <div className="desempenho-barra-area">
                        <div
                          className="desempenho-barra"
                          style={{
                            height: `${percentual}%`
                          }}
                        />
                      </div>

                      <small>
                        #{item.id}
                      </small>
                    </div>
                  );
                })}
              </div>
            )}

            <p className="desempenho-nota">
              O aproveitamento geral é calculado pela
              quantidade total de acertos dividida
              pelo total de questões das tentativas
              finalizadas. Tentativas expiradas ou em
              andamento não entram nesse cálculo.
            </p>
          </section>

          <section className="desempenho-painel">
            <div className="desempenho-historico-topo">
              <div>
                <h2>Histórico de simulados</h2>

                <p>
                  {historico.length} tentativa(s) encontrada(s).
                  {" "}
                  {estatisticas.expiradas} expirada(s).
                </p>
              </div>

              <label className="desempenho-filtro">
                <span>Filtrar por situação</span>

                <select
                  value={filtro}
                  onChange={(evento) =>
                    setFiltro(
                      evento.target.value as typeof filtro
                    )
                  }
                >
                  <option value="TODAS">
                    Todas
                  </option>

                  <option value="FINALIZADA">
                    Finalizadas
                  </option>

                  <option value="EM_ANDAMENTO">
                    Em andamento
                  </option>

                  <option value="EXPIRADA">
                    Expiradas
                  </option>
                </select>
              </label>
            </div>

            {historicoFiltrado.length === 0 ? (
              <div className="desempenho-vazio">
                <p>
                  Nenhuma tentativa corresponde
                  ao filtro selecionado.
                </p>
              </div>
            ) : (
              <div className="desempenho-tabela-rolagem">
                <table className="desempenho-tabela">
                  <thead>
                    <tr>
                      <th>Tentativa</th>
                      <th>Simulado</th>
                      <th>Data</th>
                      <th>Status</th>
                      <th>Resultado</th>
                      <th>Aproveitamento</th>
                    </tr>
                  </thead>

                  <tbody>
                    {historicoFiltrado.map((item) => {
                      const finalizada =
                        item.status === "FINALIZADA";

                      const percentual = calcularPercentual(
                        item.acertos,
                        item.total_questoes
                      );

                      return (
                        <tr key={item.id}>
                          <td>#{item.id}</td>

                          <td className="desempenho-nome">
                            {item.simulado}
                          </td>

                          <td>
                            {formatarData(
                              item.finalizado_em ??
                              item.iniciado_em
                            )}
                          </td>

                          <td>
                            <span
                              className={
                                "desempenho-status " +
                                item.status.toLowerCase()
                              }
                            >
                              {statusLegivel(item.status)}
                            </span>
                          </td>

                          <td>
                            {finalizada
                              ? `${item.acertos ?? 0}/${item.total_questoes ?? 0}`
                              : "—"}
                          </td>

                          <td>
                            {finalizada
                              ? `${percentual.toFixed(1)}%`
                              : "—"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}
