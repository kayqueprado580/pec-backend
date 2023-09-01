import { Injectable } from '@nestjs/common';
// import { PrismaService } from 'src/database/prisma.service';
import { CategoryDTO } from '../categories/dto/category.dto';
import { RegisterDTO } from '../registers/dto/register.dto';

@Injectable()
export class DashboardService {
  constructor() { }
  getDataByReportFilteredCategoryAndType(categories: CategoryDTO[], registers: RegisterDTO[], registerType: string) {
    const result = []
    categories.forEach(category => {

      const filteredEntries = registers.filter(
        register => register.categoryId === category.id && (register.type == registerType)
      );

      if (filteredEntries.length > 0) {
        const totalAmount = filteredEntries.reduce((total, entry) => {
          const [integerPart, decimalPart] = entry.value.split(',');
          const parsedValue = parseFloat(`${integerPart}.${decimalPart}`);
          return total + parsedValue;
        }, 0);

        result.push({
          categoryId: category.id,
          categoryName: category.name,
          totalAmount: totalAmount
        })
      }

    })
    return result;
  }

  getValueTotal(registers: RegisterDTO[], registerType: string) {
    const result = []

    const filteredRegisters = registers.filter(
      register => register.type == registerType
    )

    if (filteredRegisters.length > 0) {
      const totalAmount = filteredRegisters.reduce((total, entry) => {
        const [integerPart, decimalPart] = entry.value.split(',');
        const parsedValue = parseFloat(`${integerPart}.${decimalPart}`);
        return total + parsedValue;
      }, 0);

      result.push(
        totalAmount
      )
    }

    return result
  }

}
