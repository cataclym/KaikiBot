import { ApplyOptions } from "@sapphire/decorators";
import { Args } from "@sapphire/framework";
import { EmbedBuilder, Message, resolveColor } from "discord.js";
import KaikiCommandOptions from "../../lib/Interfaces/Kaiki/KaikiCommandOptions";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";

@ApplyOptions<KaikiCommandOptions>({
    name: "roleinfo",
    aliases: ["role", "rinfo"],
    description:
        "Shows info about a given role. If no role is supplied, it defaults to current one.",
    usage: ["@Gamers"],
    preconditions: ["GuildOnly"],
})
export default class RoleInfoCommand extends KaikiCommand {
    public async messageRun(
        message: Message<true>,
        args: Args
    ): Promise<Message> {
        if (!message.member) throw new Error();

        const role = args.finished
            ? message.member.roles.highest
            : await args.rest("role");

        return message.channel.send({
            embeds: [
                new EmbedBuilder({
                    title: `Info for ${role.name}`,
                    color: resolveColor(role.hexColor),
                    fields: [
                        { name: "ID", value: role.id, inline: true },
                        {
                            name: "Members",
                            value: String(role.members.size),
                            inline: true,
                        },
                        { name: "Color", value: role.hexColor, inline: true },
                        {
                            name: "Hoisted",
                            value: role.hoist ? "True" : "False",
                            inline: true,
                        },
                        {
                            name: "Mentionable",
                            value: role.mentionable ? "True" : "False",
                            inline: true,
                        },
                        {
                            name: "Position",
                            value: String(role.position),
                            inline: true,
                        },
                        {
                            name: "Created at",
                            value: role.createdAt.toDateString(),
                            inline: true,
                        },
                    ],
                }),
            ],
        });
    }
}
