import { ApplyOptions } from "@sapphire/decorators";
import { Args } from "@sapphire/framework";
import { EmbedBuilder, Message } from "discord.js";
import { KaikiCommandOptions } from "../../lib/Interfaces/Kaiki/KaikiCommandOptions";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";
import KaikiEmbeds from "../../lib/Kaiki/KaikiEmbeds";
import Roles from "../../lib/Roles";

@ApplyOptions<KaikiCommandOptions>({
    name: "rolementionable",
    aliases: ["rolem", "mentionable"],
    description: "Toggles if a role is mentionable",
    usage: ["@gamers"],
    requiredUserPermissions: ["ManageRoles"],
    requiredClientPermissions: ["ManageRoles"],
    preconditions: ["GuildOnly"],
})
export default class RoleMentionableCommand extends KaikiCommand {
    public async messageRun(
        message: Message<true>,
        args: Args
    ): Promise<Message> {
        const role = await args.rest("role");

        if (await Roles.rolePermissionCheck(message, role)) {
            const bool = !role.mentionable;

            await role.setMentionable(bool);

            return message.channel.send({
                embeds: [
                    new EmbedBuilder({
                        description: `Toggled ${role.name}'s mentionable status to ${bool}.`,
                    }).withOkColor(message),
                ],
            });
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
