import { PrismaClient, Url, Basics } from '@prisma/client';
import { IUser, User } from './user.js';

export class BasicsLoaders {
  private prisma: PrismaClient;
  private token: string;
  private user: User;

  constructor(options: { prisma: PrismaClient; token?: string }) {
    this.prisma = options.prisma;
    this.token = options.token;
    this.user = new User({ prisma: options.prisma });
    // user.getUser(token)
  }

  async createBasics(data, id: string): Promise<Basics> {
    const newBasics = await this.prisma.basics.create({
      data: {
        user: {
          connect: {
            id: id,
          },
        },
        firstName: data.firstName,
        middleName: data.middleName,
        lastName: data.lastName,
        summary: data.summary,
        location: data.location,
        label: data.label,
        url: data.url,
        yearsOfExperience: data.yearsOfExperience,
        blog: data.blog,
        profile: {
          createMany: {
            data: data.profile,
          },
        },
      },
      include: {
        profile: true,
      },
    });
    return newBasics;
  }

  async updateBasics(data, id: string): Promise<Basics> {
    const updatedBasics = await this.prisma.basics.update({
      data: {
        firstName: data.firstName,
        middleName: data.middleName,
        lastName: data.lastName,
        summary: data.summary,
        location: data.location,
        label: data.label,
        url: data.url,
        yearsOfExperience: data.yearsOfExperience,
        blog: data.blog,
      },
      where: {
        id: id,
      },
      include: {
        profile: true,
      },
    });
    return updatedBasics;
  }

  async deleteBasics(id: string): Promise<boolean> {
    const result = await this.prisma.basics.delete({
      where: {
        id: id,
      },
    });
    return result ? true : false;
  }

  async getBasics(id: string): Promise<Basics> {
    const result = await this.prisma.basics.findUniqueOrThrow({
      where: {
        id: id,
      },
    });
    return result;
  }
}
