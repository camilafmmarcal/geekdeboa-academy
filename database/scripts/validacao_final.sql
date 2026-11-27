
USE geekdeboa_academy;

-- =============================================
-- 1. QUANTIDADE DE DADOS CADASTRADOS
-- =============================================

SELECT 'Usuários ativos' AS indicador, COUNT(*) AS total
FROM usuarios
WHERE ativo = TRUE

UNION ALL

SELECT 'Disciplinas', COUNT(*)
FROM disciplinas

UNION ALL

SELECT 'Assuntos', COUNT(*)
FROM assuntos

UNION ALL

SELECT 'Questões publicadas', COUNT(*)
FROM questoes
WHERE status = 'PUBLICADA'

UNION ALL

SELECT 'Simulados publicados', COUNT(*)
FROM simulados
WHERE status = 'PUBLICADO'

UNION ALL

SELECT 'Tentativas finalizadas', COUNT(*)
FROM tentativas
WHERE status = 'FINALIZADA'

UNION ALL

SELECT 'Respostas registradas', COUNT(*)
FROM respostas;

-- =============================================
-- 2. INTEGRIDADE DOS GABARITOS
-- Resultado esperado: nenhuma linha
-- =============================================

SELECT
    q.id AS questao_id,
    COUNT(a.id) AS alternativas,
    COALESCE(
        SUM(CASE WHEN a.correta = TRUE THEN 1 ELSE 0 END),
        0
    ) AS corretas
FROM questoes q
LEFT JOIN alternativas a
    ON a.questao_id = q.id
WHERE q.status = 'PUBLICADA'
GROUP BY q.id
HAVING alternativas <> 5
    OR corretas <> 1;

-- =============================================
-- 3. COMPOSIÇÃO DOS SIMULADOS
-- =============================================

SELECT
    s.id,
    s.titulo,
    s.status,
    s.duracao_minutos,
    COUNT(sq.questao_id) AS questoes
FROM simulados s
LEFT JOIN simulado_questoes sq
    ON sq.simulado_id = s.id
GROUP BY
    s.id,
    s.titulo,
    s.status,
    s.duracao_minutos
ORDER BY s.id;

-- =============================================
-- 4. INTEGRIDADE DAS RESPOSTAS
-- Resultado esperado: nenhuma linha
-- =============================================

SELECT
    r.id AS resposta_id,
    r.tentativa_id,
    r.questao_id,
    r.alternativa_id
FROM respostas r
LEFT JOIN alternativas a
    ON a.id = r.alternativa_id
   AND a.questao_id = r.questao_id
LEFT JOIN tentativas t
    ON t.id = r.tentativa_id
LEFT JOIN simulado_questoes sq
    ON sq.simulado_id = t.simulado_id
   AND sq.questao_id = r.questao_id
WHERE a.id IS NULL
   OR t.id IS NULL
   OR sq.questao_id IS NULL;

-- =============================================
-- 5. VERIFICAR PONTUAÇÃO ARMAZENADA
-- Resultado esperado: nenhuma linha
-- =============================================

SELECT
    t.id AS tentativa_id,
    t.acertos AS acertos_registrados,
    COUNT(
        CASE WHEN a.correta = TRUE THEN 1 END
    ) AS acertos_calculados
FROM tentativas t
LEFT JOIN respostas r
    ON r.tentativa_id = t.id
LEFT JOIN alternativas a
    ON a.id = r.alternativa_id
WHERE t.status = 'FINALIZADA'
GROUP BY t.id, t.acertos
HAVING acertos_registrados <> acertos_calculados;

-- =============================================
-- 6. DISTRIBUIÇÃO DAS TENTATIVAS
-- =============================================

SELECT
    status,
    COUNT(*) AS total
FROM tentativas
GROUP BY status
ORDER BY status;

-- =============================================
-- 7. HISTÓRICO CONSOLIDADO
-- =============================================

SELECT
    t.id,
    u.nome AS estudante,
    s.titulo AS simulado,
    t.status,
    t.acertos,
    t.total_questoes,
    CASE
        WHEN t.status = 'FINALIZADA'
             AND t.total_questoes > 0
        THEN ROUND(
            100.0 * t.acertos / t.total_questoes,
            1
        )
        ELSE NULL
    END AS aproveitamento_percentual
FROM tentativas t
INNER JOIN usuarios u
    ON u.id = t.usuario_id
INNER JOIN simulados s
    ON s.id = t.simulado_id
ORDER BY t.id DESC;
