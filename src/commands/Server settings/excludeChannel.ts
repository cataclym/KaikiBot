import { Channel, Guild, GuildChannel, Message, MessageEmbed, Snowflake, TextChannel } from "discord.js";
import { KaikiCommand } from "kaiki";
import { getGuildDocument } from "../../struct/documentMethods";
import { Argument } from "discord-akairo";

export default class ExcludeDadbotChannelCommand extends KaikiCommand {
    constructor() {
        super("excludechannel", {
            aliases: ["excludechannel", "excludechnl", "echnl"],
            userPermissions: "MANAGE_CHANNELS",
            channel: "guild",
            description: "Exclude or include a channel from dadbot. Provide no parameter to show a list of excluded channels. ",
            usage: ["", "#channel"],
            args: [
                {
                    id: "channels",
                    type: Argument.union("textChannels"),
                },
            ],
        });
    }

    public async exec(message: Message, { channels }: { channels: Map<Snowflake, TextChannel> | undefined }): Promise<Message> {

        const gId = (message.guild as Guild).id;
        const guildDb = await getGuildDocument(gId);
        const embed = new MessageEmbed()
            .setTitle("Excluded channels")
            .withOkColor(message);

        if (!channels) {
            return message.channel.send({
                embeds: [embed
                    .setDescription(Object.keys(guildDb.settings.dadBot.excludedChannels ?? {})
                        .map(k => message.guild!.channels.cache.get(k as Snowflake) ?? k)
                        .sort((a, b) => {
                            return (a as GuildChannel).name < (b as GuildChannel).name
                                ? -1
                                : 1;
                        })
                        .join("\n").trim() ?? "No channels excluded")
                    .withOkColor(message)],
            });
        }

        const excludedChannels: Channel[] = [], enabledChannels: Channel[] = [];

        for (const [id, channel] of channels) {

            const dadBot = guildDb.settings.dadBot;
            if (dadBot.excludedChannels[channel.id]) {
                delete guildDb.settings.dadBot.excludedChannels[channel.id];
                guildDb.markModified("settings.dadBot.excludedChannels");
                await message.client.guildProvider.set(gId, "DadBot", guildDb.settings.dadBot);
                await guildDb.save();

                enabledChannels.push(channel);
            }

            else {
                guildDb.settings.dadBot.excludedChannels[channel.id] = true;
                guildDb.markModified("settings.dadBot.excludedChannels");
                await message.client.guildProvider.set(gId, "DadBot", guildDb.settings.dadBot);
                await guildDb.save();

                excludedChannels.push(channel);
            }
        }

        if (excludedChannels.length) {
            embed.addField("Excluded", excludedChannels.join("\n"));
        }

        if (enabledChannels.length) {
            embed.addField("Unexcluded", enabledChannels.join("\n"));
        }

        return message.channel.send({
            embeds: [embed],
        });
    }
}
