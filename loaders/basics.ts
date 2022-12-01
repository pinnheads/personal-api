import { PrismaClient } from '@prisma/client';
import { User } from './user.js';

interface IBasics {
  id?: string;
  firstName: string;
  middleName: string;
  lastName: string;
  summary: string;
  location: string;
  label: string;
  url: string;
  yearsOfExperience: number;
  blog: string;
}

export class Basics {
  private prisma: PrismaClient;
  private token: string;


  constructor(options: { prisma: PrismaClient, token?: string }) {
    this.prisma = options.prisma;
    this.token = options.token;
    const user = new User({ prisma: options.prisma })
    // user.getUser(token)
  }

  async createBasics(data: IBasics): Promise<IBasics> {
    const newBasics = await this.prisma.basics.create({
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
      }
    })
    return newBasics;
  }

  async updateBasics(data: IBasics, id: string): Promise<IBasics> {
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
        id: id
      }
    })
    return updatedBasics;
  }

  async deleteBasics(id: string): Promise<boolean> {
    const result = await this.prisma.basics.delete({
      where: {
        id: id
      }
    })
    return result ? true : false
  }

  async getBasics(id: string): Promise<IBasics> {
    const result = await this.prisma.basics.findUniqueOrThrow({
      where: {
        id: id
      }
    })
    return result;
  }
}
