import { AnalyticsPreviewSection } from "@/components/sections/analytics-preview"
import { CTASection } from "@/components/sections/cta-section"
import { FeaturesSection } from "@/components/sections/features"
import { FooterSection } from "@/components/sections/footer"
import { HeroSection } from "@/components/sections/hero"
import { Navbar } from "@/components/sections/navbar"
import { SectorsSection } from "@/components/sections/sectors"

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#010203] text-slate-100">
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-x-0 top-0 bg-[radial-gradient(circle_at_top,rgba(100,116,139,0.35),transparent)]"
          style={{ height: "32rem" }}
        />
        <div className="absolute inset-y-0 right-0 w-1/3 bg-[radial-gradient(circle,rgba(34,211,238,0.2),transparent_60%)] blur-3xl" />
        <div className="absolute inset-y-0 left-0 w-1/3 bg-[radial-gradient(circle,rgba(59,130,246,0.15),transparent_65%)] blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.05),transparent)]" />
      </div>

      <main className="relative z-10 flex flex-col gap-16 px-6 pb-16 pt-6 sm:px-10 lg:gap-20">
        <Navbar />
        <HeroSection />
        <FeaturesSection />
        <SectorsSection />
        <AnalyticsPreviewSection />
        <CTASection />
        <FooterSection />
      </main>
    </div>
  )
}
