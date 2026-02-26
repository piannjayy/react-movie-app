import React from "react";
import { useTheme } from "../context/ThemeContext";
import { Github, Instagram, Twitter, Youtube, Film } from "lucide-react";

const Footer = () => {
  const { theme } = useTheme();

  return (
    <footer
      className={`mt-20 border-t transition-all duration-500 ${
        theme === "dark"
          ? "bg-gradient-to-b from-gray-950 via-gray-900 to-black border-gray-800 text-gray-300"
          : "bg-gradient-to-b from-white via-gray-50 to-gray-100 border-gray-200 text-gray-800"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left Section */}
        <div className="flex items-center gap-3">
          <Film className="w-6 h-6 text-purple-500" />
          <span className="text-lg font-semibold tracking-wide">ETAS MOVIE</span>
        </div>

        {/* Center Navigation */}
        <nav className="flex flex-wrap justify-center gap-6 text-sm font-medium opacity-80">
          <a href="/" className="hover:text-purple-500 transition-colors">
            Home
          </a>
          <a href="/favorite" className="hover:text-purple-500 transition-colors">
            Favorites
          </a>
          <a href="/search" className="hover:text-purple-500 transition-colors">
            Search
          </a>
        </nav>

        {/* Right Social Links */}
        <div className="flex items-center gap-5">
          {[Twitter, Github, Instagram, Youtube].map((Icon, i) => (
            <a
              key={i}
              href="#"
              className="hover:text-purple-500 transition-transform transform hover:scale-110"
            >
              <Icon className="w-5 h-5" />
            </a>
          ))}
        </div>
      </div>

      {/* Bottom Line */}
      <div
        className={`border-t ${
          theme === "dark" ? "border-gray-800" : "border-gray-300"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between text-xs opacity-70">
          <p>© {new Date().getFullYear()} ETAS MOVIE. All rights reserved.</p>
          <p>Made with React & TailwindCSS</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
