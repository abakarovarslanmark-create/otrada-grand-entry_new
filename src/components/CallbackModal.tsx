import { Check } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  ExpandableScreen,
  ExpandableScreenContent,
  ExpandableScreenTrigger,
} from "./ExpandableScreen";

const inputClass =
  "w-full rounded-xl border border-border bg-white px-4 py-3 text-base text-ink placeholder:text-muted-foreground transition-colors focus:border-ink/40 focus:outline-none";

export function CallbackButton({
  layoutId,
  className = "cta-solid",
}: {
  layoutId: string;
  className?: string;
}) {
  const [sent, setSent] = useState(false);

  return (
    <ExpandableScreen
      layoutId={layoutId}
      contentRadius="24px"
      onExpandChange={(expanded) => {
        if (!expanded) setSent(false);
      }}
    >
      <ExpandableScreenTrigger>
        <button className={className} type="button">
          Заказать звонок
        </button>
      </ExpandableScreenTrigger>
      <ExpandableScreenContent
        className="h-auto! max-h-[92dvh] w-[min(92vw,30rem)]! bg-card p-6 text-card-foreground sm:p-8"
        closeButtonClassName="text-ink hover:bg-ink/10"
      >
        {sent ? (
          <div className="flex flex-col items-center py-8 text-center">
            <span className="grid size-16 place-items-center rounded-full bg-brand/10 text-brand">
              <Check aria-hidden="true" size={32} strokeWidth={2} />
            </span>
            <h2 className="mt-5 font-display text-2xl leading-tight">
              Заявка отправлена
            </h2>
            <p className="mt-2 text-base leading-[1.5] text-card-foreground/70">
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
  const [comment, setComment] = useState("");
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
    // Бэкенда у сайта-визитки нет: подтверждение показывается локально.
    onSent();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col" noValidate>
      <h2 className="font-display text-[clamp(1.5rem,4vw,2rem)] leading-tight">
        Заказать звонок
      </h2>
      <p className="mt-2 text-base leading-[1.5] text-card-foreground/70">
        Оставьте контакты — мы перезвоним вам и ответим на вопросы о квартирах.
      </p>

      <div className="mt-6 flex flex-col gap-4">
        <label className="flex flex-col gap-1.5 text-sm text-card-foreground/80">
          Имя
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
        <label className="flex flex-col gap-1.5 text-sm text-card-foreground/80">
          Телефон
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
        <label className="flex flex-col gap-1.5 text-sm text-card-foreground/80">
          Комментарий
          <textarea
            className={`${inputClass} min-h-24 resize-none`}
            name="comment"
            maxLength={500}
            placeholder="Например: интересует 2-комнатная квартира"
            value={comment}
            onChange={(event) => setComment(event.target.value)}
          />
        </label>
      </div>

      {error ? (
        <p className="mt-3 text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}

      <button className="cta-solid mt-6 w-full" type="submit">
        Заказать звонок
      </button>
      <p className="mt-3 text-center text-xs leading-[1.5] text-card-foreground/60">
        Нажимая кнопку, вы соглашаетесь на обработку персональных данных
      </p>
    </form>
  );
}
