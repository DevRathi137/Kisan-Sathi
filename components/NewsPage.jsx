"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Cloud, Thermometer, Droplets, Wind, ExternalLink } from "lucide-react";
import { useLang } from "@/context/LanguageContext";
import { useRegion } from "@/context/RegionContext";
import t from "@/context/translations";

const REGION_VIDEOS = {
  india: [
    { id: "JeU_EYFH1Jk", title: "Modern Farming Techniques" },
    { id: "6DSxsSbSWeM", title: "Smart Irrigation Methods" },
    { id: "52nHy0q40QA", title: "Crop Disease Detection" },
    { id: "ZOqfo3NNVb8", title: "Soil Health Management" },
  ],
  usa: [
    { id: "5_LgC6zBiP0", title: "Precision Agriculture in the US" },
    { id: "3lzoMR0YDXY", title: "Cover Crops and Soil Health" },
    { id: "Ks-_Mh1QhMc", title: "Sustainable Farming Practices" },
    { id: "9Q6sLbz7L9c", title: "Drone Technology in Farming" },
  ],
  europe: [
    { id: "JeU_EYFH1Jk", title: "European Sustainable Farming" },
    { id: "6DSxsSbSWeM", title: "Organic Farming in Europe" },
    { id: "52nHy0q40QA", title: "EU Agricultural Policy" },
    { id: "ZOqfo3NNVb8", title: "Climate-Smart Agriculture" },
  ],
  brazil: [
    { id: "JeU_EYFH1Jk", title: "Agribusiness in Brazil" },
    { id: "6DSxsSbSWeM", title: "Tropical Crop Management" },
    { id: "52nHy0q40QA", title: "Soybean Farming Techniques" },
    { id: "ZOqfo3NNVb8", title: "Sustainable Amazon Farming" },
  ],
  canada: [
    { id: "JeU_EYFH1Jk", title: "Canadian Prairie Farming" },
    { id: "6DSxsSbSWeM", title: "Canola Crop Management" },
    { id: "52nHy0q40QA", title: "Cold Climate Agriculture" },
    { id: "ZOqfo3NNVb8", title: "Precision Farming in Canada" },
  ],
};

const REGION_RESOURCES = {
  india: [
    { name: "Agriculture & Farmers' Welfare", link: "https://agricoop.nic.in/" },
    { name: "Fisheries, Animal Husbandry & Dairying", link: "https://dahd.nic.in/" },
    { name: "Chemicals and Fertilizers", link: "https://chemicals.nic.in/" },
    { name: "Food Processing Industries", link: "https://mofpi.nic.in/" },
    { name: "Environment, Forest & Climate Change", link: "https://moef.gov.in/" },
    { name: "Rural Development", link: "https://rural.nic.in/" },
    { name: "Commerce and Industry", link: "https://commerce.gov.in/" },
    { name: "Panchayati Raj", link: "https://panchayat.gov.in/" },
    { name: "Earth Sciences", link: "https://moes.gov.in/" },
    { name: "Textiles", link: "https://texmin.nic.in/" },
  ],
  usa: [
    { name: "USDA — Agriculture", link: "https://www.usda.gov/" },
    { name: "Farm Service Agency", link: "https://www.fsa.usda.gov/" },
    { name: "Natural Resources Conservation", link: "https://www.nrcs.usda.gov/" },
    { name: "Agricultural Research Service", link: "https://www.ars.usda.gov/" },
    { name: "Rural Development", link: "https://www.rd.usda.gov/" },
    { name: "Food Safety & Inspection", link: "https://www.fsis.usda.gov/" },
  ],
  europe: [
    { name: "EU Agriculture & Rural Development", link: "https://agriculture.ec.europa.eu/" },
    { name: "European Food Safety Authority", link: "https://www.efsa.europa.eu/" },
    { name: "EU Farm to Fork Strategy", link: "https://food.ec.europa.eu/horizontal-topics/farm-fork-strategy_en" },
    { name: "Eurostat — Agriculture", link: "https://ec.europa.eu/eurostat/web/agriculture" },
    { name: "EU Rural Development", link: "https://enrd.ec.europa.eu/" },
  ],
  brazil: [
    { name: "Ministry of Agriculture (MAPA)", link: "https://www.gov.br/agricultura/pt-br" },
    { name: "EMBRAPA — Agricultural Research", link: "https://www.embrapa.br/" },
    { name: "CONAB — Supply & Statistics", link: "https://www.conab.gov.br/" },
    { name: "ANA — Water Resources", link: "https://www.gov.br/ana/pt-br" },
  ],
  canada: [
    { name: "Agriculture & Agri-Food Canada", link: "https://agriculture.canada.ca/" },
    { name: "Canadian Food Inspection Agency", link: "https://inspection.canada.ca/" },
    { name: "Farm Credit Canada", link: "https://www.fcc-fac.ca/" },
    { name: "Grain Farmers of Ontario", link: "https://gfo.ca/" },
  ],
};

export default function NewsPage() {
  const [weather, setWeather] = useState(null);
  const [news, setNews]       = useState([]);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [newsLoading, setNewsLoading]       = useState(true);
  const [detectedCity, setDetectedCity]     = useState(null);
  const { lang } = useLang();
  const { region, regionData } = useRegion();
  const tx = t[lang];

  // Auto-detect location on first load, fall back to region city
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setWeatherLoading(true);
          fetch(`/api/weather?lat=${latitude}&lon=${longitude}`)
            .then((r) => r.json())
            .then((data) => {
              if (!data.error) {
                setWeather(data);
                setDetectedCity(data.name);
              } else {
                fetchByRegionCity();
              }
            })
            .catch(fetchByRegionCity)
            .finally(() => setWeatherLoading(false));
        },
        () => fetchByRegionCity(), // denied — use region city
        { timeout: 5000 }
      );
    } else {
      fetchByRegionCity();
    }
  }, [region]); // re-run when region changes

  function fetchByRegionCity() {
    setWeatherLoading(true);
    fetch(`/api/weather?city=${encodeURIComponent(regionData.city)}`)
      .then((r) => r.json())
      .then((data) => { setWeather(data.error ? null : data); setDetectedCity(null); })
      .catch(() => setWeather(null))
      .finally(() => setWeatherLoading(false));
  }

  useEffect(() => {
    setNewsLoading(true);
    fetch(`/api/news?region=${region}`)
      .then((r) => r.json())
      .then((data) => setNews(data.articles || []))
      .catch(() => setNews([]))
      .finally(() => setNewsLoading(false));
  }, [region]);

  const weatherCards = weather
    ? [
        { icon: Cloud,       label: tx.weather_condition, value: weather.weather[0].main,    color: "bg-blue-400"   },
        { icon: Thermometer, label: tx.weather_temp,      value: `${weather.main.temp}°C`,   color: "bg-orange-400" },
        { icon: Droplets,    label: tx.weather_humidity,  value: `${weather.main.humidity}%`, color: "bg-cyan-500"  },
        { icon: Wind,        label: tx.weather_wind,      value: `${weather.wind.speed} m/s`, color: "bg-green-500" },
      ]
    : [];

  const videos    = REGION_VIDEOS[region]    || REGION_VIDEOS.india;
  const resources = REGION_RESOURCES[region] || REGION_RESOURCES.india;

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
        <p className="text-green-400/80 text-sm mt-3 font-medium">{regionData.label}</p>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16 space-y-20">
        {/* Weather */}
        <section>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-black text-green-900 mb-2">{tx.weather_title}</h2>
            <p className="text-gray-500">{detectedCity || regionData.city}</p>
          </div>
          {weatherLoading ? (
            <div className="text-center text-gray-400 py-8">{tx.weather_loading}</div>
          ) : weather ? (
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
            <div className="text-center text-gray-400 py-8">Weather data unavailable.</div>
          )}
        </section>

        {/* News */}
        <section>
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-green-900 mb-2">{tx.news_section_title}</h2>
            <p className="text-gray-500">{tx.news_section_sub}</p>
          </div>
          {newsLoading ? (
            <div className="text-center text-gray-400 py-8">{tx.news_loading}</div>
          ) : news.length > 0 ? (
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
                      <img
                        src={article.urlToImage}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="text-sm font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-green-700 transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-xs text-gray-500 line-clamp-2 mb-3">{article.description}</p>
                    <span className="inline-flex items-center gap-1 text-xs text-green-600 font-semibold">
                      {tx.news_read_more} <ExternalLink className="w-3 h-3" />
                    </span>
                  </div>
                </motion.a>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-400 py-8">No news available at the moment.</div>
          )}
        </section>

        {/* Videos */}
        <section>
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-green-900 mb-2">{tx.videos_title}</h2>
            <p className="text-gray-500">{tx.videos_sub}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {videos.map((v, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="rounded-2xl overflow-hidden shadow-sm border border-gray-100 bg-black"
              >
                <div className="aspect-video">
                  <iframe
                    src={`https://www.youtube.com/embed/${v.id}`}
                    title={v.title}
                    className="w-full h-full"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <div className="p-3 bg-white">
                  <p className="text-xs font-semibold text-gray-700 truncate">{v.title}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Government Resources */}
        <section className="pb-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-green-900 mb-2">{tx.ministries_title}</h2>
            <p className="text-gray-500">{tx.ministries_sub}</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {resources.map((m, i) => (
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
                <p className="text-xs font-medium text-gray-700 group-hover:text-green-700 transition-colors leading-snug">
                  {m.name}
                </p>
              </motion.a>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
