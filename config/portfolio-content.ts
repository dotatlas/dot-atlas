/**
 * Portfolio content, from Joshua's resume (the November 2026 PDF).
 *
 * Every technology named in a resume entry appears on that resume; nothing is
 * added from elsewhere. Three entries are not on that resume and are kept as
 * they were: the FINFROCK role, Volunteer Hub, and Printing Profiles (whose
 * copy comes from its repo's README).
 *
 * In-progress projects carry a one-line `status` notice only; the site does
 * not show their build plans.
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
  /** In-progress builds: a one-line notice beside a status LED. `live` means people can use it now. */
  status?: { label: string; live: boolean }
  /** Where to see it. */
  links?: { label: string; href: string }[]
  /** Projects: how it fits together, four stages left to right, drawn as one small flow. */
  flow?: { name: string; detail: string }[]
}

export type PortfolioSection = {
  id: string
  label: string
  blurb: string
  nodes: Entry[]
}

export const PROFILE = {
  name: 'Joshua Evenden-Wallick',
  role: 'Embedded software engineer',
  location: 'Orlando, FL',
  /** The one sentence under the name on the first screen. */
  lede: 'Embedded software engineer: C firmware for flight computers and safety ECUs, and the services that carry real-time telemetry. Computer Engineering at UCF, class of 2028.',
}

export const SECTIONS: PortfolioSection[] = [
  {
    id: 'experience',
    label: 'Experience',
    blurb:
      'Embedded and backend work: flight-computer software for defense hardware, telemetry services in the cloud, firmware for bionic devices, and backend services.',
    nodes: [
      {
        id: 'lockheed',
        title: 'Lockheed Martin',
        subtitle: 'Embedded and Electrical Engineering Intern',
        meta: 'Orlando, FL · Apr 2025 - May 2026, Sep 2026 - Present',
        glance:
          'C software for a missile flight computer: video data transmission, and custom I2C protocols that carry hundreds of telemetry points out of FPGA hardware.',
        tags: ['C', 'I2C', 'Git', 'CI/CD'],
        details: [
          'Engineered video data transmission software for a missile flight computer codebase in C, supporting validation and debugging of hardware prototypes.',
          'Implemented custom I2C data transmission protocols to interface with FPGA outputs, processing hundreds of telemetry points from temperature to positional data.',
          'Resolved software integration bottlenecks in an Agile environment using Git and CI/CD pipelines to keep functional flight software deliveries on schedule.',
        ],
      },
      {
        id: 'home-depot',
        title: 'The Home Depot Technology',
        subtitle: 'Software Engineering Intern',
        meta: 'Atlanta, GA · May 2026 - Aug 2026',
        glance:
          'Stateless Java microservices on AWS that route real-time telemetry and state data, with a Redis cache so nothing is lost when a system hands off.',
        tags: ['Java', 'AWS ECS', 'ElastiCache (Redis)', 'TypeScript'],
        details: [
          'Engineered stateless Java microservices on AWS ECS to route real-time telemetry and state data via APIs.',
          'Built an Amazon ElastiCache (Redis) caching layer that persists operating histories across distributed nodes, preventing context loss during system handoffs.',
          'Developed asynchronous TypeScript components to manage API payloads and synchronize client-server state, ensuring reliable data delivery across nodes.',
        ],
      },
      {
        id: 'limbitless',
        title: 'Limbitless Solutions',
        subtitle: 'Embedded Software Engineering Intern',
        meta: 'Orlando, FL · Jan 2025 - Mar 2025',
        glance:
          'Firmware for bionic devices: fault-tolerant ESP32 sensor processing in C++, SPI sensor feedback in real-time control loops, and PCB revisions with the hardware team.',
        tags: ['C++', 'ESP32', 'SPI', 'KiCad'],
        details: [
          'Developed fault-tolerant ESP32 sensor-processing firmware in C++, cutting battery power use by 12%.',
          'Implemented SPI communication protocols to integrate sensor feedback into real-time hardware control loops.',
          'Worked with hardware teams on custom KiCad PCB revisions, analyzing signal integrity and reliability.',
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
    blurb: 'Built outside of work, newest first: two in development, two finished.',
    nodes: [
      {
        id: 'hil-ecu',
        title: 'Self-Driving Car Simulator',
        subtitle: 'ADAS Safety ECU & HIL Simulator · Independent project',
        meta: 'Oct 2026 - Present · C · FreeRTOS · STM32 · Python',
        status: { label: 'In development', live: false },
        links: [{ label: 'Source on GitHub', href: 'https://github.com/dotatlas/auto-safety-hil-ecu' }],
        glance:
          'A self-driving car built end to end in simulation: PyTorch models steer, hold speed, keep lane and brake; a Python driving simulator feeds them radar, IMU and wheel-speed data over a CAN bus; and a safety computer on an STM32 running FreeRTOS checks every command before it reaches the car.',
        flow: [
          { name: 'Driving models', detail: 'PyTorch' },
          { name: 'Simulator', detail: 'Python' },
          { name: 'CAN bus', detail: 'Radar, IMU, wheel speed' },
          { name: 'Safety ECU', detail: 'C on STM32, FreeRTOS' },
        ],
        tags: ['C', 'FreeRTOS', 'STM32', 'CAN Bus', 'Python', 'PyTorch'],
        details: [
          'Developed safety ECU firmware in C with FreeRTOS on an STM32 Nucleo-G474RE board that monitors incoming sensor data and triggers emergency braking in under 12 ms.',
          'Built a Python driving simulator that transmits radar, IMU, and wheel-speed data to the ECU over a CAN bus, injecting sensor faults to verify the ECU detects bad data and fails safe.',
          'Trained machine learning driving models in PyTorch for braking, cruise control, and lane keeping, with the ECU checking every command against safety limits before it reaches the vehicle.',
          'Validated the ECU with software-in-the-loop (SIL) tests in GitHub Actions CI and hardware-in-the-loop (HIL) tests on the physical board, replaying the same driving scenarios.',
        ],
      },
      {
        id: 'printing-profiles',
        title: 'Printing Profiles',
        subtitle: 'Independent project · Solo full-stack build',
        meta: 'Oct 2026 - Present · Golang · Next.js · PostgreSQL',
        status: { label: 'In development', live: false },
        links: [
          { label: 'Test build', href: 'https://printingprofiles.com' },
          { label: 'Source on GitHub', href: 'https://github.com/dotatlas/printing-profiles' },
        ],
        glance:
          'A community site for 3D printing slicer presets: the exact settings that make one filament print well on one printer, backed by photos of real prints. Open source, and built solo from the Go API to the Next.js front end.',
        flow: [
          { name: 'Preset files', detail: 'Slicer exports' },
          { name: 'Go API', detail: 'Standard library' },
          { name: 'PostgreSQL', detail: 'pgx and sqlc' },
          { name: 'Website', detail: 'Next.js' },
        ],
        tags: ['Golang', 'Next.js', 'TypeScript', 'PostgreSQL', 'Docker', 'GitHub Actions'],
        details: [
          'Built the Go API on the standard library: PostgreSQL through pgx and sqlc-generated type-safe queries, goose migrations, RFC 9457 problem-detail errors, structured request logs and graceful shutdown.',
          'Reads uploaded PrusaSlicer, SuperSlicer, OrcaSlicer and Bambu Studio preset files, shows their key settings as a clean table with no typing, and strips the network passwords and API keys that printer presets can carry.',
          'Passwordless accounts: GitHub and Discord sign-in over OAuth with PKCE, or a single-use email link, with hashed sessions and rate limits kept in Postgres. The site never stores a password.',
          'Made trust visible: a preset with a photo of a real print is marked Photo verified, and every photo is checked by its bytes and re-encoded without metadata, so a phone picture never leaks where it was taken.',
          'Search that forgives typos: full-text search with a fuzzy fallback, real printers and filaments ranked above words in a title, and sorting by Bayesian rating, downloads and trend.',
          'Reviews, comments, bookmarks and public profiles on server-rendered Next.js pages, with API types generated from the OpenAPI contract and a GitHub Actions pipeline of Go race tests, govulncheck, lint and type checks.',
        ],
      },
      {
        id: 'volunteer-hub',
        title: 'Volunteer Hub',
        subtitle: 'Independent project · Lead Developer',
        meta: 'React · TypeScript · GraphQL · Firebase',
        glance:
          'A full-stack platform for running volunteer programs, architected and deployed solo: it streamlines the administrative workflows and data intake behind them.',
        flow: [
          { name: 'Client', detail: 'React, TypeScript' },
          { name: 'API', detail: 'GraphQL' },
          { name: 'Accounts', detail: 'Firebase Auth' },
          { name: 'Data', detail: 'Validated intake' },
        ],
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
        meta: 'Aug 2024 - Apr 2025 · Python · Embedded Linux · Raspberry Pi',
        glance:
          'A real-time diagnostics platform for an autonomous vehicle: Python on a Raspberry Pi streams GPS and IMU data to a remote dashboard, and a navigation algorithm fuses the sensors to find its own way between waypoints.',
        flow: [
          { name: 'Sensors', detail: 'GPS and IMU' },
          { name: 'Fusion', detail: 'Python on a Raspberry Pi' },
          { name: 'Navigation', detail: 'Waypoint pathfinding' },
          { name: 'Dashboard', detail: 'Live telemetry' },
        ],
        tags: ['Python', 'Embedded Linux', 'Raspberry Pi', 'GPS', 'IMU', 'Sensor Fusion'],
        details: [
          'Engineered a real-time diagnostics platform on an embedded Linux (Raspberry Pi) system in Python, streaming GPS and IMU data to a remote dashboard.',
          'Developed a navigation algorithm fusing multiple sensor inputs to achieve autonomous waypoint pathfinding.',
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
 * Skills, grouped as on the resume, each with the roles and projects where it
 * was used. `usedIn` stays empty when the resume lists a skill without tying
 * it to a role; never fill it in by guessing.
 */
export type SkillGroup = { name: string; items: { name: string; usedIn: string }[] }

export const SKILLS: SkillGroup[] = [
  {
    name: 'Languages',
    items: [
      { name: 'C', usedIn: 'Lockheed Martin, Self-Driving Car Simulator' },
      { name: 'C++', usedIn: 'Limbitless Solutions' },
      { name: 'Python', usedIn: 'Self-Driving Car Simulator, PEP 25' },
      { name: 'Java', usedIn: 'The Home Depot' },
      { name: 'TypeScript', usedIn: 'The Home Depot, Volunteer Hub, Printing Profiles' },
      { name: 'SQL', usedIn: 'Printing Profiles' },
      { name: 'JavaScript', usedIn: '' },
      { name: 'Bash', usedIn: '' },
      { name: 'C#', usedIn: '' },
    ],
  },
  {
    name: 'Embedded',
    items: [
      { name: 'FreeRTOS (RTOS)', usedIn: 'Self-Driving Car Simulator' },
      { name: 'STM32 (ARM Cortex-M)', usedIn: 'Self-Driving Car Simulator' },
      { name: 'ESP32', usedIn: 'Limbitless Solutions' },
      { name: 'CAN Bus', usedIn: 'Self-Driving Car Simulator' },
      { name: 'SPI', usedIn: 'Limbitless Solutions' },
      { name: 'I2C', usedIn: 'Lockheed Martin' },
      { name: 'KiCad', usedIn: 'Limbitless Solutions' },
      { name: 'HIL/SIL', usedIn: 'Self-Driving Car Simulator' },
    ],
  },
  {
    name: 'Tools and platforms',
    items: [
      { name: 'Linux', usedIn: 'PEP 25' },
      { name: 'Git', usedIn: 'Lockheed Martin' },
      { name: 'GitHub Actions (CI/CD)', usedIn: 'Self-Driving Car Simulator, Printing Profiles' },
      { name: 'Docker', usedIn: 'Printing Profiles' },
      { name: 'AWS', usedIn: 'The Home Depot' },
      { name: 'PyTorch', usedIn: 'Self-Driving Car Simulator' },
      { name: 'pytest', usedIn: '' },
    ],
  },
]
