"use client"

import { Nav } from "@/components/nav"
import { Hero } from "@/components/hero"
import { BentoGrid } from "@/components/bento-grid"
import { Skills } from "@/components/skills"
import { Education } from "@/components/education"
import { Contact } from "@/components/contact"
import { experienceItems, projectItems } from "@/lib/data"

export default function Page() {
  return (
    <>
      {/* Fixed background image */}
      <div className="fixed inset-0 -z-20">
        <img
          src="/images/bg.jpg"
          alt=""
          className="h-full w-full object-cover opacity-10"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/90 to-background" />
      </div>

      <Nav />

      <main className="relative">
        <Hero />

        <BentoGrid
          title="Experience"
          id="experience"
          sectionNumber="01"
          items={experienceItems}
        />

        <BentoGrid
          title="Projects"
          id="projects"
          sectionNumber="02"
          items={projectItems}
        />

        <Skills />

        <Education />

        <Contact />
      </main>

      {/* Footer */}
      <footer className="relative border-t border-border/20 py-8">
        <div className="mx-auto max-w-6xl text-center px-6">
          <p className="font-mono text-xs text-muted-foreground">
            Designed & Built by Joshua Evenden-Wallick
          </p>
        </div>
      </footer>
    </>
  )
}
