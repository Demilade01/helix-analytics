export interface ProfitabilityKPI {
  label: string
  value: string | number
  delta: string
  trend: "up" | "down" | "neutral"
  format: "percentage" | "currency" | "number"
  description?: string
}

export interface ProfitabilityData {
  kpis: ProfitabilityKPI[]
  grossProfitMargin: number
  operatingProfitMargin: number
  netProfitMargin: number
  revenue: number
  costs: number
  profit: number
  revenueByDepartment?: RevenueByDepartment[]
  costBreakdown?: CostBreakdown[]
  timeSeriesData?: TimeSeriesDataPoint[]
}

export interface RevenueByDepartment {
  department: string
  revenue: number
  cost: number
  profit: number
  margin: number
  percentage: number
}

export interface CostBreakdown {
  category: string
  amount: number
  percentage: number
}

export interface TimeSeriesDataPoint {
  date: string
  revenue: number
  cost: number
  profit: number
  margin: number
}

export interface ProfitabilityFilters {
  dateRange: {
    start: Date
    end: Date
  }
  department?: string
  product?: string
}

