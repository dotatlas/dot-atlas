"use client"

import { useEffect, useRef, useState } from "react"
import { Code2, Globe, Wrench } from "lucide-react"

const PythonIcon = () => (
  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor">
    <path d="M11.9 1C6.4 1 6.8 3.3 6.8 3.3l0 2.4h5.2v.7H4.5S1 6 1 11.5s3.1 5.3 3.1 5.3h1.8V14.5s-.1-3.1 3.1-3.1h5.2s2.9 0 2.9-2.9V3.9S17.6 1 11.9 1zM8.7 2.7c.5 0 .9.4.9.9s-.4.9-.9.9c-.5 0-.9-.4-.9-.9 0-.5.4-.9.9-.9z" />
    <path d="M12.1 23c5.5 0 5.1-2.3 5.1-2.3v-2.4h-5.2v-.7h7.5S23 18 23 12.5s-3.1-5.3-3.1-5.3h-1.8v2.3s.1 3.1-3.1 3.1h-5.2s-2.9 0-2.9 2.9v4.6S6.4 23 12.1 23zm3.2-1.7c-.5 0-.9-.4-.9-.9s.4-.9.9-.9.9.4.9.9-.4.9-.9.9z" />
  </svg>
)
const TypeScriptIcon = () => (
  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor">
    <path d="M1 1v22h22V1H1zm13.5 18.3c0 1.4-.7 2.1-1.9 2.6l-1-.8c.8-.4 1.3-.8 1.3-1.7v-5.5h1.6v5.4zm3.8 2.6c-1.3 0-2.2-.5-2.8-1.2l1.1-.9c.4.5 1 .8 1.7.8.7 0 1.2-.4 1.2-.9 0-.6-.5-.8-1.3-1.1l-.5-.2c-1.3-.6-2.2-1.2-2.2-2.7 0-1.3 1-2.3 2.6-2.3 1.1 0 1.9.4 2.5 1.4l-1.1.8c-.3-.5-.7-.7-1.3-.7-.6 0-1 .4-1 .8 0 .6.4.8 1.2 1.2l.5.2c1.5.7 2.4 1.3 2.4 2.8 0 1.6-1.2 2.5-2.9 2.5zM13 14.5H7v-1.6h7.6v1.6H13z" />
  </svg>
)
const JavaScriptIcon = () => (
  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor">
    <path d="M1 1v22h22V1H1zm12.1 18.2c0 2-1.2 2.9-2.9 2.9-1.5 0-2.4-.8-2.9-1.7l1.6-.9c.3.5.5.9 1.2.9.6 0 1-.2 1-1.2v-6.5h2v6.5zm4.7 2.9c-1.8 0-2.9-.8-3.5-1.9l1.6-.9c.4.7 1 1.2 1.9 1.2.8 0 1.3-.4 1.3-1 0-.7-.5-.9-1.4-1.3l-.5-.2c-1.4-.6-2.3-1.3-2.3-2.9 0-1.4 1.1-2.5 2.8-2.5 1.2 0 2.1.4 2.7 1.5l-1.5.9c-.3-.6-.7-.8-1.2-.8s-.9.3-.9.8c0 .5.3.8 1.1 1.1l.5.2c1.6.7 2.6 1.4 2.6 3 0 1.7-1.3 2.8-3.2 2.8z" />
  </svg>
)
const JavaIcon = () => (
  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor">
    <path d="M8.9 18.6s-.9.5.6.7c1.8.2 2.8.2 4.8-.2 0 0 .5.3 1.3.6-4.5 1.9-10.1-.1-6.7-1.1zm-.6-2.6s-1 .7.5.9c2 .2 3.5.2 6.2-.3 0 0 .4.4 1 .6-5.4 1.6-11.4.1-7.7-1.2zm4.3-4.4c1.2 1.3-.3 2.6-.3 2.6s3-1.5 1.6-3.5c-1.3-1.8-2.3-2.7 3.1-5.8 0 0-8.5 2.1-4.4 6.7zM18 20.2s.6.5-.7 1c-2.6.8-10.6 1-12.8 0-.8-.3.7-.8 1.2-.9.5-.1.7-.1.7-.1-.9-.6-5.5 1.2-2.3 1.7 8.5 1.5 15.5-.7 13.9-1.7zM9.5 13s-3.9.9-1.4 1.3c1.1.1 3.2.1 5.2-.1 1.6-.1 3.2-.4 3.2-.4s-.6.2-.9.5c-3.9 1-11.3.5-9.2-.5 1.8-.8 3.1-.8 3.1-.8zm6.8 3.8c3.9-2 2.1-4 .8-3.7-.3.1-.4.2-.4.2s.1-.2.3-.3c2.3-.8 4.1 2.4-.8 3.7 0 0 .1 0 .1-.1v.2zM12.7 1s2.2 2.2-2.1 5.5c-3.4 2.7-.8 4.2 0 5.9-2-.1.8-3.4 3.1-4.9 1.7-1.1 3-2.3 2-3.2C14.3 2.5 11.3 1.8 12.7 1z" />
  </svg>
)
const CppIcon = () => (
  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor">
    <path d="M20.7 12c0-.2 0-.3 0-.5l2-3.5-2-3.5c-.2-.1-.3-.1-.5-.2L16.7 2.3c-.2 0-.3 0-.5 0L12.7.3h-.4c-.2 0-.3 0-.5 0L8.3 2.3c-.2 0-.3.1-.5.2L4.3 4.5c-.2.1-.3.2-.4.4L.4 8.4c-.1.2-.1.3-.1.5v4.2c0 .2 0 .3.1.5l3.5 3.5c.1.2.2.3.4.4l3.5 2c.2.1.3.2.5.2l3.5 2h.4c.2 0 .3 0 .5 0l3.5-2c.2 0 .3-.1.5-.2l3.5-2c.2-.1.3-.2.5-.4l2-3.5c0-.2 0-.3 0-.5v-1zm-8.7 5c-2.8 0-5-2.2-5-5s2.2-5 5-5c1.7 0 3.2.8 4.1 2.1l-2 1.2c-.5-.8-1.2-1.3-2.1-1.3-1.7 0-3 1.3-3 3s1.3 3 3 3c.9 0 1.6-.5 2.1-1.3l2 1.2c-.9 1.3-2.4 2.1-4.1 2.1zm5.5-4h-1v1h-1v-1h-1v-1h1v-1h1v1h1v1zm3 0h-1v1h-1v-1h-1v-1h1v-1h1v1h1v1z" />
  </svg>
)
const CSharpIcon = () => (
  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8c1.85 0 3.55.63 4.9 1.69L13.46 9.5c-.75-.62-1.7-1-2.74-1-2.35 0-4.26 1.91-4.26 4.26s1.91 4.26 4.26 4.26c1.04 0 1.99-.38 2.74-1L14.9 18.31C13.55 19.37 11.85 20 10 20h2zm5-7h-1v1h-1v-1h-1v-1h1v-1h1v1h1v1zm3 0h-1v1h-1v-1h-1v-1h1v-1h1v1h1v1z" />
  </svg>
)
const SqlIcon = () => (
  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor">
    <path d="M12 3C7 3 3 4.3 3 6v12c0 1.7 4 3 9 3s9-1.3 9-3V6c0-1.7-4-3-9-3zm0 2c4.4 0 7 1.1 7 1s-2.6 1-7 1S5 7.1 5 6s2.6-1 7-1zM5 8.3c1.6.8 4.1 1.2 7 1.2s5.4-.4 7-1.2V12c0 .9-2.6 2-7 2s-7-1.1-7-2V8.3zm0 5.7c1.6.8 4.1 1.2 7 1.2s5.4-.4 7-1.2V18c0 .9-2.6 2-7 2s-7-1.1-7-2V14z" />
  </svg>
)
const BashIcon = () => (
  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor">
    <path d="M4 2a2 2 0 00-2 2v16a2 2 0 002 2h16a2 2 0 002-2V4a2 2 0 00-2-2H4zm2.5 4.5l4 3.5-4 3.5-1-1.2L8.3 10 5.5 7.7l1-1.2zM11 15h5v1.5h-5V15z" />
  </svg>
)
const CIcon = () => (
  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8c1.85 0 3.55.63 4.9 1.69l-1.44 2.03c-.75-.62-1.7-1-2.74-1-2.35 0-4.26 1.91-4.26 4.26s1.91 4.26 4.26 4.26c1.04 0 1.99-.38 2.74-1l1.44 2.03C15.55 19.37 13.85 20 12 20z" />
  </svg>
)
const ReactIcon = () => (
  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor">
    <path d="M12 10.1c-1 0-1.9.9-1.9 1.9s.9 1.9 1.9 1.9 1.9-.9 1.9-1.9-.9-1.9-1.9-1.9zM12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8z" />
  </svg>
)
const NextjsIcon = () => (
  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor">
    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c1.7 0 3.3-.4 4.7-1.2L9.2 9.7V16H7.5V7h1.7l8.5 12.5c2.5-1.9 4.3-5 4.3-8.5 0-5.5-4.5-10-10-10zm4.5 14.5V9h1.7v9.2l-1.7-1.7z" />
  </svg>
)
const NodeIcon = () => (
  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor">
    <path d="M12 1.8L3 7v10l9 5.2 9-5.2V7l-9-5.2zM5 15.7V8.3l7 4v7.4l-7-4zm9 4V12.3l7-4v7.4l-7 4zM12 4.1l6.9 4L12 12.1 5.1 8.1l6.9-4z" />
  </svg>
)
const DotnetIcon = () => (
  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor">
    <path d="M3.2 14.6c-.4 0-.7-.1-1-.4-.3-.3-.4-.6-.4-1s.1-.7.4-1c.3-.3.6-.4 1-.4s.7.1 1 .4c.3.3.4.6.4 1s-.1.7-.4 1c-.3.3-.6.4-1 .4zm8.5 0h-2.2l-3.9-6.3c-.2-.3-.3-.5-.4-.8h0c.1.4.1.9.1 1.5v5.6H3.7V6.5h2.4l3.7 6.1c.3.5.5.8.5.9h0c-.1-.4-.1-.9-.1-1.5V6.5h1.5v8.1zm7.3-1.6c0 .5-.2 1-.6 1.2-.4.3-1 .4-1.7.4-.7 0-1.3-.1-1.8-.3v-1.4c.6.3 1.2.5 1.7.5.7 0 1-.2 1-.7 0-.2-.1-.3-.2-.5-.2-.1-.5-.3-.9-.5-.9-.4-1.3-1-1.3-1.7 0-.5.2-.9.6-1.2.4-.3.9-.4 1.5-.4.6 0 1.2.1 1.7.4l-.5 1.1c-.5-.2-.9-.3-1.3-.3-.5 0-.8.2-.8.5 0 .2.1.3.2.4.2.1.5.3.9.5.5.2.8.5 1 .8.2.3.3.6.3 1z" />
  </svg>
)
const GitIcon = () => (
  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor">
    <path d="M23.5 11.3l-10.8-10.8c-.7-.7-1.7-.7-2.3 0L8.2 2.7l2.9 2.9c.7-.2 1.4-.1 2 .5.5.5.7 1.3.5 2l2.8 2.8c.7-.2 1.4-.1 2 .5.8.8.8 2 0 2.8-.8.8-2 .8-2.8 0-.6-.6-.8-1.5-.4-2.2l-2.6-2.6v6.9c.2.1.3.2.5.4.8.8.8 2 0 2.8-.8.8-2 .8-2.8 0-.8-.8-.8-2 0-2.8.2-.2.5-.4.7-.5V9.3c-.2-.1-.5-.3-.7-.5-.6-.6-.8-1.5-.4-2.2L7.2 3.8.5 10.5c-.7.7-.7 1.7 0 2.3l10.8 10.8c.7.7 1.7.7 2.3 0l10-10c.6-.6.6-1.7-.1-2.3z" />
  </svg>
)
const DockerIcon = () => (
  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor">
    <path d="M13 3.5h2v2h-2v-2zm-2.5 0h2v2h-2v-2zm-2.5 0h2v2H8v-2zm-2.5 0h2v2h-2v-2zM13 1h2v2h-2V1zm-2.5 0h2v2h-2V1zm-2.5 0h2v2H8V1zM5.5 6h2v2h-2V6zm2.5-2.5h2v2H8v-2zM21.3 8.3c-.6-.4-2-.5-3.1-.3-.1-1.2-.7-2.2-1.6-3l-.5-.4-.4.5c-.5.7-.8 1.6-.7 2.5 0 .4.1.8.3 1.2-.5.3-1.3.5-2.5.5H.3l-.1.6c-.1 1.3.1 2.6.6 3.8.7 1.4 1.7 2.4 3.1 3 1.6.7 3.5.8 5.5.3 1.5-.4 2.8-1 3.9-2 .9-.8 1.7-1.8 2.3-3.1h.2c1.4 0 2.2-.6 2.7-1 .3-.3.6-.7.8-1.1l.2-.5h-.2z" />
  </svg>
)
const LinuxIcon = () => (
  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor">
    <path d="M12.5 3c-1.6 0-2.9 2-2.9 4.5 0 1.2.3 2.3.8 3.1.3.5.4 1 .2 1.5l-1.2 2.7c-.2.4-.1.9.2 1.2l.3.3c-.8.5-1.6 1.1-2.2 1.8-.4.5-.3 1.1.2 1.5.5.4 1.1.3 1.5-.2.7-.8 1.7-1.5 2.8-1.9.2-.1.5-.1.7 0 1.1.4 2.1 1.1 2.8 1.9.4.5 1 .6 1.5.2.5-.4.6-1 .2-1.5-.6-.7-1.4-1.3-2.2-1.8l.3-.3c.3-.3.4-.8.2-1.2l-1.2-2.7c-.2-.5-.1-1 .2-1.5.5-.8.8-1.9.8-3.1C15.4 5 14.1 3 12.5 3z" />
  </svg>
)
const FirebaseIcon = () => (
  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor">
    <path d="M5.2 18.6L7.5 3.8c.1-.4.5-.5.8-.3l2.4 4.5-5.5 10.6zm14.1-.4l-2.4-14.8c-.1-.4-.4-.5-.7-.3L4.3 19.8l7.2 4c.3.2.7.2 1 0l6.8-5.6zM11.7 10l1.8-3.3c.2-.3.6-.3.8 0l5.2 9.5-7.8-6.2z" />
  </svg>
)
const AndroidIcon = () => (
  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor">
    <path d="M6 18c0 .55.45 1 1 1h1v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V19h2v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V19h1c.55 0 1-.45 1-1V8H6v10zM3.5 8C2.67 8 2 8.67 2 9.5v7c0 .83.67 1.5 1.5 1.5S5 17.33 5 16.5v-7C5 8.67 4.33 8 3.5 8zm17 0c-.83 0-1.5.67-1.5 1.5v7c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5v-7c0-.83-.67-1.5-1.5-1.5zm-4.97-5.84l1.3-1.3c.2-.2.2-.51 0-.71s-.51-.2-.71 0l-1.48 1.48C13.85 1.23 12.95 1 12 1c-.96 0-1.86.23-2.66.63L7.85.15c-.2-.2-.51-.2-.71 0s-.2.51 0 .71l1.31 1.31C6.97 3.26 6 5.01 6 7h12c0-1.99-.97-3.75-2.47-4.84zM10 5H9V4h1v1zm5 0h-1V4h1v1z" />
  </svg>
)

interface SkillItem {
  name: string
  icon: React.FC
}

interface SkillCategoryData {
  name: string
  icon: React.FC<{ size?: number; className?: string }>
  skills: SkillItem[]
}

const skillCategories: SkillCategoryData[] = [
  {
    name: "Languages",
    icon: Code2,
    skills: [
      { name: "Java", icon: JavaIcon },
      { name: "Python", icon: PythonIcon },
      { name: "TypeScript", icon: TypeScriptIcon },
      { name: "JavaScript", icon: JavaScriptIcon },
      { name: "C++", icon: CppIcon },
      { name: "C#", icon: CSharpIcon },
      { name: "C", icon: CIcon },
      { name: "SQL", icon: SqlIcon },
      { name: "BASH", icon: BashIcon },
    ],
  },
  {
    name: "Frameworks & Libraries",
    icon: Globe,
    skills: [
      { name: "React", icon: ReactIcon },
      { name: "Next.js", icon: NextjsIcon },
      { name: "Node.js", icon: NodeIcon },
      { name: ".NET", icon: DotnetIcon },
      { name: "pandas", icon: PythonIcon },
      { name: "NumPy", icon: PythonIcon },
      { name: "Seaborn", icon: PythonIcon },
    ],
  },
  {
    name: "Tools & Platforms",
    icon: Wrench,
    skills: [
      { name: "Linux", icon: LinuxIcon },
      { name: "Git", icon: GitIcon },
      { name: "Docker", icon: DockerIcon },
      { name: "Firebase", icon: FirebaseIcon },
      { name: "Android", icon: AndroidIcon },
    ],
  },
]

export function Skills() {
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
    <section id="skills" ref={sectionRef} className="py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        {/* Section header */}
        <div className="mb-12 flex items-center gap-4">
          <span className="font-mono text-sm text-primary">03 /</span>
          <h2 className="text-3xl font-bold text-foreground md:text-4xl">
            Skills & Technologies
          </h2>
          <div className="h-px flex-1 bg-gradient-to-r from-border to-transparent" />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {skillCategories.map((cat, catIndex) => {
            const CategoryIcon = cat.icon
            return (
              <div
                key={cat.name}
                className={`glass red-glow rounded-2xl p-6 transition-all duration-700 ${
                  visible
                    ? "translate-y-0 opacity-100"
                    : "translate-y-8 opacity-0"
                }`}
                style={{ transitionDelay: `${catIndex * 150}ms` }}
              >
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <CategoryIcon size={18} />
                  </div>
                  <h3 className="font-mono text-sm font-semibold uppercase tracking-wider text-foreground">
                    {cat.name}
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {cat.skills.map((skill) => {
                    const SkillIcon = skill.icon
                    return (
                      <span
                        key={skill.name}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-secondary/60 px-3 py-1.5 text-xs text-muted-foreground transition-colors duration-300 hover:bg-primary/10 hover:text-primary"
                      >
                        <SkillIcon />
                        {skill.name}
                      </span>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
