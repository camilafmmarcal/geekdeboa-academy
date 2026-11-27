
USE geekdeboa_academy;

CREATE TABLE IF NOT EXISTS recuperacao_senha (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    usuario_id BIGINT UNSIGNED NOT NULL,
    token_hash CHAR(64) NOT NULL,
    expira_em DATETIME NOT NULL,
    criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT uq_recuperacao_token
        UNIQUE (token_hash),

    CONSTRAINT fk_recuperacao_usuario
        FOREIGN KEY (usuario_id)
        REFERENCES usuarios(id)
        ON DELETE CASCADE,

    INDEX idx_recuperacao_usuario (usuario_id),
    INDEX idx_recuperacao_expiracao (expira_em)
) ENGINE=InnoDB;
