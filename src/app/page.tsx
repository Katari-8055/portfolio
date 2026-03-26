import Educations from "../components/Educations";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import POW from "../components/POW";
import Projects from "../components/Projects";
import Skills from "../components/Skills";

export default function Home() {
  return (
    <div className="sm:max-w-2/3 mx-auto flex flex-col items-center">
      <Hero />
      <POW />
      <Projects />
      <Educations />
      <Skills />
      <Footer />
    </div>
  );
}
