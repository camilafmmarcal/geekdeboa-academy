
USE geekdeboa_academy;

-- Permite referenciar a combinação
-- questão + alternativa.

ALTER TABLE alternativas
ADD CONSTRAINT uq_alternativa_questao_id
UNIQUE (questao_id, id);

-- Garante que a alternativa selecionada
-- pertence à questão informada.

ALTER TABLE respostas
ADD CONSTRAINT fk_resposta_alternativa_questao
FOREIGN KEY (questao_id, alternativa_id)
REFERENCES alternativas (questao_id, id)
ON DELETE RESTRICT;
