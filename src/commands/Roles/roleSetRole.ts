import { ApplyOptions } from "@sapphire/decorators";
import { Args } from "@sapphire/framework";
import { EmbedBuilder, Message } from "discord.js";
import { KaikiCommandOptions } from "../../lib/Interfaces/Kaiki/KaikiCommandOptions";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";
import KaikiEmbeds from "../../lib/KaikiEmbeds";
import { rolePermissionCheck } from "../../lib/Roles";

@ApplyOptions<KaikiCommandOptions>({
    name: "setrole",
    aliases: ["sr"],
    description: "Gives a role to a user. The role you specify has to be lower in the role hierarchy than your highest role.",
    usage: ["@Dreb Gamer"],
    requiredUserPermissions: ["ManageRoles"],
    requiredClientPermissions: ["ManageRoles"],
    preconditions: ["GuildOnly"],
})
export default class RoleAssignCommand extends KaikiCommand {
    public async messageRun(message: Message<true>, args: Args): Promise<Message> {

        const member = await args.pick("member");
        const role = await args.rest("role");

        if (await rolePermissionCheck(message, role)) {
            if (!member.roles.cache.has(role.id)) {

                await member.roles.add(role);

                return message.channel.send({
                    embeds: [
                        new EmbedBuilder({
                            title: "Success!",
                            description: `Added ${role} to ${member.user}`,
                        })
                            .withOkColor(message),
                    ],
                });
            }
            else {
                return message.channel.send({
                    embeds: [
                        new EmbedBuilder({
                            title: "Error",
                            description: `${member} already has ${role}`,
                        })
                            .withErrorColor(message),
                    ],
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
