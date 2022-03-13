import { Message, MessageEmbed, Role } from "discord.js";
import KaikiCommand from "Kaiki/KaikiCommand";
import { rolePermissionCheck } from "../../lib/roles";
import KaikiEmbeds from "../../lib/KaikiEmbeds";
import Utility from "../../lib/Utility";

export default class RoleRenameCommand extends KaikiCommand {
    constructor() {
        super("rolerename", {
            aliases: ["rolerename", "rolename", "rn"],
            description: "Renames a given role. The role you specify has to be lower in the role hierarchy than your highest role. Use 'quotes around rolename with spaces'.",
            usage: "@Gamer weeb",
            clientPermissions: "MANAGE_ROLES",
            userPermissions: "MANAGE_ROLES",
            channel: "guild",
            args: [
                {
                    id: "role",
                    type: "role",
                    otherwise: (m: Message) => ({ embeds: [KaikiEmbeds.roleArgumentError(m)] }),
                },
                {
                    id: "name",
                    type: "string",
                    match: "rest",
                    otherwise: (msg: Message) => ({ embeds: [KaikiEmbeds.genericArgumentError(msg)] }),
                },
            ],
        });
    }

    public async exec(message: Message<true>, { role, name }: { role: Role, name: string }): Promise<Message> {

        if (await rolePermissionCheck(message, role)) {

            const oldName = role.name;

            role.edit({ name: Utility.trim(name.toString(), 32) })
                .catch((e) => {
                    throw new Error("Error: Failed to edit role.\n" + e);
                });
            return message.channel.send({
                embeds: [new MessageEmbed()
                    .setTitle("Success!")
                    .setDescription(`\`${oldName}\` renamed to ${role}.`)
                    .withOkColor(message)],
            });
        }

        else {
            return message.channel.send({
                embeds: [await KaikiEmbeds.errorMessage(message, "**Insufficient permissions**\nRole is above you or me in the role hierarchy.")],
            });
        }
    }
}
