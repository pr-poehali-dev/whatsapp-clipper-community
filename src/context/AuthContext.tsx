import { createContext, useContext, useState, ReactNode } from "react";

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
  portfolio: { id: number; title: string; area: string; time: string; img: string }[];
}

interface AuthContextType {
  user: CleanerProfile | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<CleanerProfile>) => void;
}

export interface RegisterData {
  name: string;
  email: string;
  phone: string;
  specialty: string;
  password: string;
}

const AuthContext = createContext<AuthContextType | null>(null);

const DEMO_USER: CleanerProfile = {
  id: "demo-1",
  name: "Елена Соколова",
  email: "elena@example.com",
  phone: "+7 900 123-45-67",
  specialty: "Генеральная уборка",
  bio: "Профессиональный клинер с 5-летним опытом. Специализируюсь на генеральных уборках квартир и офисов. Использую только проверенные средства.",
  price: "от 2 500 ₽",
  tags: ["Квартиры", "Офисы", "Хим. чистка"],
  avatar: "https://cdn.poehali.dev/projects/2d5b4196-61a2-4092-9b7e-d0b2304a31bb/files/1ea98bce-a6e9-4e7c-b7b4-6872483cd9fc.jpg",
  verified: true,
  rating: 4.9,
  reviews: 127,
  completedJobs: 312,
  portfolio: [
    { id: 1, title: "Генеральная уборка квартиры", area: "72 м²", time: "5 часов", img: "https://cdn.poehali.dev/projects/2d5b4196-61a2-4092-9b7e-d0b2304a31bb/files/f5145ac5-da33-4dad-8cce-eb757bd3d2d0.jpg" },
    { id: 2, title: "Уборка офиса", area: "120 м²", time: "8 часов", img: "https://cdn.poehali.dev/projects/2d5b4196-61a2-4092-9b7e-d0b2304a31bb/files/f5145ac5-da33-4dad-8cce-eb757bd3d2d0.jpg" },
    { id: 3, title: "Химчистка мягкой мебели", area: "Диван + 2 кресла", time: "3 часа", img: "https://cdn.poehali.dev/projects/2d5b4196-61a2-4092-9b7e-d0b2304a31bb/files/f5145ac5-da33-4dad-8cce-eb757bd3d2d0.jpg" },
  ],
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<CleanerProfile | null>(null);

  async function login(email: string, _password: string): Promise<boolean> {
    await new Promise((r) => setTimeout(r, 800));
    if (email === "elena@example.com") {
      setUser(DEMO_USER);
      return true;
    }
    return false;
  }

  async function register(data: RegisterData): Promise<boolean> {
    await new Promise((r) => setTimeout(r, 1000));
    const newUser: CleanerProfile = {
      id: `user-${Date.now()}`,
      name: data.name,
      email: data.email,
      phone: data.phone,
      specialty: data.specialty,
      bio: "",
      price: "по договорённости",
      tags: [],
      avatar: "https://cdn.poehali.dev/projects/2d5b4196-61a2-4092-9b7e-d0b2304a31bb/files/1ea98bce-a6e9-4e7c-b7b4-6872483cd9fc.jpg",
      verified: false,
      rating: 0,
      reviews: 0,
      completedJobs: 0,
      portfolio: [],
    };
    setUser(newUser);
    return true;
  }

  function logout() {
    setUser(null);
  }

  function updateProfile(data: Partial<CleanerProfile>) {
    setUser((prev) => prev ? { ...prev, ...data } : prev);
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
