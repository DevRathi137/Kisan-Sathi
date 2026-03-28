"use client";

import { createContext, useContext, useState, useEffect } from "react";

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState("en");

  useEffect(() => {
    const saved = localStorage.getItem("ks_lang");
    if (saved === "en" || saved === "hi") setLang(saved);
  }, []);

  const toggle = () => {
    setLang((l) => {
      const next = l === "en" ? "hi" : "en";
      localStorage.setItem("ks_lang", next);
      return next;
    });
  };

  return (
    <LanguageContext.Provider value={{ lang, toggle }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLang = () => useContext(LanguageContext);
