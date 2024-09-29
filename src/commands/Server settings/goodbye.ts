import { ApplyOptions } from "@sapphire/decorators";
import { Args } from "@sapphire/framework";
import { EmbedBuilder, Message } from "discord.js";
import KaikiCommandOptions from "../../lib/Interfaces/Kaiki/KaikiCommandOptions";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";

@ApplyOptions<KaikiCommandOptions>({
    name: "goodbye",
    aliases: ["goodbyetoggle", "byetoggle", "bye"],
    description:
		"Toggles leave messages. Bot defaults to current channel if no channel is provided.",
    usage: ["", "#leave-channel"],
    requiredUserPermissions: ["ManageGuild"],
    preconditions: ["GuildOnly"],
    minorCategory: "Goodbye",
})
export default class GoodbyeConfigCommand extends KaikiCommand {
    public async messageRun(
        message: Message<true>,
        args: Args
    ): Promise<Message> {
        const channel = await args
            .rest("guildTextChannel")
            .catch(() => message.channel);

        const embed = new EmbedBuilder().withOkColor(message);

        const guildTable = await this.client.db.getOrCreateGuild(
            BigInt(message.guildId)
        );

        const bigIntChannelId = BigInt(channel.id);

        if (
            guildTable.ByeChannel === undefined ||
			guildTable.ByeChannel === null
        ) {
            await this.client.orm.guilds.update({
                where: {
                    Id: BigInt(message.guildId),
                },
                data: {
                    ByeChannel: bigIntChannelId,
                },
            });
            embed.setDescription(`Enabled goodbye message in ${channel.name}`);
        } else if (guildTable.ByeChannel === bigIntChannelId) {
            await this.client.orm.guilds.update({
                where: {
                    Id: BigInt(message.guildId),
                },
                data: {
                    ByeChannel: null,
                },
            });
            embed.setDescription("Disabled goodbye message");
        } else {
            await this.client.orm.guilds.update({
                where: {
                    Id: BigInt(message.guildId),
                },
                data: {
                    ByeChannel: bigIntChannelId,
                },
            });
            embed.setDescription(`Set goodbye message to ${channel.name}`);
        }

        return message.reply({
            embeds: [embed],
        });
    }
}
