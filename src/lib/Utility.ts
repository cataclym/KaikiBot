import { ColorResolvable, Message, UserFlagsString } from "discord.js";
import { hexColorTable } from "./Color";
import { Command, Listener } from "discord-akairo";
import chalk from "chalk/index";

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

    /**
   * Conserve aspect ratio of the original region. Useful when shrinking/enlarging
   * images to fit into a certain area.
   *
   * @param {Number} srcWidth width of source image
   * @param {Number} srcHeight height of source image
   * @param {Number} maxWidth maximum available width
   * @param {Number} maxHeight maximum available height
   * @return {Object} { width, height }
   */
    static calculateAspectRatioFit(srcWidth: number, srcHeight: number, maxWidth: number, maxHeight: number): { width: number, height: number } {

        const ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);

        return { width: srcWidth * ratio, height: srcHeight * ratio };
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

    // Credit to https://www.codegrepper.com/code-examples/javascript/nodejs+strip+html+from+string
    static stripHtml(html: string) {
        return html.replace(/(<([^>]+)>)/ig, "");
    }

    // Credits: parktomatomi
    // https://stackoverflow.com/a/64093016
    static partition(array: any[], predicate: (...args: any) => boolean) {
        return array.reduce((acc, item) => (acc[+!predicate(item)].push(item), acc), [[], []]);
    }
}
