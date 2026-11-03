
import { useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  X,
  Maximize2,
} from "lucide-react";
import SectionHeading from "../ui/SectionHeading";

export default function Gallery({ gallery }) {
  const [selectedIndex, setSelectedIndex] = useState(null);

  const isOpen = selectedIndex !== null;
  const selectedPhoto = isOpen ? gallery[selectedIndex] : null;

  const closeGallery = () => setSelectedIndex(null);

  const showPrevious = () => {
    setSelectedIndex((current) =>
      current === 0 ? gallery.length - 1 : current - 1
    );
  };

  const showNext = () => {
    setSelectedIndex((current) =>
      current === gallery.length - 1 ? 0 : current + 1
    );
  };

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") closeGallery();
      if (event.key === "ArrowLeft") showPrevious();
      if (event.key === "ArrowRight") showNext();
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <section
      id="fotos"
      className="scroll-mt-24 bg-[#eef7ed] py-16 sm:py-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Alguns momentos por aqui"
          title="Cães felizes, momentos especiais"
          description="Um gostinho do ambiente de brincadeiras, natureza e convivência."
        />

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {gallery.map((photo, index) => (
            <button
              key={photo.image}
              type="button"
              onClick={() => setSelectedIndex(index)}
              className="group relative overflow-hidden rounded-2xl text-left focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
              aria-label={`Ampliar foto: ${photo.alt}`}
            >
              <img
                src={photo.image}
                alt={photo.alt}
                loading="lazy"
                className="h-36 w-full object-cover transition duration-500 group-hover:scale-110 sm:h-40 lg:h-48"
              />

              <span className="absolute inset-0 flex items-center justify-center bg-emerald-950/0 text-white transition group-hover:bg-emerald-950/35">
                <Maximize2
                  size={25}
                  className="opacity-0 transition group-hover:opacity-100"
                />
              </span>
            </button>
          ))}
        </div>

        <p className="mt-5 text-center text-xs text-stone-500">
          Imagens ilustrativas nesta demonstração. Substitua por fotos
          autorizadas do espaço e dos cães atendidos.
        </p>
      </div>

      {/* MODAL */}
      {isOpen && selectedPhoto && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-emerald-950/95 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Visualização da galeria"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeGallery();
          }}
        >
          {/* FECHAR */}
          <button
            type="button"
            onClick={closeGallery}
            aria-label="Fechar galeria"
            className="absolute right-4 top-4 z-10 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
          >
            <X size={24} />
          </button>

          {/* FOTO */}
          <div className="flex w-full max-w-5xl flex-col items-center">
            <div className="relative flex w-full items-center justify-center">
              <button
                type="button"
                onClick={showPrevious}
                aria-label="Foto anterior"
                className="absolute left-0 z-10 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20 sm:left-3 sm:h-12 sm:w-12"
              >
                <ChevronLeft size={27} />
              </button>

              <img
                src={selectedPhoto.image}
                alt={selectedPhoto.alt}
                className="max-h-[72vh] max-w-[calc(100%-5rem)] rounded-2xl object-contain shadow-2xl"
              />

              <button
                type="button"
                onClick={showNext}
                aria-label="Próxima foto"
                className="absolute right-0 z-10 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20 sm:right-3 sm:h-12 sm:w-12"
              >
                <ChevronRight size={27} />
              </button>
            </div>

            <p className="mt-5 text-center text-sm font-semibold text-white">
              {selectedPhoto.alt}
            </p>

            <p className="mt-2 text-xs text-white/60">
              Foto {selectedIndex + 1} de {gallery.length}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
