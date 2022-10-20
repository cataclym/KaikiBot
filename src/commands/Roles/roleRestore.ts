import { EmbedBuilder, GuildMember, Message, Permissions, PermissionsBitField } from "discord.js";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";

import { restoreUserRoles } from "../../lib/Roles";
import Utility from "../../lib/Utility";

export default class RestoreUserRoles extends KaikiCommand {
    constructor() {
        super("restore", {
            aliases: ["restore"],
            userPermissions: PermissionsBitField.Flags.Administrator,
            clientPermissions: PermissionsBitField.Flags.ManageRoles,
            description: "Restores roles for a user who has previously left the server.",
            usage: "@dreb",
            channel: "guild",
            args: [
                {
                    id: "member",
                    type: "member",
                    otherwise: (m) => ({
                        embeds: [
                            new EmbedBuilder()
                                .setDescription("Please provide a valid member")
                                .withErrorColor(m),
                        ],
                    }),
                },
            ],
        });
    }

    public async exec(message: Message, { member }: { member: GuildMember }): Promise<Message | void> {

        const result = await restoreUserRoles(member);

        if (!result) {
            return;
        }

        else if (result.success) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(`Restored roles of \`${member.user.tag}\` [${member.id}]`)
                        .addFields({ name: "Roles added", value: Utility.trim(result.roles.join("\n"), 1024) })
                        .withOkColor(message),
                ],
            });
        }

        else if (result.roles) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setDescription("This member already has all the roles.")
                        .withErrorColor(message),
                ],
            });
        }

        else {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setDescription("This user's roles have not been saved, or they have not left the guild.")
                        .withErrorColor(message),
                ],
            });
        }
    }
}
