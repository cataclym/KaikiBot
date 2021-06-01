import { Command, Listener } from "@cataclym/discord-akairo";
import { ClientUser, ColorResolvable, Message, User, UserFlagsString } from "discord.js";
import { hexColorTable } from "./Color";

export async function getMemberColorAsync(message: Message): Promise<ColorResolvable> {
	return <ColorResolvable> message?.member?.displayColor || "#f47fff";
}

export const errorColor: ColorResolvable = hexColorTable["red"];

export const okColor: ColorResolvable = "#00ff00";

export type presenceType = {
	main: string,
	richPresence: string[],
}

// This section is awful
export async function getUserPresenceAsync(user: User): Promise<presenceType> {

	const presence: presenceType = { main: "", richPresence: [] };

	if (user instanceof ClientUser) {
		return Promise.resolve(presence);
	}

	presence.main = (user.presence?.activities?.length
		? `${user.presence?.activities.join(", ")}\n`
		: "") + (user.presence?.activities.map((e) => e.state).length
		? `**State**\n${user?.presence?.activities.map((a) => a.state).join("\n")}\n`
		: "") + (user.presence.status !== "offline"
		? Object.entries(user.presence.clientStatus as {[s: string]:unknown} | ArrayLike<unknown>).join(", ")
		: "Offline");

	const uPActivities = user?.presence?.activities;

	presence.richPresence = [uPActivities.map((e) => e.assets?.largeImageURL({ size: 128 }))[0] ?? "", uPActivities.map((e) => e.details)[0] ?? "", uPActivities.map((e) => e.assets?.largeText)[0] ?? "", uPActivities.map((e) => e.assets?.smallText)[0] ?? ""] ?? [""];

	return presence;
}

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
        | "xml",
): Promise<string> {
	return `\`\`\`${language ?? ""}\n${code}\`\`\``;
}

export async function listenerLog(message: Message, listener: Listener,
	logger: (...msg: any[]) => void, command?: Command, extra = ""): Promise<void> {

	const date = new Date().toLocaleString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit", weekday: "short", year: "numeric", month: "numeric", day: "numeric" });

	logger(`${date} ${listener.id} | ${Date.now() - message.createdTimestamp}ms
${message.channel.type !== "dm"
		? `Guild: ${message.guild?.name} [${message.guild?.id}]\nChannel: #${message.channel.name} [${message.channel.id}]`
		: `DMChannel: [${message.author.dmChannel?.id}]`}
User: ${message.author.username} [${message.author.id}]
Executed ${command?.id} | "${message.content.substring(0, 100)}"\n${extra}`);
}