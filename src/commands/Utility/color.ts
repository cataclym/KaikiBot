import { ApplyOptions } from "@sapphire/decorators";
import { Args } from "@sapphire/framework";
import { sendPaginatedMessage } from "discord-js-button-pagination-ts";
import { AttachmentBuilder, EmbedBuilder, Message } from "discord.js";
import { imgFromColor } from "../../lib/Color";
import KaikiCommandOptions from "../../lib/Interfaces/Kaiki/KaikiCommandOptions";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";
import KaikiUtil from "../../lib/KaikiUtil";
import { ColorNames } from "../../lib/Types/KaikiColor";
import Constants from "../../struct/Constants";

@ApplyOptions<KaikiCommandOptions>({
    name: "color",
    aliases: ["clr"],
    description:
		"Returns up to 10 representations the inputted color, or shows list of available color names to use.",
    usage: ["#ff00ff #dc143c", "--list"],
    typing: true,
    flags: ["list"],
    minorCategory: "Color",
})
export default class ColorCommand extends KaikiCommand {
    public async messageRun(message: Message, args: Args) {
        const list = args.getFlags("list");

        if (list) {
            const colorList = Object.keys(Constants.hexColorTable),
                embedColor =
					Constants.hexColorTable[
						colorList[
						    Math.floor(Math.random() * colorList.length)
						] as keyof ColorNames
					],
                pages: EmbedBuilder[] = [];

            for (
                let index = Number(
                        Constants.MAGIC_NUMBERS.CMDS.UTILITY.COLOR
                            .CLR_NAMES_PR_PAGE
                    ),
                    p = 0;
                p < colorList.length;
                index +=
					Constants.MAGIC_NUMBERS.CMDS.UTILITY.COLOR
					    .CLR_NAMES_PR_PAGE,
                p +=
						Constants.MAGIC_NUMBERS.CMDS.UTILITY.COLOR
						    .CLR_NAMES_PR_PAGE
            ) {
                pages.push(
                    new EmbedBuilder({
                        title: "List of all available color names",
                        description: colorList.slice(p, index).join("\n"),
                        color: Number(embedColor),
                        footer: {
                            text: `Try ${await this.client.fetchPrefix(message)}colorlist for a visual representation of the color list`,
                        },
                    })
                );
            }

            return sendPaginatedMessage(message, pages, {});
        }

        const colorArray = await args.repeat("kaikiColor", { times: 10 });

        const attachments: AttachmentBuilder[] = [];
        const embeds = colorArray.map(async (color) => {
            const random = Math.round(Math.random() * Date.now());
            const hex = KaikiUtil.convertRGBToHex(color);
            const colorInteger = parseInt(hex.replace("#", ""), 16);
            const colorString = `Hex: **${hex}** [${colorInteger}]\nRed: **${color.r}**\nGreen: **${color.g}**\nBlue: **${color.b}**\n`;
            attachments.push(
                new AttachmentBuilder(await imgFromColor(color), {
                    name: `${random}color.jpg`,
                })
            );

            return new EmbedBuilder({
                description: colorString,
                color: colorInteger,
                image: {
                    url: `attachment://${random}color.jpg`,
                },
            });
        });

        return message.reply({
            files: attachments,
            embeds: await Promise.all(embeds),
        });
    }
}
