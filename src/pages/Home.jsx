import { useState } from "react";
import Navbar from "../components/home/Navbar";
import Hero from "../components/home/Hero";
import Highlights from "../components/home/Highlights";
import About from "../components/home/About";
import Services from "../components/home/Services";
import Benefits from "../components/home/Benefits";
import Gallery from "../components/home/Gallery";
import Testimonials from "../components/home/Testimonials";
import FAQ from "../components/home/FAQ";
import Contact from "../components/home/Contact";
import FinalCTA from "../components/home/FinalCTA";
import Footer from "../components/home/Footer";
import ScrollToTop from "../components/ui/ScrollToTop";

import {
  photos,
  services,
  benefits,
  gallery,
  navItems,
  highlights,
  faqs,
  testimonials,
} from "../data/homeData";

import { whatsappLink } from "../utils/whatsapp";

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen overflow-hidden bg-[#fffdf8] font-sans text-stone-800">
      <Navbar
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        navItems={navItems}
        whatsappLink={whatsappLink}
      />

      <main>
        <Hero photos={photos} whatsappLink={whatsappLink} />
        <Highlights highlights={highlights} />
        <About photos={photos} whatsappLink={whatsappLink} />
        <Services services={services} whatsappLink={whatsappLink} />
        <Benefits benefits={benefits} photos={photos} />
        <Gallery gallery={gallery} />

        <Testimonials
          testimonials={testimonials}
          whatsappLink={whatsappLink}
        />

        <FAQ faqs={faqs} whatsappLink={whatsappLink} />
        <Contact whatsappLink={whatsappLink} />
        <FinalCTA whatsappLink={whatsappLink} />
      </main>

      <Footer navItems={navItems} whatsappLink={whatsappLink} />
      <ScrollToTop />
    </div>
  );
}
