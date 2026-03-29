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
    { label: tx.nav_home,  to: "/"      },
    { label: tx.nav_about, to: "/about" },
    { label: tx.nav_news,  to: "/news"  },
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
            <blockquote className="border-l-2 border-green-500/50 pl-3 mb-6">
              <p className="text-white/40 text-xs italic leading-relaxed">{tx.footer_fact}</p>
            </blockquote>
            <div className="flex items-center gap-3">
              <a
                href="https://github.com/DevRathi137/Kisan-Sathi"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/10 text-white/60 hover:text-white text-xs font-semibold px-3 py-1.5 rounded-full transition-all duration-200"
              >
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12" />
                </svg>
                GitHub
              </a>
              {/* <span className="text-white/20 text-xs">Built with Next.js &amp; AI</span> */}
            </div>
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
              <button
                type="submit"
                className="w-full bg-green-500 hover:bg-green-400 text-white font-semibold py-2.5 rounded-xl transition-colors duration-200 text-sm"
              >
                {tx.footer_send}
              </button>
            </form>
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
