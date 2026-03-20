"use client";

import React from "react";
import { Element } from "react-scroll";
import Link from "next/link";
import { useLang } from "@/context/LanguageContext";
import t from "@/context/translations";

const Footer = () => {
  const { lang } = useLang();
  const tx = t[lang];

  const links = [
    { label: tx.nav_home, to: "/" },
    { label: tx.nav_about, to: "/about" },
    { label: tx.news_title + " " + tx.news_title2, to: "/news" },
  ];

  return (
    <Element name="contactSection">
      <footer className="bg-[#1a2e1c] text-white">
        <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl font-black tracking-tight leading-none">
                <span className="text-[#f5f0e8]">क</span><span className="text-[#7dba95]">S</span>
              </span>
              <span className="text-xl font-bold">
                Kisan<span className="text-green-400">Sathi</span>
              </span>
            </div>
            <p className="text-white/60 text-sm leading-relaxed mb-4">{tx.footer_desc}</p>
            <p className="text-white/40 text-xs">{tx.footer_fact}</p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white/80 uppercase tracking-widest mb-5">
              {tx.footer_links_title}
            </h4>
            <ul className="space-y-3">
              {links.map((link) => (
                <li key={link.to}>
                  <Link href={link.to} className="text-white/60 hover:text-green-400 text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Form */}
          <div>
            <h4 className="text-sm font-semibold text-white/80 uppercase tracking-widest mb-5">
              {tx.footer_contact_title}
            </h4>
            <form action="https://formspree.io/f/xnnpwvrw" method="POST" className="space-y-3">
              <input
                type="text" name="name" placeholder={tx.footer_name_placeholder} required
                className="w-full px-4 py-2.5 rounded-xl bg-white/10 text-white placeholder-white/40 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 border border-white/10"
              />
              <input
                type="email" name="email" placeholder={tx.footer_email_placeholder} required
                className="w-full px-4 py-2.5 rounded-xl bg-white/10 text-white placeholder-white/40 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 border border-white/10"
              />
              <textarea
                name="message" placeholder={tx.footer_message_placeholder} rows={3}
                className="w-full px-4 py-2.5 rounded-xl bg-white/10 text-white placeholder-white/40 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 border border-white/10 resize-none"
              />
              <button type="submit" className="w-full bg-green-500 hover:bg-green-400 text-white font-semibold py-2.5 rounded-xl transition-colors duration-200 text-sm">
                {tx.footer_send}
              </button>
            </form>
          </div>
        </div>

        {/* Map */}
        <div className="max-w-7xl mx-auto px-6 pb-10">
          <div className="rounded-2xl overflow-hidden border border-white/10 h-56">
            <iframe
              title="VIT Bhopal University"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14718.929350938146!2d76.847101!3d23.077385!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x397c427603e6b049%3A0xf4494c4891bb4813!2sVIT%20Bhopal%20University!5e0!3m2!1sen!2sin!4v1641637741234!5m2!1sen!2sin"
              width="100%" height="100%" style={{ border: 0 }}
              allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 px-6 py-5">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-3 text-sm text-white/40">
            <p>&copy; {new Date().getFullYear()} {tx.footer_copy}</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white/70 transition-colors">{tx.footer_privacy}</a>
              <a href="#" className="hover:text-white/70 transition-colors">{tx.footer_terms}</a>
            </div>
          </div>
        </div>
      </footer>
    </Element>
  );
};

export default Footer;
