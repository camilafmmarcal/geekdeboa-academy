
import {
  useCallback,
  useEffect,
  useRef,
  useState
} from "react";

import { Link } from "react-router-dom";
import { isAxiosError } from "axios";

import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock3,
  ListChecks,
  LogIn,
  RefreshCw,
  RotateCcw,
  ShieldCheck,
  XCircle
} from "lucide-react";

import { simuladoService } from "../services/simuladoService";

import type {
  SimuladoResumo,
  SimuladoDetalhe
} from "../services/simuladoService";

import { tentativaService } from "../services/tentativaService";

import type {
  ResultadoTentativa
} from "../services/tentativaService";

import { authService } from "../services/authService";

import "../styles/simulados.css";

// =====================================================
// TIPOS
// =====================================================

type Fase =
  | "catalogo"
  | "instrucoes"
  | "prova"
  | "resultado";

// =====================================================
// FUNCOES AUXILIARES
// =====================================================

function formatarTempo(segundos: number): string {
  const minutos = Math.floor(segundos / 60);
  const segundosRestantes = segundos % 60;

  return (
    String(minutos).padStart(2, "0") +
    ":" +
    String(segundosRestantes).padStart(2, "0")
  );
}

function mensagemErro(
  error: unknown,
  mensagemPadrao: string
): string {
  if (isAxiosError(error)) {
    const mensagemApi = error.response?.data?.erro;

    if (typeof mensagemApi === "string") {
      return mensagemApi;
    }

    if (error.response?.status === 401) {
      return (
        "Sua sessão expirou ou é inválida. " +
        "Faça login novamente."
      );
    }

    if (!error.response) {
      return (
        "Não foi possível conectar ao backend. " +
        "Verifique se a API está funcionando."
      );
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return mensagemPadrao;
}

// =====================================================
// COMPONENTE
// =====================================================

export default function Simulados() {
  // ---------------------------------------------------
  // ESTADOS GERAIS
  // ---------------------------------------------------

  const [fase, setFase] = useState<Fase>("catalogo");

  const [catalogo, setCatalogo] =
    useState<SimuladoResumo[]>([]);

  const [simulado, setSimulado] =
    useState<SimuladoDetalhe | null>(null);

  const [carregando, setCarregando] = useState(false);
  const [abrindoId, setAbrindoId] =
    useState<number | null>(null);

  const [iniciando, setIniciando] = useState(false);
  const [finalizando, setFinalizando] = useState(false);

  const [erro, setErro] = useState("");

  // ---------------------------------------------------
  // ESTADOS DA PROVA
  // ---------------------------------------------------

  const [
    confirmouInstrucoes,
    setConfirmouInstrucoes
  ] = useState(false);

  const [indice, setIndice] = useState(0);

  const [respostas, setRespostas] =
    useState<Record<number, number>>({});

  const [restante, setRestante] = useState(0);

  const [resultado, setResultado] =
    useState<ResultadoTentativa | null>(null);

  // ---------------------------------------------------
  // REFERENCIAS
  // ---------------------------------------------------

  const tentativaIdRef = useRef<number | null>(null);

  const prazoRef = useRef<number | null>(null);

  const bloqueioRef = useRef(false);

  const autoFinalizacaoRef = useRef(false);

  const resultadoRef = useRef<HTMLElement | null>(null);

  const instrucoesRef = useRef<HTMLElement | null>(null);

  // Evita atualizar a tela com uma resposta antiga
  // quando o estudante seleciona outro simulado.
  const requisicaoAberturaRef = useRef(0);

  // ---------------------------------------------------
  // ROLAGEM
  // ---------------------------------------------------

  useEffect(() => {
    if (fase === "resultado" && resultado) {
      resultadoRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }
  }, [fase, resultado]);

  useEffect(() => {
    if (fase === "instrucoes" && simulado) {
      instrucoesRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }
  }, [fase, simulado]);

  // ---------------------------------------------------
  // CATALOGO
  // ---------------------------------------------------

  const carregarCatalogo = useCallback(async () => {
    setCarregando(true);
    setErro("");

    try {
      const dados = await simuladoService.listar();

      setCatalogo(dados);
    } catch (error) {
      console.error(
        "Erro ao carregar catálogo:",
        error
      );

      setErro(
        mensagemErro(
          error,
          "Não foi possível carregar os simulados."
        )
      );
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    void carregarCatalogo();
  }, [carregarCatalogo]);

  // ---------------------------------------------------
  // ABRIR INSTRUCOES
  // ---------------------------------------------------

  async function selecionarSimulado(id: number) {
    if (abrindoId !== null) {
      return;
    }

    const requisicaoAtual =
      ++requisicaoAberturaRef.current;

    setAbrindoId(id);
    setErro("");

    try {
      const dados = await simuladoService.buscarPorId(id);

      if (requisicaoAtual !== requisicaoAberturaRef.current) {
        return;
      }

      if (
        !dados ||
        !Array.isArray(dados.questoes) ||
        dados.questoes.length === 0
      ) {
        setErro(
          "Este simulado não possui questões disponíveis."
        );
        return;
      }

      // Reinicia somente os dados da tela.
      // Nenhuma tentativa é criada nesta etapa.
      setSimulado(dados);
      setIndice(0);
      setRespostas({});
      setResultado(null);
      setRestante(0);
      setConfirmouInstrucoes(false);

      tentativaIdRef.current = null;
      prazoRef.current = null;
      bloqueioRef.current = false;
      autoFinalizacaoRef.current = false;

      // Mostra imediatamente a página de instruções.
      setFase("instrucoes");
    } catch (error) {
      console.error(
        "Erro ao abrir instruções:",
        error
      );

      if (requisicaoAtual === requisicaoAberturaRef.current) {
        setErro(
          mensagemErro(
            error,
            "Não foi possível abrir as instruções."
          )
        );
      }
    } finally {
      if (requisicaoAtual === requisicaoAberturaRef.current) {
        setAbrindoId(null);
      }
    }
  }

  // ---------------------------------------------------
  // INICIAR SIMULADO
  // ---------------------------------------------------

  async function iniciarSimulado() {
    if (
      !simulado ||
      !confirmouInstrucoes ||
      iniciando
    ) {
      return;
    }

    if (!authService.obterToken()) {
      setErro(
        "Faça login para iniciar um simulado " +
        "com resultado registrado."
      );
      return;
    }

    setIniciando(true);
    setErro("");

    try {
      const tentativa = await tentativaService.iniciar(
        simulado.id
      );

      if (
        !Number.isSafeInteger(tentativa.tentativa_id) ||
        tentativa.tentativa_id <= 0 ||
        !Number.isFinite(tentativa.duracao_segundos) ||
        tentativa.duracao_segundos <= 0
      ) {
        throw new Error(
          "O servidor retornou dados inválidos da tentativa."
        );
      }

      tentativaIdRef.current =
        tentativa.tentativa_id;

      prazoRef.current =
        Date.now() +
        tentativa.duracao_segundos * 1000;

      bloqueioRef.current = false;
      autoFinalizacaoRef.current = false;

      setRespostas({});
      setResultado(null);
      setIndice(0);
      setRestante(tentativa.duracao_segundos);

      setFase("prova");
    } catch (error) {
      console.error(
        "Erro ao iniciar simulado:",
        error
      );

      setErro(
        mensagemErro(
          error,
          "Não foi possível iniciar o simulado."
        )
      );
    } finally {
      setIniciando(false);
    }
  }

  // ---------------------------------------------------
  // FINALIZAR SIMULADO
  // ---------------------------------------------------

  const finalizarSimulado = useCallback(async () => {
    if (!simulado || bloqueioRef.current) {
      return;
    }

    const tentativaId = tentativaIdRef.current;

    if (tentativaId === null) {
      setErro(
        "Tentativa não encontrada. " +
        "Inicie um novo simulado."
      );
      return;
    }

    bloqueioRef.current = true;
    setFinalizando(true);
    setErro("");

    try {
      const itens = Object.entries(respostas).map(
        ([questaoId, alternativaId]) => ({
          questao_id: Number(questaoId),
          alternativa_id: alternativaId
        })
      );

      const dados = await tentativaService.finalizar(
        tentativaId,
        itens
      );

      setResultado(dados);

      tentativaIdRef.current = null;
      prazoRef.current = null;

      setFase("resultado");
    } catch (error) {
      console.error(
        "Erro ao finalizar simulado:",
        error
      );

      setErro(
        mensagemErro(
          error,
          "Não foi possível finalizar a avaliação."
        )
      );

      // Permite tentar novamente sem apagar respostas.
      bloqueioRef.current = false;
    } finally {
      setFinalizando(false);
    }
  }, [simulado, respostas]);

  // ---------------------------------------------------
  // CRONOMETRO
  // ---------------------------------------------------

  useEffect(() => {
    if (fase !== "prova") {
      return;
    }

    function atualizar() {
      if (prazoRef.current === null) {
        return;
      }

      const segundos = Math.max(
        0,
        Math.ceil(
          (prazoRef.current - Date.now()) / 1000
        )
      );

      setRestante(segundos);
    }

    atualizar();

    const intervalo = window.setInterval(
      atualizar,
      1000
    );

    return () => {
      window.clearInterval(intervalo);
    };
  }, [fase]);

  // Tenta finalizar automaticamente uma única vez
  // quando o relógio chega a zero.
  useEffect(() => {
    if (
      fase === "prova" &&
      restante === 0 &&
      prazoRef.current !== null &&
      !autoFinalizacaoRef.current
    ) {
      autoFinalizacaoRef.current = true;

      void finalizarSimulado();
    }
  }, [fase, restante, finalizarSimulado]);

  // ---------------------------------------------------
  // MARCAR ALTERNATIVA
  // ---------------------------------------------------

  function marcarResposta(
    questaoId: number,
    alternativaId: number
  ) {
    if (
      fase !== "prova" ||
      finalizando ||
      restante <= 0 ||
      bloqueioRef.current
    ) {
      return;
    }

    setRespostas((anteriores) => ({
      ...anteriores,
      [questaoId]: alternativaId
    }));
  }

  // ---------------------------------------------------
  // VOLTAR AO CATALOGO
  // ---------------------------------------------------

  function voltarCatalogo() {
    if (fase === "prova") {
      const confirmou = window.confirm(
        "Deseja abandonar o simulado? " +
        "As respostas não enviadas serão perdidas."
      );

      if (!confirmou) {
        return;
      }
    }

    requisicaoAberturaRef.current++;

    setFase("catalogo");
    setSimulado(null);
    setIndice(0);
    setRespostas({});
    setResultado(null);
    setRestante(0);
    setErro("");
    setAbrindoId(null);
    setConfirmouInstrucoes(false);

    tentativaIdRef.current = null;
    prazoRef.current = null;

    bloqueioRef.current = false;
    autoFinalizacaoRef.current = false;
  }

  // ---------------------------------------------------
  // REFAZER SIMULADO
  // ---------------------------------------------------

  function refazerSimulado() {
    if (!simulado) {
      return;
    }

    setIndice(0);
    setRespostas({});
    setResultado(null);
    setRestante(0);
    setErro("");
    setConfirmouInstrucoes(false);

    tentativaIdRef.current = null;
    prazoRef.current = null;

    bloqueioRef.current = false;
    autoFinalizacaoRef.current = false;

    setFase("instrucoes");
  }

  // ---------------------------------------------------
  // DADOS DERIVADOS
  // ---------------------------------------------------

  const questaoAtual =
    fase === "prova"
      ? simulado?.questoes[indice]
      : null;

  const totalQuestoes =
    simulado?.questoes.length ?? 0;

  const quantidadeRespondidas = simulado
    ? simulado.questoes.filter(
        (questao) =>
          respostas[questao.id] !== undefined
      ).length
    : 0;

  const progresso =
    totalQuestoes > 0
      ? (quantidadeRespondidas / totalQuestoes) * 100
      : 0;

  // =====================================================
  // INTERFACE
  // =====================================================

  return (
    <div className="simulados-page">

      {/* CABECALHO */}

      <section className="welcome">
        <h1>Simulados</h1>

        <p>
          Pratique em avaliações cronometradas
          e acompanhe sua evolução nos estudos.
        </p>
      </section>

      <div className="simulados-aviso">
        <ShieldCheck size={18} />

        <span>
          Estudantes autenticados têm suas tentativas
          e resultados registrados no banco de dados.
          O tempo também é validado pelo servidor.
        </span>
      </div>

      {/* MENSAGENS DE ERRO */}

      {erro && (
        <div
          className="simulados-erro"
          role="alert"
        >
          <AlertCircle size={20} />

          <span>{erro}</span>

          {fase === "instrucoes" &&
            !authService.obterToken() && (
              <Link
                to="/entrar"
                className="simulados-secundario"
              >
                <LogIn size={17} />
                Fazer login
              </Link>
            )}

          {fase === "prova" &&
            !finalizando &&
            tentativaIdRef.current !== null && (
              <button
                type="button"
                className="simulados-secundario"
                onClick={() =>
                  void finalizarSimulado()
                }
              >
                Tentar finalizar novamente
              </button>
            )}
        </div>
      )}

      {/* =========================================
          CATALOGO
         ========================================= */}

      {fase === "catalogo" && (
        <section className="simulados-catalogo">

          <div className="simulados-catalogo-cabecalho">
            <div>
              <h2>Simulados disponíveis</h2>

              <p>
                Escolha uma avaliação e leia as
                instruções antes de iniciar.
              </p>
            </div>

            <button
              type="button"
              className="simulados-secundario"
              disabled={carregando}
              onClick={() =>
                void carregarCatalogo()
              }
            >
              <RefreshCw size={17} />

              {carregando
                ? "Atualizando..."
                : "Atualizar catálogo"}
            </button>
          </div>

          {carregando && (
            <p
              className="simulados-carregando"
              role="status"
            >
              Carregando simulados...
            </p>
          )}

          <div className="simulados-grid">

            {!carregando &&
              catalogo.length === 0 && (
                <div className="simulados-vazio">
                  <ListChecks size={30} />

                  <h3>
                    Nenhum simulado disponível
                  </h3>

                  <p>
                    Não foram encontrados simulados
                    publicados com questões.
                  </p>
                </div>
              )}

            {catalogo.map((item) => (
              <article
                key={item.id}
                className="simulados-card"
              >
                <h3>{item.titulo}</h3>

                <p>
                  {item.descricao ||
                    "Avaliação de conhecimentos em tecnologia."}
                </p>

                <div className="simulados-metadados">
                  <span>
                    <ListChecks size={16} />

                    {item.quantidade_questoes}{" "}
                    {item.quantidade_questoes === 1
                      ? "questão"
                      : "questões"}
                  </span>

                  <span>
                    <Clock3 size={16} />

                    {item.duracao_minutos} minutos
                  </span>
                </div>

                <button
                  type="button"
                  disabled={
                    abrindoId !== null ||
                    carregando
                  }
                  onClick={() =>
                    void selecionarSimulado(item.id)
                  }
                >
                  {abrindoId === item.id
                    ? "Abrindo instruções..."
                    : "Ver instruções"}
                </button>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* =========================================
          INSTRUCOES
         ========================================= */}

      {fase === "instrucoes" && simulado && (
        <section
          ref={instrucoesRef}
          className="simulados-painel simulados-instrucoes"
          style={{ scrollMarginTop: 110 }}
        >
          <p className="simulados-etapa">
            Antes de começar
          </p>

          <h2>{simulado.titulo}</h2>

          {simulado.descricao && (
            <p className="simulados-descricao">
              {simulado.descricao}
            </p>
          )}

          <div className="simulados-instrucoes-resumo">
            <div>
              <ListChecks size={20} />

              <span>
                <strong>
                  {simulado.questoes.length}
                </strong>

                {simulado.questoes.length === 1
                  ? " questão"
                  : " questões"}
              </span>
            </div>

            <div>
              <Clock3 size={20} />

              <span>
                <strong>
                  {simulado.duracao_minutos}
                </strong>
                {" minutos"}
              </span>
            </div>
          </div>

          <h3>Regras da avaliação</h3>

          <ol className="simulados-regras">
            <li>
              É necessário estar autenticado
              para realizar uma tentativa registrada.
            </li>

            <li>
              O tempo começa após a criação
              da tentativa pelo backend.
            </li>

            <li>
              Selecione uma alternativa por questão.
              Você poderá alterar respostas enquanto
              houver tempo disponível.
            </li>

            <li>
              Questões não respondidas serão
              consideradas incorretas.
            </li>

            <li>
              Ao finalizar, suas respostas serão
              corrigidas e registradas no MySQL.
            </li>

            <li>
              O resultado apresentará os acertos,
              o percentual e a correção comentada.
            </li>
          </ol>

          <div className="simulados-instrucoes-alerta">
            <AlertCircle size={21} />

            <p>
              <strong>Atenção:</strong> atualizar
              ou fechar a página durante a prova
              poderá causar a perda das respostas
              ainda não enviadas. A recuperação
              automática de tentativas ainda
              não foi implementada.
            </p>
          </div>

          <label className="simulados-confirmacao">
            <input
              type="checkbox"
              checked={confirmouInstrucoes}
              onChange={(evento) =>
                setConfirmouInstrucoes(
                  evento.target.checked
                )
              }
            />

            <span>
              Li as instruções e desejo
              iniciar a avaliação.
            </span>
          </label>

          <div className="simulados-acoes">
            <button
              type="button"
              disabled={
                !confirmouInstrucoes ||
                iniciando
              }
              onClick={() =>
                void iniciarSimulado()
              }
            >
              {iniciando
                ? "Iniciando..."
                : "Iniciar simulado"}

              <ArrowRight size={17} />
            </button>

            <button
              type="button"
              className="simulados-secundario"
              onClick={voltarCatalogo}
            >
              <ArrowLeft size={17} />
              Voltar ao catálogo
            </button>
          </div>
        </section>
      )}

      {/* =========================================
          PROVA
         ========================================= */}

      {fase === "prova" &&
        simulado &&
        questaoAtual && (
          <section className="simulados-painel">

            <div className="simulados-cabecalho">
              <div>
                <h2>{simulado.titulo}</h2>

                <p>
                  Questão {indice + 1} de{" "}
                  {totalQuestoes}
                  {" · "}
                  {quantidadeRespondidas} respondidas
                </p>
              </div>

              <div
                className={
                  restante <= 60
                    ? "simulados-relogio urgente"
                    : "simulados-relogio"
                }
                role="timer"
                aria-label={
                  `Tempo restante: ${formatarTempo(restante)}`
                }
              >
                <Clock3 size={20} />
                {formatarTempo(restante)}
              </div>
            </div>

            <div
              className="simulados-progresso"
              role="progressbar"
              aria-valuenow={quantidadeRespondidas}
              aria-valuemin={0}
              aria-valuemax={totalQuestoes}
              aria-label="Questões respondidas"
            >
              <div
                style={{
                  width: `${progresso}%`
                }}
              />
            </div>

            {/* INDICES */}

            <nav
              className="simulados-indices"
              aria-label="Navegação entre questões"
            >
              {simulado.questoes.map(
                (item, posicao) => (
                  <button
                    key={item.id}
                    type="button"
                    disabled={
                      finalizando ||
                      restante === 0
                    }
                    onClick={() =>
                      setIndice(posicao)
                    }
                    aria-current={
                      indice === posicao
                        ? "step"
                        : undefined
                    }
                    className={[
                      indice === posicao
                        ? "atual"
                        : "",
                      respostas[item.id] !== undefined
                        ? "respondida"
                        : ""
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  >
                    {posicao + 1}
                  </button>
                )
              )}
            </nav>

            {/* ENUNCIADO E ALTERNATIVAS */}

            <div className="simulados-questao">
              <p className="simulados-questao-numero">
                Questão {indice + 1}
              </p>

              <p className="simulados-enunciado">
                {questaoAtual.enunciado}
              </p>

              <fieldset
                className="simulados-opcoes"
                disabled={
                  finalizando ||
                  restante === 0
                }
              >
                <legend>
                  Selecione uma alternativa
                </legend>

                {questaoAtual.alternativas.map(
                  (alternativa) => {
                    const marcada =
                      respostas[questaoAtual.id] ===
                      alternativa.id;

                    return (
                      <label
                        key={alternativa.id}
                        className={
                          marcada ? "marcada" : ""
                        }
                      >
                        <input
                          type="radio"
                          name={
                            `simulado-${questaoAtual.id}`
                          }
                          checked={marcada}
                          onChange={() =>
                            marcarResposta(
                              questaoAtual.id,
                              alternativa.id
                            )
                          }
                        />

                        <strong>
                          {alternativa.letra}
                        </strong>

                        <span>
                          {alternativa.texto}
                        </span>
                      </label>
                    );
                  }
                )}
              </fieldset>
            </div>

            {/* NAVEGACAO */}

            <div className="simulados-acoes simulados-acoes-prova">
              <button
                type="button"
                className="simulados-secundario"
                disabled={
                  indice === 0 ||
                  finalizando
                }
                onClick={() =>
                  setIndice((atual) => atual - 1)
                }
              >
                <ArrowLeft size={17} />
                Anterior
              </button>

              <button
                type="button"
                className="simulados-secundario"
                disabled={
                  indice === totalQuestoes - 1 ||
                  finalizando
                }
                onClick={() =>
                  setIndice((atual) => atual + 1)
                }
              >
                Próxima
                <ArrowRight size={17} />
              </button>

              <button
                type="button"
                className="simulados-finalizar"
                disabled={finalizando}
                onClick={() => {
                  const confirmou =
                    restante === 0 ||
                    window.confirm(
                      "Deseja finalizar o simulado?\n\n" +
                      `${quantidadeRespondidas} de ` +
                      `${totalQuestoes} questões respondidas.`
                    );

                  if (confirmou) {
                    void finalizarSimulado();
                  }
                }}
              >
                {finalizando
                  ? "Salvando resultado..."
                  : "Finalizar simulado"}
              </button>
            </div>
          </section>
        )}

      {/* =========================================
          RESULTADO FINAL
         ========================================= */}

      {fase === "resultado" &&
        simulado &&
        resultado && (
          <section
            ref={resultadoRef}
            className="simulados-painel"
            style={{ scrollMarginTop: 110 }}
          >
            <div className="simulados-resultado-cabecalho">
              <CheckCircle2 size={30} />

              <div>
                <p className="simulados-etapa">
                  Avaliação finalizada
                </p>

                <h2>
                  Resultado — {simulado.titulo}
                </h2>
              </div>
            </div>

            <div className="simulados-resumo">
              <div>
                <strong>
                  {resultado.acertos}/
                  {resultado.total_questoes}
                </strong>

                <span>Acertos</span>
              </div>

              <div>
                <strong>
                  {resultado.percentual}%
                </strong>

                <span>Aproveitamento</span>
              </div>

              <div>
                <strong>
                  {resultado.respondidas}
                </strong>

                <span>Respondidas</span>
              </div>
            </div>

            <h3>Correção comentada</h3>

            <div className="simulados-lista-correcao">
              {resultado.questoes.map(
                (item, posicao) => {
                  const naoRespondida =
                    item.alternativa_id === null;

                  const questaoOriginal =
                    simulado.questoes.find(
                      (q) => q.id === item.questao_id
                    );

                  return (
                    <article
                      key={item.questao_id}
                      className="simulados-correcao"
                    >
                      <div className="simulados-correcao-titulo">
                        {item.correta ? (
                          <CheckCircle2
                            size={20}
                            className="simulados-icone-acerto"
                          />
                        ) : (
                          <XCircle
                            size={20}
                            className="simulados-icone-erro"
                          />
                        )}

                        <h4>
                          Questão {posicao + 1}
                          {" — "}
                          {naoRespondida
                            ? "Não respondida"
                            : item.correta
                              ? "Correta"
                              : "Incorreta"}
                        </h4>
                      </div>

                      <p>
                        {questaoOriginal?.enunciado}
                      </p>

                      <p>
                        <strong>
                          Gabarito:{" "}
                          {item.letra_correta}
                        </strong>
                      </p>

                      <p>
                        {item.comentario ||
                          "Comentário não disponível."}
                      </p>
                    </article>
                  );
                }
              )}
            </div>

            <div className="simulados-acoes">
              <button
                type="button"
                onClick={refazerSimulado}
              >
                <RotateCcw size={17} />
                Refazer simulado
              </button>

              <button
                type="button"
                className="simulados-secundario"
                onClick={voltarCatalogo}
              >
                Voltar ao catálogo
              </button>

              <Link
                to="/desempenho"
                className="simulados-secundario"
              >
                Ver desempenho
              </Link>
            </div>
          </section>
        )}
    </div>
  );
}
