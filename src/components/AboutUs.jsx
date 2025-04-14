// import React from "react";
// import { Card, CardContent } from "../components/ui/card";
// import { motion } from "framer-motion";


// const AboutUs = () => {
//   return (
//     <div className="min-h-screen bg-green-50 py-12 px-6 lg:px-20">
//       <div className="text-center mb-12">
//         <h1 className="text-4xl font-bold text-green-900 mb-4">About Kisan Sathi</h1>
//         <p className="text-lg text-gray-700 max-w-3xl mx-auto">
//           Empowering Farmers with Smart Solutions for a Sustainable Future
//         </p>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
//         <motion.div
//           initial={{ opacity: 0, x: -50 }}
//           animate={{ opacity: 1, x: 0 }}
//           transition={{ duration: 1 }}
//         >
//           <img src="/farm0.jpg" alt="Farming" className="rounded-2xl shadow-lg w-full h-auto" />

//         </motion.div>

//         <motion.div
//           initial={{ opacity: 0, x: 50 }}
//           animate={{ opacity: 1, x: 0 }}
//           transition={{ duration: 1 }}
//         >
//           <Card className="bg-white shadow-xl rounded-2xl">
//             <CardContent className="p-6 text-gray-800 text-justify text-base leading-relaxed">
//               Agriculture is the backbone of food security. Yet, farmers face challenges
//               like unpredictable weather, inefficient resource allocation, and lack of
//               timely agricultural information. Kisan Sathi bridges this gap by integrating
//               modern technology into traditional farming practices.
//               <br /><br />
//               From disease detection and crop suggestion to real-time data from sensors,
//               Kisan Sathi supports smarter decisions. Our tools analyze plant health,
//               soil fertility, and provide effective fertilization and irrigation
//               techniques. The platform is intuitive, multilingual, and affordable,
//               ensuring inclusivity for all farmers.
//               <br /><br />
//               We emphasize sustainability through features like environmental footprint
//               analysis and promotion of green farming methods. Our mission is to equip
//               farmers to reduce risks, conserve resources, and adopt environmentally
//               friendly practices.
//             </CardContent>
//           </Card>
//         </motion.div>
//       </div>
//     </div>
//   );
// };

// export default AboutUs;

// *-------------------------------------------------------------------*
// *----------------------------AboutUs.jsx-----------------------------*

import React from "react";
import { Card, CardContent } from "../components/ui/card";
import { motion } from "framer-motion";
import { Tractor, Droplet, Leaf, Sprout } from "lucide-react";

const features = [
  { icon: <Sprout className="w-8 h-8 text-green-600" />, title: "Crop Suggestion", desc: "Smart crop planning based on soil & climate." },
  { icon: <Droplet className="w-8 h-8 text-green-600" />, title: "Irrigation Advice", desc: "Efficient water use with real-time guidance." },
  { icon: <Leaf className="w-8 h-8 text-green-600" />, title: "Green Farming", desc: "Promoting eco-friendly agricultural practices." },
  { icon: <Tractor className="w-8 h-8 text-green-600" />, title: "Sensor Data", desc: "Live soil & environment analytics for precision." },
];

const testimonials = [
  {
    name: "Ramesh Yadav",
    text: "Kisan Sathi ne meri kheti mein naye rang bhar diye. Ab main behtar faisle le pata hoon.",
    village: "Ashta, MP",
  },
  {
    name: "Sunita Devi",
    text: "Mujhe app ki madad se apne khet ke liye sahi fasal chunne mein bahut madad mili.",
    village: "Sehore, MP",
  },
];

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 py-16 px-6 lg:px-24">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-extrabold text-green-900 mb-4 tracking-tight">
          About <span className="text-green-600">Kisan Sathi</span>
        </h1>
        <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
          Empowering Farmers with <span className="text-green-600 font-semibold">Smart Solutions</span> for a Sustainable Future
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center mb-20">
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <img
            src="/farm0.jpg"
            alt="Farming"
            className="rounded-3xl shadow-2xl w-full h-auto transform hover:scale-105 transition duration-500 ease-in-out"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 60 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <Card className="bg-white shadow-2xl rounded-3xl border border-green-100">
            <CardContent className="p-8 text-gray-800 text-justify text-lg leading-8 space-y-4">
              <p>
                <span className="font-semibold text-green-700">Agriculture</span> is the backbone of food security. Yet, farmers face challenges
                like unpredictable weather, inefficient resource allocation, and lack of
                timely agricultural information.
              </p>
              <p>
                <span className="font-semibold text-green-700">Kisan Sathi</span> bridges this gap by integrating modern technology into traditional
                farming practices—supporting smarter, data-driven decisions.
              </p>
              <p>
                From disease detection and crop suggestion to real-time data from sensors,
                our tools analyze plant health, soil fertility, and offer optimized
                fertilization and irrigation techniques.
              </p>
              <p>
                The platform is <span className="text-green-600 font-medium">intuitive</span>, <span className="text-green-600 font-medium">multilingual</span>, and <span className="text-green-600 font-medium">affordable</span>,
                ensuring inclusivity for all farmers.
              </p>
              <p>
                We emphasize <span className="font-semibold text-green-700">sustainability</span> through environmental footprint analysis
                and promotion of eco-friendly methods, helping farmers reduce risks and
                adopt sustainable practices for future generations.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Features Section */}
      <div className="mb-20">
        <h2 className="text-3xl font-bold text-green-800 text-center mb-10">Key Features</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white p-6 rounded-2xl shadow-lg text-center"
            >
              <div className="mb-4 flex justify-center">{feature.icon}</div>
              <h3 className="text-lg font-semibold text-green-700 mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-600">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="mb-20">
        <h2 className="text-3xl font-bold text-green-800 text-center mb-10">What Farmers Say</h2>
        <div className="flex flex-col md:flex-row gap-8 justify-center max-w-4xl mx-auto">
          {testimonials.map((t, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="bg-white border border-green-100 p-6 rounded-2xl shadow-md max-w-sm"
            >
              <p className="italic text-gray-700 mb-4">“{t.text}”</p>
              <div className="text-green-700 font-semibold">{t.name}</div>
              <div className="text-sm text-gray-500">{t.village}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="text-center mt-16">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-green-600 hover:bg-green-700 text-white text-lg font-semibold py-3 px-8 rounded-full shadow-lg transition"
        >
          Join the Movement
        </motion.button>
      </div>
    </div>
  );
};

export default AboutUs;


