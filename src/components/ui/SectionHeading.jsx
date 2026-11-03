export default function SectionHeading({
  eyebrow,
  title,
  description,
  light = false,
}) {
  return (
    <div className="mx-auto mb-10 max-w-2xl text-center">
      <p
        className={`mb-3 text-xs font-extrabold uppercase tracking-[0.28em] ${
          light ? "text-emerald-200" : "text-emerald-800"
        }`}
      >
        {eyebrow}
      </p>

      <h2
        className={`text-3xl font-black leading-tight tracking-tight sm:text-4xl ${
          light ? "text-white" : "text-emerald-950"
        }`}
      >
        {title}
      </h2>

      {description && (
        <p
          className={`mx-auto mt-4 max-w-xl text-sm leading-7 sm:text-base ${
            light ? "text-white/75" : "text-stone-600"
          }`}
        >
          {description}
        </p>
      )}

      <span className="mx-auto mt-5 block h-1 w-14 rounded-full bg-orange-400" />
    </div>
  );
}
