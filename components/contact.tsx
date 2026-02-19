"use client"

import { useEffect, useRef, useState } from "react"
import Script from "next/script"
import { Github, Linkedin, Mail, FileText, Phone } from "lucide-react"
import {
  getProtectedEmail,
  getProtectedPhoneDisplay,
  getProtectedPhoneE164,
  getProtectedResumePath,
} from "@/lib/contact-protection"

declare global {
  interface Window {
    onTurnstileSuccess?: (token: string) => void
    onTurnstileExpired?: () => void
    onTurnstileError?: () => void
  }
}

const links = [
  { icon: Github, label: "GitHub", href: "https://github.com/dotatlas" },
  { icon: Linkedin, label: "LinkedIn", href: "https://linkedin.com/in/jevendenwallick" },
]

export function Contact() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const [email, setEmail] = useState<string | null>(null)
  const [phone, setPhone] = useState<string | null>(null)
  const [isHumanVerified, setIsHumanVerified] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [verificationError, setVerificationError] = useState<string | null>(null)
  const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY

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

  useEffect(() => {
    if (!turnstileSiteKey) {
      setVerificationError("Turnstile site key is missing.")
      return
    }

    window.onTurnstileSuccess = async (token: string) => {
      setVerificationError(null)
      setIsVerifying(true)

      try {
        const response = await fetch("/api/turnstile/verify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        })

        if (!response.ok) {
          setIsHumanVerified(false)
          setVerificationError("Verification failed. Please try again.")
          return
        }

        const data = (await response.json()) as { success?: boolean }
        if (!data.success) {
          setIsHumanVerified(false)
          setVerificationError("Verification failed. Please retry the challenge.")
          return
        }

        setIsHumanVerified(true)
      } catch {
        setIsHumanVerified(false)
        setVerificationError("Could not verify challenge. Try again.")
      } finally {
        setIsVerifying(false)
      }
    }

    window.onTurnstileExpired = () => {
      setIsHumanVerified(false)
      setVerificationError("Verification expired. Please verify again.")
    }

    window.onTurnstileError = () => {
      setIsHumanVerified(false)
      setVerificationError("Turnstile error. Please refresh and retry.")
    }

    return () => {
      window.onTurnstileSuccess = undefined
      window.onTurnstileExpired = undefined
      window.onTurnstileError = undefined
    }
  }, [turnstileSiteKey])

  const handleEmailReveal = () => {
    if (!isHumanVerified) return

    const value = email ?? getProtectedEmail()
    setEmail(value)
    window.location.href = `${"mail" + "to"}:${value}`
  }

  const handlePhoneReveal = () => {
    if (!isHumanVerified) return

    const display = phone ?? getProtectedPhoneDisplay()
    const dial = getProtectedPhoneE164()
    setPhone(display)
    window.location.href = `${"te" + "l"}:${dial}`
  }

  const handleResumeOpen = () => {
    if (!isHumanVerified) return

    window.open(getProtectedResumePath(), "_blank", "noopener,noreferrer")
  }

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

          {!isHumanVerified && turnstileSiteKey ? (
            <>
              <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer />
              <div className="mt-6 flex justify-center">
                <div
                  className="cf-turnstile"
                  data-sitekey={turnstileSiteKey}
                  data-callback="onTurnstileSuccess"
                  data-expired-callback="onTurnstileExpired"
                  data-error-callback="onTurnstileError"
                />
              </div>
            </>
          ) : null}

          {!isHumanVerified && (
            <p className="mt-3 text-xs text-muted-foreground">
              {isVerifying
                ? "Verifying challenge..."
                : verificationError ?? "Complete Turnstile to reveal email/phone/resume."}
            </p>
          )}

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

            <button
              type="button"
              onClick={handleEmailReveal}
              disabled={!isHumanVerified}
              className="inline-flex items-center gap-2 rounded-xl glass px-5 py-3 text-sm text-muted-foreground transition-all duration-300 glass-hover hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Mail size={16} />
              Email
            </button>

            <button
              type="button"
              onClick={handlePhoneReveal}
              disabled={!isHumanVerified}
              className="inline-flex items-center gap-2 rounded-xl glass px-5 py-3 text-sm text-muted-foreground transition-all duration-300 glass-hover hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Phone size={16} />
              Phone Number
            </button>

            <button
              type="button"
              onClick={handleResumeOpen}
              disabled={!isHumanVerified}
              className="inline-flex items-center gap-2 rounded-xl glass px-5 py-3 text-sm text-muted-foreground transition-all duration-300 glass-hover hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FileText size={16} />
              Resume
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
