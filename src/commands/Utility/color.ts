import { PrefixSupplier } from "discord-akairo";
import { sendPaginatedMessage } from "discord-js-button-pagination-ts";
import { ColorResolvable, Message, MessageAttachment, EmbedBuilder, Util } from "discord.js";
import { hexColorTable, imgFromColor } from "../../lib/Color";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";
import { TKaikiColor } from "../../lib/Types/TColor";
import Utility from "../../lib/Utility";

export default class ColorCommand extends KaikiCommand {
    constructor() {
        super("color", {
            aliases: ["color", "clr"],
            description: "Returns a representation of a color string, or shows list of available color names to use.",
            usage: ["#ff00ff", "list"],
            typing: true,
            args: [
                {
                    id: "list",
                    flag: "list",
                    match: "flag",
                },
                {
                    id: "color",
                    match: "rest",
                    type: "kaiki_color",
                    default: null,
                },
            ],
            subCategory: "Color",
        });
    }

    public async exec(message: Message, { color, list }: { color: TKaikiColor, list: boolean }): Promise<Message> {

        if (list) {
            const colorList = Object.keys(hexColorTable),
                embedColor = hexColorTable[(colorList[Math.floor(Math.random() * colorList.length)])],
                pages: EmbedBuilder[] = [];

            for (let index = 15, p = 0; p < colorList.length; index = index + 15, p = p + 15) {
                pages.push(new EmbedBuilder({
                    title: "List of all available color names",
                    description: colorList.slice(p, index).join("\n"),
                    color: embedColor as ColorResolvable,
                    footer: { text: `Try ${(this.handler.prefix as PrefixSupplier)(message)}colorlist for a visual representation of the color list` },
                }));
            }

            return sendPaginatedMessage(message, pages, {});
        }

        if (color === null) {
            return message.channel.send({
                embeds: [new EmbedBuilder()
                    .setTitle("Please provide a valid hex-color or color name")
                    .withErrorColor(message)],
            });
        }
        const colorInt = Util.resolveColor([color.r!, color.g!, color.b!]);
        const colorString = `Hex: **${Utility.RGBtoHEX(color)}** [${colorInt}]\nRed: **${color.r}**\nGreen: **${color.g}**\nBlue: **${color.b}**\n`;
        const attachment = new MessageAttachment(await imgFromColor(color), "color.jpg");
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
