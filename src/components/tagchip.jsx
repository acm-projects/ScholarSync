export default function TagChip({ text, color = "gray" }) {
  let styles = "bg-[#f3f4f6] text-[#4b5563] border-[#e5e7eb]";

  switch (color) {
    case "green":
      styles = "bg-emerald-100 text-emerald-700 border-emerald-200";
      break;
    case "yellow":
      styles = "bg-amber-100 text-amber-700 border-amber-200";
      break;
    case "red":
      styles = "bg-rose-100 text-rose-700 border-rose-200";
      break;
  }

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-0.75 text-s font-bold ${styles}`}
    >
      {text}
    </span>
  );
}
