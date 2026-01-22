import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import ToastConfig from "@/components/ToastProvider.tsx";
import { AuthProvider } from "@/auth/AuthContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ToastConfig />
    <AuthProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>,
);
