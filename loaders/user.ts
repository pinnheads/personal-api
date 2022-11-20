import { PrismaClient } from '@prisma/client';

interface IUser {
  id?: string;
  username?: string;
  email: string;
  password: string;
  token: string;
  isAdmin: boolean;
}

export class User {
  private userToken: string;
  private prisma: PrismaClient;

  constructor(options: { prisma: PrismaClient; token?: string }) {
    this.userToken = options.token;
    this.prisma = options.prisma;
    console.log(this.userToken);
  }

  async createUser(
    username: string,
    email: string,
    password: string,
    token: string
  ): Promise<IUser> {
    const newUser = await this.prisma.user.create({
      data: {
        username: username,
        email: email,
        password: password,
        token: token,
      },
    });
    return newUser;
  }
}

// export const generateUserModel = (userId: string, prisma: PrismaClient) => ({
//   getById: async () => {
//     if (!userId) return null;
//     const result = await prisma.user.findFirst({
//       where: {
//         id: userId,
//       },
//     });
//     return result;
//   },
//   getAll: async () => {
//     const user = await prisma.user.findFirst({
//       where: {
//         id: userId,
//       },
//     });
//     if (!user || user.isAdmin == false) return null;
//     const allUsers = await prisma.user.findMany();
//     return allUsers;
//   },
//   createNewUser: async (
//     username: string,
//     email: string,
//     password: string,
//     token: string
//   ) => {
//     const newUser = await prisma.user.create({
//       data: {
//         email,
//         password,
//         token,
//         username,
//       },
//     });
//     return newUser;
//   },
// });
