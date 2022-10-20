import { Argument } from "discord-akairo";
import { EmbedBuilder, Message, resolveColor, Role } from "discord.js";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";
import KaikiEmbeds from "../../lib/KaikiEmbeds";


export default class RoleInfoCommand extends KaikiCommand {
    constructor() {
        super("roleinfo", {
            aliases: ["roleinfo", "role", "rinfo"],
            description: "Shows info about a given role. If no role is supplied, it defaults to current one.",
            usage: "@Gamers",
            channel: "guild",
            args: [
                {
                    id: "role",
                    type: Argument.union("role", (m, p) => p?.length
                        ? undefined
                        : m.member?.roles.highest),
                    match: "content",
                    otherwise: (m) => ({ embeds: [KaikiEmbeds.roleArgumentError(m)] }),
                },
            ],
        });
    }

    public async exec(message: Message, { role }: { role: Role }): Promise<Message> {
        return message.channel.send({
            embeds: [
                new EmbedBuilder({
                    title: `Info for ${role.name}`,
                    color: resolveColor(role.hexColor),
                    fields: [
                        { name: "ID", value: role.id, inline: true },
                        { name: "Members", value: String(role.members.size), inline: true },
                        { name: "Color", value: role.hexColor, inline: true },
                        { name: "Hoisted", value: role.hoist ? "True" : "False", inline: true },
                        { name: "Mentionable", value: role.mentionable ? "True" : "False", inline: true },
                        { name: "Position", value: String(role.position), inline: true },
                        { name: "Created at", value: role.createdAt.toDateString(), inline: true },
                    ],
                }),
            ],
        });
    }
}
