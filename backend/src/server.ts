
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";

import { pool } from "./config/database";
import swaggerDocument from "./config/swagger";

import disciplinaRoutes from "./routes/disciplinaRoutes";
import questaoRoutes from "./routes/questaoRoutes";
import simuladoRoutes from "./routes/simuladoRoutes";
import cursoRoutes from "./routes/cursoRoutes";

dotenv.config();

const app = express();

const PORT = Number(process.env.PORT) || 3001;

// Middlewares
app.use(cors({
  origin: "http://localhost:5173"
}));

app.use(express.json());

// Health check
app.get("/api/health", async (_req, res) => {
  try {
    await pool.query("SELECT 1");

    res.status(200).json({
      status: "ok",
      database: "connected",
      application: "Geek de Boa Academy API"
    });
  } catch (error) {
    console.error("Erro de conexão:", error);

    res.status(503).json({
      status: "error",
      database: "disconnected"
    });
  }
});

// Documentação Swagger
app.use(
  "/api/docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, {
    customSiteTitle: "Geek de Boa Academy | API",
    customCss: `
      .swagger-ui .topbar {
        background-color: #102A63;
      }

      .swagger-ui .info .title {
        color: #1769D2;
      }
    `,
    swaggerOptions: {
      docExpansion: "list",
      displayRequestDuration: true,
      filter: true
    }
  })
);

// Especificação OpenAPI em JSON
app.get("/api/openapi.json", (_req, res) => {
  res.json(swaggerDocument);
});

// Rotas da aplicação
app.use("/api/disciplinas", disciplinaRoutes);
app.use("/api/questoes", questaoRoutes);
app.use("/api/simulados", simuladoRoutes);
app.use("/api/cursos", cursoRoutes);

// Inicialização do servidor
app.listen(PORT, () => {
  console.log(
    `Geek de Boa API iniciada na porta ${PORT}`
  );

  console.log(
    `Swagger: http://localhost:${PORT}/api/docs`
  );
});
