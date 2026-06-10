export type EntityType = "product" | "order" | "customer";

export interface RecentlyVisitedItem {
  id: string;
  type: EntityType;
  name: string;
  url: string;
}

const STORAGE_KEY = "dashboard-recently-visited";
const MAX_ITEMS = 5;

const entityTypeLabels: Record<EntityType, string> = {
  product: "商品",
  order: "订单",
  customer: "客户",
};

export function getEntityTypeLabel(type: EntityType): string {
  return entityTypeLabels[type];
}

export function getRecentlyVisited(): RecentlyVisitedItem[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    console.warn("Could not read recently visited from localStorage");
  }
  return [];
}

export function addRecentlyVisited(item: RecentlyVisitedItem): RecentlyVisitedItem[] {
  const items = getRecentlyVisited();
  
  const existingIndex = items.findIndex(i => i.url === item.url);
  
  if (existingIndex !== -1) {
    items.splice(existingIndex, 1);
  }
  
  items.unshift(item);
  
  if (items.length > MAX_ITEMS) {
    items.pop();
  }
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    console.warn("Could not save recently visited to localStorage");
  }
  
  return items;
}

export function clearRecentlyVisited(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    console.warn("Could not clear recently visited from localStorage");
  }
}