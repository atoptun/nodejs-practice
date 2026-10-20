import prisma from "./db.ts";

async function main() {
  // Знаходимо рецепт за ID
  // const recipe = await prisma.recipe.findUnique({
  //   where: { id: 1 },
  // });

  // console.log("Знайдено рецепт:", recipe);

  // const quickRecipe = await prisma.recipe.findFirst({
  //   where: { cookingTime: { lte: 20 } },
  // });

  // console.log("Швидкий рецепт:", quickRecipe?.title);

  // const allRecipes = await prisma.recipe.findMany();

  // console.log("Всього рецептів:", allRecipes.length);
  // allRecipes.forEach((recipe) => {
  //   console.log(`- ${recipe.title} (${recipe.cookingTime} хв)`);
  // });

  // const dessertRecipes = await prisma.recipe.findMany({
  //   where: { categoryId: 1 },
  // });

  // console.log("Рецепти десертів:");
  // dessertRecipes.forEach((recipe) => {
  //   console.log(`- ${recipe.title}`);
  // });

  // const recipeWithCategory = await prisma.recipe.findUnique({
  //   where: { id: 1 },
  //   include: { category: true },
  // });

  // console.log("Рецепт:", recipeWithCategory);

  // const fullRecipe = await prisma.recipe.findUnique({
  //   where: { id: 2 },
  //   include: {
  //     category: true,
  //     tags: true,
  //     reviews: true,
  //   },
  // });

  // console.log("Рецепт:", fullRecipe?.title);
  // console.log("Категорія:", fullRecipe?.category.name);
  // console.log("Теги:", fullRecipe?.tags.map((t) => t.name).join(", "));
  // console.log("Відгуків:", fullRecipe?.reviews.length);

  // const recipesList = await prisma.recipe.findMany({
  //   select: {
  //     id: true,
  //     title: true,
  //     cookingTime: true,
  //     category: {
  //       select: { name: true },
  //     },
  //   },
  // });

  // console.log("Список рецептів:");
  // recipesList.forEach((recipe) => {
  //   console.log(
  //     `${recipe.title} - ${recipe.category.name} - ${recipe.cookingTime} хв`,
  //   );
  // });


}

try {
  await main();
} catch (error) {
  console.error(error);
} finally {
  await prisma.$disconnect();
}
