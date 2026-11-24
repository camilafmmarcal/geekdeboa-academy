
-- =====================================================
-- Projeto: Geek de Boa Academy 2.0
-- Projeto Integrado II - ADS
-- Arquivo: 005_publicar_simulado_teste.sql
-- Objetivo: Publicar o simulado demonstrativo
-- =====================================================

USE geekdeboa_academy;

-- Publicação do simulado de teste.
-- Exige pelo menos uma questão vinculada,
-- todas publicadas e com exatamente uma alternativa correta.

UPDATE simulados s
SET s.status = 'PUBLICADO'
WHERE s.id = 1
  AND s.titulo = 'Simulado de Programação Orientada a Objetos'
  AND s.status = 'RASCUNHO'
  AND EXISTS (
      SELECT 1
      FROM simulado_questoes sq
      WHERE sq.simulado_id = s.id
  )
  AND NOT EXISTS (
      SELECT 1
      FROM simulado_questoes sq
      JOIN questoes q ON q.id = sq.questao_id
      WHERE sq.simulado_id = s.id
        AND (
            q.status <> 'PUBLICADA'
            OR (
                SELECT COUNT(*)
                FROM alternativas a
                WHERE a.questao_id = q.id
                  AND a.correta = TRUE
            ) <> 1
        )
  );

-- Validação da publicação.

SELECT
    id,
    titulo,
    descricao,
    duracao_minutos,
    status
FROM simulados
WHERE id = 1;

-- Validação das questões vinculadas.

SELECT
    s.titulo AS simulado,
    sq.ordem,
    q.id AS questao_id,
    q.enunciado,
    q.dificuldade,
    q.status
FROM simulados s
JOIN simulado_questoes sq ON sq.simulado_id = s.id
JOIN questoes q ON q.id = sq.questao_id
WHERE s.id = 1
ORDER BY sq.ordem;
