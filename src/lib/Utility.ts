import { ActivityType, ChannelType, ColorResolvable, GuildMember, HexColorString, Message } from "discord.js";
import fetch from "node-fetch";
import Constants from "../struct/Constants";
import { KaikiColor } from "./Types/KaikiColor";
import { RegexpType } from "./Types/Miscellaneous";

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
        return (-d + d.setHours(Constants.MAGIC_NUMBERS.LIB.UTILITY.HRS_DAY, 0, 0, 0));
    }

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

    //     static async listenerLog(message: Message, listener: Listener,
    //         logger: (...msg: any[]) => void, command?: Command, extra = ""): Promise<void> {
    //
    //         logger(`${chalk.blueBright(listener.id)} | ${chalk.blueBright(Date.now() - message.createdTimestamp)}ms
    // ${message.channel.type !== ChannelType.DM
    //         ? `Guild: ${chalk.blueBright(message.guild?.name ?? "N/A")} [${chalk.blueBright(message.guild?.id ?? "N/A")}]\nChannel: #${chalk.blueBright(message.channel.name)} [${chalk.blueBright(message.channel.id)}]`
    //         : `DMChannel: [${chalk.blueBright(message.author.dmChannel?.id)}]`}
    // User: ${chalk.blueBright(message.author.username)} [${chalk.blueBright(message.author.id)}]
    // Executed ${chalk.blueBright(command?.id ?? "N/A")} | "${chalk.yellow(message.content.substring(0, 100))}"\n${extra}`);
    //     }

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
    static convertHexToRGB(hex: string): KaikiColor {
        hex = hex.replace(/#/g, "");

        const arrBuff = new ArrayBuffer(4);
        const vw = new DataView(arrBuff);
        vw.setUint32(0, parseInt(hex, 16), false);
        const arrByte = new Uint8Array(arrBuff);

        return { r: arrByte[1], g: arrByte[2], b: arrByte[3] };
    }

    static convertRGBToHex({ r, g, b }: KaikiColor): HexColorString {
        return `#${(1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1)}`;
    }

    static getMemberPresence(obj: GuildMember) {
        const activities = obj.presence?.activities.map(psnc => {
            const { name, type, state, emoji, assets } = psnc;
            return { name, type, state, emoji, assets };
        });

        const presence = activities?.find(psnc => psnc.type !== ActivityType.Custom) || activities?.shift();

        if (!activities || !presence) {
            return null;
        }

        else if (presence.assets) {
            const image = presence.assets?.largeImageURL() || presence.assets?.smallImageURL();

            return {
                name: `${presence.type !== ActivityType.Custom ? String(presence.type).toLocaleLowerCase() : presence.emoji || ""} ${presence.name} - ${presence.state}`,
                value: `${presence.assets.largeText}\n${presence.assets.smallText}`,
                image: image,
            };
        }

        else {
            return {
                name: `${presence.type !== ActivityType.Custom ? String(presence.type).toLocaleLowerCase() : presence.emoji || ""} ${presence.name}`,
                value: presence.state || "N/A",
                image: null,
            };
        }
    }

    static isRegex(value: unknown): value is RegexpType {
        return (value as RegexpType).match !== undefined;
    }
}
