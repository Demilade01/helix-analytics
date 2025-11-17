"use client"

import { motion } from "framer-motion"

import { fadeInUp, staggerContainer } from "@/components/sections/motion-presets"

const features = [
  {
    title: "Unified data fabric",
    description: "Snap any ledger, CRM, or warehouse into a governed lakehouse with automated lineage and policy controls.",
    metric: "72h onboarding",
  },
  {
    title: "Narrative intelligence",
    description:
      "AI co-pilot distills signals into executive-ready narratives, highlighting anomalies and recommended actions.",
    metric: "4x faster insights",
  },
  {
    title: "Decision-grade forecasts",
    description: "Scenario simulators pair stochastic models with your live KPIs for confident board reporting.",
    metric: "97% forecast fidelity",
  },
]

export function FeaturesSection() {
  return (
    <motion.section
      id="features"
      className="mx-auto flex max-w-6xl flex-col gap-10"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={staggerContainer}
    >
      <motion.div className="text-center" variants={fadeInUp}>
        <p className="text-xs uppercase tracking-[0.4em] text-[#64748B]">Platform</p>
        <h2 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">Frictionless intelligence for leadership</h2>
        <p className="mt-3 text-lg text-slate-400">
          Every module ships with enterprise-grade controls, transparent audit trails, and SOC 2 Type II coverage.
        </p>
      </motion.div>

      <motion.div className="grid gap-6 md:grid-cols-3" variants={staggerContainer}>
        {features.map((feature) => (
          <motion.div
            key={feature.title}
            className="group rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/40 backdrop-blur-xl transition hover:-translate-y-1 hover:border-white/30"
            variants={fadeInUp}
          >
            <div className="flex items-center justify-between text-sm text-[#64748B]">
              <span className="uppercase tracking-widest text-xs">Capability</span>
              <span>{feature.metric}</span>
            </div>
            <h3 className="mt-6 text-2xl font-semibold text-white">{feature.title}</h3>
            <p className="mt-3 text-slate-300">{feature.description}</p>
            <div className="mt-6 h-1.5 rounded-full bg-white/10">
              <div className="h-full rounded-full bg-gradient-to-r from-[#22d3ee] via-[#38bdf8] to-[#a855f7]" />
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  )
}

