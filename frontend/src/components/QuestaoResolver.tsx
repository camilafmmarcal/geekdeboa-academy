
import { useEffect, useState } from "react";

import {
  CheckCircle2,
  XCircle,
  LoaderCircle
} from "lucide-react";

import {
  questaoService
} from "../services/questaoService";

import type {
  QuestaoDetalhe,
  ResultadoResposta
} from "../services/questaoService";

interface Props {
  questao: QuestaoDetalhe;
}

export default function QuestaoResolver({
  questao
}: Props) {
  const [alternativaId, setAlternativaId] =
    useState<number | null>(null);

  const [resultado, setResultado] =
    useState<ResultadoResposta | null>(null);

  const [enviando, setEnviando] =
    useState(false);

  const [erro, setErro] = useState("");

  useEffect(() => {
    setAlternativaId(null);
    setResultado(null);
    setErro("");
    setEnviando(false);
  }, [questao.id]);

  async function corrigir() {
    if (
      alternativaId === null ||
      enviando ||
      resultado !== null
    ) {
      return;
    }

    setEnviando(true);
    setErro("");

    try {
      const resposta = await questaoService.responder(
        questao.id,
        alternativaId
      );

      setResultado(resposta);
    } catch {
      setErro(
        "Não foi possível corrigir a resposta. Tente novamente."
      );
    } finally {
      setEnviando(false);
    }
  }

  function tentarNovamente() {
    setAlternativaId(null);
    setResultado(null);
    setErro("");
  }

  return (
    <div className="resolver">

      <p className="questao-enunciado">
        {questao.enunciado}
      </p>

      <fieldset
        className="resolver-alternativas"
        disabled={enviando || resultado !== null}
      >
        <legend>Escolha uma alternativa</legend>

        {questao.alternativas.map((alternativa) => {
          const selecionada =
            alternativaId === alternativa.id;

          const alternativaCorreta =
            resultado !== null &&
            alternativa.letra === resultado.letra_correta;

          const alternativaErrada =
            resultado !== null &&
            selecionada &&
            !resultado.correta;

          const classe = [
            "resolver-alternativa",
            selecionada ? "selecionada" : "",
            alternativaCorreta ? "correta" : "",
            alternativaErrada ? "incorreta" : ""
          ].filter(Boolean).join(" ");

          return (
            <label
              className={classe}
              key={alternativa.id}
            >
              <input
                type="radio"
                name={`questao-${questao.id}`}
                value={alternativa.id}
                checked={selecionada}
                onChange={() =>
                  setAlternativaId(alternativa.id)
                }
              />

              <strong>{alternativa.letra}</strong>

              <span>{alternativa.texto}</span>

              {alternativaCorreta && (
                <CheckCircle2 size={20} />
              )}

              {alternativaErrada && (
                <XCircle size={20} />
              )}
            </label>
          );
        })}
      </fieldset>

      {erro && (
        <p className="resolver-erro" role="alert">
          {erro}
        </p>
      )}

      {!resultado ? (
        <button
          type="button"
          className="questao-abrir"
          disabled={alternativaId === null || enviando}
          onClick={corrigir}
        >
          {enviando ? (
            <>
              <LoaderCircle
                size={17}
                className="spinner"
              />
              Corrigindo...
            </>
          ) : (
            "Corrigir resposta"
          )}
        </button>
      ) : (
        <section
          className={
            `resolver-resultado ${
              resultado.correta ? "acerto" : "erro"
            }`
          }
          aria-live="polite"
        >
          <div className="resolver-resultado-topo">
            {resultado.correta ? (
              <CheckCircle2 size={24} />
            ) : (
              <XCircle size={24} />
            )}

            <h3>
              {resultado.correta
                ? "Resposta correta!"
                : "Resposta incorreta"}
            </h3>
          </div>

          <p>
            <strong>
              Gabarito: {resultado.letra_correta}
            </strong>
          </p>

          <p>
            {resultado.comentario ||
              "Comentário não disponível para esta questão."}
          </p>

          <button
            type="button"
            className="resolver-reiniciar"
            onClick={tentarNovamente}
          >
            Responder novamente
          </button>
        </section>
      )}
    </div>
  );
}
