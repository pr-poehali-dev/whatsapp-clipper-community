import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, RegisterData } from "@/context/AuthContext";
import Icon from "@/components/ui/icon";

const HERO_IMG = "https://cdn.poehali.dev/projects/2d5b4196-61a2-4092-9b7e-d0b2304a31bb/files/84cc0e7f-3bbf-4b71-ab10-0d7850c11e3b.jpg";

const SPECIALTIES = [
  "Генеральная уборка",
  "Уборка после ремонта",
  "Эко-уборка",
  "Мойка окон",
  "Уборка офисов",
  "Химчистка",
  "VIP-уборка",
];

export default function Auth() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login, register, loginError } = useAuth();
  const navigate = useNavigate();

  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [regForm, setRegForm] = useState<RegisterData & { confirmPassword: string }>({
    name: "", email: "", phone: "", specialty: SPECIALTIES[0], password: "", confirmPassword: "",
  });

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const ok = await login(loginForm.email, loginForm.password);
    setLoading(false);
    if (ok) navigate("/dashboard");
    else setError(loginError || "Неверный email или пароль");
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (regForm.password !== regForm.confirmPassword) {
      setError("Пароли не совпадают");
      return;
    }
    if (regForm.password.length < 6) {
      setError("Пароль должен быть не менее 6 символов");
      return;
    }
    setLoading(true);
    const result = await register(regForm);
    setLoading(false);
    if (result.ok) navigate("/dashboard");
    else setError(result.error || "Ошибка регистрации");
  }

  return (
    <div className="min-h-screen bg-background flex font-golos">
      {/* Left panel – image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img src={HERO_IMG} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 to-primary/60" />
        <div className="relative z-10 flex flex-col justify-between p-12 text-primary-foreground">
          <button onClick={() => navigate("/")} className="flex items-center gap-2 w-fit group">
            <div className="w-9 h-9 bg-accent rounded-xl flex items-center justify-center">
              <span className="text-accent-foreground font-bold text-sm">КМ</span>
            </div>
            <span className="font-bold text-xl">КлинМастер</span>
          </button>

          <div>
            <h2 className="font-cormorant text-5xl font-semibold leading-tight mb-4">
              Станьте частью<br />
              <em className="text-accent not-italic">лучшей команды</em><br />
              клинеров
            </h2>
            <p className="text-primary-foreground/75 text-lg mb-8">
              Тысячи клиентов ищут профессионалов именно сейчас
            </p>
            <div className="flex flex-col gap-3">
              {[
                { icon: "TrendingUp", text: "Стабильный поток заказов" },
                { icon: "Star", text: "Честный рейтинг на основе отзывов" },
                { icon: "MessageCircle", text: "Прямое общение с клиентами" },
                { icon: "Shield", text: "Безопасные сделки на платформе" },
              ].map((f) => (
                <div key={f.text} className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary-foreground/15 rounded-lg flex items-center justify-center shrink-0">
                    <Icon name={f.icon} size={15} className="text-accent" />
                  </div>
                  <span className="text-primary-foreground/85 text-sm">{f.text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="text-primary-foreground/40 text-xs">
            © 2026 КлинМастер
          </div>
        </div>
      </div>

      {/* Right panel – form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 overflow-y-auto">
        <div className="w-full max-w-md animate-fade-in">
          {/* Mobile logo */}
          <button onClick={() => navigate("/")} className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground text-xs font-bold">КМ</span>
            </div>
            <span className="font-bold text-lg text-foreground">КлинМастер</span>
          </button>

          {/* Tabs */}
          <div className="flex bg-secondary rounded-xl p-1 mb-8">
            <button
              onClick={() => { setMode("login"); setError(""); }}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${mode === "login" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
            >
              Войти
            </button>
            <button
              onClick={() => { setMode("register"); setError(""); }}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${mode === "register" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
            >
              Регистрация
            </button>
          </div>

          {mode === "login" ? (
            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <div>
                <h1 className="font-cormorant text-3xl font-semibold text-foreground mb-1">С возвращением!</h1>
                <p className="text-muted-foreground text-sm">Войдите в личный кабинет клинера</p>
              </div>

              <div className="flex flex-col gap-4 mt-2">
                <Field label="Email" icon="Mail">
                  <input
                    type="email"
                    required
                    placeholder="elena@example.com"
                    value={loginForm.email}
                    onChange={(e) => setLoginForm((p) => ({ ...p, email: e.target.value }))}
                    className="field-input"
                  />
                </Field>
                <Field label="Пароль" icon="Lock">
                  <input
                    type="password"
                    required
                    placeholder="Ваш пароль"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm((p) => ({ ...p, password: e.target.value }))}
                    className="field-input"
                  />
                </Field>
              </div>

              {error && <ErrorMsg text={error} />}

              <button type="submit" disabled={loading} className="submit-btn mt-2">
                {loading ? <Spinner /> : "Войти в кабинет"}
              </button>

              <p className="text-center text-xs text-muted-foreground">
                Нет аккаунта?{" "}
                <button type="button" onClick={() => setMode("register")} className="text-primary font-medium hover:underline">
                  Зарегистрироваться
                </button>
              </p>


            </form>
          ) : (
            <form onSubmit={handleRegister} className="flex flex-col gap-4">
              <div>
                <h1 className="font-cormorant text-3xl font-semibold text-foreground mb-1">Стать клинером</h1>
                <p className="text-muted-foreground text-sm">Создайте профиль и начните получать заказы</p>
              </div>

              <div className="flex flex-col gap-3 mt-2">
                <Field label="Полное имя" icon="User">
                  <input
                    type="text"
                    required
                    placeholder="Ваше имя и фамилия"
                    value={regForm.name}
                    onChange={(e) => setRegForm((p) => ({ ...p, name: e.target.value }))}
                    className="field-input"
                  />
                </Field>

                <div className="grid grid-cols-2 gap-3">
                  <Field label="Email" icon="Mail">
                    <input
                      type="email"
                      required
                      placeholder="you@example.com"
                      value={regForm.email}
                      onChange={(e) => setRegForm((p) => ({ ...p, email: e.target.value }))}
                      className="field-input"
                    />
                  </Field>
                  <Field label="Телефон" icon="Phone">
                    <input
                      type="tel"
                      required
                      placeholder="+7 900 000-00-00"
                      value={regForm.phone}
                      onChange={(e) => setRegForm((p) => ({ ...p, phone: e.target.value }))}
                      className="field-input"
                    />
                  </Field>
                </div>

                <Field label="Специализация" icon="Sparkles">
                  <select
                    value={regForm.specialty}
                    onChange={(e) => setRegForm((p) => ({ ...p, specialty: e.target.value }))}
                    className="field-input"
                  >
                    {SPECIALTIES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </Field>

                <div className="grid grid-cols-2 gap-3">
                  <Field label="Пароль" icon="Lock">
                    <input
                      type="password"
                      required
                      placeholder="Минимум 6 символов"
                      value={regForm.password}
                      onChange={(e) => setRegForm((p) => ({ ...p, password: e.target.value }))}
                      className="field-input"
                    />
                  </Field>
                  <Field label="Повторите пароль" icon="Lock">
                    <input
                      type="password"
                      required
                      placeholder="Ещё раз"
                      value={regForm.confirmPassword}
                      onChange={(e) => setRegForm((p) => ({ ...p, confirmPassword: e.target.value }))}
                      className="field-input"
                    />
                  </Field>
                </div>
              </div>

              {error && <ErrorMsg text={error} />}

              <button type="submit" disabled={loading} className="submit-btn mt-1">
                {loading ? <Spinner /> : "Создать профиль"}
              </button>

              <p className="text-center text-xs text-muted-foreground">
                Уже есть аккаунт?{" "}
                <button type="button" onClick={() => setMode("login")} className="text-primary font-medium hover:underline">
                  Войти
                </button>
              </p>

              <p className="text-center text-xs text-muted-foreground/60">
                Регистрируясь, вы соглашаетесь с условиями использования платформы
              </p>
            </form>
          )}
        </div>
      </div>

      <style>{`
        .field-input {
          width: 100%;
          background: hsl(var(--secondary));
          border: 1px solid hsl(var(--border));
          border-radius: 10px;
          padding: 10px 14px;
          font-size: 14px;
          color: hsl(var(--foreground));
          outline: none;
          transition: box-shadow 0.15s, border-color 0.15s;
          font-family: 'Golos Text', sans-serif;
        }
        .field-input::placeholder { color: hsl(var(--muted-foreground)); }
        .field-input:focus {
          border-color: hsl(var(--primary) / 0.5);
          box-shadow: 0 0 0 3px hsl(var(--primary) / 0.1);
        }
        .submit-btn {
          background: hsl(var(--primary));
          color: hsl(var(--primary-foreground));
          font-weight: 600;
          font-size: 15px;
          padding: 12px;
          border-radius: 12px;
          width: 100%;
          transition: opacity 0.15s, transform 0.1s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-family: 'Golos Text', sans-serif;
        }
        .submit-btn:hover:not(:disabled) { opacity: 0.9; }
        .submit-btn:active:not(:disabled) { transform: scale(0.99); }
        .submit-btn:disabled { opacity: 0.5; cursor: not-allowed; }
      `}</style>
    </div>
  );
}

function Field({ label, icon, children }: { label: string; icon: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
        <Icon name={icon} size={11} />
        {label}
      </label>
      {children}
    </div>
  );
}

function ErrorMsg({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2 bg-destructive/10 border border-destructive/20 rounded-xl px-3 py-2.5 text-sm text-destructive animate-fade-in">
      <Icon name="AlertCircle" size={14} />
      {text}
    </div>
  );
}

function Spinner() {
  return (
    <svg className="animate-spin" width={18} height={18} viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
  );
}