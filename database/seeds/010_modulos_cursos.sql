
-- =====================================================
-- GEEK DE BOA ACADEMY 2.0
-- Seed 010 - Cadastro dos modulos dos cursos
-- =====================================================

USE geekdeboa_academy;

-- Identificacao dos cursos principais

SET @id_html = (
    SELECT id
    FROM cursos
    WHERE nome = 'HTML5 e CSS3'
      AND ativo = TRUE
);

SET @id_python = (
    SELECT id
    FROM cursos
    WHERE nome = 'Python 3'
      AND ativo = TRUE
);

SELECT
    @id_html AS curso_html,
    @id_python AS curso_python;

-- Confirme os dois IDs antes de prosseguir.

START TRANSACTION;

-- =====================================================
-- HTML5 E CSS3 - 5 MODULOS
-- Carga horaria total: 200 horas
-- =====================================================

INSERT INTO curso_modulos (
    curso_id,
    titulo,
    ordem,
    carga_horaria,
    link
)
VALUES
(
    @id_html,
    'HTML5 e CSS3 - Módulo 1 de 5',
    1,
    40,
    'https://www.cursoemvideo.com/curso/html5-css3-modulo1/'
),
(
    @id_html,
    'HTML5 e CSS3 - Módulo 2 de 5',
    2,
    40,
    'https://www.cursoemvideo.com/curso/curso-html5-e-css3-modulo-2-de-5-40-horas/'
),
(
    @id_html,
    'HTML5 e CSS3 - Módulo 3 de 5',
    3,
    40,
    'https://www.cursoemvideo.com/curso/curso-html5-e-css3-modulo-3-de-5-40-horas/'
),
(
    @id_html,
    'HTML5 e CSS3 - Módulo 4 de 5',
    4,
    40,
    'https://www.cursoemvideo.com/curso/curso-html5-e-css3-modulo-4-de-5-40-horas/'
),
(
    @id_html,
    'HTML5 e CSS3 - Módulo 5 de 5',
    5,
    40,
    'https://www.cursoemvideo.com/curso/curso-html5-e-css3-modulo-5-de-5-40-horas/'
) AS novo
ON DUPLICATE KEY UPDATE
    titulo = novo.titulo,
    carga_horaria = novo.carga_horaria,
    link = novo.link,
    ativo = TRUE;


-- =====================================================
-- PYTHON 3 - 4 MUNDOS
-- Carga horaria total: 160 horas
-- =====================================================

INSERT INTO curso_modulos (
    curso_id,
    titulo,
    ordem,
    carga_horaria,
    link
)
VALUES
(
    @id_python,
    'Python 3 - Mundo 1',
    1,
    40,
    'https://www.cursoemvideo.com/curso/python-3-mundo-1/'
),
(
    @id_python,
    'Python 3 - Mundo 2',
    2,
    40,
    'https://www.cursoemvideo.com/curso/python-3-mundo-2/'
),
(
    @id_python,
    'Python 3 - Mundo 3',
    3,
    40,
    'https://www.cursoemvideo.com/curso/python-3-mundo-3/'
),
(
    @id_python,
    'Python 3 - Mundo 4',
    4,
    40,
    'https://www.cursoemvideo.com/curso/python-3-mundo-4-40-horas/'
) AS novo
ON DUPLICATE KEY UPDATE
    titulo = novo.titulo,
    carga_horaria = novo.carga_horaria,
    link = novo.link,
    ativo = TRUE;


-- =====================================================
-- VALIDACAO DOS MODULOS CADASTRADOS
-- =====================================================

SELECT
    c.nome AS curso,
    m.ordem,
    m.titulo,
    m.carga_horaria,
    m.link,
    m.ativo
FROM curso_modulos m
INNER JOIN cursos c
    ON c.id = m.curso_id
WHERE c.ativo = TRUE
  AND m.ativo = TRUE
ORDER BY c.nome, m.ordem;


-- Validacao da carga horaria total

SELECT
    c.id,
    c.nome,
    COUNT(m.id) AS total_modulos,
    c.carga_horaria AS horas_cadastradas,
    SUM(m.carga_horaria) AS horas_modulos,
    CASE
        WHEN COUNT(m.carga_horaria) <> COUNT(m.id)
            THEN 'CARGA HORARIA INCOMPLETA'
        WHEN c.carga_horaria = SUM(m.carga_horaria)
            THEN 'OK'
        ELSE 'DIVERGENTE'
    END AS validacao
FROM cursos c
INNER JOIN curso_modulos m
    ON m.curso_id = c.id
WHERE c.ativo = TRUE
  AND m.ativo = TRUE
GROUP BY
    c.id,
    c.nome,
    c.carga_horaria
ORDER BY c.nome;


-- Total de modulos ativos

SELECT COUNT(*) AS total_modulos
FROM curso_modulos m
INNER JOIN cursos c
    ON c.id = m.curso_id
WHERE m.ativo = TRUE
  AND c.ativo = TRUE;

-- Confirme os resultados antes de executar:
-- COMMIT;

-- Em caso de inconsistencias:
-- ROLLBACK;
