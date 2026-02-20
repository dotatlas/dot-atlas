"use client";

import { useEffect, useState } from "react";
import { Disc3 } from "lucide-react";

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

export function Music() {
	const [nowPlaying, setNowPlaying] = useState<NowPlaying | null>(null);
	const [isLoadingTrack, setIsLoadingTrack] = useState(true);

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
	);
}
