import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import app from "../../app.ts";
import prisma from "../../prisma/client.ts";
import { createAuthUser } from "../helpers/auth.ts";

describe("Recipes API", () => {
  describe("GET /api/recipes", () => {
    let userId: number;
    let categoryId: number;

    beforeEach(async () => {
      const user = await prisma.user.create({
        data: {
          username: "olena",
          email: "olena@example.com",
          password: "hashed_password",
          name: "Олена",
        },
      });
      userId = user.id;

      const category = await prisma.category.create({
        data: { name: "Українська кухня" },
      });
      categoryId = category.id;
    });

    it("повертає порожній список, коли в базі немає рецептів", async () => {
      const response = await request(app).get("/api/recipes");

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual([]);
    });

    it("повертає список рецептів", async () => {
      await prisma.recipe.create({
        data: {
          title: "Борщ",
          ingredients: ["буряк", "капуста", "картопля"],
          instructions:
            "Зварити бульйон, додати овочі, тушкувати протягом години",
          cookingTime: 90,
          servings: 6,
          userId,
          categoryId,
        },
      });

      const response = await request(app).get("/api/recipes");

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].title).toBe("Борщ");
      expect(response.body.pagination.total).toBe(1);
    });
  });

  describe("GET /api/recipes/:id", () => {
    let recipeId: number;

    beforeEach(async () => {
      const user = await prisma.user.create({
        data: {
          username: "olena",
          email: "olena@example.com",
          password: "hashed_password",
          name: "Олена",
        },
      });

      const category = await prisma.category.create({
        data: { name: "Українська кухня" },
      });

      const recipe = await prisma.recipe.create({
        data: {
          title: "Борщ",
          ingredients: ["буряк", "капуста", "картопля"],
          instructions:
            "Зварити бульйон, додати овочі, тушкувати протягом години",
          cookingTime: 90,
          servings: 6,
          userId: user.id,
          categoryId: category.id,
        },
      });
      recipeId = recipe.id;
    });

    it("повертає рецепт за існуючим id", async () => {
      const response = await request(app).get(`/api/recipes/${recipeId}`);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(recipeId);
      expect(response.body.title).toBe("Борщ");
      expect(response.body).toHaveProperty("category");
      expect(response.body).toHaveProperty("user");
    });

    it("повертає 404 для неіснуючого id", async () => {
      const response = await request(app).get("/api/recipes/999999");

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("error");
    });

    it("повертає 400 для невалідного id", async () => {
      const response = await request(app).get("/api/recipes/abc");

      expect(response.status).toBe(400);
    });
  });

  describe("POST /api/recipes", () => {
    let accessToken: string;
    let categoryId: number;

    beforeEach(async () => {
      const auth = await createAuthUser();
      accessToken = auth.accessToken;

      const category = await prisma.category.create({
        data: { name: "Українська кухня" },
      });
      categoryId = category.id;
    });

    it("створює рецепт з валідним токеном", async () => {
      const response = await request(app)
        .post("/api/recipes")
        .set("Authorization", `Bearer ${accessToken}`)
        .send({
          title: "Борщ",
          ingredients: ["буряк", "капуста", "картопля"],
          instructions:
            "Зварити бульйон, додати овочі, тушкувати протягом години",
          cookingTime: 90,
          servings: 6,
          categoryId,
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("id");
      expect(response.body.title).toBe("Борщ");
      expect(response.body.user.username).toBe("testuser");
    });

    it("повертає 401 без токена", async () => {
      const response = await request(app)
        .post("/api/recipes")
        .send({
          title: "Борщ",
          ingredients: ["буряк", "капуста", "картопля"],
          instructions:
            "Зварити бульйон, додати овочі, тушкувати протягом години",
          cookingTime: 90,
          servings: 6,
          categoryId,
        });

      expect(response.status).toBe(401);
    });

    it("повертає 401 з невалідним токеном", async () => {
      const response = await request(app)
        .post("/api/recipes")
        .set("Authorization", "Bearer invalid_token_here")
        .send({
          title: "Борщ",
          ingredients: ["буряк", "капуста", "картопля"],
          instructions:
            "Зварити бульйон, додати овочі, тушкувати протягом години",
          cookingTime: 90,
          servings: 6,
          categoryId,
        });

      expect(response.status).toBe(401);
    });
  });

  describe("POST /api/recipes - валідація", () => {
    let accessToken: string;
    let categoryId: number;

    beforeEach(async () => {
      const auth = await createAuthUser();
      accessToken = auth.accessToken;

      const category = await prisma.category.create({
        data: { name: "Українська кухня" },
      });
      categoryId = category.id;
    });

    it("повертає 422 при відсутності обов'язкових полів", async () => {
      const response = await request(app)
        .post("/api/recipes")
        .set("Authorization", `Bearer ${accessToken}`)
        .send({});

      expect(response.status).toBe(422);
      expect(response.body.error).toBe("Validation failed");
      expect(response.body.details).toHaveProperty("title");
      expect(response.body.details).toHaveProperty("ingredients");
      expect(response.body.details).toHaveProperty("instructions");
    });

    it("повертає 422 при занадто короткому title", async () => {
      const response = await request(app)
        .post("/api/recipes")
        .set("Authorization", `Bearer ${accessToken}`)
        .send({
          title: "Бо",
          ingredients: ["буряк"],
          instructions:
            "Зварити бульйон, додати овочі, тушкувати протягом години",
          cookingTime: 90,
          servings: 6,
          categoryId,
        });

      expect(response.status).toBe(422);
      expect(response.body.details).toHaveProperty("title");
    });

    it("повертає 422 при cookingTime поза діапазоном", async () => {
      const response = await request(app)
        .post("/api/recipes")
        .set("Authorization", `Bearer ${accessToken}`)
        .send({
          title: "Борщ",
          ingredients: ["буряк"],
          instructions:
            "Зварити бульйон, додати овочі, тушкувати протягом години",
          cookingTime: 9999,
          servings: 6,
          categoryId,
        });

      expect(response.status).toBe(422);
      expect(response.body.details).toHaveProperty("cookingTime");
    });
  });

  describe("PATCH /api/recipes/:id", () => {
    let ownerToken: string;
    let otherUserToken: string;
    let recipeId: number;

    beforeEach(async () => {
      const owner = await createAuthUser({
        username: "owner",
        email: "owner@example.com",
      });
      ownerToken = owner.accessToken;

      const other = await createAuthUser({
        username: "other",
        email: "other@example.com",
      });
      otherUserToken = other.accessToken;

      const category = await prisma.category.create({
        data: { name: "Українська кухня" },
      });

      const recipe = await prisma.recipe.create({
        data: {
          title: "Борщ",
          ingredients: ["буряк", "капуста", "картопля"],
          instructions:
            "Зварити бульйон, додати овочі, тушкувати протягом години",
          cookingTime: 90,
          servings: 6,
          userId: owner.user.id,
          categoryId: category.id,
        },
      });
      recipeId = recipe.id;
    });

    it("дозволяє власнику оновити рецепт", async () => {
      const response = await request(app)
        .patch(`/api/recipes/${recipeId}`)
        .set("Authorization", `Bearer ${ownerToken}`)
        .send({ title: "Зелений борщ" });

      expect(response.status).toBe(200);
      expect(response.body.title).toBe("Зелений борщ");
    });

    it("повертає 403 при спробі оновити чужий рецепт", async () => {
      const response = await request(app)
        .patch(`/api/recipes/${recipeId}`)
        .set("Authorization", `Bearer ${otherUserToken}`)
        .send({ title: "Зелений борщ" });

      expect(response.status).toBe(403);
    });

    it("повертає 404 для неіснуючого id", async () => {
      const response = await request(app)
        .patch("/api/recipes/999999")
        .set("Authorization", `Bearer ${ownerToken}`)
        .send({ title: "Зелений борщ" });

      expect(response.status).toBe(404);
    });
  });
});
