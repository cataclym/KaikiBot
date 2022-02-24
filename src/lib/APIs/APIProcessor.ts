import fetch from "node-fetch";
import { ColorResolvable, GuildMember, Message, MessageEmbed } from "discord.js";
import { endpointData } from "Interfaces/IAPIData";
import KaikiUtil from "Kaiki/KaikiUtil";

export async function processAPIRequest(message: Message, site: string, data: endpointData, jsonProperty: string, mention?: GuildMember | null) {

    const { action, color, append, appendable } = data;
    const result = (await KaikiUtil.handleToJSON(await (await fetch(site)).json()))[jsonProperty];
    const embed = new MessageEmbed({
        color: color as ColorResolvable,
        image: { url: result },
        footer: { icon_url: (mention?.user || message.author).displayAvatarURL({ dynamic: true }) },
    });

    if (mention && action) {
        embed.setDescription(`${message.author.username} ${action} ${mention.user.username} ${append ?? ""}`);
    }

    else if (action && appendable) {
        embed.setDescription(`${message.author.username} ${action} ${append ?? ""}`);
    }

    return embed;
}
