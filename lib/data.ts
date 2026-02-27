import type { GalleryItem } from "@/components/gallery-card";

export const experienceItems: GalleryItem[] = [
	// {
	//   id: "exp-0",
	//   title: "Software Engineering Intern",
	//   subtitle: "Home Depot",
	//   period: "Summer 2026",
	//   tags: ["TBD"],
	//   description:
	//     "Upcoming.",
	//   details: [
	//     "",
	//   ],
	//   logo: true
	// },
	{
		id: "exp-1",
		title: "Software Engineering Intern",
		subtitle: "Lockheed Martin",
		period: "Apr 2025 - Present",
		tags: ["Python", "C", "Systems Integration", "Telemetry"],
		description:
			"Architecting Python pipelines and engineering C flight software for missile systems in an Agile environment.",
		details: [
			"Architected Python pipelines to process and visualize real-time telemetry from environmental sensors for performance verification.",
			"Engineered C data transmission software into a missile flight computer codebase to align prototypes with validation and debugging requirements.",
			"Resolved software integration bottlenecks in an Agile environment to maintain delivery schedules for functional flight software.",
		],
		logo: true,
	},
	{
		id: "exp-2",
		title: "Software Engineering Intern",
		subtitle: "Limbitless Solutions",
		period: "Jan 2025 - Mar 2025",
		tags: ["Java", "C++", "REST API", "ESP32"],
		description:
			"Built scalable Java microservices and fault-tolerant C++ firmware for assistive technology devices.",
		details: [
			"Engineered a scalable, microservice-based Java backend to manage data for 50+ users, designing and building RESTful API endpoints for a full-stack web application.",
			"Developed fault-tolerant C++ firmware for ESP32 microcontrollers, implementing object-oriented design principles for motor control and sensor processing, reducing battery power consumption by 12%.",
		],
		logo: true,
	},
	{
		id: "exp-3",
		title: "Software Engineering Intern",
		subtitle: "FINFROCK",
		period: "May 2023 - Aug 2023",
		tags: ["Java", "C#", ".NET", "3D Graphics"],
		description:
			"Contributed to enterprise ERP solutions and optimized proprietary 3D CAD software for a construction tech company.",
		details: [
			"Contributed to engineering the Java backend for a scalable, internally hosted ERP solution to manage payroll and timekeeping for 1,000+ employees, designing microservices to ensure high availability.",
			"Engineered a secure .NET licensing module to transition the proprietary 3D CAD software to a monthly subscription model, deploying it on internal servers to manage 20+ client licenses.",
			"Optimized the C#/.NET 3D graphical engine for the company's proprietary CAD software, developing a diagnostic tool to reduce rendering latency by 40% for large-scale models.",
		],
		link: "https://finfrocktech.com/xceleraytor/",
		linkDesc: "Visit what I contributed to!",
		logo: true,
	},
	{
		id: "exp-4",
		title: "Tool Rental Technician",
		subtitle: "Home Depot",
		period: "Feb 2024 - Present",
		tags: ["Critical Thinking", "Problem Solving", "Communication"],
		description:
			"Provided hands-on support in tool rental operations, focusing on repair and diagnostics to ensure customer satisfaction and equipment reliability.",
		details: [
			"Diagnosed and repaired a variety of rental tools and equipment, ensuring they met safety and operational standards, which enhanced customer trust and satisfaction.",
			"Collaborated with customers to understand their tool needs, providing expert advice and recommendations, which improved customer experience and retention.",
			"Maintained accurate records of tool repairs and rentals, contributing to inventory management and operational efficiency, which streamlined the rental process.",
			"Trained new staff on tool operation and safety protocols, fostering a culture of safety and knowledge sharing within the team.",
		],
		logo: true,
	},
];

export const projectItems: GalleryItem[] = [
	{
		id: "proj-1",
		title: "Volunteer Hub",
		subtitle: "Full-stack event management platform",
		period: "Self-led Project",
		tags: ["TypeScript", "Next.js", "React", "Firebase"],
		description:
			"A full-stack event platform for 150+ concurrent users with automated registration and role-based access control.",
		details: [
			"Engineered a full-stack event platform for 150+ concurrent users using TypeScript and React, automating registration with a serverless NoSQL database (Firebase) backend.",
			"Implemented a secure authentication system with robust server-side validation and client-side error handling, resulting in a 99% reduction in user data entry errors and enhancing system resilience.",
			"Designed and implemented a role-based access control system with distinct permission levels, protecting administrative routes and ensuring data integrity across the platform.",
		],
		link: "https://github.com/dotatlas/Volunteer-Hub",
	},
	{
		id: "proj-2",
		title: "PEP 25 - Robotics Club",
		subtitle: "Autonomous robot diagnostics & navigation",
		period: "Software Team",
		tags: ["Linux", "Python", "Embedded"], //, "IoT"],
		description:
			"Real-time diagnostics platform and autonomous navigation system for the Robotics Club of Central Florida.",
		details: [
			"Engineered a real-time diagnostics and monitoring platform in Python on an embedded Linux (Raspberry Pi) system, transmitting 25+ telemetry data points per second to a remote dashboard.",
			"Developed and implemented a complex navigation algorithm by applying object-oriented design principles, fusing multiple sensor inputs to achieve autonomous waypoint pathfinding with near perfect route accuracy.",
		],
		link: "https://github.com/RoboticsClubatUCF/RCCF-PEP",
	},
	{
		id: "proj-3",
		title: "FIRST Robotics President",
		subtitle: "AI-powered robotics & team leadership",
		period: "3-Year President & Software Mentor",
		tags: ["Java", "TensorFlow Lite", "AI/ML", "Agile"],
		description:
			"Led a 20-member software team delivering AI-driven competition robots, from TensorFlow Lite object detection to a modular Java developer platform.",
		details: [
			"Shipped an AI-powered capability to production by owning the end-to-end deployment of a TensorFlow Lite model for real-time object detection on competition hardware.",
			"Architected a modular Java framework that served as a reusable developer platform for 20 engineers, standardizing integrations and significantly reducing new-feature development cycles.",
			"Directed a 20-member software team through fast-paced, Agile sprint cycles, driving projects from initial concept through successful competition deployment.",
		],
		link: "https://github.com/Lyman-Robotics/FTC-4228-Powerplay",
	},
	{
		id: "proj-4",
		title: "Electrathon America",
		subtitle: "Co-Founder, Software & Electrical Lead",
		period: "Co-Founded",
		tags: ["Python", "IoT", "Sensors", "Telemetry"],
		description:
			"Co-founded a competitive electric vehicle team, engineering a full telemetry stack for real-time sensor fusion and vehicle performance analysis.",
		details: [
			"Engineered a high-throughput data processing pipeline to fuse and analyze real-time telemetry from IMU, GPS, and thermal sensors, enabling data-driven performance tuning during races.",
			"Designed and built a complete hardware/software telemetry system from the ground up, demonstrating full-stack problem-solving from sensor wiring through to a live data dashboard.",
		],
		link: "https://www.youtube.com/watch?v=u1XpGMRhw4w",
	},
];
