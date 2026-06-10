import { type ProductTranslationsQuery, useProductTranslationsQuery } from "@dashboard/graphql";
import usePaginator, { PaginatorContext } from "@dashboard/hooks/usePaginator";
import TranslationsEntitiesList from "@dashboard/translations/components/TranslationsEntitiesList";
import { type TranslatableEntity } from "@dashboard/translations/components/TranslationsEntitiesList";
import { languageEntityUrl, TranslatableEntities } from "@dashboard/translations/urls";
import { mapEdgesToItems } from "@dashboard/utils/maps";

import { type TranslationsEntityListProps } from "./types";
import { sumCompleted } from "./utils";

const buildEntities = (
  translationsData: ProductTranslationsQuery["translations"],
): TranslatableEntity[] => {
  const items = mapEdgesToItems(translationsData) ?? [];

  const result: TranslatableEntity[] = [];

  for (const node of items) {
    if (node.__typename === "ProductTranslatableContent") {
      result.push({
        completion: {
          current: sumCompleted([
            node.translation?.description,
            node.translation?.name,
            node.translation?.seoDescription,
            node.translation?.seoTitle,
            ...(node.attributeValues?.map(({ translation }) => translation?.richText) || []),
          ]),
          max: 4 + (node.attributeValues?.length || 0),
        },
        id: node.product?.id ?? "",
        name: node.product?.name ?? "",
      });
    }
  }

  return result;
};

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

  return (
    <PaginatorContext.Provider value={paginationValues}>
      <TranslationsEntitiesList
        data-test-id="translation-list-view"
        disabled={loading}
        entities={buildEntities(data?.translations ?? null)}
        getRowHref={id => languageEntityUrl(variables.language, TranslatableEntities.products, id)}
      />
    </PaginatorContext.Provider>
  );
};

export default TranslationsProductList;
