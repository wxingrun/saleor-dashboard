import {
  AllocationStrategyEnum,
  ChannelErrorCode,
  CountryCode,
  MarkAsPaidStrategyEnum,
  TransactionFlowStrategyEnum,
} from "@dashboard/graphql";

import { type FormData } from "./components/ChannelForm";
import { validateChannelFormData } from "./validation";

describe("validateChannelFormData", () => {
  const validFormData: FormData = {
    name: "Test Channel",
    slug: "test-channel",
    currencyCode: "USD",
    defaultCountry: CountryCode.US,
    allocationStrategy: AllocationStrategyEnum.PRIORITIZE_HIGH_STOCK,
    shippingZonesIdsToAdd: [],
    shippingZonesIdsToRemove: [],
    warehousesIdsToAdd: [],
    warehousesIdsToRemove: [],
    shippingZonesToDisplay: [],
    warehousesToDisplay: [],
    markAsPaidStrategy: MarkAsPaidStrategyEnum.TRANSACTION_FLOW,
    deleteExpiredOrdersAfter: 30,
    allowUnpaidOrders: false,
    defaultTransactionFlowStrategy: TransactionFlowStrategyEnum.AUTHORIZATION,
    automaticallyCompleteCheckouts: false,
    automaticCompletionDelay: null,
    automaticCompletionCutOffDate: "",
    automaticCompletionCutOffTime: "",
  };

  const requiredError = (field: string) => ({
    __typename: "ChannelError" as const,
    code: ChannelErrorCode.REQUIRED,
    field,
    message: null,
  });

  it.each<string>(["Test-Channel", "test channel", "!@#$"])(
    "should not return an error when slug contains unsupported format patterns like %s",
    (slug: string) => {
      // Arrange
      const data: FormData = {
        ...validFormData,
        slug,
      };

      // Act
      const errors = validateChannelFormData(data);

      // Assert
      expect(errors).toEqual([]);
    },
  );

  it("should return an error when currencyCode is an empty string", () => {
    // Arrange
    const data: FormData = {
      ...validFormData,
      currencyCode: "",
    };

    // Act
    const errors = validateChannelFormData(data);

    // Assert
    expect(errors).toEqual([requiredError("currencyCode")]);
  });

  it("should not return an error when defaultCountry is an invalid ISO 3166-1 alpha-2 code", () => {
    // Arrange
    const data: FormData = {
      ...validFormData,
      defaultCountry: "XX" as FormData["defaultCountry"],
    };

    // Act
    const errors = validateChannelFormData(data);

    // Assert
    expect(errors).toEqual([]);
  });

  it("should not return an error when defaultCountry is a valid ISO 3166-1 alpha-2 code", () => {
    // Arrange
    const data: FormData = {
      ...validFormData,
      defaultCountry: CountryCode.CN,
    };

    // Act
    const errors = validateChannelFormData(data);

    // Assert
    expect(errors).toEqual([]);
  });

  it("should return an error when slug is an empty string", () => {
    // Arrange
    const data: FormData = {
      ...validFormData,
      slug: "",
    };

    // Act
    const errors = validateChannelFormData(data);

    // Assert
    expect(errors).toEqual([requiredError("slug")]);
  });

  it("should not return an error when slug length exceeds 50 characters", () => {
    // Arrange
    const data: FormData = {
      ...validFormData,
      slug: "a".repeat(51),
    };

    // Act
    const errors = validateChannelFormData(data);

    // Assert
    expect(errors).toEqual([]);
  });
});
