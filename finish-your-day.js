// Shared "finish your day" quick-protein suggestion logic.
// Used by both Macro Log (rich display) and Aaron's Fitness Hub (one-line summary).
// Loaded as a plain <script> tag — both apps live under the same GitHub Pages
// origin (aaronlikeshoobs.github.io), so no CORS/module setup is needed.
(function (global) {
  const PROTEIN_BOOSTERS = [
    { name: 'Egg whites (3)', cal: 51, protein: 11, fat: 0, carb: 1 },
    { name: 'Turkey breast slices (3 oz)', cal: 90, protein: 19, fat: 1, carb: 1 },
    { name: 'Low-fat cottage cheese (1/2 cup)', cal: 90, protein: 12, fat: 2, carb: 5 },
    { name: 'Nonfat Greek yogurt (170g)', cal: 100, protein: 18, fat: 0, carb: 6 },
    { name: 'Canned tuna in water (1 can)', cal: 110, protein: 24, fat: 1, carb: 0 },
    { name: 'Whey protein shake (1 scoop)', cal: 120, protein: 24, fat: 1, carb: 3 },
    { name: 'Chicken breast (3 oz)', cal: 140, protein: 26, fat: 3, carb: 0 },
  ];

  // t: {cal, protein, ...} totals so far today. tg: {cal, protein} target for today.
  // Returns an array (possibly empty) of candidate foods, cheapest-that-covers-the-gap first,
  // each annotated with how the day's calorie total would land if you ate it.
  function computeFinishers(t, tg, limit) {
    limit = limit || 2;
    const proteinLeft = tg.protein - t.protein;
    if (proteinLeft <= 0) return [];
    const covering = PROTEIN_BOOSTERS.filter((b) => b.protein >= proteinLeft).sort((a, b) => a.cal - b.cal);
    const fallback = PROTEIN_BOOSTERS.slice().sort((a, b) => (b.protein / b.cal) - (a.protein / a.cal));
    const picks = (covering.length ? covering : fallback).slice(0, limit);
    return picks.map((p) => {
      const delta = (t.cal + p.cal) - tg.cal;
      const deltaText = delta > 0 ? `${delta} kcal over target` : `${-delta} kcal still under target`;
      return Object.assign({}, p, { deltaText });
    });
  }

  global.FinishYourDay = { PROTEIN_BOOSTERS: PROTEIN_BOOSTERS, compute: computeFinishers };
})(window);
