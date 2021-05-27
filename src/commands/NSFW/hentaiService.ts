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

export async function DapiGrabber(tags: string[] | null, type: DapiSearchType): Promise<Post[] | void> {

	const tag = tags?.join("+").replace(" ", "_").toLowerCase();
	let url = "";

	switch (type) {
		case DapiSearchType.E621: {
			url = `https://e621.net/posts.json?limit=10&tags=${tag}`;
			break;
		}
		case DapiSearchType.Danbooru: {
			url = `http://danbooru.donmai.us/posts.json?limit=100&tags=${tag}`;
			break;
		}
	}

	try {
		if (type === DapiSearchType.E621) {
			const r: responseE621 = (await (await fetch(url, postData)).json());
			return r.posts;
		}
		if (type === DapiSearchType.Danbooru) {
			const r = (await (await fetch(url, postData)).json());
			return r.posts;
		}
	}
	catch (error) {
		throw new Error("Fetching image data returned null\n" + error);
	}

}

export async function postHentai(message: Message, messageArguments: string[] | undefined): Promise<Message> {
	const awaitResult = async () => (await grabHentaiPictureAsync(messageArguments));
	const result: Image = await awaitResult();
	if (result) {
		return message.channel.send(result.sampleURL, new MessageEmbed({
			author: { name: result.createdAt?.toLocaleString() },
			title: "Score: " + result.score,
			description: `[Source](${result.source} "${result.source}")`,
			image: { url: <string | undefined> result.fileURL || result.sampleURL || result.previewURL },
			footer: { text: result.tags.join(", ") },
		})
			.withOkColor(message));
	}
	else {
		return postHentai(message, messageArguments);
	}
}