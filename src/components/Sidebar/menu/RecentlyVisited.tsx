import { Box, List, Text } from "@saleor/macaw-ui-next";
import { useRecentlyVisited, VisitedEntity } from "@dashboard/hooks/useRecentlyVisited";
import { Link } from "react-router-dom";
import React from "react";

const getEntityLabel = (type: VisitedEntity["type"]) => {
  switch (type) {
    case "product":
      return "商品";
    case "order":
      return "订单";
    case "customer":
      return "客户";
    default:
      return type;
  }
};

export const RecentlyVisited = () => {
  const { visitedItems } = useRecentlyVisited();

  if (visitedItems.length === 0) {
    return null;
  }

  return (
    <Box marginBottom={4}>
      <Text size={2} color="default2" display="block" marginBottom={2}>
        最近访问
      </Text>
      <List as="ol" display="grid" gap={1}>
        {visitedItems.map((item) => (
          <Box
            as="li"
            key={`${item.type}-${item.id}`}
            display="flex"
            alignItems="center"
            paddingY={1}
            paddingX={2}
            borderRadius={4}
            __transition="background-color 0.2s ease"
            _hover={{ backgroundColor: "default1Hover" }}
          >
            <Link to={item.url} style={{ textDecoration: "none", width: "100%", display: "flex", flexDirection: "column" }}>
              <Text size={3} color="default1" ellipsis>
                {item.name}
              </Text>
              <Text size={2} color="default2">
                {getEntityLabel(item.type)}
              </Text>
            </Link>
          </Box>
        ))}
      </List>
    </Box>
  );
};
