import { EmbedBuilder, GuildMember, Message } from "discord.js";
import fetch from "node-fetch";
import InteractionsImageData from "../Interfaces/InteractionsImageData";
import KaikiUtil from "../Kaiki/KaikiUtil";

export async function processAPIRequest(message: Message, site: string, data: InteractionsImageData, jsonProperty: string, mention?: GuildMember | null) {

    const { action, color, append, appendable } = data;
    const result = (await KaikiUtil.handleToJSON(await (await fetch(site)).json()))[jsonProperty];
    const embed = new EmbedBuilder({
        image: { url: result },
        footer: { icon_url: (mention?.user || message.author).displayAvatarURL(), text: message.author.tag },
    })
        .setColor(color);

    if (mention && action) {
        embed.setDescription(`${message.author.username} ${action} ${mention.user.username} ${append ?? ""}`);
    }

    else if (action && appendable) {
        embed.setDescription(`${message.author.username} ${action} ${append ?? ""}`);
    }

    return embed;
}
