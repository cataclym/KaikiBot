import { ColorResolvable } from "discord.js";

export interface EndpointData {
    action: string | boolean,
    color: ColorResolvable | string,
    append?: string,
    appendable?: true
}
