import { type ProductTranslationsQuery, useProductTranslationsQuery } from "@dashboard/graphql";
import usePaginator, { PaginatorContext } from "@dashboard/hooks/usePaginator";
import TranslationsEntitiesList, {
  type TranslatableEntity,
} from "@dashboard/translations/components/TranslationsEntitiesList";
import { languageEntityUrl, TranslatableEntities } from "@dashboard/translations/urls";
import { mapEdgesToItems } from "@dashboard/utils/maps";

import { type TranslationsEntityListProps } from "./types";
import { sumCompleted } from "./utils";

type ProductTranslationsNode = NonNullable<
  NonNullable<ProductTranslationsQuery["translations"]>["edges"]
>[number]["node"];

const TranslationsProductList = ({ params, variables }: TranslationsEntityListProps) => {
  const { data, loading } = useProductTranslationsQuery({
    displayLoader: true,
    variables,
  });
  const paginationValues = usePaginator({
    pageInfo: data?.translations?.pageInfo,
    paginationState: variables,
    queryString: params,
  });
  const entities = (mapEdgesToItems<ProductTranslationsNode>(data?.translations) ?? []).reduce<
    TranslatableEntity[]
  >((acc, node) => {
    if (node.__typename === "ProductTranslatableContent") {
      acc.push({
        completion: {
          current: sumCompleted([
            node.translation?.description,
            node.translation?.name,
            node.translation?.seoDescription,
            node.translation?.seoTitle,
            ...(node.attributeValues.map(({ translation }) => translation?.richText) ?? []),
          ]),
          max: 4 + (node.attributeValues.length ?? 0),
        },
        id: node.product?.id ?? "",
        name: node.product?.name ?? "",
      });
    }

    return acc;
  }, []);

  return (
    <PaginatorContext.Provider value={paginationValues}>
      <TranslationsEntitiesList
        data-test-id="translation-list-view"
        disabled={loading}
        entities={entities}
        getRowHref={id => languageEntityUrl(variables.language, TranslatableEntities.products, id)}
      />
    </PaginatorContext.Provider>
  );
};

export default TranslationsProductList;
