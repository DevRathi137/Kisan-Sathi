"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sprout, Droplet, Leaf, Tractor } from "lucide-react";
import Link from "next/link";
import { useLang } from "@/context/LanguageContext";
import t from "@/context/translations";

const icons = [Sprout, Droplet, Leaf, Tractor];

export default function HomeAboutStrip() {
  const { lang } = useLang();
  const tx = t[lang];

  const features = [
    { icon: icons[0], title: tx.feat1_title, desc: tx.feat1_desc },
    { icon: icons[1], title: tx.feat2_title, desc: tx.feat2_desc },
    { icon: icons[2], title: tx.feat3_title, desc: tx.feat3_desc },
    { icon: icons[3], title: tx.feat4_title, desc: tx.feat4_desc },
  ];

  return (
    // Fix #3 — light section after dark tools section creates visual rhythm
    <section className="bg-gradient-to-b from-[#f0f7f0] to-white py-28 px-6">
      <div className="max-w-7xl mx-auto">

        {/* Fix #6 — fade-up on scroll */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block bg-green-100 text-green-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-4 border border-green-200">
            {lang === "en" ? "Why KisanSathi" : "क्यों किसानसाथी"}
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-green-900 mb-4 tracking-tight">
            {tx.features_title}
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">{tx.features_sub}</p>
        </motion.div>

        {/* Fix #1 — more vertical breathing room, better mobile padding */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="bg-white border border-green-100 p-8 rounded-3xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 text-center group"
            >
              <div className="inline-flex items-center justify-center w-14 h-14 bg-green-50 rounded-2xl mb-5 group-hover:bg-green-100 group-hover:scale-110 transition-all duration-300">
                <f.icon className="w-7 h-7 text-green-600" />
              </div>
              <h3 className="text-base font-bold text-green-800 mb-2">{f.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* CTA strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-[#2f4632] rounded-3xl px-10 py-12 flex flex-col md:flex-row items-center justify-between gap-8"
        >
          <div>
            <h3 className="text-2xl md:text-3xl font-black text-white mb-2">
              {lang === "en" ? "Ready to farm smarter?" : "स्मार्ट खेती के लिए तैयार हैं?"}
            </h3>
            <p className="text-white/60 text-base">
              {lang === "en"
                ? "Explore all four AI tools — free, no sign-up required."
                : "चारों AI टूल्स आज़माएं — मुफ्त, कोई साइन-अप नहीं।"}
            </p>
          </div>
          <Link
            href="/about"
            className="shrink-0 inline-flex items-center gap-2 bg-green-500 hover:bg-green-400 text-white font-semibold px-8 py-3.5 rounded-full transition-all duration-200 shadow-lg hover:shadow-green-500/30 hover:-translate-y-0.5"
          >
            {lang === "en" ? "Learn More" : "और जानें"}
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
