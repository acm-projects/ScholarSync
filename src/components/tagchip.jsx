export default function TagChip({ text, color = "gray" }) {
    let styles = "bg-gray-100 text-gray-700 border-gray-200";
    switch (color) {
      case "green":
        styles = "bg-green-500/15 text-green-800 border-green-300";
        break;
      case "yellow":
        styles = "bg-yellow-400/20 text-yellow-900 border-yellow-300";
        break;
      case "red":
        styles = "bg-red-500/15 text-red-800 border-red-300";
        break;
    }
  
    return (
      <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${styles}`}>
        {text}
      </span>
    );
  }
  