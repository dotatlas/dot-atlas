/**
 * Portfolio content, from Joshua's resume (the October 2026 PDF).
 *
 * Every technology named here appears on that resume; nothing is added
 * from elsewhere. Where a resume bullet was general, the copy says what was
 * actually built, but the stack stays exactly the resume's.
 *
 * `glance` is the one statement a recruiter reads first; `details` are the
 * full points underneath it.
 */

export type Entry = {
  id: string
  title: string
  subtitle: string
  meta: string
  /** One-glance statement for recruiters. */
  glance: string
  /** Stack, exactly as the resume lists it for this entry. */
  tags: string[]
  /** Full points, readable inline. */
  details: string[]
}

export type PortfolioSection = {
  id: string
  label: string
  blurb: string
  nodes: Entry[]
}

export const PROFILE = {
  name: 'Joshua Evenden-Wallick',
  role: 'Full-stack and embedded software engineer',
  location: 'Orlando, FL',
  email: 'jewallick@pm.me',
  phone: '(407) 452-8929',
  github: 'https://github.com/dotatlas',
  linkedin: 'https://linkedin.com/in/jevendenwallick',
  portfolio: 'https://dotatlas.dev',
  /** The one sentence under the name on the first screen. */
  lede: 'Full-stack and embedded software engineer: React, TypeScript and GraphQL products, C firmware and real-time telemetry. Computer Engineering at UCF, class of 2028.',
}

/** Measured results, set as figures inside their roles. */
export const FIGURES: Record<string, { value: string; label: string }> = {
  lockheed: { value: '90%', label: 'less data handoff time across millions of rows of hardware test data' },
  limbitless: { value: '12%', label: 'lower battery draw from fault-tolerant ESP32 firmware' },
}

export const SECTIONS: PortfolioSection[] = [
  {
    id: 'experience',
    label: 'Experience',
    blurb:
      'Full-stack and embedded work: AI features in enterprise web apps, telemetry platforms and firmware for defense hardware, monitoring for bionic devices, and backend services.',
    nodes: [
      {
        id: 'home-depot',
        title: 'The Home Depot Technology',
        subtitle: 'Full-Stack Software Engineering Intern',
        meta: 'Atlanta, GA · May 2026 - Aug 2026',
        glance:
          'Brought conversational and agentic AI into enterprise web apps with React, TypeScript and GraphQL, including the handoff from an AI assistant to a live agent that keeps the whole conversation intact.',
        tags: ['TypeScript', 'React', 'GraphQL'],
        details: [
          'Built scalable full-stack features with React, TypeScript and GraphQL that embed conversational and agentic AI into high-impact enterprise web applications.',
          'Built the frontend side of AI-to-agent escalations: when an assistant hands a customer to a live agent, the conversation and its context carry over instead of starting again.',
          'Integrated real-time data connections in a React frontend so AI models receive a continuous stream of data, iterating quickly on what users actually needed.',
          'Kept message delivery dependable across browser tabs by synchronizing client and server state around asynchronous API payloads.',
          'Surfaced contextual insights across internal and consumer-facing tools to streamline day-to-day operations.',
        ],
      },
      {
        id: 'lockheed',
        title: 'Lockheed Martin',
        subtitle: 'Full-Stack Software Engineering Intern',
        meta: 'Orlando, FL · Apr 2025 - May 2026, Sep 2026 - Present',
        glance:
          'Work on both sides of the hardware line: a React and TypeScript platform that indexes millions of rows of hardware telemetry, and the C firmware and serial drivers that produce it.',
        tags: ['React', 'TypeScript', 'C', 'SQL', 'Git', 'CI/CD'],
        details: [
          'Built a full-stack data ingestion and storage application in React and TypeScript that securely manages and indexes millions of rows of hardware telemetry and test data.',
          'Added server-side pagination and filtered SQL queries so engineers can pull exactly the records they need from very large datasets, quickly.',
          'Authored low-level C firmware for a real-time multimedia processing pipeline that handles high-frame-rate camera sensors in demanding environments.',
          'Engineered custom embedded software and serial drivers that stream raw sensor telemetry and hardware metrics from devices to a centralized platform.',
          'Cleared integration bottlenecks in an Agile flight-software team with Git and CI/CD pipelines, keeping deliveries on schedule.',
        ],
      },
      {
        id: 'limbitless',
        title: 'Limbitless Solutions',
        subtitle: 'Software Engineering Intern',
        meta: 'Orlando, FL · Jan 2025 - Mar 2025',
        glance:
          'Connected bionic hardware to the web, end to end: firmware on the device, IoT telemetry to Golang services, and React tools for monitoring devices remotely.',
        tags: ['Golang', 'TypeScript', 'React', 'C++', 'REST APIs', 'IoT'],
        details: [
          'Developed reliable IoT data transmission routines between embedded hardware and remote backend infrastructure, and scaled telemetry ingestion as testing grew.',
          'Built Golang backend services and REST APIs that connect the embedded hardware to external web applications.',
          'Built TypeScript and React features for remote hardware monitoring: device status, test workflows and actionable insights in one place.',
          'Wrote fault-tolerant C++ firmware for ESP32 microcontrollers covering sensor processing and motor control, cutting battery consumption by 12%.',
        ],
      },
      {
        id: 'finfrock',
        title: 'FINFROCK',
        subtitle: 'Backend Software Engineering Intern',
        meta: 'Apopka, FL · May 2023 - Aug 2023',
        glance:
          'Golang backend work for a proprietary enterprise platform: the authorization module behind its move to subscription licensing, and a pipeline that turns raw spatial data into workflows.',
        tags: ['Golang', 'Backend', 'Data pipelines'],
        details: [
          'Engineered a secure backend authorization module in Golang that let proprietary 3D CAD software move to a subscription model, managing 20+ internal client licenses.',
          'Designed the module to scale authorization as more of the company came onto the platform, which serves over 1,000 employees.',
          'Programmed a scalable data-parsing pipeline that ingests large physical operational datasets and translates raw spatial coordinates into workflows people can act on.',
        ],
      },
    ],
  },
  {
    id: 'projects',
    label: 'Projects',
    blurb: 'Built outside of work: one solo, one with a team.',
    nodes: [
      {
        id: 'volunteer-hub',
        title: 'Volunteer Hub',
        subtitle: 'Independent project · Lead Developer',
        meta: 'React · TypeScript · GraphQL · Firebase',
        glance:
          'A full-stack platform for running volunteer programs, architected and deployed solo: it streamlines the administrative workflows and data intake behind them.',
        tags: ['React', 'TypeScript', 'GraphQL', 'Firebase'],
        details: [
          'Architected and deployed the full stack: a React and TypeScript client over a GraphQL API.',
          'Streamlined administrative workflows and data ingestion, so organizers spend less time on paperwork.',
          'Implemented secure authentication and robust client-side validation, so the experience stays reliable at scale.',
          'Used Firebase for secure user accounts and for credential validation between databases.',
        ],
      },
      {
        id: 'pep-25',
        title: 'PEP 25',
        subtitle: 'Robotics Club of Central Florida · Systems Software Team',
        meta: 'Aug 2024 - Apr 2025 · Python · Embedded Linux',
        glance:
          'The navigation brain of an autonomous electric vehicle: Python on embedded Linux that fuses sensor data, streams telemetry wirelessly, and plans its own route from waypoint to waypoint.',
        tags: ['Python', 'Embedded Linux', 'Sensor fusion', 'Telemetry', 'Pathfinding'],
        details: [
          'Collaborated with the Systems Software team to deliver a complete embedded Linux software stack for an autonomous electric vehicle platform.',
          'Engineered a real-time navigation and diagnostics system in Python that fuses GPS and IMU readings into one live estimate of where the vehicle is and which way it is heading.',
          'Transmitted that telemetry wirelessly to the team, so every test run could be watched and diagnosed as it happened rather than after the fact.',
          'Computed waypoint-based pathfinding, so the vehicle plans its own course and steers itself from point to point.',
          'Built for the realities of a moving vehicle: sensor data that never stops arriving, a wireless link that has to keep up, and navigation decisions made in real time.',
        ],
      },
    ],
  },
  {
    id: 'education',
    label: 'Education',
    blurb: 'The foundation behind the systems work.',
    nodes: [
      {
        id: 'ucf',
        title: 'University of Central Florida',
        subtitle: 'Computer Engineering',
        meta: 'Orlando, FL · Aug 2024 - May 2028',
        glance: 'Computer Engineering, class of 2028.',
        tags: [],
        details: ['3.7 GPA', 'Burnett Honors Scholar', 'Provost Scholar'],
      },
    ],
  },
]

/**
 * Skills as a bill of materials: each part and the role where it was used.
 * `usedIn` stays empty when the resume lists a skill without tying it to a
 * role; never fill it in by guessing.
 */
export type BomGroup = { name: string; items: { part: string; usedIn: string }[] }

export const BOM: BomGroup[] = [
  {
    name: 'Languages',
    items: [
      { part: 'TypeScript', usedIn: 'The Home Depot, Lockheed Martin, Limbitless Solutions, Volunteer Hub' },
      { part: 'Golang', usedIn: 'Limbitless Solutions, FINFROCK' },
      { part: 'C', usedIn: 'Lockheed Martin firmware' },
      { part: 'C++', usedIn: 'Limbitless Solutions firmware' },
      { part: 'GraphQL', usedIn: 'The Home Depot, Volunteer Hub' },
      { part: 'SQL', usedIn: 'Lockheed Martin' },
      { part: 'JavaScript', usedIn: '' },
      { part: 'Python', usedIn: 'PEP 25 navigation' },
    ],
  },
  {
    name: 'Frameworks and libraries',
    items: [
      { part: 'React', usedIn: 'The Home Depot, Lockheed Martin, Limbitless Solutions, Volunteer Hub' },
      { part: 'React Native', usedIn: '' },
      { part: 'Node.js', usedIn: '' },
      { part: 'LangChain', usedIn: '' },
      { part: 'FreeRTOS', usedIn: '' },
    ],
  },
  {
    name: 'Tools and platforms',
    items: [
      { part: 'Git, CI/CD pipelines', usedIn: 'Lockheed Martin' },
      { part: 'REST APIs, IoT platforms', usedIn: 'Limbitless Solutions' },
      { part: 'Firebase', usedIn: 'Volunteer Hub' },
      { part: 'Embedded Linux', usedIn: 'PEP 25' },
      { part: 'Docker', usedIn: '' },
      { part: 'GCP Vertex AI', usedIn: '' },
    ],
  },
]
