import { Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import TransactionsPage from "@/pages/Transactions";
import CategoryPage from "./pages/Category";
import { Header } from "./@shared/Header/Header";

function App() {
  return (
    <div className="border border-amber-500">
      <Header />

      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/transactions" element={<TransactionsPage />} />
        <Route path="/categories" element={<CategoryPage />} />
      </Routes>
    </div>
  );
}

export default App;
