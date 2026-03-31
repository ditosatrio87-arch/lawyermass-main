import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Newspaper,
  ShieldCheck,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { supabase } from "../../lib/supabase";
import { useNavigate, Link, Outlet, useLocation } from "react-router-dom";
import { toast } from "sonner";

export function Admin() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ ADMIN THEME
  useEffect(() => {
    document.body.classList.add("admin-theme");
    return () => document.body.classList.remove("admin-theme");
  }, []);

  // ===============================
  // SIGN OUT
  // ===============================
  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      navigate("/login");
      toast.success("Logged out");
    }
  };

  // ===============================
  // SIDEBAR MENU
  // ===============================
  const sidebarItems = [
    { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { id: "news", icon: Newspaper, label: "Manage News" },
    { id: "document-verification", icon: ShieldCheck, label: "Document Verification" },
    { id: "settings", icon: Settings, label: "Site Settings" },
  ];

  return (
    <div className="min-h-screen flex">

      {/* MOBILE TOGGLE */}
      <button
        className="lg:hidden fixed top-4 right-4 z-50 p-2 bg-gray-300 text-[#191919] rounded-md"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X /> : <Menu />}
      </button>

      {/* ===============================
          SIDEBAR
      =============================== */}
      <aside
        className={`
        fixed lg:sticky top-0 left-0 h-screen w-64 bg-gray-100 text-[#191919] flex flex-col justify-between
        transform transition-transform duration-300 z-40
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
      >
        <div>
          <div className="p-6 border-b bg-gray-200">
            <h1 className="text-lg font-bold text-[#AE8737]">ADMIN PANEL</h1>
            <p className="text-xs text-slate-400">M.A.S. Law Firm</p>
          </div>

          <nav className="p-4">
            <ul className="space-y-2">
              {sidebarItems.map((item) => {
                const Icon = item.icon;

                const isActive =
                  item.id === "dashboard"
                    ? location.pathname === "/admin"
                    : location.pathname.includes(item.id);

                return (
                  <li key={item.id}>
                    <Link
                      to={/admin/${item.id === "dashboard" ? "" : item.id}}
                      onClick={() => setSidebarOpen(false)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                        isActive
                          ? "bg-[#AE8737] text-white"
                          : "hover:bg-[#2a2a2a] hover:text-white"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        <div className="p-4 border-t">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-red-400/50 hover:bg-red-400"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* ===============================
          MAIN CONTENT
      =============================== */}
      <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
        <Outlet />
      </main>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}