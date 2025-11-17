"use client"

import { motion } from "framer-motion"

import { fadeInUp, staggerContainer } from "@/components/sections/motion-presets"

const sectors = ["Healthcare", "Banking & Capital Markets", "Retail & Ecommerce", "Energy", "Life Sciences", "Public Sector"]

export function SectorsSection() {
  return (
    <motion.section
      id="sectors"
      className="mx-auto flex max-w-6xl flex-col gap-8 rounded-[32px] border border-white/10 bg-[#0b111f]/80 px-8 py-12 text-white shadow-2xl shadow-black/40 backdrop-blur-2xl"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={staggerContainer}
    >
      <motion.div className="flex flex-col gap-4 text-center lg:text-left" variants={fadeInUp}>
        <p className="text-xs uppercase tracking-[0.4em] text-[#64748B]">Trusted industries</p>
        <h2 className="text-3xl font-semibold sm:text-4xl">Precision-grade analytics for regulated sectors</h2>
        <p className="text-lg text-slate-300 lg:max-w-3xl">
          Helix orchestrates compliant data movement for teams dealing with PHI, PCI, SOX, and global data residency mandates.
        </p>
      </motion.div>

      <motion.div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" variants={staggerContainer}>
        {sectors.map((sector) => (
          <motion.div
            key={sector}
            className="rounded-2xl border border-white/10 bg-white/5 px-6 py-5 text-left text-slate-200 shadow-[0_10px_40px_-20px_rgba(15,23,42,1)] backdrop-blur-xl"
            variants={fadeInUp}
          >
            <p className="text-lg font-semibold text-white">{sector}</p>
            <p className="mt-2 text-sm text-slate-400">Custom governance, prebuilt metrics, rapid deployment kits.</p>
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  )
}

