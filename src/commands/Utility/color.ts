import { ApplyOptions } from "@sapphire/decorators";
import { Args } from "@sapphire/framework";
import { sendPaginatedMessage } from "discord-js-button-pagination-ts";
import { AttachmentBuilder, EmbedBuilder, Message } from "discord.js";
import { imgFromColor } from "../../lib/Color";
import { KaikiCommandOptions } from "../../lib/Interfaces/Kaiki/KaikiCommandOptions";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";
import { ColorNames } from "../../lib/Types/KaikiColor";
import Utility from "../../lib/Utility";
import Constants from "../../struct/Constants";

@ApplyOptions<KaikiCommandOptions>({
    name: "color",
    aliases: ["clr"],
    description: "Returns a representation of a color string, or shows list of available color names to use.",
    usage: ["#ff00ff", "list"],
    typing: true,
    flags: ["list", "--list"],
    minorCategory: "Color",
})
export default class ColorCommand extends KaikiCommand {
    public async messageRun(message: Message, args: Args): Promise<Message> {

        const list = args.getFlags("list", "--list");

        if (list) {
            const colorList = Object.keys(Constants.hexColorTable),
                embedColor = Constants.hexColorTable[(colorList[Math.floor(Math.random() * colorList.length)]) as keyof ColorNames],
                pages: EmbedBuilder[] = [];

            for (let index = Number(Constants.MAGIC_NUMBERS.CMDS.UTILITY.COLOR.CLR_NAMES_PR_PAGE), p = 0;
                p < colorList.length;
                index += Constants.MAGIC_NUMBERS.CMDS.UTILITY.COLOR.CLR_NAMES_PR_PAGE, p += Constants.MAGIC_NUMBERS.CMDS.UTILITY.COLOR.CLR_NAMES_PR_PAGE) {

                pages.push(new EmbedBuilder({
                    title: "List of all available color names",
                    description: colorList.slice(p, index).join("\n"),
                    color: Number(embedColor),
                    footer: { text: `Try ${await this.client.fetchPrefix(message)}colorlist for a visual representation of the color list` },
                }));
            }

            return sendPaginatedMessage(message, pages, {});
        }

        const color = await args.rest("color");
        const hex = Utility.convertRGBToHex(color);
        const colorInt = parseInt(hex.replace("#", ""), 16);

        const colorString = `Hex: **${hex}** [${colorInt}]\nRed: **${color.r}**\nGreen: **${color.g}**\nBlue: **${color.b}**\n`;
        const attachment = new AttachmentBuilder(await imgFromColor(color), { name: "color.jpg" });
        const embed = new EmbedBuilder({
            description: colorString,
            color: colorInt,
            image: {
                url: "attachment://color.jpg",
            },
        });

        return message.channel.send({
            files: [attachment],
            embeds: [embed],
        });
    }
}
