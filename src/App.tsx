import "./App.css";
import { NavLink, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import TransactionsPage from "@/pages/Transactions";

function App() {
  return (
    <div
      style={{
        fontFamily: "system-ui",
        padding: 16,
        maxWidth: 1000,
        margin: "0 auto",
      }}
    >
      <header
        style={{
          display: "flex",
          gap: 8,
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <h1 style={{ margin: 0, marginRight: 16 }}>Caixinha</h1>
        <nav style={{ display: "flex", gap: 8 }}>
          <NavLink to="/" className={"px-3 py-2 rounded bg-gray-100"} end>
            Dashboard
          </NavLink>
          <NavLink
            to="/transactions"
            className={"px-3 py-2 rounded bg-gray-100"}
          >
            Transações
          </NavLink>
        </nav>
      </header>

      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/transactions" element={<TransactionsPage />} />
      </Routes>
    </div>
  );
}

export default App;
