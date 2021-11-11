import fetch from "node-fetch";
import { KaikiUtil } from "kaiki";

export async function getMikuImage(): Promise<string | void> {
	return (await KaikiUtil.handleToJSON(await (await fetch("https://miku-for.us/api/v2/random")).json()))["url"];
}
