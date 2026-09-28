import { useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Menu } from "lucide-react";
import facadeAsset from "../assets/otrada-facade.webp.asset.json";
import projectAsset from "../assets/otrada-project.png.asset.json";
import benefitAsset from "../assets/otrada-benefit.png.asset.json";
import logoAsset from "../assets/otrada-logo.png.asset.json";
import { CallbackButton } from "../components/CallbackModal";
import FluidTabs from "../components/FluidTabs";
import StackedSections from "../components/StackedSections";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Отрада — квартиры в центре Ульяновска" },
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
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Отрада",
          description: "Строительная компания и жилой дом в центре Ульяновска",
          areaServed: "Ульяновск",
        }),
      },
    ],
  }),
});

const aboutStats = [
  { value: 40, unit: null, caption: "Квартиры" },
  { value: 1247, unit: "м²", caption: "площадь участка" },
  { value: 9, unit: null, caption: "Этажей" },
];

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

function CountUp({ value, started, duration = 1500 }: { value: number; started: boolean; duration?: number }) {
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    if (!started) return;
    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 4); // easeOutQuart: быстрый старт, плавное замедление
      setDisplay(Math.round(value * eased));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [started, value, duration]);

  return <>{display}</>;
}

function Index() {
  return (
    <main className="bg-background text-foreground">
      <section className="relative isolate min-h-[100svh] overflow-hidden">
        <img
          className="absolute inset-0 -z-10 size-full object-cover object-[center_72%]"
          src={facadeAsset.url}
          alt="Фасад жилого дома «Отрада» в Ульяновске"
        />

        <div className="mx-auto flex min-h-[100svh] w-full max-w-site flex-col px-5 pb-10 pt-5 sm:px-8 sm:pb-14 sm:pt-8 lg:px-12">
          <header className="header-shell hero-header-enter mx-auto flex w-full max-w-[1200px] items-center p-3">
            <img className="h-6 w-auto lg:h-7" src={logoAsset.url} alt="Отрада — на главную" />

            <div className="ml-auto flex items-center gap-4 lg:gap-5">
              <nav className="hidden items-center gap-5 lg:flex" aria-label="Основная навигация">
                <a className="nav-link" href="#about">О проекте</a>
                <a className="nav-link" href="#benefits">Преимущества</a>
                <a className="nav-link" href="#layouts">Планировки</a>
                <a className="nav-link" href="#callback">Контакты</a>
              </nav>

              <CallbackButton layoutId="callback-header" />
            </div>
            <button className="ml-2 grid size-10 place-items-center text-ink lg:hidden" type="button" aria-label="Открыть меню">
              <Menu aria-hidden="true" size={24} strokeWidth={1.6} />
            </button>
          </header>

          <section className="flex flex-1 items-end pb-[8vh] pt-24 sm:items-center sm:pb-0 sm:pt-20" aria-labelledby="hero-title">
            <div className="max-w-4xl">
              <h1 id="hero-title" className="hero-enter hero-delay-1 hero-text-shadow whitespace-nowrap font-display text-[clamp(2rem,7vw,6rem)] leading-[0.98] text-foreground">
                Жизнь - это Отрада
              </h1>
              <p className="hero-enter hero-delay-2 hero-text-shadow mt-6 max-w-2xl text-lg leading-relaxed text-foreground/90 sm:text-[1.75rem] sm:leading-relaxed">
                Ваша новая квартира в самом центре Ульяновска
              </p>
              <div className="hero-enter hero-delay-4 mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
                <a className="cta-outline group" href="#layouts">
                  Посмотреть планировки
                  <ArrowRight className="transition-transform group-hover:translate-x-1" aria-hidden="true" size={19} />
                </a>
                <CallbackButton layoutId="callback-hero" className="cta-solid cta-large" />
              </div>
            </div>
          </section>
        </div>
      </section>

      <AboutSection />
      <BenefitsSection />
      <LayoutsSection />
    </main>
  );
}

function AboutSection() {
  const { ref: imgRef, inView: imgInView } = useInView<HTMLImageElement>();
  const { ref: statsRef, inView: statsInView } = useInView<HTMLDListElement>();

  return (
    <section id="about" className="bg-card text-card-foreground" aria-labelledby="about-title">
      <div className="mx-auto w-full max-w-site px-5 pb-24 pt-[100px] sm:px-8 lg:px-12">
        <h2 id="about-title" className="font-display text-[clamp(1.75rem,4vw,2.875rem)] leading-tight">
          О проекте
        </h2>

        <div className="mt-5 grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
          <img
            ref={imgRef}
            className={`reveal-up w-full rounded-[24px] object-cover lg:col-span-5 ${imgInView ? "reveal-up-in" : ""}`}
            src={projectAsset.url}
            alt="Девятиэтажный жилой дом «Отрада» на улице Мира в Ульяновске"
          />

          <div className="lg:col-span-7">
            <p className="max-w-[62ch] text-base leading-[1.5] lg:text-lg">
              «Отрада» — это не только наше название, но и уровень жизни, который мы дарим нашим
              клиентам. Девятиэтажный дом расположен в центре Ульяновска, на улице Мира, здесь не
              нужно тратить время на дорогу, чтобы оказаться в гуще городской жизни.
              Монолитно-кирпичный каркас обеспечивает надёжность, тишину и долговечность здания,
              поквартирное отопление даёт полный контроль над комфортом в каждой квартире, а
              свободные планировки позволяют реализовать любой сценарий — от классического
              зонирования до просторной студии. На первом этаже дома предусмотрена закрытая
              автостоянка — редкое преимущество для центра города, где с парковкой всегда сложно.
              Благоустроенный двор с детской площадкой создаёт спокойную атмосферу в двух шагах от
              центральных улиц.
            </p>

            <dl ref={statsRef} className="mt-10 flex flex-wrap items-end justify-between gap-x-10 gap-y-8 sm:mt-14">
              {aboutStats.map((stat) => (
                <div key={stat.caption} className="flex flex-col items-center">
                  <dd className="whitespace-nowrap font-display text-[clamp(2rem,7vw,6rem)] leading-none">
                    <CountUp value={stat.value} started={statsInView} />
                    {stat.unit ? <span className="align-super text-[0.38em]">{stat.unit}</span> : null}
                  </dd>
                  <dt className="mt-2 text-sm text-card-foreground/70 lg:text-base">{stat.caption}</dt>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}

const benefitCard = {
  title: "Монолитный каркас",
  text: "Монолитный железобетонный каркас — самая надёжная технология строительства, обеспечивающая максимальную прочность и долговечность здания. Такая конструкция не даёт усадки и трещин, характерных для панельных домов, а значит, качество ремонта и отделки сохранится на десятилетия. Монолит также позволяет реализовать свободные планировки — внутренние перегородки не несут нагрузки и не ограничивают ваши решения по зонированию пространства. Это выбор в пользу дома, который прослужит не одному поколению",
};

function BenefitsSection() {
  return (
    <section id="benefits" className="bg-[#023352] text-foreground" aria-labelledby="benefits-title">
      <div className="mx-auto w-full max-w-site px-5 pb-24 pt-[100px] sm:px-8 lg:px-12">
        <h2 id="benefits-title" className="font-display text-[clamp(1.75rem,4vw,2.875rem)] leading-tight">
          Преимущества
        </h2>

        <div className="mx-auto mt-10 w-full max-w-[75rem]">
          <StackedSections stackOffset={48}>
            {Array.from({ length: 4 }, (_, index) => (
              <article
                key={index}
                className="flex flex-col gap-5 rounded-2xl bg-card p-5 text-card-foreground shadow-[0_-4px_20px_rgba(0,0,0,0.1)] md:flex-row md:items-start md:justify-between md:gap-10"
              >
                <img
                  className="h-64 w-full rounded-xl object-cover md:h-auto md:w-[42%]"
                  src={benefitAsset.url}
                  alt="Монолитный каркас дома «Отрада» на этапе строительства"
                  loading="lazy"
                />
                <div className="md:w-[52%]">
                  <h3 className="text-[1.75rem] leading-tight md:text-[2rem]">{benefitCard.title}</h3>
                  <p className="mt-[10px] text-base leading-[1.5]">{benefitCard.text}</p>
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

function LayoutsSection() {
  const [activeTab, setActiveTab] = useState(0);

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
          className="mt-10 min-h-[420px] rounded-2xl bg-card text-card-foreground sm:min-h-[520px]"
        />
      </div>
    </section>
  );
}
