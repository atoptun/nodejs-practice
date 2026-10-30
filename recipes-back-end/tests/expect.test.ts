import { expect, test } from "vitest";

test("", () => {
  expect(2 + 2).toBe(4);
  expect("hello").toBe("hello");
  expect(true).toBe(true);

  // expect({ id: 1, name: "Борщ" }).toBe({ id: 1, name: "Борщ" });
  expect({ id: 1, name: "Борщ" }).toStrictEqual({ id: 1, name: "Борщ" });

  expect({ id: 1, name: "Борщ" }).toEqual({ id: 1, name: "Борщ" });
  expect([1, 2, 3]).toEqual([1, 2, 3]);

  expect("Олена").toBeTruthy();
  expect(null).toBeFalsy();
  expect(0).toBeFalsy();

  // expect(result).toBeNull();
  // expect(user.email).toBeDefined();
  expect(null).toBeNull();
  expect(undefined).not.toBeDefined();

  expect([1, 2, 3]).toContain(2);
  expect("борщ український").toContain("український");

  expect("hello").toHaveLength(5);
  expect([1, 2, 3]).toHaveLength(3);

  // expect(response.body).toHaveProperty("id");
  // expect(response.body).toHaveProperty("title", "Борщ");

  // expect(response.body.length).toBeGreaterThan(0);
  // expect(price).toBeLessThanOrEqual(1000);

  expect(() => parseInt("hello", 10)).not.toThrow();
  expect(() => {
    throw new Error("щось зламалось");
  }).toThrow();

  // expect(result).not.toBeNull();
  expect([1, 2, 3]).not.toContain(5);
  // expect(response.body.title).not.toBe("");
});
