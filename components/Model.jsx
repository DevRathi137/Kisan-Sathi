"use client";

import React from "react";
import { Element } from "react-scroll";
import { ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { useLang } from "@/context/LanguageContext";
import t from "@/context/translations";

const toolImages = [
  "/Crop.png",
  "/Water.png",
  "/Rainfall.png",
  "/Fertilizer.png",
];
const toolPaths = [
  "https://kisan-sathi.streamlit.app",
  "http://localhost:8505",
  "http://localhost:8504",
  "http://localhost:8502",
];

const Model = () => {
  const { lang } = useLang();
  const tx = t[lang];

  const tools = [
    { title: tx.tool1_title, desc: tx.tool1_desc, tag: tx.tool1_tag, image: toolImages[0], path: toolPaths[0] },
    { title: tx.tool2_title, desc: tx.tool2_desc, tag: tx.tool2_tag, image: toolImages[1], path: toolPaths[1] },
    { title: tx.tool3_title, desc: tx.tool3_desc, tag: tx.tool3_tag, image: toolImages[2], path: toolPaths[2] },
    { title: tx.tool4_title, desc: tx.tool4_desc, tag: tx.tool4_tag, image: toolImages[3], path: toolPaths[3] },
  ];

  return (
    <Element name="toolsSection">
      <section className="bg-gradient-to-b from-[#1a2e1c] to-[#2f4632] py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block bg-green-500/20 text-green-400 text-sm font-semibold px-4 py-1.5 rounded-full mb-4 border border-green-500/30">
              {tx.tools_badge}
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
              {tx.tools_title}
            </h2>
            <p className="text-white/60 text-lg max-w-2xl mx-auto">{tx.tools_desc}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {tools.map((tool, index) => (
              <motion.a
                key={index}
                href={tool.path}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group relative bg-white/5 border border-white/10 rounded-3xl overflow-hidden hover:border-green-500/50 hover:bg-white/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-green-900/30"
              >
                <div className="h-52 overflow-hidden">
                  <img src={tool.image} alt={tool.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 h-52 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
                <span className="absolute top-4 left-4 bg-green-500/90 text-white text-xs font-semibold px-3 py-1 rounded-full backdrop-blur-sm">
                  {tool.tag}
                </span>
                <div className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-green-400 transition-colors">{tool.title}</h3>
                      <p className="text-white/60 text-sm leading-relaxed">{tool.desc}</p>
                    </div>
                    <div className="shrink-0 bg-green-500/20 group-hover:bg-green-500 p-2.5 rounded-xl transition-colors duration-300">
                      <ExternalLink className="w-4 h-4 text-green-400 group-hover:text-white transition-colors" />
                    </div>
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>
    </Element>
  );
};

export default Model;
