import { search } from "kaori";
import { Image } from "kaori/typings/Image";

export async function grabHentaiPictureAsync(usertags = ["rating:explicit"]): Promise<Image> {
	const sites: string[] = ["danbooru", "yandere", "rule34"];
	async function randomSite(boorus: string[]) {
		return boorus[Math.floor(Math.random() * boorus.length)];
	}
	const images = await search(await randomSite(sites), { tags: usertags, exclude: ["loli"], limit: 1, random: true });
	return images[0];
}