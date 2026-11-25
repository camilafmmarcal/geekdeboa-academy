
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import PaginaProvisoria from "./pages/PaginaProvisoria";

import "./App.css";
import Cursos from "./pages/Cursos";
import "./styles/cursos.css";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>

          <Route index element={<Dashboard />} />

          <Route path="cursos" element={<Cursos />} />

          <Route
            path="questoes"
            element={
              <PaginaProvisoria
                titulo="Banco de questões"
                descricao="Pratique questões de tecnologia."
              />
            }
          />

          <Route
            path="simulados"
            element={
              <PaginaProvisoria
                titulo="Simulados"
                descricao="Prepare-se para concursos de TI."
              />
            }
          />

          <Route
            path="desempenho"
            element={
              <PaginaProvisoria
                titulo="Meu desempenho"
                descricao="Acompanhe sua evolução nos estudos."
              />
            }
          />

          <Route
            path="assistente"
            element={
              <PaginaProvisoria
                titulo="Geek AI"
                descricao="Proposta de assistente inteligente de estudos."
              />
            }
          />

          <Route
            path="*"
            element={
              <PaginaProvisoria
                titulo="Página não encontrada"
                descricao="Utilize o menu para navegar pela plataforma."
              />
            }
          />

        </Route>
      </Routes>
    </BrowserRouter>
  );
}
