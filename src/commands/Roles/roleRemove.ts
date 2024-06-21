import { ApplyOptions } from "@sapphire/decorators";
import { Args } from "@sapphire/framework";
import { EmbedBuilder, Message } from "discord.js";
import KaikiCommandOptions from "../../lib/Interfaces/Kaiki/KaikiCommandOptions";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";
import KaikiEmbeds from "../../lib/Kaiki/KaikiEmbeds";
import Roles from "../../lib/Roles";

@ApplyOptions<KaikiCommandOptions>({
    name: "roleremove",
    aliases: ["removerole", "rr"],
    description:
		"Takes away a user's role. The role you specify has to be lower in the role hierarchy than your highest role.",
    usage: ["@Dreb Gamer"],
    requiredUserPermissions: ["ManageRoles"],
    requiredClientPermissions: ["ManageRoles"],
    preconditions: ["GuildOnly"],
})
export default class RoleRemoveCommand extends KaikiCommand {
    public async messageRun(
        message: Message<true>,
        args: Args
    ): Promise<Message> {
        const member = await args.pick("member");
        const role = await args.rest("role");

        if (await Roles.rolePermissionCheck(message, role)) {
            if (member.roles.cache.has(role.id)) {
                await member.roles.remove(role);

                return message.channel.send({
                    embeds: [
                        new EmbedBuilder({
                            title: "Success!",
                            description: `Removed ${role} from ${member.user}`,
                        }).withOkColor(message),
                    ],
                });
            } else {
                return message.channel.send({
                    embeds: [
                        new EmbedBuilder({
                            title: "Error",
                            description: `${member} doesn't have ${role}`,
                        }).withErrorColor(message),
                    ],
                });
            }
        } else {
            return message.channel.send({
                embeds: [
                    await KaikiEmbeds.errorMessage(
                        message,
                        "**Insufficient permissions**\nRole is above you or me in the role hierarchy."
                    ),
                ],
            });
        }
    }
}
