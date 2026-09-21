export default function SectionHeading({ eyebrow, title, light = false }) {
  return (
    <div className="mb-10">
      <p className={`mb-3 text-xs font-black uppercase tracking-[0.22em] ${light ? "text-[#FFC928]" : "text-[#0D2A43]"}`}>
        {eyebrow}
      </p>
      <h2 className={`display text-5xl leading-none sm:text-6xl ${light ? "text-white" : "text-[#071A2B]"}`}>
        {title}
      </h2>
      <span className="mt-5 block h-1 w-14 bg-[#FFC928]" />
    </div>
  );
}