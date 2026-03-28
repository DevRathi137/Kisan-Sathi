import WeatherForecast from "@/components/WeatherForecast";

export const metadata = {
  title: "Rainfall Prediction",
  description:
    "Hyper-local 5-day weather and rainfall forecast for your village or city. Plan your farming activities with real-time weather data.",
};

export default function WeatherPage() {
  return <WeatherForecast />;
}
