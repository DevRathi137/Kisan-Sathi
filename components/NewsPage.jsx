"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Cloud, Thermometer, Droplets, Wind, ExternalLink } from "lucide-react";
import { useLang } from "@/context/LanguageContext";
import t from "@/context/translations";

const videoLinks = [
  { id: "JeU_EYFH1Jk", title: "Modern Farming Techniques" },
  { id: "6DSxsSbSWeM", title: "Smart Irrigation" },
  { id: "52nHy0q40QA", title: "Crop Disease Detection" },
  { id: "ZOqfo3NNVb8", title: "Soil Health Management" },
];

const ministries = [
  { name: "Agriculture & Farmers' Welfare", link: "https://agricoop.nic.in/", icon: "🌾" },
  { name: "Fisheries, Animal Husbandry & Dairying", link: "https://dahd.nic.in/", icon: "🐄" },
  { name: "Chemicals and Fertilizers", link: "https://chemicals.nic.in/", icon: "🧪" },
  { name: "Food Processing Industries", link: "https://mofpi.nic.in/", icon: "🥫" },
  { name: "Environment, Forest & Climate Change", link: "https://moef.gov.in/", icon: "🌳" },
  { name: "Rural Development", link: "https://rural.nic.in/", icon: "🏘️" },
  { name: "Commerce and Industry", link: "https://commerce.gov.in/", icon: "🏭" },
  { name: "Panchayati Raj", link: "https://panchayat.gov.in/", icon: "🏡" },
  { name: "Earth Sciences", link: "https://moes.gov.in/", icon: "🌍" },
  { name: "Textiles", link: "https://texmin.nic.in/", icon: "🧵" },
];

export default function NewsPage() {
  const [weather, setWeather] = useState(null);
  const [news, setNews] = useState([]);
  const { lang } = useLang();
  const tx = t[lang];

  useEffect(() => {
    axios
      .get("https://api.openweathermap.org/data/2.5/weather?q=Bhopal&appid=***REMOVED***&units=metric")
      .then((res) => setWeather(res.data))
      .catch(() => {});
    axios
      .get("https://newsapi.org/v2/everything?q=indian%20farmers&apiKey=***REMOVED***&pageSize=4&sortBy=publishedAt&language=en")
      .then((res) => setNews(res.data.articles || []))
      .catch(() => {});
  }, []);

  const weatherCards = weather
    ? [
        { icon: Cloud,        label: tx.weather_condition, value: weather.weather[0].main,        color: "bg-blue-400"   },
        { icon: Thermometer,  label: tx.weather_temp,      value: `${weather.main.temp}°C`,        color: "bg-orange-400" },
        { icon: Droplets,     label: tx.weather_humidity,  value: `${weather.main.humidity}%`,     color: "bg-cyan-500"   },
        { icon: Wind,         label: tx.weather_wind,      value: `${weather.wind.speed} m/s`,     color: "bg-green-500"  },
      ]
    : [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Header */}
      <div className="bg-[#2f4632] py-20 px-6 text-center">
        <span className="inline-block bg-green-500/20 text-green-300 text-sm font-semibold px-4 py-1.5 rounded-full mb-4 border border-green-500/30">
          {tx.news_badge}
        </span>
        <h1 className="text-5xl font-black text-white mb-3 tracking-tight">
          {tx.news_title} <span className="text-green-400">{tx.news_title2}</span>
        </h1>
        <p className="text-white/60 text-lg max-w-xl mx-auto">{tx.news_subtitle}</p>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16 space-y-20">
        {/* Weather */}
        <section>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-black text-green-900 mb-2">{tx.weather_title}</h2>
            <p className="text-gray-500">{tx.weather_sub}</p>
          </div>
          {weather ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {weatherCards.map(({ icon: Icon, label, value, color }) => (
                <div key={label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${color}`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">{label}</p>
                    <p className="text-xl font-bold text-gray-800">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-400 py-8">{tx.weather_loading}</div>
          )}
        </section>

        {/* News */}
        <section>
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-green-900 mb-2">{tx.news_section_title}</h2>
            <p className="text-gray-500">{tx.news_section_sub}</p>
          </div>
          {news.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {news.map((article, i) => (
                <motion.a
                  key={i}
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                >
                  {article.urlToImage && (
                    <div className="h-44 overflow-hidden">
                      <img src={article.urlToImage} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="text-sm font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-green-700 transition-colors">{article.title}</h3>
                    <p className="text-xs text-gray-500 line-clamp-2 mb-3">{article.description}</p>
                    <span className="inline-flex items-center gap-1 text-xs text-green-600 font-semibold">
                      {tx.news_read_more} <ExternalLink className="w-3 h-3" />
                    </span>
                  </div>
                </motion.a>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-400 py-8">{tx.news_loading}</div>
          )}
        </section>

        {/* Videos */}
        <section>
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-green-900 mb-2">{tx.videos_title}</h2>
            <p className="text-gray-500">{tx.videos_sub}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {videoLinks.map((v, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="rounded-2xl overflow-hidden shadow-sm border border-gray-100 bg-black"
              >
                <div className="aspect-video">
                  <iframe src={`https://www.youtube.com/embed/${v.id}`} title={v.title} className="w-full h-full" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
                </div>
                <div className="p-3 bg-white">
                  <p className="text-xs font-semibold text-gray-700 truncate">{v.title}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Ministries */}
        <section className="pb-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-green-900 mb-2">{tx.ministries_title}</h2>
            <p className="text-gray-500">{tx.ministries_sub}</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {ministries.map((m, i) => (
              <motion.a
                key={i}
                href={m.link}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                viewport={{ once: true }}
                className="bg-white border border-green-100 p-4 rounded-2xl shadow-sm hover:shadow-md hover:border-green-300 transition-all text-center group"
              >
                <div className="text-3xl mb-2">{m.icon}</div>
                <p className="text-xs font-medium text-gray-700 group-hover:text-green-700 transition-colors leading-snug">{m.name}</p>
              </motion.a>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
