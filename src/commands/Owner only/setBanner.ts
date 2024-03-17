import { ApplyOptions } from "@sapphire/decorators";
import { Args } from "@sapphire/framework";
import { AttachmentBuilder, EmbedBuilder, Message, REST, Routes } from "discord.js";
import { KaikiCommandOptions } from "../../lib/Interfaces/Kaiki/KaikiCommandOptions";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";
import KaikiUtil from "../../lib/KaikiUtil";

@ApplyOptions<KaikiCommandOptions>({
    name: "setbanner",
    aliases: ["setbanner"],
    description: "Assigns the bot a new banner.",
    usage: [
        "https://discord.com/media/1231231231231312321/1231231312323132.png",
    ],
    preconditions: ["OwnerOnly"],
})
export default class SetAvatarCommand extends KaikiCommand {
    public async messageRun(message: Message, args: Args): Promise<Message> {
        const url = await args.rest("url");

        const img = await KaikiUtil.loadImage(url.href);

        const imgBuffer = Buffer.from(img);

        const rest = new REST({version: "9"}).setToken(this.client.token);

        await rest.patch(Routes.user(), { body: { banner: `data:image/gif;base64,${imgBuffer.toString("base64")}` } })

        const attachment = new AttachmentBuilder(imgBuffer, { name: `bannerFile` })

        return message.channel.send({
            content: "New banner set.",
            embeds: [new EmbedBuilder()
                .setImage(`attachment://${attachment.name}`)
                .withOkColor(message)],
            files: [attachment],
        });
    }
}
