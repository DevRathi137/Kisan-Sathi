"use client";

import React from "react";
import { Typewriter } from "react-simple-typewriter";
import Link from "next/link";
import { Link as ScrollLink } from "react-scroll";
import { ArrowRight, ChevronDown } from "lucide-react";
import { useLang } from "@/context/LanguageContext";
import t from "@/context/translations";

const HeroSection = () => {
  const { lang } = useLang();
  const tx = t[lang];

  const stats = [
    { value: "4+",   label: tx.hero_stat1_label },
    { value: "10K+", label: tx.hero_stat2_label },
    { value: "98%",  label: tx.hero_stat3_label },
  ];

  return (
    <div
      className="relative w-full min-h-screen flex flex-col justify-center items-center text-white text-center px-6 bg-cover bg-center"
      style={{ backgroundImage: `url("/Hero.png")` }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70 z-0" />

      <div className="relative z-10 max-w-4xl mx-auto">
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
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 cursor-pointer animate-bounce text-white/50 hover:text-white transition-colors"
      >
        <ChevronDown className="w-7 h-7" />
      </ScrollLink>
    </div>
  );
};

export default HeroSection;
