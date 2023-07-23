import { ApplyOptions } from "@sapphire/decorators";
import { Args } from "@sapphire/framework";
import { EmbedBuilder, Message } from "discord.js";
import { KaikiCommandOptions } from "../../lib/Interfaces/Kaiki/KaikiCommandOptions";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";
import KaikiEmbeds from "../../lib/Kaiki/KaikiEmbeds";
import KaikiUtil from "../../lib/KaikiUtil";
import Roles from "../../lib/Roles";
import Constants from "../../struct/Constants";

@ApplyOptions<KaikiCommandOptions>({
    name: "rolerename",
    aliases: ["rolename", "rn"],
    description: "Renames a given role. The role you specify has to be lower in the role hierarchy than your highest role. Use 'quotes around rolename with spaces'.",
    usage: ["@Gamer weeb"],
    requiredUserPermissions: ["ManageRoles"],
    requiredClientPermissions: ["ManageRoles"],
    preconditions: ["GuildOnly"],
})
export default class RoleRenameCommand extends KaikiCommand {
    public async messageRun(message: Message<true>, args: Args): Promise<Message> {

        const role = await args.pick("role");
        const name = await args.rest("string");

        if (await Roles.rolePermissionCheck(message, role)) {

            const oldName = role.name;

            role.edit({ name: KaikiUtil.trim(name, Constants.MAGIC_NUMBERS.COMMON.NAME_LIMIT) })
                .catch((e) => {
                    throw new Error("Error: Failed to edit role.\n" + e);
                });
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Success!")
                        .setDescription(`\`${oldName}\` renamed to ${role}.`)
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
