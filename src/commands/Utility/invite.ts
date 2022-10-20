import { EmbedBuilder, Message } from "discord.js";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";


export default class InviteCommand extends KaikiCommand {
    constructor() {
        super("invite", {
            aliases: ["invite", "inv"],
            description: "Get a link to invite the bot to your server.",
            usage: "",
        });
    }

    public async exec(message: Message): Promise<Message> {
        return message.channel.send({
            embeds: [
                new EmbedBuilder({
                    title: "Invite link",
                    description: `[Link](https://discord.com/oauth2/authorize?client_id=${this.client.user?.id}&scope=bot)`,
                    image: { url: this.client.user?.displayAvatarURL({ size: 128 }) },
                })
                    .withOkColor(message),
            ],
        });
    }
}
