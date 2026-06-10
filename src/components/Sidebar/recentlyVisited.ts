import { useEffect, useState } from "react";

export const RECENTLY_VISITED_STORAGE_KEY = "dashboard-recently-visited";

const RECENTLY_VISITED_EVENT = "dashboard-recently-visited-updated";
const MAX_RECENTLY_VISITED_ITEMS = 5;

export type RecentlyVisitedEntityType = "product" | "order" | "customer";

export interface RecentlyVisitedEntry {
  entityType: RecentlyVisitedEntityType;
  id: string;
  label: string;
  url: string;
}

const recentlyVisitedEntityTypes: RecentlyVisitedEntityType[] = ["product", "order", "customer"];

const isRecentlyVisitedEntityType = (
  value: unknown,
): value is RecentlyVisitedEntityType => recentlyVisitedEntityTypes.includes(value as RecentlyVisitedEntityType);

const isRecentlyVisitedEntry = (value: unknown): value is RecentlyVisitedEntry => {
  if (!value || typeof value !== "object") {
    return false;
  }

  const entry = value as Partial<RecentlyVisitedEntry>;

  return (
    typeof entry.id === "string" &&
    typeof entry.label === "string" &&
    typeof entry.url === "string" &&
    isRecentlyVisitedEntityType(entry.entityType)
  );
};

const parseRecentlyVisitedEntries = (value: string | null): RecentlyVisitedEntry[] => {
  if (!value) {
    return [];
  }

  try {
    const parsedValue = JSON.parse(value);

    if (!Array.isArray(parsedValue)) {
      return [];
    }

    return parsedValue.filter(isRecentlyVisitedEntry).slice(0, MAX_RECENTLY_VISITED_ITEMS);
  } catch {
    return [];
  }
};

const notifyRecentlyVisitedChange = () => {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new Event(RECENTLY_VISITED_EVENT));
};

const writeRecentlyVisitedEntries = (entries: RecentlyVisitedEntry[]) => {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(RECENTLY_VISITED_STORAGE_KEY, JSON.stringify(entries));
  notifyRecentlyVisitedChange();
};

const isSameRecentlyVisitedEntry = (
  left: RecentlyVisitedEntry,
  right: RecentlyVisitedEntry,
) => left.entityType === right.entityType && left.id === right.id;

export const readRecentlyVisitedEntries = (): RecentlyVisitedEntry[] => {
  if (typeof window === "undefined") {
    return [];
  }

  return parseRecentlyVisitedEntries(localStorage.getItem(RECENTLY_VISITED_STORAGE_KEY));
};

export const addRecentlyVisitedEntry = (entry: RecentlyVisitedEntry) => {
  if (!entry.label.trim()) {
    return;
  }

  const updatedEntries = [
    entry,
    ...readRecentlyVisitedEntries().filter(existingEntry => !isSameRecentlyVisitedEntry(existingEntry, entry)),
  ].slice(0, MAX_RECENTLY_VISITED_ITEMS);

  writeRecentlyVisitedEntries(updatedEntries);
};

export const useRecentlyVisitedEntries = () => {
  const [entries, setEntries] = useState<RecentlyVisitedEntry[]>(() => readRecentlyVisitedEntries());

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const syncEntries = () => {
      setEntries(readRecentlyVisitedEntries());
    };

    const handleStorage = (event: StorageEvent) => {
      if (event.key === null || event.key === RECENTLY_VISITED_STORAGE_KEY) {
        syncEntries();
      }
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener(RECENTLY_VISITED_EVENT, syncEntries);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener(RECENTLY_VISITED_EVENT, syncEntries);
    };
  }, []);

  return entries;
};

export const useTrackRecentlyVisitedEntry = (entry: RecentlyVisitedEntry | null | undefined) => {
  useEffect(() => {
    if (!entry) {
      return;
    }

    addRecentlyVisitedEntry(entry);
  }, [entry?.entityType, entry?.id, entry?.label, entry?.url]);
};
