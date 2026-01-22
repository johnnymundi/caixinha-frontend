import { NavLink } from "react-router-dom";

export const Header = () => {
  return (
    <header className="bg-blue-200 flex items-center mb-6 gap-4">
      <h1 style={{ margin: 0, marginRight: 16 }}>Caixinha</h1>
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
