import { describe, it, expect } from "vitest";

describe("Vitest environment", () => {
  it("використовує тестовий DATABASE_URL", () => {
    expect(process.env.DATABASE_URL).toContain("recipes_test");
  });
});

