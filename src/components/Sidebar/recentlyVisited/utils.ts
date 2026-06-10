export interface RecentlyVisitedItem {
  id: string;
  type: "product" | "order" | "customer";
  name: string;
  url: string;
  timestamp: number;
}

const STORAGE_KEY = "dashboard-recently-visited";
const MAX_ITEMS = 5;

export function getRecentlyVisited(): RecentlyVisitedItem[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return [];
    }
    return JSON.parse(stored) as RecentlyVisitedItem[];
  } catch {
    return [];
  }
}

export function addRecentlyVisited(item: RecentlyVisitedItem): void {
  if (typeof window === "undefined") {
    return;
  }

  const items = getRecentlyVisited();

  const filtered = items.filter(existing => existing.url !== item.url);

  const newItem = { ...item, timestamp: Date.now() };
  const updated = [newItem, ...filtered].slice(0, MAX_ITEMS);

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // localStorage might be full or disabled
  }
}
