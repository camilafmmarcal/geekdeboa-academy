
USE geekdeboa_academy;

INSERT INTO usuarios (
    nome,
    email,
    senha_hash,
    perfil
)
VALUES (
    'Estudante Teste',
    'estudante.teste@geekdeboa.invalid',
    'SEM_SENHA_LOGIN_NAO_HABILITADO',
    'ALUNO'
)
AS novo
ON DUPLICATE KEY UPDATE
    nome = novo.nome;

SELECT id, nome, email, perfil
FROM usuarios
WHERE email = 'estudante.teste@geekdeboa.invalid';

USE geekdeboa_academy;

SET @usuario_id = (
    SELECT id
    FROM usuarios
    WHERE email = 'estudante.teste@geekdeboa.invalid'
);

SET @simulado_id = (
    SELECT id
    FROM simulados
    WHERE titulo =
        'Simulado de Programação Orientada a Objetos'
    ORDER BY id DESC
    LIMIT 1
);

INSERT INTO tentativas (
    usuario_id,
    simulado_id
)
VALUES (
    @usuario_id,
    @simulado_id
);

SET @tentativa_id = LAST_INSERT_ID();

SELECT
    id,
    usuario_id,
    simulado_id,
    status
FROM tentativas
WHERE id = @tentativa_id;

INSERT INTO respostas (
    tentativa_id,
    questao_id,
    alternativa_id
)
SELECT
    @tentativa_id,
    q.id,
    alt.id
FROM tentativas t
JOIN simulado_questoes sq
    ON sq.simulado_id = t.simulado_id
JOIN questoes q
    ON q.id = sq.questao_id
JOIN alternativas alt
    ON alt.questao_id = q.id
WHERE t.id = @tentativa_id
  AND t.status = 'EM_ANDAMENTO'
  AND alt.letra = 'C';

UPDATE tentativas t
SET
    t.acertos = (
        SELECT COUNT(*)
        FROM respostas r
        JOIN alternativas a
            ON a.id = r.alternativa_id
           AND a.questao_id = r.questao_id
        WHERE r.tentativa_id = t.id
          AND a.correta = TRUE
    ),
    t.total_questoes = (
        SELECT COUNT(*)
        FROM simulado_questoes sq
        WHERE sq.simulado_id = t.simulado_id
    ),
    t.finalizado_em = CURRENT_TIMESTAMP,
    t.status = 'FINALIZADA'
WHERE t.id = @tentativa_id
  AND t.status = 'EM_ANDAMENTO';

SELECT
    u.nome AS estudante,
    s.titulo AS simulado,
    t.total_questoes,
    t.acertos,
    t.total_questoes - t.acertos AS erros,
    ROUND(
        t.acertos * 100.0 /
        NULLIF(t.total_questoes, 0),
        2
    ) AS aproveitamento_percentual,
    t.status
FROM tentativas t
JOIN usuarios u ON u.id = t.usuario_id
JOIN simulados s ON s.id = t.simulado_id
WHERE t.id = @tentativa_id;
