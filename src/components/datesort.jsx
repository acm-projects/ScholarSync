// gets items and sorts then get the time in milliseconds compare them if negative then that item goes before the other and keep doing this until array is sorted
export function sortByDate(items, mode) {
    return [...items].sort((a, b) => {
      const da = new Date(a.datePosted).getTime();
      const db = new Date(b.datePosted).getTime();
      return mode === "oldest" ? da - db : db - da;
    });
  }
  