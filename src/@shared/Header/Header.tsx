import { useAuth } from "@/auth/AuthContext";
import { NavLink } from "react-router-dom";

export const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-blue-200 flex items-center mb-6 gap-4">
      <h1 style={{ margin: 0, marginRight: 16 }}>Caixinha</h1>
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-600">{user?.username}</span>
        <button
          onClick={logout}
          className="text-sm rounded-lg border px-3 py-2"
        >
          Sair
        </button>
      </div>
      <nav style={{ display: "flex", gap: 8 }}>
        <NavLink to="/" className={"px-3 py-2 rounded bg-gray-100"} end>
          Dashboard
        </NavLink>
        <NavLink to="/transactions" className={"px-3 py-2 rounded bg-gray-100"}>
          Transações
        </NavLink>
        <NavLink to="/categories" className={"px-3 py-2 rounded bg-gray-100"}>
          Categorias
        </NavLink>
      </nav>
    </header>
  );
};
