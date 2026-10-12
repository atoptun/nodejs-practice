import prisma from "./db.ts";

async function main() {
  // Сортування за часом приготування (від меншого до більшого)
  const byTime = await prisma.recipe.findMany({
    orderBy: {
      cookingTime: "asc",
    },
  });

  console.log("Рецепти за часом приготування:");
  byTime.forEach((r) => {
    console.log(`- ${r.title}: ${r.cookingTime} хв`);
  });

  // Сортування за датою створення (новіші спочатку)
  const byDate = await prisma.recipe.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  console.log("Останні рецепти:");
  byDate.forEach((r) => {
    console.log(`- ${r.title}: ${r.createdAt.toLocaleDateString()}`);
  });

  // Спочатку за категорією, потім за часом приготування
  const multiSort = await prisma.recipe.findMany({
    orderBy: [{ categoryId: "asc" }, { cookingTime: "asc" }],
    include: { category: true },
  });

  console.log("Рецепти за категорією та часом:");
  multiSort.forEach((r) => {
    console.log(`- ${r.category.name}: ${r.title} (${r.cookingTime} хв)`);
  });
}

try {
  await main();
} catch (error) {
  console.error(error);
} finally {
  await prisma.$disconnect();
}
