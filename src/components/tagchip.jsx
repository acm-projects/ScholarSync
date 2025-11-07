export default function TagChip({ text, color = "black" }) {
    let styles = "bg-[#983734]/25 text-[#EEEef0] border-[#FFD1CC]/90";
    switch (color) {
      case "green":
        styles = "bg-emerald-600/20 text-emerald-200 border-emerald-300/80";
        break;
      case "yellow":
        styles = "bg-amber-500/25 text-amber-100 border-amber-300/80";
        break;
      case "red":
        styles = "bg-rose-600/20 text-rose-200 border-rose-400/80";
        break;
    }
  
    return (
      <span className={`inline-flex items-center rounded-full border px-3 py-0.75 text-s font-bold ${styles}`}>
        {text}
      </span>
    );
  }
  