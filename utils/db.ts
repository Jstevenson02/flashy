import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getGroups = async () => {
  return await prisma.group.findMany();
};

export const createGroup = async (name: string) => {
  return await prisma.group.create({
    data: {
      name,
    },
  });
};

export const getGroupById = async (id: string) => {
  return await prisma.group.findUnique({
    where: { id: Number(id) },
    include: { cardStacks: true },
  });
};

export const createCardStack = async (groupId: string, name: string) => {
  return await prisma.cardStack.create({
    data: {
      name,
      groupId: Number(groupId),
    },
  });
};

export const getCardStacksByGroupId = async (groupId: string) => {
  return await prisma.cardStack.findMany({
    where: { groupId: Number(groupId) },
  });
};

export const getCardsByStackId = async (stackId: string) => {
  return await prisma.card.findMany({
    where: { stackId: Number(stackId) },
  });
};

export const createCard = async (stackId: string, frontText: string, backText: string) => {
  return await prisma.card.create({
    data: {
      frontText,
      backText,
      stackId: Number(stackId),
    },
  });
};

export const deleteCard = async (cardId: string) => {
  return await prisma.card.delete({
    where: { id: Number(cardId) },
  });
};

export const deleteCardStack = async (stackId: string) => {
  // Delete related cards first
  await prisma.card.deleteMany({
    where: { stackId: Number(stackId) },
  });

  // Then delete the card stack
  return await prisma.cardStack.delete({
    where: { id: Number(stackId) },
  });
};
