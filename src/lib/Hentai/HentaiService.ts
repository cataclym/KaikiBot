import { container } from "@sapphire/pieces";
import fetch from "node-fetch";
import KaikiUtil from "../../lib/Kaiki/KaikiUtil";
import Constants from "../../struct/Constants";
import E261APIData, { Post } from "../Interfaces/Common/E261APIData";

export enum DAPI {
    E621,
    Danbooru,
}

export type HentaiTypes = "waifu" | "neko" | "femboy" | "trap" | "blowjob";

export default class HentaiService {

    public imageCache: { [id: string]: Post } = {};

    options = {
        method: "GET",
        headers: {
            "User-Agent": "KaikiDeishuBot is a Discord bot (https://gitlab.com/cataclym/KaikiDeishuBot/)",
        },
    };


    public static hentaiArray: HentaiTypes[] = ["waifu", "neko", "femboy", "blowjob"];

    public async grabHentai(type: HentaiTypes, format: "single"): Promise<string>
    public async grabHentai(type: HentaiTypes, format: "bomb"): Promise<string[]>
    public async grabHentai(type: HentaiTypes, format: "single" | "bomb"): Promise<string | string[]> {

        if (type === "femboy") type = "trap";

        if (format === "bomb") {
            const rawResponse = await fetch(`https://api.waifu.pics/many/nsfw/${type}`, {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ a: 1, b: "Textual content" }),
            });
            return (await KaikiUtil.handleToJSON(await rawResponse.json()))["files"];
        }
        return (await KaikiUtil.handleToJSON(await (await fetch(`https://waifu.pics/api/nsfw/${type}`)).json()))["url"];

    }

    async DapiGrabber(tags: string[] | null, type: DAPI): Promise<Post | void> {

        const tag = tags?.join("+").replace(" ", "_").toLowerCase() || "";
        let url = "";

        switch (type) {
            case DAPI.E621: {
                const query = new URLSearchParams();
                query.append("tags", tag);
                query.append("limit",
                    "50");
                url = `https://e621.net/posts.json?${query}`;
                break;
            }
            case DAPI.Danbooru: {
                url = `https://danbooru.donmai.us/posts.json?limit=100&tags=${tag}`;
                break;
            }
        }

        if (type === DAPI.E621) {

            const cache = Object.values(this.imageCache);
            if (cache.length > Constants.MAGIC_NUMBERS.LIB.HENTAI.HENTAI_SERVICE.FULL_CACHE_SIZE) {
                return cache[Math.floor(Math.random() * cache.length)];
            }

            const r = (await fetch(url, this.options));

            if (Object.values(Constants.MAGIC_NUMBERS.LIB.HENTAI.HENTAI_SERVICE.HTTP_REQUESTS).includes(r.status)
                && cache.length >= Constants.MAGIC_NUMBERS.LIB.HENTAI.HENTAI_SERVICE.MEDIUM_CACHE_SIZE) {
                return cache[Math.floor(Math.random() * cache.length)];
            }

            if (r.status !== Constants.MAGIC_NUMBERS.LIB.HENTAI.HENTAI_SERVICE.HTTP_REQUESTS.OK) {
                throw new Error(`Error: Fetch didnt return successful Status code\n${r.status} ${r.statusText}`);
            }

            const json = <E261APIData> await r.json()
                .catch((err) => container.logger.error(err));

            if (Array.isArray(json)) {
                json.posts.forEach((p) => (this.imageCache)[p.id] = p);

                return json.posts[Math.floor(Math.random() * json.posts.length)];
            }

            else {
                const res = await fetch(url);
                return JSON.parse(res.body?.toString()).posts;
            }
        }
    }

}
