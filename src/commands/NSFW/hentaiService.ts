import { search } from "kaori";
import { Image } from "kaori/typings/Image";

export async function grabHentaiPictureAsync(usertags = ["rating:explicit"]): Promise<Image> {
	const sites: string[] = ["danbooru", "yandere", "gelbooru", "rule34"];
	function randomSite(boorus: string[]) {
		const newLocal = boorus[Math.floor(Math.random() * boorus.length)];
		console.log(newLocal);
		return newLocal;
	}
	try {
		const images = await search(randomSite(sites), { tags: usertags, exclude: ["loli"], limit: 1, random: true });
		const newLocal = images.map((image) => {
			return <Image>image;
		});
		return newLocal[1] ? newLocal[1] : await grabHentaiPictureAsync(usertags);
	}
	catch {
		return await grabHentaiPictureAsync(usertags);
	}
}