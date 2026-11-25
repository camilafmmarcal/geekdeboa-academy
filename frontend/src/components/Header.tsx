
import { CircleUserRound } from "lucide-react";

export default function Header() {
  return (
    <header className="header">
      <div className="header-title">
        <strong>Área do estudante</strong>
        <span>Aprenda. Pratique. Evolua.</span>
      </div>

      <div className="header-actions">
        <div className="user-profile">
          <CircleUserRound size={36} />

          <div>
            <strong>Estudante</strong>
            <span>Perfil demonstrativo</span>
          </div>
        </div>
      </div>
    </header>
  );
}
