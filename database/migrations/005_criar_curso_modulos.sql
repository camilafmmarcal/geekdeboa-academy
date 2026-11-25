
-- =====================================================
-- GEEK DE BOA ACADEMY 2.0
-- Projeto Integrado II
-- Migration 005 - Criacao da tabela curso_modulos
-- =====================================================

USE geekdeboa_academy;

CREATE TABLE IF NOT EXISTS curso_modulos (

    id BIGINT UNSIGNED AUTO_INCREMENT,

    curso_id BIGINT UNSIGNED NOT NULL,

    titulo VARCHAR(255) NOT NULL,

    ordem INT UNSIGNED NOT NULL,

    descricao TEXT NULL,

    carga_horaria INT UNSIGNED NULL,

    link VARCHAR(2048) NOT NULL,

    ativo BOOLEAN NOT NULL DEFAULT TRUE,

    criado_em TIMESTAMP NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    atualizado_em TIMESTAMP NOT NULL
        DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    -- Chave primaria
    CONSTRAINT pk_curso_modulos
        PRIMARY KEY (id),

    -- Relacionamento com a tabela cursos
    CONSTRAINT fk_modulo_curso
        FOREIGN KEY (curso_id)
        REFERENCES cursos (id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    -- Impede duas posicoes iguais no mesmo curso
    CONSTRAINT uq_curso_modulo_ordem
        UNIQUE (curso_id, ordem),

    -- Impede ordem igual a zero
    CONSTRAINT chk_modulo_ordem
        CHECK (ordem > 0),

    -- Valida a carga horaria quando informada
    CONSTRAINT chk_modulo_carga_horaria
        CHECK (
            carga_horaria IS NULL
            OR carga_horaria > 0
        ),

    -- Valida o preenchimento do titulo
    CONSTRAINT chk_modulo_titulo
        CHECK (CHAR_LENGTH(TRIM(titulo)) > 0),

    -- Valida o protocolo basico do link
    CONSTRAINT chk_modulo_link
        CHECK (
            link LIKE 'https://%'
            OR link LIKE 'http://%'
        ),

    -- Indice para consulta de modulos ativos
    INDEX idx_modulos_curso_ativo (
        curso_id,
        ativo,
        ordem
    )

) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_0900_ai_ci;


-- =====================================================
-- VALIDACAO DA MIGRATION
-- =====================================================

DESCRIBE curso_modulos;

SHOW CREATE TABLE curso_modulos;

SHOW INDEX FROM curso_modulos;

SELECT COUNT(*) AS total_tabelas
FROM information_schema.tables
WHERE table_schema = 'geekdeboa_academy'
  AND table_type = 'BASE TABLE';

SELECT COUNT(*) AS total_modulos
FROM curso_modulos;
