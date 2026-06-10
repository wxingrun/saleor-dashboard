const STORAGE_KEY = "dashboard-recently-visited";
const MAX_ITEMS = 5;
const EVENT_NAME = "recently-visited-change";

export type RecentlyVisitedEntityType = "product" | "order" | "customer";

export interface RecentlyVisitedItem {
  id: string;
  type: RecentlyVisitedEntityType;
  name: string;
  url: string;
  visitedAt: number;
}

export const getRecentlyVisitedItems = (): RecentlyVisitedItem[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed;
  } catch {
    return [];
  }
};

export const addRecentlyVisitedItem = (item: Omit<RecentlyVisitedItem, "visitedAt">) => {
  const items = getRecentlyVisitedItems();

  const existingIndex = items.findIndex(i => i.id === item.id && i.type === item.type);

  const newItem: RecentlyVisitedItem = { ...item, visitedAt: Date.now() };

  if (existingIndex > -1) {
    items.splice(existingIndex, 1);
  }

  items.unshift(newItem);

  if (items.length > MAX_ITEMS) {
    items.length = MAX_ITEMS;
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // localStorage may be full or unavailable
  }

  window.dispatchEvent(new Event(EVENT_NAME));
};

export const subscribeToRecentlyVisitedChanges = (callback: () => void) => {
  const handler = () => callback();

  window.addEventListener(EVENT_NAME, handler);

  return () => window.removeEventListener(EVENT_NAME, handler);
};