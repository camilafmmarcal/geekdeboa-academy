
import express from "express";
import cors from "cors";
import { pool } from "./config/database";
import disciplinaRoutes from "./routes/disciplinaRoutes";
import questaoRoutes from "./routes/questaoRoutes";

const app = express();

app.use(cors({
  origin: "http://localhost:5173"
}));

app.use(express.json());

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

app.use("/api/disciplinas", disciplinaRoutes);

const PORT = Number(process.env.PORT || 3001);

app.use("/api/questoes", questaoRoutes);

app.listen(PORT, () => {
  console.log(`Geek de Boa API iniciada na porta ${PORT}`);
});
