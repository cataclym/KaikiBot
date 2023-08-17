import { ApplyOptions } from "@sapphire/decorators";
import { Args } from "@sapphire/framework";
import { EmbedBuilder, Message } from "discord.js";
import { KaikiCommandOptions } from "../../lib/Interfaces/Kaiki/KaikiCommandOptions";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";
import KaikiEmbeds from "../../lib/Kaiki/KaikiEmbeds";
import Roles from "../../lib/Roles";

@ApplyOptions<KaikiCommandOptions>({
    name: "rolehoist",
    aliases: ["hoistrole", "hoist"],
    description: "Hoists or unhoists a role",
    usage: ["@gamers"],
    requiredUserPermissions: ["ManageRoles"],
    requiredClientPermissions: ["ManageRoles"],
    preconditions: ["GuildOnly"],
})
export default class RoleHoistCommand extends KaikiCommand {
    public async messageRun(message: Message<true>, args: Args): Promise<Message> {

        const role = await args.rest("role");

        if (await Roles.rolePermissionCheck(message, role)) {

            await role.setHoist(!role.hoist);

            return message.channel.send({
                embeds: [
                    new EmbedBuilder({
                        description: `Toggled ${role.name}'s hoist status to ${!role.hoist}.`,
                    })
                        .withOkColor(message),
                ],
            });
        }

        else {
            return message.channel.send({
                embeds: [await KaikiEmbeds.errorMessage(message, "**Insufficient permissions**\nRole is above you or me in the role hierarchy.")],
            });
        }
    }
}
