import { useEffect, useRef, useState, type FormEvent } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Check, ChevronLeft, ChevronRight, Menu } from "lucide-react";
import facadeImage from "../assets/the facade of the house_hero block.webp";
import projectImage from "../assets/visualization of the house_about.webp";
import benefitImage from "../assets/parking space.webp";
import logoDark from "../assets/logo_dark.svg";
import logoWhite from "../assets/logo_white.svg";
import floorLayoutImage from "../assets/floor layout.webp";
import threeRooms75Image from "../assets/3 rooms 75,60.webp";
import threeRooms80Image from "../assets/3 rooms 80,57.webp";
import { CallbackButton } from "../components/CallbackModal";
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
        href: facadeImage,
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
  const lastScrollYRef = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
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
  }, []);

  return (
    <div
      className={`fixed left-0 right-0 z-50 px-5 transition-all duration-300 ease-out sm:px-8 lg:px-12 ${
        scrolled ? "top-3 sm:top-4" : "top-5 sm:top-8"
      } ${
        visible ? "translate-y-0 opacity-100" : "-translate-y-[150%] opacity-0 pointer-events-none"
      }`}
    >
      <header className="header-shell mx-auto flex w-full max-w-[1300px] items-center rounded-[12px] p-[12px] backdrop-blur-[25px]">
        <a
          href="/"
          className="inline-flex shrink-0 items-center transition-opacity hover:opacity-80"
          aria-label="Отрада — на главный экран"
        >
          <img
            className="h-auto w-[100px]"
            src={logoDark}
            alt="Отрада — на главную"
            width={100}
            height={28}
          />
        </a>

        <div className="ml-auto flex items-center gap-4 lg:gap-5">
          <nav className="hidden items-center gap-5 lg:flex" aria-label="Основная навигация">
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
          className="ml-2 grid size-10 place-items-center rounded-[4px] text-ink transition-colors hover:bg-black/5 lg:hidden"
          type="button"
          aria-label="Открыть меню"
        >
          <Menu aria-hidden="true" size={24} strokeWidth={1.6} />
        </button>
      </header>
    </div>
  );
}

function Index() {
  return (
    <main className="bg-background text-foreground">
      <Header />
      <section className="relative isolate min-h-[100svh] overflow-hidden">
        <img
          className="absolute inset-0 -z-10 size-full object-cover object-[center_72%]"
          src={facadeImage}
          alt="Фасад жилого дома «Отрада» в Ульяновске"
          fetchPriority="high"
          width={1920}
          height={1080}
        />

        <div className="mx-auto flex min-h-[100svh] w-full max-w-layouts flex-col px-5 pb-10 pt-5 sm:px-8 sm:pb-14 sm:pt-8 lg:px-12">
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
              <p className="hero-enter hero-delay-2 hero-text-shadow mt-6 max-w-none whitespace-nowrap text-[clamp(1rem,2.8vw,1.75rem)] leading-relaxed text-foreground/90">
                Ваша новая квартира в самом центре Ульяновска
              </p>
              <div className="hero-enter hero-delay-4 mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
                <a className="cta-outline group rounded-[4px]" href="#layouts">
                  Посмотреть планировки
                  <ArrowRight
                    className="transition-transform group-hover:translate-x-1"
                    aria-hidden="true"
                    size={19}
                  />
                </a>
                <CallbackButton
                  layoutId="callback-hero"
                  className="cta-solid cta-large rounded-[4px]"
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

function AboutSection() {
  const { ref: imgRef, inView: imgInView } = useInView<HTMLImageElement>();

  return (
    <section
      id="about"
      className="bg-white text-[#001826] pt-[100px] pb-[100px]"
      aria-labelledby="about-title"
    >
      <div className="mx-auto w-full max-w-layouts px-5 sm:px-8 lg:px-12">
        <h2
          id="about-title"
          className="font-display text-[clamp(1.75rem,4vw,2.875rem)] leading-tight text-[#001826]"
        >
          О проекте
        </h2>

        <div className="mt-10 flex flex-col items-center gap-10 lg:flex-row lg:items-start lg:gap-[100px]">
          {/* Фотография 550x680 скругление 12px */}
          <div className="w-full max-w-[550px] shrink-0">
            <img
              ref={imgRef}
              className={`reveal-up h-[680px] w-full rounded-[12px] object-cover shadow-sm ${
                imgInView ? "reveal-up-in" : ""
              }`}
              src={projectImage}
              alt="Девятиэтажный жилой дом «Отрада» на улице Мира в Ульяновске"
              loading="lazy"
              width={550}
              height={680}
            />
          </div>

          {/* Текстовый блок: параграф + в 40px табличка спецификаций */}
          <div className="flex flex-1 flex-col">
            <p className="font-sans text-base leading-[1.6] text-[#001826] sm:text-lg">
              «Отрада» — девятиэтажный дом в тихой части исторического центра Ульяновска, на улице
              Мира. Камерный формат проекта принципиально отличается от плотных многоэтажных
              массивов: здесь мало соседей, чистая придомовая территория с детской площадкой и
              собственная закрытая автостоянка. Архитектура дома сочетает прочный
              монолитно-кирпичный конструктив, индивидуальное отопление и гибкие свободные
              планировки. Это пространство, где динамика центрального района естественно соединяется
              с приватностью, тишиной и полным бытовым комфортом
            </p>

            <div className="mt-[40px] flex flex-col">
              {projectSpecs.map((spec, index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 border-b border-[#001826]/30 py-3.5 text-base sm:grid-cols-2 sm:text-lg"
                >
                  <span className="text-[#001826]/50">{spec.label}</span>
                  <span className="font-normal text-[#001826]">{spec.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const benefitsData = [
  {
    title: "Монолитный каркас",
    text: "Монолитный железобетонный каркас обеспечивает зданию исключительную прочность и точную геометрию. Конструкция дает минимальную и плавную усадку, благодаря чему дизайнерский ремонт, дорогая штукатурка и широкоформатная плитка сохраняют идеальный вид без трещин и деформаций годами. Отсутствие внутренних несущих перегородок оставляет полную свободу в зонировании: пространство легко адаптировать под индивидуальный проект — от масштабной кухни-гостиной до приватной мастер-спальни с гардеробной.",
  },
  {
    title: "Поквартирное отопление",
    text: "Индивидуальный котел в квартире дает полную независимость от городского графика. Когда на улице сырая осень или холодный май, комфортный микроклимат настраивается за пару секунд, без ожидания начала отопительного сезона. Система работает строго по фактической потребности: тепло не расходуется впустую во время отъезда, а счета в квитанциях формируются по реальному счетчику, выходя ощутимо ниже общегородских тарифов.",
  },
  {
    title: "Парковка",
    text: "Собственный закрытый паркинг на первом этаже дома снимает вопрос вечернего поиска места: автомобиль всегда ждет на закрепленной точке, в сухом и защищенном пространстве. Зимой не приходится тратить время на прогрев мотора и очистку стекол от наледи, а с пакетами и вещами можно сразу подняться на лифте к квартире. Для второго автомобиля или гостей предусмотрена открытая благоустроенная стоянка на придомовой территории.",
  },
  {
    title: "Окружение и инфраструктура",
    text: "Исторический центр обеспечивает городскую автономность: всё необходимое для жизни находится в радиусе короткой пешей прогулки. В пяти-семи минутах от дома сосредоточены ведущие гимназии и статусные школы города. Дорога на занятия занимает минимум времени и проходит по спокойным центральным улицам — без утренних пробок, ожидания транспорта и сложных маршрутов.\n\nБуквально за углом начинается главная городская жизнь. На соседних улицах сформировался насыщенный кластер для отдыха: пешеходные зоны с брусчаткой, атмосферные кофейни, авторские рестораны, зеленые скверы, театры и набережная.",
  },
  {
    title: "Тишина",
    text: "Улица Мира расположена в самом центре, но устроена так, что сквозного движения здесь нет. Основные транспортные потоки уходят на соседние широкие артерии, поэтому под окнами не скапливаются заторы, нет маршрутного транспорта и шума тяжелой техники. Даже в разгар дня здесь сохраняется спокойный, размеренный ритм, а ночью не слышно перекрестков и монотонного гула проспектов — можно спокойно спать с открытыми окнами.",
  },
];

function BenefitsSection() {
  return (
    <section
      id="benefits"
      className="bg-[#023352] text-foreground"
      aria-labelledby="benefits-title"
    >
      <div className="mx-auto w-full max-w-layouts px-5 pb-24 pt-[100px] sm:px-8 lg:px-12">
        <h2
          id="benefits-title"
          className="font-display text-[clamp(1.75rem,4vw,2.875rem)] leading-tight text-white"
        >
          Преимущества
        </h2>

        <div className="mx-auto mt-10 w-full max-w-[1400px]">
          <StackedSections stackOffset={18} paneGap="gap-[60vh] lg:gap-3" scrollRunway="25vh">
            {benefitsData.map((item, index) => (
              <article
                key={index}
                className="flex w-full max-w-[1400px] flex-col gap-[30px] rounded-2xl bg-card p-[20px] text-card-foreground shadow-[0_-4px_20px_rgba(0,0,0,0.1)] lg:flex-row lg:items-start"
              >
                <img
                  className="h-[220px] w-full shrink-0 rounded-xl object-cover sm:h-[300px] lg:h-[400px] lg:w-[600px]"
                  src={benefitImage}
                  alt={`${item.title} — жилой дом «Отрада»`}
                  loading="lazy"
                  width={600}
                  height={400}
                />
                <div className="flex flex-1 flex-col">
                  <h3 className="font-sans text-[1.5rem] font-medium leading-tight text-[#001826] sm:text-[1.75rem] lg:text-[2rem]">
                    {item.title}
                  </h3>
                  <p className="mt-[10px] whitespace-pre-line text-sm leading-[1.6] text-card-foreground/85 sm:text-base">
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
    imageSrc: floorLayoutImage,
    imageAlt: "Схема планировки этажа жилого дома «Отрада»",
  },
};

const threeRoomApartments = [
  {
    id: "3room-1",
    title: "3-комнатная квартира",
    imageSrc: threeRooms75Image,
    totalArea: "75,60",
    heatedArea: "74,48",
  },
  {
    id: "3room-2",
    title: "3-комнатная квартира",
    imageSrc: threeRooms80Image,
    totalArea: "80,57",
    heatedArea: "78,13",
  },
];

const twoRoomApartments = [
  {
    id: "2room-1",
    title: "2-комнатная квартира",
    imageSrc: "/floor-plan-2k-1.png",
    totalArea: "58,58",
    heatedArea: "57,09",
  },
  {
    id: "2room-2",
    title: "2-комнатная квартира",
    imageSrc: "/floor-plan-2k-2.png",
    totalArea: "61,38",
    heatedArea: "60,02",
  },
];

const oneRoomApartments = [
  {
    id: "1room-1",
    title: "1-комнатная квартира",
    imageSrc: "/floor-plan-1k-1.png",
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

function ApartmentCardsGrid({
  apartments,
  tabKey,
}: {
  apartments: ApartmentItem[];
  tabKey: string;
}) {
  const isSingle = apartments.length === 1;

  return (
    <div
      className={
        isSingle
          ? "flex w-full justify-center"
          : "grid w-full max-w-[1300px] grid-cols-1 items-stretch gap-6 md:grid-cols-2 lg:gap-8"
      }
    >
      {apartments.map((item, index) => (
        <article
          key={item.id}
          className={`flex w-full flex-col justify-between gap-[40px] rounded-[24px] bg-white p-[20px] shadow-lg ${
            isSingle ? "max-w-[620px]" : ""
          }`}
        >
          {/* Элемент 1: заголовок h3 */}
          <h3 className="text-center font-sans text-2xl font-normal leading-tight text-[#001826] sm:text-[1.75rem]">
            {item.title}
          </h3>

          {/* Элемент 2: фотография (высота 360) */}
          <div className="flex h-[360px] w-full items-center justify-center overflow-hidden rounded-xl border border-slate-100 bg-[#f8fafc] p-2">
            {item.imageSrc ? (
              <img
                src={item.imageSrc}
                alt={`Планировка: ${item.title} ${item.totalArea} м²`}
                className="max-h-full max-w-full object-contain"
                loading="lazy"
                width={500}
                height={360}
              />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center p-6 text-center text-slate-400">
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
            <div className="flex flex-col items-center gap-1.5 text-center text-sm text-[#001826] sm:text-base">
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
        </article>
      ))}
    </div>
  );
}

function LayoutsSection() {
  const [activeTab, setActiveTab] = useState(3);
  const currentLayout = layoutsData[activeTab] ?? layoutsData[0];

  return (
    <section id="layouts" className="bg-layouts text-foreground" aria-labelledby="layouts-title">
      <div className="mx-auto w-full max-w-layouts px-5 pb-24 pt-[100px] sm:px-8 lg:px-12">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
          <h2
            id="layouts-title"
            className="font-display text-[clamp(1.75rem,4vw,2.875rem)] leading-tight"
          >
            Планировки
          </h2>
          <FluidTabs
            labels={layoutTabs}
            activeIndex={activeTab}
            onActiveIndexChange={setActiveTab}
            className="lg:mt-[21px]"
          />
        </div>

        <div
          id="layouts-panel"
          role="tabpanel"
          aria-labelledby={`layouts-tab-${activeTab}`}
          className="mt-10 flex justify-center"
        >
          {activeTab === 1 ? (
            <ApartmentCardsGrid apartments={threeRoomApartments} tabKey="3room" />
          ) : activeTab === 2 ? (
            <ApartmentCardsGrid apartments={twoRoomApartments} tabKey="2room" />
          ) : activeTab === 3 ? (
            <ApartmentCardsGrid apartments={oneRoomApartments} tabKey="1room" />
          ) : (
            <article className="flex w-full max-w-[760px] flex-col gap-10 rounded-[24px] bg-white p-5 shadow-lg">
              <h3 className="text-center font-sans text-2xl font-medium leading-tight text-[#001826] sm:text-[1.75rem]">
                {currentLayout.title}
              </h3>

              <div className="flex min-h-[300px] w-full items-center justify-center overflow-hidden rounded-xl border border-[#e2e8f0] bg-[#fafafa] p-2 sm:min-h-[420px]">
                {currentLayout.imageSrc ? (
                  <img
                    src={currentLayout.imageSrc}
                    alt={currentLayout.imageAlt}
                    className="max-h-[480px] w-full object-contain"
                    loading="lazy"
                    width={760}
                    height={480}
                  />
                ) : (
                  <div className="flex min-h-[300px] w-full flex-col items-center justify-center p-6 text-center text-slate-400 sm:min-h-[420px]">
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
            </article>
          )}
        </div>
      </div>
    </section>
  );
}

const constructionItems = [
  { id: "sep-26", title: "Сентябрь 2026", imageSrc: "/construction-sep-2026.png" },
  { id: "aug-26", title: "Август 2026", imageSrc: "/construction-aug-2026.png" },
  { id: "jul-26", title: "Июль 2026", imageSrc: "/construction-jul-2026.png" },
  { id: "jun-26", title: "Июнь 2026", imageSrc: "/construction-jun-2026.png" },
  { id: "may-26", title: "Май 2026", imageSrc: "/construction-may-2026.png" },
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
    const scrollAmount = 420; // 400px card + 20px gap
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
      <div className="mx-auto w-full max-w-layouts px-5 sm:px-8 lg:px-12">
        <h2
          id="construction-title"
          className="font-display text-[clamp(1.75rem,4vw,2.875rem)] leading-tight text-[#001826]"
        >
          Ход строительства
        </h2>
      </div>

      <div
        ref={sliderRef}
        onScroll={checkScroll}
        className="mt-[40px] flex w-full gap-[20px] overflow-x-auto scroll-smooth px-5 pb-2 pt-1 scrollbar-none sm:px-8 lg:px-[max(3rem,calc((100vw-87.5rem)/2+3rem))]"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {constructionItems.map((item) => (
          <article key={item.id} className="w-[400px] shrink-0">
            <div className="h-[400px] w-[400px] overflow-hidden rounded-[20px] border border-slate-100 bg-[#f8fafc] shadow-sm">
              {item.imageSrc ? (
                <img
                  src={item.imageSrc}
                  alt={`Ход строительства — ${item.title}`}
                  className="h-full w-full object-cover"
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
      <div className="mx-auto w-full max-w-layouts px-5 sm:px-8 lg:px-12">
        <h2
          id="contacts-title"
          className="font-display text-[clamp(1.75rem,4vw,2.875rem)] leading-tight text-[#001826]"
        >
          Наши контакты
        </h2>

        <div className="mt-[40px] flex flex-col items-center gap-[50px] lg:flex-row">
          {/* Яндекс.Карты (600x400) */}
          <div className="h-[400px] w-full max-w-[600px] shrink-0 overflow-hidden rounded-[20px] border border-slate-100 bg-[#f8fafc] shadow-sm">
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
          <div className="flex flex-1 flex-col justify-center gap-6">
            <div>
              <span className="block text-sm text-[#001826]/50 sm:text-base">Адрес</span>
              <p className="mt-1 font-sans text-base font-normal text-[#001826] sm:text-lg">
                г. Ульяновск, ул. Хваткова, дом, 28В, офис 208
              </p>
            </div>

            <div>
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

            <div>
              <span className="block text-sm text-[#001826]/50 sm:text-base">Номер приемной</span>
              <div className="mt-1 flex flex-col gap-1 font-sans text-base font-normal text-[#001826] sm:text-lg">
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

            <div>
              <span className="block text-sm text-[#001826]/50 sm:text-base">
                Номер отдела продаж
              </span>
              <div className="mt-1 flex flex-col gap-1 font-sans text-base font-normal text-[#001826] sm:text-lg">
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

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
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
    setSent(true);
  };

  return (
    <section
      id="questions"
      className="bg-[#023352] text-foreground pt-[100px] pb-[100px]"
      aria-labelledby="questions-title"
    >
      <div className="mx-auto w-full max-w-layouts px-5 sm:px-8 lg:px-12">
        <h2
          id="questions-title"
          className="text-center font-display text-[clamp(1.75rem,4vw,2.875rem)] leading-tight text-white"
        >
          Остались вопросы!
        </h2>

        <div className="mt-[40px] mx-auto w-full max-w-[600px] rounded-[24px] bg-white p-6 sm:p-10 shadow-2xl text-[#001826]">
          {sent ? (
            <div className="flex flex-col items-center py-8 text-center">
              <span className="grid size-16 place-items-center rounded-full bg-brand/10 text-brand">
                <Check aria-hidden="true" size={32} strokeWidth={2} />
              </span>
              <h3 className="mt-5 font-display text-2xl sm:text-3xl leading-tight text-[#001826]">
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
                className="mt-6 text-sm font-medium text-[#023352] underline underline-offset-4 hover:opacity-80"
              >
                Отправить ещё одну заявку
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="flex flex-col">
              <h3 className="font-display text-xl sm:text-2xl text-center text-[#001826] leading-snug">
                Оставьте ваш контакт, и мы на всё ответим
              </h3>

              <div className="mt-8 flex flex-col gap-5">
                <label className="flex flex-col gap-2 text-sm font-medium text-[#001826]">
                  Указать ваше имя
                  <input
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-base text-ink placeholder:text-muted-foreground transition-colors focus:border-[#023352] focus:outline-none"
                    type="text"
                    name="name"
                    autoComplete="name"
                    maxLength={100}
                    placeholder="Ваше имя"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                  />
                </label>
                <label className="flex flex-col gap-2 text-sm font-medium text-[#001826]">
                  Указать номер телефона
                  <input
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-base text-ink placeholder:text-muted-foreground transition-colors focus:border-[#023352] focus:outline-none"
                    type="tel"
                    name="phone"
                    autoComplete="tel"
                    maxLength={20}
                    placeholder="+7 (___) ___-__-__"
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                  />
                </label>
              </div>

              {error ? (
                <p className="mt-3 text-sm text-destructive text-center" role="alert">
                  {error}
                </p>
              ) : null}

              <button
                className="cta-solid mt-8 w-full rounded-[4px] py-4 text-base font-medium"
                type="submit"
              >
                Отправить
              </button>
              <p className="mt-4 text-center text-xs leading-[1.5] text-slate-500">
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
      <div className="mx-auto w-full max-w-layouts px-5 sm:px-8 lg:px-12">
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
      </div>

      {/* Нижний логотип, прикрепленный к самому низу сайта */}
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
    </footer>
  );
}
