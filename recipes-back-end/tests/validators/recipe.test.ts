import { describe, it, expect } from "vitest";
import { CreateRecipeSchema } from "../../src/validators/recipe.validator.ts";

describe("CreateRecipeSchema", () => {
  it("приймає валідні дані рецепту", () => {
    const validData = {
      title: "Борщ український",
      ingredients: ["буряк", "капуста", "картопля", "морква"],
      instructions: "Зварити бульйон, додати овочі, тушкувати протягом години",
      cookingTime: 90,
      servings: 6,
      categoryId: 1,
      tagIds: [1, 2],
    };

    const result = CreateRecipeSchema.safeParse(validData);

    expect(result.success).toBe(true);
  });

  it("відхиляє рецепт із занадто коротким title", () => {
    const invalidData = {
      title: "Бо",
      ingredients: ["буряк"],
      instructions: "Зварити бульйон, додати овочі, тушкувати протягом години",
      cookingTime: 90,
      servings: 6,
      categoryId: 1,
    };

    const result = CreateRecipeSchema.safeParse(invalidData);

    expect(result.success).toBe(false);
  });

  it("відхиляє рецепт з порожнім масивом ingredients", () => {
    const invalidData = {
      title: "Борщ український",
      ingredients: [],
      instructions: "Зварити бульйон, додати овочі, тушкувати протягом години",
      cookingTime: 90,
      servings: 6,
      categoryId: 1,
    };

    const result = CreateRecipeSchema.safeParse(invalidData);

    expect(result.success).toBe(false);
  });
});
