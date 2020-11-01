import { Message, ColorResolvable, UserFlagsString, User } from "discord.js";

export async function getMemberColorAsync(message: Message): Promise<ColorResolvable> {
	return <ColorResolvable> message?.member?.displayColor || "#f47fff";
}
export const errorColor: ColorResolvable = "#ee281f";
export const standardColor: ColorResolvable = "#32CD32";

// This section is awful
export async function getUserPresenceAsync(user: User): Promise<{ main: string; richPresence: (string | null | undefined)[]; }> {
	const presence = { main: "", richPresence: ["" as string | null | undefined] };

	presence.main =
	(user.presence?.activities?.length ?
		`${user.presence?.activities.join(", ")}\n` : "") +
	(user.presence?.activities.map((e) => e.state).length ?
		`**State**\n${user?.presence?.activities.map((a) => a.state).join("\n")}\n` : "") +
	(user.presence.status !== "offline" ?
		Object.entries(user.presence.clientStatus as { [s: string]: unknown; } | ArrayLike<unknown>).join(", ") : "Offline");

	const uPActivities = user?.presence?.activities;

	presence.richPresence = [uPActivities.map((e) => e.assets?.largeImageURL({ size: 128 }))[0], uPActivities.map((e) => e.details)[0], uPActivities.map((e) => e.assets?.largeText)[0], uPActivities.map((e) => e.assets?.smallText)[0] ];

	return presence;
}

export const flags: Record<UserFlagsString, string> = {
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