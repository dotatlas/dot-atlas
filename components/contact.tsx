"use client"

import { useEffect, useRef, useState } from "react"
import { Github, Linkedin, Mail, FileText, Phone } from "lucide-react"

const links = [
  { icon: Github, label: "GitHub", href: "https://github.com/dotatlas" },
  { icon: Linkedin, label: "LinkedIn", href: "https://linkedin.com/in/jevendenwallick" },
  { icon: Mail, label: "Email", href: "mailto:jewallick@pm.me" },
  { icon: Phone, label: "(407) 452-8929", href: "tel:+14074528929" },
  { icon: FileText, label: "Resume", href: "/Joshua_Evenden-Wallick_resume.pdf" },
]

export function Contact() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true)
      },
      { threshold: 0.15 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section id="contact" ref={sectionRef} className="py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        {/* Section header */}
        <div className="mb-12 flex items-center gap-4">
          <span className="font-mono text-sm text-primary">05 /</span>
          <h2 className="text-3xl font-bold text-foreground md:text-4xl">
            Get in Touch
          </h2>
          <div className="h-px flex-1 bg-gradient-to-r from-border to-transparent" />
        </div>

        <div
          className={`mx-auto max-w-xl text-center transition-all duration-700 ${
            visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          <p className="text-sm leading-relaxed text-muted-foreground">
            {"I'm always open to discussing new opportunities, interesting projects, or just chatting about tech. Feel free to reach out!"}
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {links.map(({ icon: Icon, label, href }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith("http") ? "_blank" : href.endsWith(".pdf") ? "_blank" : undefined}
                rel={href.startsWith("http") || href.endsWith(".pdf") ? "noopener noreferrer" : undefined}
                className="glass glass-hover inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm text-muted-foreground transition-all duration-300 hover:text-primary"
              >
                <Icon size={16} />
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
