"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, Home, FileText, Mail, FilePenLine } from "lucide-react";
import { usePathname } from "next/navigation";
import ThemeToggle from "./ThemeToggle";

const navItems = [
  {
    label: "Home",
    href: "/",
    icon: Home,
  },
  {
    label: "Built CVs",
    href: "/cv-builder",
    icon: FileText,
  },
  {
    label: "Contact",
    href: "/contact",
    icon: Mail,
  },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-(--color-active-border) bg-(--color-bg)/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 text-xl font-bold text-(--color-text)"
        >
          <FilePenLine className="h-6 w-6" />
          <span>CV Builder</span>
        </Link>

        {/* Desktop Menu with Animated Background */}
        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.label}
                href={item.href}
                className="relative flex items-center gap-2 rounded-xl px-5 py-2 text-sm font-medium text-(--color-text) transition hover:text-(--color-active-text)"
              >
                {/* Animated Background Pill */}
                {active && (
                  <motion.span
                    layoutId="nav-active-bg"
                    className="absolute inset-0 rounded-xl bg-(--color-active-bg) border border-(--color-active-border)"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}

                <span className="relative z-10 flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Right Side */}
        <div className="flex items-center gap-2">
          <ThemeToggle />

          <button
            onClick={() => setOpen(!open)}
            className="rounded-lg p-2 text-(--color-text) transition hover:bg-(--color-active-bg) md:hidden"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-t border-(--color-active-border) bg-(--color-bg) md:hidden"
          >
            <ul className="space-y-1 p-4">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);

                return (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={`flex items-center gap-3 rounded-xl p-3 font-medium transition ${
                        active
                          ? "bg-(--color-active-bg) text-(--color-active-text) border border-(--color-active-border)"
                          : "text-(--color-text) hover:bg-(--color-active-bg)"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
