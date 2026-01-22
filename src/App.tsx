import { Route, Routes } from "react-router-dom";
import Dashboard from "@/pages/Dashboard";
import TransactionsPage from "@/pages/Transactions";
import CategoryPage from "@/pages/Category";
import { Header } from "@/@shared/Header/Header";
import LoginPage from "@/pages/Login/Login";
import RequireAuth from "@/auth/RequireAuth";
import RegisterPage from "@/pages/Login/Register";
import ForgotPasswordPage from "@/pages/Login/ForgotPassword";
import ResetPasswordPage from "@/pages/Login/ResetPassword";

function App() {
  return (
    <Routes>
      {/* públicas */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot" element={<ForgotPasswordPage />} />
      <Route path="/reset/:uid/:token" element={<ResetPasswordPage />} />

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
