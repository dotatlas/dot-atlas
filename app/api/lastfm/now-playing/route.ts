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

type LastFmArtistTopAlbumsResponse = {
	topalbums?: {
		album?: LastFmTopAlbum[];
	};
};

type MusicBrainzArtistSearchResponse = {
	artists?: Array<{
		id?: string;
		score?: number | string;
	}>;
};

type MusicBrainzArtistLookupResponse = {
	relations?: Array<{
		type?: string;
		url?: {
			resource?: string;
		};
	}>;
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

async function resolveWikimediaFileUrl(
	fileName: string,
): Promise<string | null> {
	const params = new URLSearchParams({
		action: "query",
		format: "json",
		prop: "imageinfo",
		iiprop: "url",
		iiurlwidth: "1280",
		titles: `File:${fileName}`,
		origin: "*",
	});

	try {
		const response = await fetch(
			`https://commons.wikimedia.org/w/api.php?${params.toString()}`,
			{ cache: "no-store" },
		);

		if (!response.ok) return null;

		const data = (await response.json()) as {
			query?: {
				pages?: Record<
					string,
					{ imageinfo?: Array<{ thumburl?: string; url?: string }> }
				>;
			};
		};

		const pages = data.query?.pages;
		if (!pages) return null;

		for (const page of Object.values(pages)) {
			const imageInfo = page.imageinfo?.[0];
			if (imageInfo?.thumburl) return imageInfo.thumburl;
			if (imageInfo?.url) return imageInfo.url;
		}
	} catch {
		return null;
	}

	return null;
}

async function getMusicBrainzImageFromRelations(
	relations: MusicBrainzArtistLookupResponse["relations"] = [],
): Promise<string | null> {
	const isLikelyImageUrl = (url?: string) => {
		if (!url) return false;

		try {
			const parsed = new URL(url);
			const isWikiFilePage =
				/^\/wiki\/File:/i.test(parsed.pathname) ||
				/^\/wiki\/Datei:/i.test(parsed.pathname);

			if (isWikiFilePage) return false;

			const isUploadWikimedia = parsed.hostname === "upload.wikimedia.org";
			if (isUploadWikimedia) return true;

			return /\.(png|jpe?g|webp|gif|avif)(\?|$)/i.test(parsed.pathname);
		} catch {
			return false;
		}
	};

	const normalizeImageUrl = async (url?: string): Promise<string | null> => {
		if (!url) return null;

		if (isLikelyImageUrl(url)) return url;

		try {
			const parsed = new URL(url);
			const isCommons = parsed.hostname === "commons.wikimedia.org";
			const match = parsed.pathname.match(/^\/wiki\/File:(.+)$/i);

			if (isCommons && match?.[1]) {
				const fileName = decodeURIComponent(match[1]);
				return resolveWikimediaFileUrl(fileName);
			}
		} catch {
			return null;
		}

		return null;
	};

	const imageRelation = relations.find(
		(relation) => relation.type === "image" && relation.url?.resource,
	);
	if (imageRelation?.url?.resource) {
		const normalized = await normalizeImageUrl(imageRelation.url.resource);
		if (normalized) return normalized;
	}

	const directImageUrl = relations.find((relation) =>
		isLikelyImageUrl(relation.url?.resource),
	);
	if (directImageUrl?.url?.resource) {
		const normalized = await normalizeImageUrl(directImageUrl.url.resource);
		if (normalized) return normalized;
	}

	for (const relation of relations) {
		const normalized = await normalizeImageUrl(relation.url?.resource);
		if (normalized) return normalized;
	}

	return null;
}

async function getArtistTopAlbum(artistName: string): Promise<string | null> {
	const apiKey = process.env.LASTFM_API_KEY;
	if (!apiKey || !artistName.trim()) return null;

	const params = new URLSearchParams({
		method: "artist.gettopalbums",
		artist: artistName.trim(),
		api_key: apiKey,
		format: "json",
		limit: "1",
	});

	try {
		const response = await fetch(
			`https://ws.audioscrobbler.com/2.0/?${params.toString()}`,
			{ cache: "no-store" },
		);

		if (!response.ok) return null;

		const payload = (await response.json()) as LastFmArtistTopAlbumsResponse;
		const topAlbum = payload.topalbums?.album?.[0];
		if (!topAlbum) return null;

		return getBestImage(topAlbum.image ?? []) || null;
	} catch {
		return null;
	}
}

async function getArtistImageURL(
	artist: LastFmTopArtist,
): Promise<string | null> {
	if (!artist.name?.trim()) return null;

	const userAgent =
		process.env.MUSICBRAINZ_USER_AGENT ??
		"dot-atlas/1.0.0 (https://github.com; contact: admin@localhost)";

	const fetchWithHeaders = (url: string) =>
		fetch(url, {
			cache: "no-store",
			headers: {
				"User-Agent": userAgent,
				Accept: "application/json",
			},
		});

	try {
		let mbid = artist.mbid?.trim();

		if (!mbid) {
			const searchParams = new URLSearchParams({
				query: `artist:${artist.name.trim()}`,
				fmt: "json",
				limit: "1",
			});

			const searchResponse = await fetchWithHeaders(
				`https://musicbrainz.org/ws/2/artist/?${searchParams.toString()}`,
			);

			if (searchResponse.ok) {
				const searchPayload =
					(await searchResponse.json()) as MusicBrainzArtistSearchResponse;
				mbid = searchPayload.artists?.[0]?.id?.trim();
			}
		}

		if (!mbid) return null;

		const artistInfoParams = new URLSearchParams({
			inc: "url-rels",
			fmt: "json",
		});

		const artistInfoResponse = await fetchWithHeaders(
			`https://musicbrainz.org/ws/2/artist/${encodeURIComponent(mbid)}?${artistInfoParams.toString()}`,
		);

		if (!artistInfoResponse.ok) return null;

		const artistInfoPayload =
			(await artistInfoResponse.json()) as MusicBrainzArtistLookupResponse;

		const musicBrainzImage = await getMusicBrainzImageFromRelations(
			artistInfoPayload.relations,
		);
		if (musicBrainzImage) return musicBrainzImage;

		return await getArtistTopAlbum(artist.name);
	} catch {
		return await getArtistTopAlbum(artist.name);
	}
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
						(await getArtistImageURL(artist)) ||
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
