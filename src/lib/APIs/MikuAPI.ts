import fetch from "node-fetch";

export async function getMikuImage(): Promise<string> {
	return (await (await fetch("https://miku-for.us/api/v2/random")).json())["url"];
}
