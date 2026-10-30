import { describe, it, expect, beforeEach, vi } from "vitest";
import request from "supertest";
import bcrypt from "bcrypt";
import app from "../../app.ts";
import prisma from "../../prisma/client.ts";

vi.mock("bcrypt", () => ({
  default: {
    hash: vi.fn(async (password: string) => `hashed_${password}`),
    compare: vi.fn(async () => true),
  },
}));

describe("POST /api/auth/login (з моком bcrypt)", () => {
  beforeEach(async () => {
    await prisma.user.create({
      data: {
        username: "olena",
        email: "olena@example.com",
        password: "doesnt_matter",
        name: "Олена",
      },
    });
  });

  it("успішний вхід коли bcrypt.compare повертає true", async () => {
    vi.mocked(bcrypt.compare).mockResolvedValueOnce(true as never);

    const response = await request(app)
      .post("/api/auth/login")
      .send({ username: "olena", password: "будь-який пароль" });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("accessToken");
    expect(bcrypt.compare).toHaveBeenCalledWith(
      "будь-який пароль",
      "doesnt_matter",
    );
  });

  it("401 коли bcrypt.compare повертає false", async () => {
    vi.mocked(bcrypt.compare).mockResolvedValueOnce(false as never);

    const response = await request(app)
      .post("/api/auth/login")
      .send({ username: "olena", password: "wrong" });

    expect(response.status).toBe(401);
  });

  it("створює refresh token у базі при успішному вході", async () => {
    vi.mocked(bcrypt.compare).mockResolvedValueOnce(true as never);
    const createSpy = vi.spyOn(prisma.refreshToken, "create");

    await request(app)
      .post("/api/auth/login")
      .send({ username: "olena", password: "будь-який пароль" });

    expect(createSpy).toHaveBeenCalledOnce();
  });

});
