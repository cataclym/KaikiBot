import { ColorResolvable } from "discord.js";

export interface endpointData {
	action: string | boolean,
	color: ColorResolvable | string,
	append?: string,
	appendable?: true
}