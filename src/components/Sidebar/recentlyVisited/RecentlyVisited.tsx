import { Box, List, sprinkles, Text } from "@saleor/macaw-ui-next";
import { Package, ShoppingCart, User } from "lucide-react";
import { useEffect, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { Link } from "react-router-dom";

import {
  getRecentlyVisitedItems,
  subscribeToRecentlyVisitedChanges,
  type RecentlyVisitedItem,
} from "./utils";
import styles from "./RecentlyVisited.module.css";

const ENTITY_TYPE_LABELS: Record<
  RecentlyVisitedItem["type"],
  { labelId: string; labelDefault: string }
> = {
  product: {
    labelId: "recently-visited/product",
    labelDefault: "商品",
  },
  order: {
    labelId: "recently-visited/order",
    labelDefault: "订单",
  },
  customer: {
    labelId: "recently-visited/customer",
    labelDefault: "客户",
  },
};

const IconForType = ({ type }: { type: RecentlyVisitedItem["type"] }) => {
  switch (type) {
    case "product":
      return <Package size={20} />;
    case "order":
      return <ShoppingCart size={20} />;
    case "customer":
      return <User size={20} />;
  }
};

export const RecentlyVisited = () => {
  const intl = useIntl();
  const [items, setItems] = useState<RecentlyVisitedItem[]>(getRecentlyVisitedItems);

  useEffect(() => {
    const unsubscribe = subscribeToRecentlyVisitedChanges(() => {
      setItems(getRecentlyVisitedItems());
    });

    return unsubscribe;
  }, []);

  if (items.length === 0) {
    return null;
  }

  return (
    <Box
      className={styles.container}
      borderBottomWidth={1}
      borderBottomStyle="solid"
      borderColor="default1"
    >
      <Box className={styles.header}>
        <Text size={1} color="default2">
          <FormattedMessage defaultMessage="最近访问" id="recently-visited/header" />
        </Text>
      </Box>
      <Box padding={3} paddingTop={0}>
        <List as="ol" display="grid" gap={1} data-test-id="recently-visited-list">
          {items.map(item => (
            <List.Item
              key={`${item.type}-${item.id}`}
              borderRadius={3}
              paddingX={2}
              data-test-id={`recently-visited-item-${item.type}-${item.id}`}
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
                    alignItems: "center",
                  })}
                >
                  <Box color="default2" __width={20} __height={20}>
                    <IconForType type={item.type} />
                  </Box>
                  <Box display="flex" flexDirection="column" __flex={1} overflow="hidden">
                    <Text size={3} fontWeight="medium" ellipsis>
                      {item.name}
                    </Text>
                    <Text size={1} color="default2">
                      {intl.formatMessage({
                        id: ENTITY_TYPE_LABELS[item.type].labelId,
                        defaultMessage: ENTITY_TYPE_LABELS[item.type].labelDefault,
                      })}
                    </Text>
                  </Box>
                </Box>
              </Link>
            </List.Item>
          ))}
        </List>
      </Box>
    </Box>
  );
};