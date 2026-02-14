"use client"

import { Nav } from "@/components/nav"
import { Hero } from "@/components/hero"
import { HorizontalGallery } from "@/components/horizontal-gallery"
import { Skills } from "@/components/skills"
import { Education } from "@/components/education"
import { Contact } from "@/components/contact"
import { experienceItems, projectItems } from "@/lib/data"

export default function Page() {
  return (
    <>
      {/* Fixed background image */}
      <div
        className="fixed inset-0 -z-10"
        aria-hidden="true"
      >
        <img
          src="/images/bg.jpg"
          alt=""
          className="h-full w-full object-cover"
          style={{ filter: "brightness(0.35) saturate(0.8)" }}
        />
        {/* Dark overlay for extra contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/50 to-background/90" />
        {/* Subtle grain texture */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E\")",
            backgroundRepeat: "repeat",
            backgroundSize: "128px 128px",
          }}
        />
      </div>

      <Nav />

      <main className="relative">
        <Hero />

        {/* Divider */}
        <div className="mx-auto h-px w-[85%] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

        <HorizontalGallery
          title="Professional Experience"
          id="experience"
          items={experienceItems}
        />

        <div className="mx-auto h-px w-[85%] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

        <HorizontalGallery
          title="Projects"
          id="projects"
          items={projectItems}
        />

        <div className="mx-auto h-px w-[85%] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

        <Skills />

        <div className="mx-auto h-px w-[85%] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

        <Education />

        <div className="mx-auto h-px w-[85%] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

        <Contact />
      </main>

      {/* Footer */}
      <footer className="relative border-t border-border/30 py-8">
        <div className="mx-auto w-[85%] text-center">
          <p className="text-xs text-muted-foreground">
            Designed & Built by Joshua Evenden-Wallick
          </p>
        </div>
      </footer>
    </>
  )
}
