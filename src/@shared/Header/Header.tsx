import { useAuth } from "@/auth/AuthContext";
import { Button } from "@/components/ui/button";
import { NavLink } from "react-router-dom";
import { ModeToggle } from "@/@shared/ThemeToggle";

function navClass({ isActive }: { isActive: boolean }) {
  return [
    "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
    isActive
      ? "bg-primary text-primary-foreground"
      : "text-muted-foreground hover:bg-muted hover:text-foreground",
  ].join(" ");
}

export const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-4 px-4">
        {/* Left: brand */}
        <div className="flex items-center gap-3">
          <span className="text-lg font-semibold tracking-tight">Caixinha</span>
        </div>

        {/* Middle: nav */}
        <nav className="ml-2 flex items-center gap-2">
          <NavLink to="/" className={navClass} end>
            Dashboard
          </NavLink>
          <NavLink to="/transactions" className={navClass}>
            Transações
          </NavLink>
          <NavLink to="/categories" className={navClass}>
            Categorias
          </NavLink>
        </nav>

        {/* Right: actions */}
        <div className="ml-auto flex items-center gap-2">
          <span className="hidden sm:inline text-sm text-muted-foreground">
            {user?.username}
          </span>

          <ModeToggle />

          <Button variant="outline" className="rounded-lg" onClick={logout}>
            Sair
          </Button>
        </div>
      </div>
    </header>
  );
};
