import prisma from "./db.ts";

async function main() {
  const stats = await prisma.recipe.aggregate({
    _avg: {
      cookingTime: true,
      servings: true,
    },
    _max: {
      cookingTime: true,
    },
    _min: {
      cookingTime: true,
    },
    _count: true,
  });

  console.log("Статистика рецептів:");
  console.log(`- Всього: ${stats._count}`);
  console.log(`- Середній час: ${Math.round(stats._avg.cookingTime ?? 0)} хв`);
  console.log(
    `- Середня кількість порцій: ${Math.round(stats._avg.servings ?? 0)}`,
  );
  console.log(`- Найдовший: ${stats._max.cookingTime} хв`);
  console.log(`- Найкоротший: ${stats._min.cookingTime} хв`);

    const dessertStats = await prisma.recipe.aggregate({
      where: { categoryId: 1 },
      _avg: { cookingTime: true },
    });

    console.log(
      `\nСередній час для десертів: ${Math.round(dessertStats._avg.cookingTime ?? 0)} хв`,
    );

}

try {
  await main();
} catch (error) {
  console.error(error);
} finally {
  await prisma.$disconnect();
}
