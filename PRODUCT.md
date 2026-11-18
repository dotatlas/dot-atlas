# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Recruiters and hiring managers evaluating Joshua Evenden-Wallick for software / embedded engineering internships and roles. They arrive from a resume link or LinkedIn, skim for who he is, where he has worked, and what he built, and decide in under a minute whether to reach out.

## Product Purpose

A personal portfolio for Joshua Evenden-Wallick, Computer Engineering student (UCF, 2028) and software engineer. Success is a recruiter understanding his range (embedded C/C++ and hardware through cloud services and full-stack tools) and emailing him.

## Positioning

He works across the hardware/software boundary: C flight-computer software and I2C telemetry at Lockheed Martin, Java microservices on AWS at The Home Depot, ESP32 firmware for bionic devices at Limbitless, Golang backends at FINFROCK. The site's signature is that it is fabricated on arrival: a desktop PCB mill engraves the board the page is set on, which is a truthful nod to someone who builds things that touch real hardware.

## Operating Context

Visited on desktop and phone, usually once, often from a resume. The board-milling intro plays once per session and must be skippable and replayable.

## Capabilities and Constraints

- Next.js 16 (App Router), React 19, Tailwind v4, framer-motion, three / @react-three/fiber / drei. Keep this stack.
- All content lives in `config/portfolio-content.ts` and must remain the single source. Source of truth is his November 2026 PDF resume: entries it covers say what it says, with its stacks only. FINFROCK, Volunteer Hub and Printing Profiles are not on it and are kept as they were, at his request (2026-11-18).
- Intro: the site is fabricated by a machine on arrival. Originally a 3D printer; at the user's request (2026-10-20) it is a desktop CNC PCB mill whose V-bit touches the board while engraving the copper. The camera must stay calm: one slow eased move, never tracking the tool.
- Structure: one long-scroll page, every role's details readable inline (no carousels, no modal).

## Brand Commitments

- Dark ground (user rejected a light/paper look).
- The red accent stays; it is part of his identity.

## Evidence on Hand

- Resume content: 3 roles (Lockheed Martin, The Home Depot, Limbitless Solutions) plus FINFROCK from an older resume, 4 projects (Volunteer Hub, solo; PEP 25, Robotics Club of Central Florida; Printing Profiles; Self-Driving Car Simulator), education (UCF Computer Engineering, 3.7 GPA, Burnett Honors and Provost Scholar), skills, contact links (email, GitHub, LinkedIn, phone). The site does not show the phone number.
- Two projects are in development: Printing Profiles (a test build at printingprofiles.com, not yet functional; never call it live; copy from its repo) and the Self-Driving Car Simulator (copy from the resume). Each shows a one-line status notice; the site never shows their build plans or roadmaps.
- `public/models/nozzle.stl`: the hotend model from the old printer intro, no longer used.
- Resume PDF: `public/resume/joshua-evenden-wallick-resume.pdf`, shown in the on-site viewer and offered as a download; replacing the file updates both.
- No photographs of his own work, no testimonials. Never fabricate quotes, logos, metrics or press beyond the resumes' own numbers (12% battery, under 12 ms braking, 1,000+ employees, 20+ licenses, 3.7 GPA). The only picture on the site is the credited open-licence milling clip behind the footer; no stock photographs.

## Product Principles

1. A recruiter gets name, role and range in the first five seconds, intro or not.
2. Motion is fabrication: things are built, layered and extruded, never just faded for decoration.
3. Every claim is from the CV; specifics beat adjectives.
4. Skimmable first, deep on demand: all detail is on the page, ordered by importance.

## Accessibility & Inclusion

Respect `prefers-reduced-motion` (intro skipped or reduced to a still), keyboard-reachable skip control, WCAG AA contrast on the dark ground.
