export default function TagChip({ text, color = "gray" }) {
    let styles = "bg-[#983734]/25 text-[#EEEef0] border-[#FFD1CC]/60";
    switch (color) {
      case "green":
        styles = "bg-emerald-600/20 text-emerald-200 border-emerald-300/70";
        break;
      case "yellow":
        styles = "bg-amber-500/25 text-amber-100 border-amber-300/70";
        break;
      case "red":
        styles = "bg-rose-600/20 text-rose-200 border-rose-400/70";
        break;
    }
  
    return (
      <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${styles}`}>
        {text}
      </span>
    );
  }
  