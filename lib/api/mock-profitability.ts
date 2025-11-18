import type { Sector } from "@/lib/hooks/use-user"
import type {
  ProfitabilityData,
  ProfitabilityFilters,
  RevenueByDepartment,
  CostBreakdown,
  TimeSeriesDataPoint,
} from "@/lib/types/profitability"

// Sector-specific department/product mappings
const sectorDepartments: Record<Sector, string[]> = {
  Healthcare: ["Emergency", "Surgery", "Cardiology", "Pediatrics", "Radiology"],
  "Banking & Capital Markets": ["Retail Banking", "Investment Banking", "Wealth Management", "Trading", "Operations"],
  "Retail & Ecommerce": ["Electronics", "Clothing", "Home & Garden", "Food & Beverage", "Online Sales"],
  Energy: ["Oil & Gas", "Renewable Energy", "Utilities", "Infrastructure", "Maintenance"],
  "Life Sciences": ["Research & Development", "Manufacturing", "Quality Control", "Sales", "Regulatory"],
  "Public Sector": ["Health Services", "Education", "Infrastructure", "Public Safety", "Administration"],
}

// Generate mock profitability data based on sector and organization
export async function fetchProfitabilityData(
  sector: Sector,
  organization: string,
  filters?: ProfitabilityFilters
): Promise<ProfitabilityData> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  const departments = sectorDepartments[sector] || []
  const selectedDepartment = filters?.department

  // Base values (will be randomized slightly for realism)
  const baseRevenue = 5000000 + Math.random() * 2000000
  const baseCosts = baseRevenue * (0.65 + Math.random() * 0.1) // 65-75% cost ratio
  const profit = baseRevenue - baseCosts

  // Calculate margins
  const grossProfitMargin = ((baseRevenue - baseCosts * 0.6) / baseRevenue) * 100
  const operatingProfitMargin = (profit / baseRevenue) * 100
  const netProfitMargin = operatingProfitMargin * 0.85 // Net is typically 85% of operating

  // Generate revenue by department
  const revenueByDepartment: RevenueByDepartment[] = departments.map((dept, index) => {
    const deptRevenue = baseRevenue * (0.15 + (Math.random() * 0.1)) / departments.length
    const deptCost = deptRevenue * (0.6 + Math.random() * 0.15)
    const deptProfit = deptRevenue - deptCost
    const deptMargin = (deptProfit / deptRevenue) * 100

    return {
      department: dept,
      revenue: deptRevenue,
      cost: deptCost,
      profit: deptProfit,
      margin: deptMargin,
      percentage: (deptRevenue / baseRevenue) * 100,
    }
  })

  // Normalize percentages
  const totalPercentage = revenueByDepartment.reduce((sum, dept) => sum + dept.percentage, 0)
  revenueByDepartment.forEach((dept) => {
    dept.percentage = (dept.percentage / totalPercentage) * 100
  })

  // Generate cost breakdown
  const costCategories: string[] = ["Labor", "Materials", "Overhead", "Technology", "Marketing", "Other"]
  const costBreakdown: CostBreakdown[] = costCategories.map((category, index) => {
    const percentage = index === 0 ? 35 : index === 1 ? 25 : index === 2 ? 15 : index === 3 ? 10 : index === 4 ? 10 : 5
    return {
      category,
      amount: baseCosts * (percentage / 100),
      percentage,
    }
  })

  // Generate time series data based on date range filter
  const timeSeriesData: TimeSeriesDataPoint[] = []
  const startDate = filters?.dateRange?.start || new Date(new Date().setMonth(new Date().getMonth() - 12))
  const endDate = filters?.dateRange?.end || new Date()

  // Generate monthly data points between start and end date
  const currentDate = new Date(startDate)
  currentDate.setDate(1) // Start of month

  while (currentDate <= endDate) {
    const monthRevenue = baseRevenue * (0.8 + Math.random() * 0.4)
    const monthCost = monthRevenue * (0.65 + Math.random() * 0.1)
    const monthProfit = monthRevenue - monthCost
    const monthMargin = (monthProfit / monthRevenue) * 100

    timeSeriesData.push({
      date: new Date(currentDate).toISOString().split("T")[0],
      revenue: monthRevenue,
      cost: monthCost,
      profit: monthProfit,
      margin: monthMargin,
    })

    // Move to next month
    currentDate.setMonth(currentDate.getMonth() + 1)
  }

  // Filter by department if specified
  let filteredRevenueByDepartment = revenueByDepartment
  if (selectedDepartment) {
    filteredRevenueByDepartment = revenueByDepartment.filter((dept) => dept.department === selectedDepartment)
  }

  // Generate KPIs
  const kpis = [
    {
      label: "Gross Profit Margin",
      value: grossProfitMargin,
      delta: `${grossProfitMargin > 40 ? "+" : ""}${(grossProfitMargin - 40).toFixed(1)}% vs target`,
      trend: grossProfitMargin > 40 ? "up" : "down",
      format: "percentage" as const,
      description: "Revenue minus cost of goods sold",
    },
    {
      label: "Operating Profit Margin",
      value: operatingProfitMargin,
      delta: `${operatingProfitMargin > 20 ? "+" : ""}${(operatingProfitMargin - 20).toFixed(1)}% vs target`,
      trend: operatingProfitMargin > 20 ? "up" : "down",
      format: "percentage" as const,
      description: "Profit after operating expenses",
    },
    {
      label: "Net Profit Margin",
      value: netProfitMargin,
      delta: `${netProfitMargin > 15 ? "+" : ""}${(netProfitMargin - 15).toFixed(1)}% vs target`,
      trend: netProfitMargin > 15 ? "up" : "down",
      format: "percentage" as const,
      description: "Final profit after all expenses",
    },
    {
      label: "Total Revenue",
      value: baseRevenue,
      delta: `+${((baseRevenue - 4500000) / 4500000 * 100).toFixed(1)}% vs last quarter`,
      trend: "up",
      format: "currency" as const,
      description: "Total revenue generated",
    },
  ]

  return {
    kpis,
    grossProfitMargin,
    operatingProfitMargin,
    netProfitMargin,
    revenue: baseRevenue,
    costs: baseCosts,
    profit,
    revenueByDepartment: filteredRevenueByDepartment,
    costBreakdown,
    timeSeriesData,
  }
}

