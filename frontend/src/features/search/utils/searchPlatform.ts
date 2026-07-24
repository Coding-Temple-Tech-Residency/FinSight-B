import type { PlatformSearchResult, SearchItem } from "../types/search";

const normalizeSearchValue = (value: string): string => {
  return value.toLowerCase().trim().replace(/\s+/g, " ");
};

const calculateSearchScore = (item: SearchItem, query: string): number => {
  const normalizedQuery = normalizeSearchValue(query);
  const normalizedTitle = normalizeSearchValue(item.title);
  const normalizedDescription = normalizeSearchValue(item.description);
  const normalizedCategory = normalizeSearchValue(item.category);

  const normalizedKeywords = item.keywords.map(normalizeSearchValue);

  let score = 0;

  if (normalizedTitle === normalizedQuery) {
    score += 100;
  }

  if (normalizedTitle.startsWith(normalizedQuery)) {
    score += 50;
  }

  if (normalizedTitle.includes(normalizedQuery)) {
    score += 35;
  }

  if (normalizedCategory === normalizedQuery) {
    score += 25;
  }

  if (normalizedDescription.includes(normalizedQuery)) {
    score += 15;
  }

  normalizedKeywords.forEach((keyword) => {
    if (keyword === normalizedQuery) {
      score += 40;
    } else if (keyword.startsWith(normalizedQuery)) {
      score += 25;
    } else if (keyword.includes(normalizedQuery)) {
      score += 12;
    }
  });

  const queryWords = normalizedQuery.split(" ").filter(Boolean);

  queryWords.forEach((word) => {
    if (normalizedTitle.includes(word)) {
      score += 8;
    }

    if (normalizedDescription.includes(word)) {
      score += 4;
    }

    if (normalizedKeywords.some((keyword) => keyword.includes(word))) {
      score += 6;
    }
  });

  return score;
};

export const searchPlatform = (
  items: SearchItem[],
  query: string,
): PlatformSearchResult[] => {
  const normalizedQuery = normalizeSearchValue(query);

  if (!normalizedQuery) {
    return [];
  }

  return items
    .map((item) => ({
      ...item,
      score: calculateSearchScore(item, normalizedQuery),
    }))
    .filter((item) => item.score > 0)
    .sort((firstItem, secondItem) => {
      if (secondItem.score !== firstItem.score) {
        return secondItem.score - firstItem.score;
      }

      return firstItem.title.localeCompare(secondItem.title);
    });
};
