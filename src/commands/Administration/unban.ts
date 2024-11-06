import { ApplyOptions } from "@sapphire/decorators";
import { Args } from "@sapphire/framework";
import { EmbedBuilder, Message } from "discord.js";
import KaikiCommandOptions from "../../lib/Interfaces/Kaiki/KaikiCommandOptions";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";

@ApplyOptions<KaikiCommandOptions>({
    name: "unban",
    aliases: ["ub"],
    description: "Unbans a given user by ID",
    usage: "103020509395056",
    requiredUserPermissions: ["BanMembers"],
    requiredClientPermissions: ["BanMembers"],
    preconditions: ["GuildOnly"],
})
export default class UnbanCommand extends KaikiCommand {
    public async messageRun(message: Message, args: Args): Promise<Message> {
        const user = await args.pick("user");

        const bans = message.guild?.bans.cache.size
            ? message.guild?.bans.cache
            : await message.guild?.bans.fetch({ cache: true });

        if (bans?.find((u) => u.user.id === user.id)) {
            await message.guild?.members.unban(user);
            return message.reply({
                embeds: [
                    new EmbedBuilder({
                        description: `Unbanned ${user.username}.`,
                    }).withOkColor(message),
                ],
            });
        } else {
            return message.reply({
                embeds: [
                    new EmbedBuilder({
                        description: `\`${user.username}\` is not banned.`,
                    }).withErrorColor(message),
                ],
            });
        }
    }
}
