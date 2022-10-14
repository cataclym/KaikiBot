import { Collection, Message, EmbedBuilder, Permissions, Role } from "discord.js";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";
import KaikiEmbeds from "../../lib/KaikiEmbeds";

import { rolePermissionCheck } from "../../lib/Roles";


export default class RoleDeleteCommand extends KaikiCommand {
    constructor() {
        super("roledelete", {
            aliases: ["roledelete", "deleterole", "dr"],
            clientPermissions: Permissions.FLAGS.MANAGE_ROLES,
            userPermissions: Permissions.FLAGS.MANAGE_ROLES,
            description: "Deletes one or more roles",
            usage: "@gamers @streamers @weebs",
            channel: "guild",
            args: [
                {
                    id: "roles",
                    type: "roles",
                    match: "separate",
                    otherwise: (m) => ({ embeds: [KaikiEmbeds.roleArgumentError(m)] }),
                },
            ],
        });
    }

    public async exec(message: Message<true>, { roles }: { roles: Collection<string, Role>[] }): Promise<Message> {

        const deletedRoles: string[] = [];
        const otherRoles: string[] = [];

        for await (const collection of roles) {

            const r = collection.map(_r => _r)[0];

            if (await rolePermissionCheck(message, r)) {

                r.delete().catch(() => otherRoles.push(r.name));
                deletedRoles.push(r.name);
            }

            else {
                otherRoles.push(r.name);
            }
        }

        if (otherRoles.length) {
            return message.channel.send({
                embeds: [new EmbedBuilder()
                    .setDescription(`Role(s) \`${otherRoles.join("`, `")}\` could not be deleted due to insufficient permissions.`)
                    .withErrorColor(message)],
            });
        }

        else if (deletedRoles.length) {
            return message.channel.send({
                embeds: [new EmbedBuilder()
                    .setDescription(`Deleted: \`${deletedRoles.join("`, `")}\``)
                    .withOkColor(message)],
            });
        }

        else {
            return message.channel.send({
                embeds: [new EmbedBuilder()
                    .setDescription("Couldn't delete roles!")
                    .withErrorColor(message)],
            });
        }
    }
}
