import type { Request, Response } from "express";
import type { RegisterBody, User } from "../../types/user.js";

const users: User[] = [];

export const getRegister = async (req: Request, res: Response) => {
  res.render("users/register");
};

export const postRegister = async (req: Request, res: Response) => {
  const body = req.body as RegisterBody;
  console.log(body);

  const user: User = {
    username: body.username.trim(),
    email: body.email.trim().toLowerCase(),
    age: Number(body.age),
  };

  users.push(user);
  console.log("Всього користувачів:", users.length);

  res.redirect("/users/register-success");
};

export const getRegisterSuccess = async (req: Request, res: Response) => {
  res.render("users/register-success");
};

export const getSearch = async (req: Request, res: Response) => {
  const { q } = req.query as { q: string };

  if (!q) {
    return res.render("users/search");
  }

  const results = users.filter((user) =>
    user.username.toLowerCase().includes(q.toLowerCase()),
  );

  res.render("users/search", { q, found: results.length });
};
