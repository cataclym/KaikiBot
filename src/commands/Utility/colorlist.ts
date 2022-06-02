import { sendPaginatedMessage } from "discord-js-button-pagination-ts";
import { ColorResolvable, Message, MessageAttachment, MessageEmbed, MessageOptions } from "discord.js";
import { colorTable, hexColorTable, imgFromColor } from "../../lib/Color";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";
import Utility from "../../lib/Utility";


export default class ColorListCommand extends KaikiCommand {
    constructor() {
        super("colorlist", {
            aliases: ["colorlist"],
            description: "Shows a list of all supported color names for the bot",
            typing: true,
            usage: "",
            subCategory: "Color",
        });
    }

    public async exec(message: Message) {

        let embeds: MessageEmbed[] = [];
        let attachments: MessageAttachment[] = [];
        const messageOptions: MessageOptions[] = [];

        for (const color in colorTable) {
            const random = `${Math.random()}`;
            embeds.push(new MessageEmbed()
                .addField(color, `${hexColorTable[color]}\n${colorTable[color]}`)
                .setImage(`attachment://color${random}.png`)
                .setColor(hexColorTable[color] as ColorResolvable),
            );

            attachments.push(new MessageAttachment(await imgFromColor(Utility.HEXtoRGB(String(hexColorTable[color]))!), `color${random}.png`));

            if (embeds.length === 5) {
                messageOptions.push({
                    embeds: embeds,
                    files: attachments,
                });
                embeds = [];
                attachments = [];
            }
        }

        return sendPaginatedMessage(message, messageOptions, {});
    }
}
