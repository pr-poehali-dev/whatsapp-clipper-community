import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { apiGetReviews } from "@/lib/api";
import Icon from "@/components/ui/icon";

const PORTFOLIO_IMG = "https://cdn.poehali.dev/projects/2d5b4196-61a2-4092-9b7e-d0b2304a31bb/files/f5145ac5-da33-4dad-8cce-eb757bd3d2d0.jpg";

type Tab = "overview" | "portfolio" | "profile" | "reviews";

const MOCK_REVIEWS = [
  { id: 1, author: "Дарья К.", rating: 5, text: "Квартира засверкала! Всё вовремя, аккуратно.", date: "15 апр 2026" },
  { id: 2, author: "Игорь М.", rating: 5, text: "Прекрасная работа, результат превзошёл ожидания.", date: "10 апр 2026" },
  { id: 3, author: "Ольга В.", rating: 4, text: "Хорошая уборка, всё по договорённости.", date: "3 апр 2026" },
];

const MOCK_ORDERS = [
  { id: 1, client: "Дарья К.", service: "Генеральная уборка", address: "ул. Ленина, 12", date: "28 апр 2026", status: "upcoming", price: "3 200 ₽" },
  { id: 2, client: "Сергей Н.", service: "Мойка окон", address: "пр. Мира, 45", date: "30 апр 2026", status: "upcoming", price: "1 800 ₽" },
  { id: 3, client: "Анна С.", service: "Генеральная уборка", address: "ул. Садовая, 8", date: "20 апр 2026", status: "done", price: "4 100 ₽" },
  { id: 4, client: "Максим Р.", service: "Уборка офиса", address: "бизнес-центр Альфа", date: "18 апр 2026", status: "done", price: "6 500 ₽" },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} width={13} height={13} viewBox="0 0 16 16" fill="none">
          <path
            d="M8 1.5l1.545 3.13 3.455.502-2.5 2.437.59 3.44L8 9.27l-3.09 1.739.59-3.44L3 5.132l3.455-.502L8 1.5z"
            fill={s <= Math.round(rating) ? "hsl(38 80% 58%)" : "hsl(150 10% 80%)"}
            stroke={s <= Math.round(rating) ? "hsl(38 70% 48%)" : "hsl(150 10% 72%)"}
            strokeWidth="0.5"
          />
        </svg>
      ))}
    </div>
  );
}

export default function Dashboard() {
  const { user, logout, updateProfile, addPortfolioItem } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [editMode, setEditMode] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: user?.name ?? "",
    phone: user?.phone ?? "",
    bio: user?.bio ?? "",
    price: user?.price ?? "",
    specialty: user?.specialty ?? "",
    tagsInput: user?.tags.join(", ") ?? "",
  });
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [newPortfolio, setNewPortfolio] = useState({ title: "", area: "", time: "" });
  const [portfolioAdded, setPortfolioAdded] = useState(false);
  const [realReviews, setRealReviews] = useState<{ id: string; author: string; rating: number; text: string; date: string }[]>([]);

  useEffect(() => {
    if (user?.id) {
      apiGetReviews(user.id).then(({ status, data }) => {
        if (status === 200 && Array.isArray(data)) setRealReviews(data as typeof realReviews);
      });
    }
  }, [user?.id]);

  if (!user) {
    navigate("/auth");
    return null;
  }

  async function handleSaveProfile() {
    await updateProfile({
      name: profileForm.name,
      phone: profileForm.phone,
      bio: profileForm.bio,
      price: profileForm.price,
      specialty: profileForm.specialty,
      tags: profileForm.tagsInput.split(",").map((t) => t.trim()).filter(Boolean),
    });
    setEditMode(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  }

  async function handleAddPortfolio() {
    if (!newPortfolio.title) return;
    await addPortfolioItem({
      title: newPortfolio.title,
      area: newPortfolio.area,
      time: newPortfolio.time,
    });
    setNewPortfolio({ title: "", area: "", time: "" });
    setPortfolioAdded(true);
    setTimeout(() => setPortfolioAdded(false), 3000);
  }

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: "overview", label: "Обзор", icon: "LayoutDashboard" },
    { id: "portfolio", label: "Портфолио", icon: "Images" },
    { id: "reviews", label: "Отзывы", icon: "Star" },
    { id: "profile", label: "Профиль", icon: "Settings" },
  ];

  const upcomingOrders = MOCK_ORDERS.filter((o) => o.status === "upcoming");
  const doneOrders = MOCK_ORDERS.filter((o) => o.status === "done");

  const earnings = doneOrders.reduce((sum, o) => sum + parseInt(o.price.replace(/\D/g, "")), 0);

  return (
    <div className="min-h-screen bg-background font-golos">
      {/* Top bar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/")} className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground text-xs font-bold">КМ</span>
              </div>
              <span className="font-bold text-base text-foreground hidden sm:block">КлинМастер</span>
            </button>
            <span className="text-border">|</span>
            <span className="text-sm text-muted-foreground font-medium">Личный кабинет</span>
          </div>

          <div className="flex items-center gap-3">
            {user.verified && (
              <div className="hidden sm:flex items-center gap-1.5 bg-primary/10 text-primary text-xs font-medium px-2.5 py-1 rounded-full">
                <Icon name="ShieldCheck" size={12} />
                Верифицирован
              </div>
            )}
            <div className="flex items-center gap-2">
              <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
              <span className="text-sm font-medium text-foreground hidden sm:block">{user.name}</span>
            </div>
            <button
              onClick={() => { logout(); navigate("/"); }}
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-lg hover:bg-secondary"
            >
              <Icon name="LogOut" size={15} />
              <span className="hidden sm:block">Выйти</span>
            </button>
          </div>
        </div>
      </header>

      <div className="pt-16 max-w-6xl mx-auto px-4 py-8">
        {/* Profile header card */}
        <div className="bg-card border border-border rounded-2xl p-6 mb-6 animate-fade-in">
          <div className="flex flex-wrap items-start gap-5">
            <div className="relative">
              <img src={user.avatar} alt={user.name} className="w-20 h-20 rounded-2xl object-cover" />
              {user.verified && (
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                  <Icon name="Check" size={12} className="text-primary-foreground" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className="font-semibold text-foreground text-xl">{user.name}</h1>
                {user.verified && <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">Верифицирован</span>}
              </div>
              <p className="text-muted-foreground text-sm mb-2">{user.specialty} · {user.price}</p>
              {user.rating > 0 && (
                <div className="flex items-center gap-2 mb-2">
                  <StarRating rating={user.rating} />
                  <span className="text-sm font-medium text-foreground">{user.rating}</span>
                  <span className="text-xs text-muted-foreground">({user.reviews} отзывов)</span>
                </div>
              )}
              <div className="flex gap-2 flex-wrap">
                {user.tags.map((tag) => (
                  <span key={tag} className="bg-secondary text-secondary-foreground text-xs px-2.5 py-1 rounded-full">{tag}</span>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              {[
                { val: user.completedJobs || 0, label: "уборок" },
                { val: user.reviews || 0, label: "отзывов" },
                { val: user.rating > 0 ? user.rating : "—", label: "рейтинг" },
              ].map((s) => (
                <div key={s.label} className="bg-secondary/50 rounded-xl px-4 py-3">
                  <div className="font-bold text-xl text-primary">{s.val}</div>
                  <div className="text-xs text-muted-foreground">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-secondary rounded-xl p-1 mb-6 overflow-x-auto animate-fade-in delay-100">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === t.id ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon name={t.icon} size={14} />
              {t.label}
            </button>
          ))}
        </div>

        {/* ===== OVERVIEW ===== */}
        {activeTab === "overview" && (
          <div className="animate-fade-in">
            {/* Stats */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {[
                { icon: "Calendar", label: "Предстоящие заказы", val: upcomingOrders.length, color: "text-blue-600", bg: "bg-blue-50" },
                { icon: "CheckCircle2", label: "Выполнено", val: doneOrders.length, color: "text-green-600", bg: "bg-green-50" },
                { icon: "Wallet", label: "Заработано (апрель)", val: `${earnings.toLocaleString("ru")} ₽`, color: "text-amber-600", bg: "bg-amber-50" },
                { icon: "Star", label: "Средняя оценка", val: user.rating > 0 ? user.rating : "Нет отзывов", color: "text-purple-600", bg: "bg-purple-50" },
              ].map((s) => (
                <div key={s.label} className="bg-card border border-border rounded-xl p-4">
                  <div className={`w-10 h-10 ${s.bg} rounded-xl flex items-center justify-center mb-3`}>
                    <Icon name={s.icon} size={18} className={s.color} />
                  </div>
                  <div className="font-bold text-xl text-foreground">{s.val}</div>
                  <div className="text-xs text-muted-foreground">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Orders */}
            <div className="grid lg:grid-cols-2 gap-5">
              <div className="bg-card border border-border rounded-2xl overflow-hidden">
                <div className="px-5 py-4 border-b border-border flex items-center justify-between">
                  <h3 className="font-semibold text-foreground">Предстоящие заказы</h3>
                  <span className="bg-primary/10 text-primary text-xs font-medium px-2 py-0.5 rounded-full">{upcomingOrders.length}</span>
                </div>
                {upcomingOrders.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground text-sm">Нет предстоящих заказов</div>
                ) : (
                  <div>
                    {upcomingOrders.map((o) => (
                      <div key={o.id} className="px-5 py-4 border-b border-border/50 last:border-0 flex items-center gap-3">
                        <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                          <Icon name="Calendar" size={15} className="text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-foreground text-sm">{o.service}</div>
                          <div className="text-xs text-muted-foreground">{o.client} · {o.address}</div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-sm font-semibold text-primary">{o.price}</div>
                          <div className="text-xs text-muted-foreground">{o.date}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-card border border-border rounded-2xl overflow-hidden">
                <div className="px-5 py-4 border-b border-border flex items-center justify-between">
                  <h3 className="font-semibold text-foreground">Выполненные заказы</h3>
                  <span className="bg-secondary text-muted-foreground text-xs font-medium px-2 py-0.5 rounded-full">{doneOrders.length}</span>
                </div>
                <div>
                  {doneOrders.map((o) => (
                    <div key={o.id} className="px-5 py-4 border-b border-border/50 last:border-0 flex items-center gap-3">
                      <div className="w-9 h-9 bg-green-50 rounded-xl flex items-center justify-center shrink-0">
                        <Icon name="CheckCircle2" size={15} className="text-green-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-foreground text-sm">{o.service}</div>
                        <div className="text-xs text-muted-foreground">{o.client} · {o.address}</div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-sm font-semibold text-foreground">{o.price}</div>
                        <div className="text-xs text-muted-foreground">{o.date}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===== PORTFOLIO ===== */}
        {activeTab === "portfolio" && (
          <div className="animate-fade-in">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {(user.portfolio || []).map((item) => (
                <div key={item.id} className="bg-card border border-border rounded-2xl overflow-hidden group">
                  <div className="relative h-40 overflow-hidden">
                    <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  </div>
                  <div className="p-4">
                    <div className="font-medium text-foreground text-sm mb-1">{item.title}</div>
                    <div className="flex gap-3 text-xs text-muted-foreground">
                      {item.area && <span className="flex items-center gap-1"><Icon name="Maximize2" size={10} />{item.area}</span>}
                      {item.time && <span className="flex items-center gap-1"><Icon name="Clock" size={10} />{item.time}</span>}
                    </div>
                  </div>
                </div>
              ))}

              {(user.portfolio || []).length === 0 && (
                <div className="col-span-3 py-12 text-center text-muted-foreground">
                  <Icon name="Images" size={32} className="mx-auto mb-3 opacity-30" />
                  <p className="text-sm">Добавьте первую работу в портфолио</p>
                </div>
              )}
            </div>

            {/* Add portfolio */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Icon name="Plus" size={16} className="text-primary" />
                Добавить работу
              </h3>
              <div className="grid sm:grid-cols-3 gap-3 mb-4">
                <div className="sm:col-span-3">
                  <label className="text-xs text-muted-foreground mb-1.5 block">Название работы</label>
                  <input
                    type="text"
                    placeholder="Например: Генеральная уборка 3-комн. квартиры"
                    value={newPortfolio.title}
                    onChange={(e) => setNewPortfolio((p) => ({ ...p, title: e.target.value }))}
                    className="w-full bg-secondary border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block">Площадь / объём</label>
                  <input
                    type="text"
                    placeholder="72 м²"
                    value={newPortfolio.area}
                    onChange={(e) => setNewPortfolio((p) => ({ ...p, area: e.target.value }))}
                    className="w-full bg-secondary border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block">Время работы</label>
                  <input
                    type="text"
                    placeholder="5 часов"
                    value={newPortfolio.time}
                    onChange={(e) => setNewPortfolio((p) => ({ ...p, time: e.target.value }))}
                    className="w-full bg-secondary border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    onClick={handleAddPortfolio}
                    disabled={!newPortfolio.title}
                    className="w-full bg-primary text-primary-foreground font-medium text-sm py-2.5 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-40 flex items-center justify-center gap-1.5"
                  >
                    <Icon name="Plus" size={14} />
                    Добавить
                  </button>
                </div>
              </div>
              {portfolioAdded && (
                <div className="flex items-center gap-2 text-green-600 text-sm font-medium animate-scale-in">
                  <Icon name="CheckCircle2" size={16} />
                  Работа добавлена в портфолио!
                </div>
              )}
            </div>
          </div>
        )}

        {/* ===== REVIEWS ===== */}
        {activeTab === "reviews" && (
          <div className="animate-fade-in">
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="bg-primary rounded-2xl p-6 text-primary-foreground flex items-center gap-5">
                <div className="text-center">
                  <div className="font-cormorant text-6xl font-bold text-accent">{user.rating > 0 ? user.rating : "—"}</div>
                  <StarRating rating={user.rating} />
                  <div className="text-primary-foreground/60 text-xs mt-1">{user.reviews} отзывов</div>
                </div>
                <div className="flex-1">
                  {[5, 4, 3, 2, 1].map((s) => {
                    const pct = s === 5 ? 72 : s === 4 ? 18 : s === 3 ? 7 : s === 2 ? 2 : 1;
                    return (
                      <div key={s} className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-primary-foreground/70 w-3">{s}</span>
                        <div className="flex-1 bg-primary-foreground/20 rounded-full h-1.5 overflow-hidden">
                          <div className="h-full bg-accent rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-xs text-primary-foreground/50 w-6 text-right">{pct}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Чистота", val: 4.9 },
                  { label: "Пунктуальность", val: 4.8 },
                  { label: "Общение", val: 5.0 },
                  { label: "Цена/качество", val: 4.8 },
                ].map((m) => (
                  <div key={m.label} className="bg-card border border-border rounded-xl p-4">
                    <div className="text-xs text-muted-foreground mb-1">{m.label}</div>
                    <div className="font-bold text-2xl text-foreground">{m.val}</div>
                    <div className="mt-1 bg-muted rounded-full h-1.5">
                      <div className="bg-accent h-full rounded-full" style={{ width: `${(m.val / 5) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              {(realReviews.length > 0 ? realReviews : MOCK_REVIEWS).map((r) => (
                <div key={r.id} className="bg-card border border-border rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary font-semibold text-sm">
                        {r.author[0]}
                      </div>
                      <div>
                        <div className="font-medium text-foreground text-sm">{r.author}</div>
                        <div className="text-xs text-muted-foreground">{r.date}</div>
                      </div>
                    </div>
                    <StarRating rating={r.rating} />
                  </div>
                  <p className="text-foreground/80 text-sm leading-relaxed">"{r.text}"</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===== PROFILE SETTINGS ===== */}
        {activeTab === "profile" && (
          <div className="animate-fade-in max-w-2xl">
            <div className="bg-card border border-border rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-foreground text-lg">Настройки профиля</h3>
                {!editMode ? (
                  <button
                    onClick={() => setEditMode(true)}
                    className="flex items-center gap-1.5 text-sm text-primary font-medium border border-primary/30 px-3 py-1.5 rounded-lg hover:bg-primary/5 transition-colors"
                  >
                    <Icon name="Pencil" size={13} />
                    Редактировать
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditMode(false)}
                      className="text-sm text-muted-foreground border border-border px-3 py-1.5 rounded-lg hover:bg-secondary transition-colors"
                    >
                      Отмена
                    </button>
                    <button
                      onClick={handleSaveProfile}
                      className="flex items-center gap-1.5 text-sm bg-primary text-primary-foreground font-medium px-3 py-1.5 rounded-lg hover:opacity-90 transition-opacity"
                    >
                      <Icon name="Save" size={13} />
                      Сохранить
                    </button>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-5">
                {/* Avatar */}
                <div className="flex items-center gap-4">
                  <img src={user.avatar} alt="" className="w-16 h-16 rounded-2xl object-cover" />
                  <div>
                    <div className="font-medium text-foreground text-sm mb-1">Фото профиля</div>
                    <button className="text-xs text-primary hover:underline flex items-center gap-1">
                      <Icon name="Upload" size={11} />
                      Загрузить фото
                    </button>
                  </div>
                </div>

                <div className="h-px bg-border" />

                <ProfileField label="Полное имя" icon="User" editMode={editMode}>
                  {editMode ? (
                    <input value={profileForm.name} onChange={(e) => setProfileForm((p) => ({ ...p, name: e.target.value }))} className="profile-input" />
                  ) : (
                    <span className="text-foreground text-sm">{user.name}</span>
                  )}
                </ProfileField>

                <ProfileField label="Специализация" icon="Sparkles" editMode={editMode}>
                  {editMode ? (
                    <input value={profileForm.specialty} onChange={(e) => setProfileForm((p) => ({ ...p, specialty: e.target.value }))} className="profile-input" />
                  ) : (
                    <span className="text-foreground text-sm">{user.specialty}</span>
                  )}
                </ProfileField>

                <ProfileField label="Телефон" icon="Phone" editMode={editMode}>
                  {editMode ? (
                    <input value={profileForm.phone} onChange={(e) => setProfileForm((p) => ({ ...p, phone: e.target.value }))} className="profile-input" />
                  ) : (
                    <span className="text-foreground text-sm">{user.phone}</span>
                  )}
                </ProfileField>

                <ProfileField label="Стоимость услуг" icon="Wallet" editMode={editMode}>
                  {editMode ? (
                    <input value={profileForm.price} onChange={(e) => setProfileForm((p) => ({ ...p, price: e.target.value }))} placeholder="от 2 500 ₽" className="profile-input" />
                  ) : (
                    <span className="text-foreground text-sm">{user.price || "Не указано"}</span>
                  )}
                </ProfileField>

                <ProfileField label="Теги (через запятую)" icon="Tag" editMode={editMode}>
                  {editMode ? (
                    <input value={profileForm.tagsInput} onChange={(e) => setProfileForm((p) => ({ ...p, tagsInput: e.target.value }))} placeholder="Квартиры, Офисы, Химчистка" className="profile-input" />
                  ) : (
                    <div className="flex gap-1.5 flex-wrap">
                      {user.tags.length > 0 ? user.tags.map((t) => (
                        <span key={t} className="bg-secondary text-xs px-2 py-0.5 rounded-full text-foreground">{t}</span>
                      )) : <span className="text-muted-foreground text-sm">Не указаны</span>}
                    </div>
                  )}
                </ProfileField>

                <ProfileField label="О себе" icon="FileText" editMode={editMode}>
                  {editMode ? (
                    <textarea
                      value={profileForm.bio}
                      onChange={(e) => setProfileForm((p) => ({ ...p, bio: e.target.value }))}
                      rows={3}
                      placeholder="Расскажите клиентам о себе и своём опыте..."
                      className="profile-input resize-none"
                    />
                  ) : (
                    <span className="text-foreground text-sm">{user.bio || <span className="text-muted-foreground">Не заполнено</span>}</span>
                  )}
                </ProfileField>
              </div>

              {saveSuccess && (
                <div className="mt-4 flex items-center gap-2 text-green-600 text-sm font-medium animate-scale-in">
                  <Icon name="CheckCircle2" size={16} />
                  Профиль успешно сохранён!
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <style>{`
        .profile-input {
          width: 100%;
          background: hsl(var(--secondary));
          border: 1px solid hsl(var(--border));
          border-radius: 10px;
          padding: 8px 12px;
          font-size: 14px;
          color: hsl(var(--foreground));
          outline: none;
          font-family: 'Golos Text', sans-serif;
          transition: box-shadow 0.15s, border-color 0.15s;
        }
        .profile-input:focus {
          border-color: hsl(var(--primary) / 0.5);
          box-shadow: 0 0 0 3px hsl(var(--primary) / 0.1);
        }
      `}</style>
    </div>
  );
}

function ProfileField({ label, icon, editMode, children }: {
  label: string;
  icon: string;
  editMode: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={`flex gap-3 ${editMode ? "flex-col" : "items-start"}`}>
      <div className={`flex items-center gap-1.5 text-xs text-muted-foreground ${editMode ? "" : "w-40 shrink-0 pt-0.5"}`}>
        <Icon name={icon} size={12} />
        {label}
      </div>
      <div className="flex-1">{children}</div>
    </div>
  );
}