import { Box, List, Text } from "@saleor/macaw-ui-next";
import { Package, ShoppingCart, User } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { Link } from "react-router-dom";

import { sprinkles } from "@saleor/macaw-ui-next";

import { getRecentlyVisited, type RecentlyVisitedItem } from "./utils";

const typeMessages = {
  product: {
    defaultMessage: "Product",
    id: "recentlyVisited/product",
  },
  order: {
    defaultMessage: "Order",
    id: "recentlyVisited/order",
  },
  customer: {
    defaultMessage: "Customer",
    id: "recentlyVisited/customer",
  },
};

const typeIcons = {
  product: Package,
  order: ShoppingCart,
  customer: User,
};

export const RecentlyVisited = () => {
  const intl = useIntl();
  const [items, setItems] = useState<RecentlyVisitedItem[]>([]);

  const loadItems = useCallback(() => {
    setItems(getRecentlyVisited());
  }, []);

  useEffect(() => {
    loadItems();

    const handleStorage = (e: StorageEvent) => {
      if (e.key === "dashboard-recently-visited") {
        loadItems();
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [loadItems]);

  if (items.length === 0) {
    return null;
  }

  return (
    <Box paddingX={2} paddingTop={2}>
      <Text size={2} fontWeight="bold" color="default2" textTransform="uppercase" marginBottom={1}>
        {intl.formatMessage({
          defaultMessage: "Recently Visited",
          id: "recentlyVisited/heading",
        })}
      </Text>
      <Box as="nav">
        {items.map(item => {
          const Icon = typeIcons[item.type];
          const typeLabel = intl.formatMessage(typeMessages[item.type]);

          return (
            <List.Item
              key={item.url}
              borderRadius={3}
              paddingX={2}
              data-test-id={`recently-visited-${item.type}-${item.id}`}
            >
              <Link
                to={item.url}
                className={sprinkles({
                  display: "block",
                  width: "100%",
                })}
              >
                <Box
                  className={sprinkles({
                    paddingY: 1.5,
                    gap: 3,
                    display: "flex",
                    alignItems: "flex-start",
                  })}
                >
                  <Icon size={16} />
                  <Box display="flex" flexDirection="column" overflow="hidden">
                    <Text size={3} fontWeight="medium" overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap">
                      {item.name}
                    </Text>
                    <Text size={2} color="default2">
                      {typeLabel}
                    </Text>
                  </Box>
                </Box>
              </Link>
            </List.Item>
          );
        })}
      </Box>
    </Box>
  );
};
