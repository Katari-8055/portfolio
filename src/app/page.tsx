import Hero from "../components/Hero";
import Stats from "../components/Stats";
import Experience from "../components/Experience";
import Projects from "../components/Projects";
import OpenSource from "../components/OpenSource";
import Skills from "../components/Skills";
import About from "../components/About";
import Contact from "../components/Contact";
import Footer from "../components/Footer";
import PageSnake from "../components/PageSnake";

export default function Home() {
  return (
    <main className="relative overflow-x-clip">
      <Hero />
      {/* the snake winds behind everything between the hero and the footer */}
      <div className="relative">
        <PageSnake />
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
          <Stats />
          <Experience />
          <Projects />
          <OpenSource />
          <Skills />
          <About />
          <Contact />
        </div>
      </div>
      <Footer />
    </main>
  );
}
