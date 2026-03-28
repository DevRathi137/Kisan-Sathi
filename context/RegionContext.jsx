"use client";

import { createContext, useContext, useState, useEffect } from "react";

export const REGIONS = {
  india:  { label: "India",  city: "Bhopal",    flag: "IN" },
  usa:    { label: "USA",    city: "New York",   flag: "US" },
  europe: { label: "Europe", city: "London",     flag: "EU" },
  brazil: { label: "Brazil", city: "Brasilia",   flag: "BR" },
  canada: { label: "Canada", city: "Ottawa",     flag: "CA" },
};

const RegionContext = createContext();

export const RegionProvider = ({ children }) => {
  const [region, setRegion] = useState("india");

  useEffect(() => {
    const saved = localStorage.getItem("ks_region");
    if (saved && REGIONS[saved]) setRegion(saved);
  }, []);

  const changeRegion = (r) => {
    setRegion(r);
    localStorage.setItem("ks_region", r);
  };

  return (
    <RegionContext.Provider value={{ region, changeRegion, regionData: REGIONS[region] }}>
      {children}
    </RegionContext.Provider>
  );
};

export const useRegion = () => useContext(RegionContext);
