"use client";

import React, { useState, useEffect } from "react";
import { Typewriter } from "react-simple-typewriter";
import Link from "next/link";
import { Link as ScrollLink } from "react-scroll";
import { ArrowRight, ChevronDown } from "lucide-react";
import { useLang } from "@/context/LanguageContext";
import t from "@/context/translations";

const SLIDES = [
  // Lush green rice paddy terraces — dramatic, cinematic
  "https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=1920&q=85",
  // Indian farmer working in field — authentic, human
  "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=1920&q=85",
  // Aerial view of green crop rows — scale and precision
  "https://images.unsplash.com/photo-1560493676-04071c5f467b?w=1920&q=85",
  // Golden wheat field at sunset — warm, aspirational
  "https://images.unsplash.com/photo-1543257580-7269da773bf5?w=1920&q=85",
  // Close-up of hands holding soil/seeds — grounded, emotional
  "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1920&q=85",
];

const INTERVAL = 5000;

const HeroSection = () => {
  const { lang } = useLang();
  const tx = t[lang];
  const [current, setCurrent] = useState(0);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((c) => (c + 1) % SLIDES.length);
    }, INTERVAL);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const stats = [
    { value: "4",   label: tx.hero_stat1_label },
    { value: "99%", label: tx.hero_stat3_label },
  ];

  const parallaxOffset = scrollY * 0.4;

  return (
    <div className="relative w-full min-h-screen flex flex-col justify-center items-center text-white text-center px-6 overflow-hidden">

      {/* Slide layers */}
      {SLIDES.map((url, i) => (
        <div
          key={i}
          aria-hidden="true"
          className="absolute inset-0 bg-cover bg-center will-change-transform"
          style={{
            backgroundImage: `url("${url}")`,
            opacity: i === current ? 1 : 0,
            transition: "opacity 1.2s ease-in-out",
            transform: `translateY(${parallaxOffset}px) scale(1.15)`,
            zIndex: 0,
            animation: i === current ? "kenburns 6s ease-out forwards" : "none",
          }}
        />
      ))}

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/45 to-black/75 z-10" />

      {/* Dot indicators */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            aria-label={`Slide ${i + 1}`}
            className={`rounded-full transition-all duration-500 ${
              i === current
                ? "w-6 h-2 bg-green-400"
                : "w-2 h-2 bg-white/30 hover:bg-white/60"
            }`}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-20 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-green-500/20 border border-green-400/40 text-green-300 text-sm font-medium px-4 py-1.5 rounded-full mb-6 backdrop-blur-sm">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          {tx.hero_badge}
        </div>

        <h1 className="text-5xl md:text-7xl font-black mb-4 leading-tight tracking-tight">
          {tx.hero_title}{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300">
            KisanSathi
          </span>
        </h1>

        <p className="text-xl md:text-2xl font-light text-white/80 mb-3">
          {tx.hero_sub}
          <span className="text-green-400 font-semibold">
            <Typewriter
              key={lang}
              words={tx.hero_typewriter}
              loop={0}
              cursor
              cursorStyle="|"
              typeSpeed={70}
              deleteSpeed={50}
              delaySpeed={1800}
            />
          </span>
        </p>

        <p className="text-white/60 text-base md:text-lg max-w-2xl mx-auto mb-10">
          {tx.hero_desc}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <ScrollLink
            to="toolsSection"
            smooth
            duration={600}
            offset={-70}
            className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-400 text-white font-semibold px-8 py-3.5 rounded-full transition-all duration-200 shadow-lg hover:shadow-green-500/40 cursor-pointer"
          >
            {tx.hero_cta_primary} <ArrowRight className="w-4 h-4" />
          </ScrollLink>
          <Link
            href="/about"
            className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold px-8 py-3.5 rounded-full backdrop-blur-sm transition-all duration-200"
          >
            {tx.hero_cta_secondary}
          </Link>
        </div>

        <div className="flex flex-wrap justify-center gap-10">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-3xl font-black text-green-400">{s.value}</div>
              <div className="text-white/60 text-sm mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <ScrollLink
        to="toolsSection"
        smooth
        duration={600}
        offset={-70}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 cursor-pointer animate-bounce text-white/50 hover:text-white transition-colors"
      >
        <ChevronDown className="w-7 h-7" />
      </ScrollLink>

      <style>{`
        @keyframes kenburns {
          from { transform: translateY(${parallaxOffset}px) scale(1.15); }
          to   { transform: translateY(${parallaxOffset}px) scale(1.22); }
        }
      `}</style>
    </div>
  );
};

export default HeroSection;
