import { ApplyOptions } from "@sapphire/decorators";
import { EmbedBuilder, Message } from "discord.js";
import { KaikiCommandOptions } from "../../lib/Interfaces/Kaiki/KaikiCommandOptions";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";

@ApplyOptions<KaikiCommandOptions>({
    name: "invite",
    aliases: ["inv"],
    description: "Get a link to invite the bot to your server.",
})
export default class InviteCommand extends KaikiCommand {
    public async messageRun(message: Message): Promise<Message> {
        return message.channel.send({
            embeds: [
                new EmbedBuilder({
                    title: "Invite me to your server",
                    description: `[Link](https://discord.com/oauth2/authorize?client_id=${this.client.user?.id}&scope=bot)`,
                    image: {
                        url: this.client.user?.displayAvatarURL({ size: 128 }),
                    },
                }).withOkColor(message),
            ],
        });
    }
}
