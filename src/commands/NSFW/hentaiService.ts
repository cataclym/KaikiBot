import { Message, MessageEmbed } from "discord.js";
import { search } from "kaori";
import { Image } from "kaori/typings/Image";
import logger from "loglevel";
import fetch from "node-fetch";
import querystring from "querystring";
import { repository, version } from "../../../package.json";
import { Post, responseE621 } from "../../interfaces/IDapi";

const sites = ["danbooru", "yandere"];

export enum DapiSearchType {
	E621,
	Danbooru,
}

const options = {
	method: "GET",
	headers: {
		"User-Agent": `KaikiDeishuBot a Discord bot, v${version} (${repository.url})`,
	},
};

export type types = "waifu" | "neko" | "trap" | "blowjob";

export const typesArray: types[] = ["waifu", "neko", "trap", "blowjob"];

export async function grabHentaiPictureAsync(usertags: string[] = []): Promise<Image> {
	usertags.push("rating:explicit");
	const images = await search(sites[Math.floor(Math.random() * sites.length)], { tags: usertags, exclude: ["loli", "shota"], random: true });
	return images[0];
}

export async function grabHentai(type: types, format: "single"): Promise<string>
export async function grabHentai(type: types, format: "bomb"): Promise<string[]>
export async function grabHentai(type: types, format: "single" | "bomb"): Promise<string | string[]> {

	if (format === "bomb") {
		const rawResponse = await fetch(`https://api.waifu.pics/many/nsfw/${type}`, {
			method: "POST",
			headers: {
				"Accept": "application/json",
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ a: 1, b: "Textual content" }),
		});
		const content: string[] = (await rawResponse.json())["files"];

		return content;
	}
	return (await (await fetch(`https://waifu.pics/api/nsfw/${type}`)).json())["url"];

}

export async function DapiGrabber(tags: string[] | null, type: DapiSearchType): Promise<Post | void> {

	const tag = tags?.join("+").replace(" ", "_").toLowerCase();
	let url = "";

	switch (type) {
		case DapiSearchType.E621: {
			const query = querystring.stringify({ tags: tag, limit: 50 });
			url = `https://e621.net/posts.json?${query}`;
			break;
		}
		case DapiSearchType.Danbooru: {
			url = `http://danbooru.donmai.us/posts.json?limit=100&tags=${tag}`;
			break;
		}
	}

	if (type === DapiSearchType.E621) {

		const cache = Object.values(imageCache);
		if (cache.length > 200) {
			return cache[Math.floor(Math.random() * cache.length)];
		}

		const r = (await fetch(url, options));

		console.log(r.status, r.statusText);

		if ([503, 429, 502].includes(r.status) && cache.length >= 50) {
			return cache[Math.floor(Math.random() * cache.length)];
		}

		if (!(r.status === 200)) {
			throw new Error(`Error: Fetch didnt return successful Status code\n${r.status} ${r.statusText}`);
		}

		const json: responseE621 = await r.json()
			.catch((err) => logger.error(err));

		if (Array.isArray(json)) {
			json.posts.forEach(async (p) => imageCache[p.id] = p);
		}

		return json.posts[Math.floor(Math.random() * json.posts.length)];
	}

	if (type === DapiSearchType.Danbooru) {
		const r = await fetch(url);
		return JSON.parse(r.body.toString()).posts;
	}
}

export async function postHentai(message: Message, messageArguments: string[] | undefined): Promise<Message> {
	const awaitResult = async () => (await grabHentaiPictureAsync(messageArguments));
	const result: Image = await awaitResult();
	if (result) {
		return message.channel.send({
			content: result.sampleURL, embeds: [new MessageEmbed({
				author: { name: result.createdAt?.toLocaleString() },
				title: "Score: " + result.score,
				description: `[Source](${result.source} "${result.source}")`,
				image: { url: <string | undefined>result.fileURL || result.sampleURL || result.previewURL },
				footer: { text: result.tags.join(", ") },
			})
				.withOkColor(message)],
		});
	}
	else {
		return postHentai(message, messageArguments);
	}
}

const imageCache: {[id: string]: Post} = {};
