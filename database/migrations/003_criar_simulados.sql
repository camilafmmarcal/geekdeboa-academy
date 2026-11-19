
-- =====================================================
-- GEEK DE BOA ACADEMY 2.0
-- MIGRATION 003 - ESTRUTURA DE SIMULADOS
-- Banco: geekdeboa_academy
-- =====================================================

USE geekdeboa_academy;

-- =====================================================
-- 1. TABELA: SIMULADOS
-- =====================================================

CREATE TABLE IF NOT EXISTS simulados (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(200) NOT NULL,
    descricao TEXT,
    duracao_minutos INT UNSIGNED NOT NULL,

    status ENUM(
        'RASCUNHO',
        'PUBLICADO',
        'ARQUIVADO'
    ) NOT NULL DEFAULT 'RASCUNHO',

    criado_em TIMESTAMP NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_duracao
        CHECK (duracao_minutos > 0)

) ENGINE=InnoDB;

-- =====================================================
-- 2. TABELA: SIMULADO_QUESTOES
-- =====================================================

CREATE TABLE IF NOT EXISTS simulado_questoes (
    simulado_id BIGINT UNSIGNED NOT NULL,
    questao_id BIGINT UNSIGNED NOT NULL,
    ordem INT UNSIGNED NOT NULL,

    PRIMARY KEY (simulado_id, questao_id),

    CONSTRAINT uq_simulado_ordem
        UNIQUE (simulado_id, ordem),

    CONSTRAINT chk_ordem
        CHECK (ordem > 0),

    CONSTRAINT fk_sq_simulado
        FOREIGN KEY (simulado_id)
        REFERENCES simulados(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_sq_questao
        FOREIGN KEY (questao_id)
        REFERENCES questoes(id)
        ON DELETE RESTRICT

) ENGINE=InnoDB;

-- =====================================================
-- 3. TABELA: TENTATIVAS
-- =====================================================

CREATE TABLE IF NOT EXISTS tentativas (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    usuario_id BIGINT UNSIGNED NOT NULL,
    simulado_id BIGINT UNSIGNED NOT NULL,

    iniciado_em TIMESTAMP NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    finalizado_em TIMESTAMP NULL,

    status ENUM(
        'EM_ANDAMENTO',
        'FINALIZADA',
        'EXPIRADA'
    ) NOT NULL DEFAULT 'EM_ANDAMENTO',

    acertos INT UNSIGNED,
    total_questoes INT UNSIGNED,

    CONSTRAINT fk_tentativa_usuario
        FOREIGN KEY (usuario_id)
        REFERENCES usuarios(id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_tentativa_simulado
        FOREIGN KEY (simulado_id)
        REFERENCES simulados(id)
        ON DELETE RESTRICT,

    CONSTRAINT chk_tentativa_resultado
        CHECK (
            acertos IS NULL OR
            (
                total_questoes IS NOT NULL
                AND acertos <= total_questoes
            )
        )

) ENGINE=InnoDB;

-- =====================================================
-- 4. TABELA: RESPOSTAS
-- =====================================================

CREATE TABLE IF NOT EXISTS respostas (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    tentativa_id BIGINT UNSIGNED NOT NULL,
    questao_id BIGINT UNSIGNED NOT NULL,
    alternativa_id BIGINT UNSIGNED NOT NULL,

    respondido_em TIMESTAMP NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT uq_resposta_tentativa_questao
        UNIQUE (tentativa_id, questao_id),

    CONSTRAINT fk_resposta_tentativa
        FOREIGN KEY (tentativa_id)
        REFERENCES tentativas(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_resposta_questao
        FOREIGN KEY (questao_id)
        REFERENCES questoes(id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_resposta_alternativa
        FOREIGN KEY (alternativa_id)
        REFERENCES alternativas(id)
        ON DELETE RESTRICT

) ENGINE=InnoDB;
