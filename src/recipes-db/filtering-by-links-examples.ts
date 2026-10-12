import prisma from "./db.ts";

async function main() {
  // Рецепти з тегом "Вегетаріанське"
  const vegetarianRecipes = await prisma.recipe.findMany({
    where: {
      tags: {
        some: {
          name: "Вегетаріанське",
        },
      },
    },
    include: { tags: true },
  });

  console.log("Вегетаріанські рецепти:");
  vegetarianRecipes.forEach((r) => {
    console.log(`- ${r.title}`);
    console.log(`  Теги: ${r.tags.map((t) => t.name).join(", ")}`);
  });

  const notComplex = await prisma.recipe.findMany({
    where: {
      tags: {
        none: {
          name: "Складне",
        },
      },
    },
  });

  console.log('\nРецепти без тегу "Складне":');
  notComplex.forEach((r) => {
    console.log(`- ${r.title}`);
  });

  const categoriesWithQuickRecipes = await prisma.category.findMany({
    where: {
      recipes: {
        some: {
          cookingTime: { lte: 20 },
        },
      },
    },
    include: { recipes: true },
  });

  console.log("\nКатегорії зі швидкими рецептами:");
  categoriesWithQuickRecipes.forEach((cat) => {
    console.log(`- ${cat.name}: ${cat.recipes.length} рецептів`);
  });

  const quickVegetarian = await prisma.recipe.findMany({
    where: {
      AND: [
        { cookingTime: { lte: 30 } },
        {
          tags: {
            some: { name: "Вегетаріанське" },
          },
        },
      ],
    },
  });

  console.log("\nШвидкі вегетаріанські рецепти:");
  quickVegetarian.forEach((r) => {
    console.log(`- ${r.title}`);
  });
}

try {
  await main();
} catch (error) {
  console.error(error);
} finally {
  await prisma.$disconnect();
}
