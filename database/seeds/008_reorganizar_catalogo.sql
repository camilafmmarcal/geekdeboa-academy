USE geekdeboa_academy;

-- Retira o Programa Eu Capacito do catálogo.
-- O programa será apresentado em uma página própria.

UPDATE cursos
SET ativo = FALSE
WHERE id = 17
  AND nome LIKE '%Capacito%';

-- Validação dos registros ativos.

SELECT COUNT(*) AS total_cursos_ativos
FROM cursos
WHERE ativo = TRUE;