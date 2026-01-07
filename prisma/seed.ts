import "dotenv/config"
import { PrismaClient } from "../app/generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import bcrypt from "bcryptjs"

const connectionString = process.env.DATABASE_URL
if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is not set")
}

const adapter = new PrismaPg({
  connectionString,
})

const prisma = new PrismaClient({
  adapter,
})

async function main() {
  console.log("🌱 Starting database seed...")

  // Clear existing data (optional - only for development)
  console.log("🗑️  Clearing existing data...")
  await prisma.kpiValue.deleteMany()
  await prisma.costEntry.deleteMany()
  await prisma.departmentMetric.deleteMany()
  await prisma.profitabilitySnapshot.deleteMany()
  await prisma.kpiDefinition.deleteMany()
  await prisma.costCategory.deleteMany()
  await prisma.organizationDepartment.deleteMany()
  await prisma.department.deleteMany()
  await prisma.organization.deleteMany()
  await prisma.user.deleteMany()
  await prisma.sector.deleteMany()

  // Create Sectors
  console.log("📊 Creating sectors...")
  const sectors = await Promise.all([
    prisma.sector.create({
      data: {
        name: "Healthcare",
        slug: "healthcare",
        description: "Hospitals, clinics, and healthcare providers",
      },
    }),
    prisma.sector.create({
      data: {
        name: "Banking & Capital Markets",
        slug: "banking-capital-markets",
        description: "Financial institutions and investment services",
      },
    }),
    prisma.sector.create({
      data: {
        name: "Retail & Ecommerce",
        slug: "retail-ecommerce",
        description: "Retail stores and online commerce",
      },
    }),
    prisma.sector.create({
      data: {
        name: "Energy",
        slug: "energy",
        description: "Oil, gas, renewable energy, and utilities",
      },
    }),
    prisma.sector.create({
      data: {
        name: "Life Sciences",
        slug: "life-sciences",
        description: "Pharmaceuticals, biotechnology, and medical devices",
      },
    }),
    prisma.sector.create({
      data: {
        name: "Public Sector",
        slug: "public-sector",
        description: "Government agencies and public services",
      },
    }),
  ])

  const healthcare = sectors[0]
  const banking = sectors[1]
  const retail = sectors[2]
  const energy = sectors[3]
  const lifeSciences = sectors[4]
  const publicSector = sectors[5]

  // Create Departments per Sector
  console.log("🏢 Creating departments...")
  const healthcareDepts = await Promise.all([
    prisma.department.create({
      data: { name: "Emergency", code: "ER", sectorId: healthcare.id },
    }),
    prisma.department.create({
      data: { name: "Surgery", code: "SURG", sectorId: healthcare.id },
    }),
    prisma.department.create({
      data: { name: "Cardiology", code: "CARD", sectorId: healthcare.id },
    }),
    prisma.department.create({
      data: { name: "Pediatrics", code: "PED", sectorId: healthcare.id },
    }),
    prisma.department.create({
      data: { name: "Radiology", code: "RAD", sectorId: healthcare.id },
    }),
  ])

  const bankingDepts = await Promise.all([
    prisma.department.create({
      data: { name: "Retail Banking", code: "RB", sectorId: banking.id },
    }),
    prisma.department.create({
      data: { name: "Investment Banking", code: "IB", sectorId: banking.id },
    }),
    prisma.department.create({
      data: { name: "Wealth Management", code: "WM", sectorId: banking.id },
    }),
    prisma.department.create({
      data: { name: "Trading", code: "TRD", sectorId: banking.id },
    }),
    prisma.department.create({
      data: { name: "Operations", code: "OPS", sectorId: banking.id },
    }),
  ])

  const retailDepts = await Promise.all([
    prisma.department.create({
      data: { name: "Electronics", code: "ELEC", sectorId: retail.id },
    }),
    prisma.department.create({
      data: { name: "Clothing", code: "CLO", sectorId: retail.id },
    }),
    prisma.department.create({
      data: { name: "Home & Garden", code: "HG", sectorId: retail.id },
    }),
    prisma.department.create({
      data: { name: "Food & Beverage", code: "FB", sectorId: retail.id },
    }),
    prisma.department.create({
      data: { name: "Online Sales", code: "ONL", sectorId: retail.id },
    }),
  ])

  const energyDepts = await Promise.all([
    prisma.department.create({
      data: { name: "Oil & Gas", code: "OG", sectorId: energy.id },
    }),
    prisma.department.create({
      data: { name: "Renewable Energy", code: "RE", sectorId: energy.id },
    }),
    prisma.department.create({
      data: { name: "Utilities", code: "UTIL", sectorId: energy.id },
    }),
    prisma.department.create({
      data: { name: "Infrastructure", code: "INFRA", sectorId: energy.id },
    }),
    prisma.department.create({
      data: { name: "Maintenance", code: "MAINT", sectorId: energy.id },
    }),
  ])

  const lifeSciencesDepts = await Promise.all([
    prisma.department.create({
      data: { name: "Research & Development", code: "R&D", sectorId: lifeSciences.id },
    }),
    prisma.department.create({
      data: { name: "Manufacturing", code: "MFG", sectorId: lifeSciences.id },
    }),
    prisma.department.create({
      data: { name: "Quality Control", code: "QC", sectorId: lifeSciences.id },
    }),
    prisma.department.create({
      data: { name: "Sales", code: "SALES", sectorId: lifeSciences.id },
    }),
    prisma.department.create({
      data: { name: "Regulatory", code: "REG", sectorId: lifeSciences.id },
    }),
  ])

  const publicSectorDepts = await Promise.all([
    prisma.department.create({
      data: { name: "Health Services", code: "HS", sectorId: publicSector.id },
    }),
    prisma.department.create({
      data: { name: "Education", code: "EDU", sectorId: publicSector.id },
    }),
    prisma.department.create({
      data: { name: "Infrastructure", code: "INFRA", sectorId: publicSector.id },
    }),
    prisma.department.create({
      data: { name: "Public Safety", code: "PS", sectorId: publicSector.id },
    }),
    prisma.department.create({
      data: { name: "Administration", code: "ADMIN", sectorId: publicSector.id },
    }),
  ])

  // Create Organizations
  console.log("🏛️  Creating organizations...")
  const healthcareOrgs = await Promise.all([
    prisma.organization.create({
      data: {
        name: "City General Hospital",
        slug: "city-general-hospital",
        region: "North America",
        timezone: "America/New_York",
        sectorId: healthcare.id,
      },
    }),
    prisma.organization.create({
      data: {
        name: "Metro Health Center",
        slug: "metro-health-center",
        region: "North America",
        timezone: "America/Chicago",
        sectorId: healthcare.id,
      },
    }),
    prisma.organization.create({
      data: {
        name: "Regional Medical Group",
        slug: "regional-medical-group",
        region: "North America",
        timezone: "America/Los_Angeles",
        sectorId: healthcare.id,
      },
    }),
  ])

  const bankingOrgs = await Promise.all([
    prisma.organization.create({
      data: {
        name: "First National Bank",
        slug: "first-national-bank",
        region: "North America",
        timezone: "America/New_York",
        sectorId: banking.id,
      },
    }),
    prisma.organization.create({
      data: {
        name: "Global Capital Partners",
        slug: "global-capital-partners",
        region: "North America",
        timezone: "America/New_York",
        sectorId: banking.id,
      },
    }),
    prisma.organization.create({
      data: {
        name: "Metro Credit Union",
        slug: "metro-credit-union",
        region: "North America",
        timezone: "America/Chicago",
        sectorId: banking.id,
      },
    }),
  ])

  const retailOrgs = await Promise.all([
    prisma.organization.create({
      data: {
        name: "TechMart Retail",
        slug: "techmart-retail",
        region: "North America",
        timezone: "America/New_York",
        sectorId: retail.id,
      },
    }),
    prisma.organization.create({
      data: {
        name: "Global Commerce Inc",
        slug: "global-commerce-inc",
        region: "North America",
        timezone: "America/Los_Angeles",
        sectorId: retail.id,
      },
    }),
    prisma.organization.create({
      data: {
        name: "Urban Marketplace",
        slug: "urban-marketplace",
        region: "North America",
        timezone: "America/Chicago",
        sectorId: retail.id,
      },
    }),
  ])

  const energyOrgs = await Promise.all([
    prisma.organization.create({
      data: {
        name: "Green Energy Solutions",
        slug: "green-energy-solutions",
        region: "North America",
        timezone: "America/Denver",
        sectorId: energy.id,
      },
    }),
    prisma.organization.create({
      data: {
        name: "National Power Corp",
        slug: "national-power-corp",
        region: "North America",
        timezone: "America/New_York",
        sectorId: energy.id,
      },
    }),
    prisma.organization.create({
      data: {
        name: "Solar Dynamics",
        slug: "solar-dynamics",
        region: "North America",
        timezone: "America/Los_Angeles",
        sectorId: energy.id,
      },
    }),
  ])

  const lifeSciencesOrgs = await Promise.all([
    prisma.organization.create({
      data: {
        name: "BioPharm Innovations",
        slug: "biopharm-innovations",
        region: "North America",
        timezone: "America/New_York",
        sectorId: lifeSciences.id,
      },
    }),
    prisma.organization.create({
      data: {
        name: "MedTech Research Labs",
        slug: "medtech-research-labs",
        region: "North America",
        timezone: "America/Chicago",
        sectorId: lifeSciences.id,
      },
    }),
    prisma.organization.create({
      data: {
        name: "Genomic Solutions",
        slug: "genomic-solutions",
        region: "North America",
        timezone: "America/Los_Angeles",
        sectorId: lifeSciences.id,
      },
    }),
  ])

  const publicSectorOrgs = await Promise.all([
    prisma.organization.create({
      data: {
        name: "State Health Department",
        slug: "state-health-department",
        region: "North America",
        timezone: "America/New_York",
        sectorId: publicSector.id,
      },
    }),
    prisma.organization.create({
      data: {
        name: "Federal Finance Office",
        slug: "federal-finance-office",
        region: "North America",
        timezone: "America/New_York",
        sectorId: publicSector.id,
      },
    }),
    prisma.organization.create({
      data: {
        name: "City Planning Bureau",
        slug: "city-planning-bureau",
        region: "North America",
        timezone: "America/Los_Angeles",
        sectorId: publicSector.id,
      },
    }),
  ])

  // Link departments to organizations
  console.log("🔗 Linking departments to organizations...")
  const allOrgs = [
    ...healthcareOrgs,
    ...bankingOrgs,
    ...retailOrgs,
    ...energyOrgs,
    ...lifeSciencesOrgs,
    ...publicSectorOrgs,
  ]

  // Link healthcare departments to healthcare orgs
  for (const org of healthcareOrgs) {
    for (const dept of healthcareDepts) {
      await prisma.organizationDepartment.create({
        data: {
          organizationId: org.id,
          departmentId: dept.id,
        },
      })
    }
  }

  // Link banking departments to banking orgs
  for (const org of bankingOrgs) {
    for (const dept of bankingDepts) {
      await prisma.organizationDepartment.create({
        data: {
          organizationId: org.id,
          departmentId: dept.id,
        },
      })
    }
  }

  // Link retail departments to retail orgs
  for (const org of retailOrgs) {
    for (const dept of retailDepts) {
      await prisma.organizationDepartment.create({
        data: {
          organizationId: org.id,
          departmentId: dept.id,
        },
      })
    }
  }

  // Link energy departments to energy orgs
  for (const org of energyOrgs) {
    for (const dept of energyDepts) {
      await prisma.organizationDepartment.create({
        data: {
          organizationId: org.id,
          departmentId: dept.id,
        },
      })
    }
  }

  // Link life sciences departments to life sciences orgs
  for (const org of lifeSciencesOrgs) {
    for (const dept of lifeSciencesDepts) {
      await prisma.organizationDepartment.create({
        data: {
          organizationId: org.id,
          departmentId: dept.id,
        },
      })
    }
  }

  // Link public sector departments to public sector orgs
  for (const org of publicSectorOrgs) {
    for (const dept of publicSectorDepts) {
      await prisma.organizationDepartment.create({
        data: {
          organizationId: org.id,
          departmentId: dept.id,
        },
      })
    }
  }

  // Create Cost Categories
  console.log("💰 Creating cost categories...")
  const costCategories = await Promise.all([
    prisma.costCategory.create({
      data: { name: "Labor", code: "LABOR", description: "Employee salaries and benefits", sortOrder: 1 },
    }),
    prisma.costCategory.create({
      data: { name: "Materials", code: "MAT", description: "Raw materials and supplies", sortOrder: 2 },
    }),
    prisma.costCategory.create({
      data: { name: "Overhead", code: "OH", description: "General overhead expenses", sortOrder: 3 },
    }),
    prisma.costCategory.create({
      data: { name: "Technology", code: "TECH", description: "IT infrastructure and software", sortOrder: 4 },
    }),
    prisma.costCategory.create({
      data: { name: "Marketing", code: "MKT", description: "Marketing and advertising", sortOrder: 5 },
    }),
    prisma.costCategory.create({
      data: { name: "Other", code: "OTHER", description: "Miscellaneous expenses", sortOrder: 6 },
    }),
  ])

  // Create KPI Definitions
  console.log("📈 Creating KPI definitions...")
  const kpiDefinitions = await Promise.all([
    prisma.kpiDefinition.create({
      data: {
        label: "Gross Profit Margin",
        slug: "gross-profit-margin",
        description: "Revenue minus cost of goods sold",
        format: "PERCENTAGE",
        targetValue: 40,
        targetMargin: 40,
      },
    }),
    prisma.kpiDefinition.create({
      data: {
        label: "Operating Profit Margin",
        slug: "operating-profit-margin",
        description: "Profit after operating expenses",
        format: "PERCENTAGE",
        targetValue: 20,
        targetMargin: 20,
      },
    }),
    prisma.kpiDefinition.create({
      data: {
        label: "Net Profit Margin",
        slug: "net-profit-margin",
        description: "Final profit after all expenses",
        format: "PERCENTAGE",
        targetValue: 15,
        targetMargin: 15,
      },
    }),
    prisma.kpiDefinition.create({
      data: {
        label: "Total Revenue",
        slug: "total-revenue",
        description: "Total revenue generated",
        format: "CURRENCY",
        targetValue: 5000000,
      },
    }),
  ])

  // Create initial admin user (only in development)
  const shouldCreateDevUsers = process.env.NODE_ENV !== "production" && process.env.SEED_DEV_USERS !== "false"

  let sampleUsers: Array<{ id: string; email: string }> = []

  if (shouldCreateDevUsers) {
    console.log("👥 Creating development test users...")
    const hashedPassword = await bcrypt.hash("password123", 10)

    sampleUsers = await Promise.all([
      prisma.user.create({
        data: {
          email: "admin@helix.com",
          firstName: "Admin",
          lastName: "User",
          hashedPassword,
          role: "ADMIN",
          sectorId: healthcare.id,
          organizationId: healthcareOrgs[0].id,
          isActive: true,
        },
      }),
      prisma.user.create({
        data: {
          email: "devbyte@gmail.com",
          firstName: "John",
          lastName: "Doe",
          hashedPassword,
          role: "EXECUTIVE",
          sectorId: banking.id,
          organizationId: bankingOrgs[0].id,
          isActive: true,
        },
      }),
    ])

    console.log("⚠️  Development users created (not for production use)")
  } else {
    console.log("⏭️  Skipping user creation (production mode or SEED_DEV_USERS=false)")
  }

  // Generate sample profitability snapshots for the last 12 months
  console.log("📊 Creating profitability snapshots...")
  const now = new Date()

  for (const org of allOrgs.slice(0, 3)) {
    // Create snapshots for each of the last 12 months
    for (let monthOffset = 0; monthOffset < 12; monthOffset++) {
      // Calculate period dates correctly
      const periodDate = new Date(now.getFullYear(), now.getMonth() - monthOffset, 1)
      const periodStart = new Date(periodDate.getFullYear(), periodDate.getMonth(), 1)
      const periodEnd = new Date(periodDate.getFullYear(), periodDate.getMonth() + 1, 0)

      const revenue = 5000000 + Math.random() * 2000000
      const cost = revenue * (0.65 + Math.random() * 0.1)
      const profit = revenue - cost
      const grossMargin = ((revenue - cost * 0.6) / revenue) * 100
      const operatingMargin = (profit / revenue) * 100
      const netMargin = operatingMargin * 0.85

      const snapshot = await prisma.profitabilitySnapshot.create({
        data: {
          organizationId: org.id,
          sectorId: org.sectorId,
          periodStart,
          periodEnd,
          currency: "USD",
          revenue,
          cost,
          profit,
          grossMargin,
          operatingMargin,
          netMargin,
        },
      })

      // Get departments for this organization
      const orgDepts = await prisma.organizationDepartment.findMany({
        where: { organizationId: org.id },
        include: { department: true },
      })

      // Create department metrics
      let totalDeptRevenue = 0
      const deptMetrics: Array<{
        snapshotId: string
        departmentId: string
        organizationId: string
        revenue: number
        cost: number
        profit: number
        margin: number
        revenueShare: number
      }> = []

      for (const orgDept of orgDepts) {
        const deptRevenue = revenue * (0.15 + Math.random() * 0.1) / orgDepts.length
        const deptCost = deptRevenue * (0.6 + Math.random() * 0.15)
        const deptProfit = deptRevenue - deptCost
        const deptMargin = (deptProfit / deptRevenue) * 100

        totalDeptRevenue += deptRevenue
        deptMetrics.push({
          snapshotId: snapshot.id,
          departmentId: orgDept.departmentId,
          organizationId: org.id,
          revenue: deptRevenue,
          cost: deptCost,
          profit: deptProfit,
          margin: deptMargin,
          revenueShare: 0, // Will calculate after
        })
      }

      // Normalize revenue shares
      for (const metric of deptMetrics) {
        metric.revenueShare = (metric.revenue / totalDeptRevenue) * 100

        await prisma.departmentMetric.create({
          data: metric,
        })
      }

      // Create cost entries
      const costPercentages = [35, 25, 15, 10, 10, 5]
      for (let i = 0; i < costCategories.length; i++) {
        await prisma.costEntry.create({
          data: {
            snapshotId: snapshot.id,
            categoryId: costCategories[i].id,
            amount: cost * (costPercentages[i] / 100),
            percentage: costPercentages[i],
          },
        })
      }

      // Create KPI values
      for (const kpi of kpiDefinitions) {
        let value = 0
        let trend: "UP" | "DOWN" | "NEUTRAL" = "NEUTRAL"

        if (kpi.slug === "gross-profit-margin") {
          value = grossMargin
          trend = grossMargin > (kpi.targetMargin || 40) ? "UP" : "DOWN"
        } else if (kpi.slug === "operating-profit-margin") {
          value = operatingMargin
          trend = operatingMargin > (kpi.targetMargin || 20) ? "UP" : "DOWN"
        } else if (kpi.slug === "net-profit-margin") {
          value = netMargin
          trend = netMargin > (kpi.targetMargin || 15) ? "UP" : "DOWN"
        } else if (kpi.slug === "total-revenue") {
          value = revenue
          trend = "UP"
        }

        await prisma.kpiValue.create({
          data: {
            snapshotId: snapshot.id,
            kpiId: kpi.id,
            value,
            deltaPercent: kpi.targetValue ? ((value - Number(kpi.targetValue)) / Number(kpi.targetValue)) * 100 : null,
            trend,
          },
        })
      }
    }
  }

  console.log("✅ Database seeded successfully!")
  console.log(`   - ${sectors.length} sectors`)
  console.log(`   - ${allOrgs.length} organizations`)
  if (sampleUsers.length > 0) {
    console.log(`   - ${sampleUsers.length} development test users`)
    console.log("\n⚠️  Development credentials (NOT for production):")
    console.log("   Email: admin@helix.com")
    console.log("   Email: devbyte.dev@gmail.com")
    console.log("   Password: password123")
    console.log("\n💡 In production, users should sign up through the signup page.")
  }
  console.log(`   - Sample profitability data for 3 organizations`)
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

