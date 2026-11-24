
-- =====================================================
-- Projeto: Geek de Boa Academy 2.0
-- Projeto Integrado II - ADS
-- Arquivo: 006_cursos_demonstrativos.sql
-- Objetivo: Popular o catálogo demonstrativo
-- =====================================================

USE geekdeboa_academy;

START TRANSACTION;

INSERT INTO cursos (
    nome,
    categoria,
    nivel,
    descricao,
    link,
    carga_horaria,
    ativo
)
SELECT
    dados.nome,
    dados.categoria,
    dados.nivel,
    dados.descricao,
    dados.link,
    dados.carga_horaria,
    TRUE
FROM (

    SELECT
        'Algoritmos' AS nome,
        'Programação' AS categoria,
        'INICIANTE' AS nivel,
        'Fundamentos de lógica de programação e algoritmos.' AS descricao,
        'https://www.cursoemvideo.com/' AS link,
        NULL AS carga_horaria

    UNION ALL SELECT
        'Python',
        'Programação',
        'INICIANTE',
        'Introdução à linguagem Python.',
        'https://www.cursoemvideo.com/',
        NULL

    UNION ALL SELECT
        'JavaScript',
        'Desenvolvimento Web',
        'INICIANTE',
        'Fundamentos da linguagem JavaScript.',
        'https://www.cursoemvideo.com/',
        NULL

    UNION ALL SELECT
        'HTML e CSS',
        'Desenvolvimento Web',
        'INICIANTE',
        'Estruturação e estilização de páginas web.',
        'https://www.cursoemvideo.com/',
        NULL

    UNION ALL SELECT
        'Responsive Web Design',
        'Desenvolvimento Web',
        'INICIANTE',
        'Desenvolvimento de interfaces web responsivas.',
        'https://www.freecodecamp.org/learn/',
        NULL

    UNION ALL SELECT
        'React',
        'Desenvolvimento Web',
        'INTERMEDIARIO',
        'Componentes, propriedades, estados e interfaces reativas.',
        'https://react.dev/learn',
        NULL

    UNION ALL SELECT
        'Node.js',
        'Desenvolvimento Web',
        'INTERMEDIARIO',
        'Fundamentos do desenvolvimento JavaScript no servidor.',
        'https://nodejs.org/en/learn',
        NULL

    UNION ALL SELECT
        'MySQL',
        'Banco de Dados',
        'INICIANTE',
        'Banco de dados relacionais e linguagem SQL.',
        'https://www.cursoemvideo.com/',
        NULL

    UNION ALL SELECT
        'Git e GitHub',
        'Engenharia de Software',
        'INICIANTE',
        'Controle de versão e colaboração em projetos.',
        'https://skills.github.com/',
        NULL

    UNION ALL SELECT
        'Fundamentos de Redes',
        'Redes de Computadores',
        'INICIANTE',
        'Conceitos fundamentais de redes e conectividade.',
        'https://www.netacad.com/',
        NULL

    UNION ALL SELECT
        'Introdução à Cibersegurança',
        'Segurança da Informação',
        'INICIANTE',
        'Fundamentos de segurança digital e proteção de informações.',
        'https://www.netacad.com/',
        NULL

    UNION ALL SELECT
        'Fundamentos de Inteligência Artificial',
        'Inteligência Artificial',
        'INICIANTE',
        'Conceitos fundamentais e aplicações de inteligência artificial.',
        'https://learn.microsoft.com/pt-br/training/',
        NULL

) AS dados

WHERE NOT EXISTS (
    SELECT 1
    FROM cursos c
    WHERE c.nome = dados.nome
      AND c.link = dados.link
);

COMMIT;

-- =====================================================
-- CONSULTAS DE VALIDAÇÃO
-- =====================================================

-- Listagem completa.

SELECT
    id,
    nome,
    categoria,
    nivel,
    descricao,
    link,
    carga_horaria,
    ativo
FROM cursos
ORDER BY categoria, nome;

-- Total de cursos cadastrados.

SELECT COUNT(*) AS total_cursos
FROM cursos;

-- Distribuição por categoria.

SELECT
    categoria,
    COUNT(*) AS quantidade
FROM cursos
GROUP BY categoria
ORDER BY categoria;

-- Distribuição por nível.

SELECT
    nivel,
    COUNT(*) AS quantidade
FROM cursos
GROUP BY nivel;
