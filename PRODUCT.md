# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Recruiters and hiring managers evaluating Joshua Evenden-Wallick for software / embedded engineering internships and roles. They arrive from a resume link or LinkedIn, skim for who he is, where he has worked, and what he built, and decide in under a minute whether to reach out.

## Product Purpose

A personal portfolio for Joshua Evenden-Wallick, Computer Engineering student (UCF, 2028) and software engineer. Success is a recruiter understanding his range (embedded C/C++ and hardware through cloud services and full-stack tools) and emailing him.

## Positioning

He works across the hardware/software boundary: React, TypeScript and GraphQL products with AI features at The Home Depot, telemetry platforms plus C firmware and serial drivers at Lockheed Martin, Golang services and ESP32 firmware for bionic devices at Limbitless, Golang backends at FINFROCK. The site's signature is that it is fabricated on arrival: a desktop PCB mill engraves the board the page is set on, which is a truthful nod to someone who builds things that touch real hardware.

## Operating Context

Visited on desktop and phone, usually once, often from a resume. The board-milling intro plays once per session and must be skippable and replayable.

## Capabilities and Constraints

- Next.js 16 (App Router), React 19, Tailwind v4, framer-motion, three / @react-three/fiber / drei. Keep this stack.
- All content lives in `config/portfolio-content.ts` and must remain the single source. Source of truth is his October 2026 PDF resume: only the tech stacks it lists may appear (no Java, AWS, .NET, Next.js or other stacks from older resumes). A newer pasted resume may inform what a vague bullet actually built, never which technology was used.
- Intro: the site is fabricated by a machine on arrival. Originally a 3D printer; at the user's request (2026-10-20) it is a desktop CNC PCB mill whose V-bit touches the board while engraving the copper. The camera must stay calm: one slow eased move, never tracking the tool.
- Structure: one long-scroll page, every role's details readable inline (no carousels, no modal).

## Brand Commitments

- Dark ground (user rejected a light/paper look).
- The red accent stays; it is part of his identity.

## Evidence on Hand

- Resume content: 4 roles (The Home Depot, Lockheed Martin, Limbitless Solutions, FINFROCK), 2 projects (Volunteer Hub, solo; PEP 25, Robotics Club of Central Florida Systems Software Team), education (UCF Computer Engineering, 3.7 GPA, Burnett Honors and Provost Scholar), skills, contact links (email, GitHub, LinkedIn, phone). The site does not show the phone number.
- `public/models/nozzle.stl`: the hotend model from the old printer intro, no longer used.
- Resume PDF: `public/resume/joshua-evenden-wallick-resume.pdf`, shown in the on-site viewer and offered as a download; replacing the file updates both.
- No photographs of his own work, no testimonials. Never fabricate quotes, logos, metrics or press beyond the resumes' own numbers (90% handoff reduction, 12% battery, 1,000+ employees, 20+ licenses, 3.7 GPA). Pictures on the site are credited open-licence photos of the field, captioned as such.

## Product Principles

1. A recruiter gets name, role and range in the first five seconds, intro or not.
2. Motion is fabrication: things are built, layered and extruded, never just faded for decoration.
3. Every claim is from the CV; specifics beat adjectives.
4. Skimmable first, deep on demand: all detail is on the page, ordered by importance.

## Accessibility & Inclusion

Respect `prefers-reduced-motion` (intro skipped or reduced to a still), keyboard-reachable skip control, WCAG AA contrast on the dark ground.
