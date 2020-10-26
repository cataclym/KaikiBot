import { Message, ColorResolvable } from "discord.js";

export async function getMemberColorAsync(message: Message): Promise<ColorResolvable> {
	return <ColorResolvable> message?.member?.displayColor || "#f47fff";
}
export const errorColor: ColorResolvable = "#ee281f";