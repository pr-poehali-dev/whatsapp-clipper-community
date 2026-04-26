import { useState } from "react";
import Icon from "@/components/ui/icon";

const HERO_IMG = "https://cdn.poehali.dev/projects/2d5b4196-61a2-4092-9b7e-d0b2304a31bb/files/84cc0e7f-3bbf-4b71-ab10-0d7850c11e3b.jpg";
const CLEANER_IMG = "https://cdn.poehali.dev/projects/2d5b4196-61a2-4092-9b7e-d0b2304a31bb/files/1ea98bce-a6e9-4e7c-b7b4-6872483cd9fc.jpg";
const PORTFOLIO_IMG = "https://cdn.poehali.dev/projects/2d5b4196-61a2-4092-9b7e-d0b2304a31bb/files/f5145ac5-da33-4dad-8cce-eb757bd3d2d0.jpg";

const cleaners = [
  {
    id: 1,
    name: "Елена Соколова",
    specialty: "Генеральная уборка",
    rating: 4.9,
    reviews: 127,
    completedJobs: 312,
    price: "от 2 500 ₽",
    avatar: CLEANER_IMG,
    verified: true,
    tags: ["Квартиры", "Офисы", "Хим. чистка"],
    badge: "Топ месяца",
  },
  {
    id: 2,
    name: "Мария Петрова",
    specialty: "Уборка после ремонта",
    rating: 4.8,
    reviews: 94,
    completedJobs: 201,
    price: "от 3 200 ₽",
    avatar: CLEANER_IMG,
    verified: true,
    tags: ["После ремонта", "Мойка окон"],
    badge: "",
  },
  {
    id: 3,
    name: "Анна Фролова",
    specialty: "Эко-уборка",
    rating: 4.7,
    reviews: 68,
    completedJobs: 143,
    price: "от 2 200 ₽",
    avatar: CLEANER_IMG,
    verified: false,
    tags: ["Эко-средства", "Детские комнаты"],
    badge: "Новый",
  },
];

const reviews = [
  {
    id: 1,
    author: "Дарья К.",
    rating: 5,
    text: "Елена — просто находка! Квартира засверкала. Всё вовремя, аккуратно, внимательно к деталям.",
    date: "15 апреля 2026",
    cleaner: "Елена Соколова",
  },
  {
    id: 2,
    author: "Игорь М.",
    rating: 5,
    text: "После ремонта казалось, что чистоты не добиться. Мария справилась за 4 часа — результат впечатляет!",
    date: "10 апреля 2026",
    cleaner: "Мария Петрова",
  },
  {
    id: 3,
    author: "Светлана Р.",
    rating: 4,
    text: "Хорошая работа, всё по договорённости. Экологичные средства — важно для нас с ребёнком.",
    date: "5 апреля 2026",
    cleaner: "Анна Фролова",
  },
];

const services = [
  { icon: "Home", title: "Генеральная уборка", desc: "Полная уборка квартиры или дома с мытьём всех поверхностей" },
  { icon: "Wrench", title: "После ремонта", desc: "Удаление строительной пыли, побелки и монтажного клея" },
  { icon: "Wind", title: "Мойка окон", desc: "Чистые окна без разводов снаружи и внутри" },
  { icon: "Leaf", title: "Эко-уборка", desc: "Только безопасные сертифицированные средства" },
  { icon: "Building2", title: "Офисы и помещения", desc: "Регулярное обслуживание коммерческих площадей" },
  { icon: "Star", title: "VIP-уборка", desc: "Премиальный сервис с выездом в удобное время" },
];

function StarRating({ rating, size = 16 }: { rating: number; size?: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} width={size} height={size} viewBox="0 0 16 16" fill="none">
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

const CHAT_MESSAGES = [
  { id: 1, from: "cleaner", text: "Добрый день! Я готова взяться за уборку вашей квартиры 🌿", time: "10:02" },
  { id: 2, from: "client", text: "Здравствуйте! Нам нужна генеральная уборка, ~60 м²", time: "10:05" },
  { id: 3, from: "cleaner", text: "Отлично, для 60 м² у меня ценник 2 800 ₽. Свободна в пятницу с 10:00", time: "10:06" },
  { id: 4, from: "client", text: "Пятница подходит! В 11:00 удобно?", time: "10:08" },
  { id: 5, from: "cleaner", text: "Договорились! Пришлю напоминание за день до уборки 👍", time: "10:09" },
];

type NavSection = "home" | "services" | "cleaners" | "portfolio" | "chat" | "rating";

export default function Index() {
  const [activeSection, setActiveSection] = useState<NavSection>("home");
  const [chatMessages, setChatMessages] = useState(CHAT_MESSAGES);
  const [chatInput, setChatInput] = useState("");
  const [activeCleaner, setActiveCleaner] = useState(cleaners[0]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewText, setNewReviewText] = useState("");
  const [reviewsData, setReviewsData] = useState(reviews);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const navItems: { id: NavSection; label: string; icon: string }[] = [
    { id: "home", label: "Главная", icon: "Home" },
    { id: "services", label: "Услуги", icon: "Sparkles" },
    { id: "cleaners", label: "Рейтинг", icon: "Trophy" },
    { id: "portfolio", label: "Портфолио", icon: "Images" },
    { id: "chat", label: "Чат", icon: "MessageCircle" },
    { id: "rating", label: "Отзывы", icon: "Star" },
  ];

  function sendMessage() {
    if (!chatInput.trim()) return;
    setChatMessages((prev) => [
      ...prev,
      { id: prev.length + 1, from: "client", text: chatInput, time: new Date().toLocaleTimeString("ru", { hour: "2-digit", minute: "2-digit" }) },
    ]);
    setChatInput("");
    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        { id: prev.length + 1, from: "cleaner", text: "Спасибо! Свяжусь с вами в ближайшее время 😊", time: new Date().toLocaleTimeString("ru", { hour: "2-digit", minute: "2-digit" }) },
      ]);
    }, 1000);
  }

  function submitReview() {
    if (!newReviewText.trim()) return;
    setReviewsData((prev) => [
      { id: prev.length + 1, author: "Вы", rating: newReviewRating, text: newReviewText, date: "Только что", cleaner: activeCleaner.name },
      ...prev,
    ]);
    setNewReviewText("");
    setReviewSubmitted(true);
    setTimeout(() => setReviewSubmitted(false), 3000);
  }

  return (
    <div className="min-h-screen bg-background font-golos">
      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <button onClick={() => setActiveSection("home")} className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground text-xs font-bold">КМ</span>
            </div>
            <span className="font-golos font-bold text-lg text-foreground">Клин<span className="text-primary">Мастер</span></span>
          </button>

          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeSection === item.id
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                <Icon name={item.icon} size={15} />
                {item.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => setActiveSection("chat")}
            className="hidden md:flex items-center gap-2 bg-accent text-accent-foreground font-semibold px-4 py-2 rounded-lg text-sm hover:opacity-90 transition-opacity"
          >
            <Icon name="MessageCircle" size={15} />
            Написать клинеру
          </button>

          <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <Icon name={mobileMenuOpen ? "X" : "Menu"} size={22} />
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-background border-t border-border px-4 py-3 flex flex-col gap-1 animate-fade-in">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => { setActiveSection(item.id); setMobileMenuOpen(false); }}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  activeSection === item.id ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-secondary"
                }`}
              >
                <Icon name={item.icon} size={16} />
                {item.label}
              </button>
            ))}
          </div>
        )}
      </nav>

      <main className="pt-16">
        {/* ======= HOME ======= */}
        {activeSection === "home" && (
          <div>
            <section className="relative overflow-hidden min-h-[90vh] flex items-center">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${HERO_IMG})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-transparent" />
              <div className="relative max-w-6xl mx-auto px-4 py-20 grid md:grid-cols-2 gap-12 items-center">
                <div className="text-primary-foreground">
                  <div className="inline-flex items-center gap-2 bg-primary-foreground/15 border border-primary-foreground/20 rounded-full px-4 py-1.5 text-sm mb-6 animate-fade-in">
                    <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                    Платформа проверенных клинеров
                  </div>
                  <h1 className="font-cormorant text-5xl md:text-6xl font-semibold leading-tight mb-5 animate-fade-in delay-100">
                    Чистота — это<br />
                    <em className="text-accent not-italic">доверие</em>
                  </h1>
                  <p className="text-primary-foreground/80 text-lg mb-8 leading-relaxed animate-fade-in delay-200">
                    Находите клинеров с реальными отзывами, проверенным портфолио и честным рейтингом
                  </p>
                  <div className="flex flex-wrap gap-3 animate-fade-in delay-300">
                    <button
                      onClick={() => setActiveSection("cleaners")}
                      className="bg-accent text-accent-foreground font-semibold px-6 py-3 rounded-xl hover:opacity-90 transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                      Найти клинера
                    </button>
                    <button
                      onClick={() => setActiveSection("portfolio")}
                      className="bg-primary-foreground/10 border border-primary-foreground/30 text-primary-foreground font-medium px-6 py-3 rounded-xl hover:bg-primary-foreground/20 transition-all"
                    >
                      Смотреть работы
                    </button>
                  </div>
                  <div className="flex gap-8 mt-10 animate-fade-in delay-400">
                    {[["312+", "Выполнено уборок"], ["4.9", "Средний рейтинг"], ["127", "Отзывов"]].map(([v, l]) => (
                      <div key={l}>
                        <div className="text-2xl font-bold text-accent">{v}</div>
                        <div className="text-primary-foreground/60 text-xs">{l}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <section className="py-20 max-w-6xl mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="font-cormorant text-4xl font-semibold text-foreground mb-3">Почему выбирают нас</h2>
                <p className="text-muted-foreground">Три столпа нашей платформы</p>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  { icon: "ShieldCheck", title: "Верифицированные клинеры", desc: "Каждый клинер проходит проверку документов и собеседование перед размещением на платформе", bg: "bg-green-50" },
                  { icon: "Trophy", title: "Честный рейтинг", desc: "Рейтинг формируется только из реальных отзывов клиентов, которые воспользовались услугой", bg: "bg-amber-50" },
                  { icon: "MessageCircle", title: "Прямой чат", desc: "Общайтесь с клинером напрямую, обсуждайте детали и договаривайтесь о времени без посредников", bg: "bg-sky-50" },
                ].map((f, i) => (
                  <div key={f.title} className={`rounded-2xl p-6 border border-border hover:shadow-lg transition-all duration-300 animate-fade-in delay-${(i + 1) * 100}`}>
                    <div className={`w-12 h-12 ${f.bg} rounded-xl flex items-center justify-center mb-4`}>
                      <Icon name={f.icon} size={22} className="text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground text-lg mb-2">{f.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-secondary/30 py-16">
              <div className="max-w-6xl mx-auto px-4">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="font-cormorant text-4xl font-semibold text-foreground">Топ клинеры</h2>
                  <button onClick={() => setActiveSection("cleaners")} className="text-primary text-sm font-medium hover:underline flex items-center gap-1">
                    Все клинеры <Icon name="ArrowRight" size={14} />
                  </button>
                </div>
                <div className="grid md:grid-cols-3 gap-5">
                  {cleaners.map((c, i) => (
                    <CleanerCard key={c.id} cleaner={c} index={i} onChat={() => { setActiveCleaner(c); setActiveSection("chat"); }} onReview={() => { setActiveCleaner(c); setActiveSection("rating"); }} />
                  ))}
                </div>
              </div>
            </section>
          </div>
        )}

        {/* ======= SERVICES ======= */}
        {activeSection === "services" && (
          <section className="max-w-6xl mx-auto px-4 py-16">
            <div className="mb-10 animate-fade-in">
              <span className="text-accent font-medium text-sm uppercase tracking-wider">Что мы делаем</span>
              <h1 className="font-cormorant text-5xl font-semibold text-foreground mt-2 mb-3">Наши услуги</h1>
              <p className="text-muted-foreground max-w-xl">Широкий спектр клининговых услуг — от ежедневного обслуживания до сложных работ после ремонта</p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
              {services.map((s, i) => (
                <div key={s.title} className={`group bg-card border border-border rounded-2xl p-6 hover:border-primary/30 hover:shadow-md transition-all duration-300 cursor-pointer animate-fade-in delay-${i * 100}`}>
                  <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors">
                    <Icon name={s.icon} size={22} className="text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground text-base mb-1.5">{s.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{s.desc}</p>
                  <div className="mt-4 flex items-center gap-1 text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    Подробнее <Icon name="ArrowRight" size={13} />
                  </div>
                </div>
              ))}
            </div>

            <div className="relative overflow-hidden rounded-3xl bg-primary p-10 text-primary-foreground text-center">
              <h2 className="font-cormorant text-4xl font-semibold mb-3">Готовы заказать уборку?</h2>
              <p className="text-primary-foreground/75 mb-6">Выберите клинера, обсудите детали в чате и получите сверкающую чистоту</p>
              <button onClick={() => setActiveSection("cleaners")} className="bg-accent text-accent-foreground font-semibold px-8 py-3 rounded-xl hover:opacity-90 transition-opacity">
                Выбрать клинера
              </button>
            </div>
          </section>
        )}

        {/* ======= CLEANERS / RATING ======= */}
        {activeSection === "cleaners" && (
          <section className="max-w-6xl mx-auto px-4 py-16">
            <div className="mb-10 animate-fade-in">
              <span className="text-accent font-medium text-sm uppercase tracking-wider">Рейтинг</span>
              <h1 className="font-cormorant text-5xl font-semibold text-foreground mt-2 mb-3">Лучшие клинеры</h1>
              <p className="text-muted-foreground">Рейтинг строится на реальных оценках клиентов после каждой уборки</p>
            </div>

            <div className="grid md:grid-cols-3 gap-4 mb-10">
              {cleaners.map((c, i) => (
                <div key={c.id} className={`animate-fade-in delay-${i * 100}`}>
                  <CleanerCard cleaner={c} index={i} onChat={() => { setActiveCleaner(c); setActiveSection("chat"); }} onReview={() => { setActiveCleaner(c); setActiveSection("rating"); }} showRank />
                </div>
              ))}
            </div>

            <div className="bg-card rounded-2xl border border-border p-6 animate-fade-in delay-400">
              <h3 className="font-semibold text-foreground mb-4">Распределение оценок по платформе</h3>
              {[5, 4, 3, 2, 1].map((star) => {
                const counts = [189, 58, 14, 4, 2];
                const count = counts[5 - star];
                const total = counts.reduce((a, b) => a + b, 0);
                const pct = Math.round((count / total) * 100);
                return (
                  <div key={star} className="flex items-center gap-3 mb-2">
                    <div className="flex items-center gap-1 w-16 shrink-0">
                      <span className="text-sm text-foreground">{star}</span>
                      <Icon name="Star" size={12} className="text-accent" />
                    </div>
                    <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full bg-accent rounded-full transition-all duration-700"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground w-8 text-right">{pct}%</span>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* ======= PORTFOLIO ======= */}
        {activeSection === "portfolio" && (
          <section className="max-w-6xl mx-auto px-4 py-16">
            <div className="mb-10 animate-fade-in">
              <span className="text-accent font-medium text-sm uppercase tracking-wider">Портфолио</span>
              <h1 className="font-cormorant text-5xl font-semibold text-foreground mt-2 mb-3">Наши работы</h1>
              <p className="text-muted-foreground">Реальные фото до и после уборки от наших клинеров</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
              {[
                { title: "Генеральная уборка", cleaner: "Елена Соколова", area: "72 м²", time: "5 часов", rating: 5 },
                { title: "После ремонта", cleaner: "Мария Петрова", area: "55 м²", time: "7 часов", rating: 5 },
                { title: "Эко-уборка", cleaner: "Анна Фролова", area: "40 м²", time: "3 часа", rating: 4 },
                { title: "Уборка офиса", cleaner: "Елена Соколова", area: "120 м²", time: "8 часов", rating: 5 },
                { title: "Мойка окон", cleaner: "Мария Петрова", area: "24 окна", time: "4 часа", rating: 5 },
                { title: "Детская комната", cleaner: "Анна Фролова", area: "18 м²", time: "2 часа", rating: 4 },
              ].map((item, i) => (
                <div key={i} className={`group bg-card rounded-2xl overflow-hidden border border-border hover:shadow-lg transition-all duration-300 animate-fade-in delay-${i * 100}`}>
                  <div className="relative overflow-hidden h-48">
                    <img
                      src={PORTFOLIO_IMG}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3">
                      <span className="bg-primary/90 text-primary-foreground text-xs font-medium px-2.5 py-1 rounded-full">
                        {item.title}
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-foreground text-sm">{item.cleaner}</span>
                      <StarRating rating={item.rating} size={13} />
                    </div>
                    <div className="flex gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Icon name="Maximize2" size={11} />{item.area}</span>
                      <span className="flex items-center gap-1"><Icon name="Clock" size={11} />{item.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center">
              <button className="border border-primary text-primary font-medium px-8 py-3 rounded-xl hover:bg-primary hover:text-primary-foreground transition-all">
                Загрузить ещё работы
              </button>
            </div>
          </section>
        )}

        {/* ======= CHAT ======= */}
        {activeSection === "chat" && (
          <section className="max-w-5xl mx-auto px-4 py-16">
            <div className="mb-8 animate-fade-in">
              <span className="text-accent font-medium text-sm uppercase tracking-wider">Общение</span>
              <h1 className="font-cormorant text-5xl font-semibold text-foreground mt-2 mb-3">Чат с клинером</h1>
              <p className="text-muted-foreground">Задавайте вопросы и договаривайтесь об условиях напрямую</p>
            </div>

            <div className="grid md:grid-cols-[280px_1fr] gap-5 animate-fade-in delay-100">
              <div className="bg-card rounded-2xl border border-border overflow-hidden">
                <div className="p-4 border-b border-border">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Диалоги</span>
                </div>
                {cleaners.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setActiveCleaner(c)}
                    className={`w-full flex items-center gap-3 p-4 hover:bg-secondary/50 transition-colors border-b border-border/50 last:border-0 ${activeCleaner.id === c.id ? "bg-primary/5 border-l-2 border-l-primary" : ""}`}
                  >
                    <div className="relative shrink-0">
                      <img src={c.avatar} alt={c.name} className="w-10 h-10 rounded-full object-cover" />
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-card rounded-full" />
                    </div>
                    <div className="text-left min-w-0">
                      <div className="font-medium text-foreground text-sm truncate">{c.name}</div>
                      <div className="text-xs text-muted-foreground truncate">{c.specialty}</div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="bg-card rounded-2xl border border-border flex flex-col" style={{ height: "520px" }}>
                <div className="p-4 border-b border-border flex items-center gap-3">
                  <img src={activeCleaner.avatar} alt={activeCleaner.name} className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <div className="font-semibold text-foreground text-sm">{activeCleaner.name}</div>
                    <div className="flex items-center gap-1 text-xs text-green-600">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                      В сети
                    </div>
                  </div>
                  <div className="ml-auto flex items-center gap-2">
                    <span className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded-full flex items-center gap-1">
                      <Icon name="Star" size={11} className="text-accent" />
                      {activeCleaner.rating}
                    </span>
                    <span className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded-full">{activeCleaner.price}</span>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
                  {chatMessages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.from === "client" ? "justify-end" : "justify-start"}`}>
                      {msg.from === "cleaner" && (
                        <img src={activeCleaner.avatar} alt="" className="w-7 h-7 rounded-full object-cover mr-2 mt-auto shrink-0" />
                      )}
                      <div className={`max-w-[75%] ${msg.from === "client" ? "chat-bubble-out bg-primary text-primary-foreground" : "chat-bubble-in bg-secondary text-foreground"} px-4 py-2.5 text-sm`}>
                        {msg.text}
                        <div className={`text-xs mt-1 ${msg.from === "client" ? "text-primary-foreground/60" : "text-muted-foreground"}`}>{msg.time}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-4 border-t border-border flex gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    placeholder="Напишите сообщение..."
                    className="flex-1 bg-secondary border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 text-foreground placeholder:text-muted-foreground"
                  />
                  <button
                    onClick={sendMessage}
                    className="bg-primary text-primary-foreground w-10 h-10 rounded-xl flex items-center justify-center hover:opacity-90 transition-opacity shrink-0"
                  >
                    <Icon name="Send" size={16} />
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ======= REVIEWS ======= */}
        {activeSection === "rating" && (
          <section className="max-w-6xl mx-auto px-4 py-16">
            <div className="mb-10 animate-fade-in">
              <span className="text-accent font-medium text-sm uppercase tracking-wider">Оценки и отзывы</span>
              <h1 className="font-cormorant text-5xl font-semibold text-foreground mt-2 mb-3">Что говорят клиенты</h1>
              <p className="text-muted-foreground">Только реальные отзывы от людей, которые воспользовались услугами</p>
            </div>

            <div className="grid md:grid-cols-4 gap-5 mb-10">
              <div className="md:col-span-1 bg-primary rounded-2xl p-6 text-primary-foreground text-center animate-fade-in">
                <div className="font-cormorant text-7xl font-bold text-accent">4.9</div>
                <StarRating rating={4.9} size={20} />
                <div className="mt-3 text-primary-foreground/70 text-sm">на основе 289 отзывов</div>
              </div>
              <div className="md:col-span-3 grid sm:grid-cols-3 gap-4">
                {[
                  { label: "Чистота", val: 4.9 },
                  { label: "Пунктуальность", val: 4.8 },
                  { label: "Общение", val: 5.0 },
                  { label: "Качество", val: 4.9 },
                  { label: "Цена/качество", val: 4.7 },
                  { label: "Рекомендуют", val: "98%" },
                ].map((m, i) => (
                  <div key={m.label} className={`bg-card border border-border rounded-xl p-4 animate-fade-in delay-${i * 50 + 100}`}>
                    <div className="text-muted-foreground text-xs mb-1">{m.label}</div>
                    <div className="font-bold text-2xl text-foreground">{m.val}</div>
                    {typeof m.val === "number" && (
                      <div className="mt-1.5 bg-muted rounded-full h-1.5">
                        <div className="bg-accent h-full rounded-full" style={{ width: `${(m.val / 5) * 100}%` }} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-10">
              {reviewsData.map((r, i) => (
                <div key={r.id} className={`bg-card border border-border rounded-2xl p-5 animate-fade-in delay-${i * 100}`}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center text-primary font-semibold text-sm">
                        {r.author[0]}
                      </div>
                      <div>
                        <div className="font-medium text-foreground text-sm">{r.author}</div>
                        <div className="text-xs text-muted-foreground">{r.date}</div>
                      </div>
                    </div>
                    <StarRating rating={r.rating} size={14} />
                  </div>
                  <p className="text-foreground/80 text-sm leading-relaxed mb-3">"{r.text}"</p>
                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                    <Icon name="User" size={11} />
                    Клинер: {r.cleaner}
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-card border border-border rounded-2xl p-6 animate-fade-in delay-400">
              <h3 className="font-semibold text-foreground text-lg mb-1">Оставить отзыв</h3>
              <p className="text-muted-foreground text-sm mb-4">Поделитесь своим опытом — это поможет другим клиентам</p>

              <div className="mb-4">
                <label className="text-sm text-muted-foreground mb-2 block">Ваша оценка</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button key={s} onClick={() => setNewReviewRating(s)} className="transition-transform hover:scale-110">
                      <svg width={28} height={28} viewBox="0 0 16 16" fill="none">
                        <path
                          d="M8 1.5l1.545 3.13 3.455.502-2.5 2.437.59 3.44L8 9.27l-3.09 1.739.59-3.44L3 5.132l3.455-.502L8 1.5z"
                          fill={s <= newReviewRating ? "hsl(38 80% 58%)" : "hsl(150 10% 85%)"}
                          stroke={s <= newReviewRating ? "hsl(38 70% 48%)" : "hsl(150 10% 75%)"}
                          strokeWidth="0.5"
                        />
                      </svg>
                    </button>
                  ))}
                </div>
              </div>

              <textarea
                value={newReviewText}
                onChange={(e) => setNewReviewText(e.target.value)}
                placeholder="Расскажите о вашем опыте..."
                rows={3}
                className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none mb-4"
              />

              {reviewSubmitted ? (
                <div className="flex items-center gap-2 text-green-600 font-medium animate-scale-in">
                  <Icon name="CheckCircle2" size={18} />
                  Отзыв опубликован! Спасибо
                </div>
              ) : (
                <button
                  onClick={submitReview}
                  disabled={!newReviewText.trim()}
                  className="bg-primary text-primary-foreground font-semibold px-6 py-2.5 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-40"
                >
                  Опубликовать отзыв
                </button>
              )}
            </div>
          </section>
        )}
      </main>

      <footer className="bg-primary text-primary-foreground mt-16 py-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 bg-accent rounded-lg flex items-center justify-center">
                  <span className="text-accent-foreground text-xs font-bold">КМ</span>
                </div>
                <span className="font-bold text-lg">КлинМастер</span>
              </div>
              <p className="text-primary-foreground/60 text-sm leading-relaxed">Платформа проверенных клинеров с честным рейтингом</p>
            </div>
            {[
              { title: "Платформа", items: ["Главная", "Услуги", "Рейтинг", "Портфолио"] },
              { title: "Клинерам", items: ["Регистрация", "Добавить работу", "Управление профилем"] },
              { title: "Контакты", items: ["hello@cleanmaster.ru", "+7 800 000-00-00", "Москва, Россия"] },
            ].map((col) => (
              <div key={col.title}>
                <div className="font-semibold mb-3 text-sm">{col.title}</div>
                {col.items.map((item) => (
                  <div key={item} className="text-primary-foreground/60 text-sm mb-1.5 hover:text-primary-foreground cursor-pointer transition-colors">{item}</div>
                ))}
              </div>
            ))}
          </div>
          <div className="border-t border-primary-foreground/15 pt-5 flex items-center justify-between text-primary-foreground/40 text-xs">
            <span>© 2026 КлинМастер. Все права защищены.</span>
            <span>Политика конфиденциальности</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function CleanerCard({ cleaner, index, onChat, onReview, showRank }: {
  cleaner: typeof cleaners[0];
  index: number;
  onChat: () => void;
  onReview: () => void;
  showRank?: boolean;
}) {
  const rankLabels = ["🥇", "🥈", "🥉"];

  return (
    <div className={`bg-card border border-border rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 group animate-fade-in delay-${index * 100}`}>
      {cleaner.badge && (
        <div className="bg-accent text-accent-foreground text-xs font-semibold px-3 py-1.5 flex items-center gap-1">
          <Icon name="Sparkles" size={11} />
          {cleaner.badge}
        </div>
      )}
      <div className="p-5">
        <div className="flex items-start gap-3 mb-4">
          <div className="relative">
            <img src={cleaner.avatar} alt={cleaner.name} className="w-14 h-14 rounded-xl object-cover" />
            {cleaner.verified && (
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                <Icon name="Check" size={10} className="text-primary-foreground" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-foreground text-base">{cleaner.name}</span>
              {showRank && <span className="text-lg">{rankLabels[index]}</span>}
            </div>
            <div className="text-muted-foreground text-xs mt-0.5">{cleaner.specialty}</div>
            <div className="flex items-center gap-1.5 mt-1.5">
              <StarRating rating={cleaner.rating} size={13} />
              <span className="text-xs text-foreground font-medium">{cleaner.rating}</span>
              <span className="text-xs text-muted-foreground">({cleaner.reviews})</span>
            </div>
          </div>
        </div>

        <div className="flex gap-2 flex-wrap mb-4">
          {cleaner.tags.map((tag) => (
            <span key={tag} className="bg-secondary text-secondary-foreground text-xs px-2.5 py-1 rounded-full">{tag}</span>
          ))}
        </div>

        <div className="flex items-center justify-between mb-4 text-sm">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Icon name="CheckCircle2" size={13} />
            <span>{cleaner.completedJobs} уборок</span>
          </div>
          <span className="font-semibold text-primary">{cleaner.price}</span>
        </div>

        <div className="flex gap-2">
          <button
            onClick={onChat}
            className="flex-1 bg-primary text-primary-foreground text-sm font-medium py-2.5 rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-1.5"
          >
            <Icon name="MessageCircle" size={14} />
            Написать
          </button>
          <button
            onClick={onReview}
            className="flex-1 border border-border text-foreground text-sm font-medium py-2.5 rounded-xl hover:bg-secondary transition-colors flex items-center justify-center gap-1.5"
          >
            <Icon name="Star" size={14} />
            Отзыв
          </button>
        </div>
      </div>
    </div>
  );
}
