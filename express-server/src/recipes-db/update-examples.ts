import prisma from './db.ts'

async function main() {
  // const updatedRecipe = await prisma.recipe.update({
  //   where: { id: 1 },
  //   data: {
  //     cookingTime: 50,
  //     servings: 10,
  //   },
  // })

  // console.log('Оновлено рецепт:', updatedRecipe.title)
  // console.log('Новий час приготування:', updatedRecipe.cookingTime)
  // console.log('Нова кількість порцій:', updatedRecipe.servings)

  const result = await prisma.recipe.updateMany({
    where: { categoryId: 1 },
    data: { chefName: "Олена Шевченко" },
  });

  console.log("Оновлено рецептів:", result.count);
}

try {
  await main()
} catch (error) {
  console.error(error)
} finally {
  await prisma.$disconnect()
}
