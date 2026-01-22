import { Route, Routes } from "react-router-dom";
import Dashboard from "@/pages/Dashboard";
import TransactionsPage from "@/pages/Transactions";
import CategoryPage from "@/pages/Category";
import { Header } from "./@shared/Header/Header";
import LoginPage from "@/pages/Login";
import RequireAuth from "@/auth/RequireAuth";

function App() {
  return (
    <Routes>
      {/* pública */}
      <Route path="/login" element={<LoginPage />} />

      {/* privadas */}
      <Route element={<RequireAuth />}>
        <Route
          path="/"
          element={
            <div className="min-h-screen">
              <Header />
              <div className="mx-auto max-w-6xl px-4 py-4">
                <Dashboard />
              </div>
            </div>
          }
        />

        <Route
          path="/transactions"
          element={
            <div className="min-h-screen">
              <Header />
              <div className="mx-auto max-w-6xl px-4 py-4">
                <TransactionsPage />
              </div>
            </div>
          }
        />

        <Route
          path="/categories"
          element={
            <div className="min-h-screen">
              <Header />
              <div className="mx-auto max-w-6xl px-4 py-4">
                <CategoryPage />
              </div>
            </div>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;
