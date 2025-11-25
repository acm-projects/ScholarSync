// takes all the user tags, compares them against one opportunity’s buckets 
//and returns an object with only the matching tags in { green, yellow, red }.
export function categorizeFromUser(flatTags = [], profile) {
    const p = Array.isArray(profile)
      ? { green: profile, yellow: [], red: [] }
      : {
          green: Array.isArray(profile?.green) ? profile.green : [],
          yellow: Array.isArray(profile?.yellow) ? profile.yellow : [],
          red: Array.isArray(profile?.red) ? profile.red : [],
        };
    const out = { green: [], yellow: [], red: [] };
    for (const t of flatTags) {
      if (p.green.includes(t)) out.green.push(t);
      else if (p.yellow.includes(t)) out.yellow.push(t);
      else if (p.red.includes(t)) out.red.push(t);
    }
    return out;
  }
  // Youtube and forums helped a lot with these two functions- logic in functions were difficult but understandable

  // replaces the original tags in each card with the user-matched buckets from categorizefromuser
  export function normalizeAllItems(items, profile) {
    return items.map((it) => {
      // Handle different tag formats from API
      let profTags = it.tags;
      
      // If tags come as an array, use them directly
      if (Array.isArray(profTags)) {
        // Tags are already an array, keep them as is
      } else if (profTags && typeof profTags === 'object') {
        // If tags are in colored format, combine all into a single array
        profTags = [
          ...(Array.isArray(profTags.green) ? profTags.green : []),
          ...(Array.isArray(profTags.yellow) ? profTags.yellow : []),
          ...(Array.isArray(profTags.red) ? profTags.red : []),
        ];
      } else {
        // If tags are missing or in unexpected format, default to empty array
        profTags = [];
      }
      
      return {
        ...it,
        originalTags: it.tags || [],
        tags: profTags,
      };
    });
  }
  