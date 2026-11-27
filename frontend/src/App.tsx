
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
import Autenticacao from "./pages/Autenticacao";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import PaginaProvisoria from "./pages/PaginaProvisoria";
import EuCapacito from "./pages/EuCapacito";
import CursoDetalhes from "./pages/CursoDetalhes";
import RecursoDetalhes from "./pages/RecursoDetalhes";
import ProvasAnteriores from "./pages/ProvasAnteriores";
import Questoes from "./pages/Questoes";
import Simulados from "./pages/Simulados";
import RecuperarSenha from "./pages/RecuperarSenha";
import RedefinirSenha from "./pages/RedefinirSenha";
import Desempenho from "./pages/Desempenho";

import "./App.css";
import Cursos from "./pages/Cursos";
import "./styles/cursos.css";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
        <Route
  path="entrar"
  element={<Autenticacao />}
/>
<Route
  path="recuperar-senha"
  element={<RecuperarSenha />}
/>

<Route
  path="redefinir-senha"
  element={<RedefinirSenha />}
/>
        <Route
  path="recursos/:slug"
  element={<RecursoDetalhes />}
/>

        <Route
  path="eu-capacito"
  element={<EuCapacito />}
/>
<Route
  path="provas-anteriores"
  element={<ProvasAnteriores />}
/>
          <Route index element={<Dashboard />} />

          <Route path="cursos" element={<Cursos />} />
          <Route
  path="cursos/:id"
  element={<CursoDetalhes />}
/>
          <Route path="questoes" element={<Questoes />} />

          <Route
  path="simulados"
  element={<Simulados />}
/>

          <Route
  path="desempenho"
  element={<Desempenho />}
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
