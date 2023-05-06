import { ApplyOptions } from "@sapphire/decorators";
import { sendPaginatedMessage } from "discord-js-button-pagination-ts";
import { AttachmentBuilder, ColorResolvable, EmbedBuilder, Message, MessageCreateOptions } from "discord.js";
import { imgFromColor } from "../../lib/Color";
import { KaikiCommandOptions } from "../../lib/Interfaces/Kaiki/KaikiCommandOptions";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";
import KaikiUtil from "../../lib/Kaiki/KaikiUtil";
import Utility from "../../lib/Utility";
import Constants from "../../struct/Constants";

@ApplyOptions<KaikiCommandOptions>({
    name: "colorlist",
    aliases: ["colors", "clrs"],
    description: "Shows a list of all supported color names for the bot",
    typing: true,
    minorCategory: "Color",
})
export default class ColorListCommand extends KaikiCommand {
    public async messageRun(message: Message) {

        let embeds: EmbedBuilder[] = [];
        let attachments: AttachmentBuilder[] = [];
        const messageOptions: MessageCreateOptions[] = [];

        for (const color in Constants.colorTable) {
            const random = `${Math.random()}`;

            if (!KaikiUtil.hasKey(Constants.hexColorTable, color)) return;

            const clr = Utility.convertHexToRGB(String(Constants.hexColorTable[color]));

            embeds.push(new EmbedBuilder()
                .addFields([
                    {
                        name: color,
                        value: `${Constants.hexColorTable[color]}\n${Constants.colorTable[color]}`,
                    },
                ])
                .setImage(`attachment://color${random}.png`)
                .setColor(Constants.hexColorTable[color] as ColorResolvable),
            );

            attachments.push(new AttachmentBuilder(await imgFromColor(clr), { name: `color${random}.png` }));

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
