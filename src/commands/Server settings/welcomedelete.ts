import { Message, EmbedBuilder, Permissions } from "discord.js";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";

import KaikiEmbeds from "../../lib/KaikiEmbeds";

export default class WelcomeDeleteCommand extends KaikiCommand {
    constructor() {
        super("welcomedelete", {
            aliases: ["welcomedelete", "welcomedel"],
            userPermissions: Permissions.FLAGS.MANAGE_GUILD,
            channel: "guild",
            description: "Set the time it takes for welcome messages to be deleted by the bot",
            usage: ["10"],
            args: [{
                id: "time",
                type: "number",
                otherwise: (m) => ({ embeds: [KaikiEmbeds.genericArgumentError(m)] }),
            }],
            subCategory: "Welcome",
        });
    }

    public async exec(message: Message<true>, { time }: { time: number | null }): Promise<Message> {

        await this.client.orm.guilds.update({
            where: {
                Id: BigInt(message.guildId),
            },
            data: {
                WelcomeTimeout: time,
            },
        });

        return message.channel.send({
            embeds: [new EmbedBuilder()
                .setDescription(`Welcome messages will be deleted after ${time} seconds.`)
                .withOkColor(message)],
        });
    }
}
