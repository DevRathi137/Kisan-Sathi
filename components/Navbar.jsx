"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Link as ScrollLink } from "react-scroll";
import { Menu, X } from "lucide-react";
import { useLang } from "@/context/LanguageContext";

const navLinks = [
  { en: "Home",    hi: "होम",     to: "/",      type: "route"  },
  { en: "About",   hi: "परिचय",   to: "/about", type: "route"  },
  { en: "News",    hi: "समाचार",  to: "/news",  type: "route"  },
  { en: "Contact", hi: "संपर्क",  to: "contactSection", type: "scroll" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const { lang, toggle } = useLang();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-[#1e3320]/95 backdrop-blur-md shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-2xl font-black tracking-tight leading-none">
            <span className="text-[#f5f0e8]">क</span><span className="text-[#7dba95]">S</span>
          </span>
          <span className="text-white text-xl font-bold tracking-wide">
            Kisan<span className="text-green-400">Sathi</span>
          </span>
        </Link>

        <ul className="hidden md:flex items-center gap-8">
          {navLinks.map((link) =>
            link.type === "route" ? (
              <li key={link.en}>
                <Link
                  href={link.to}
                  className={`text-sm font-medium transition-colors duration-200 relative group ${
                    pathname === link.to ? "text-green-400" : "text-white/80 hover:text-white"
                  }`}
                >
                  {lang === "en" ? link.en : link.hi}
                  <span
                    className={`absolute -bottom-1 left-0 h-0.5 bg-green-400 transition-all duration-300 ${
                      pathname === link.to ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  />
                </Link>
              </li>
            ) : (
              <li key={link.en}>
                <ScrollLink
                  to={link.to}
                  smooth
                  duration={500}
                  offset={-70}
                  className="text-sm font-medium text-white/80 hover:text-white cursor-pointer transition-colors duration-200 relative group"
                >
                  {lang === "en" ? link.en : link.hi}
                  <span className="absolute -bottom-1 left-0 h-0.5 bg-green-400 w-0 group-hover:w-full transition-all duration-300" />
                </ScrollLink>
              </li>
            )
          )}
        </ul>

        {/* Language toggle + CTA */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={toggle}
            className="flex items-center gap-1 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-semibold px-3 py-1.5 rounded-full transition-all duration-200"
          >
            <span className={lang === "hi" ? "text-green-400" : "text-white/50"}>अ</span>
            <span className="text-white/30">/</span>
            <span className={lang === "en" ? "text-green-400" : "text-white/50"}>A</span>
          </button>
          <Link
            href="/about"
            className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-400 text-white text-sm font-semibold px-5 py-2 rounded-full transition-all duration-200 shadow-md hover:shadow-green-500/30"
          >
            {lang === "en" ? "Get Started" : "शुरू करें"}
          </Link>
        </div>

        <button
          className="md:hidden text-white"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-[#1e3320]/98 backdrop-blur-md px-6 pb-6 space-y-4">
          {navLinks.map((link) =>
            link.type === "route" ? (
              <Link
                key={link.en}
                href={link.to}
                onClick={() => setMenuOpen(false)}
                className="block text-white/80 hover:text-green-400 font-medium transition-colors"
              >
                {lang === "en" ? link.en : link.hi}
              </Link>
            ) : (
              <ScrollLink
                key={link.en}
                to={link.to}
                smooth
                duration={500}
                offset={-70}
                onClick={() => setMenuOpen(false)}
                className="block text-white/80 hover:text-green-400 font-medium cursor-pointer transition-colors"
              >
                {lang === "en" ? link.en : link.hi}
              </ScrollLink>
            )
          )}
          <div className="flex items-center gap-3 pt-1">
            <button
              onClick={toggle}
              className="flex items-center gap-1 bg-white/10 border border-white/20 text-white text-xs font-semibold px-3 py-1.5 rounded-full"
            >
              <span className={lang === "hi" ? "text-green-400" : "text-white/50"}>अ</span>
              <span className="text-white/30">/</span>
              <span className={lang === "en" ? "text-green-400" : "text-white/50"}>A</span>
            </button>
            <Link
              href="/about"
              onClick={() => setMenuOpen(false)}
              className="flex-1 bg-green-500 text-white text-center font-semibold px-5 py-2 rounded-full"
            >
              {lang === "en" ? "Get Started" : "शुरू करें"}
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
