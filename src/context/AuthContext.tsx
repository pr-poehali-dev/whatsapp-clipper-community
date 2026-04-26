import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import {
  apiLogin, apiRegister, apiGetMe, apiLogout,
  apiUpdateProfile, apiGetPortfolio, apiAddPortfolioItem,
  getSession,
} from "@/lib/api";

export interface PortfolioItem {
  id: number | string;
  title: string;
  area: string;
  time: string;
  img: string;
}

export interface CleanerProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialty: string;
  bio: string;
  price: string;
  tags: string[];
  avatar: string;
  verified: boolean;
  rating: number;
  reviews: number;
  completedJobs: number;
  portfolio: PortfolioItem[];
}

interface AuthContextType {
  user: CleanerProfile | null;
  isAuthenticated: boolean;
  loading: boolean;
  loginError: string;
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: RegisterData) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (data: Partial<CleanerProfile>) => Promise<void>;
  addPortfolioItem: (item: { title: string; area: string; time: string }) => Promise<void>;
  refreshPortfolio: () => Promise<void>;
}

export interface RegisterData {
  name: string;
  email: string;
  phone: string;
  specialty: string;
  password: string;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<CleanerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [loginError, setLoginError] = useState("");

  // Восстановление сессии при загрузке
  useEffect(() => {
    const session = getSession();
    if (!session) { setLoading(false); return; }
    apiGetMe().then(async ({ status, data }) => {
      if (status === 200) {
        const profile = data as CleanerProfile;
        const portfolio = await loadPortfolio(profile.id);
        setUser({ ...profile, portfolio });
      }
      setLoading(false);
    });
  }, []);

  async function loadPortfolio(cleanerId: string): Promise<PortfolioItem[]> {
    const { status, data } = await apiGetPortfolio(cleanerId);
    if (status === 200 && Array.isArray(data)) return data as PortfolioItem[];
    return [];
  }

  async function login(email: string, password: string): Promise<boolean> {
    setLoginError("");
    const { status, data } = await apiLogin(email, password);
    if (status === 200) {
      const profile = data.cleaner as CleanerProfile;
      const portfolio = await loadPortfolio(profile.id);
      setUser({ ...profile, portfolio });
      return true;
    }
    setLoginError((data as { error?: string }).error || "Неверный email или пароль");
    return false;
  }

  async function register(regData: RegisterData): Promise<{ ok: boolean; error?: string }> {
    const { status, data } = await apiRegister(regData);
    if (status === 200) {
      const profile = data.cleaner as CleanerProfile;
      setUser({ ...profile, portfolio: [] });
      return { ok: true };
    }
    return { ok: false, error: (data as { error?: string }).error || "Ошибка регистрации" };
  }

  function logout() {
    apiLogout();
    setUser(null);
  }

  async function updateProfile(updates: Partial<CleanerProfile>) {
    const { status, data } = await apiUpdateProfile(updates as Record<string, unknown>);
    if (status === 200) {
      setUser((prev) => prev ? { ...prev, ...(data as CleanerProfile) } : prev);
    } else {
      // Fallback — обновляем локально
      setUser((prev) => prev ? { ...prev, ...updates } : prev);
    }
  }

  async function addPortfolioItem(item: { title: string; area: string; time: string }) {
    const { status, data } = await apiAddPortfolioItem(item);
    if (status === 200) {
      setUser((prev) => prev ? { ...prev, portfolio: [data as PortfolioItem, ...(prev.portfolio || [])] } : prev);
    }
  }

  async function refreshPortfolio() {
    if (!user) return;
    const portfolio = await loadPortfolio(user.id);
    setUser((prev) => prev ? { ...prev, portfolio } : prev);
  }

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      loading,
      loginError,
      login,
      register,
      logout,
      updateProfile,
      addPortfolioItem,
      refreshPortfolio,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
