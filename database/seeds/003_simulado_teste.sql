
-- =====================================================
-- GEEK DE BOA ACADEMY 2.0
-- SEED 003 - SIMULADO DE TESTE
-- Banco: geekdeboa_academy
-- =====================================================

USE geekdeboa_academy;

-- 1. Criar o simulado de POO

INSERT INTO simulados (
    titulo,
    descricao,
    duracao_minutos
)
VALUES (
    'Simulado de Programação Orientada a Objetos',
    'Avaliação introdutória sobre conceitos de POO.',
    15
);

-- 2. Armazenar o ID do simulado criado

SET @simulado_id = LAST_INSERT_ID();

-- 3. Associar a questão publicada ao simulado

INSERT INTO simulado_questoes (
    simulado_id,
    questao_id,
    ordem
)
SELECT
    @simulado_id,
    q.id,
    1
FROM questoes q
WHERE q.status = 'PUBLICADA'
  AND q.enunciado LIKE
      'Na Programação Orientada a Objetos, qual princípio%'
ORDER BY q.id DESC
LIMIT 1;

-- 4. Consultar o resultado

SELECT
    s.id,
    s.titulo,
    s.duracao_minutos,
    s.status,
    COUNT(sq.questao_id) AS quantidade_questoes
FROM simulados s
LEFT JOIN simulado_questoes sq
    ON sq.simulado_id = s.id
WHERE s.id = @simulado_id
GROUP BY
    s.id,
    s.titulo,
    s.duracao_minutos,
    s.status;
