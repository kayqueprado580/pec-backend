import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CategoryDTO } from './dto/category.dto';

@Injectable()
export class CategoryService {

  constructor(private prisma: PrismaService) { }

  async create(data: CategoryDTO, userId: number) {

    const category = await this.prisma.category.create({
      data: {
        ...data,
        userId: userId,
      },
    })

    return {
      category
    }
  }


  async findAll(skip: number, take: number, orderBy: boolean, userId: number) {
    return await this.prisma.category.findMany({
      skip: skip ? skip : 0,
      take: take ? take : 20,
      orderBy: {
        id: orderBy ? 'asc' : 'desc',
      },
      where: {
        userId: userId
      }
    })
  }

  async findOne(id: number) {
    const categoryExists = await this.checkCategoryExists(id)
    if (!categoryExists) {
      throw new Error("Category does not exists!");
    }

    return await this.prisma.category.findUnique({
      where: {
        id,
      }
    })
  }

  async update(id: number, data: CategoryDTO, userId: number) {
    const categoryExists = await this.checkCategoryExists(id)
    if (!categoryExists) {
      throw new Error("Category does not exists!");
    }

    return await this.prisma.category.update({
      data: {
        ...data,
        userId: userId,
      },
      where:
      {
        id,
      }
    })
  }

  async remove(id: number) {
    const categoryExists = await this.checkCategoryExists(id)
    if (!categoryExists) {
      throw new Error("Category does not exists!");
    }

    return await this.prisma.category.delete({
      where: {
        id,
      }
    })
  }

  async getCategoriesDashboard(userId: number) {
    return await this.prisma.category.findMany({
      where: {
        userId: userId
      }
    })
  }

  private async checkCategoryExists(id: number) {
    const categoryExists = await this.prisma.category.findUnique({
      where: {
        id,
      }
    })
    const exists = categoryExists ? true : false
    return exists
  }
}
