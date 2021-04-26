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

	presence.richPresence = [uPActivities.map((e) => e.assets?.largeImageURL({ size: 128 }))[0] ?? "", uPActivities.map((e) => e.details)[0] ?? "", uPActivities.map((e) => e.assets?.largeText)[0] ?? "", uPActivities.map((e) => e.assets?.smallText)[0] ?? ""] ?? "";

	return presence;
}

export const flags: {[index in UserFlagsString]: string} = {
	DISCORD_EMPLOYEE: "Discord Employee 👨‍💼",
	DISCORD_PARTNER: "Discord Partner ❤️",
	BUGHUNTER_LEVEL_1: "Bug Hunter (Level 1) 🐛",
	BUGHUNTER_LEVEL_2: "Bug Hunter (Level 2) 🐛",
	HYPESQUAD_EVENTS: "HypeSquad Events 🎊",
	HOUSE_BRAVERY: "House of Bravery 🏠",
	HOUSE_BRILLIANCE: "House of Brilliance 🏠",
	HOUSE_BALANCE: "House of Balance 🏠",
	EARLY_SUPPORTER: "Early Supporter 👍",
	TEAM_USER: "Team User 🏁",
	SYSTEM: "System ⚙️",
	VERIFIED_BOT: "Verified Bot ☑️",
	VERIFIED_DEVELOPER: "Verified Developer ✅",
	PARTNERED_SERVER_OWNER : "Partnered Server Owner ♾️",
	EARLY_VERIFIED_DEVELOPER: "Early Verified Developer ✅",
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