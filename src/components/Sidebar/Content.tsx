import { AllRipplesModal } from "@dashboard/ripples/components/AllRipplesModal";
import { useAllRipplesModalState } from "@dashboard/ripples/state";
import { Box } from "@saleor/macaw-ui-next";

import { RecentlyVisited } from "./recentlyVisited/RecentlyVisited";
import { DeprecationBanner } from "./DeprecationBanner/DeprecationBanner";
import { Menu } from "./menu";
import { MountingPoint } from "./MountingPoint";
import { UserInfo } from "./user";

export const SidebarContent = () => {
  const { isModalOpen, setModalState } = useAllRipplesModalState();

  return (
    <Box
      backgroundColor="default2"
      as="aside"
      height="100%"
      display="grid"
      __gridTemplateRows="auto 1fr auto"
    >
      <Box>
        <MountingPoint />
        <RecentlyVisited />
        <DeprecationBanner />
      </Box>
      <Menu />
      <UserInfo />
      <AllRipplesModal
        open={isModalOpen}
        onChange={open => {
          setModalState(open);
        }}
      />
    </Box>
  );
};
