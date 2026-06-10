/**
 * Portfolio content — derived from Joshua's master CV.
 * Each section becomes a carousel; each item becomes a node.
 * `glance` is the one-line recruiter statement shown BEFORE expanding.
 * `details` is the comprehensive list shown after the print-in expansion.
 */

export type CarouselNode = {
  id: string
  title: string
  subtitle: string
  meta: string
  /** One-glance statement for recruiters. */
  glance: string
  /** Tech tags surfaced on the node. */
  tags: string[]
  /** Full bullet list shown in the expanded view. */
  details: string[]
}

export type PortfolioSection = {
  id: string
  label: string
  blurb: string
  nodes: CarouselNode[]
}

export const PROFILE = {
  name: 'Joshua Evenden-Wallick',
  role: 'Computer Engineering Student & Software Engineer',
  location: 'Orlando, FL',
  email: 'jewallick@pm.me',
  phone: '(407) 452-8929',
  github: 'https://github.com/dotatlas',
  linkedin: 'https://linkedin.com/in/jevendenwallick',
  portfolio: 'https://dotatlas.dev',
  heroLine:
    'I build embedded firmware, test automation, and full-stack systems — from C/C++ on bare metal to AI-powered web apps in production.',
}

export const SECTIONS: PortfolioSection[] = [
  {
    id: 'experience',
    label: 'Experience',
    blurb: 'Where I have shipped production firmware, tooling, and full-stack software.',
    nodes: [
      {
        id: 'home-depot',
        title: 'The Home Depot Technology',
        subtitle: 'AI/ML Software Engineering Intern',
        meta: 'Atlanta, GA · May 2026 – Aug 2026',
        glance:
          'Embedded agentic AI into enterprise web apps with React/TypeScript/Python, building a RAG pipeline and FastAPI function-calling services that cut hallucinations 25%.',
        tags: ['React', 'TypeScript', 'Python', 'FastAPI', 'LangChain', 'SQL'],
        details: [
          'Implemented an agentic AI integration across internal and consumer-facing Home Depot software to streamline communication workflows and surface contextual assistance.',
          'Built features on the Core AI Assistant team using React, TypeScript, SQL, and Python to embed conversational and agentic capabilities into enterprise web applications.',
          'Engineered a LangChain-based Retrieval-Augmented Generation (RAG) pipeline to index product manuals, reducing model hallucinations by 25%.',
          'Developed function-calling microservices using Python and FastAPI to let a customer-facing AI assistant interact directly with internal inventory and order-tracking SQL databases.',
          'Integrated WebSocket connections in a React/TypeScript frontend for real-time token streaming, significantly improving perceived UI/UX responsiveness.',
          'Collaborated with product and engineering teams using Jira, Git, and CI/CD pipelines to ship iterative improvements to AI-driven UX and backend services.',
        ],
      },
      {
        id: 'lockheed',
        title: 'Lockheed Martin',
        subtitle: 'Full-Stack Engineering Intern',
        meta: 'Orlando, FL · Apr 2025 – May 2026',
        glance:
          'Shipped a Next.js/SQL platform managing millions of rows of calibration data and wrote low-level C firmware for AMD/Xilinx FPGAs driving a real-time video pipeline.',
        tags: ['Next.js', 'TypeScript', 'C', 'FPGA', 'SQL', 'MATLAB'],
        details: [
          'Built a full-stack workflow automation web app using Next.js, TypeScript, and SQL to securely manage and index millions of rows of hardware calibration data.',
          'Developed a scalable file transfer and ingestion platform, reducing inter-department data handoff from 1 day to 30 minutes — an 85% operational efficiency gain.',
          'Authored low-level C firmware to interface with AMD/Xilinx FPGAs, managing a real-time video processing pipeline for high-frame-rate camera sensors.',
          'Engineered custom serial communication drivers (UART, SPI) to stream raw frame metadata and sensor telemetry from embedded test beds to a debugging console.',
          'Partnered with electrical and hardware teams to validate signal propagation, using logic analyzers to debug high-speed data buses and resolve timing mismatches.',
          'Engineered MATLAB scripts to process RF permittivity data and model signal propagation under diverse environmental conditions for advanced sensor systems.',
        ],
      },
      {
        id: 'limbitless',
        title: 'Limbitless Solutions',
        subtitle: 'Embedded Software Engineering Intern',
        meta: 'Orlando, FL · Jan 2025 – Mar 2025',
        glance:
          'Architected C++/FreeRTOS firmware on ESP32 for bionic prosthetics — motor control, EMG sensor fusion, and I2C battery management with real-time control loops.',
        tags: ['C++', 'FreeRTOS', 'ESP32', 'I2C', 'SPI', 'ADC'],
        details: [
          'Architected and deployed C++ firmware for ESP32 microcontrollers using FreeRTOS to handle motor control, sensor processing, and power management for bionic prosthetics.',
          'Enhanced battery management firmware by integrating I2C communication with the BMS chip to monitor real-time thermal performance, cell voltage, and safe charging thresholds.',
          'Integrated EMG sensor feedback into a real-time control loop using SPI and calibrated internal ADCs with moving-average filters to reduce signal noise.',
          'Developed low-level firmware tasks to manage peripheral hardware, using GPIO interrupts for responsive user mode-switching and status LED indications.',
          'Collaborated with hardware engineers on PCB revisions, testing physical test-points to validate power-rail stability during peak motor draw.',
        ],
      },
      {
        id: 'finfrock',
        title: 'FINFROCK',
        subtitle: 'Backend Software Engineering Intern',
        meta: 'Apopka, FL · May 2023 – Aug 2023',
        glance:
          'Built Java/Spring Boot licensing and ERP backends plus a C#/.NET diagnostic tool, refactoring a Helix Toolkit 3D engine and driving laser projection hardware.',
        tags: ['Java', 'Spring Boot', 'C#', '.NET', 'REST', 'Helix Toolkit'],
        details: [
          'Engineered a secure Java licensing verification module using Spring Boot and REST APIs across corporate servers to support a proprietary SaaS subscription model.',
          'Developed Java server-side backend code for an internal ERP solution, creating an automated onboarding pipeline that reduced system setup time by 80%.',
          'Developed a C#/.NET diagnostic tool to visualize the real-time graphics rendering pipeline for proprietary CAD software, enabling faster performance debugging.',
          'Programmed a data-parsing pipeline in C#/.NET to ingest large instruction datasets, translating raw spatial coordinates into step-by-step building sequences.',
          'Refactored a 3D graphics engine using Helix Toolkit to dynamically render structural geometries, improving visual performance for complex construction projects.',
          'Interfaced with industrial laser projection hardware, writing logic to stream coordinates that physically projected structural alignments onto job-site surfaces.',
        ],
      },
    ],
  },
  {
    id: 'projects',
    label: 'Projects',
    blurb: 'Things I have built outside of work.',
    nodes: [
      {
        id: 'volunteer-hub',
        title: 'Volunteer Hub',
        subtitle: 'Full-Stack Event Management Platform',
        meta: 'React · TypeScript · Firebase',
        glance:
          'A full-stack volunteer event platform with secure auth, role-based access control, and server-side validation built on React/TypeScript and Firebase.',
        tags: ['React', 'TypeScript', 'Firebase', 'Auth', 'RBAC'],
        details: [
          'Architected and deployed a full-stack volunteer event management platform using React/TypeScript and Firebase, streamlining event sign-ups and administrative workflows.',
          'Implemented secure authentication, server-side validation, and client-side error handling for a reliable user experience.',
          'Designed role-based access control to protect administrative routes and ensure data integrity.',
        ],
      },
      {
        id: 'pep-25',
        title: 'PEP 25 — Autonomous Boat',
        subtitle: 'Robotics Club of Central Florida · Systems Software',
        meta: 'Python · GPS/IMU Fusion · Pathfinding',
        glance:
          'A real-time navigation and diagnostics stack fusing GPS + IMU data with waypoint pathfinding for an autonomous electric boat in a national competition.',
        tags: ['Python', 'GPS', 'IMU', 'Telemetry', 'Pathfinding'],
        details: [
          'Engineered a real-time navigation and diagnostics platform in Python, fusing GPS and IMU sensor data to wirelessly transmit telemetry and compute waypoint-based pathfinding.',
          'Worked alongside the software team to deliver a complete embedded software stack for an autonomous electric boat competing in the National Promoting Electric Propulsion competition.',
        ],
      },
    ],
  },
  {
    id: 'education',
    label: 'Education',
    blurb: 'Academic foundation.',
    nodes: [
      {
        id: 'ucf',
        title: 'University of Central Florida',
        subtitle: 'B.S. Computer Engineering',
        meta: 'Orlando, FL · Expected May 2028',
        glance:
          'Computer Engineering B.S. with a 3.7 GPA, Burnett Honors Scholar and Provost Scholar.',
        tags: ['Computer Engineering', 'Honors', '3.7 GPA'],
        details: [
          'B.S. Computer Engineering, expected May 2028.',
          'GPA: 3.7.',
          'Burnett Honors Scholar.',
          'Provost Scholar.',
        ],
      },
    ],
  },
  {
    id: 'skills',
    label: 'Skills',
    blurb: 'The tools I reach for.',
    nodes: [
      {
        id: 'languages',
        title: 'Languages',
        subtitle: 'Systems to scripting',
        meta: '10 languages',
        glance:
          'Fluent across the stack — from C/C++ on embedded targets to TypeScript on the web and Python/MATLAB for data.',
        tags: ['C', 'C++', 'Python', 'TypeScript', 'Java', 'C#'],
        details: [
          'Java, Python, C++, C, TypeScript, JavaScript, C#, BASH, SQL, MATLAB.',
        ],
      },
      {
        id: 'frameworks',
        title: 'Frameworks & Libraries',
        subtitle: 'Web, backend, and real-time',
        meta: 'Full-stack + RTOS',
        glance:
          'Comfortable building with React/Next.js on the frontend, FastAPI/Spring Boot/.NET on the backend, and FreeRTOS on bare metal.',
        tags: ['React', 'Next.js', 'FastAPI', 'Spring Boot', 'LangChain', 'FreeRTOS'],
        details: [
          'React, Node.js, Next.js, .NET, Spring Boot, FastAPI, LangChain, FreeRTOS.',
        ],
      },
      {
        id: 'tools',
        title: 'Tools & Platforms',
        subtitle: 'Ship it and run it',
        meta: 'DevOps + cloud',
        glance:
          'Day-to-day with Linux, Git, Docker, CI/CD, SQL Server, and GCP Vertex AI for shipping and operating software.',
        tags: ['Linux', 'Git', 'Docker', 'CI/CD', 'GCP Vertex AI', 'SQL Server'],
        details: [
          'Linux, Git, Docker, Microsoft SQL Server, GCP Vertex AI, REST APIs, CI/CD pipelines, Jira.',
        ],
      },
    ],
  },
]
