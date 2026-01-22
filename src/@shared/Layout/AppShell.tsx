import { Outlet } from "react-router-dom";
import { Header } from "@/@shared/Header/Header";

export default function AppShell() {
  return (
    <div className="min-h-screen bg-muted/30">
      <div className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur">
        <Header />
      </div>

      {/* main centralizado */}
      <main className="mx-auto w-full max-w-6xl px-4 py-6">
        <div className="rounded-xl border bg-background p-4 shadow-sm">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
