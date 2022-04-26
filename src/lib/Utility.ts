import chalk from "chalk";
import { Command, Listener } from "discord-akairo";
import { ColorResolvable, GuildMember, HexColorString, Message, UserFlagsString } from "discord.js";
import fetch from "node-fetch";
import { hexColorTable } from "./Color";
import { TKaikiColor } from "./Types/TColor";

export type presenceType = {
    main: string,
    richPresence: string[],
}

export default class Utility {
    static toggledTernary(value: boolean) {
        return value
            ? "Enabled"
            : "Disabled";
    }

    static async getMemberColorAsync(message: Message): Promise<ColorResolvable> {
        return <ColorResolvable>message?.member?.displayColor || "#f47fff";
    }

    static timeToMidnight(): number {
        const d = new Date();
        return (-d + d.setHours(24, 0, 0, 0));
    }

    static errorColor: ColorResolvable = hexColorTable["red"];

    static okColor: ColorResolvable = "#00ff00";

    static flags: { [index in UserFlagsString]: string } = {
        DISCORD_EMPLOYEE: "Discord Employee 👨‍💼",
        PARTNERED_SERVER_OWNER: "Discord Partner ❤️",
        HYPESQUAD_EVENTS: "HypeSquad Events 🎊",
        BUGHUNTER_LEVEL_1: "Bug Hunter (Level 1) 🐛",
        BUGHUNTER_LEVEL_2: "Bug Hunter (Level 2) 🐛",
        HOUSE_BRAVERY: "House of Bravery 🏠",
        HOUSE_BRILLIANCE: "House of Brilliance 🏠",
        HOUSE_BALANCE: "House of Balance 🏠",
        EARLY_SUPPORTER: "Early Supporter 👍",
        TEAM_USER: "Team User 🏁",
        VERIFIED_BOT: "Verified Bot ☑️",
        EARLY_VERIFIED_BOT_DEVELOPER: "Early Verified Developer ✅",
        DISCORD_CERTIFIED_MODERATOR: "Certified Moderator",
        BOT_HTTP_INTERACTIONS: "Bot interactions",
    };

    static trim(str: string, max: number): string {
        return (str.length > max) ? `${str.slice(0, max - 3)}...` : str;
    }

    /**
     * Create codeblocks ready to be sent to discord.
     * @param language
     | "ansi"
     | "asciidoc"
     | "autohotkey"
     | "bash"
     | "coffeescript"
     | "cpp"
     | "cs"
     | "css"
     | "diff"
     | "fix"
     | "glsl"
     | "ini"
     | "json"
     | "md"
     | "ml"
     | "prolog"
     | "py"
     | "tex"
     | "xl"
     | "xml"
     * @param code
     string
     */
    static async codeblock(
        code: string,
        language?:
            | "ansi"
            | "asciidoc"
            | "autohotkey"
            | "bash"
            | "coffeescript"
            | "cpp"
            | "cs"
            | "css"
            | "diff"
            | "fix"
            | "glsl"
            | "ini"
            | "json"
            | "md"
            | "ml"
            | "prolog"
            | "py"
            | "sql"
            | "tex"
            | "xl"
            | "xml",
    ): Promise<string> {
        return `\`\`\`${language ?? ""}\n${code}\`\`\``;
    }

    static async listenerLog(message: Message, listener: Listener,
        logger: (...msg: any[]) => void, command?: Command, extra = ""): Promise<void> {

        logger(`${chalk.blueBright(listener.id)} | ${chalk.blueBright(Date.now() - message.createdTimestamp)}ms
${message.channel.type !== "DM"
        ? `Guild: ${chalk.blueBright(message.guild?.name ?? "N/A")} [${chalk.blueBright(message.guild?.id ?? "N/A")}]\nChannel: #${chalk.blueBright(message.channel.name)} [${chalk.blueBright(message.channel.id)}]`
        : `DMChannel: [${chalk.blueBright(message.author.dmChannel?.id)}]`}
User: ${chalk.blueBright(message.author.username)} [${chalk.blueBright(message.author.id)}]
Executed ${chalk.blueBright(command?.id ?? "N/A")} | "${chalk.yellow(message.content.substring(0, 100))}"\n${extra}`);
    }

    // Credit to https://futurestud.io/tutorials/split-an-array-into-smaller-array-chunks-in-javascript-and-node-js
    /**
     * Split the `items` array into multiple, smaller arrays of the given `size`.
     *
     * @param {Array} items
     * @param {Number} size
     *
     * @returns {Array[]}
     */
    static async chunk(items: any[], size: number): Promise<any[]> {
        const chunks = [];
        items = [].concat(...items);

        while (items.length) {
            chunks.push(
                items.splice(0, size),
            );
        }

        return chunks;
    }

    // Credits to https://www.codegrepper.com/code-examples/javascript/nodejs+strip+html+from+string
    static stripHtml(html: string) {
        return html.replace(/(<([^>]+)>)/ig, "");
    }

    // Credits: parktomatomi
    // https://stackoverflow.com/a/64093016
    static partition(array: any[], predicate: (...args: any) => boolean) {
        return array.reduce((acc, item) => (acc[+!predicate(item)].push(item), acc), [[], []]);
    }

    static async loadImage(url: string) {
        return fetch(url)
            .then(res => res.buffer());
    }

    // Credits to https://www.html-code-generator.com/javascript/color-converter-script
    static HEXtoRGB(hex: string): TKaikiColor | null {
        hex = hex.replace(/#/g, "");
        if (hex.length === 3) {
            // WTF is this
            // eslint-disable-next-line @typescript-eslint/no-shadow
            hex = hex.split("").map((hex) => {
                return hex + hex;
            }).join("");
        }
        // validate hex format
        const result = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})[\da-z]{0}$/i.exec(hex);
        if (result) {
            const red = parseInt(result[1], 16);
            const green = parseInt(result[2], 16);
            const blue = parseInt(result[3], 16);

            return { r: red, g: green, b: blue };
        }
        else {
            // invalid color
            return null;
        }
    }

    static RGBtoHEX(color: TKaikiColor): HexColorString {
        const string = Object.values(color).map((n: number) => n.toString(16)).join("");
        return `#${string}`;
    }

    static getMemberPresence(obj: GuildMember) {
        const activities = obj.presence?.activities.map(psnc => {
            const { name, type, state, emoji, assets } = psnc;
            return { name, type, state, emoji, assets };
        });

        const presence = activities?.find(psnc => psnc.type !== "CUSTOM") || activities?.shift();

        if (!activities || !presence) {
            return null;
        }

        else if (presence.assets) {
            const image = presence.assets?.largeImageURL() || presence.assets?.smallImageURL();

            return {
                name: `${presence.type !== "CUSTOM" ? presence.type.toLocaleLowerCase() : presence.emoji || ""} ${presence.name} - ${presence.state}`,
                value: `${presence.assets.largeText}\n${presence.assets.smallText}`,
                image: image,
            };
        }

        else {
            return {
                name: `${presence.type !== "CUSTOM" ? presence.type.toLocaleLowerCase() : presence.emoji || ""} ${presence.name}`,
                value: presence.state || "N/A",
                image: null,
            };
        }
    }

    static msToTime(duration: number): string {
        const milliseconds: number = Math.floor((duration % 1000) / 100);
        let seconds: number | string = Math.floor((duration / 1000) % 60),
            minutes: number | string = Math.floor((duration / (1000 * 60)) % 60),
            hours: number | string = Math.floor((duration / (1000 * 60 * 60)) % 24);

        hours = (hours < 10) ? "0" + hours : hours;
        minutes = (minutes < 10) ? "0" + minutes : minutes;
        seconds = (seconds < 10) ? "0" + seconds : seconds;

        return `**${hours}** hours **${minutes}** minutes **${seconds}.${milliseconds}** seconds`;
    }
}
