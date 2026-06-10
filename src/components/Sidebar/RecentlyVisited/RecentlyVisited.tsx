import { Box, List, Text } from "@saleor/macaw-ui-next";
import { Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

import {
  type RecentlyVisitedItem,
  getEntityTypeLabel,
  getRecentlyVisited,
} from "@dashboard/utils/recentlyVisited";

export const RecentlyVisited = () => {
  const [items, setItems] = useState<RecentlyVisitedItem[]>([]);

  useEffect(() => {
    setItems(getRecentlyVisited());

    const handleStorageChange = () => {
      setItems(getRecentlyVisited());
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  if (items.length === 0) {
    return null;
  }

  return (
    <Box paddingX={3} paddingY={2} borderBottomWidth={1} borderColor="default3">
      <Box display="flex" alignItems="center" gap={2} marginBottom={2}>
        <Clock size={14} />
        <Text size={2} fontWeight="medium" textColor="neutral">
          最近访问
        </Text>
      </Box>
      <List as="ol" display="grid" gap={0.5}>
        {items.map((item) => (
          <List.Item
            key={item.url}
            borderRadius={2}
            paddingX={2}
            paddingY={1.5}
          >
            <Link
              to={item.url}
              className="w-full block"
              style={{ textDecoration: "none" }}
            >
              <Box display="flex" flexDirection="column" gap={0.5}>
                <Text size={2} textColor="primary">
                  {item.name}
                </Text>
                <Text size={1.5} textColor="neutral">
                  {getEntityTypeLabel(item.type)}
                </Text>
              </Box>
            </Link>
          </List.Item>
        ))}
      </List>
    </Box>
  );
};