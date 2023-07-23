import { auth } from "@clerk/nextjs";
import prismadb from "./prismadb";
import { MAX_FREE_PROMPTS } from "@/constants";

export const increaseFreePromptsCount = async () => {
  const { userId } = auth();

  if (!userId) return;

  const userApiLimit = await prismadb.userApiLimit.findUnique({
    where: {
      userId,
    },
  });

  if (userApiLimit) {
    await prismadb.userApiLimit.update({
      where: { userId },
      data: { count: userApiLimit.count + 1 },
    });
  } else {
    await prismadb.userApiLimit.create({
      data: { userId, count: 1 },
    });
  }
};

export const isFreeTierPromptLimitReached = async (userId: string) => {
  // const { userId } = auth();

  // if (!userId) return true;

  const userApiLimit = await prismadb.userApiLimit.findUnique({
    where: {
      userId,
    },
  });

  if (!userApiLimit || userApiLimit.count < MAX_FREE_PROMPTS) {
    return false;
  } else {
    return true;
  }
};
