import { EmojiResolvable } from "discord.js";
import { Message } from "discord.js";
import { MessageEmbed } from "discord.js";

declare module "discord.js-pagination" {
    function paginationEmbed(msg: Message, pages: MessageEmbed[], emojilist: EmojiResolvable[], timeout: number): Message;  
}