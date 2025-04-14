import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import "./NewsPage.css";

export default function NewsPage() {
  const [weather, setWeather] = useState(null);
  const [news, setNews] = useState([]);
  const [currentVideo, setCurrentVideo] = useState(0);

  const videoLinks = [
    "https://www.youtube.com/embed/JeU_EYFH1Jk",
    "https://www.youtube.com/embed/6DSxsSbSWeM",
    "https://www.youtube.com/embed/52nHy0q40QA",
    "https://www.youtube.com/embed/ZOqfo3NNVb8",
  ];

  // const ministries = [
  //   {
  //     name: "Agriculture & Farmers' Welfare",
  //     link: "https://agricoop.nic.in/",
  //     icon: "🌾",
  //   },
  //   {
  //     name: "Fisheries, Animal Husbandry and Dairying",
  //     link: "https://dahd.nic.in/",
  //     icon: "🐄",
  //   },
  //   {
  //     name: "Chemicals and Fertilizers",
  //     link: "https://chemicals.nic.in/",
  //     icon: "🧪",
  //   },
  //   {
  //     name: "Food Processing Industries",
  //     link: "https://mofpi.nic.in/",
  //     icon: "🥫",
  //   },
  //   {
  //     name: "Environment, Forest and Climate Change",
  //     link: "https://moef.gov.in/",
  //     icon: "🌳",
  //   },
  //   { name: "Rural Development", link: "https://rural.nic.in/", icon: "🏘️" },
  //   {
  //     name: "Commerce and Industry",
  //     link: "https://commerce.gov.in/",
  //     icon: "🏭",
  //   },
  //   { name: "Panchayati Raj", link: "https://panchayat.gov.in/", icon: "🏡" },
  //   { name: "Earth Sciences", link: "https://moes.gov.in/", icon: "🌍" },
  //   { name: "Textiles", link: "https://texmin.nic.in/", icon: "🧵" },
  // ];

  const ministries = [
    {
      name: "Agriculture & Farmers' Welfare",
      link: "https://agricoop.nic.in/",
    },
    {
      name: "Fisheries, Animal Husbandry and Dairying",
      link: "https://dahd.nic.in/",
    },
    {
      name: "Chemicals and Fertilizers",
      link: "https://chemicals.nic.in/",
    },
    {
      name: "Food Processing Industries",
      link: "https://mofpi.nic.in/",
    },
    {
      name: "Environment, Forest and Climate Change",
      link: "https://moef.gov.in/",
    },
    { name: "Rural Development", link: "https://rural.nic.in/" },
    { name: "Commerce and Industry", link: "https://commerce.gov.in/" },
    { name: "Panchayati Raj", link: "https://panchayat.gov.in/" },
    { name: "Earth Sciences", link: "https://moes.gov.in/" },
    { name: "Textiles", link: "https://texmin.nic.in/" },
  ];

  const fadeUp = {
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0 },
  };

  const handlePrev = () => {
    setCurrentVideo((prev) => (prev === 0 ? videoLinks.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentVideo((prev) => (prev === videoLinks.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    axios
      .get(
        "https://api.openweathermap.org/data/2.5/weather?q=Bhopal&appid=***REMOVED***&units=metric"
      )
      .then((res) => setWeather(res.data));

    axios
      .get(
        "https://newsapi.org/v2/everything?q=indian%20farmers&apiKey=***REMOVED***&pageSize=4&sortBy=publishedAt&language=en"
      )
      .then((res) => setNews(res.data.articles));
  }, []);

  return (
    <div className="news-page">
      <motion.h1
              className="text-5xl font-black text-center text-green-900 mb-16"
              initial="initial"
              whileInView="animate"
              variants={fadeUp}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
      >
        KisanSathi <span className="text-green-600">News & Weather</span>
      
      </motion.h1>

      {/* WEATHER SECTION */}
      <div className="weather-section">
        <h2 className="font-bold">Weather Update - Bhopal</h2>
        {weather ? (
          <div className="weather-grid">
            <div className="weather-card sun">
              <div className="icon sun-icon"></div>
              <p>{weather.weather[0].main}</p>
            </div>
            <div className="weather-card">
              <div className="icon temp-icon"></div>
              <p>{weather.main.temp}°C</p>
            </div>
            <div className="weather-card">
              <div className="icon humidity-icon"></div>
              <p>Humidity: {weather.main.humidity}%</p>
            </div>
            <div className="weather-card">
              <div className="icon wind-icon"></div>
              <p>Wind: {weather.wind.speed} m/s</p>
            </div>
          </div>
        ) : (
          <p>Loading weather...</p>
        )}
      </div>

      {/* NEWS SECTION */}
      <div className="news-section">
        <h2 className="text-4xl font-extrabold text-green-900 mb-4 text-center tracking-tight py-5">
          Latest Farmer News
        </h2>

        <div className="news-cards">
          {news.length > 0 ? (
            news.map((article, index) => (
              <div className="news-card" key={index}>
                <img src={article.urlToImage} alt="news" />
                <div className="news-content">
                  <h3>{article.title}</h3>
                  <p>{article.description}</p>
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Read More
                  </a>
                </div>
              </div>
            ))
          ) : (
            <p>Loading news...</p>
          )}
        </div>
      </div>

      {/* YOUTUBE VIDEO */}
      {/* <div className="video-section">
        <h2>Featured Videos</h2>
        <div className="video-carousel">
          <button className="carousel-btn prev" onClick={handlePrev}>‹</button>

          <div className="video-track">
            {videoLinks.map((link, index) => (
              <div
                key={index}
                className={`video-slide ${index === currentVideo ? "active" : "inactive"}`}
              >
                <iframe
                  src={link}
                  title={`YouTube Video ${index}`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            ))}
          </div>

          <button className="carousel-btn next" onClick={handleNext}>›</button>
        </div>
      </div> */}
      <div className="video-section">
        <h2 className="text-4xl font-extrabold text-green-800 mb-4 text-center tracking-tight">
          Featured Videos
        </h2>
        <div className="video-carousel">
          <div className="video-card">
            <iframe
              src="https://www.youtube.com/embed/JeU_EYFH1Jk"
              allowFullScreen
              title="video1"
            ></iframe>
          </div>
          <div className="video-card">
            <iframe
              src="https://www.youtube.com/embed/JeU_EYFH1Jk"
              allowFullScreen
              title="video2"
            ></iframe>
          </div>
          <div className="video-card">
            <iframe
              src="https://www.youtube.com/embed/JeU_EYFH1Jk"
              allowFullScreen
              title="video3"
            ></iframe>
          </div>
          <div className="video-card">
            <iframe
              src="https://www.youtube.com/embed/JeU_EYFH1Jk"
              allowFullScreen
              title="video4"
            ></iframe>
          </div>
          <div className="video-card">
            <iframe
              src="https://www.youtube.com/embed/JeU_EYFH1Jk"
              allowFullScreen
              title="video4"
            ></iframe>
          </div>
        </div>
      </div>

      {/* MINISTRY LINKS */}
      {/* <div className="ministry-section">
        <h2 className="text-4xl font-extrabold text-green-700 mb-4 text-center tracking-tight">Ministries Supporting Indian Farmers</h2>
        <div className="ministry-grid redesigned">
          {[
            {
              name: "Agriculture & Farmers' Welfare",
              link: "https://agricoop.nic.in/",
            },
            {
              name: "Fisheries, Animal Husbandry and Dairying",
              link: "https://dahd.nic.in/",
            },
            {
              name: "Chemicals and Fertilizers",
              link: "https://chemicals.nic.in/",
            },
            {
              name: "Food Processing Industries",
              link: "https://mofpi.nic.in/",
            },
            {
              name: "Environment, Forest and Climate Change",
              link: "https://moef.gov.in/",
            },
            { name: "Rural Development", link: "https://rural.nic.in/" },
            { name: "Commerce and Industry", link: "https://commerce.gov.in/" },
            { name: "Panchayati Raj", link: "https://panchayat.gov.in/" },
            { name: "Earth Sciences", link: "https://moes.gov.in/" },
            { name: "Textiles", link: "https://texmin.nic.in/" },
          ].map((ministry, index) => (
            <a
              key={index}
              href={ministry.link}
              target="_blank"
              rel="noopener noreferrer"
              className="ministry-card redesigned"
            >
              <div className="ministry-icon">🏛️</div>
              <div className="ministry-name">{ministry.name}</div>
            </a>
          ))}
        </div>
      </div> */}

      <div className="mb-20">
        <h2 className="text-3xl font-bold text-green-800 text-center mb-10">
          Ministries Supporting Indian Farmers
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {ministries.map((ministry, index) => (
            <motion.a
              key={index}
              href={ministry.link}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-shadow text-center flex flex-col items-center"
            >
              <div className="text-3xl mb-4">🏛️</div>
              <h3 className="text-black  text-base text-center">
                {ministry.name}
              </h3>
            </motion.a>
          ))}
        </div>
      </div>
    </div>
  );
}
