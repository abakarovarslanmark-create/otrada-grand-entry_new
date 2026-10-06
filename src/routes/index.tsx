import { useEffect, useRef, useState, type FormEvent } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Check, ChevronLeft, ChevronRight, Loader2, Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import facadeAsset from "../assets/the facade of the house_hero block.webp";
import projectAsset from "../assets/visualization of the house_about.webp";
import logoDark from "../assets/logo_dark.svg";
import logoWhite from "../assets/logo_white.svg";
import floorLayoutAsset from "../assets/floor layout.webp";
import threeRooms7560Asset from "../assets/3 rooms 75,60.webp";
import threeRooms8057Asset from "../assets/3 rooms 80,57.webp";
import twoRooms5858Asset from "../assets/2 rooms 58,58.webp";
import twoRooms6138Asset from "../assets/2 rooms 61,38.webp";
import oneRoomAsset from "../assets/1 rooms.webp";
import monolithicFrameAsset from "../assets/monolithic frame.webp";
import heatingAsset from "../assets/The cat on the battery.webp";
import parkingAsset from "../assets/parking space.webp";
import environmentAsset from "../assets/Environment and infrastructure.webp";
import streetAsset from "../assets/street.webp";
import constr2026_09 from "../assets/2026_09.webp";
import constr2026_07 from "../assets/2026_07.webp";
import constr2026_05 from "../assets/2026_05.webp";
import constr2026_03 from "../assets/2026_03.webp";
import constr2026_01 from "../assets/2026_01.webp";
import constr2025_11 from "../assets/2025_11.webp";
import constr2025_09 from "../assets/2025_09.webp";
import constr2025_07 from "../assets/2025_07.webp";
import { CallbackButton } from "../components/CallbackModal";
import { FloatingInput } from "../components/FloatingInput";
import FluidTabs from "../components/FluidTabs";
import StackedSections from "../components/StackedSections";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Отрада — квартиры в центре Ульяновска | Официальный сайт" },
      {
        name: "description",
        content:
          "Жилой дом «Отрада» в центре Ульяновска. Современная архитектура, продуманные планировки и комфорт для жизни.",
      },
      { property: "og:title", content: "Отрада — жизнь в центре Ульяновска" },
      {
        property: "og:description",
        content: "Новая квартира в современном жилом доме в самом центре Ульяновска.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://otrada-dom.ru/" },
      { property: "og:image", content: "/the facade of the house_hero block.webp" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Отрада — квартиры в центре Ульяновска" },
      {
        name: "twitter:description",
        content: "Клубный жилой дом «Отрада» в центре Ульяновска на улице Мира.",
      },
      { name: "twitter:image", content: "/the facade of the house_hero block.webp" },
    ],
    links: [
      { rel: "canonical", href: "https://otrada-dom.ru/" },
      {
        rel: "preload",
        as: "image",
        href: facadeAsset,
        type: "image/webp",
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ApartmentComplex",
          name: "Жилой дом «Отрада»",
          description: "Клубный девятиэтажный дом в историческом центре Ульяновска на улице Мира.",
          url: "https://otrada-dom.ru/",
          address: {
            "@type": "PostalAddress",
            streetAddress: "ул. Мира",
            addressLocality: "Ульяновск",
            addressRegion: "Ульяновская область",
            addressCountry: "RU",
          },
        }),
      },
    ],
  }),
});

function useInView<T extends Element>(threshold = 0.25) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setInView(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, inView };
}

function Header() {
  const [visible, setVisible] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const lastScrollYRef = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      if (menuOpen) return;
      const currentScrollY = Math.max(0, window.scrollY);
      const prevScrollY = lastScrollYRef.current;
      const diff = currentScrollY - prevScrollY;

      if (currentScrollY <= 40) {
        // В самом верху страницы: хедер в исходном положении
        setVisible(true);
        setScrolled(false);
      } else if (diff < -8) {
        // При обратном скролле (вверх): показываем хедер с небольшим отступом сверху
        setVisible(true);
        setScrolled(true);
      } else if (diff > 8 && currentScrollY > 100) {
        // При скролле вниз: скрываем хедер
        setVisible(false);
        setScrolled(true);
      }

      lastScrollYRef.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [menuOpen]);

  return (
    <div
      className={`fixed left-0 right-0 z-50 px-5 transition-all duration-300 ease-out sm:px-8 lg:px-12 ${
        scrolled ? "top-3 sm:top-4" : "top-5 sm:top-8"
      } ${visible || menuOpen ? "translate-y-0" : "-translate-y-[calc(100%+3rem)] pointer-events-none"}`}
    >
      <header className="header-shell mx-auto flex h-[60px] xl:h-[75px] w-full max-w-[1300px] items-center rounded-[12px] px-[12px] sm:px-4 backdrop-blur-[25px]">
        <a
          href="/#hero"
          className="inline-flex shrink-0 items-center transition-opacity hover:opacity-80 cursor-pointer"
          aria-label="На главный экран"
          onClick={(e) => {
            e.preventDefault();
            setMenuOpen(false);
            window.scrollTo({ top: 0, behavior: "smooth" });
            if (window.location.hash) {
              window.history.pushState(null, "", window.location.pathname);
            }
          }}
        >
          <img
            src={logoDark}
            alt="Отрада — на главную"
            className="w-[78px] sm:w-[88px] xl:w-[100px] object-contain"
            width={100}
            height={28}
          />
        </a>

        <div className="ml-auto hidden items-center gap-4 xl:flex xl:gap-5">
          <nav className="flex items-center gap-5" aria-label="Основная навигация">
            <a className="nav-link" href="#about">
              О проекте
            </a>
            <a className="nav-link" href="#benefits">
              Преимущества
            </a>
            <a className="nav-link" href="#layouts">
              Планировки
            </a>
            <a className="nav-link" href="#construction">
              Ход строительства
            </a>
            <a className="nav-link" href="#contacts">
              Контакты
            </a>
          </nav>

          <CallbackButton layoutId="callback-header" triggerRadius="4px" />
        </div>
        <button
          className="ml-auto grid size-10 place-items-center rounded-[4px] text-ink transition-colors hover:bg-black/5 xl:hidden"
          type="button"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"}
          aria-expanded={menuOpen}
        >
          {menuOpen ? (
            <X aria-hidden="true" size={24} strokeWidth={1.6} />
          ) : (
            <Menu aria-hidden="true" size={24} strokeWidth={1.6} />
          )}
        </button>
      </header>

      {/* Выпадающее мобильное бургер-меню */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="mx-auto mt-2 flex w-full max-w-[1300px] flex-col gap-3 rounded-[12px] border border-slate-200/90 bg-white p-[12px] shadow-2xl text-[#001826] sm:gap-4 sm:p-5 xl:hidden"
          >
            <nav
              className="flex flex-col gap-1 font-sans text-base text-[#001826]"
              aria-label="Мобильная навигация"
            >
              <a
                className="rounded-[6px] px-3 py-2.5 font-medium transition-colors hover:bg-slate-100"
                href="#about"
                onClick={() => setMenuOpen(false)}
              >
                О проекте
              </a>
              <a
                className="rounded-[6px] px-3 py-2.5 font-medium transition-colors hover:bg-slate-100"
                href="#benefits"
                onClick={() => setMenuOpen(false)}
              >
                Преимущества
              </a>
              <a
                className="rounded-[6px] px-3 py-2.5 font-medium transition-colors hover:bg-slate-100"
                href="#layouts"
                onClick={() => setMenuOpen(false)}
              >
                Планировки
              </a>
              <a
                className="rounded-[6px] px-3 py-2.5 font-medium transition-colors hover:bg-slate-100"
                href="#construction"
                onClick={() => setMenuOpen(false)}
              >
                Ход строительства
              </a>
              <a
                className="rounded-[6px] px-3 py-2.5 font-medium transition-colors hover:bg-slate-100"
                href="#contacts"
                onClick={() => setMenuOpen(false)}
              >
                Контакты
              </a>
            </nav>
            <div className="pt-2 border-t border-slate-100">
              <CallbackButton
                layoutId="callback-header-mobile"
                triggerRadius="4px"
                className="flex h-[48px] w-full cursor-pointer items-center justify-center rounded-[4px] border border-[#023352] text-sm font-medium text-[#023352] transition-colors duration-200 hover:bg-[#023352] hover:text-white"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Index() {
  return (
    <main className="bg-background text-foreground">
      <Header />
      <section id="hero" className="relative isolate min-h-[100svh] overflow-hidden">
        <img
          className="absolute inset-0 -z-10 size-full object-cover object-[center_72%]"
          src={facadeAsset}
          alt="Фасад жилого дома «Отрада» в Ульяновске"
          fetchPriority="high"
          width={1920}
          height={1080}
        />

        <div className="mx-auto flex min-h-[100svh] w-full max-w-layouts flex-col px-3 pb-10 pt-3 sm:px-8 sm:pb-14 sm:pt-8 lg:px-12">
          {/* Заглушка для сохранения исходной высоты первого экрана */}
          <div className="h-[75px] w-full" aria-hidden="true" />

          <section
            className="flex w-full flex-1 items-end pb-[8vh] pt-24 sm:items-center sm:pb-0 sm:pt-20"
            aria-labelledby="hero-title"
          >
            <div className="w-full max-w-5xl">
              <h1
                id="hero-title"
                className="hero-enter hero-delay-1 hero-text-shadow whitespace-nowrap font-display text-[clamp(2rem,7vw,6rem)] leading-[0.98] text-foreground"
              >
                Жизнь - это Отрада
              </h1>
              <p className="hero-enter hero-delay-2 hero-text-shadow mt-6 max-w-none text-[clamp(1rem,2.8vw,1.75rem)] leading-relaxed text-foreground/90 sm:whitespace-nowrap">
                Ваша новая квартира в самом центре <br className="sm:hidden" />
                Ульяновска
              </p>
              <div className="hero-enter hero-delay-4 mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
                <a
                  className="cta-outline group flex w-full items-center justify-center whitespace-nowrap rounded-[4px] sm:w-auto"
                  href="#layouts"
                >
                  <span className="whitespace-nowrap">Посмотреть планировки</span>
                  <ArrowRight
                    className="shrink-0 transition-transform group-hover:translate-x-1"
                    aria-hidden="true"
                    size={19}
                  />
                </a>
                <CallbackButton
                  layoutId="callback-hero"
                  className="cta-solid cta-large flex w-full items-center justify-center rounded-[4px] sm:w-auto"
                  triggerRadius="4px"
                />
              </div>
            </div>
          </section>
        </div>
      </section>

      <AboutSection />
      <BenefitsSection />
      <LayoutsSection />
      <ConstructionSection />
      <ContactsSection />
      <QuestionsSection />
      <FooterSection />
    </main>
  );
}

const projectSpecs = [
  { label: "Адрес", value: "Город Ульяновск, Улица Мира" },
  { label: "Застройщик", value: "ООО СЗ ОТРАДА" },
  { label: "Конструктив", value: "Монолит-кирпич" },
  { label: "Доступность инфраструктуры", value: "9/10" },
  { label: "Парковка", value: "на 1 этаже, также вне дома" },
  { label: "Отопление", value: "Поквартирное" },
  { label: "Класс энергоэффективности", value: "A+" },
];

const specsContainerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const specRowVariants = {
  hidden: {
    opacity: 0,
    y: 14,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

function AboutSection() {
  const { ref: imgRef, inView: imgInView } = useInView<HTMLImageElement>();

  return (
    <section
      id="about"
      className="bg-white text-[#001826] pt-[100px] pb-[100px]"
      aria-labelledby="about-title"
    >
      <div className="mx-auto w-full max-w-layouts px-3 sm:px-8 lg:px-12">
        <h2
          id="about-title"
          className="font-display text-[clamp(2.125rem,5.5vw,2.875rem)] leading-tight text-[#001826]"
        >
          О проекте
        </h2>

        <div className="mt-10 flex flex-col items-center gap-10 xl:flex-row xl:items-start xl:gap-[100px]">
          {/* Фотография 550x680 скругление 12px */}
          <div className="w-full max-w-[700px] shrink-0 xl:max-w-[550px]">
            <img
              ref={imgRef}
              className={`reveal-up h-[380px] sm:h-[480px] md:h-[560px] xl:h-[680px] w-full rounded-[12px] object-cover shadow-sm ${
                imgInView ? "reveal-up-in" : ""
              }`}
              src={projectAsset}
              alt="Девятиэтажный жилой дом «Отрада» на улице Мира в Ульяновске"
              loading="lazy"
              width={550}
              height={680}
            />
          </div>

          {/* Текстовый блок: параграф + в 40px табличка спецификаций */}
          <div className="flex w-full flex-1 flex-col">
            <p className="font-sans text-base leading-[1.6] text-[#001826] sm:text-lg">
              «Отрада» — девятиэтажный дом в тихой части исторического центра Ульяновска, на улице
              Мира. Камерный формат проекта принципиально отличается от плотных многоэтажных
              массивов: здесь мало соседей, чистая придомовая территория с детской площадкой и
              собственная закрытая автостоянка. Архитектура дома сочетает прочный
              монолитно-кирпичный конструктив, индивидуальное отопление и гибкие свободные
              планировки. Это пространство, где динамика центрального района естественно соединяется
              с приватностью, тишиной и полным бытовым комфортом
            </p>

            <motion.div
              className="mt-[40px] flex flex-col"
              variants={specsContainerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              {projectSpecs.map((spec, index) => (
                <motion.div
                  key={index}
                  variants={specRowVariants}
                  className="grid grid-cols-1 border-b border-[#001826]/30 py-3.5 text-base sm:grid-cols-2 sm:text-lg"
                >
                  <span className="text-[#001826]/50">{spec.label}</span>
                  <span className="font-normal text-[#001826]">{spec.value}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

const benefitsData = [
  {
    title: "Монолитный каркас",
    image: monolithicFrameAsset,
    text: "Монолитный железобетонный каркас обеспечивает зданию исключительную прочность и точную геометрию. Конструкция дает минимальную и плавную усадку, благодаря чему дизайнерский ремонт, дорогая штукатурка и широкоформатная плитка сохраняют идеальный вид без трещин и деформаций годами. Отсутствие внутренних несущих перегородок оставляет полную свободу в зонировании: пространство легко адаптировать под индивидуальный проект — от масштабной кухни-гостиной до приватной мастер-спальни с гардеробной.",
  },
  {
    title: "Поквартирное отопление",
    image: heatingAsset,
    text: "Индивидуальный котел в квартире дает полную независимость от городского графика. Когда на улице сырая осень или холодный май, комфортный микроклимат настраивается за пару секунд, без ожидания начала отопительного сезона. Система работает строго по фактической потребности: тепло не расходуется впустую во время отъезда, а счета в квитанциях формируются по реальному счетчику, выходя ощутимо ниже общегородских тарифов.",
  },
  {
    title: "Парковка",
    image: parkingAsset,
    text: "Собственный закрытый паркинг на первом этаже дома снимает вопрос вечернего поиска места: автомобиль всегда ждет на закрепленной точке, в сухом и защищенном пространстве. Зимой не приходится тратить время на прогрев мотора и очистку стекол от наледи, а с пакетами и вещами можно сразу подняться на лифте к квартире. Для второго автомобиля или гостей предусмотрена открытая благоустроенная стоянка на придомовой территории.",
  },
  {
    title: "Тишина",
    image: streetAsset,
    text: "Улица Мира расположена в самом центре, но устроена так, что сквозного движения здесь нет. Основные транспортные потоки уходят на соседние широкие артерии, поэтому под окнами не скапливаются заторы, нет маршрутного транспорта и шума тяжелой техники. Даже в разгар дня здесь сохраняется спокойный, размеренный ритм, а ночью не слышно перекрестков и монотонного гула проспектов — можно спокойно спать с открытыми окнами.",
  },
  {
    title: "Окружение и инфраструктура",
    image: environmentAsset,
    text: "Всё необходимое для жизни находится в радиусе короткой пешей прогулки. В пяти-семи минутах от дома сосредоточены ведущие гимназии и статусные школы города. Дорога на занятия занимает минимум времени и проходит по спокойным центральным улицам.\nБуквально за углом начинается главная городская жизнь. На соседних улицах сформировался насыщенный кластер для отдыха: пешеходные зоны с брусчаткой, атмосферные кофейни, авторские рестораны, зеленые скверы, театры и набережная.",
  },
];

function BenefitsSection() {
  return (
    <section
      id="benefits"
      className="bg-[#023352] text-foreground"
      aria-labelledby="benefits-title"
    >
      <div className="mx-auto w-full max-w-layouts px-3 pb-24 pt-[100px] sm:px-8 lg:px-12">
        <h2
          id="benefits-title"
          className="font-display text-[clamp(2.125rem,5.5vw,2.875rem)] leading-tight text-white"
        >
          Преимущества
        </h2>

        <div className="mx-auto mt-6 sm:mt-10 w-full max-w-[1400px]">
          <StackedSections stackOffset={12} paneGap="gap-[65vh]" scrollRunway="25vh">
            {benefitsData.map((item, index) => (
              <article
                key={index}
                className="flex w-full max-w-[1400px] flex-col gap-[12px] lg:flex-row lg:items-start lg:gap-8 xl:gap-10 rounded-[12px] bg-card p-[12px] sm:p-5 text-card-foreground shadow-[0_-4px_20px_rgba(0,0,0,0.1)]"
              >
                <div className="w-full shrink-0 lg:w-[46%] xl:w-[600px]">
                  <img
                    className="h-[180px] w-full rounded-[6px] object-cover sm:h-[240px] md:h-[300px] lg:h-[360px] xl:h-[400px] xl:w-[600px]"
                    src={item.image}
                    alt={`${item.title} — жилой дом «Отрада»`}
                    loading="lazy"
                    width={600}
                    height={400}
                  />
                </div>
                <div className="flex flex-1 flex-col justify-start">
                  <h3 className="font-sans text-[1.375rem] font-medium leading-tight text-[#001826] sm:text-[1.625rem] lg:text-[1.875rem]">
                    {item.title}
                  </h3>
                  <p className="mt-[8px] sm:mt-3 whitespace-pre-line text-base leading-[1.6] text-card-foreground/85">
                    {item.text}
                  </p>
                </div>
              </article>
            ))}
          </StackedSections>
        </div>
      </div>
    </section>
  );
}

const layoutTabs = ["Этаж", "3 ком.", "2 ком.", "1 ком."] as const;

interface LayoutCardItem {
  title: string;
  imageSrc: string;
  imageAlt: string;
}

const layoutsData: Record<number, LayoutCardItem> = {
  0: {
    title: "Этаж",
    imageSrc: floorLayoutAsset,
    imageAlt: "Схема планировки этажа жилого дома «Отрада»",
  },
};

const threeRoomApartments = [
  {
    id: "3room-1",
    title: "3-комнатная квартира",
    imageSrc: threeRooms7560Asset,
    totalArea: "75,60",
    heatedArea: "74,48",
  },
  {
    id: "3room-2",
    title: "3-комнатная квартира",
    imageSrc: threeRooms8057Asset,
    totalArea: "80,57",
    heatedArea: "78,13",
  },
];

const twoRoomApartments = [
  {
    id: "2room-1",
    title: "2-комнатная квартира",
    imageSrc: twoRooms5858Asset,
    totalArea: "58,58",
    heatedArea: "57,09",
  },
  {
    id: "2room-2",
    title: "2-комнатная квартира",
    imageSrc: twoRooms6138Asset,
    totalArea: "61,38",
    heatedArea: "60,02",
  },
];

const oneRoomApartments = [
  {
    id: "1room-1",
    title: "1-комнатная квартира",
    imageSrc: oneRoomAsset,
    totalArea: "40,41",
    heatedArea: "39,00",
  },
];

interface ApartmentItem {
  id: string;
  title: string;
  imageSrc: string;
  totalArea: string;
  heatedArea: string;
}

const layoutGridVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.04,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.15,
    },
  },
};

const layoutCardVariants = {
  hidden: {
    opacity: 0,
    y: 18,
    scale: 0.97,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.35,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
  exit: {
    opacity: 0,
    y: -8,
    scale: 0.98,
    transition: {
      duration: 0.15,
      ease: "easeIn",
    },
  },
};

function ApartmentCardsGrid({
  apartments,
  tabKey,
}: {
  apartments: ApartmentItem[];
  tabKey: string;
}) {
  return (
    <motion.div
      variants={layoutGridVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="flex w-full flex-wrap items-stretch justify-center gap-6 lg:gap-8"
    >
      {apartments.map((item, index) => (
        <motion.article
          key={item.id}
          variants={layoutCardVariants}
          className="flex w-full max-w-[440px] flex-col justify-between gap-[40px] rounded-[12px] bg-white p-[12px] sm:p-[20px] shadow-lg sm:w-fit"
        >
          {/* Элемент 1: заголовок h3 */}
          <h3 className="text-center font-sans text-2xl font-normal leading-tight text-[#001826] sm:text-[1.75rem]">
            {item.title}
          </h3>

          {/* Элемент 2: фотография (высота 300) */}
          <div className="flex h-[300px] w-full items-center justify-center overflow-hidden">
            {item.imageSrc ? (
              <img
                src={item.imageSrc}
                alt={`Планировка: ${item.title} ${item.totalArea} м²`}
                className="h-[300px] w-auto max-w-full object-contain"
                loading="lazy"
                width={500}
                height={300}
              />
            ) : (
              <div className="flex h-full w-full min-w-[280px] flex-col items-center justify-center p-6 text-center text-slate-400">
                <img
                  src=""
                  alt={`Планировка: ${item.title} ${item.totalArea} м²`}
                  className="hidden"
                />
                <span className="text-sm font-medium">Планировка: {item.title}</span>
              </div>
            )}
          </div>

          {/* Элемент 3: текст с кнопкой */}
          <div className="flex flex-col gap-6">
            <div className="flex flex-col items-center gap-1.5 text-center text-base text-[#001826]">
              <p>
                <span className="font-bold">{item.totalArea}</span> — площадь всей квартиры
              </p>
              <p>
                <span className="font-bold">{item.heatedArea}</span> — отапливаемая площадь
              </p>
            </div>

            <CallbackButton
              layoutId={`callback-${tabKey}-${index}`}
              triggerRadius="4px"
              className="flex h-[52px] w-full cursor-pointer items-center justify-center rounded-[4px] border border-[#023352] text-base font-medium text-[#023352] transition-colors duration-200 hover:bg-[#023352] hover:text-white"
            >
              Узнать подробнее
            </CallbackButton>
          </div>
        </motion.article>
      ))}
    </motion.div>
  );
}

function LayoutsSection() {
  const [activeTab, setActiveTab] = useState(3);
  const currentLayout = layoutsData[activeTab] ?? layoutsData[0];

  return (
    <section id="layouts" className="bg-layouts text-foreground" aria-labelledby="layouts-title">
      <div className="mx-auto w-full max-w-layouts px-3 pb-24 pt-[100px] sm:px-8 lg:px-12">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <h2
            id="layouts-title"
            className="font-display text-[clamp(2.125rem,5.5vw,2.875rem)] leading-tight"
          >
            Планировки
          </h2>
          <FluidTabs
            labels={layoutTabs}
            activeIndex={activeTab}
            onActiveIndexChange={setActiveTab}
          />
        </div>

        <div
          id="layouts-panel"
          role="tabpanel"
          aria-labelledby={`layouts-tab-${activeTab}`}
          className="mt-10 flex justify-center w-full"
        >
          <AnimatePresence mode="wait">
            {activeTab === 1 ? (
              <ApartmentCardsGrid key="tab-3room" apartments={threeRoomApartments} tabKey="3room" />
            ) : activeTab === 2 ? (
              <ApartmentCardsGrid key="tab-2room" apartments={twoRoomApartments} tabKey="2room" />
            ) : activeTab === 3 ? (
              <ApartmentCardsGrid key="tab-1room" apartments={oneRoomApartments} tabKey="1room" />
            ) : (
              <motion.article
                key="tab-floor"
                variants={layoutCardVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="flex w-full max-w-[760px] flex-col gap-10 rounded-[12px] bg-white p-[12px] sm:p-[20px] shadow-lg sm:w-fit"
              >
                <h3 className="text-center font-sans text-2xl font-medium leading-tight text-[#001826] sm:text-[1.75rem]">
                  {currentLayout.title}
                </h3>

                <div className="flex h-[300px] w-full items-center justify-center overflow-hidden">
                  {currentLayout.imageSrc ? (
                    <img
                      src={currentLayout.imageSrc}
                      alt={currentLayout.imageAlt}
                      className="h-[300px] w-auto max-w-full object-contain"
                      loading="lazy"
                      width={760}
                      height={300}
                    />
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center p-6 text-center text-slate-400">
                      <img src="" alt={currentLayout.imageAlt} className="hidden" />
                      <span className="text-sm font-medium">Планировка этажа</span>
                    </div>
                  )}
                </div>

                <CallbackButton
                  layoutId={`callback-layouts-${activeTab}`}
                  triggerRadius="4px"
                  className="flex h-[52px] w-full cursor-pointer items-center justify-center rounded-[4px] border border-[#023352] text-base font-medium text-[#023352] transition-colors duration-200 hover:bg-[#023352] hover:text-white"
                >
                  Выбрать квартиру
                </CallbackButton>
              </motion.article>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

const constructionItems = [
  { id: "sep-26", title: "Сентябрь 2026", imageSrc: constr2026_09 },
  { id: "jul-26", title: "Июль 2026", imageSrc: constr2026_07 },
  { id: "may-26", title: "Май 2026", imageSrc: constr2026_05 },
  { id: "mar-26", title: "Март 2026", imageSrc: constr2026_03 },
  { id: "jan-26", title: "Январь 2026", imageSrc: constr2026_01 },
  { id: "nov-25", title: "Ноябрь 2025", imageSrc: constr2025_11 },
  { id: "sep-25", title: "Сентябрь 2025", imageSrc: constr2025_09 },
  { id: "jul-25", title: "Июль 2025", imageSrc: constr2025_07 },
];

function ConstructionSection() {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    const el = sliderRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, []);

  const handleScroll = (direction: "left" | "right") => {
    const el = sliderRef.current;
    if (!el) return;
    const firstChild = el.firstElementChild as HTMLElement | null;
    const scrollAmount = firstChild ? firstChild.offsetWidth + 16 : 380;
    el.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <section
      id="construction"
      className="bg-white text-[#001826] pt-[100px] pb-[100px]"
      aria-labelledby="construction-title"
    >
      <div className="mx-auto w-full max-w-layouts px-3 sm:px-8 lg:px-12">
        <h2
          id="construction-title"
          className="font-display text-[clamp(2.125rem,5.5vw,2.875rem)] leading-tight text-[#001826]"
        >
          Ход строительства
        </h2>
      </div>

      <div
        ref={sliderRef}
        onScroll={checkScroll}
        className="mt-6 sm:mt-[40px] flex w-full gap-3 sm:gap-5 overflow-x-auto scroll-smooth px-3 pb-2 pt-1 scrollbar-none sm:px-8 lg:px-[max(3rem,calc((100vw-87.5rem)/2+3rem))]"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {constructionItems.map((item) => (
          <article
            key={item.id}
            className="w-[76vw] max-w-[400px] shrink-0 sm:w-[320px] md:w-[380px] lg:w-[400px]"
          >
            <div className="aspect-square w-full overflow-hidden rounded-[12px] border border-slate-100 bg-[#f8fafc] shadow-sm">
              {item.imageSrc ? (
                <img
                  src={item.imageSrc}
                  alt={`Ход строительства — ${item.title}`}
                  className="h-full w-full rounded-[12px] object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center p-6 text-center text-slate-400">
                  <img src="" alt={`Ход строительства — ${item.title}`} className="hidden" />
                  <span className="text-sm font-medium">{item.title}</span>
                </div>
              )}
            </div>
            <p className="mt-[10px] text-center font-sans text-base font-normal text-[#001826]">
              {item.title}
            </p>
          </article>
        ))}
      </div>

      <div className="mt-[40px] flex items-center justify-center gap-[20px]">
        <button
          type="button"
          onClick={() => handleScroll("left")}
          disabled={!canScrollLeft}
          aria-label="Предыдущий слайд"
          className="flex h-[40px] w-[60px] cursor-pointer items-center justify-center rounded-[4px] border border-[#023352] text-[#023352] transition-colors duration-200 hover:bg-[#023352]/5 disabled:cursor-not-allowed disabled:border-slate-300 disabled:text-slate-300 disabled:hover:bg-transparent"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          type="button"
          onClick={() => handleScroll("right")}
          disabled={!canScrollRight}
          aria-label="Следующий слайд"
          className="flex h-[40px] w-[60px] cursor-pointer items-center justify-center rounded-[4px] border border-[#023352] text-[#023352] transition-colors duration-200 hover:bg-[#023352]/5 disabled:cursor-not-allowed disabled:border-slate-300 disabled:text-slate-300 disabled:hover:bg-transparent"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </section>
  );
}

function ContactsSection() {
  return (
    <section
      id="contacts"
      className="bg-white text-[#001826] pt-[100px] pb-[100px]"
      aria-labelledby="contacts-title"
    >
      <div className="mx-auto w-full max-w-layouts px-3 sm:px-8 lg:px-12">
        <h2
          id="contacts-title"
          className="font-display text-[clamp(2.125rem,5.5vw,2.875rem)] leading-tight text-[#001826]"
        >
          Наши контакты
        </h2>

        <div className="mt-[40px] flex flex-col items-start gap-[40px] xl:flex-row xl:items-start xl:gap-[50px]">
          {/* Яндекс.Карты */}
          <div className="h-[360px] sm:h-[420px] w-full shrink-0 overflow-hidden rounded-[12px] border border-slate-100 bg-[#f8fafc] shadow-sm xl:h-[450px] xl:w-[600px] xl:max-w-[600px]">
            <iframe
              src="https://yandex.ru/map-widget/v1/?text=%D0%B3%D0%BE%D1%80%D0%BE%D0%B4%20%D0%A3%D0%BB%D1%8C%D1%8F%D0%BD%D0%BE%D0%B2%D1%81%D0%BA%2C%20%D1%83%D0%BB%D0%B8%D1%86%D0%B0%20%D0%A5%D0%B2%D0%B0%D1%82%D0%BA%D0%BE%D0%B2%D0%B0%2C%20%D0%B4%D0%BE%D0%BC%2028%D0%91&z=16"
              width="100%"
              height="100%"
              frameBorder="0"
              allowFullScreen
              title="Яндекс.Карты — г. Ульяновск, ул. Хваткова, дом 28Б"
              className="h-full w-full border-0"
            />
          </div>

          {/* Текстовый блок с контактами */}
          <div className="flex w-full flex-1 flex-col items-start justify-center gap-6 text-left">
            <div className="text-left">
              <span className="block text-sm text-[#001826]/50 sm:text-base">Адрес</span>
              <p className="mt-1 font-sans text-base font-normal text-[#001826] sm:text-lg">
                г. Ульяновск, ул. Хваткова, дом, 28В, офис 208
              </p>
            </div>

            <div className="text-left">
              <span className="block text-sm text-[#001826]/50 sm:text-base">
                Электронная почта
              </span>
              <p className="mt-1 font-sans text-base font-normal text-[#001826] sm:text-lg">
                <a
                  href="mailto:otrada.ul73@mail.ru"
                  className="text-[#001826] transition-opacity hover:opacity-80"
                >
                  otrada.ul73@mail.ru
                </a>
              </p>
            </div>

            <div className="text-left">
              <span className="block text-sm text-[#001826]/50 sm:text-base">Номер приемной</span>
              <div className="mt-1 flex flex-col items-start gap-1 font-sans text-base font-normal text-[#001826] sm:text-lg">
                <a
                  href="tel:+78422584406"
                  className="underline decoration-1 underline-offset-2 transition-opacity hover:opacity-80"
                >
                  8 8422 58-44-06
                </a>
                <a
                  href="tel:+78422584407"
                  className="underline decoration-1 underline-offset-2 transition-opacity hover:opacity-80"
                >
                  8 8422 58-44-07
                </a>
              </div>
            </div>

            <div className="text-left">
              <span className="block text-sm text-[#001826]/50 sm:text-base">
                Номер отдела продаж
              </span>
              <div className="mt-1 flex flex-col items-start gap-1 font-sans text-base font-normal text-[#001826] sm:text-lg">
                <a
                  href="tel:+78422748000"
                  className="underline decoration-1 underline-offset-2 transition-opacity hover:opacity-80"
                >
                  748-000
                </a>
                <a href="tel:+79053490363" className="transition-opacity hover:opacity-80">
                  +7 905 34 90 363
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function QuestionsSection() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name.trim()) {
      setError("Укажите ваше имя");
      return;
    }
    if (phone.replace(/\D/g, "").length < 10) {
      setError("Укажите корректный номер телефона");
      return;
    }
    setError(null);
    setLoading(true);

    try {
      const response = await fetch("https://formsubmit.co/ajax/abakarovarslanmark@gmail.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          Имя: name.trim(),
          Телефон: phone.trim(),
          _subject: "Новый вопрос с сайта ЖК «Отрада»",
          _template: "table",
          _captcha: "false",
        }),
      });

      if (!response.ok) {
        throw new Error("Не удалось отправить заявку");
      }

      setSent(true);
    } catch (err) {
      console.error("Ошибка при отправке вопроса:", err);
      setSent(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="questions"
      className="bg-[#023352] text-foreground pt-[100px] pb-[100px]"
      aria-labelledby="questions-title"
    >
      <div className="mx-auto w-full max-w-layouts px-3 sm:px-8 lg:px-12">
        <h2
          id="questions-title"
          className="text-left font-display text-[clamp(2.125rem,5.5vw,2.875rem)] leading-tight text-white"
        >
          Остались вопросы!
        </h2>

        <div className="mt-6 sm:mt-8 mx-auto w-full max-w-full sm:max-w-[560px] rounded-[12px] bg-white p-[12px] sm:p-6 shadow-2xl text-[#001826]">
          {sent ? (
            <div className="flex flex-col items-start py-6 text-left">
              <span className="grid size-14 place-items-center rounded-full bg-brand/10 text-brand">
                <Check aria-hidden="true" size={28} strokeWidth={2} />
              </span>
              <h3 className="mt-4 font-sans text-xl font-medium sm:text-2xl leading-tight text-[#001826]">
                Заявка отправлена
              </h3>
              <p className="mt-2 text-base leading-[1.5] text-slate-600">
                Мы перезвоним вам в ближайшее время.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSent(false);
                  setName("");
                  setPhone("");
                }}
                className="mt-4 text-sm font-medium text-[#023352] underline underline-offset-4 hover:opacity-80"
              >
                Отправить ещё одну заявку
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="flex flex-col text-left">
              <h3 className="text-center font-sans text-xl font-normal leading-tight text-[#001826] sm:text-2xl">
                Мы на всё ответим
              </h3>

              <div className="mt-4 sm:mt-5 flex flex-col gap-3">
                <FloatingInput
                  label="Ваше имя"
                  id="questions-name"
                  type="text"
                  name="name"
                  autoComplete="name"
                  maxLength={100}
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  disabled={loading}
                />
                <FloatingInput
                  label="Номер телефона"
                  id="questions-phone"
                  type="tel"
                  name="phone"
                  autoComplete="tel"
                  maxLength={20}
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  disabled={loading}
                />
              </div>

              {error ? (
                <p className="mt-2.5 text-sm text-destructive text-left" role="alert">
                  {error}
                </p>
              ) : null}

              <button
                className="cta-solid mt-4 sm:mt-5 flex w-full items-center justify-center gap-2 rounded-[4px] py-3 text-base font-medium disabled:opacity-70 disabled:cursor-not-allowed"
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="size-5 animate-spin" />
                    <span>Отправка...</span>
                  </>
                ) : (
                  "Отправить"
                )}
              </button>
              <p className="mt-3 text-center text-xs leading-[1.5] text-slate-500">
                Нажимая кнопку, вы соглашаетесь на обработку персональных данных
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

function FooterSection() {
  return (
    <footer
      className="overflow-hidden bg-[#023352] pt-[100px] text-white"
      aria-label="Подвал сайта"
    >
      <div className="mx-auto w-full max-w-layouts px-3 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {/* Левая колонка — На сайте */}
          <div className="flex flex-col items-start text-left">
            <span className="font-sans text-sm font-normal text-white/50 sm:text-base">
              На сайте
            </span>
            <nav className="mt-4 flex flex-col gap-2.5 font-sans text-base text-white sm:gap-3">
              <a href="#about" className="transition-colors hover:text-white/80">
                О проекте
              </a>
              <a href="#benefits" className="transition-colors hover:text-white/80">
                Преимущества
              </a>
              <a href="#layouts" className="transition-colors hover:text-white/80">
                Планировки
              </a>
              <a href="#construction" className="transition-colors hover:text-white/80">
                Ход строительства
              </a>
              <a href="#contacts" className="transition-colors hover:text-white/80">
                Контакты
              </a>
            </nav>
          </div>

          {/* Центральная колонка — Документы */}
          <div className="flex flex-col items-start text-left">
            <span className="font-sans text-sm font-normal text-white/50 sm:text-base">
              Документы
            </span>
            <div className="mt-4 flex flex-col gap-2.5 font-sans text-base text-white sm:gap-3">
              <a href="#" className="transition-colors hover:text-white/80">
                Разрешение на строительство
              </a>
              <a href="#" className="transition-colors hover:text-white/80">
                Разрешение на строительство
              </a>
            </div>
          </div>
        </div>

        {/* Нижний логотип белого цвета внутри общего контейнера с отступами по бокам */}
        <div className="mt-16 flex w-full justify-center overflow-hidden leading-none select-none sm:mt-24 lg:mt-32">
          <img
            src={logoWhite}
            alt="Отрада"
            className="block w-full max-w-[1300px] object-contain pointer-events-none select-none"
            loading="lazy"
            width={1300}
            height={364}
          />
        </div>
      </div>
    </footer>
  );
}
