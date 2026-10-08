import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import Education from "./components/Education";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

import CommandPalette from "./components/CommandPalette";
import ScrollProgress from "./components/ScrollProgress";
import BackToTop from "./components/BackToTop";
import PageLoader from "./components/PageLoader";
import AutoReveal from "./components/AutoReveal";
import WatchfulEyes from "./components/WatchfulEyes";


export default function App() {
  return (
    <>
      {/* Boot screen — sits above everything, unmounts itself */}
      <PageLoader />
      <WatchfulEyes/>
      <AutoReveal/>
      <main className="relative min-h-screen bg-[var(--bg)] text-[var(--text)] transition-colors duration-500">
        {/* Top hairline progress bar */}
        <ScrollProgress />

        {/* Sticky nav + mobile sheet */}
        <Navbar />

        {/* Page sections — ordered by narrative flow */}
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Education />
        <Contact />
        <Footer />

        {/* Global overlays */}
        <CommandPalette />
        <BackToTop />
      </main>
    </>
  );
}