export function strikeRemovedWords(
  original: string,
  corrected: string
): { text: string; removed: boolean }[] {
  const origWords = original.split(/(\s+)/);
  const corrWords = corrected.split(/(\s+)/).filter((w) => w.trim() !== "");
  const corrSet = new Set(corrWords.map((w) => w.toLowerCase()));

  return origWords
    .filter((w) => w !== "")
    .map((word) => {
      const isSpace = /^\s+$/.test(word);
      if (isSpace) return { text: word, removed: false };
      const clean = word.toLowerCase().replace(/[.,!?;:]/g, "");
      const removed = !corrSet.has(clean) && clean.length > 0;
      return { text: word, removed };
    });
}
