import React, { useState, useEffect } from "react";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { Link as ScrollLink } from "react-scroll";
import { Menu, X, Leaf } from "lucide-react";

const navLinks = [
  { label: "Home", to: "/", type: "route" },
  { label: "About", to: "/about", type: "route" },
  { label: "News", to: "/news", type: "route" },
  { label: "Contact", to: "contactSection", type: "scroll" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#1e3320]/95 backdrop-blur-md shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <RouterLink to="/" className="flex items-center gap-2 group">
          <div className="bg-green-500 p-1.5 rounded-lg group-hover:bg-green-400 transition-colors">
            <Leaf className="w-5 h-5 text-white" />
          </div>
          <span className="text-white text-xl font-bold tracking-wide">
            Kisan<span className="text-green-400">Sathi</span>
          </span>
        </RouterLink>

        {/* Desktop Links */}
        <ul className="hidden md:flex items-center gap-8">
          {navLinks.map((link) =>
            link.type === "route" ? (
              <li key={link.label}>
                <RouterLink
                  to={link.to}
                  className={`text-sm font-medium transition-colors duration-200 relative group ${
                    location.pathname === link.to
                      ? "text-green-400"
                      : "text-white/80 hover:text-white"
                  }`}
                >
                  {link.label}
                  <span
                    className={`absolute -bottom-1 left-0 h-0.5 bg-green-400 transition-all duration-300 ${
                      location.pathname === link.to
                        ? "w-full"
                        : "w-0 group-hover:w-full"
                    }`}
                  />
                </RouterLink>
              </li>
            ) : (
              <li key={link.label}>
                <ScrollLink
                  to={link.to}
                  smooth
                  duration={500}
                  offset={-70}
                  className="text-sm font-medium text-white/80 hover:text-white cursor-pointer transition-colors duration-200 relative group"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 h-0.5 bg-green-400 w-0 group-hover:w-full transition-all duration-300" />
                </ScrollLink>
              </li>
            )
          )}
        </ul>

        {/* CTA Button */}
        <RouterLink
          to="/about"
          className="hidden md:inline-flex items-center gap-2 bg-green-500 hover:bg-green-400 text-white text-sm font-semibold px-5 py-2 rounded-full transition-all duration-200 shadow-md hover:shadow-green-500/30"
        >
          Get Started
        </RouterLink>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-white"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#1e3320]/98 backdrop-blur-md px-6 pb-6 space-y-4">
          {navLinks.map((link) =>
            link.type === "route" ? (
              <RouterLink
                key={link.label}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className="block text-white/80 hover:text-green-400 font-medium transition-colors"
              >
                {link.label}
              </RouterLink>
            ) : (
              <ScrollLink
                key={link.label}
                to={link.to}
                smooth
                duration={500}
                offset={-70}
                onClick={() => setMenuOpen(false)}
                className="block text-white/80 hover:text-green-400 font-medium cursor-pointer transition-colors"
              >
                {link.label}
              </ScrollLink>
            )
          )}
          <RouterLink
            to="/about"
            onClick={() => setMenuOpen(false)}
            className="block bg-green-500 text-white text-center font-semibold px-5 py-2 rounded-full"
          >
            Get Started
          </RouterLink>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
