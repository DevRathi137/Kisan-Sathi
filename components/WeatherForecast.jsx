"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Search, MapPin, Droplets, Wind, Thermometer, Eye, Cloud } from "lucide-react";
import { useLang } from "@/context/LanguageContext";

// Farming advice based on weather conditions
function getFarmingAdvice(dailyForecasts) {
  const totalRain   = dailyForecasts.reduce((s, d) => s + d.rain, 0);
  const avgTemp     = dailyForecasts.reduce((s, d) => s + d.temp, 0) / dailyForecasts.length;
  const maxWind     = Math.max(...dailyForecasts.map((d) => d.wind));
  const rainyDays   = dailyForecasts.filter((d) => d.rain > 2).length;

  const advice = [];

  if (totalRain > 100)
    advice.push({ type: "warning", text: "Heavy rainfall expected this week. Avoid sowing. Ensure field drainage is clear to prevent waterlogging." });
  else if (totalRain > 30)
    advice.push({ type: "good", text: "Moderate rainfall expected. Good conditions for land preparation and sowing Kharif crops." });
  else if (totalRain < 5)
    advice.push({ type: "info", text: "Dry week ahead. Plan irrigation accordingly. Good time for harvesting and threshing." });

  if (avgTemp > 38)
    advice.push({ type: "warning", text: "Very high temperatures expected. Irrigate crops in the early morning or evening to reduce evaporation." });
  else if (avgTemp < 12)
    advice.push({ type: "info", text: "Cool temperatures ahead. Good for Rabi crops like wheat and mustard. Protect seedlings from frost." });

  if (maxWind > 8)
    advice.push({ type: "warning", text: "Strong winds forecast. Avoid spraying pesticides or fertilizers. Stake tall crops to prevent lodging." });

  if (rainyDays >= 4)
    advice.push({ type: "info", text: "Frequent rain days this week. Watch for fungal diseases. Avoid applying fungicides before rain." });

  if (advice.length === 0)
    advice.push({ type: "good", text: "Favorable weather conditions this week. Good time for regular farm activities." });

  return advice;
}

// Group 3-hourly forecast into daily summaries
function groupByDay(forecastList) {
  const days = {};
  forecastList.forEach((item) => {
    const date = item.dt_txt.split(" ")[0];
    if (!days[date]) days[date] = [];
    days[date].push(item);
  });

  return Object.entries(days).slice(0, 5).map(([date, items]) => {
    const temps   = items.map((i) => i.main.temp);
    const rain    = items.reduce((s, i) => s + (i.rain?.["3h"] || 0), 0);
    const icon    = items[Math.floor(items.length / 2)].weather[0].icon;
    const desc    = items[Math.floor(items.length / 2)].weather[0].description;
    const wind    = Math.max(...items.map((i) => i.wind.speed));
    const humidity= Math.round(items.reduce((s, i) => s + i.main.humidity, 0) / items.length);

    return {
      date,
      tempMax: Math.round(Math.max(...temps)),
      tempMin: Math.round(Math.min(...temps)),
      temp:    Math.round(temps.reduce((a, b) => a + b) / temps.length),
      rain:    Math.round(rain * 10) / 10,
      icon,
      desc,
      wind:    Math.round(wind * 10) / 10,
      humidity,
    };
  });
}

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const ADVICE_COLORS = {
  warning: "bg-amber-50 border-amber-200 text-amber-800",
  good:    "bg-green-50 border-green-200 text-green-800",
  info:    "bg-blue-50 border-blue-200 text-blue-800",
};

export default function WeatherForecast() {
  const { lang } = useLang();
  const [query,    setQuery]    = useState("");
  const [data,     setData]     = useState(null);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");
  const [locating, setLocating] = useState(false);

  const fetchWeather = useCallback(async (params) => {
    setLoading(true);
    setError("");
    try {
      const qs = new URLSearchParams(params).toString();
      const res = await fetch(`/api/forecast?${qs}`);
      const json = await res.json();
      if (json.error) { setError(json.error); setData(null); }
      else setData(json);
    } catch {
      setError("Failed to fetch weather data.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-detect on mount
  useEffect(() => {
    if (navigator.geolocation) {
      setLocating(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocating(false);
          fetchWeather({ lat: pos.coords.latitude, lon: pos.coords.longitude });
        },
        () => {
          setLocating(false);
          fetchWeather({ city: "Bhopal" }); // fallback
        },
        { timeout: 6000 }
      );
    } else {
      fetchWeather({ city: "Bhopal" });
    }
  }, [fetchWeather]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) fetchWeather({ city: query.trim() });
  };

  const daily = data?.forecast?.list ? groupByDay(data.forecast.list) : [];
  const current = data?.current;
  const advice  = daily.length ? getFarmingAdvice(daily) : [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <div className="bg-[#2f4632] py-20 px-6 text-center">
        <span className="inline-block bg-green-500/20 text-green-300 text-sm font-semibold px-4 py-1.5 rounded-full mb-4 border border-green-500/30">
          {lang === "hi" ? "लाइव मौसम पूर्वानुमान" : "Live Weather Forecast"}
        </span>
        <h1 className="text-5xl font-black text-white mb-3 tracking-tight">
          {lang === "hi" ? "वर्षा" : "Rainfall"}{" "}
          <span className="text-green-400">{lang === "hi" ? "पूर्वानुमान" : "Prediction"}</span>
        </h1>
        <p className="text-white/60 text-lg max-w-xl mx-auto mb-8">
          {lang === "hi"
            ? "अपने गांव या शहर का 5 दिन का मौसम पूर्वानुमान देखें"
            : "5-day hyper-local weather forecast for your village or city"}
        </p>

        {/* Search bar */}
        <form onSubmit={handleSearch} className="max-w-lg mx-auto flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={lang === "hi" ? "शहर या गांव का नाम लिखें..." : "Enter city or village name..."}
              className="w-full pl-10 pr-4 py-3 rounded-full bg-white/10 border border-white/20 text-white placeholder-white/40 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:bg-white/20 transition-all"
            />
          </div>
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-400 text-white font-semibold px-6 py-3 rounded-full transition-all duration-200 text-sm"
          >
            {lang === "hi" ? "खोजें" : "Search"}
          </button>
          <button
            type="button"
            onClick={() => {
              setLocating(true);
              navigator.geolocation.getCurrentPosition(
                (pos) => { setLocating(false); fetchWeather({ lat: pos.coords.latitude, lon: pos.coords.longitude }); },
                () => setLocating(false)
              );
            }}
            title="Use my location"
            className="bg-white/10 hover:bg-white/20 border border-white/20 text-white p-3 rounded-full transition-all duration-200"
          >
            <MapPin className="w-4 h-4" />
          </button>
        </form>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12 space-y-10">
        {(loading || locating) && (
          <div className="text-center text-gray-400 py-16">
            {locating ? "Detecting your location..." : "Loading weather data..."}
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-6 text-center">
            {error === "Location not found"
              ? "Location not found. Please check the spelling and try again."
              : error}
          </div>
        )}

        {!loading && !locating && current && (
          <>
            {/* Current weather */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-[#2f4632] to-[#1a2e1c] rounded-3xl p-8 text-white"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <div className="flex items-center gap-2 text-green-400 text-sm font-semibold mb-2">
                    <MapPin className="w-4 h-4" />
                    {current.name}, {current.sys.country}
                  </div>
                  <div className="text-7xl font-black text-white">
                    {Math.round(current.main.temp)}°C
                  </div>
                  <div className="text-white/60 text-lg capitalize mt-1">
                    {current.weather[0].description}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: Thermometer, label: "Feels Like",  value: `${Math.round(current.main.feels_like)}°C` },
                    { icon: Droplets,   label: "Humidity",     value: `${current.main.humidity}%` },
                    { icon: Wind,       label: "Wind",         value: `${current.wind.speed} m/s` },
                    { icon: Eye,        label: "Visibility",   value: `${(current.visibility / 1000).toFixed(1)} km` },
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className="bg-white/10 rounded-2xl p-4 flex items-center gap-3">
                      <Icon className="w-5 h-5 text-green-400 shrink-0" />
                      <div>
                        <div className="text-white/50 text-xs">{label}</div>
                        <div className="text-white font-bold text-sm">{value}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* 5-day forecast */}
            {daily.length > 0 && (
              <div>
                <h2 className="text-2xl font-black text-green-900 mb-5">
                  {lang === "hi" ? "5 दिन का पूर्वानुमान" : "5-Day Forecast"}
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                  {daily.map((day, i) => {
                    const d    = new Date(day.date);
                    const name = i === 0 ? "Today" : DAY_NAMES[d.getDay()];
                    return (
                      <motion.div
                        key={day.date}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.08 }}
                        className={`bg-white rounded-2xl p-4 shadow-sm border text-center ${
                          i === 0 ? "border-green-300 ring-2 ring-green-200" : "border-gray-100"
                        }`}
                      >
                        <div className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">{name}</div>
                        <img
                          src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`}
                          alt={day.desc}
                          className="w-12 h-12 mx-auto"
                        />
                        <div className="text-lg font-black text-gray-800">{day.tempMax}°</div>
                        <div className="text-sm text-gray-400">{day.tempMin}°</div>
                        {day.rain > 0 && (
                          <div className="mt-2 flex items-center justify-center gap-1 text-blue-500 text-xs font-semibold">
                            <Droplets className="w-3 h-3" />
                            {day.rain} mm
                          </div>
                        )}
                        <div className="mt-1 text-gray-400 text-xs flex items-center justify-center gap-1">
                          <Wind className="w-3 h-3" />{day.wind} m/s
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Farming advice */}
            {advice.length > 0 && (
              <div>
                <h2 className="text-2xl font-black text-green-900 mb-5">
                  {lang === "hi" ? "खेती की सलाह" : "Farming Advice"}
                </h2>
                <div className="space-y-3">
                  {advice.map((a, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className={`border rounded-2xl px-5 py-4 text-sm font-medium ${ADVICE_COLORS[a.type]}`}
                    >
                      {a.text}
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
