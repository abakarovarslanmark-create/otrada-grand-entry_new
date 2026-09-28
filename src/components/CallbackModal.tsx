import { Check } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import {
  ExpandableScreen,
  ExpandableScreenContent,
  ExpandableScreenTrigger,
} from "./ExpandableScreen";

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-base text-ink placeholder:text-muted-foreground transition-colors focus:border-[#023352] focus:outline-none";

export function CallbackButton({
  layoutId,
  className = "cta-solid",
  children,
  triggerRadius = "12px",
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
      contentRadius="24px"
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
        className="flex h-auto! max-h-[90dvh] w-[min(94vw,48rem)]! flex-col justify-center overflow-y-auto bg-white p-6 text-card-foreground shadow-2xl sm:p-10 md:p-12"
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
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    nameRef.current?.focus();
  }, []);

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
    onSent();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto flex w-full max-w-lg flex-col justify-center py-6"
      noValidate
    >
      <h2 className="font-display text-[clamp(1.75rem,4vw,2.5rem)] leading-tight text-center text-[#001826]">
        Заказать звонок
      </h2>
      <p className="mt-3 text-center text-base leading-[1.5] text-slate-600">
        Оставьте контакты — мы перезвоним вам и ответим на вопросы о квартирах.
      </p>

      <div className="mt-8 flex flex-col gap-5">
        <label className="flex flex-col gap-2 text-sm font-medium text-[#001826]">
          Указать ваше имя
          <input
            ref={nameRef}
            className={inputClass}
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
            className={inputClass}
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

      <button className="cta-solid mt-8 w-full py-4 text-base font-medium" type="submit">
        Отправить
      </button>
      <p className="mt-4 text-center text-xs leading-[1.5] text-slate-500">
        Нажимая кнопку, вы соглашаетесь на обработку персональных данных
      </p>
    </form>
  );
}
