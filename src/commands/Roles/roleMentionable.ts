import { Message, MessageEmbed, Role } from "discord.js";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";
import KaikiEmbeds from "../../lib/KaikiEmbeds";

import { rolePermissionCheck } from "../../lib/Roles";

export default class RoleMentionableCommand extends KaikiCommand {
    constructor() {
        super("rolementionable", {
            aliases: ["rolementionable", "rolem", "mentionable"],
            clientPermissions: "MANAGE_ROLES",
            userPermissions: "MANAGE_ROLES",
            description: "Toggles if a role is mentionable",
            usage: "@gamers",
            channel: "guild",
            args: [
                {
                    id: "role",
                    type: "role",
                    otherwise: (m) => ({ embeds: [KaikiEmbeds.roleArgumentError(m)] }),
                },
            ],
        });
    }

    public async exec(message: Message<true>, { role }: { role: Role }): Promise<Message> {

        if (await rolePermissionCheck(message, role)) {

            const bool = !role.mentionable;

            await role.setMentionable(bool);

            return message.channel.send({
                embeds: [new MessageEmbed({
                    description: `Toggled ${role.name}'s mentionable status to ${bool}.`,
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
