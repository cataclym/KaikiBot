import { search } from "kaori";
import { Image } from "kaori/typings/Image";
import fetch from "node-fetch";
const sites: string[] = ["danbooru", "yandere"];

export type types =
"waifu" | "neko" | "trap" | "blowjob";
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
		const rawResponse = await fetch(`https://waifu.pics/api/many/nsfw/${type}`, {
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
	return await (await (await fetch(`https://waifu.pics/api/nsfw/${type}`)).json())["url"];

}