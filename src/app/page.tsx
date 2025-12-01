import Image from "next/image";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import FeatureServiceSection from "@/components/sections/Service";
import Horoscope from "@/components/sections/Horoscope";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
export default function Home() {
  return (
    <div className="">
      <Header/>
      <Hero/>
      <About/>
      <Horoscope/>
      <FeatureServiceSection/>
      <Footer/>
    </div>
  );
}
