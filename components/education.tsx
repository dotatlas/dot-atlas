"use client"

import { useEffect, useRef, useState } from "react"
import { GraduationCap, Award, Landmark } from "lucide-react"

export function Education() {
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
    <section id="education" ref={sectionRef} className="py-20 md:py-28">
      <div className="mx-auto w-[70%]">
        <span className="font-mono text-xs uppercase tracking-widest text-primary">
          04 /{" "}
        </span>
        <h2 className="mt-1 text-3xl font-bold text-foreground md:text-4xl">
          Education
        </h2>

        <div
          className={`mt-10 rounded-2xl glass red-glow p-8 transition-all duration-700 ${
            visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:gap-8">
            <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Landmark size={28} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-foreground">
                  B.S. Computer Engineering
                </h3>
                <GraduationCap size={20} className="text-primary" />
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                University of Central Florida &middot; Expected May 2028
              </p>
              <p className="mt-1 font-mono text-sm text-primary">GPA: 3.7 / 4.0</p>

              <div className="mt-6 flex flex-col gap-3">
                <div className="flex items-start gap-3">
                  <Award size={16} className="mt-0.5 flex-shrink-0 text-primary" />
                  <span className="text-sm text-muted-foreground">
                    Burnett Honors Scholar
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <Award size={16} className="mt-0.5 flex-shrink-0 text-primary" />
                  <span className="text-sm text-muted-foreground">
                    Provost Scholar
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
