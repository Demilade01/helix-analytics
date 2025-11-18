"use client"

import { useState, useRef, useEffect } from "react"
import { CalendarIcon, ChevronDown } from "lucide-react"
import { format } from "date-fns"
import type { DateRange } from "react-day-picker"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import type { Sector } from "@/lib/hooks/use-user"
import type { ProfitabilityFilters } from "@/lib/types/profitability"

// Sector-specific department mappings
const sectorDepartments: Record<Sector, string[]> = {
  Healthcare: ["Emergency", "Surgery", "Cardiology", "Pediatrics", "Radiology"],
  "Banking & Capital Markets": ["Retail Banking", "Investment Banking", "Wealth Management", "Trading", "Operations"],
  "Retail & Ecommerce": ["Electronics", "Clothing", "Home & Garden", "Food & Beverage", "Online Sales"],
  Energy: ["Oil & Gas", "Renewable Energy", "Utilities", "Infrastructure", "Maintenance"],
  "Life Sciences": ["Research & Development", "Manufacturing", "Quality Control", "Sales", "Regulatory"],
  "Public Sector": ["Health Services", "Education", "Infrastructure", "Public Safety", "Administration"],
}

interface ProfitabilityFiltersProps {
  sector: Sector
  filters: ProfitabilityFilters
  onFiltersChange: (filters: ProfitabilityFilters) => void
}

export function ProfitabilityFilters({ sector, filters, onFiltersChange }: ProfitabilityFiltersProps) {
  const [isDepartmentOpen, setIsDepartmentOpen] = useState(false)
  const departmentRef = useRef<HTMLDivElement>(null)

  const availableDepartments = sectorDepartments[sector] || []

  // Close department dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (departmentRef.current && !departmentRef.current.contains(event.target as Node)) {
        setIsDepartmentOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleDateRangeChange = (range: DateRange | undefined) => {
    if (!range) return

    // Update immediately when a range is selected (both from and to are set)
    if (range.from && range.to) {
      onFiltersChange({
        ...filters,
        dateRange: {
          start: range.from,
          end: range.to,
        },
      })
    } else if (range.from) {
      // When only 'from' is selected, update just the start date
      onFiltersChange({
        ...filters,
        dateRange: {
          start: range.from,
          end: filters.dateRange.end,
        },
      })
    }
  }

  const handleDepartmentChange = (department: string) => {
    onFiltersChange({
      ...filters,
      department: department === "All" ? undefined : department,
    })
    setIsDepartmentOpen(false)
  }

  // Default to last 3 months if no date range set
  const defaultStartDate = filters.dateRange.start || new Date(new Date().setMonth(new Date().getMonth() - 3))
  const defaultEndDate = filters.dateRange.end || new Date()

  return (
    <div className="relative flex flex-wrap items-center gap-4">
      {/* Date Range Picker */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className="h-10 rounded-xl border-white/10 bg-white/5 px-4 text-sm font-medium text-white transition hover:border-white/20 hover:bg-white/8 hover:text-white backdrop-blur-xl"
          >
            <CalendarIcon className="mr-2 size-4" />
            {filters.dateRange.start && filters.dateRange.end ? (
              <>
                {format(filters.dateRange.start, "MMM d")} - {format(filters.dateRange.end, "MMM d, yyyy")}
              </>
            ) : (
              "Select date range"
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto rounded-xl border-white/20 bg-[#0f172a]/95 p-0 backdrop-blur-xl [&_button]:text-slate-200 [&_button]:bg-transparent [&_button:hover]:bg-white/10 [&_button:hover]:text-slate-200 [&_.rdp-day]:bg-transparent [&_.rdp-day_button]:bg-transparent [&_button[data-selected-single=true]]:bg-[#3b82f6]! [&_button[data-selected-single=true]]:text-white! [&_button[data-selected-single=true]]:rounded-md [&_button[data-selected-single=true]]:overflow-hidden [&_button[data-range-start=true]]:bg-[#3b82f6]! [&_button[data-range-start=true]]:text-white! [&_button[data-range-start=true]]:rounded-l-md [&_button[data-range-start=true]]:overflow-hidden [&_button[data-range-end=true]]:bg-[#3b82f6]! [&_button[data-range-end=true]]:text-white! [&_button[data-range-end=true]]:rounded-r-md [&_button[data-range-end=true]]:overflow-hidden [&_button[data-range-middle=true]]:bg-[#3b82f6]/80! [&_button[data-range-middle=true]]:text-white! [&_button[data-range-middle=true]]:rounded-none [&_.rdp-day_today_button]:bg-white/5! [&_.rdp-day_today_button]:text-slate-200! [&_.rdp-day_today_button]:border [&_.rdp-day_today_button]:border-white/20 [&_.rdp-day_today_button]:border-solid [&_.rdp-button_previous]:text-white [&_.rdp-button_next]:text-white [&_.rdp-button_previous:hover]:bg-white/10 [&_.rdp-button_next:hover]:bg-white/10 [&_.rdp-caption_label]:text-white [&_.rdp-head_cell]:text-slate-400" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={defaultStartDate}
            selected={{
              from: filters.dateRange.start || defaultStartDate,
              to: filters.dateRange.end || defaultEndDate,
            }}
            onSelect={handleDateRangeChange}
            numberOfMonths={2}
            className="text-white"
            classNames={{
              today: "!bg-white/5 !text-slate-200 border border-white/20",
            }}
          />
        </PopoverContent>
      </Popover>

      {/* Department Filter */}
      <div className="relative" ref={departmentRef}>
        <Button
          type="button"
          variant="outline"
          onClick={() => setIsDepartmentOpen(!isDepartmentOpen)}
          className="h-10 rounded-xl border-white/10 bg-white/5 px-4 text-sm font-medium text-white transition hover:border-white/20 hover:bg-white/8 hover:text-white backdrop-blur-xl"
        >
          <span className={filters.department ? "text-white" : "text-slate-400"}>
            {filters.department || "All Departments"}
          </span>
          <ChevronDown className={`ml-2 size-4 text-slate-400 transition-transform ${isDepartmentOpen ? "rotate-180" : ""}`} />
        </Button>
        {isDepartmentOpen && (
          <div className="absolute z-[1000px] mt-2 w-48 space-y-1 rounded-xl border border-white/20 bg-[#0f172a]/95 p-2 backdrop-blur-xl shadow-2xl shadow-black/60">
            <button
              type="button"
              onClick={() => handleDepartmentChange("All")}
              className={`w-full rounded-lg px-4 py-3 text-left text-sm font-medium transition ${
                !filters.department
                  ? "bg-[#3b82f6] text-white shadow-lg shadow-[#3b82f6]/30"
                  : "bg-white/5 text-slate-200 hover:bg-white/10 hover:text-white"
              }`}
            >
              All Departments
            </button>
            {availableDepartments.map((dept) => (
              <button
                key={dept}
                type="button"
                onClick={() => handleDepartmentChange(dept)}
                className={`w-full rounded-lg px-4 py-3 text-left text-sm font-medium transition ${
                  filters.department === dept
                    ? "bg-[#3b82f6] text-white shadow-lg shadow-[#3b82f6]/30"
                    : "bg-white/5 text-slate-200 hover:bg-white/10 hover:text-white"
                }`}
              >
                {dept}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Clear Filters */}
      {(filters.department || filters.dateRange.start !== defaultStartDate || filters.dateRange.end !== defaultEndDate) && (
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            onFiltersChange({
              dateRange: {
                start: defaultStartDate,
                end: defaultEndDate,
              },
              department: undefined,
            })
          }}
          className="h-10 rounded-xl border-white/10 bg-white/5 px-4 text-sm font-medium text-white transition hover:border-white/20 hover:bg-white/8 hover:text-white backdrop-blur-xl"
        >
          Clear Filters
        </Button>
      )}
    </div>
  )
}

