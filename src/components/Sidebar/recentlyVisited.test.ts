import {
  addRecentlyVisitedEntry,
  readRecentlyVisitedEntries,
  RECENTLY_VISITED_STORAGE_KEY,
  type RecentlyVisitedEntry,
} from "./recentlyVisited";

const createEntry = (
  id: string,
  entityType: RecentlyVisitedEntry["entityType"],
  label: string,
): RecentlyVisitedEntry => ({
  entityType,
  id,
  label,
  url: `/${entityType}s/${id}?`,
});

describe("recentlyVisited", () => {
  beforeEach(() => {
    // Arrange
    localStorage.clear();
  });

  it("should store most recent entries at the top", () => {
    // Arrange
    const productEntry = createEntry("product-1", "product", "Bean Juice");
    const orderEntry = createEntry("order-1", "order", "#1001");
    const customerEntry = createEntry("customer-1", "customer", "John Doe");

    // Act
    addRecentlyVisitedEntry(productEntry);
    addRecentlyVisitedEntry(orderEntry);
    addRecentlyVisitedEntry(customerEntry);

    // Assert
    expect(readRecentlyVisitedEntries()).toEqual([customerEntry, orderEntry, productEntry]);
  });

  it("should move duplicated entry to the top without adding duplicates", () => {
    // Arrange
    const productEntry = createEntry("product-1", "product", "Bean Juice");
    const orderEntry = createEntry("order-1", "order", "#1001");

    addRecentlyVisitedEntry(productEntry);
    addRecentlyVisitedEntry(orderEntry);

    // Act
    addRecentlyVisitedEntry(productEntry);

    // Assert
    expect(readRecentlyVisitedEntries()).toEqual([productEntry, orderEntry]);
  });

  it("should keep only the latest five entries", () => {
    // Arrange
    const entries = [
      createEntry("product-1", "product", "Bean Juice"),
      createEntry("order-1", "order", "#1001"),
      createEntry("customer-1", "customer", "John Doe"),
      createEntry("product-2", "product", "Winter Jacket"),
      createEntry("order-2", "order", "#1002"),
      createEntry("customer-2", "customer", "Jane Doe"),
    ];

    // Act
    entries.forEach(addRecentlyVisitedEntry);

    // Assert
    expect(readRecentlyVisitedEntries()).toEqual(entries.slice(1).reverse());
  });

  it("should read persisted entries from localStorage", () => {
    // Arrange
    const entries = [
      createEntry("product-1", "product", "Bean Juice"),
      createEntry("order-1", "order", "#1001"),
    ];

    localStorage.setItem(RECENTLY_VISITED_STORAGE_KEY, JSON.stringify(entries));

    // Act
    const result = readRecentlyVisitedEntries();

    // Assert
    expect(result).toEqual(entries);
  });
});
