
-- Geek de Boa Academy 2.0
-- Seed 009 - Atualizacao do catalogo
-- IDs conferidos com a tabela cursos

USE geekdeboa_academy;

START TRANSACTION;

-- 1 - Algoritmos e Logica de Programacao
UPDATE cursos
SET
    nome = 'Algoritmos e Lógica de Programação',
    categoria = 'Programação',
    nivel = 'INICIANTE',
    carga_horaria = 40,
    link = 'https://www.cursoemvideo.com/curso/curso-de-algoritmo/'
WHERE id = 1;

-- 2 - Python 3 (curso com quatro mundos)
UPDATE cursos
SET
    nome = 'Python 3',
    categoria = 'Programação',
    nivel = 'INICIANTE',
    carga_horaria = 160,
    descricao = 'Formação em Python 3 organizada em quatro mundos de 40 horas.',
    link = 'https://www.cursoemvideo.com/curso/python-3-mundo-1/'
WHERE id = 2;

-- 3 - JavaScript
UPDATE cursos
SET
    nome = 'JavaScript',
    categoria = 'Desenvolvimento Web',
    nivel = 'INICIANTE',
    carga_horaria = 40,
    link = 'https://www.cursoemvideo.com/curso/javascript/'
WHERE id = 3;

-- 4 - HTML5 e CSS3 (cinco modulos)
UPDATE cursos
SET
    nome = 'HTML5 e CSS3',
    categoria = 'Desenvolvimento Web',
    nivel = 'INICIANTE',
    carga_horaria = 200,
    descricao = 'Formação em HTML5 e CSS3 organizada em cinco módulos de 40 horas.',
    link = 'https://www.cursoemvideo.com/curso/html5-css3-modulo1/'
WHERE id = 4;

-- 9 - Git e GitHub
UPDATE cursos
SET
    nome = 'Git e GitHub',
    categoria = 'Engenharia de Software',
    nivel = 'INICIANTE',
    carga_horaria = 20,
    link = 'https://www.cursoemvideo.com/curso/curso-de-git-e-github/'
WHERE id = 9;

-- Recursos transferidos para a barra lateral
UPDATE cursos
SET ativo = FALSE
WHERE id IN (5, 6, 7, 12, 17);

-- Conferencia antes da confirmacao
SELECT
    id,
    nome,
    categoria,
    nivel,
    carga_horaria,
    link,
    ativo
FROM cursos
ORDER BY id;

SELECT
    COUNT(*) AS total_registros,
    SUM(ativo = TRUE) AS cursos_ativos,
    SUM(ativo = FALSE) AS recursos_inativos
FROM cursos;

-- Execute COMMIT separadamente apos conferir.
-- Em caso de erro, execute ROLLBACK.
