"use client";

import { useEffect, useState } from "react";
import { ChevronDown, Disc3, Github, Linkedin } from "lucide-react";

type NowPlaying = {
	isPlaying: boolean;
	trackName: string | null;
	artistName: string | null;
	albumName: string | null;
	url: string | null;
	imageUrl: string | null;
	playedAt: string | null;
	topAlbums?: Array<{
		name: string | null;
		artistName: string | null;
		playcount: string | null;
		url: string | null;
		imageUrl: string | null;
	}>;
};

export function Hero() {
	const [visible, setVisible] = useState(false);
	const [nowPlaying, setNowPlaying] = useState<NowPlaying | null>(null);
	const [isLoadingTrack, setIsLoadingTrack] = useState(true);

	useEffect(() => {
		const t = setTimeout(() => setVisible(true), 100);
		return () => clearTimeout(t);
	}, []);

	useEffect(() => {
		let mounted = true;

		const loadNowPlaying = async () => {
			try {
				const response = await fetch("/api/lastfm/now-playing", {
					cache: "no-store",
				});
				if (!response.ok) throw new Error("Failed to load now playing");

				const data = (await response.json()) as NowPlaying;
				if (mounted) setNowPlaying(data);
			} catch {
				if (mounted) setNowPlaying(null);
			} finally {
				if (mounted) setIsLoadingTrack(false);
			}
		};

		loadNowPlaying();
		const interval = setInterval(loadNowPlaying, 30000);

		return () => {
			mounted = false;
			clearInterval(interval);
		};
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
					<div className="min-w-0 text-center lg:text-left">
						<h1 className="text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-[3.6rem] xl:text-7xl">
							Hi, I{"'"}m
							<span
								className="mt-1 block text-primary"
								style={{ textShadow: "0 0 30px hsl(0 72% 51% / 0.4)" }}
							>
								<span className="inline xl:block">Joshua </span>
								<span className="inline xl:block xl:whitespace-nowrap">
									Evenden-Wallick
								</span>
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

					<div className="glass mx-auto w-full max-w-md rounded-2xl border border-border/40 p-5 text-left lg:mx-0 lg:max-w-none">
						<p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
							Now Playing
						</p>
						<div className="mt-3 flex gap-3">
							<div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-border/40 bg-muted/30">
								{nowPlaying?.imageUrl ? (
									<img
										src={nowPlaying.imageUrl}
										alt="Album art"
										className="h-full w-full object-cover"
									/>
								) : null}
							</div>

							<div className="min-w-0">
								<p className="text-xs text-muted-foreground">
									{isLoadingTrack
										? "Loading from Last.fm..."
										: nowPlaying?.isPlaying
											? "Listening now on Spotify"
											: "Last played"}
								</p>
								<p className="truncate text-sm font-semibold text-foreground">
									{nowPlaying?.trackName ?? "No recent track"}
								</p>
								<p className="truncate text-xs text-muted-foreground">
									{nowPlaying?.artistName ?? "Unknown artist"}
								</p>
								{nowPlaying?.albumName ? (
									<p className="truncate text-xs text-muted-foreground">
										{nowPlaying.albumName}
									</p>
								) : null}
							</div>
						</div>

						{nowPlaying?.url ? (
							<a
								href={nowPlaying.url}
								target="_blank"
								rel="noopener noreferrer"
								className="mt-4 inline-flex text-xs font-medium text-primary transition-colors hover:text-primary/80"
							>
								Open on Last.fm
							</a>
						) : null}

						<div className="mt-5 hidden border-t border-border/40 pt-4 lg:block">
							<p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
								Top Albums This Week
							</p>

							{isLoadingTrack ? (
								<p className="mt-2 text-xs text-muted-foreground">
									Loading albums...
								</p>
							) : nowPlaying?.topAlbums?.length ? (
								<div className="mt-3 space-y-2">
									{nowPlaying.topAlbums.map((album, index) => (
										<a
											key={`${album.name ?? "album"}-${index}`}
											href={album.url ?? "#"}
											target="_blank"
											rel="noopener noreferrer"
											className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-muted/30"
										>
											<span className="w-4 shrink-0 text-xs text-muted-foreground">
												{index + 1}
											</span>
											<div className="flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded border border-border/40 bg-muted/30">
												{album.imageUrl ? (
													<img
														src={album.imageUrl}
														alt={`${album.name ?? "Album"} art`}
														className="h-full w-full object-cover"
													/>
												) : (
													<Disc3 size={12} className="text-muted-foreground" />
												)}
											</div>
											<div className="min-w-0">
												<p className="truncate text-xs font-medium text-foreground">
													{album.name ?? "Unknown album"}
												</p>
												<p className="truncate text-[11px] text-muted-foreground">
													{album.artistName ?? "Unknown artist"}
												</p>
											</div>
										</a>
									))}
								</div>
							) : (
								<p className="mt-2 text-xs text-muted-foreground">
									No weekly album data available.
								</p>
							)}
						</div>
					</div>
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
