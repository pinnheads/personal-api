import { PrismaClient, Url } from '@prisma/client';

export class UrlLoader {
  private prisma: PrismaClient;

  constructor(options: { prisma: PrismaClient }) {
    this.prisma = options.prisma;
  }

  async getUrl(id: string): Promise<Url> {
    const result = await this.prisma.url.findUniqueOrThrow({
      where: {
        id: id,
      },
    });
    return result;
  }

  async updateUrl(
    id: string,
    data: { label: string; url: string }
  ): Promise<Url> {
    const result = await this.prisma.url.update({
      where: { id: id },
      data: {
        label: data.label,
        url: data.url,
      },
    });
    return result;
  }
}
