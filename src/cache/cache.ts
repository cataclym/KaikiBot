import { getCommandStatsDocument } from "../struct/documentMethods";
import { Snowflake } from "discord-api-types";

// Anime quotes
export type respType = { anime: string, character: string, quote: string };
export const animeQuoteCache: {[character: string]: respType } = {};

export let cmdStatsCache: {[index: string]: number} = {};

setInterval(async () => {
	if (!Object.entries(cmdStatsCache).length) return;

	const db = await getCommandStatsDocument();
	for await (const [id, number] of Object.entries(cmdStatsCache)) {
		db.count[id]
			? db.count[id] += number
			: db.count[id] = number;
	}
	db.markModified("count");
	await db.save();

	cmdStatsCache = {};
}, 900000);

// Obvious names are obvious
export const dailyClaimsCache: {[index: string]: boolean} = {};
// TODO: PLEASE OH GOD MOVE THIS TO DB

export type emoteReactObjectType = {[keyWord: string]: Snowflake};
export type separatedEmoteReactTypes = {
	has_space: emoteReactObjectType,
	no_space: emoteReactObjectType
};

export const emoteReactCache: {[guild: string]: separatedEmoteReactTypes} = {};
