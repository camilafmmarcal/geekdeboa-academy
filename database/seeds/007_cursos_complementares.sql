
-- =====================================================
-- Projeto: Geek de Boa Academy 2.0
-- Projeto Integrado II - ADS
-- Arquivo: 007_cursos_complementares.sql
-- Objetivo: Ampliar o catálogo de recursos educacionais
-- Instituições: Fundação Bradesco e FIAP
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
        'AI-900 - Microsoft Azure AI Fundamentals' AS nome,
        'Inteligência Artificial' AS categoria,
        'INICIANTE' AS nivel,
        'Fundação Bradesco - Fundamentos de inteligência artificial e serviços de IA do Microsoft Azure.' AS descricao,
        'https://www.ev.org.br/cursos/AI900Azure' AS link,
        16 AS carga_horaria

    UNION ALL SELECT
        'Programa Eu Capacito - FIAP',
        'Formação Complementar',
        'INICIANTE',
        'Portal de cadastro e acesso ao programa de cursos gratuitos da FIAP.',
        'https://on.fiap.com.br/local/programaeucapacito/',
        NULL

    UNION ALL SELECT
        'Desenvolvimento Android',
        'Desenvolvimento Mobile',
        'INTERMEDIARIO',
        'FIAP - Curso de desenvolvimento de aplicações para dispositivos Android.',
        'https://on.fiap.com.br/nano-courses/course/?id=13039',
        80

    UNION ALL SELECT
        'Desenvolvimento Java',
        'Programação',
        'INICIANTE',
        'FIAP - Curso de desenvolvimento de software utilizando a linguagem Java.',
        'https://on.fiap.com.br/nano-courses/course/?id=12949',
        60

    UNION ALL SELECT
        'Cybersegurança',
        'Segurança da Informação',
        'INICIANTE',
        'FIAP - Curso voltado aos conhecimentos de segurança cibernética.',
        'https://on.fiap.com.br/nano-courses/course/?id=5876',
        120

) AS dados

WHERE NOT EXISTS (
    SELECT 1
    FROM cursos c
    WHERE c.link = dados.link
);

COMMIT;

-- =====================================================
-- CONSULTAS DE VALIDAÇÃO
-- =====================================================

-- Listagem completa do catálogo.

SELECT
    id,
    nome,
    categoria,
    nivel,
    carga_horaria,
    link,
    ativo
FROM cursos
ORDER BY categoria, nome;

-- Total de registros.

SELECT COUNT(*) AS total_cursos
FROM cursos;

-- Carga horária conhecida.

SELECT
    SUM(carga_horaria) AS carga_horaria_total
FROM cursos
WHERE ativo = TRUE;

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

-- Registros complementares.

SELECT
    nome,
    carga_horaria,
    link
FROM cursos
WHERE link LIKE 'https://on.fiap.com.br/%'
   OR link LIKE 'https://www.ev.org.br/%';
