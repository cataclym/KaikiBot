import { getCommandStatsDB } from "../struct/db";

// Anime quotes
export type respType = { anime: string, character: string, quote: string };
export const animeQuoteCache: {[character: string]: respType } = {};

export let cmdStatsCache: {[index: string]: number} = {};

setInterval(async () => {
	const db = await getCommandStatsDB();

	if (!Object.entries(cmdStatsCache).length) return;

	Object.entries(cmdStatsCache)
		.forEach(async ([id, number]) => {
			db.count[id]
				? db.count[id] += number
				: db.count[id] = number;
		});
	db.markModified("count");
	db.save();

	cmdStatsCache = {};
}, 900000);