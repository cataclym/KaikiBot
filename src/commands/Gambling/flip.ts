import { ApplyOptions } from "@sapphire/decorators";
import KaikiCommandOptions from "../../lib/Interfaces/Kaiki/KaikiCommandOptions";
import { AttachmentBuilder, EmbedBuilder, Message } from "discord.js";
import images from "../../data/images.json";
import { Args, UserError } from "@sapphire/framework";
import sharp from "sharp";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";

@ApplyOptions<KaikiCommandOptions>({
    name: "flip",
    aliases: [""],
    usage: ["", "5"],
    description: "Flip one or multiple coins. Up to 10.",
})
export default class FlipCommand extends KaikiCommand {
    static imageBuffers: [ArrayBuffer, ArrayBuffer];

    async messageRun(message: Message, args: Args) {
        const flipTimes = await args
            .pick("integer", { maximum: 10, minimum: 1 })
            .catch(() => {
                if (args.finished) return 1;
                throw new UserError({
                    identifier: "FlipsOutOfRange",
                    message: "Please specify a number from 1 to 10",
                });
            });

        const height = 256;
        const width = height * flipTimes;

        const [heads, tails] = await FlipCommand.fetchImages();

        const flips: sharp.OverlayOptions[] = [];
        for (let i = flipTimes; i >= 0; i--) {
            // Either zero or one
            flips.push({
                input: Buffer.from(Math.round(Math.random()) ? heads : tails),
                top: 0,
                left: 256 * i,
            });
        }

        const image = await sharp({
            create: {
                width,
                height,
                channels: 4,
                background: { r: 0, g: 0, b: 0, alpha: 0 },
            },
        })
            .composite(flips)
            .webp()
            .toBuffer();

        const attachment = new AttachmentBuilder(image, { name: "flips.jpg" });

        return message.channel.send({
            files: [attachment],
            embeds: [
                new EmbedBuilder()
                    .setImage(`attachment://${attachment.name}`)
                    .withOkColor(message),
            ],
        });
    }

    private static async fetchImages() {
        if (this.imageBuffers) {
            return this.imageBuffers;
        }

        const fetches = await Promise.all([
            fetch(images.gambling.coin.heads),
            fetch(images.gambling.coin.tails),
        ]);

        this.imageBuffers = await Promise.all([
            fetches[0].arrayBuffer(),
            fetches[1].arrayBuffer(),
        ]);

        return this.imageBuffers;
    }
}
