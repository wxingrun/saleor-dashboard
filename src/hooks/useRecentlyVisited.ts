import { useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";

import {
  type EntityType,
  type RecentlyVisitedItem,
  addRecentlyVisited,
} from "@dashboard/utils/recentlyVisited";

interface UseRecentlyVisitedOptions {
  entityId: string;
  entityName: string;
  entityType: EntityType;
}

export function useRecentlyVisited({
  entityId,
  entityName,
  entityType,
}: UseRecentlyVisitedOptions) {
  const location = useLocation();

  const addVisit = useCallback(() => {
    const item: RecentlyVisitedItem = {
      id: entityId,
      type: entityType,
      name: entityName,
      url: location.pathname,
    };
    addRecentlyVisited(item);
  }, [entityId, entityName, entityType, location.pathname]);

  useEffect(() => {
    addVisit();
  }, [addVisit]);

  return { addVisit };
}