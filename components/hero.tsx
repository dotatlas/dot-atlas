"use client"

import { useEffect, useState } from "react"
import { ChevronDown, Github, Linkedin, Mail, FileText } from "lucide-react"

export function Hero() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100)
    return () => clearTimeout(t)
  }, [])

  return (
    <section
      id="about"
      className="relative flex min-h-screen items-center justify-center px-6"
    >
      <div
        className={`mx-auto max-w-2xl text-center transition-all duration-1000 ${
          visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
        }`}
      >
        <h1 className="text-balance text-4xl font-bold leading-tight tracking-tight text-foreground md:text-6xl">
          Hi, I{"'"}m{" "}
          <span className="text-primary">
            Joshua Evenden-Wallick
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-lg text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
          Find me building web applications, embedded systems, and enterprise software. Pursuing a B.S. in
          Computer Engineering w/ a focus on Software Development at the University of Central Florida. I also wakeboard in my freetime as well as 3D printing & collecting vinyls :)
        </p>

        <div className="mt-10 flex items-center justify-center gap-4">
          <a
            href="#contact"
            className="inline-flex items-center gap-2 rounded-2xl bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-all duration-300 hover:bg-primary/90"
          >
            Get in Touch
          </a>
          <a
            href="#projects"
            className="inline-flex items-center gap-2 rounded-2xl border border-border px-6 py-3 text-sm font-medium text-foreground transition-all duration-300 hover:border-primary/30 hover:text-primary"
          >
            View Work
          </a>
        </div>

        <div className="mt-8 flex items-center justify-center gap-5">
          <a
            href="https://github.com/dotatlas"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="text-muted-foreground transition-colors duration-300 hover:text-foreground"
          >
            <Github size={20} />
          </a>
          <a
            href="https://linkedin.com/in/jevendenwallick"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="text-muted-foreground transition-colors duration-300 hover:text-foreground"
          >
            <Linkedin size={20} />
          </a>
          <a
            href="mailto:jewallick@pm.me"
            aria-label="Email"
            className="text-muted-foreground transition-colors duration-300 hover:text-foreground"
          >
            <Mail size={20} />
          </a>
          <a
            href="/Joshua_Evenden-Wallick_resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Resume"
            className="text-muted-foreground transition-colors duration-300 hover:text-foreground"
          >
            <FileText size={20} />
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <a
        href="#experience"
        aria-label="Scroll down"
        className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-muted-foreground transition-colors hover:text-foreground"
      >
        <ChevronDown size={24} />
      </a>
    </section>
  )
}
