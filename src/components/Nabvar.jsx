// import React from "react";
// import { Link } from 'react-router-dom';

// const Navbar = () => {
//   return (
//     <nav className="bg-[#2f4632] text-white px-12 py-4 flex items-center">
//       {/* Logo */}
//       <div className="ml-[90px] text-3xl font-semibold tracking-wide">Kisan Sathi</div>

//       {/* Nav Links */}
//       <ul className="flex gap-10 ml-[750px] text-sm font-light ">
//         {[
//           "Home",
//           "About Us",
//           "Our Team",
//           "Contact Us",
//         ].map((item, index) => (
//           <li
//             key={index}
//             className="relative group cursor-pointer transition-colors duration-200 font-medium"
//           >
//             {item}
//             <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-yellow-400 transition-all duration-300 group-hover:w-full"></span>
//           </li>
//         ))}
//       </ul>
//     </nav>
//   );
// };

// export default Navbar;

import React from "react";
import { Link as ScrollLink } from "react-scroll";
import { Link as RouterLink, useLocation } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-[#2f4632] text-white px-12 py-4 flex items-center">
      <div className="ml-[90px] text-3xl font-semibold tracking-wide">
        Kisan Sathi
      </div>

      <ul className="flex gap-10 ml-[700px] text-sm font-light">
        <li className="relative group cursor-pointer transition-colors duration-200 font-medium">
          <RouterLink to="/" className="hover:text-yellow-400">
            Home
            <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-yellow-400 transition-all duration-300 group-hover:w-full"></span>
          </RouterLink>
        </li>
        <li className="relative group cursor-pointer transition-colors duration-200 font-medium">
          <RouterLink to="/about" className="hover:text-yellow-400">
            About Us
            <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-yellow-400 transition-all duration-300 group-hover:w-full"></span>
          </RouterLink>
        </li>
        <li className="relative group cursor-pointer transition-colors duration-200 font-medium">
          <RouterLink to="/team" className="hover:text-yellow-400">
            Our Team
            <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-yellow-400 transition-all duration-300 group-hover:w-full"></span>
          </RouterLink>
        </li>
        <li className="relative group cursor-pointer transition-colors duration-200 font-medium">
          <RouterLink to="/news" className="hover:text-yellow-400">
            News
            <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-yellow-400 transition-all duration-300 group-hover:w-full"></span>
          </RouterLink>
        </li>
        <li className="relative group cursor-pointer transition-colors duration-200 font-medium">
          <ScrollLink
            to="contactSection"
            smooth={true}
            duration={500}
            offset={-50}
            className="hover:text-yellow-400 cursor-pointer"
          >
            Contact Us
            <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-yellow-400 transition-all duration-300 group-hover:w-full"></span>
          </ScrollLink>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
