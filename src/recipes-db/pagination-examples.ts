import prisma from "./db.ts";


async function getRecipesPage(pageNumber: number, pageSize: number) {
  const recipes = await prisma.recipe.findMany({
    skip: (pageNumber - 1) * pageSize,
    take: pageSize,
    orderBy: { createdAt: "desc" },
  });

  return recipes;
}

async function getRecipesPageWithTotal(pageNumber: number, pageSize: number) {
  const [recipes, total] = await Promise.all([
    prisma.recipe.findMany({
      skip: (pageNumber - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: "desc" },
    }),
    prisma.recipe.count(),
  ]);

  const totalPages = Math.ceil(total / pageSize);

  return {
    recipes,
    pagination: {
      currentPage: pageNumber,
      pageSize,
      totalRecords: total,
      totalPages,
    },
  };
}




async function main() {
  // Перша сторінка - перші 2 рецепти
  const page1 = await prisma.recipe.findMany({
    take: 2,
    orderBy: { createdAt: "desc" },
  });

  console.log("Сторінка 1:");
  page1.forEach((r) => console.log(`- ${r.title}`));

  // Друга сторінка - наступні 2 рецепти
  const page2 = await prisma.recipe.findMany({
    skip: 2,
    take: 2,
    orderBy: { createdAt: "desc" },
  });

  console.log("Сторінка 2:");
  page2.forEach((r) => console.log(`- ${r.title}`));

  // Отримати третю сторінку по 5 рецептів
  const page3 = await getRecipesPage(3, 5);

  const result = await getRecipesPageWithTotal(1, 5);
  console.log(
    `Сторінка ${result.pagination.currentPage} з ${result.pagination.totalPages}`,
  );
  console.log(`Всього рецептів: ${result.pagination.totalRecords}`);

  // Перша сторінка
  const firstPage = await prisma.recipe.findMany({
    take: 2,
    orderBy: { id: "asc" },
  });

  // Беремо ID останнього рецепта як курсор
  const lastRecipe = firstPage[firstPage.length - 1];

  // Друга сторінка починається після курсора
  const secondPage = await prisma.recipe.findMany({
    take: 2,
    skip: 1, // пропустити сам курсор
    cursor: {
      id: lastRecipe?.id || 0,
    },
    orderBy: { id: "asc" },
  });
}

try {
  await main();
} catch (error) {
  console.error(error);
} finally {
  prisma.$disconnect();
}
