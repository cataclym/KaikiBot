import { ApplyOptions } from "@sapphire/decorators";
import { Args } from "@sapphire/framework";
import { EmbedBuilder, Message } from "discord.js";
import { KaikiCommandOptions } from "../../lib/Interfaces/Kaiki/KaikiCommandOptions";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";
import Roles from "../../lib/Roles";

@ApplyOptions<KaikiCommandOptions>({
    name: "roledelete",
    aliases: ["deleterole", "dr"],
    description: "Deletes one or more roles",
    usage: ["@gamers @streamers @weebs"],
    requiredUserPermissions: ["ManageRoles"],
    requiredClientPermissions: ["ManageRoles"],
    preconditions: ["GuildOnly"],
})
export default class RoleDeleteCommand extends KaikiCommand {
    public async messageRun(message: Message<true>, args: Args): Promise<Message> {

        const roles = await args.repeat("role");

        const deletedRoles: string[] = [];
        const otherRoles: string[] = [];

        for await (const role of roles) {

            if (await Roles.rolePermissionCheck(message, role)) {

                role.delete().catch(() => otherRoles.push(role.name));
                deletedRoles.push(role.name);
            }

            else {
                otherRoles.push(role.name);
            }
        }

        if (otherRoles.length) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(`Role(s) \`${otherRoles.join("`, `")}\` could not be deleted due to insufficient permissions.`)
                        .withErrorColor(message),
                ],
            });
        }

        else if (deletedRoles.length) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(`Deleted: \`${deletedRoles.join("`, `")}\``)
                        .withOkColor(message),
                ],
            });
        }

        else {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setDescription("Couldn't delete roles!")
                        .withErrorColor(message),
                ],
            });
        }
    }
}
