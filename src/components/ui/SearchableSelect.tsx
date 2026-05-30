// src/components/ui/SearchableSelect.tsx
"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronDown, Search, X } from "lucide-react";
import { createPortal } from "react-dom";

interface SearchableSelectProps {
  value: string;
  onChange: (val: string) => void;
  options: string[];
  placeholder?: string;
  disabled?: boolean;
  searchThreshold?: number;
}

const SearchableSelect = ({
  value,
  onChange,
  options,
  placeholder = "বেছে নিন",
  disabled = false,
  searchThreshold = 5,
}: SearchableSelectProps) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [pos, setPos] = useState({ top: 0, left: 0, width: 0 });

  const filtered = useMemo(() => {
    if (!search.trim()) return options;
    const q = search.toLowerCase();
    return options.filter((o) => o.toLowerCase().includes(q));
  }, [options, search]);

  /* ── Position calc ── */
  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    setPos({
      top: rect.bottom + window.scrollY + 6,
      left: rect.left + window.scrollX,
      width: rect.width,
    });
  }, []);

  const handleOpen = useCallback(() => {
    if (disabled) return;
    updatePosition();
    setOpen(true);
  }, [disabled, updatePosition]);

  const close = useCallback(() => {
    setOpen(false);
    setSearch("");
  }, []);

  /* ── Recalc on scroll / resize ── */
  useEffect(() => {
    if (!open) return;
    const onUpdate = () => updatePosition();
    window.addEventListener("scroll", onUpdate, true);
    window.addEventListener("resize", onUpdate);
    return () => {
      window.removeEventListener("scroll", onUpdate, true);
      window.removeEventListener("resize", onUpdate);
    };
  }, [open, updatePosition]);

  /* ── Close on outside click ── */
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        triggerRef.current?.contains(target) ||
        dropdownRef.current?.contains(target)
      )
        return;
      close();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open, close]);

  /* ── Auto-focus search ── */
  useEffect(() => {
    if (open) requestAnimationFrame(() => inputRef.current?.focus());
  }, [open]);

  const handleSelect = useCallback(
    (val: string) => {
      onChange(val);
      close();
    },
    [onChange, close],
  );

  const handleClear = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onChange("");
      setSearch("");
    },
    [onChange],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") close();
    },
    [close],
  );

  return (
    <>
      {/* ── Trigger ── */}
      <button
        ref={triggerRef}
        type="button"
        disabled={disabled}
        onClick={() => (open ? close() : handleOpen())}
        onKeyDown={handleKeyDown}
        className={`w-full flex items-center justify-between border border-(--color-active-border) rounded-xl px-3 sm:px-4 py-2.5 text-sm bg-(--color-bg) text-left transition-all ${
          disabled
            ? "opacity-50 cursor-not-allowed"
            : "hover:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
        } ${open ? "ring-2 ring-blue-100 border-blue-400" : ""}`}
      >
        <span className={value ? "text-(--color-text)" : "text-(--color-gray)"}>
          {value || placeholder}
        </span>
        <div className="flex items-center gap-1 shrink-0">
          {value && !disabled && (
            <span
              onClick={handleClear}
              className="p-0.5 hover:bg-(--color-active-bg) rounded transition-colors"
            >
              <X className="w-3.5 h-3.5 text-(--color-gray)" />
            </span>
          )}
          <ChevronDown
            className={`w-4 h-4 text-(--color-gray) transition-transform duration-200 ${
              open ? "rotate-180" : ""
            }`}
          />
        </div>
      </button>

      {/* ── Portal dropdown ── */}
      {open &&
        typeof window !== "undefined" &&
        createPortal(
          <div
            ref={dropdownRef}
            onKeyDown={handleKeyDown}
            style={{
              position: "absolute",
              top: pos.top,
              left: pos.left,
              width: pos.width,
              zIndex: 99999,
            }}
            className="bg-(--color-bg) border border-(--color-active-border) rounded-xl shadow-2xl overflow-hidden"
          >
            {/* Search */}
            {options.length > searchThreshold && (
              <div className="p-2 border-b border-(--color-active-border)">
                <div className="flex items-center gap-2 bg-(--color-active-bg) rounded-lg px-3 py-2">
                  <Search className="w-4 h-4 text-(--color-gray) shrink-0" />
                  <input
                    ref={inputRef}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="খুঁজুন..."
                    className="flex-1 bg-transparent text-sm text-(--color-text) outline-none placeholder:text-(--color-gray)"
                  />
                  {search && (
                    <button
                      onClick={() => setSearch("")}
                      className="text-(--color-gray) hover:text-(--color-text)"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Options list */}
            <div className="max-h-52 overflow-y-auto overscroll-contain">
              {filtered.length === 0 ? (
                <div className="px-4 py-3 text-sm text-(--color-gray) text-center">
                  কিছু পাওয়া যায়নি
                </div>
              ) : (
                filtered.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => handleSelect(opt)}
                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center justify-between ${
                      opt === value
                        ? "bg-blue-50 text-blue-700 font-medium dark:bg-blue-950 dark:text-blue-300"
                        : "text-(--color-text) hover:bg-(--color-active-bg)"
                    }`}
                  >
                    <span>{opt}</span>
                    {opt === value && (
                      <Check className="w-4 h-4 text-blue-600 shrink-0" />
                    )}
                  </button>
                ))
              )}
            </div>
          </div>,
          document.body,
        )}
    </>
  );
};

export default SearchableSelect;
