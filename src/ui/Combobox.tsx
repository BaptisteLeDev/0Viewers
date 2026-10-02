import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { fold } from "@/decouverte/games";
import styles from "./Combobox.module.css";

export type Option = { value: string; label: string; hint?: string; image?: string };

type Props = {
  label: string;
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  searchable?: boolean;
  placeholder?: string;
  emptyText?: string;
  // remote search: parent filters, options arrive already matched
  onQuery?: (query: string) => void;
};

// WAI-ARIA APG combobox: select-only when !searchable, list autocomplete otherwise
export function Combobox({ label, options, value, onChange, searchable = false, placeholder, emptyText = "Aucun résultat", onQuery }: Props) {
  const id = useId();
  const listRef = useRef<HTMLUListElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const selected = options.find((o) => o.value === value);
  const shown = searchable && !onQuery && query ? options.filter((o) => fold(o.label).includes(fold(query))) : options;

  useEffect(() => {
    if (open) listRef.current?.children[active]?.scrollIntoView({ block: "nearest" });
  }, [open, active]);

  const show = () => {
    setOpen(true);
    setActive(Math.max(0, shown.findIndex((o) => o.value === value)));
  };
  const close = () => {
    setOpen(false);
    setQuery("");
    onQuery?.("");
  };
  const pick = (o: Option) => {
    close();
    onChange(o.value);
  };
  const type = (q: string) => {
    setQuery(q);
    setActive(0);
    setOpen(true);
    onQuery?.(q);
  };

  const onKeyDown = (e: KeyboardEvent) => {
    const move = (to: number) => {
      e.preventDefault();
      if (!open) show();
      else if (shown.length > 0) setActive((to + shown.length) % shown.length);
    };
    const choose = () => {
      e.preventDefault();
      if (open && shown[active]) pick(shown[active]);
      else show();
    };
    if (e.key === "ArrowDown") move(active + 1);
    else if (e.key === "ArrowUp") move(active - 1);
    else if (e.key === "Enter") choose();
    else if (e.key === " " && !searchable) choose();
    else if (e.key === "Escape" && open) {
      e.preventDefault();
      close();
    } else if (e.key === "Tab") close();
  };

  return (
    <div className={styles.field}>
      <label htmlFor={`${id}-input`} id={`${id}-label`}>{label}</label>
      <div className={styles.control} data-open={open}>
        <input
          id={`${id}-input`}
          className={styles.input}
          role="combobox"
          aria-expanded={open}
          aria-controls={`${id}-list`}
          aria-autocomplete={searchable ? "list" : "none"}
          aria-activedescendant={open && shown[active] ? `${id}-${active}` : undefined}
          readOnly={!searchable}
          autoComplete="off"
          spellCheck={false}
          value={open && searchable ? query : (selected?.label ?? "")}
          placeholder={open ? (selected?.label ?? placeholder) : placeholder}
          onChange={(e) => type(e.target.value)}
          onClick={() => (open && !searchable ? close() : show())}
          onKeyDown={onKeyDown}
          onBlur={close}
        />
        <span className={styles.chevron} aria-hidden="true" />
        {open && (
          <div className={styles.popup}>
            {shown.length === 0 ? (
              <p className={styles.empty}>{emptyText}</p>
            ) : (
              <ul ref={listRef} id={`${id}-list`} role="listbox" aria-labelledby={`${id}-label`} className={styles.list}>
                {shown.map((o, i) => (
                  <li
                    key={o.value}
                    id={`${id}-${i}`}
                    role="option"
                    aria-selected={o.value === value}
                    data-active={i === active}
                    className={styles.option}
                    onMouseDown={(e) => e.preventDefault()}
                    onMouseMove={() => setActive(i)}
                    onClick={() => pick(o)}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element -- remote 52x72 box art, next/image adds nothing */}
                    {o.image && <img src={o.image} alt="" width={26} height={36} loading="lazy" className={styles.image} />}
                    <span className={styles.label}>{o.label}</span>
                    {o.hint && <span className={styles.hint}>{o.hint}</span>}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
