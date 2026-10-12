import prisma from "./db.ts";

async function main() {
  const recipe = await prisma.recipe.create({
    data: {
      title: "Наполеон",
      ingredients: [
        "500г листкового тіста",
        "1л молока",
        "3 яйця",
        "200г цукру",
        "3 ст.л. борошна",
      ],
      instructions:
        "Випекти коржі з тіста. Зварити крем з молока, яєць, цукру та борошна. Зібрати торт пошарово.",
      cookingTime: 120,
      servings: 12,
      difficulty: 5,
      chefName: "Марія Іванова",
      category: {
        connectOrCreate: {
          where: { name: "Торти" },
          create: {
            name: "Торти",
            description: "Святкові торти та пироги",
          },
        },
      },
      tags: {
        connectOrCreate: [
          {
            where: { name: "Складне" },
            create: { name: "Складне" },
          },
          {
            where: { name: "Святкове" },
            create: { name: "Святкове" },
          },
        ],
      },
      reviews: {
        create: [
          {
            content: "Найкращий Наполеон який я куштувала!",
            rating: 5,
            reviewerName: "Оксана",
          },
        ],
      },
    },
  });

  console.log("Створено рецепт:", recipe.title);
}

try {
  await main();
} catch (error) {
  console.error(error);
} finally {
  await prisma.$disconnect();
}
