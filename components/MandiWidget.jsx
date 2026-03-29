"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, TrendingDown, Minus, Search, RefreshCw } from "lucide-react";
import { useLang } from "@/context/LanguageContext";

const STATES = [
  "Madhya Pradesh", "Uttar Pradesh", "Punjab", "Haryana", "Maharashtra",
  "Rajasthan", "Gujarat", "Karnataka", "Tamil Nadu", "Andhra Pradesh",
  "West Bengal", "Bihar", "Odisha", "Telangana", "Chhattisgarh",
];

const POPULAR_CROPS = [
  "Wheat", "Rice", "Maize", "Soyabean", "Cotton", "Onion",
  "Potato", "Tomato", "Mustard", "Groundnut", "Chickpea", "Arhar",
];

function PriceTrend({ modal, min, max }) {
  const mid = (parseFloat(min) + parseFloat(max)) / 2;
  const val = parseFloat(modal);
  if (val > mid * 1.05) return <TrendingUp className="w-4 h-4 text-green-400" />;
  if (val < mid * 0.95) return <TrendingDown className="w-4 h-4 text-red-400" />;
  return <Minus className="w-4 h-4 text-yellow-400" />;
}

export default function MandiWidget() {
  const { lang } = useLang();
  const [state,     setState]     = useState("Madhya Pradesh");
  const [commodity, setCommodity] = useState("");
  const [search,    setSearch]    = useState("");
  const [records,   setRecords]   = useState([]);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchPrices = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({ state, limit: "50" });
      if (commodity) params.set("commodity", commodity);
      const res  = await fetch(`/api/mandi?${params}`);
      const data = await res.json();
      if (data.error) { setError(data.error); setRecords([]); }
      else { setRecords(data.records || []); setLastUpdated(new Date()); }
    } catch {
      setError("Failed to fetch mandi prices.");
    } finally {
      setLoading(false);
    }
  }, [state, commodity]);

  useEffect(() => { fetchPrices(); }, [fetchPrices]);

  const filtered = records.filter((r) =>
    !search || r.commodity?.toLowerCase().includes(search.toLowerCase()) ||
    r.market?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#2f4632] to-[#3d6b42] px-6 py-5">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h3 className="text-white font-black text-xl">
              {lang === "hi" ? "मंडी भाव" : "Mandi Prices"}
            </h3>
            <p className="text-white/50 text-xs mt-0.5">
              {lastUpdated
                ? `${lang === "hi" ? "अपडेट:" : "Updated:"} ${lastUpdated.toLocaleTimeString()}`
                : lang === "hi" ? "लाइव बाजार भाव" : "Live market rates"}
            </p>
          </div>
          <button
            onClick={fetchPrices}
            disabled={loading}
            className="flex items-center gap-2 bg-white/15 hover:bg-white/25 text-white text-xs font-semibold px-3 py-1.5 rounded-full transition-all border border-white/20"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            {lang === "hi" ? "रिफ्रेश" : "Refresh"}
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mt-4">
          <select
            value={state}
            onChange={(e) => setState(e.target.value)}
            className="bg-white/10 border border-white/20 text-white text-xs font-medium px-3 py-1.5 rounded-full focus:outline-none focus:ring-2 focus:ring-green-400 appearance-none cursor-pointer"
          >
            {STATES.map((s) => <option key={s} value={s} className="text-gray-800">{s}</option>)}
          </select>

          <select
            value={commodity}
            onChange={(e) => setCommodity(e.target.value)}
            className="bg-white/10 border border-white/20 text-white text-xs font-medium px-3 py-1.5 rounded-full focus:outline-none focus:ring-2 focus:ring-green-400 appearance-none cursor-pointer"
          >
            <option value="" className="text-gray-800">{lang === "hi" ? "सभी फसलें" : "All Crops"}</option>
            {POPULAR_CROPS.map((c) => <option key={c} value={c} className="text-gray-800">{c}</option>)}
          </select>

          <div className="relative flex-1 min-w-[140px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-white/40" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={lang === "hi" ? "फसल या मंडी खोजें..." : "Search crop or market..."}
              className="w-full pl-8 pr-3 py-1.5 bg-white/10 border border-white/20 text-white placeholder-white/40 text-xs rounded-full focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>
        </div>
      </div>

      {/* Scrollable table */}
      <div className="overflow-x-auto">
        <div className="overflow-y-auto max-h-[420px]">
          {loading ? (
          <div className="py-16 text-center text-gray-400 text-sm">
            {lang === "hi" ? "भाव लोड हो रहे हैं..." : "Loading prices..."}
          </div>
        ) : error ? (
          <div className="py-12 text-center">
            <p className="text-red-500 text-sm font-medium mb-2">{error}</p>
            <p className="text-gray-400 text-xs max-w-xs mx-auto">
              {lang === "hi"
                ? "API key सेट नहीं है। data.gov.in से key लें।"
                : "API key not configured. Get a free key from data.gov.in and add DATAGOV_API_KEY to your environment variables."}
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-12 text-center text-gray-400 text-sm">
            {lang === "hi" ? "कोई डेटा नहीं मिला" : "No data found"}
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="sticky top-0 z-10">
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">
                  {lang === "hi" ? "फसल" : "Commodity"}
                </th>
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide hidden sm:table-cell">
                  {lang === "hi" ? "मंडी" : "Market"}
                </th>
                <th className="text-right px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">
                  {lang === "hi" ? "न्यूनतम" : "Min"}
                </th>
                <th className="text-right px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">
                  {lang === "hi" ? "अधिकतम" : "Max"}
                </th>
                <th className="text-right px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">
                  {lang === "hi" ? "मॉडल भाव" : "Modal"}
                </th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filtered.map((r, i) => (
                  <motion.tr
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="border-b border-gray-50 hover:bg-green-50/50 transition-colors"
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <PriceTrend modal={r.modal_price} min={r.min_price} max={r.max_price} />
                        <span className="font-semibold text-gray-800">{r.commodity}</span>
                      </div>
                      <div className="text-xs text-gray-400 mt-0.5">{r.variety || ""}</div>
                    </td>
                    <td className="px-4 py-3.5 hidden sm:table-cell">
                      <div className="text-gray-600 text-xs">{r.market}</div>
                      <div className="text-gray-400 text-xs">{r.district}</div>
                    </td>
                    <td className="px-4 py-3.5 text-right text-gray-500 text-xs">
                      ₹{Number(r.min_price).toLocaleString("en-IN")}
                    </td>
                    <td className="px-4 py-3.5 text-right text-gray-500 text-xs">
                      ₹{Number(r.max_price).toLocaleString("en-IN")}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <span className="font-black text-green-700 text-base">
                        ₹{Number(r.modal_price).toLocaleString("en-IN")}
                      </span>
                      <div className="text-gray-400 text-xs">/quintal</div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        )}
        </div>
      </div>

      {/* Footer note */}
      {filtered.length > 0 && (
        <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
          <p className="text-gray-400 text-xs">
            {lang === "hi"
              ? `${filtered.length} रिकॉर्ड • स्रोत: AGMARKNET / data.gov.in`
              : `${filtered.length} records • Source: AGMARKNET / data.gov.in`}
          </p>
          <a
            href="https://agmarknet.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-600 hover:text-green-700 text-xs font-semibold transition-colors"
          >
            {lang === "hi" ? "पूरा डेटा देखें" : "View full data"}
          </a>
        </div>
      )}
    </div>
  );
}
