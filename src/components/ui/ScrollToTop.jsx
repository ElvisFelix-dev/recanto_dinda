
import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
    });
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Voltar ao topo da página"
      aria-hidden={!isVisible}
      tabIndex={isVisible ? 0 : -1}
      className={`
        fixed bottom-6 right-5 z-50
        flex h-12 w-12 items-center justify-center
        rounded-full border border-white/20
        bg-[#173f31] text-[#f5b36d]
        shadow-lg shadow-[#173f31]/20
        transition-all duration-300 ease-out
        hover:-translate-y-1 hover:bg-[#245640]
        hover:shadow-xl
        focus-visible:outline-none
        focus-visible:ring-4
        focus-visible:ring-[#e88b43]/40
        ${
          isVisible
            ? "translate-y-0 scale-100 opacity-100"
            : "pointer-events-none translate-y-4 scale-75 opacity-0"
        }
      `}
    >
      <ArrowUp size={22} strokeWidth={2.5} />
    </button>
  );
}
