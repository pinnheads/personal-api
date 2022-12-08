import { PrismaClient } from '@prisma/client';
import { IBasics } from './basics.js';

export interface IUser {
  id?: string;
  username?: string;
  email: string;
  password: string;
  token: string;
  isAdmin: boolean;
  basics?: IBasics;
}

export class User {
  private prisma: PrismaClient;

  constructor(options: { prisma: PrismaClient }) {
    this.prisma = options.prisma;
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
      include: {
        basics: true,
      },
    });
    return newUser;
  }

  async userExists(email: string): Promise<boolean> {
    const oldUser = await this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });
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

  async getUser(token: string): Promise<IUser> {
    const user = await this.prisma.user.findFirstOrThrow({
      where: {
        token: token,
      },
      include: {
        basics: true,
      },
    });
    return user;
  }

  async getAllUsers(): Promise<IUser[]> {
    const users = await this.prisma.user.findMany();
    return users;
  }

  private async checkDuplicate(email: string): Promise<boolean> {
    try {
      await this.prisma.user.findUniqueOrThrow({
        where: {
          email: email,
        },
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  async updateUser(
    email: string,
    username: string,
    token: string
  ): Promise<IUser> {
    const user = await this.getUser(token);
    if (!(await this.checkDuplicate(email))) {
      return this.prisma.user.update({
        where: {
          email: user.email,
        },
        data: {
          username: username,
          email: email,
        },
        include: {
          basics: true,
        },
      });
    } else {
      throw new Error(`User with email ${email} already exists!!`);
    }
  }

  // async updateUserBasics(token: string, basics?: IBasics): Promise<IUser> {
  //   const user = await this.getUser(token);
  //   return this.prisma.user.update({
  //     where: {
  //       email: user.email,
  //     },
  //     data: {
  //       basics: {
  //         connect: {
  //           id: basics.id,
  //         },
  //       },
  //     },
  //     include: {
  //       basics: true,
  //     },
  //   });
  // }

  async deleteUser(email: string): Promise<boolean> {
    try {
      await this.prisma.user.delete({
        where: {
          email: email,
        },
      });
      return true;
    } catch (error) {
      throw new Error(`User with email ${email}`);
    }
  }
}
