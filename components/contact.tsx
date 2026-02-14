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
    <section id="contact" ref={sectionRef} className="py-20 md:py-28">
      <div className="mx-auto w-[85%]">
        <div
          className={`mx-auto max-w-xl text-center transition-all duration-700 ${
            visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          <span className="font-mono text-xs uppercase tracking-widest text-primary">
            05 /{" "}
          </span>
          <h2 className="mt-1 text-3xl font-bold text-foreground md:text-4xl">
            Get in Touch
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            {"I'm always open to discussing new opportunities, interesting projects, or just chatting about tech. Feel free to reach out!"}
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            {links.map(({ icon: Icon, label, href }) => (
                <a
                key={label}
                href={href}
                target={href.startsWith("http") ? "_blank" : href.endsWith(".pdf") ? "_blank" : undefined}
                rel={href.startsWith("http") || href.endsWith(".pdf") ? "noopener noreferrer" : undefined}
                className="inline-flex items-center gap-2 rounded-xl glass px-5 py-3 text-sm text-muted-foreground transition-all duration-300 glass-hover hover:text-primary"
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
