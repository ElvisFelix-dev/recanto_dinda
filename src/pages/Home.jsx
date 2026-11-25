import { useEffect, useState } from "react";
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
} from "../data/homeData";

import { whatsappLink } from "../utils/whatsapp";
import { testimonialApi } from "../services/api";

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [publicTestimonials, setPublicTestimonials] = useState([]);

  useEffect(() => {
    let active = true;

    testimonialApi.getPublicTestimonials({ limit: 12 })
      .then((response) => {
        const items = Array.isArray(response?.data) ? response.data : [];
        if (active) setPublicTestimonials(items);
      })
      .catch((error) => {
        console.error("[Home] Não foi possível carregar depoimentos:", error);
        if (active) setPublicTestimonials([]);
      });

    return () => { active = false; };
  }, []);

  return (
    <div className="home-page min-h-screen overflow-hidden bg-[#fff8f3] font-body text-stone-800">
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
          testimonials={publicTestimonials}
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
