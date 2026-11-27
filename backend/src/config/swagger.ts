
const swaggerDocument = {
  openapi: "3.0.3",

  info: {
    title: "Geek de Boa Academy 2.0 API",
    version: "1.0.0",
    description: [
  "API REST desenvolvida para o Projeto Integrado II do curso de Análise e Desenvolvimento de Sistemas.",
  "A plataforma tem como objetivo auxiliar estudantes de tecnologia na preparação para concursos, realização de simulados e acesso a recursos educacionais.",
  "**Esta versão constitui uma prova de conceito acadêmica**, com endpoints de consulta integrados ao MySQL."
].join("\n\n"),
    contact: {
      name: "Geek de Boa Academy"
    }
  },

  servers: [
    {
      url: "http://localhost:3001",
      description: "Ambiente de desenvolvimento local"
    }
  ],

  tags: [
    {
      name: "Sistema",
      description: "Monitoramento da API"
    },
    {
      name: "Disciplinas",
      description: "Consulta de disciplinas e assuntos"
    },
    {
      name: "Questões",
      description: "Banco de questões de tecnologia"
    },
    {
      name: "Simulados",
      description: "Consulta de simulados publicados"
    },
    {
      name: "Cursos",
      description: "Catálogo de recursos educacionais"
    }
  ],

  paths: {
    "/api/health": {
      get: {
        tags: ["Sistema"],
        summary: "Verificar disponibilidade da API",
        description: "Verifica a comunicação com o MySQL.",
        responses: {
          "200": {
            description: "API e banco de dados disponíveis"
          },
          "503": {
            description: "Banco de dados indisponível"
          }
        }
      }
    },

    "/api/disciplinas": {
      get: {
        tags: ["Disciplinas"],
        summary: "Listar disciplinas ativas",
        responses: {
          "200": {
            description: "Disciplinas retornadas com sucesso"
          },
          "500": {
            description: "Erro interno do servidor"
          }
        }
      }
    },

    "/api/disciplinas/{id}/assuntos": {
      get: {
        tags: ["Disciplinas"],
        summary: "Listar assuntos de uma disciplina",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "Identificador da disciplina",
            schema: {
              type: "integer",
              minimum: 1,
              example: 1
            }
          }
        ],
        responses: {
          "200": {
            description: "Assuntos retornados com sucesso"
          },
          "400": {
            description: "Identificador inválido"
          },
          "404": {
            description: "Disciplina não encontrada"
          },
          "500": {
            description: "Erro interno do servidor"
          }
        }
      }
    },

    "/api/questoes": {
      get: {
        tags: ["Questões"],
        summary: "Listar questões publicadas",
        description: `
          Permite filtrar questões por disciplina,
          assunto, banca e dificuldade.
          Retorna até 10 questões por página.
          Não expõe o gabarito.
        `,
        parameters: [
          {
            name: "disciplina_id",
            in: "query",
            schema: {
              type: "integer",
              minimum: 1
            }
          },
          {
            name: "assunto_id",
            in: "query",
            schema: {
              type: "integer",
              minimum: 1
            }
          },
          {
            name: "banca_id",
            in: "query",
            schema: {
              type: "integer",
              minimum: 1
            }
          },
          {
            name: "dificuldade",
            in: "query",
            schema: {
              type: "string",
              enum: ["FACIL", "MEDIA", "DIFICIL"]
            }
          },
          {
            name: "pagina",
            in: "query",
            schema: {
              type: "integer",
              minimum: 1,
              default: 1
            }
          }
        ],
        responses: {
          "200": {
            description: "Questões retornadas com sucesso"
          },
          "400": {
            description: "Filtros inválidos"
          },
          "500": {
            description: "Erro interno do servidor"
          }
        }
      }
    },

"/api/questoes/{id}/responder": {
  post: {
    tags: ["Questões"],
    summary: "Responder uma questão no modo estudo",
    description:
      "Valida uma alternativa e retorna o gabarito comentado. Não registra tentativa ou desempenho.",
    parameters: [
      {
        name: "id",
        in: "path",
        required: true,
        schema: {
          type: "integer",
          minimum: 1
        }
      }
    ],
    requestBody: {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            required: ["alternativa_id"],
            properties: {
              alternativa_id: {
                type: "integer",
                minimum: 1,
                example: 1
              }
            }
          }
        }
      }
    },
    responses: {
      "200": {
        description: "Resposta corrigida",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                questao_id: { type: "integer" },
                alternativa_id: { type: "integer" },
                correta: { type: "boolean" },
                letra_correta: { type: "string" },
                comentario: {
                  type: "string",
                  nullable: true
                }
              }
            }
          }
        }
      },
      "400": {
        description: "Parâmetros inválidos"
      },
      "404": {
        description: "Questão não encontrada"
      },
      "422": {
        description: "Alternativa não pertence à questão"
      },
      "500": {
        description: "Erro interno"
      }
    }
  }
},

    "/api/questoes/{id}": {
      get: {
        tags: ["Questões"],
        summary: "Consultar uma questão",
        description: `
          Retorna o enunciado e as alternativas,
          sem revelar a resposta correta.
        `,
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "integer",
              minimum: 1,
              example: 1
            }
          }
        ],
        responses: {
          "200": {
            description: "Questão encontrada"
          },
          "400": {
            description: "Identificador inválido"
          },
          "404": {
            description: "Questão não encontrada"
          },
          "500": {
            description: "Erro interno do servidor"
          }
        }
      }
    },

    "/api/simulados": {
      get: {
        tags: ["Simulados"],
        summary: "Listar simulados publicados",
        responses: {
          "200": {
            description: "Simulados retornados com sucesso"
          },
          "500": {
            description: "Erro interno do servidor"
          }
        }
      }
    },

    "/api/simulados/{id}": {
      get: {
        tags: ["Simulados"],
        summary: "Consultar detalhes de um simulado",
        description: `
          Retorna as informações do simulado,
          suas questões e alternativas,
          sem exposição do gabarito.
        `,
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "integer",
              minimum: 1,
              example: 1
            }
          }
        ],
        responses: {
          "200": {
            description: "Simulado encontrado"
          },
          "400": {
            description: "Identificador inválido"
          },
          "404": {
            description: "Simulado não encontrado"
          },
          "500": {
            description: "Erro interno do servidor"
          }
        }
      }
    },
    "/api/simulados/{id}/finalizar": {
  post: {
    tags: ["Simulados"],
    summary: "Finalizar e corrigir simulado demonstrativo",
    description: "Corrige todas as respostas de uma só vez. Não persiste tentativas nem registra usuários; questões sem resposta são consideradas erradas. O tempo não é validado pelo servidor.",
    parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer", minimum: 1 } }],
    requestBody: {
      required: true,
      content: { "application/json": { schema: {
        type: "object", required: ["respostas"],
        properties: { respostas: { type: "array", items: {
          type: "object", required: ["questao_id", "alternativa_id"],
          properties: { questao_id: { type: "integer" }, alternativa_id: { type: "integer" } }
        } } }
      } } }
    },
    responses: {
      "200": { description: "Resultado e correção comentada" },
      "400": { description: "Requisição inválida ou respostas duplicadas" },
      "404": { description: "Simulado não encontrado" },
      "409": { description: "Simulado sem questões publicadas" },
      "422": { description: "Questão ou alternativa não pertence ao simulado" },
      "500": { description: "Falha interna na correção" }
    }
  }
},
    "/api/cursos": {
      get: {
        tags: ["Cursos"],
        summary: "Listar recursos educacionais ativos",
        description: `
          description:
  "Lista cursos ativos com filtros por nome, categoria e nível. 
  Cada registro informa total_modulos para identificar cursos modulares.",
        `,
        parameters: [
          {
            name: "categoria",
            in: "query",
            schema: {
              type: "string",
              example: "Programação"
            }
          },
          {
            name: "nivel",
            in: "query",
            schema: {
              type: "string",
              enum: [
                "INICIANTE",
                "INTERMEDIARIO",
                "AVANCADO"
              ]
            }
          },
          {
            name: "busca",
            in: "query",
            schema: {
              type: "string",
              example: "Android"
            }
          }
        ],
        responses: {
          "200": {
            description: "Cursos retornados com sucesso"
          },
          "400": {
            description: "Filtros inválidos"
          },
          "500": {
            description: "Erro interno do servidor"
          }
        }
      }
    },

    "/api/cursos/categorias": {
      get: {
        tags: ["Cursos"],
        summary: "Listar categorias disponíveis",
        responses: {
          "200": {
            description: "Categorias retornadas com sucesso"
          },
          "500": {
            description: "Erro interno do servidor"
          }
        }
      }
    },


"/api/cursos/{id}/modulos": {
  get: {
    tags: ["Cursos"],
    summary: "Listar módulos de um curso",
    description:
      "Consulta módulos ativos, ordenados pela sequência de estudo.",
    parameters: [
      {
        name: "id",
        in: "path",
        required: true,
        schema: {
          type: "integer",
          minimum: 1,
          example: 4
        }
      }
    ],
    responses: {
      "200": {
        description: "Módulos retornados com sucesso",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                total: {
                  type: "integer",
                  example: 5
                },
                dados: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      id: { type: "integer" },
                      curso_id: { type: "integer" },
                      titulo: { type: "string" },
                      ordem: { type: "integer" },
                      descricao: {
                        type: "string",
                        nullable: true
                      },
                      carga_horaria: {
                        type: "integer",
                        nullable: true
                      },
                      link: {
                        type: "string",
                        format: "uri"
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      "400": {
        description: "Identificador inválido"
      },
      "404": {
        description: "Curso inexistente ou inativo"
      },
      "500": {
        description: "Erro interno do servidor"
      }
    }
  }
},


    "/api/cursos/{id}": {
      get: {
        tags: ["Cursos"],
        summary: "Consultar detalhes de um curso",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "integer",
              minimum: 1,
              example: 1
            }
          }
        ],
        responses: {
          "200": {
            description: "Curso encontrado"
          },
          "400": {
            description: "Identificador inválido"
          },
          "404": {
            description: "Curso não encontrado"
          },
          "500": {
            description: "Erro interno do servidor"
          }
        }
      }
    }
  }
};

export default swaggerDocument;
