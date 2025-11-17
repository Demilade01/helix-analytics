"use client"

import Link from "next/link"
import { motion } from "framer-motion"

import { fadeInUp, staggerContainer } from "@/components/sections/motion-presets"

const footerLinks = [
  { label: "Security", href: "#" },
  { label: "Privacy", href: "#" },
  { label: "Compliance", href: "#" },
  { label: "Careers", href: "#" },
  { label: "Support", href: "#" },
]

export function FooterSection() {
  return (
    <motion.footer
      className="mx-auto w-full max-w-6xl border-t border-white/10 py-10 text-sm text-slate-400"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={fadeInUp}
    >
      <motion.div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between" variants={staggerContainer}>
        <motion.div variants={fadeInUp}>
          <p className="text-base font-semibold tracking-tight text-white">Helix Analytics</p>
          <p className="mt-2 text-sm text-slate-500">Glassy profitability intelligence for leadership teams.</p>
        </motion.div>

        <motion.div className="flex flex-wrap gap-4" variants={staggerContainer}>
          {footerLinks.map((link) => (
            <motion.div key={link.label} variants={fadeInUp}>
              <Link href={link.href} className="transition hover:text-white">
                {link.label}
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
      <motion.p className="mt-8 text-xs text-slate-500" variants={fadeInUp}>
        © {new Date().getFullYear()} Helix Analytics. All rights reserved.
      </motion.p>
    </motion.footer>
  )
}

