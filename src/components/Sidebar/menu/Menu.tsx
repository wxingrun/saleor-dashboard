import { commonMessages } from "@dashboard/intl";
import { Box, List, sprinkles, Text } from "@saleor/macaw-ui-next";
import { defineMessages, useIntl } from "react-intl";
import { Link, useLocation } from "react-router-dom";

import { useRecentlyVisitedEntries } from "../recentlyVisited";
import { Shortcusts } from "../shortcuts";
import { useMenuStructure } from "./hooks/useMenuStructure";
import { MenuItem } from "./Item";

const messages = defineMessages({
  recentlyVisited: {
    id: "sidebarRecentlyVisited",
    defaultMessage: "Recently visited",
    description: "sidebar section title for recently visited entities",
  },
  order: {
    id: "sidebarRecentlyVisitedOrder",
    defaultMessage: "Order",
    description: "entity type label in the sidebar recently visited section",
  },
  customer: {
    id: "sidebarRecentlyVisitedCustomer",
    defaultMessage: "Customer",
    description: "entity type label in the sidebar recently visited section",
  },
});

export const Menu = () => {
  const intl = useIntl();
  const { pathname } = useLocation();
  const menuStructure = useMenuStructure();
  const recentlyVisitedEntries = useRecentlyVisitedEntries();

  const getEntityLabel = (entityType: (typeof recentlyVisitedEntries)[number]["entityType"]) => {
    switch (entityType) {
      case "product":
        return intl.formatMessage(commonMessages.product);
      case "order":
        return intl.formatMessage(messages.order);
      case "customer":
        return intl.formatMessage(messages.customer);
    }
  };

  return (
    <Box
      padding={3}
      overflowY="auto"
      className="hide-scrollbar"
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      gap={4}
    >
      <Box display="flex" flexDirection="column" gap={4}>
        {recentlyVisitedEntries.length > 0 && (
          <Box display="flex" flexDirection="column" gap={1} data-test-id="recently-visited-section">
            <Text size={2} fontWeight="medium" color="default2" paddingX={2}>
              {intl.formatMessage(messages.recentlyVisited)}
            </Text>
            <List as="ol" display="grid" gap={1} data-test-id="recently-visited-list">
              {recentlyVisitedEntries.map(entry => {
                const entryPath = entry.url.split("?")[0];
                const isActive = pathname === entryPath;

                return (
                  <List.Item
                    key={`${entry.entityType}-${entry.id}`}
                    borderRadius={3}
                    paddingX={2}
                    active={isActive}
                    data-test-id={`recently-visited-item-${entry.entityType}-${entry.id}`}
                  >
                    <Link
                      to={entry.url}
                      replace={isActive}
                      className={sprinkles({
                        display: "block",
                        width: "100%",
                      })}
                    >
                      <Box display="flex" flexDirection="column" gap={0.5} paddingY={1.5}>
                        <Text size={1} color="default2">
                          {getEntityLabel(entry.entityType)}
                        </Text>
                        <Text size={3} fontWeight="medium">
                          {entry.label}
                        </Text>
                      </Box>
                    </Link>
                  </List.Item>
                );
              })}
            </List>
          </Box>
        )}

        <List as="ol" display="grid" gap={1} data-test-id="menu-list">
          {menuStructure.map(menuItem => (
            <MenuItem menuItem={menuItem} key={menuItem.id} />
          ))}
        </List>
      </Box>

      <Shortcusts />
    </Box>
  );
};
