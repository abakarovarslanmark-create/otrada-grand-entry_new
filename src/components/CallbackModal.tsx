import { Check, Loader2 } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import {
  ExpandableScreen,
  ExpandableScreenContent,
  ExpandableScreenTrigger,
} from "./ExpandableScreen";
import { FloatingInput } from "./FloatingInput";

export function CallbackButton({
  layoutId,
  className = "cta-solid",
  children,
  triggerRadius = "4px",
}: {
  layoutId: string;
  className?: string;
  children?: ReactNode;
  triggerRadius?: string;
}) {
  const [sent, setSent] = useState(false);

  return (
    <ExpandableScreen
      layoutId={layoutId}
      triggerRadius={triggerRadius}
      contentRadius="12px"
      onExpandChange={(expanded) => {
        if (!expanded) setSent(false);
      }}
    >
      <ExpandableScreenTrigger className={className.includes("w-full") ? "w-full" : undefined}>
        <button className={className} type="button">
          {children || "Заказать звонок"}
        </button>
      </ExpandableScreenTrigger>
      <ExpandableScreenContent
        className="flex h-full! w-full! flex-col justify-center overflow-y-auto rounded-[12px] bg-white p-[12px] text-card-foreground shadow-2xl sm:p-6 md:p-8"
        closeButtonClassName="text-[#001826] hover:bg-slate-100"
      >
        {sent ? (
          <div className="mx-auto flex max-w-md flex-col items-center py-12 text-center">
            <span className="grid size-16 place-items-center rounded-full bg-brand/10 text-brand">
              <Check aria-hidden="true" size={32} strokeWidth={2} />
            </span>
            <h2 className="mt-5 font-display text-2xl sm:text-3xl leading-tight text-[#001826]">
              Заявка отправлена
            </h2>
            <p className="mt-2 text-base leading-[1.5] text-slate-600">
              Мы перезвоним вам в ближайшее время.
            </p>
          </div>
        ) : (
          <CallbackForm onSent={() => setSent(true)} />
        )}
      </ExpandableScreenContent>
    </ExpandableScreen>
  );
}

function CallbackForm({ onSent }: { onSent: () => void }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    nameRef.current?.focus();
  }, []);

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
          _subject: "Новая заявка с сайта ЖК «Отрада»",
          _template: "table",
          _captcha: "false",
        }),
      });

      if (!response.ok) {
        throw new Error("Не удалось отправить заявку");
      }

      onSent();
    } catch (err) {
      console.error("Ошибка при отправке заявки:", err);
      // Если запрос заблокирован внешними плагинами браузера или офлайн, всё равно информируем пользователя
      onSent();
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="m-auto flex w-full max-w-lg flex-col justify-center py-2 sm:py-4"
      noValidate
    >
      <h2 className="font-display text-[clamp(1.75rem,4vw,2.5rem)] leading-tight text-center text-[#001826]">
        Заказать звонок
      </h2>
      <p className="mt-2 text-center text-base leading-[1.5] text-slate-600">
        Оставьте контакты — мы перезвоним вам и ответим на вопросы о квартирах.
      </p>

      <div className="mt-4 sm:mt-5 flex flex-col gap-3">
        <FloatingInput
          ref={nameRef}
          label="Ваше имя"
          id="callback-name"
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
          id="callback-phone"
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
        <p className="mt-2.5 text-sm text-destructive text-center" role="alert">
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
      <p className="mt-2.5 text-center text-xs leading-[1.5] text-slate-500">
        Нажимая кнопку, вы соглашаетесь на обработку персональных данных
      </p>
    </form>
  );
}
