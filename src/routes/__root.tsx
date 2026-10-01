import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

const schemaOrgData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ApartmentComplex",
      "@id": "https://otrada-dom.ru/#building",
      name: "Жилой дом «Отрада»",
      description:
        "Клубный девятиэтажный жилой дом в историческом центре Ульяновска на улице Мира. Поквартирное отопление, закрытый паркинг, продуманные планировки.",
      url: "https://otrada-dom.ru/",
      image: "https://otrada-dom.ru/otrada-facade.webp",
      address: {
        "@type": "PostalAddress",
        streetAddress: "ул. Мира",
        addressLocality: "Ульяновск",
        addressRegion: "Ульяновская область",
        postalCode: "432000",
        addressCountry: "RU",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: 54.314192,
        longitude: 48.403132,
      },
      amenityFeature: [
        {
          "@type": "LocationFeatureSpecification",
          name: "Поквартирное индивидуальное отопление",
          value: true,
        },
        {
          "@type": "LocationFeatureSpecification",
          name: "Собственный закрытый паркинг",
          value: true,
        },
        {
          "@type": "LocationFeatureSpecification",
          name: "Охраняемая благоустроенная территория",
          value: true,
        },
      ],
    },
    {
      "@type": "RealEstateAgent",
      "@id": "https://otrada-dom.ru/#organization",
      name: "ООО СЗ «Отрада»",
      url: "https://otrada-dom.ru/",
      logo: "https://otrada-dom.ru/otrada-logo.png",
      telephone: "+7 (8422) 24-94-44",
      address: {
        "@type": "PostalAddress",
        streetAddress: "ул. Мира",
        addressLocality: "Ульяновск",
        addressRegion: "Ульяновская область",
        addressCountry: "RU",
      },
    },
  ],
};

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Отрада — квартиры в центре Ульяновска | Официальный сайт" },
      {
        name: "description",
        content:
          "Клубный жилой дом «Отрада» в историческом центре Ульяновска на улице Мира. Поквартирное отопление, закрытый паркинг, продуманные планировки 1-3 комнатных квартир.",
      },
      { name: "author", content: "ООО СЗ ОТРАДА" },
      { property: "og:site_name", content: "Жилой дом «Отрада»" },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "ru_RU" },
      {
        property: "og:title",
        content: "Отрада — квартиры в центре Ульяновска | Официальный сайт",
      },
      {
        property: "og:description",
        content:
          "Клубный жилой дом «Отрада» в историческом центре Ульяновска: индивидуальное отопление, закрытый паркинг, комфортные планировки.",
      },
      { property: "og:image", content: "/the facade of the house_hero block.webp" },
      { name: "twitter:card", content: "summary_large_image" },
      {
        name: "twitter:title",
        content: "Отрада — клубный дом в центре Ульяновска",
      },
      {
        name: "twitter:description",
        content:
          "Клубный жилой дом «Отрада» в тихой части исторического центра Ульяновска на улице Мира.",
      },
      { name: "twitter:image", content: "/the facade of the house_hero block.webp" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", type: "image/png", href: "/favicon.png" },
      { rel: "canonical", href: "https://otrada-dom.ru/" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600&family=Zen+Old+Mincho:wght@400&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="ru">
      <head>
        <HeadContent />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrgData) }}
        />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
    </QueryClientProvider>
  );
}
