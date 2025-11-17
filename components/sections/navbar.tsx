"use client"

import Link from "next/link"
import { motion } from "framer-motion"

import { fadeInDown } from "@/components/sections/motion-presets"
import { Button } from "@/components/ui/button"

const navLinks = [
  { href: "#features", label: "Features" },
  { href: "#sectors", label: "Sectors" },
  { href: "#analytics", label: "Analytics" },
  { href: "#contact", label: "Contact" },
]

function handleSmoothScroll(e: React.MouseEvent<HTMLAnchorElement>, href: string) {
  e.preventDefault()
  const targetId = href.replace("#", "")
  const element = document.getElementById(targetId)
  if (element) {
    const headerOffset = 100 // Offset for sticky navbar + spacing
    const elementPosition = element.getBoundingClientRect().top
    const offsetPosition = elementPosition + window.scrollY - headerOffset

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    })
  }
}

export function Navbar() {
  return (
    <motion.header
      className="sticky top-6 z-50 w-full"
      initial="hidden"
      animate="visible"
      variants={fadeInDown}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm text-slate-200 shadow-2xl shadow-black/40 backdrop-blur-xl">
        <Link
          href="#"
          onClick={(e) => {
            e.preventDefault()
            window.scrollTo({ top: 0, behavior: "smooth" })
          }}
          className="text-base font-semibold tracking-tight text-white"
        >
          Helix Analytics
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={(e) => handleSmoothScroll(e, link.href)}
              className="text-sm font-medium text-slate-300 transition hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Button
            variant="outline"
            className="rounded-full border-white/30 bg-transparent px-5 py-2 text-sm font-medium text-white transition hover:border-white/50 hover:bg-white/5 hover:text-white"
          >
            Login
          </Button>
          <Button className="rounded-full bg-white/90 px-5 py-2 text-sm font-semibold text-black transition hover:bg-white">
            Sign Up
          </Button>
        </div>

        <button
          className="inline-flex size-10 items-center justify-center rounded-full border border-white/10 text-white/80 transition hover:text-white md:hidden"
          aria-label="Open navigation"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            className="size-5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        </button>
      </div>
    </motion.header>
  )
}

