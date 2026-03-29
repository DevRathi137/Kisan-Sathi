"use client";

import React, { useState } from "react";
import { Element } from "react-scroll";
import { ArrowUpRight, Sprout, Droplets, CloudRain, FlaskConical } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useLang } from "@/context/LanguageContext";
import t from "@/context/translations";

const toolPaths = [
  { url: "https://kisan-sathi.streamlit.app",                           internal: false },
  { url: "https://kisan-sathi-water.streamlit.app",                     internal: false },
  { url: "/weather",                                                     internal: true  },
  { url: "https://kisan-sathi-fertilizer-recommendation.streamlit.app", internal: false },
];

const toolIcons  = [Sprout, Droplets, CloudRain, FlaskConical];
const toolColors = [
  { bg: "bg-emerald-500/15", icon: "text-emerald-400", border: "border-emerald-500/30", glow: "hover:shadow-emerald-900/40" },
  { bg: "bg-blue-500/15",    icon: "text-blue-400",    border: "border-blue-500/30",    glow: "hover:shadow-blue-900/40"    },
  { bg: "bg-violet-500/15",  icon: "text-violet-400",  border: "border-violet-500/30",  glow: "hover:shadow-violet-900/40"  },
  { bg: "bg-amber-500/15",   icon: "text-amber-400",   border: "border-amber-500/30",   glow: "hover:shadow-amber-900/40"   },
];

const Model = () => {
  const { lang } = useLang();
  const tx = t[lang];
  const [hovered, setHovered] = useState(null);

  const tools = [
    { title: tx.tool1_title, desc: tx.tool1_desc, tag: tx.tool1_tag, ...toolPaths[0] },
    { title: tx.tool2_title, desc: tx.tool2_desc, tag: tx.tool2_tag, ...toolPaths[1] },
    { title: tx.tool3_title, desc: tx.tool3_desc, tag: tx.tool3_tag, ...toolPaths[2] },
    { title: tx.tool4_title, desc: tx.tool4_desc, tag: tx.tool4_tag, ...toolPaths[3] },
  ];

  return (
    <Element name="toolsSection">
      <section className="relative bg-[#111d12] py-28 px-6 overflow-hidden">

        {/* Subtle background grid */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)", backgroundSize: "60px 60px" }}
        />

        <div className="relative max-w-7xl mx-auto">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              <div>
                <span className="inline-block bg-green-500/15 text-green-400 text-xs font-bold px-4 py-1.5 rounded-full mb-5 border border-green-500/25 tracking-widest uppercase">
                  {tx.tools_badge}
                </span>
                <h2 className="text-5xl md:text-6xl font-black text-white tracking-tight leading-none">
                  {tx.tools_title.split(" ")[0]}<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300">
                    {tx.tools_title.split(" ").slice(1).join(" ")}
                  </span>
                </h2>
              </div>
              <p className="text-white/40 text-base max-w-sm leading-relaxed md:text-right">
                {tx.tools_desc}
              </p>
            </div>
          </motion.div>

          {/* Tool cards — horizontal list layout */}
          <div className="space-y-4">
            {tools.map((tool, i) => {
              const Icon  = toolIcons[i];
              const color = toolColors[i];
              const isHovered = hovered === i;

              const inner = (
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  viewport={{ once: true }}
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                  className={`group flex items-center gap-6 md:gap-10 p-6 md:p-8 rounded-2xl border transition-all duration-300 cursor-pointer
                    ${isHovered
                      ? `bg-white/8 border-white/20 -translate-y-0.5 shadow-2xl ${color.glow}`
                      : "bg-white/3 border-white/8 hover:bg-white/6"
                    }`}
                >
                  {/* Number */}
                  <div className="hidden sm:flex shrink-0 w-10 text-right">
                    <span className="text-white/15 text-4xl font-black tabular-nums leading-none">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>

                  {/* Icon */}
                  <div className={`shrink-0 w-14 h-14 rounded-2xl ${color.bg} border ${color.border} flex items-center justify-center transition-transform duration-300 ${isHovered ? "scale-110" : ""}`}>
                    <Icon className={`w-6 h-6 ${color.icon}`} />
                  </div>

                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1.5">
                      <h3 className={`text-lg md:text-xl font-bold text-white transition-colors duration-200 ${isHovered ? color.icon : ""}`}>
                        {tool.title}
                      </h3>
                      <span className={`hidden md:inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full ${color.bg} ${color.icon} border ${color.border}`}>
                        {tool.tag}
                      </span>
                    </div>
                    <p className="text-white/45 text-sm leading-relaxed line-clamp-2">{tool.desc}</p>
                  </div>

                  {/* Arrow */}
                  <div className={`shrink-0 w-10 h-10 rounded-xl border flex items-center justify-center transition-all duration-300
                    ${isHovered ? `${color.bg} ${color.border} ${color.icon}` : "border-white/10 text-white/20"}`}>
                    <ArrowUpRight className={`w-5 h-5 transition-transform duration-300 ${isHovered ? "translate-x-0.5 -translate-y-0.5" : ""}`} />
                  </div>
                </motion.div>
              );

              return tool.internal ? (
                <Link key={i} href={tool.url}>{inner}</Link>
              ) : (
                <a key={i} href={tool.url} target="_blank" rel="noopener noreferrer">{inner}</a>
              );
            })}
          </div>
        </div>
      </section>
    </Element>
  );
};

export default Model;
