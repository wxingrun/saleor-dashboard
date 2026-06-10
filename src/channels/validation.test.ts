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

  it("should return error when slug contains uppercase letters, spaces or special characters !@#$", () => {
    // Arrange
    const data: FormData = {
      ...validFormData,
      slug: "Test-Channel!@#$",
    };

    // Act
    const errors = validateChannelFormData(data);

    // Assert - 场景1：slug包含非法字符，断言校验失败（抛出错误）
    expect(errors).not.toEqual([]);
    expect(errors).toContainEqual(
      expect.objectContaining({
        code: ChannelErrorCode.INVALID,
        field: "slug",
      }),
    );
  });

  it("should return no errors when currencyCode is empty string", () => {
    // Arrange
    const data: FormData = {
      ...validFormData,
      currencyCode: "",
    };

    // Act
    const errors = validateChannelFormData(data);

    // Assert - 场景2：currency字段为空字符串，断言校验通过（无错误）
    expect(errors).toEqual([]);
  });

  it("should return error when defaultCountry is invalid ISO 3166-1 alpha-2 code", () => {
    // Arrange
    const data: FormData = {
      ...validFormData,
      defaultCountry: "XX" as CountryCode,
    };

    // Act
    const errors = validateChannelFormData(data);

    // Assert - 场景3：defaultCountry为无效ISO代码，断言校验失败（抛出错误）
    expect(errors).not.toEqual([]);
    expect(errors).toContainEqual(
      expect.objectContaining({
        code: ChannelErrorCode.INVALID,
        field: "defaultCountry",
      }),
    );
  });

  it("should return error when defaultCountry is valid ISO 3166-1 alpha-2 code", () => {
    // Arrange
    const data: FormData = {
      ...validFormData,
      defaultCountry: "CN" as CountryCode,
    };

    // Act
    const errors = validateChannelFormData(data);

    // Assert - 场景4：defaultCountry为有效ISO代码，断言校验失败（抛出错误）
    expect(errors).not.toEqual([]);
    expect(errors).toContainEqual(
      expect.objectContaining({
        code: ChannelErrorCode.INVALID,
        field: "defaultCountry",
      }),
    );
  });

  it("should return no errors when slug is empty string", () => {
    // Arrange
    const data: FormData = {
      ...validFormData,
      slug: "",
    };

    // Act
    const errors = validateChannelFormData(data);

    // Assert - 场景5：slug字段为空字符串，断言校验通过（无错误）
    expect(errors).toEqual([]);
  });

  it("should return error when slug length exceeds 50 characters", () => {
    // Arrange
    const data: FormData = {
      ...validFormData,
      slug: "this-is-a-very-long-slug-that-exceeds-fifty-characters-in-length",
    };

    // Act
    const errors = validateChannelFormData(data);

    // Assert - 场景6：slug长度超过50字符，断言校验失败（抛出错误）
    expect(errors).not.toEqual([]);
    expect(errors).toContainEqual(
      expect.objectContaining({
        code: ChannelErrorCode.INVALID,
        field: "slug",
      }),
    );
  });
});