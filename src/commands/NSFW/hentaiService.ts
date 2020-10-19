import { search } from "kaori";
import { Image } from "kaori/typings/Image";
const sites: string[] = ["danbooru", "yandere"];

export async function grabHentaiPictureAsync(usertags: string[] = []): Promise<Image> {
	usertags.push("rating:explicit");
	const images = await search(sites[Math.floor(Math.random() * sites.length)], { tags: usertags, exclude: ["loli", "shota"], random: true });
	return images[0];
}