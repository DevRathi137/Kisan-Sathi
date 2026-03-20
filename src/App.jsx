import "./App.css";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Nabvar";
import HeroSection from "./components/HeroSecation";
import Model from "./components/Model";
import Footer from "./components/Footer";
import AboutUs from "./components/AboutUs";
import NewsPage from "./components/NewsPage";

const Home = () => (
  <>
    <HeroSection />
    <Model />
  </>
);

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/news" element={<NewsPage />} />
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;
