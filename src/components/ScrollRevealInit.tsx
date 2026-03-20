"use client"

import { useEffect } from "react"

export function ScrollRevealInit() {
  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    const targets = document.querySelectorAll(".reveal, .reveal-stagger")

    if (prefersReduced) {
      targets.forEach((el) => el.classList.add("in-view"))
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view")
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0 }
    )

    targets.forEach((el) => observer.observe(el))

    // Safety net: reveal elements that were scrolled past too fast
    const revealPassed = () => {
      targets.forEach((el) => {
        if (el.classList.contains("in-view")) return
        const rect = el.getBoundingClientRect()
        if (rect.bottom < window.innerHeight) {
          el.classList.add("in-view")
          observer.unobserve(el)
        }
      })
    }

    window.addEventListener("scrollend", revealPassed)
    return () => {
      observer.disconnect()
      window.removeEventListener("scrollend", revealPassed)
    }
  }, [])

  // Editorial colophon
  useEffect(() => {
    console.log(
      '%c✂ ImgSplit',
      'font-family: Georgia, serif; font-size: 24px; color: #D4AF37; font-style: italic;'
    )
    console.log(
      '%cPrecision image splitting, crafted with care.\nhttps://imgsplit.com',
      'font-family: system-ui; font-size: 12px; color: #6C6863; line-height: 1.8;'
    )
  }, [])

  return null
}
