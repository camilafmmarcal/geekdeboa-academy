
-- =====================================================
-- Projeto: Geek de Boa Academy 2.0
-- Projeto Integrado II - ADS
-- Migration: 002
-- Objetivo: Criar estrutura do banco de questoes
-- Dependencia: Migration 001
-- =====================================================

USE geekdeboa_academy;

-- =====================================================
-- TABELA: BANCAS
-- =====================================================

CREATE TABLE IF NOT EXISTS bancas (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(150) NOT NULL UNIQUE,
    sigla VARCHAR(30),
    ativo BOOLEAN NOT NULL DEFAULT TRUE
);

-- =====================================================
-- TABELA: CONCURSOS
-- =====================================================

CREATE TABLE IF NOT EXISTS concursos (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    banca_id BIGINT UNSIGNED NOT NULL,
    nome VARCHAR(200) NOT NULL,
    orgao VARCHAR(200) NOT NULL,
    ano SMALLINT UNSIGNED NOT NULL,

    CONSTRAINT fk_concurso_banca
        FOREIGN KEY (banca_id)
        REFERENCES bancas(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);

-- =====================================================
-- TABELA: QUESTOES
-- =====================================================

CREATE TABLE IF NOT EXISTS questoes (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    assunto_id BIGINT UNSIGNED NOT NULL,
    concurso_id BIGINT UNSIGNED,
    enunciado TEXT NOT NULL,

    dificuldade ENUM(
        'FACIL',
        'MEDIA',
        'DIFICIL'
    ) NOT NULL DEFAULT 'MEDIA',

    comentario_gabarito TEXT,

    origem ENUM(
        'AUTORAL',
        'OFICIAL',
        'IA'
    ) NOT NULL DEFAULT 'AUTORAL',

    status ENUM(
        'RASCUNHO',
        'PUBLICADA',
        'ARQUIVADA'
    ) NOT NULL DEFAULT 'RASCUNHO',

    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_questao_assunto
        FOREIGN KEY (assunto_id)
        REFERENCES assuntos(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    CONSTRAINT fk_questao_concurso
        FOREIGN KEY (concurso_id)
        REFERENCES concursos(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);

-- =====================================================
-- TABELA: ALTERNATIVAS
-- =====================================================

CREATE TABLE IF NOT EXISTS alternativas (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    questao_id BIGINT UNSIGNED NOT NULL,
    letra CHAR(1) NOT NULL,
    texto TEXT NOT NULL,
    correta BOOLEAN NOT NULL DEFAULT FALSE,

    CONSTRAINT uq_alternativa_questao_letra
        UNIQUE (questao_id, letra),

    CONSTRAINT chk_alternativa_letra
        CHECK (letra IN ('A', 'B', 'C', 'D', 'E')),

    CONSTRAINT fk_alternativa_questao
        FOREIGN KEY (questao_id)
        REFERENCES questoes(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- =====================================================
-- VALIDACAO
-- =====================================================

SHOW TABLES;

DESCRIBE bancas;
DESCRIBE concursos;
DESCRIBE questoes;
DESCRIBE alternativas;
