"use client"

import { motion } from "framer-motion"

import { fadeInUp, subtleScale } from "@/components/sections/motion-presets"
import { Button } from "@/components/ui/button"

export function CTASection() {
  return (
    <motion.section
      id="contact"
      className="mx-auto max-w-5xl rounded-[32px] border border-white/10 bg-gradient-to-r from-[#0f172a] via-[#111b2f] to-[#010203] px-10 py-12 text-center text-white shadow-[0_50px_120px_-60px_rgba(15,23,42,1)] backdrop-blur-2xl"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.4 }}
      variants={subtleScale}
    >
      <motion.p className="text-xs uppercase tracking-[0.5em] text-[#64748B]" variants={fadeInUp}>
        Ready to mobilize
      </motion.p>
      <motion.h2 className="mt-4 text-3xl font-semibold sm:text-4xl" variants={fadeInUp}>
        Partner with Helix data strategists
      </motion.h2>
      <motion.p className="mt-4 text-lg text-slate-300" variants={fadeInUp}>
        Work directly with our enterprise field team to map use cases, security posture, and deployment sequencing within two
        weeks.
      </motion.p>
      <motion.div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row" variants={fadeInUp}>
        <Button className="w-full rounded-full bg-white px-8 py-6 text-base font-semibold text-[#010203] hover:bg-white/90 sm:w-auto">
          Schedule Strategy Call
        </Button>
        <Button
          variant="outline"
          className="w-full rounded-full border-white/30 bg-transparent px-8 py-6 text-base text-white hover:border-white/50 hover:bg-white/5 sm:w-auto"
        >
          Download Solution Brief
        </Button>
      </motion.div>
    </motion.section>
  )
}

