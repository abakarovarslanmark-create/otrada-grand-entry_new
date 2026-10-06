import { useState, type InputHTMLAttributes } from "react";

interface FloatingInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export function FloatingInput({
  label,
  value,
  id,
  onChange,
  onFocus,
  onBlur,
  className = "",
  disabled,
  ...props
}: FloatingInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = Boolean(value && String(value).length > 0);
  const isFloating = isFocused || hasValue;

  return (
    <div className="relative w-full">
      <input
        {...props}
        id={id}
        value={value}
        disabled={disabled}
        onChange={onChange}
        onFocus={(e) => {
          setIsFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setIsFocused(false);
          onBlur?.(e);
        }}
        placeholder=" "
        className={`peer h-[56px] w-full rounded-[4px] border border-slate-200 bg-white px-4 pt-5 pb-1 text-base text-ink transition-colors focus:border-[#023352] focus:outline-none disabled:cursor-not-allowed disabled:opacity-70 ${className}`}
      />
      <label
        htmlFor={id}
        className={`pointer-events-none absolute left-4 select-none transition-all duration-200 ease-out ${
          isFloating
            ? "top-2 text-xs font-medium text-slate-500"
            : "top-1/2 -translate-y-1/2 text-base text-slate-400"
        }`}
      >
        {label}
      </label>
    </div>
  );
}
