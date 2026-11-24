
-- =====================================================
-- Projeto: Geek de Boa Academy 2.0
-- Projeto Integrado II - ADS
-- Migration: 001
-- Objetivo: Criar banco e tabelas iniciais
-- SGBD: MySQL 8
-- =====================================================

CREATE DATABASE IF NOT EXISTS geekdeboa_academy
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_0900_ai_ci;

USE geekdeboa_academy;

-- =====================================================
-- TABELA: USUARIOS
-- =====================================================

CREATE TABLE IF NOT EXISTS usuarios (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    senha_hash VARCHAR(255) NOT NULL,
    perfil ENUM('ALUNO', 'ADMIN') NOT NULL DEFAULT 'ALUNO',
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
);

-- =====================================================
-- TABELA: DISCIPLINAS
-- =====================================================

CREATE TABLE IF NOT EXISTS disciplinas (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(120) NOT NULL UNIQUE,
    descricao TEXT,
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- TABELA: ASSUNTOS
-- =====================================================

CREATE TABLE IF NOT EXISTS assuntos (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    disciplina_id BIGINT UNSIGNED NOT NULL,
    nome VARCHAR(150) NOT NULL,
    descricao TEXT,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT uq_assunto_disciplina
        UNIQUE (disciplina_id, nome),

    CONSTRAINT fk_assunto_disciplina
        FOREIGN KEY (disciplina_id)
        REFERENCES disciplinas(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);

-- =====================================================
-- TABELA: CURSOS
-- =====================================================

CREATE TABLE IF NOT EXISTS cursos (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    categoria VARCHAR(100) NOT NULL,
    nivel ENUM(
        'INICIANTE',
        'INTERMEDIARIO',
        'AVANCADO'
    ) NOT NULL,
    descricao TEXT,
    link VARCHAR(2048) NOT NULL,
    carga_horaria INT UNSIGNED,
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT chk_curso_carga_horaria
        CHECK (carga_horaria > 0)
);

-- =====================================================
-- VALIDACAO
-- =====================================================

SHOW TABLES;

DESCRIBE usuarios;
DESCRIBE disciplinas;
DESCRIBE assuntos;
DESCRIBE cursos;
