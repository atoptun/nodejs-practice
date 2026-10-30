import prisma from "../../prisma/client.ts";

export async function cleanDatabase() {
  await prisma.review.deleteMany();
  await prisma.recipe.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.category.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.user.deleteMany();
}
