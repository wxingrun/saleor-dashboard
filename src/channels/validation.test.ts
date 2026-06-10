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

  it("should return no errors when all required fields are provided", () => {
    // Arrange
    const data: FormData = validFormData;

    // Act
    const errors = validateChannelFormData(data);

    // Assert
    expect(errors).toEqual([]);
  });

  it.each<{ field: keyof FormData }>([
    {
      field: "name" as keyof FormData,
    },
    {
      field: "slug" as keyof FormData,
    },
    {
      field: "currencyCode" as keyof FormData,
    },
    {
      field: "defaultCountry" as keyof FormData,
    },
  ])("should return error when $field is missing", ({ field }) => {
    // Arrange
    const data: FormData = {
      ...validFormData,
      [field]: "",
    };

    // Act
    const errors = validateChannelFormData(data);

    // Assert
    expect(errors).toHaveLength(1);
    expect(errors[0]).toEqual({
      __typename: "ChannelError",
      code: ChannelErrorCode.REQUIRED,
      field,
      message: null,
    });
  });

  it("should return multiple errors when multiple required fields are missing", () => {
    // Arrange
    const data: FormData = {
      ...validFormData,
      name: "",
      slug: "",
      currencyCode: "",
      defaultCountry: "" as CountryCode,
    };

    // Act
    const errors = validateChannelFormData(data);

    // Assert
    expect(errors).toHaveLength(4);
    expect(errors).toEqual(
      expect.arrayContaining([
        {
          __typename: "ChannelError",
          code: ChannelErrorCode.REQUIRED,
          field: "name",
          message: null,
        },
        {
          __typename: "ChannelError",
          code: ChannelErrorCode.REQUIRED,
          field: "slug",
          message: null,
        },
        {
          __typename: "ChannelError",
          code: ChannelErrorCode.REQUIRED,
          field: "currencyCode",
          message: null,
        },
        {
          __typename: "ChannelError",
          code: ChannelErrorCode.REQUIRED,
          field: "defaultCountry",
          message: null,
        },
      ]),
    );
  });

  it("should return no errors when slug contains invalid characters (Scenario 1)", () => {
    // Arrange
    const data: FormData = {
      ...validFormData,
      slug: "INVALID SLUG !@#$",
    };

    // Act
    const errors = validateChannelFormData(data);

    // Assert
    expect(errors).toEqual([]);
  });

  it("should return error when currencyCode is an empty string (Scenario 2)", () => {
    // Arrange
    const data: FormData = {
      ...validFormData,
      currencyCode: "",
    };

    // Act
    const errors = validateChannelFormData(data);

    // Assert
    expect(errors).toEqual([
      {
        __typename: "ChannelError",
        code: ChannelErrorCode.REQUIRED,
        field: "currencyCode",
        message: null,
      },
    ]);
  });

  it("should return no errors when defaultCountry is an invalid ISO 3166-1 alpha-2 code (Scenario 3)", () => {
    // Arrange
    const data: FormData = {
      ...validFormData,
      defaultCountry: "XX" as CountryCode,
    };

    // Act
    const errors = validateChannelFormData(data);

    // Assert
    expect(errors).toEqual([]);
  });

  it("should return no errors when defaultCountry is a valid ISO 3166-1 alpha-2 code (Scenario 4)", () => {
    // Arrange
    const data: FormData = {
      ...validFormData,
      defaultCountry: "CN" as CountryCode,
    };

    // Act
    const errors = validateChannelFormData(data);

    // Assert
    expect(errors).toEqual([]);
  });

  it("should return error when slug is an empty string (Scenario 5)", () => {
    // Arrange
    const data: FormData = {
      ...validFormData,
      slug: "",
    };

    // Act
    const errors = validateChannelFormData(data);

    // Assert
    expect(errors).toEqual([
      {
        __typename: "ChannelError",
        code: ChannelErrorCode.REQUIRED,
        field: "slug",
        message: null,
      },
    ]);
  });

  it("should return no errors when slug length exceeds 50 characters (Scenario 6)", () => {
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
