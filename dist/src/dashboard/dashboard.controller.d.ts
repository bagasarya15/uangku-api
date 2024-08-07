import { DashboardService } from './dashboard.service';
import { FilterDashboardDto, FilterPengeluaranByCategoryDto } from './dto/filter-dashboard.dto';
export declare class DashboardController {
    private readonly dashboardService;
    constructor(dashboardService: DashboardService);
    getIndexDashboard(body: FilterDashboardDto): Promise<any>;
    filterPengeluaranByCategory(body: FilterPengeluaranByCategoryDto): Promise<any>;
}
