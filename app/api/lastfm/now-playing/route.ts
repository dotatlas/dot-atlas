import { NextResponse } from "next/server";

type LastFmRecentTrack = {
	name?: string;
	url?: string;
	artist?: { "#text"?: string };
	album?: { "#text"?: string };
	image?: Array<{ "#text"?: string; size?: string }>;
	date?: { uts?: string; "#text"?: string };
	"@attr"?: { nowplaying?: string };
};

type LastFmRecentTracksResponse = {
	recenttracks?: {
		track?: LastFmRecentTrack[];
	};
};

type LastFmTopAlbum = {
	name?: string;
	url?: string;
	playcount?: string;
	artist?: { name?: string };
	image?: Array<{ "#text"?: string; size?: string }>;
};

type LastFmTopAlbumsResponse = {
	topalbums?: {
		album?: LastFmTopAlbum[];
	};
};

function getBestImage(images: Array<{ "#text"?: string; size?: string }> = []) {
	const order = ["extralarge", "large", "medium", "small"];
	for (const size of order) {
		const match = images.find((image) => image.size === size && image["#text"]);
		if (match?.["#text"]) return match["#text"];
	}
	return "";
}

export async function GET() {
	const apiKey = process.env.LASTFM_API_KEY;
	const username = process.env.LASTFM_USERNAME;

	if (!apiKey || !username) {
		return NextResponse.json(
			{ error: "Server missing LASTFM_API_KEY or LASTFM_USERNAME" },
			{ status: 500 },
		);
	}

	const recentTracksParams = new URLSearchParams({
		method: "user.getrecenttracks",
		user: username,
		api_key: apiKey,
		format: "json",
		limit: "1",
	});

	const topAlbumsParams = new URLSearchParams({
		method: "user.gettopalbums",
		user: username,
		api_key: apiKey,
		format: "json",
		period: "7day",
		limit: "3",
	});

	try {
		const [recentTracksResponse, topAlbumsResponse] = await Promise.all([
			fetch(
				`https://ws.audioscrobbler.com/2.0/?${recentTracksParams.toString()}`,
				{
					cache: "no-store",
				},
			),
			fetch(
				`https://ws.audioscrobbler.com/2.0/?${topAlbumsParams.toString()}`,
				{
					cache: "no-store",
				},
			),
		]);

		if (!recentTracksResponse.ok || !topAlbumsResponse.ok) {
			return NextResponse.json(
				{ error: "Last.fm request failed" },
				{ status: 502 },
			);
		}

		const recentTracksPayload =
			(await recentTracksResponse.json()) as LastFmRecentTracksResponse;
		const topAlbumsPayload =
			(await topAlbumsResponse.json()) as LastFmTopAlbumsResponse;

		const topAlbums = (topAlbumsPayload.topalbums?.album ?? [])
			.slice(0, 3)
			.map((album) => ({
				name: album.name ?? null,
				artistName: album.artist?.name ?? null,
				playcount: album.playcount ?? null,
				url: album.url ?? null,
				imageUrl: getBestImage(album.image ?? []) || null,
			}));

		const track = recentTracksPayload.recenttracks?.track?.[0];

		if (!track) {
			return NextResponse.json({
				isPlaying: false,
				trackName: null,
				artistName: null,
				albumName: null,
				url: null,
				imageUrl: null,
				playedAt: null,
				topAlbums,
			});
		}

		const isPlaying = track["@attr"]?.nowplaying === "true";
		return NextResponse.json({
			isPlaying,
			trackName: track.name ?? null,
			artistName: track.artist?.["#text"] ?? null,
			albumName: track.album?.["#text"] ?? null,
			url: track.url ?? null,
			imageUrl: getBestImage(track.image ?? []) || null,
			playedAt: track.date?.["#text"] ?? null,
			topAlbums,
		});
	} catch {
		return NextResponse.json(
			{ error: "Unable to fetch Last.fm data" },
			{ status: 500 },
		);
	}
}
