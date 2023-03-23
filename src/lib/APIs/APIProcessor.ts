import { EmbedBuilder, GuildMember, Message } from "discord.js";
import fetch, { RequestInfo } from "node-fetch";
import InteractionsImageData from "../Interfaces/Common/InteractionsImageData";
import KaikiUtil from "../Kaiki/KaikiUtil";

export default class APIProcessor {
    static async processImageAPIRequest(message: Message,
        site: string,
        data: InteractionsImageData,
        jsonProperty: string | string[],
        mention?: GuildMember | null) {

        const { color } = data;

        const image = await APIProcessor.processJSONIndexing(site, jsonProperty);

        const embed = new EmbedBuilder({
            image: { url: image },
            footer: { icon_url: message.author.displayAvatarURL(), text: message.author.tag },
        })
            .setColor(color);

        if (mention && data.action) {
            embed.setDescription(`${message.author.username} ${data.action} ${mention.user.username} ${data.append ?? ""}`);
        }

        else if (data.action && data.appendable) {
            embed.setDescription(`${message.author.username} ${data.action} ${data.append ?? ""}`);
        }

        return embed;
    }

    private static async processJSONIndexing(site: RequestInfo, jsonProperty: string | string[]): Promise<string> {
        const result = (await KaikiUtil.handleToJSON(await (await fetch(site)).json()));

        if (Array.isArray(jsonProperty)) {
            let image: any;
            jsonProperty.forEach(index => image = (image || result)[index]);

            return image;
        }

        else {
            return result[jsonProperty];
        }
    }
}
