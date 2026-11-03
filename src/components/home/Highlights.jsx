
export default function Highlights({ highlights }) {
  return (
    <section className="border-y border-emerald-950/5 bg-white">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-5 px-4 py-7 sm:px-6 md:grid-cols-4 md:gap-8 lg:px-8 lg:py-9">
        {highlights.map(({ icon: Icon, title, sub }) => (
          <div
            key={title}
            className="flex items-center gap-3 sm:justify-center sm:gap-4"
          >
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-emerald-50 text-emerald-800">
              <Icon size={23} />
            </span>

            <div>
              <p className="font-extrabold text-emerald-950">{title}</p>
              <p className="mt-0.5 text-xs text-stone-500 sm:text-sm">
                {sub}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
