import { AttachmentBuilder, EmbedBuilder, Message, PermissionsBitField, resolveColor, Role } from "discord.js";
import { imgFromColor } from "../../lib/Color";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";
import KaikiEmbeds from "../../lib/KaikiEmbeds";
import { rolePermissionCheck } from "../../lib/Roles";
import { TKaikiColor } from "../../lib/Types/TColor";
import Utility from "../../lib/Utility";

export default class RoleColorCommand extends KaikiCommand {
    constructor() {
        super("rolecolor", {
            aliases: ["rolecolor", "roleclr", "rclr"],
            description: "Sets or displays the color of a given role, or your highest role.",
            usage: "@Gamer ff00ff",
            channel: "guild",
            args: [
                {
                    id: "role",
                    type: "role",
                },
                {
                    id: "clr",
                    type: "kaiki_color",
                    default: null,
                },
            ],
        });
    }

    public async exec(message: Message<true>, {
        role,
        clr,
    }: { role: Role | undefined, clr: TKaikiColor | null }) {

        const { member } = message;

        if (!clr) {

            if (!message.member) return;

            if (!role) role = message.member.roles.highest;

            const attachment = new AttachmentBuilder(await imgFromColor(Utility.HEXtoRGB(role.hexColor)), { name: "color.png" });
            return message.channel.send({
                files: [attachment],
                embeds: [
                    new EmbedBuilder({
                        title: `Role color of ${role.name}.`,
                        description: `${role.hexColor}`,
                        image: { url: "attachment://color.png" },
                        color: resolveColor(role.hexColor),
                    }),
                ],
            });
        }

        if (!role) return message.channel.send({ embeds: [KaikiEmbeds.genericArgumentError(message)] });

        const { hexColor } = role,
            attachment = new AttachmentBuilder(await imgFromColor(clr), { name: "color.png" });

        if (await rolePermissionCheck(message, role)) {

            if (!member?.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
                return message.channel.send({
                    embeds: [await KaikiEmbeds.errorMessage(message, "You do not have `MANAGE_ROLES` permission.")],
                });
            }

            else if (!message.guild?.members.me?.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
                return message.channel.send({
                    embeds: [await KaikiEmbeds.errorMessage(message, "I do not have `MANAGE_ROLES` permission.")],
                });
            }

            return role.edit({ color: [clr.r, clr.g, clr.b] }).then(r => {
                return message.channel.send({
                    files: [attachment],
                    embeds: [
                        new EmbedBuilder({
                            title: `You have changed ${r.name}'s color from ${hexColor} to ${r.hexColor}!`,
                            thumbnail: { url: "attachment://color.png" },
                        })
                            .withOkColor(message),
                    ],
                });
            });
        }

        else {
            return message.channel.send({
                embeds: [await KaikiEmbeds.errorMessage(message, "**Insufficient permissions**\nRole is above you or me in the role hierarchy.")],
            });
        }
    }
}
