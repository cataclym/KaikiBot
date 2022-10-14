import { ColorResolvable, GuildMember, Message, EmbedBuilder } from "discord.js";
import fetch from "node-fetch";
import { endpointData } from "../Interfaces/IAPIData";
import KaikiUtil from "../Kaiki/KaikiUtil";

export async function processAPIRequest(message: Message, site: string, data: endpointData, jsonProperty: string, mention?: GuildMember | null) {

    const { action, color, append, appendable } = data;
    const result = (await KaikiUtil.handleToJSON(await (await fetch(site)).json()))[jsonProperty];
    const embed = new EmbedBuilder({
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
