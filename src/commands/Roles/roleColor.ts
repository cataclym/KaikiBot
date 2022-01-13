import { Message, MessageAttachment, MessageEmbed, Role } from "discord.js";
import { imgFromColor, resolveColor } from "../../lib/Color";
import { errorMessage, roleArgumentError } from "../../lib/Embeds";
import { KaikiCommand } from "kaiki";
import { rolePermissionCheck } from "../../lib/roles";


export default class RoleColorCommand extends KaikiCommand {
    constructor() {
        super("rolecolor", {
            aliases: ["rolecolor", "roleclr", "rclr"],
            description: "Displays the color of a given role, or your highest role.",
            usage: "@Gamer ff00ff",
            channel: "guild",
            args: [
                {
                    id: "role",
                    type: "role",
                },
                {
                    id: "clr",
                    type: "string",
                    match: "rest",
                    default: null,
                },
            ],
        });
    }
    public async exec(message: Message, { role, clr }: { role: Role | undefined, clr: string | null }): Promise<Message> {

        const { member } = message;

        if (typeof clr !== "string") {

            if (!role) role = message.member!.roles.highest;

            const attachment = new MessageAttachment(await imgFromColor(role.hexColor), "color.png");
            return message.channel.send({
                files: [attachment],
                embeds: [new MessageEmbed({
                    title: `Role color of ${role.name}.`,
                    description: `${role.hexColor}`,
                    image: { url: "attachment://color.png" },
                    color: role.hexColor,
                })],
            });
        }

        if (!role) return message.channel.send({ embeds: [roleArgumentError(message)] });

        const { hexColor } = role,
            newColor = await resolveColor(clr),
            attachment = new MessageAttachment(await imgFromColor(newColor), "color.png");

        if (await rolePermissionCheck(message, role)) {


            if (!member?.permissions.has("MANAGE_ROLES")) {
                return message.channel.send({
                    embeds: [await errorMessage(message, "You do not have `MANAGE_ROLES` permission.")],
                });
            }

            else if (!message.guild?.me?.permissions.has("MANAGE_ROLES")) {
                return message.channel.send({
                    embeds: [await errorMessage(message, "I do not have `MANAGE_ROLES` permission.")],
                });
            }

            return role.edit({ color: newColor }).then(r => {
                return message.channel.send({
                    files: [attachment],
                    embeds: [new MessageEmbed({
                        title: `You have changed ${r.name}'s color from ${hexColor} to ${r.hexColor}!`,
                        thumbnail: { url: "attachment://color.png" },
                    })
                        .withOkColor(message)],
                });
            });
        }

        else {
            return message.channel.send({
                embeds: [await errorMessage(message, "**Insufficient permissions**\nRole is above you or me in the role hierarchy.")],
            });
        }
    }
}
