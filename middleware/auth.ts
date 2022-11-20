import { PrismaClient } from '@prisma/client';

const getUser = async (
  prisma: PrismaClient,
  token?: string
): Promise<string> => {
  const user = await prisma.user.findFirst({
    where: {
      token: token,
    },
  });
  return user.id;
};

export default getUser;
