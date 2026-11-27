-- Geek de Boa Academy 2.0
-- Executar no MySQL Workbench antes de testar o botão Desistir.
-- Reversível: nenhum histórico é apagado.
USE geekdeboa_academy;

ALTER TABLE tentativas
  MODIFY COLUMN status ENUM(
    'EM_ANDAMENTO',
    'FINALIZADA',
    'EXPIRADA',
    'DESISTIDA'
  ) NOT NULL DEFAULT 'EM_ANDAMENTO';

-- Prévia dos cursos associados à Cisco por nome ou link:
SELECT id, nome, link, ativo
FROM cursos
WHERE LOWER(nome) LIKE '%cisco%'
   OR LOWER(link) LIKE '%cisco%';

-- Desativação lógica: cursos permanecem no banco,
-- mas deixam de constar nos endpoints da API.
UPDATE cursos
SET ativo = FALSE
WHERE LOWER(nome) LIKE '%cisco%'
   OR LOWER(link) LIKE '%cisco%';

-- Conferência: nenhuma linha ativa da Cisco deve permanecer.
SELECT id, nome, link
FROM cursos
WHERE ativo = TRUE
  AND (
    LOWER(nome) LIKE '%cisco%'
    OR LOWER(link) LIKE '%cisco%'
  );

-- Os demais cursos permanecem inalterados.
