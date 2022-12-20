import { ColorResolvable } from "discord.js";

export default interface InteractionsImageData {
    action: string | boolean,
    color: ColorResolvable | string,
    append?: string,
    appendable?: true
}
