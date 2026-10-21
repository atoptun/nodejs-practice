import prisma from './prisma/client.ts'

async function main() {
  // Створюємо категорії
  const desserts = await prisma.category.create({
    data: {
      name: 'Десерти',
      description: 'Солодкі страви та випічка',
    },
  })

  const salads = await prisma.category.create({
    data: {
      name: 'Салати',
      description: "Свіжі овочеві та м'ясні салати",
    },
  })

  console.log('Створено категорії:', desserts, salads)

  // Створюємо теги
  const vegTag = await prisma.tag.create({
    data: { name: 'Вегетаріанське' },
  })

  const quickTag = await prisma.tag.create({
    data: { name: 'Швидке' },
  })

  const summerTag = await prisma.tag.create({
    data: { name: 'Літнє' },
  })

  console.log('Створено теги')

  // Створюємо рецепт з категорією та тегами
  const brownie = await prisma.recipe.create({
    data: {
      title: 'Шоколадний брауні',
      ingredients: [
        '200г шоколаду',
        '100г вершкового масла',
        '3 яйця',
        '150г цукру',
        '80г борошна',
      ],
      instructions:
        'Розтопити шоколад з маслом. Збити яйця з цукром. Змішати все разом, додати борошно. Випікати 25 хвилин при 180°C.',
      cookingTime: 45,
      servings: 8,
      chefName: 'Олена Кравець',
      categoryId: desserts.id,
      tags: {
        connect: [{ id: quickTag.id }],
      },
    },
  })

  console.log('Створено рецепт брауні')

  // Створюємо рецепт з відгуками
  const salad = await prisma.recipe.create({
    data: {
      title: 'Овочевий салат',
      ingredients: ['Помідори', 'огірки', 'перець', 'оливкова олія', 'сіль'],
      instructions: 'Нарізати овочі, заправити олією.',
      cookingTime: 15,
      servings: 4,
      chefName: 'Іван Сидоренко',
      categoryId: salads.id,
      tags: {
        connect: [{ id: vegTag.id }, { id: quickTag.id }, { id: summerTag.id }],
      },
      reviews: {
        create: [
          {
            content: 'Дуже смачний та освіжаючий салат!',
            rating: 5,
            reviewerName: 'Марія',
          },
          {
            content: 'Простий але ефективний рецепт',
            rating: 4,
            reviewerName: 'Петро',
          },
        ],
      },
    },
  })

  console.log('Створено рецепт салату з відгуками')

  const recipe = await prisma.recipe.create({
    data: {
      title: 'Наполеон',
      ingredients: [
        '500г листкового тіста',
        '1л молока',
        '3 яйця',
        '200г цукру',
        '3 ст.л. борошна',
      ],
      instructions:
        'Випекти коржі з тіста. Зварити крем з молока, яєць, цукру та борошна. Зібрати торт пошарово.',
      cookingTime: 120,
      servings: 12,
      chefName: 'Марія Іванова',
      category: {
        connectOrCreate: {
          where: { name: 'Торти' },
          create: {
            name: 'Торти',
            description: 'Святкові торти та пироги',
          },
        },
      },
      tags: {
        connectOrCreate: [
          {
            where: { name: 'Складне' },
            create: { name: 'Складне' },
          },
          {
            where: { name: 'Святкове' },
            create: { name: 'Святкове' },
          },
        ],
      },
      reviews: {
        create: [
          {
            content: 'Найкращий Наполеон який я куштувала!',
            rating: 5,
            reviewerName: 'Оксана',
          },
        ],
      },
    },
  })

  console.log('Створено рецепт:', recipe.title)
}

try {
  await main()
} catch (error) {
  console.error(error)
} finally {
  await prisma.$disconnect()
}
