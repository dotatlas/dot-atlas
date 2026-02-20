"use client";

import { useEffect, useState } from "react";
import { ChevronDown, Github, Linkedin } from "lucide-react";

import { Music } from "@/components/music";

export function Hero() {
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		const t = setTimeout(() => setVisible(true), 100);
		return () => clearTimeout(t);
	}, []);

	return (
		<section
			id="about"
			className="relative flex min-h-screen items-center justify-center px-4 sm:px-6"
		>
			<div
				className={`mx-auto w-full max-w-5xl md:px-4 lg:px-6 transition-all duration-1000 ${
					visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
				}`}
			>
				<div className="grid items-start gap-6 md:gap-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(340px,360px)] lg:gap-12">
					<div className="min-w-0 text-center lg:text-left flex h-full flex-col justify-center">
						<h1 className="text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-[3.6rem] xl:text-7xl">
							Hi, I{"'"}m{" "}
							<span
								className="inline text-primary whitespace-nowrap"
								style={{ textShadow: "0 0 30px hsl(0 72% 51% / 0.4)" }}
							>
								Josh
							</span>
						</h1>

						<p className="mx-auto mt-6 max-w-xl text-pretty text-sm leading-relaxed text-muted-foreground lg:mx-0 lg:text-lg">
							Find me building web applications, embedded systems, and
							enterprise software. Pursuing a B.S. in Computer Engineering w/ a
							focus on Software Development at the University of Central
							Florida. I also wakeboard in my freetime as well as 3D printing &
							collecting vinyls :)
						</p>
					</div>

					<Music />
				</div>

				<div className="mt-8 flex flex-wrap items-center justify-center gap-4">
					<a
						href="#contact"
						className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-all duration-300 hover:scale-105 red-glow"
					>
						Get in Touch
					</a>
					<a
						href="#projects"
						className="inline-flex items-center gap-2 rounded-xl glass px-6 py-3 text-sm font-medium text-foreground transition-all duration-300 glass-hover"
					>
						View Work
					</a>
				</div>

				<div className="mt-8 flex flex-wrap items-center justify-center gap-5">
					<a
						href="https://github.com/dotatlas"
						target="_blank"
						rel="noopener noreferrer"
						aria-label="GitHub"
						className="text-muted-foreground transition-colors duration-300 hover:text-primary"
					>
						<Github size={20} />
					</a>
					<a
						href="https://linkedin.com/in/jevendenwallick"
						target="_blank"
						rel="noopener noreferrer"
						aria-label="LinkedIn"
						className="text-muted-foreground transition-colors duration-300 hover:text-primary"
					>
						<Linkedin size={20} />
					</a>
					<a
						href="#contact"
						className="rounded-lg glass px-3 py-1.5 text-xs text-muted-foreground transition-all duration-300 glass-hover hover:text-primary"
					>
						more below
					</a>
				</div>
			</div>

			{/* Scroll indicator */}
			<a
				href="#experience"
				aria-label="Scroll down"
				className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-muted-foreground transition-colors hover:text-primary"
			>
				<ChevronDown size={24} />
			</a>
		</section>
	);
}
