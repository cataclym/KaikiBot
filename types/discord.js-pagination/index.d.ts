declare module "discord.js-pagination" {

    import { EmojiResolvable, Message, MessageEmbed } from "discord.js";

    export function paginationEmbed(msg: Message, pages: MessageEmbed[], emojilist?: EmojiResolvable[], timeout?: number): Message;  
}