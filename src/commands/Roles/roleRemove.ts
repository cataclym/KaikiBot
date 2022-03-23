import { GuildMember, Message, MessageEmbed, Role } from "discord.js";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";

import { rolePermissionCheck } from "../../lib/roles";
import KaikiEmbeds from "../../lib/KaikiEmbeds";

export default class RoleRemoveCommand extends KaikiCommand {
    constructor() {
        super("roleremove", {
            aliases: ["roleremove", "removerole", "rr"],
            description: "Takes away a user's role. The role you specify has to be lower in the role hierarchy than your highest role.",
            usage: "@Dreb Gamer",
            clientPermissions: "MANAGE_ROLES",
            userPermissions: "MANAGE_ROLES",
            channel: "guild",
            args: [
                {
                    id: "member",
                    type: "member",
                    otherwise: (m: Message) => ({
                        embeds: [new MessageEmbed({
                            description: "Can't find this user. Try again.",
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
            if (member.roles.cache.has(role.id)) {

                await member.roles.remove(role);

                return message.channel.send({
                    embeds: [new MessageEmbed({
                        title: "Success!",
                        description: `Removed ${role} from ${member.user}`,
                    })
                        .withOkColor(message)],
                });
            }

            else {
                return message.channel.send({
                    embeds: [new MessageEmbed({
                        title: "Error",
                        description: `${member} doesn't have ${role}`,
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
