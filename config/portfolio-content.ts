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
    'I build software that connects reliable systems to real hardware — from embedded C/C++ and sensor data to cloud services and full-stack tools.',
}

export const SECTIONS: PortfolioSection[] = [
  {
    id: 'experience',
    label: 'Experience',
    blurb: 'Production software across flight systems, cloud services, embedded hardware, and internal tools.',
    nodes: [
      {
        id: 'home-depot',
        title: 'The Home Depot Technology',
        subtitle: 'Software Engineering Intern',
        meta: 'Atlanta, GA · May 2026 - Aug 2026',
        glance:
          'Designed the services and frontend state management behind dependable AI-to-client handoffs, keeping conversation context intact across distributed systems.',
        tags: ['Java', 'AWS ECS', 'Redis', 'TypeScript', 'Sprinklr APIs'],
        details: [
          'Built stateless Java microservices on AWS ECS to route live conversation events between AI assistants and client agents through Sprinklr APIs.',
          'Designed the service boundaries around escalation workflows so handoffs could scale horizontally without tying a conversation to one running instance.',
          'Added an Amazon ElastiCache for Redis layer to share chat history across distributed nodes and prevent context from disappearing during transfers.',
          'Developed asynchronous TypeScript components that coordinate API payloads and client state across browser tabs.',
          'Hardened cross-tab message delivery around delayed responses and changing network state, making the assistant experience more predictable for users.',
        ],
      },
      {
        id: 'lockheed',
        title: 'Lockheed Martin',
        subtitle: 'Full-Stack / Embedded Software Engineering Intern',
        meta: 'Orlando, FL · Apr 2025 - May 2026; Sep 2026 - Present',
        glance:
          'Work across flight software and developer tooling: transmitting video data in C while building a web platform that made millions of PCB test records easier to move and find.',
        tags: ['C', 'JavaScript', 'Next.js', 'SQL', 'Git', 'CI/CD'],
        details: [
          'Integrated C-based video data transmission into a missile flight computer codebase, giving hardware prototypes the software path needed for validation and debugging.',
          'Built a Next.js and JavaScript workflow application backed by SQL to securely organize and search millions of PCB test records.',
          'Designed the workflow around repeatable ingestion and retrieval, reducing data handoff time by 90% and making test information available where engineers needed it.',
          'Worked through integration bottlenecks in an Agile flight-software environment, using Git and CI/CD pipelines to keep functional builds moving toward delivery.',
          'Translated requirements between software, hardware, and validation stakeholders so new tooling supported both day-to-day engineering work and formal test needs.',
        ],
      },
      {
        id: 'limbitless',
        title: 'Limbitless Solutions',
        subtitle: 'Software Engineering Intern',
        meta: 'Orlando, FL · Jan 2025 - Mar 2025',
        glance:
          'Connected ESP32 firmware, sensor feedback, and backend services into a testable control and telemetry loop for next-generation bionic devices.',
        tags: ['C++', 'ESP32', 'SPI', 'Java', 'REST APIs', 'Embedded Systems'],
        details: [
          'Developed fault-tolerant C++ firmware for ESP32 sensor processing, reducing battery consumption by 12% while preserving responsive device behavior.',
          'Built the firmware around recoverable sensor and peripheral failures so the device could continue operating predictably in imperfect hardware conditions.',
          'Implemented SPI communication to bring sensor feedback into real-time hardware control loops.',
          'Created Java microservices and REST endpoints that exposed embedded telemetry to web applications and supported regression analysis of test data.',
          'Helped shape a scalable path from device-level measurements to backend analysis, making hardware behavior easier to inspect over repeated tests.',
        ],
      },
      {
        id: 'finfrock',
        title: 'FINFROCK',
        subtitle: 'Software Engineering Intern',
        meta: 'Apopka, FL · May 2023 - Aug 2023',
        glance:
          'Built backend services for an ERP used by 1,000+ employees and a secure .NET licensing system supporting a subscription transition for proprietary CAD software.',
        tags: ['Java', '.NET', 'Backend', 'ERP', 'REST APIs', 'Licensing'],
        details: [
          'Engineered Java backend microservices for an ERP platform that supports timekeeping workflows for more than 1,000 employees.',
          'Designed service behavior for high availability so everyday workforce data remained dependable as usage grew.',
          'Built a secure .NET licensing module that helped move proprietary 3D CAD software toward a subscription model across 20+ internal client licenses.',
          'Worked close to the product and infrastructure layers, turning business rules around access and licensing into software that could be maintained and audited.',
        ],
      },
    ],
  },
  {
    id: 'projects',
    label: 'Projects',
    blurb: 'Side projects where embedded systems, data, and autonomy meet.',
    nodes: [
      {
        id: 'pep-25',
        title: 'PEP 25 - Autonomous Boat',
        subtitle: 'Robotics Club of Central Florida · Software Team',
        meta: 'Aug 2024 - Apr 2025 · Python · Raspberry Pi',
        glance:
          'A Raspberry Pi-based navigation and diagnostics system that turned live GPS and IMU readings into remote telemetry and autonomous waypoint decisions.',
        tags: ['Python', 'Embedded Linux', 'GPS', 'IMU', 'Telemetry', 'Pathfinding'],
        details: [
          'Built a real-time monitoring platform in Python on embedded Linux, sending GPS and IMU readings to a remote dashboard for visibility during testing.',
          'Designed the software around the practical realities of a moving vehicle: sensor readings arrive continuously, telemetry must travel remotely, and navigation decisions must keep pace.',
          'Implemented an object-oriented navigation algorithm that combines multiple sensor inputs to plan and follow autonomous waypoints.',
          'Collaborated with the robotics software team to deliver the embedded stack for an autonomous electric boat competing in the National Promoting Electric Propulsion competition.',
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
        subtitle: 'B.S. Computer Engineering',
        meta: 'Orlando, FL · Aug 2024 - May 2028',
        glance:
          'Computer Engineering student building a foundation in hardware, software, and the systems that connect them.',
        tags: ['Computer Engineering', 'Honors', '3.7 GPA'],
        details: [
          'Pursuing a B.S. in Computer Engineering at the University of Central Florida, graduating May 2028.',
          'Maintaining a 3.7 GPA while balancing coursework with production engineering internships and robotics work.',
          'Burnett Honors Scholar.',
          'Provost Scholar.',
        ],
      },
    ],
  },
  {
    id: 'skills',
    label: 'Skills',
    blurb: 'A practical toolkit spanning low-level systems, web applications, and the infrastructure between them.',
    nodes: [
      {
        id: 'languages',
        title: 'Languages',
        subtitle: 'Systems to scripting',
        meta: 'Systems to scripting',
        glance:
          'I move comfortably between memory-conscious embedded code, backend services, browser state, and the SQL that keeps data useful.',
        tags: ['C++', 'C', 'Python', 'Java', 'TypeScript', 'SQL'],
        details: [
          'C++, C, Python, Java, TypeScript, C#, SQL, BASH, and JavaScript.',
        ],
      },
      {
        id: 'frameworks',
        title: 'Frameworks & Libraries',
        subtitle: 'Web, backend, and real-time',
        meta: 'Web and backend',
        glance:
          'I use frameworks to give both user-facing products and embedded-adjacent services clear structure, testable boundaries, and room to grow.',
        tags: ['React', 'Node.js', 'Next.js', '.NET', 'REST APIs'],
        details: [
          'React, Node.js, Next.js, and .NET, with REST APIs for connecting services to the systems around them.',
        ],
      },
      {
        id: 'tools',
        title: 'Tools & Platforms',
        subtitle: 'Ship it and run it',
        meta: 'Build, deploy, debug',
        glance:
          'The working layer around the code: Linux environments, AWS services, containers, source control, and delivery pipelines.',
        tags: ['Linux', 'AWS', 'Docker', 'Git', 'CI/CD', 'Embedded Systems'],
        details: [
          'Linux, AWS, Docker, Git, REST APIs, CI/CD pipelines, and embedded systems.',
        ],
      },
    ],
  },
]
