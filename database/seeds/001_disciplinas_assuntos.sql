
-- =====================================================
-- Projeto: Geek de Boa Academy 2.0
-- Projeto Integrado II - ADS
-- Seed: 001
-- Objetivo: Cadastrar disciplinas e assuntos iniciais
-- =====================================================

USE geekdeboa_academy;

START TRANSACTION;

-- =====================================================
-- CADASTRO DAS DISCIPLINAS
-- =====================================================

INSERT INTO disciplinas (nome, descricao, ativo)
VALUES
(
    'Programação',
    'Lógica, algoritmos, linguagens e programação orientada a objetos.',
    TRUE
),
(
    'Banco de Dados',
    'Modelagem, bancos relacionais e linguagem SQL.',
    TRUE
),
(
    'Engenharia de Software',
    'Requisitos, arquitetura, modelagem e desenvolvimento de software.',
    TRUE
),
(
    'Redes de Computadores',
    'Protocolos, infraestrutura e comunicação de dados.',
    TRUE
),
(
    'Segurança da Informação',
    'Proteção de dados, segurança digital e controle de acesso.',
    TRUE
),
(
    'Qualidade de Software',
    'Testes, métricas e garantia da qualidade.',
    TRUE
),
(
    'Governança de TI',
    'Gestão, governança, serviços e riscos de tecnologia.',
    TRUE
),
(
    'Desenvolvimento Web',
    'Tecnologias, frameworks e desenvolvimento de aplicações web.',
    TRUE
),
(
    'Direito e Legislação',
    'Legislação aplicada à tecnologia e proteção de dados.',
    TRUE
)
AS novos
ON DUPLICATE KEY UPDATE
    descricao = novos.descricao,
    ativo = novos.ativo;

-- =====================================================
-- CADASTRO DOS ASSUNTOS
-- =====================================================

INSERT IGNORE INTO assuntos (
    disciplina_id,
    nome,
    descricao
)
SELECT
    d.id,
    dados.assunto,
    dados.descricao
FROM (

    SELECT
        'Programação' AS disciplina,
        'POO' AS assunto,
        'Fundamentos da programação orientada a objetos.' AS descricao

    UNION ALL SELECT
        'Programação',
        'JavaScript',
        'Fundamentos da linguagem JavaScript.'

    UNION ALL SELECT
        'Programação',
        'Estruturas de Dados',
        'Listas, filas, pilhas, árvores e estruturas de armazenamento.'

    UNION ALL SELECT
        'Banco de Dados',
        'Modelagem Entidade-Relacionamento',
        'Modelagem conceitual e relacionamentos entre entidades.'

    UNION ALL SELECT
        'Banco de Dados',
        'SQL e Consultas',
        'Comandos SQL, consultas e manipulação de dados.'

    UNION ALL SELECT
        'Engenharia de Software',
        'Requisitos de Software',
        'Levantamento e especificação de requisitos.'

    UNION ALL SELECT
        'Engenharia de Software',
        'Diagramas UML',
        'Modelagem de sistemas utilizando UML.'

    UNION ALL SELECT
        'Redes de Computadores',
        'TCP/IP',
        'Protocolos e comunicação em redes.'

    UNION ALL SELECT
        'Segurança da Informação',
        'Autenticação e Autorização',
        'Identificação de usuários e controle de permissões.'

    UNION ALL SELECT
        'Qualidade de Software',
        'Testes Unitários',
        'Validação de unidades e componentes de software.'

    UNION ALL SELECT
        'Governança de TI',
        'ITIL e COBIT',
        'Boas práticas de gestão e governança de TI.'

    UNION ALL SELECT
        'Desenvolvimento Web',
        'APIs REST',
        'Arquitetura REST e comunicação entre aplicações.'

    UNION ALL SELECT
        'Desenvolvimento Web',
        'React',
        'Desenvolvimento de interfaces utilizando React.'

    UNION ALL SELECT
        'Direito e Legislação',
        'LGPD',
        'Lei Geral de Proteção de Dados Pessoais.'

) AS dados

JOIN disciplinas d
    ON d.nome = dados.disciplina;

COMMIT;

-- =====================================================
-- CONSULTAS DE VALIDACAO
-- =====================================================

SELECT *
FROM disciplinas
ORDER BY nome;

SELECT
    d.nome AS disciplina,
    a.id,
    a.nome AS assunto,
    a.descricao
FROM assuntos a
JOIN disciplinas d
    ON d.id = a.disciplina_id
ORDER BY d.nome, a.nome;

SELECT COUNT(*) AS total_disciplinas
FROM disciplinas;

SELECT COUNT(*) AS total_assuntos
FROM assuntos;
