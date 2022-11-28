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

  async userExists(email: string): Promise<boolean> {
    const oldUser = await this.prisma.user.findUnique({
      where: {
        email: email,
      }
    })
    if (oldUser == null) return false;
    return true;

  }

  async isUserAdmin(token: string): Promise<boolean> {
    const user = await this.prisma.user.findFirst({
      where: {
        token: token,
      },
    });
    if (user) return user.isAdmin;
  }

  // async updateUser({email, username, token}): Promise<IUser> {
  //   if(this.userExists(token)) {
  //     return this.prisma.user.update({data: {
  //       username: username,
  //       email: email
  //     }})
  //   }
  // }
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
