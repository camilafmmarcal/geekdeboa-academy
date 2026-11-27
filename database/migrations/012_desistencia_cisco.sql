USE geekdeboa_academy;

-- Execute antes de iniciar o backend atualizado.
ALTER TABLE tentativas
  MODIFY COLUMN status ENUM(
    'EM_ANDAMENTO', 'FINALIZADA', 'EXPIRADA', 'DESISTIDA'
  ) NOT NULL DEFAULT 'EM_ANDAMENTO';

-- Conferência dos cursos identificados (não são excluídos fisicamente).
SELECT id, nome, link, ativo FROM cursos
WHERE LOWER(nome) LIKE '%cisco%'
   OR LOWER(link) LIKE '%cisco%'
   OR LOWER(link) LIKE '%netacad%'
   OR LOWER(link) LIKE '%skillsforall%';

-- Remoção lógica e reversível.
UPDATE cursos
SET ativo = FALSE
WHERE LOWER(nome) LIKE '%cisco%'
   OR LOWER(link) LIKE '%cisco%'
   OR LOWER(link) LIKE '%netacad%'
   OR LOWER(link) LIKE '%skillsforall%';

SELECT id, nome, link, ativo FROM cursos
WHERE LOWER(nome) LIKE '%cisco%'
   OR LOWER(link) LIKE '%cisco%'
   OR LOWER(link) LIKE '%netacad%'
   OR LOWER(link) LIKE '%skillsforall%';
