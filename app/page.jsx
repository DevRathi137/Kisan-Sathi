import HeroSection from "@/components/HeroSection";
import Model from "@/components/Model";
import HomeAboutStrip from "@/components/HomeAboutStrip";

export const metadata = {
  title: "KisanSathi — AI-Powered Smart Agriculture",
  description:
    "Use AI to get crop recommendations, predict rainfall, manage water, and get fertilizer guidance — built for Indian farmers.",
};

export default function Home() {
  return (
    <>
      <HeroSection />
      <Model />
      <HomeAboutStrip />
    </>
  );
}
