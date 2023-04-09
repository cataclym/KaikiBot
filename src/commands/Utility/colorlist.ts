import { ApplyOptions } from "@sapphire/decorators";
import { sendPaginatedMessage } from "discord-js-button-pagination-ts";
import { AttachmentBuilder, ColorResolvable, EmbedBuilder, Message, MessageCreateOptions } from "discord.js";
import { colorTable, hexColorTable, imgFromColor } from "../../lib/Color";
import { KaikiCommandOptions } from "../../lib/Interfaces/Kaiki/KaikiCommandOptions";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";
import KaikiUtil from "../../lib/Kaiki/KaikiUtil";
import Utility from "../../lib/Utility";

@ApplyOptions<KaikiCommandOptions>({
    name: "colorlist",
    aliases: ["colors", "clrs"],
    description: "Shows a list of all supported color names for the bot",
    typing: true,
})
export default class ColorListCommand extends KaikiCommand {
    public async messageRun(message: Message) {

        let embeds: EmbedBuilder[] = [];
        let attachments: AttachmentBuilder[] = [];
        const messageOptions: MessageCreateOptions[] = [];

        for (const color in colorTable) {
            const random = `${Math.random()}`;

            if (!KaikiUtil.hasKey(hexColorTable, color)) return;

            const clr = Utility.HEXtoRGB(String(hexColorTable[color]));

            embeds.push(new EmbedBuilder()
                .addFields([
                    {
                        name: color,
                        value: `${hexColorTable[color]}\n${colorTable[color]}`,
                    },
                ])
                .setImage(`attachment://color${random}.png`)
                .setColor(hexColorTable[color] as ColorResolvable),
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
