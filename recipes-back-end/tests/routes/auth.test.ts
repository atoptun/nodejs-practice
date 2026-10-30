import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import app from "../../app.ts";
import prisma from "../../prisma/client.ts";
import bcrypt from "bcrypt";

describe("Auth API", () => {
  describe("POST /api/auth/register", () => {
    it("реєструє нового користувача і повертає токени", async () => {
      const response = await request(app).post("/api/auth/register").send({
        username: "olena",
        email: "olena@example.com",
        password: "secret123",
        name: "Олена",
      });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("accessToken");
      expect(response.body).toHaveProperty("refreshToken");
      expect(response.body.user.username).toBe("olena");
      expect(response.body.user).not.toHaveProperty("password");
    });

    it("повертає 409, якщо username вже зайнятий", async () => {
      await prisma.user.create({
        data: {
          username: "olena",
          email: "different@example.com",
          password: await bcrypt.hash("secret123", 10),
          name: "Олена",
        },
      });

      const response = await request(app).post("/api/auth/register").send({
        username: "olena",
        email: "another@example.com",
        password: "secret123",
        name: "Інша Олена",
      });

      expect(response.status).toBe(409);
      expect(response.body).toHaveProperty("error");
    });

    it("повертає 422 при невалідних даних", async () => {
      const response = await request(app).post("/api/auth/register").send({
        username: "ok",
        email: "invalid-email",
        password: "123",
        name: "",
      });

      expect(response.status).toBe(422);
      expect(response.body).toHaveProperty("error");
      expect(response.body).toHaveProperty("details");
    });

  });

  describe("POST /api/auth/login", () => {
    beforeEach(async () => {
      await prisma.user.create({
        data: {
          username: "olena",
          email: "olena@example.com",
          password: await bcrypt.hash("secret123", 10),
          name: "Олена",
        },
      });
    });

    it("повертає токени при правильних credentials", async () => {
      const response = await request(app).post("/api/auth/login").send({
        username: "olena",
        password: "secret123",
      });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("accessToken");
      expect(response.body).toHaveProperty("refreshToken");
      expect(response.body.user.username).toBe("olena");
    });

    it("повертає 401 при неправильному паролі", async () => {
      const response = await request(app).post("/api/auth/login").send({
        username: "olena",
        password: "wrong_password",
      });

      expect(response.status).toBe(401);
    });

    it("повертає 401 для неіснуючого користувача", async () => {
      const response = await request(app).post("/api/auth/login").send({
        username: "nonexistent",
        password: "secret123",
      });

      expect(response.status).toBe(401);
    });
  });

});
