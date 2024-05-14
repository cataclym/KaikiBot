import { ApplyOptions } from "@sapphire/decorators";
import { Args } from "@sapphire/framework";
import { EmbedBuilder, Message } from "discord.js";
import KaikiCommandOptions from "../../lib/Interfaces/Kaiki/KaikiCommandOptions";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";

@ApplyOptions<KaikiCommandOptions>({
    name: "welcometoggle",
    aliases: ["welcome"],
    description:
        "Toggles welcome messages. Bot defaults to current channel if no channel is provided.",
    usage: ["", "#welcome-channel"],
    requiredUserPermissions: ["ManageGuild"],
    preconditions: ["GuildOnly"],
    minorCategory: "Welcome",
})
export default class WelcomeToggleCommand extends KaikiCommand {
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
            guildTable.WelcomeChannel === undefined ||
            guildTable.WelcomeChannel === null
        ) {
            await this.client.orm.guilds.update({
                where: {
                    Id: BigInt(message.guildId),
                },
                data: {
                    WelcomeChannel: bigIntChannelId,
                },
            });
            embed.setDescription(`Enabled welcome message in ${channel.name}`);
        } else if (guildTable.WelcomeChannel === bigIntChannelId) {
            await this.client.orm.guilds.update({
                where: {
                    Id: BigInt(message.guildId),
                },
                data: {
                    WelcomeChannel: null,
                },
            });
            embed.setDescription("Disabled welcome message");
        } else {
            await this.client.orm.guilds.update({
                where: {
                    Id: BigInt(message.guildId),
                },
                data: {
                    WelcomeChannel: bigIntChannelId,
                },
            });
            embed.setDescription(`Set welcome message to ${channel.name}`);
        }

        return message.channel.send({
            embeds: [embed],
        });
    }
}
