
import { Construction } from "lucide-react";

interface Props {
  titulo: string;
  descricao: string;
}

export default function PaginaProvisoria({
  titulo,
  descricao
}: Props) {
  return (
    <section className="placeholder-page">
      <Construction size={48} />

      <h1>{titulo}</h1>
      <p>{descricao}</p>

      <span className="placeholder-label">
        Módulo em desenvolvimento
      </span>
    </section>
  );
}
