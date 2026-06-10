FROM node:24-alpine AS builder
RUN apk --no-cache add bash
RUN corepack enable && corepack prepare pnpm@10 --activate
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
ENV CI=1
RUN pnpm install --frozen-lockfile

COPY nginx/ nginx/
COPY assets/ assets/
COPY locale/ locale/
COPY scripts/ scripts/
COPY vite.config.js ./
COPY tsconfig.json ./
COPY codegen-main.ts ./
COPY graphql.config.ts ./
COPY *.d.ts ./
COPY schema-main.graphql ./
COPY .featureFlags/ .featureFlags/

# Copy only GraphQL-related files first for better layer caching
# This ensures codegen step is cached when non-GraphQL files change
COPY src/fragments/ src/fragments/
COPY src/searches/ src/searches/
COPY src/products/queries.ts src/products/queries.ts
COPY src/products/mutations.ts src/products/mutations.ts
COPY src/welcomePage/queries.ts src/welcomePage/queries.ts
COPY src/welcomePage/mutations.ts src/welcomePage/mutations.ts
COPY src/warehouses/queries.ts src/warehouses/queries.ts
COPY src/warehouses/mutations.ts src/warehouses/mutations.ts
COPY src/translations/queries.ts src/translations/queries.ts
COPY src/translations/mutations.ts src/translations/mutations.ts
COPY src/taxes/queries.ts src/taxes/queries.ts
COPY src/taxes/mutations.ts src/taxes/mutations.ts
COPY src/structures/queries.ts src/structures/queries.ts
COPY src/structures/mutations.ts src/structures/mutations.ts
COPY src/staff/queries.ts src/staff/queries.ts
COPY src/staff/mutations.ts src/staff/mutations.ts
COPY src/siteSettings/queries.ts src/siteSettings/queries.ts
COPY src/siteSettings/mutations.ts src/siteSettings/mutations.ts
COPY src/shipping/queries.ts src/shipping/queries.ts
COPY src/shipping/mutations.ts src/shipping/mutations.ts
COPY src/search/queries.ts src/search/queries.ts
COPY src/refundsSettings/queries.ts src/refundsSettings/queries.ts
COPY src/refundsSettings/mutations.ts src/refundsSettings/mutations.ts
COPY src/productTypes/queries.ts src/productTypes/queries.ts
COPY src/productTypes/mutations.ts src/productTypes/mutations.ts
COPY src/permissionGroups/queries.ts src/permissionGroups/queries.ts
COPY src/permissionGroups/mutations.ts src/permissionGroups/mutations.ts
COPY src/orders/queries.ts src/orders/queries.ts
COPY src/orders/mutations.ts src/orders/mutations.ts
COPY src/modeling/queries.ts src/modeling/queries.ts
COPY src/modeling/mutations.ts src/modeling/mutations.ts
COPY src/modelTypes/queries.ts src/modelTypes/queries.ts
COPY src/modelTypes/mutations.ts src/modelTypes/mutations.ts
COPY src/legacy-sdk/ src/legacy-sdk/
COPY src/giftCards/components/GiftCardCustomerCard/queries.ts src/giftCards/components/GiftCardCustomerCard/queries.ts
COPY src/giftCards/GiftCardsList/queries.ts src/giftCards/GiftCardsList/queries.ts
COPY src/giftCards/GiftCardsList/mutations.ts src/giftCards/GiftCardsList/mutations.ts
COPY src/giftCards/GiftCardUpdate/queries.ts src/giftCards/GiftCardUpdate/queries.ts
COPY src/giftCards/GiftCardUpdate/mutations.ts src/giftCards/GiftCardUpdate/mutations.ts
COPY src/giftCards/GiftCardUpdate/GiftCardUpdatePageHeader/mutations.ts src/giftCards/GiftCardUpdate/GiftCardUpdatePageHeader/mutations.ts
COPY src/giftCards/GiftCardUpdate/GiftCardResendCodeDialog/mutations.ts src/giftCards/GiftCardUpdate/GiftCardResendCodeDialog/mutations.ts
COPY src/giftCards/GiftCardSettings/queries.ts src/giftCards/GiftCardSettings/queries.ts
COPY src/giftCards/GiftCardSettings/mutations.ts src/giftCards/GiftCardSettings/mutations.ts
COPY src/giftCards/GiftCardExportDialogContent/mutations.ts src/giftCards/GiftCardExportDialogContent/mutations.ts
COPY src/giftCards/GiftCardCreateDialog/queries.ts src/giftCards/GiftCardCreateDialog/queries.ts
COPY src/giftCards/GiftCardCreateDialog/mutations.ts src/giftCards/GiftCardCreateDialog/mutations.ts
COPY src/giftCards/GiftCardBulkCreateDialog/mutations.ts src/giftCards/GiftCardBulkCreateDialog/mutations.ts
COPY src/files/mutations.ts src/files/mutations.ts
COPY src/extensions/queries.ts src/extensions/queries.ts
COPY src/extensions/mutations.ts src/extensions/mutations.ts
COPY src/extensions/components/AppAlerts/queries.ts src/extensions/components/AppAlerts/queries.ts
COPY src/discounts/queries.ts src/discounts/queries.ts
COPY src/discounts/mutations.ts src/discounts/mutations.ts
COPY src/customers/queries.ts src/customers/queries.ts
COPY src/customers/mutations.ts src/customers/mutations.ts
COPY src/containers/BackgroundTasks/queries.ts src/containers/BackgroundTasks/queries.ts
COPY src/components/Shop/queries.ts src/components/Shop/queries.ts
COPY src/components/NavigatorSearch/queries.ts src/components/NavigatorSearch/queries.ts
COPY src/components/DryRunItemsList/queries.ts src/components/DryRunItemsList/queries.ts
COPY src/components/DryRun/mutations.ts src/components/DryRun/mutations.ts
COPY src/components/ConditionalFilter/API/queries.ts src/components/ConditionalFilter/API/queries.ts
COPY src/components/AddressEdit/queries.ts src/components/AddressEdit/queries.ts
COPY src/collections/queries.ts src/collections/queries.ts
COPY src/collections/mutations.ts src/collections/mutations.ts
COPY src/channels/queries.ts src/channels/queries.ts
COPY src/channels/mutations.ts src/channels/mutations.ts
COPY src/categories/queries.ts src/categories/queries.ts
COPY src/categories/mutations.ts src/categories/mutations.ts
COPY src/auth/queries.ts src/auth/queries.ts
COPY src/auth/mutations.ts src/auth/mutations.ts
COPY src/utils/metadata/mutations.ts src/utils/metadata/mutations.ts

RUN pnpm run generate:main

# Copy remaining source files (this layer changes more frequently)
COPY src/ src/

ARG API_URL
ARG APP_MOUNT_URI
ARG EXTENSIONS_API_URL
ARG STATIC_URL
ARG SKIP_SOURCEMAPS
ARG LOCALE_CODE

ENV API_URL="${API_URL:-http://localhost:8000/graphql/}"
ENV APP_MOUNT_URI="${APP_MOUNT_URI:-/dashboard/}"
ENV EXTENSIONS_API_URL="${EXTENSIONS_API_URL}"
ENV STATIC_URL="${STATIC_URL:-/dashboard/}"
ENV SKIP_SOURCEMAPS="${SKIP_SOURCEMAPS:-true}"
ENV LOCALE_CODE="${LOCALE_CODE:-EN}"
RUN pnpm exec cross-env NODE_OPTIONS=--max-old-space-size=8192 vite build

FROM nginx:stable-alpine AS runner
WORKDIR /app

ARG COMMIT_ID
ARG PROJECT_VERSION

COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
COPY ./nginx/replace-env-vars.sh /docker-entrypoint.d/50-replace-env-vars.sh
COPY --from=builder /app/build/ /app/

LABEL \
  org.opencontainers.image.title="saleor/saleor-dashboard" \
  org.opencontainers.image.description="A GraphQL-powered, single-page dashboard application for Saleor." \
  org.opencontainers.image.url="https://saleor.io/" \
  org.opencontainers.image.source="https://github.com/saleor/saleor-dashboard" \
  org.opencontainers.image.revision="$COMMIT_ID" \
  org.opencontainers.image.version="$PROJECT_VERSION" \
  org.opencontainers.image.authors="Saleor Commerce (https://saleor.io)" \
  org.opencontainers.image.licenses="BSD 3"
