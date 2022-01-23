import { Message, MessageEmbed, Role } from "discord.js";
import { KaikiCommand } from "kaiki";
import { rolePermissionCheck } from "../../lib/roles";
import KaikiEmbeds from "../../lib/KaikiEmbeds";

export default class RoleHoistCommand extends KaikiCommand {
    constructor() {
        super("rolehoist", {
            aliases: ["rolehoist", "hoistrole", "hoist"],
            clientPermissions: "MANAGE_ROLES",
            userPermissions: "MANAGE_ROLES",
            description: "Hoists or unhoists a role",
            usage: "@gamers",
            channel: "guild",
            args: [
                {
                    id: "role",
                    type: "role",
                    otherwise: (message: Message) => ({ embeds: [KaikiEmbeds.roleArgumentError(message)] }),
                },
            ],
        });
    }

    public async exec(message: Message, { role }: { role: Role}): Promise<Message> {

        if (await rolePermissionCheck(message, role)) {

            await role.setHoist(!role.hoist);

            return message.channel.send({
                embeds: [new MessageEmbed({
                    description: `Toggled ${role.name}'s hoist status to ${!role.hoist}.`,
                })
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
