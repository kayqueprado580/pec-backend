
import { Controller, Get, Req, Param, HttpException, HttpStatus, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { CategoryService } from 'src/categories/categories.service';
import { RegisterService } from 'src/registers/registers.service';
import { DashboardService } from './dashboard.service';

@UseGuards(AuthGuard)
@Controller('dashboard')
export class DashboardController {
	constructor(
		private readonly categoryService: CategoryService,
		private readonly registerService: RegisterService,
		private readonly dashboardService: DashboardService,
	) { }

	@Get()
	async dashboard(
		@Query('startDate') startDate: string,
		@Query('endDate') endDate: string,
		@Req() req: any) {
		const userId = parseInt(req.user.sub, 10)
		const start = new Date(startDate)
		const end = new Date(endDate)
		let registers = []
		let isBalancePositive = true

		const categories = await this.categoryService.getCategoriesDashboard(userId)

		try {
			registers = await this.registerService.getRegistersDashboard(userId, start, end)
		} catch (error) {
			throw new HttpException({
				status: HttpStatus.INTERNAL_SERVER_ERROR,
				error: error.message,
			}, HttpStatus.INTERNAL_SERVER_ERROR, {
				cause: error
			});
		}

		const expenseTotal = this.dashboardService.getValueTotal(registers, 'expense')
		const revenueTotal = this.dashboardService.getValueTotal(registers, 'revenue')
		const balanceTotal = revenueTotal[0] - expenseTotal[0]

		if (balanceTotal < 0)
			isBalancePositive = false

		const dashboard = {
			total: {
				balance: balanceTotal,
				positiveBalance: isBalancePositive,
				revenue: revenueTotal[0],
				expense: expenseTotal[0]
			}
		}
		const report = {
			revenue: this.dashboardService.getDataByReportFilteredCategoryAndType(categories, registers, 'revenue'),
			expense: this.dashboardService.getDataByReportFilteredCategoryAndType(categories, registers, 'expense')
		}

		return {
			dashboard: dashboard,
			report: report
		}
	}

}
