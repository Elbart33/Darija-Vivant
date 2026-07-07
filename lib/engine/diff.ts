import { DiffSegment, DiffKind } from "@/types";

/**
 * Simple word-level diff based on the longest common subsequence.
 * Good enough for short spoken-style sentences (not a full text editor diff).
 */
export function wordDiff(
  before: string,
  after: string,
  kindForChange: DiffKind
): DiffSegment[] {
  const a = tokenize(before);
  const b = tokenize(after);
  const aKeys = a.map(normalizeKey);
  const bKeys = b.map(normalizeKey);
  const lcs = longestCommonSubsequence(aKeys, bKeys);

  const segments: DiffSegment[] = [];
  let ai = 0;
  let bi = 0;
  let li = 0;

  const flushChange = (removed: string[], added: string[]) => {
    if (added.length > 0) {
      segments.push({
        text: added.join(" "),
        kind: kindForChange,
        note: removed.length > 0 ? removed.join(" ") : undefined,
      });
    }
  };

  while (ai < a.length || bi < b.length) {
    if (
      li < lcs.length &&
      ai < a.length &&
      bi < b.length &&
      aKeys[ai] === lcs[li] &&
      bKeys[bi] === lcs[li]
    ) {
      segments.push({ text: b[bi], kind: "same" });
      ai++;
      bi++;
      li++;
    } else {
      const removed: string[] = [];
      const added: string[] = [];
      while (ai < a.length && (li >= lcs.length || aKeys[ai] !== lcs[li])) {
        removed.push(a[ai]);
        ai++;
      }
      while (bi < b.length && (li >= lcs.length || bKeys[bi] !== lcs[li])) {
        added.push(b[bi]);
        bi++;
      }
      flushChange(removed, added);
    }
  }
  return mergeAdjacentSame(segments);
}

function tokenize(text: string): string[] {
  return text
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}

function normalizeKey(word: string): string {
  return word
    .toLowerCase()
    .replace(/[.,!?;:«»"'’()—-]/g, "");
}

function longestCommonSubsequence(a: string[], b: string[]): string[] {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = m - 1; i >= 0; i--) {
    for (let j = n - 1; j >= 0; j--) {
      if (a[i] === b[j]) {
        dp[i][j] = dp[i + 1][j + 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i + 1][j], dp[i][j + 1]);
      }
    }
  }
  const result: string[] = [];
  let i = 0;
  let j = 0;
  while (i < m && j < n) {
    if (a[i] === b[j]) {
      result.push(a[i]);
      i++;
      j++;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      i++;
    } else {
      j++;
    }
  }
  return result;
}

function mergeAdjacentSame(segments: DiffSegment[]): DiffSegment[] {
  const merged: DiffSegment[] = [];
  for (const seg of segments) {
    const last = merged[merged.length - 1];
    if (last && last.kind === "same" && seg.kind === "same") {
      last.text = `${last.text} ${seg.text}`;
    } else {
      merged.push({ ...seg });
    }
  }
  return merged;
}
