import type { Request, Response } from "express";


export const getArticle = async (req: Request, res: Response) => {
  const article = {
    title: "Історія Node.js",
    content:
      "<p>Node.js створений у <strong>2009 році</strong> Раяном Далом.</p><p>Він базується на движку V8.</p>",
  };
  res.render("article", { article: article });
};