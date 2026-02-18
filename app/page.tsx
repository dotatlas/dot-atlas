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
      <Nav />

      <main className="relative">
        <Hero />

        <BentoGrid
          title="Experience"
          id="experience"
          items={experienceItems}
        />

        <BentoGrid
          title="Projects"
          id="projects"
          items={projectItems}
        />

        <Skills />

        <Education />

        <Contact />
      </main>

      {/* Footer */}
      <footer className="relative border-t border-border/30 py-8">
        <div className="mx-auto max-w-5xl text-center px-6">
          <p className="text-xs text-muted-foreground">
            Designed & Built by Joshua Evenden-Wallick
          </p>
        </div>
      </footer>
    </>
  )
}
