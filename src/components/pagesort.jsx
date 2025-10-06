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
    const flatUser =
      Array.isArray(profile) ? profile : Object.values(profile || {}).flat();
    return items.map((it) => ({
      ...it,
      originalTags: it.tags || { green: [], yellow: [], red: [] },
      tags: categorizeFromUser(
        flatUser,
        it.tags || { green: [], yellow: [], red: [] }
      ),
    }));
  }
  