import { Controller, Get, Post, Body, Req, Patch, Param, Delete, HttpException, HttpStatus, Query, UseGuards } from '@nestjs/common';
import { RegisterService } from './registers.service';
import { RegisterDTO } from './dto/register.dto'
import { AuthGuard } from '../auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('registers')
export class RegisterController {
  constructor(private readonly registerService: RegisterService) { }

  @Get()
  async findAll(
    @Query('skip') skip: string,
    @Query('take') take: string,
    @Query('orderBy') orderBy: boolean,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Req() req: any
  ) {
    const id = parseInt(req.user.sub, 10)
    const start = new Date(startDate)
    const end = new Date(endDate)
    const skp = parseInt(skip, 10)
    const tk = parseInt(take, 10)

    return await this.registerService.findAll(skp, tk, orderBy, id, start, end)
  }

  @Post()
  async create(@Body() registerDTO: RegisterDTO, @Req() req: any) {
    const userId = parseInt(req.user.sub, 10)
    try {
      return await this.registerService.create(registerDTO, userId)
    } catch (error) {
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.message,
      }, HttpStatus.INTERNAL_SERVER_ERROR, {
        cause: error
      });
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return await this.registerService.findOne(+id)
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
  async update(@Param('id') id: string, @Body() registerDTO: RegisterDTO, @Req() req: any) {
    const userId = parseInt(req.user.sub, 10)
    try {
      return await this.registerService.update(+id, registerDTO, userId)
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
      await this.registerService.remove(+id)
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
