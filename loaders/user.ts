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
    });
    return user;
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
      });
    } else {
      throw new Error(`User with email ${email} already exists!!`);
    }
  }

  async deleteUser(email: string): Promise<boolean> {
    try {
      await this.prisma.user.delete({
        where: {
          email: email,
        },
      });
      return true;
    } catch (error) {
      throw new Error(`User with email ${email} not found`);
    }
  }
}