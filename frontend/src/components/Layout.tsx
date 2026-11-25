
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function Layout() {
  return (
    <div className="app-layout">

      <Sidebar />

      <div className="main-area">
        <Header />

        <main className="page-content">
          <Outlet />
        </main>

        <footer className="main-footer">
          Geek de Boa Academy 2.0 |
          Projeto Integrado II — ADS
        </footer>
      </div>

    </div>
  );
}
