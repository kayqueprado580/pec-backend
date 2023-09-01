import { Controller, Get, Req, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, Query, UseGuards } from '@nestjs/common';
import { CategoryService } from './categories.service';
import { CategoryDTO } from './dto/category.dto'
import { AuthGuard } from '../auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) { }

  @Get()
  async findAll(
    @Query('skip') skip: string,
    @Query('take') take: string,
    @Query('orderBy') orderBy: boolean,
    @Query('name') name: string,
    @Req() req: any
  ) {

    const userId = parseInt(req.user.sub, 10)
    const skp = parseInt(skip, 10)
    const tk = parseInt(take, 10)
    return await this.categoryService.findAll(skp, tk, orderBy, userId, name)
  }

  @Post()
  async create(@Body() categoryDTO: CategoryDTO, @Req() req: any) {
    const userId = parseInt(req.user.sub, 10)
    return await this.categoryService.create(categoryDTO, userId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return await this.categoryService.findOne(+id)
    } catch (error) {
      throw new HttpException({
        status: HttpStatus.NOT_FOUND,
        error: error.message,
      }, HttpStatus.NOT_FOUND, {
        cause: error
      });
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() categoryDTO: CategoryDTO, @Req() req: any) {
    const userId = parseInt(req.user.sub, 10)
    try {
      return await this.categoryService.update(+id, categoryDTO, userId)
    } catch (error) {
      throw new HttpException({
        status: HttpStatus.NOT_FOUND,
        error: error.message,
      }, HttpStatus.NOT_FOUND, {
        cause: error
      });
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      await this.categoryService.remove(+id)
      return { "message": "successfully removed" }
    } catch (error) {
      throw new HttpException({
        status: HttpStatus.NOT_FOUND,
        error: error.message,
      }, HttpStatus.NOT_FOUND, {
        cause: error
      });
    }
  }
}
