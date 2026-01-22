import { Route, Routes } from "react-router-dom";
import RequireAuth from "@/auth/RequireAuth";

import AppShell from "@/@shared/Layout/AppShell";

import Dashboard from "@/pages/Dashboard";
import TransactionsPage from "@/pages/Transactions";
import CategoryPage from "@/pages/Category";

import LoginPage from "@/pages/Login/Login";
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
        <Route element={<AppShell />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/transactions" element={<TransactionsPage />} />
          <Route path="/categories" element={<CategoryPage />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
