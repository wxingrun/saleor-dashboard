import { useCallback, useEffect, useState } from "react";

export type VisitedEntityType = "product" | "order" | "customer";

export interface VisitedEntity {
  type: VisitedEntityType;
  id: string;
  name: string;
  url: string;
}

const STORAGE_KEY = "dashboard-recently-visited";
const EVENT_NAME = "dashboard-recently-visited-updated";
const MAX_ITEMS = 5;

export const useRecentlyVisited = () => {
  const [visitedItems, setVisitedItems] = useState<VisitedEntity[]>([]);

  const loadItems = useCallback(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setVisitedItems(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Failed to load recently visited items", error);
    }
  }, []);

  useEffect(() => {
    loadItems();

    const handleUpdate = () => {
      loadItems();
    };

    window.addEventListener(EVENT_NAME, handleUpdate);
    return () => {
      window.removeEventListener(EVENT_NAME, handleUpdate);
    };
  }, [loadItems]);

  const addVisitedItem = useCallback((item: VisitedEntity) => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      let items: VisitedEntity[] = stored ? JSON.parse(stored) : [];

      // Remove if exists
      items = items.filter(
        i => !(i.type === item.type && i.id === item.id)
      );

      // Add to top
      items.unshift(item);

      // Keep max items
      if (items.length > MAX_ITEMS) {
        items = items.slice(0, MAX_ITEMS);
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
      window.dispatchEvent(new Event(EVENT_NAME));
    } catch (error) {
      console.error("Failed to save recently visited item", error);
    }
  }, []);

  return { visitedItems, addVisitedItem };
};
