import { GuildMember, Message, MessageEmbed, Permissions, Role } from "discord.js";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";
import KaikiEmbeds from "../../lib/KaikiEmbeds";
import { rolePermissionCheck } from "../../lib/roles";

export default class RoleAssignCommand extends KaikiCommand {
    constructor() {
        super("setrole", {
            aliases: ["setrole", "sr"],
            description: "Gives a role to a user. The role you specify has to be lower in the role hierarchy than your highest role.",
            usage: "@Dreb Gamer",
            clientPermissions: Permissions.FLAGS.MANAGE_ROLES,
            userPermissions: Permissions.FLAGS.MANAGE_ROLES,
            channel: "guild",
            args: [
                {
                    id: "member",
                    type: "member",
                    otherwise: (m: Message) => ({
                        embeds: [new MessageEmbed({
                            title: "Can't find this user. Try again.",
                        })
                            .withErrorColor(m)],
                    }),
                },
                {
                    id: "role",
                    type: "role",
                    otherwise: (m: Message) => ({ embeds: [KaikiEmbeds.roleArgumentError(m)] }),
                },
            ],
        });
    }

    public async exec(message: Message<true>, { member, role }: { member: GuildMember, role: Role }): Promise<Message> {

        if (await rolePermissionCheck(message, role)) {
            if (!member.roles.cache.has(role.id)) {

                await member.roles.add(role);

                return message.channel.send({
                    embeds: [new MessageEmbed({
                        title: "Success!",
                        description: `Added ${role} to ${member.user}`,
                    })
                        .withOkColor(message)],
                });
            }
            else {
                return message.channel.send({
                    embeds: [new MessageEmbed({
                        title: "Error",
                        description: `${member} already has ${role}`,
                    })
                        .withErrorColor(message)],
                });
            }
        }
        else {
            return message.channel.send({
                embeds: [await KaikiEmbeds.errorMessage(message, "**Insufficient permissions**\nRole is above you or me in the role hierarchy.")],
            });
        }
    }
}
