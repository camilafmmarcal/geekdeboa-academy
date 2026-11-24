
-- =====================================================
-- Projeto: Geek de Boa Academy 2.0
-- Projeto Integrado II - ADS
-- Seed: 002
-- Objetivo: Cadastrar bancas e questao demonstrativa
-- Dependencia: Seed 001
-- =====================================================

USE geekdeboa_academy;

START TRANSACTION;

-- =====================================================
-- CADASTRO DAS BANCAS
-- =====================================================

INSERT INTO bancas (nome, sigla, ativo)
VALUES
(
    'Centro Brasileiro de Pesquisa em Avaliação e Seleção e de Promoção de Eventos',
    'CEBRASPE',
    TRUE
),
(
    'Fundação Getulio Vargas',
    'FGV',
    TRUE
),
(
    'Fundação Carlos Chagas',
    'FCC',
    TRUE
),
(
    'Instituto AOCP',
    'AOCP',
    TRUE
)
AS novas
ON DUPLICATE KEY UPDATE
    sigla = novas.sigla,
    ativo = novas.ativo;

-- =====================================================
-- IDENTIFICAR O ASSUNTO POO
-- =====================================================

SET @assunto_poo_id = (
    SELECT a.id
    FROM assuntos a
    JOIN disciplinas d
        ON d.id = a.disciplina_id
    WHERE d.nome = 'Programação'
      AND a.nome = 'POO'
    LIMIT 1
);

-- =====================================================
-- CADASTRO DA QUESTAO AUTORAL
-- =====================================================

SET @enunciado_poo =
    'Na Programação Orientada a Objetos, qual princípio permite ocultar os detalhes internos de uma classe e controlar o acesso aos seus atributos?';

INSERT INTO questoes (
    assunto_id,
    concurso_id,
    enunciado,
    dificuldade,
    comentario_gabarito,
    origem,
    status
)
SELECT
    @assunto_poo_id,
    NULL,
    @enunciado_poo,
    'FACIL',
    'O encapsulamento permite proteger os atributos e detalhes internos de uma classe, controlando o acesso por meio de métodos e modificadores de acesso.',
    'AUTORAL',
    'PUBLICADA'
WHERE @assunto_poo_id IS NOT NULL
  AND NOT EXISTS (
      SELECT 1
      FROM questoes
      WHERE enunciado = @enunciado_poo
        AND assunto_id = @assunto_poo_id
  );

-- =====================================================
-- IDENTIFICAR A QUESTAO CADASTRADA
-- =====================================================

SET @questao_poo_id = (
    SELECT id
    FROM questoes
    WHERE enunciado = @enunciado_poo
      AND assunto_id = @assunto_poo_id
    ORDER BY id
    LIMIT 1
);

-- =====================================================
-- CADASTRO DAS ALTERNATIVAS
-- =====================================================

INSERT IGNORE INTO alternativas (
    questao_id,
    letra,
    texto,
    correta
)
SELECT
    @questao_poo_id,
    dados.letra,
    dados.texto,
    dados.correta
FROM (

    SELECT
        'A' AS letra,
        'Herança' AS texto,
        FALSE AS correta

    UNION ALL SELECT
        'B',
        'Polimorfismo',
        FALSE

    UNION ALL SELECT
        'C',
        'Encapsulamento',
        TRUE

    UNION ALL SELECT
        'D',
        'Abstração',
        FALSE

    UNION ALL SELECT
        'E',
        'Sobrecarga',
        FALSE

) AS dados

WHERE @questao_poo_id IS NOT NULL;

COMMIT;

-- =====================================================
-- CONSULTAS DE VALIDACAO
-- =====================================================

-- Bancas cadastradas.

SELECT *
FROM bancas
ORDER BY nome;

-- Questao cadastrada.

SELECT
    q.id,
    d.nome AS disciplina,
    a.nome AS assunto,
    q.enunciado,
    q.dificuldade,
    q.origem,
    q.status
FROM questoes q
JOIN assuntos a
    ON a.id = q.assunto_id
JOIN disciplinas d
    ON d.id = a.disciplina_id;

-- Alternativas e gabarito.
-- Consulta exclusivamente administrativa.

SELECT
    questao_id,
    letra,
    texto,
    correta
FROM alternativas
WHERE questao_id = @questao_poo_id
ORDER BY letra;

-- Validacao da quantidade de alternativas corretas.

SELECT
    questao_id,
    COUNT(*) AS total_alternativas,
    SUM(correta) AS total_corretas
FROM alternativas
WHERE questao_id = @questao_poo_id
GROUP BY questao_id;
