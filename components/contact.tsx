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
    <section id="contact" ref={sectionRef} className="py-16 md:py-24">
      <div className="mx-auto max-w-5xl px-6">
        <div
          className={`mx-auto max-w-xl text-center transition-all duration-700 ${
            visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          <h2 className="text-2xl font-semibold text-foreground md:text-3xl">
            Get in Touch
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            {"I'm always open to discussing new opportunities, interesting projects, or just chatting about tech. Feel free to reach out!"}
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {links.map(({ icon: Icon, label, href }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith("http") ? "_blank" : href.endsWith(".pdf") ? "_blank" : undefined}
                rel={href.startsWith("http") || href.endsWith(".pdf") ? "noopener noreferrer" : undefined}
                className="inline-flex items-center gap-2 rounded-2xl border border-border bg-card px-5 py-3 text-sm text-muted-foreground transition-all duration-300 hover:border-primary/25 hover:text-foreground hover:-translate-y-0.5"
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
