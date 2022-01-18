import { Command, Listener } from "discord-akairo";
import { ColorResolvable, Message, UserFlagsString } from "discord.js";
import { hexColorTable } from "./Color";
import chalk from "chalk";

export async function getMemberColorAsync(message: Message): Promise<ColorResolvable> {
    return <ColorResolvable> message?.member?.displayColor || "#f47fff";
}

export const errorColor: ColorResolvable = hexColorTable["red"];

export const okColor: ColorResolvable = "#00ff00";

export type presenceType = {
	main: string,
	richPresence: string[],
}

// Broken in Discord.js-dev v13
// TODO: Redo this, and add it to info, replacing uinfo.
// This section is awful
// export async function getUserPresenceAsync(user: User): Promise<presenceType> {
//
// 	const presence: presenceType = { main: "", richPresence: [] };
//
// 	if (user instanceof ClientUser) {
// 		return Promise.resolve(presence);
// 	}
//
// 	presence.main = (user.presence?.activities?.length
// 		? `${user.presence?.activities.join(", ")}\n`
// 		: "") + (user.presence?.activities.map((e) => e.state).length
// 		? `**State**\n${user?.presence?.activities.map((a) => a.state).join("\n")}\n`
// 		: "") + (user.presence.status !== "offline"
// 		? Object.entries(user.presence.clientStatus as {[s: string]:unknown} | ArrayLike<unknown>).join(", ")
// 		: "Offline");
//
// 	const uPActivities = user?.presence?.activities;
//
// 	presence.richPresence = [uPActivities.map((e) => e.assets?.largeImageURL({ size: 128 }))[0] ?? "", uPActivities.map((e) => e.details)[0] ?? "", uPActivities.map((e) => e.assets?.largeText)[0] ?? "", uPActivities.map((e) => e.assets?.smallText)[0] ?? ""] ?? [""];
//
// 	return presence;
// }

export const flags: {[index in UserFlagsString]: string} = {
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
export function calculateAspectRatioFit(srcWidth: number, srcHeight: number, maxWidth: number, maxHeight: number): { width: number, height: number } {

    const ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);

    return { width: srcWidth * ratio, height: srcHeight * ratio };
}

export function trim(str: string, max: number): string {
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
export async function codeblock(
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

export async function listenerLog(message: Message, listener: Listener,
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
export async function chunk(items: any[], size: number): Promise<any[]> {
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
export function stripHtml(html: string) {
    return html.replace(/(<([^>]+)>)/ig, "");
}

// Credits: parktomatomi
// https://stackoverflow.com/a/64093016
export function partition(array: any[], predicate: (...args: any) => boolean) {
    return array.reduce((acc, item) => (acc[+!predicate(item)].push(item), acc), [[], []]);
}
