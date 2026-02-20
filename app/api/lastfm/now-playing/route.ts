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

type LastFmTopArtist = {
	name?: string;
	mbid?: string;
	playcount?: string;
	url?: string;
	image?: Array<{ "#text"?: string; size?: string }>;
};

type LastFmTopArtistsResponse = {
	topartists?: {
		artist?: LastFmTopArtist[];
	};
};

function getBestImage(
	images: Array<{ "#text"?: string; size?: string }> = [],
): string {
	const LASTFM_PLACEHOLDER_ID = "2a96cbd8b46e442fc41c2b86b821562f";

	const isValidImageUrl = (url?: string): url is string => {
		if (!url) return false;
		if (url.includes(LASTFM_PLACEHOLDER_ID)) return false;
		return true;
	};

	const order = ["mega", "extralarge", "large", "medium", "small"];
	for (const size of order) {
		const match = images.find(
			(image) => image.size === size && isValidImageUrl(image["#text"]),
		);
		if (match?.["#text"]) return match["#text"];
	}

	const fallback = images.find((image) => isValidImageUrl(image["#text"]));
	if (fallback?.["#text"]) return fallback["#text"];

	return "";
}

function getArtistImageURL(artist: LastFmTopArtist, params: URLSearchParams) {
	if (!artist.name) return Promise.resolve(null);

	const artistParams = new URLSearchParams(params);
	const mbid = artist.mbid?.trim();
	if (mbid) {
		artistParams.set("mbid", mbid);
		artistParams.delete("artist");
	} else {
		artistParams.delete("mbid");
		artistParams.set("artist", artist.name.trim());
	}
	const fetchLink = `https://ws.audioscrobbler.com/2.0/?${artistParams.toString()}`;

	return (
		fetch(fetchLink, {
			cache: "no-store",
		})
			.then((res) => res.json())
			// .then((data) => {
			// 	console.log("Artist info payload:", data);
			// 	return data;
			// });
			.then((data) => {
				const images = data?.artist?.image as
					| Array<{ "#text"?: string; size?: string }>
					| undefined;
				return getBestImage(images);
			})
			.catch(() => null)
	);
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

	const topArtistParams = new URLSearchParams({
		method: "user.gettopartists",
		user: username,
		api_key: apiKey,
		format: "json",
		period: "7day",
		limit: "3",
	});

	const artistInfoParams = new URLSearchParams({
		method: "artist.getinfo",
		artist: "", // Placeholder, will be set dynamically
		mbid: "", // Placeholder, will be set dynamically
		api_key: apiKey,
		format: "json",
	});

	try {
		const [recentTracksResponse, topAlbumsResponse, topArtistsResponse] =
			await Promise.all([
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
				fetch(
					`https://ws.audioscrobbler.com/2.0/?${topArtistParams.toString()}`,
					{
						cache: "no-store",
					},
				),
			]);

		if (
			!recentTracksResponse.ok ||
			!topAlbumsResponse.ok ||
			!topArtistsResponse.ok
		) {
			return NextResponse.json(
				{ error: "Last.fm request failed" },
				{ status: 502 },
			);
		}

		const recentTracksPayload =
			(await recentTracksResponse.json()) as LastFmRecentTracksResponse;
		const topAlbumsPayload =
			(await topAlbumsResponse.json()) as LastFmTopAlbumsResponse;
		const topArtistsPayload =
			(await topArtistsResponse.json()) as LastFmTopArtistsResponse;

		const topAlbums = (topAlbumsPayload.topalbums?.album ?? [])
			.slice(0, 3)
			.map((album) => ({
				name: album.name ?? null,
				artistName: album.artist?.name ?? null,
				playcount: album.playcount ?? null,
				url: album.url ?? null,
				imageUrl: getBestImage(album.image ?? []) || null,
			}));

		const topArtists = await Promise.all(
			(topArtistsPayload.topartists?.artist ?? [])
				.slice(0, 3)
				.map(async (artist) => ({
					name: artist.name ?? null,
					url: artist.url ?? null,
					playcount: artist.playcount ?? null,
					imageUrl:
						(await getArtistImageURL(artist, artistInfoParams)) ||
						getBestImage(artist.image ?? []) ||
						null,
				})),
		);

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
			topArtists,
		});
	} catch {
		return NextResponse.json(
			{ error: "Unable to fetch Last.fm data" },
			{ status: 500 },
		);
	}
}
