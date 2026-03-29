"use client";

import React from "react";
import { Element } from "react-scroll";
import { ExternalLink, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useLang } from "@/context/LanguageContext";
import t from "@/context/translations";

const toolImages = ["/Crop.png", "/Water.png", "/Rainfall.png", "/Fertilizer.png"];

const toolPaths = [
  { url: "https://kisan-sathi.streamlit.app",                           internal: false },
  { url: "https://kisan-sathi-water.streamlit.app",                     internal: false },
  { url: "/weather",                                                     internal: true  },
  { url: "https://kisan-sathi-fertilizer-recommendation.streamlit.app", internal: false },
];

const Model = () => {
  const { lang } = useLang();
  const tx = t[lang];

  const tools = [
    { title: tx.tool1_title, desc: tx.tool1_desc, tag: tx.tool1_tag, image: toolImages[0], ...toolPaths[0] },
    { title: tx.tool2_title, desc: tx.tool2_desc, tag: tx.tool2_tag, image: toolImages[1], ...toolPaths[1] },
    { title: tx.tool3_title, desc: tx.tool3_desc, tag: tx.tool3_tag, image: toolImages[2], ...toolPaths[2] },
    { title: tx.tool4_title, desc: tx.tool4_desc, tag: tx.tool4_tag, image: toolImages[3], ...toolPaths[3] },
  ];

  const featured = tools[0];
  const rest     = tools.slice(1);

  const cardInner = (tool, large = false) => (
    <>
      <div className={`${large ? "h-72" : "h-44"} overflow-hidden`}>
        <img
          src={tool.image} alt={tool.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      </div>
      <span className="absolute top-4 left-4 bg-green-500/90 text-white text-xs font-semibold px-3 py-1 rounded-full backdrop-blur-sm">
        {tool.tag}
      </span>
      <div className={`p-6 ${large ? "p-8" : ""}`}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className={`font-bold text-white mb-2 group-hover:text-green-400 transition-colors ${large ? "text-2xl" : "text-lg"}`}>
              {tool.title}
            </h3>
            <p className="text-white/60 text-sm leading-relaxed">{tool.desc}</p>
          </div>
          <div className="shrink-0 bg-green-500/20 group-hover:bg-green-500 p-2.5 rounded-xl transition-all duration-300 group-hover:scale-110">
            <ExternalLink className="w-4 h-4 text-green-400 group-hover:text-white transition-colors" />
          </div>
        </div>
        {large && (
          <div className="mt-4 inline-flex items-center gap-2 text-green-400 text-sm font-semibold group-hover:gap-3 transition-all duration-200">
            {lang === "en" ? "Try it now" : "अभी आज़माएं"} <ArrowRight className="w-4 h-4" />
          </div>
        )}
      </div>
    </>
  );

  const cardClass = (large = false) =>
    `group relative bg-white/5 border border-white/10 rounded-3xl overflow-hidden
     hover:border-green-500/40 hover:bg-white/8 transition-all duration-300
     hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-green-900/40
     ${large ? "md:col-span-2" : ""}`;

  const wrapCard = (tool, node, index, large = false) =>
    tool.internal ? (
      <Link key={index} href={tool.url} className={cardClass(large)}>{node}</Link>
    ) : (
      <a key={index} href={tool.url} target="_blank" rel="noopener noreferrer" className={cardClass(large)}>{node}</a>
    );

  return (
    <Element name="toolsSection">
      {/* Fix #3 — alternating bg: dark section */}
      <section className="bg-gradient-to-b from-[#1a2e1c] to-[#243d27] py-28 px-6">
        <div className="max-w-7xl mx-auto">

          {/* Section header with scroll animation — Fix #6 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block bg-green-500/20 text-green-400 text-sm font-semibold px-4 py-1.5 rounded-full mb-4 border border-green-500/30">
              {tx.tools_badge}
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
              {tx.tools_title}
            </h2>
            <p className="text-white/60 text-lg max-w-2xl mx-auto">{tx.tools_desc}</p>
          </motion.div>

          {/* Fix #2 — featured first card spans full width on md+ */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Featured card */}
            <motion.div
              className="md:col-span-2"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              {wrapCard(featured, cardInner(featured, true), 0, false)}
            </motion.div>

            {/* Remaining 3 cards */}
            {rest.map((tool, i) => (
              <motion.div
                key={i + 1}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                viewport={{ once: true }}
              >
                {wrapCard(tool, cardInner(tool), i + 1)}
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </Element>
  );
};

export default Model;
