import { ApplyOptions } from "@sapphire/decorators";
import { Args } from "@sapphire/framework";
import {
    AttachmentBuilder,
    EmbedBuilder,
    Message,
    PermissionsBitField,
    resolveColor,
} from "discord.js";
import { imgFromColor } from "../../lib/Color";
import KaikiCommandOptions from "../../lib/Interfaces/Kaiki/KaikiCommandOptions";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";
import KaikiEmbeds from "../../lib/Kaiki/KaikiEmbeds";
import KaikiUtil from "../../lib/KaikiUtil";
import Roles from "../../lib/Roles";

@ApplyOptions<KaikiCommandOptions>({
    name: "rolecolor",
    aliases: ["roleclr", "rclr"],
    description:
		"Sets or displays the color of a given role, or your highest role.",
    usage: ["@Gamer ff00ff"],
    preconditions: ["GuildOnly"],
})
export default class RoleColorCommand extends KaikiCommand {
    public async messageRun(message: Message<true>, args: Args) {
        const { member } = message;

        if (!member) throw new Error();

        const role = args.finished
            ? member.roles.highest
            : await args.pick("role");

        const clr = args.finished ? undefined : await args.pick("kaikiColor");

        if (!clr) {
            const attachment = new AttachmentBuilder(
                await imgFromColor(KaikiUtil.convertHexToRGB(role.hexColor)),
                { name: "color.png" }
            );
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

        const { hexColor } = role,
            attachment = new AttachmentBuilder(await imgFromColor(clr), {
                name: "color.png",
            });

        if (await Roles.rolePermissionCheck(message, role)) {
            if (
                !member?.permissions.has(PermissionsBitField.Flags.ManageRoles)
            ) {
                return message.channel.send({
                    embeds: [
                        await KaikiEmbeds.errorMessage(
                            message,
                            "You do not have `MANAGE_ROLES` permission."
                        ),
                    ],
                });
            } else if (
                !message.guild?.members.me?.permissions.has(
                    PermissionsBitField.Flags.ManageRoles
                )
            ) {
                return message.channel.send({
                    embeds: [
                        await KaikiEmbeds.errorMessage(
                            message,
                            "I do not have `MANAGE_ROLES` permission."
                        ),
                    ],
                });
            }

            return role.edit({ color: [clr.r, clr.g, clr.b] }).then((r) => {
                return message.channel.send({
                    files: [attachment],
                    embeds: [
                        new EmbedBuilder({
                            title: `You have changed ${r.name}'s color from ${hexColor} to ${r.hexColor}!`,
                            thumbnail: { url: "attachment://color.png" },
                        }).withOkColor(message),
                    ],
                });
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
