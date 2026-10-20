import prisma from "./db.ts";

async function main() {
  // Знайти швидкі рецепти - до 20 хвилин
  const quickRecipes = await prisma.recipe.findMany({
    where: {
      cookingTime: {
        lte: 20,
      },
    },
  });

  console.log("Швидкі рецепти (≤20 хв):");
  quickRecipes.forEach((r) => {
    console.log(`- ${r.title}: ${r.cookingTime} хв`);
  });

  // Рецепти які готуються більше години
  const longRecipes = await prisma.recipe.findMany({
    where: {
      cookingTime: { gt: 60 },
    },
  });

  console.log("Складні рецепти (>60 хв):");
  longRecipes.forEach((r) => {
    console.log(`- ${r.title}: ${r.cookingTime} хв`);
  });

  // Рецепти на 4, 6 або 8 порцій
  const specificServings = await prisma.recipe.findMany({
    where: {
      servings: { in: [4, 6, 8] },
    },
  });

  console.log("Рецепти на 4, 6 або 8 порцій:");
  specificServings.forEach((r) => {
    console.log(`- ${r.title}: ${r.servings} порцій`);
  });

  // Рецепти створені після певної дати
  const recentRecipes = await prisma.recipe.findMany({
    where: {
      createdAt: { gte: new Date("2026-01-01") },
    },
  });

  console.log("Рецепти створені у 2026 році:");
  recentRecipes.forEach((r) => {
    console.log(`- ${r.title}: ${r.createdAt.toLocaleDateString()}`);
  });

  const salads = await prisma.recipe.findMany({
    where: {
      title: {
        contains: "салат",
        mode: "insensitive",
      },
    },
  });

  console.log('Рецепти з "салат" в назві:');
  salads.forEach((r) => console.log(`- ${r.title}`));

  // Швидкі рецепти на багато порцій (І)
  const quickAndLarge = await prisma.recipe.findMany({
    where: {
      AND: [{ cookingTime: { lte: 30 } }, { servings: { gte: 4 } }],
    },
  });

  console.log("Швидкі рецепти на багато порцій:");
  quickAndLarge.forEach((r) => {
    console.log(`- ${r.title}: ${r.cookingTime} хв, ${r.servings} порцій`);
  });

  // Рецепти певних категорій (АБО)
  // const dessertsOrSalads = await prisma.recipe.findMany({
  //   where: {
  //     OR: [{ categoryId: 1 }, { categoryId: 2 }],
  //   },
  // });

  const dessertsOrSalads = await prisma.recipe.findMany({
    where: {
      categoryId: { in: [1, 2] },
    },
  });

  console.log("Десерти або салати:");
  dessertsOrSalads.forEach((r) => console.log(`- ${r.title}`));

  // Швидкі рецепти АБО рецепти на мало порцій
  const quickOrSmall = await prisma.recipe.findMany({
    where: {
      OR: [{ cookingTime: { lte: 20 } }, { servings: { lte: 2 } }],
    },
  });

  console.log("Швидкі рецепти або рецепти на мало порцій:");
  quickOrSmall.forEach((r) => {
    console.log(`- ${r.title}: ${r.cookingTime} хв, ${r.servings} порцій`);
  });

  // Всі рецепти крім десертів
  const notDesserts = await prisma.recipe.findMany({
    where: {
      NOT: {
        categoryId: 1,
      },
    },
  });

  console.log("Не десерти:");
  notDesserts.forEach((r) => console.log(`- ${r.title}`));

  // Швидкі десерти АБО будь-які салати
  const complexQuery = await prisma.recipe.findMany({
    where: {
      OR: [
        {
          AND: [{ categoryId: 1 }, { cookingTime: { lte: 60 } }],
        },
        { categoryId: 2 },
      ],
    },
  });

  console.log("Швидкі десерти або будь-які салати:");
  complexQuery.forEach((r) => {
    console.log(`- ${r.title}: ${r.cookingTime} хв, ${r.servings} порцій`);
  });
}

try {
  await main();
} catch (error) {
  console.error(error);
} finally {
  await prisma.$disconnect();
}
