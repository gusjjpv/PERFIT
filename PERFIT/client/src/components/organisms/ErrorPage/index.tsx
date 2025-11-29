import { theme } from "../../../styles/theme";

export default function ErrorPage() {
  return (
    <div style={{ padding: 20, color: theme.colors.primary.white }}>
      <h1>404 - Página não encontrada</h1>
      <p>A rota que você tentou acessar não existe.</p>
    </div>
  );
}
