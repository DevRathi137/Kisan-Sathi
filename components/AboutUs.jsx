"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sprout, Droplet, Leaf, Tractor, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useLang } from "@/context/LanguageContext";
import t from "@/context/translations";

const AboutUs = () => {
  const { lang } = useLang();
  const tx = t[lang];

  const features = [
    { icon: <Sprout className="w-6 h-6 text-green-500" />, title: tx.feat1_title, desc: tx.feat1_desc },
    { icon: <Droplet className="w-6 h-6 text-green-500" />, title: tx.feat2_title, desc: tx.feat2_desc },
    { icon: <Leaf   className="w-6 h-6 text-green-500" />, title: tx.feat3_title, desc: tx.feat3_desc },
    { icon: <Tractor className="w-6 h-6 text-green-500" />, title: tx.feat4_title, desc: tx.feat4_desc },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <div className="relative bg-[#2f4632] py-24 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=1920&q=85')] bg-cover bg-center" />
        <div className="relative z-10 max-w-3xl mx-auto">
          <span className="inline-block bg-green-500/20 text-green-300 text-sm font-semibold px-4 py-1.5 rounded-full mb-4 border border-green-500/30">
            {tx.about_badge}
          </span>
          <h1 className="text-5xl font-black text-white mb-4 tracking-tight">
            {tx.about_title} <span className="text-green-400">KisanSathi</span>
          </h1>
          <p className="text-white/70 text-lg leading-relaxed">{tx.about_subtitle}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            <img src="/farm0.jpg" alt="Agriculture field" className="rounded-3xl shadow-2xl w-full h-auto object-cover" />
            <div className="absolute -bottom-6 -right-6 bg-green-500 text-white rounded-2xl px-6 py-4 shadow-xl hidden md:block">
              <div className="text-3xl font-black">4+</div>
              <div className="text-sm font-medium opacity-90">{tx.about_stat_label}</div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="border-l-4 border-green-500 pl-5">
              <h2 className="text-4xl font-black text-green-900 tracking-tight">{tx.about_h2}</h2>
            </div>
            <p className="text-gray-600 text-lg leading-relaxed">{tx.about_p1}</p>
            <p className="text-gray-600 text-lg leading-relaxed">{tx.about_p2}</p>
            <p className="text-gray-600 text-lg leading-relaxed">
              {lang === "en" ? "The platform is " : "यह प्लेटफ़ॉर्म "}
              <span className="text-green-600 font-semibold">{tx.about_p3_i1}</span>
              {lang === "en" ? ", " : ", "}
              <span className="text-green-600 font-semibold">{tx.about_p3_i2}</span>
              {lang === "en" ? ", and " : " और "}
              <span className="text-green-600 font-semibold">{tx.about_p3_i3}</span>
              {lang === "en" ? " — built to be inclusive for every farmer." : " है — हर किसान के लिए समावेशी।"}
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white font-semibold px-6 py-3 rounded-full transition-all duration-200 shadow-md hover:shadow-green-500/30 hover:-translate-y-0.5"
            >
              {tx.about_cta} <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>

        {/* Features */}
        <div className="mb-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-green-900 mb-3">{tx.features_title}</h2>
            <p className="text-gray-500 max-w-xl mx-auto">{tx.features_sub}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-white border border-green-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow text-center group"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-green-50 rounded-xl mb-4 group-hover:bg-green-100 transition-colors">
                  {f.icon}
                </div>
                <h3 className="text-base font-bold text-green-800 mb-1">{f.title}</h3>
                <p className="text-sm text-gray-500">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Mission Statement — replaces fake testimonials */}
        <div className="bg-[#2f4632] rounded-3xl p-12 text-center max-w-4xl mx-auto">
          <h2 className="text-3xl font-black text-white mb-4">{tx.mission_title}</h2>
          <p className="text-white/70 text-lg leading-relaxed max-w-2xl mx-auto">{tx.mission_text}</p>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
