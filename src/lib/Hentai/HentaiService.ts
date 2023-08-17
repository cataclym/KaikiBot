import { container } from "@sapphire/pieces";
import { Collection } from "discord.js";
import fetch, { RequestInfo } from "node-fetch";
import Constants from "../../struct/Constants";
import E261APIData, { Post } from "../Interfaces/Common/E261APIData";
import KaikiUtil from "../KaikiUtil";

export enum DAPI {
    E621,
    Danbooru,
}

export type HentaiTypes = "waifu" | "neko" | "femboy" | "trap" | "blowjob";

// noinspection FunctionNamingConventionJS
export default class HentaiService {

    public imageCache = new Collection<number, Post>();

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

    async apiGrabber(tags: string[] | null, type: DAPI): Promise<Post | void> {

        const tag = tags?.join("+").replace(" ", "_").toLowerCase() || "";
        let url = "";

        const query = new URLSearchParams();

        switch (type) {
            case DAPI.E621:
                if (tags) {
                    query.append("tags", tag);
                }
                query.append("limit",
                    "50");

                return this.e621(`https://e621.net/posts.json?${query}`);

            case DAPI.Danbooru:
                url = `https://danbooru.donmai.us/posts.json?limit=100&tags=${tag}`;
                break;
            // TODO:::: ???

        }
    }

    async e621(url: RequestInfo) {


        if (this.imageCache.size > Constants.MAGIC_NUMBERS.LIB.HENTAI.HENTAI_SERVICE.FULL_CACHE_SIZE) {
            return this.imageCache.random()!;
        }

        const r = await fetch(url, this.options);

        if (Object.values(Constants.MAGIC_NUMBERS.LIB.HENTAI.HENTAI_SERVICE.HTTP_REQUESTS).includes(r.status)
            && this.imageCache.size >= Constants.MAGIC_NUMBERS.LIB.HENTAI.HENTAI_SERVICE.MEDIUM_CACHE_SIZE) {
            return this.imageCache.random();
        }

        if (r.status !== Constants.MAGIC_NUMBERS.LIB.HENTAI.HENTAI_SERVICE.HTTP_REQUESTS.OK) {
            throw new Error(`Error: Fetch didnt return successful Status code\n${r.status} ${r.statusText}`);
        }

        const json = <E261APIData> await r.json()
            .catch((err) => container.logger.error(err));

        if (Array.isArray(json.posts)) {
            const [post] = await Promise.all(json.posts.map(async (p) => this.imageCache.set(p.id, p)));

            return post.random();
        }

        else {
            const res = await fetch(url);

            if (!res.body) return;

            return JSON.parse(res.body.toString()).posts;
        }
    }
}
