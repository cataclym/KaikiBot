import { User } from "discord.js";
import { Message, ColorResolvable } from "discord.js";

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