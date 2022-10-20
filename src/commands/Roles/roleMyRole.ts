import { Argument, Flag } from "discord-akairo";
import { EmbedBuilder, Message, PermissionsBitField } from "discord.js";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";
import KaikiEmbeds from "../../lib/KaikiEmbeds";
import Roles from "../../lib/Roles";

export default class MyRoleCommand extends KaikiCommand {
    constructor() {
        super("myrole", {
            aliases: ["myrole", "mr"],
            clientPermissions: PermissionsBitField.Flags.ManageRoles,
            channel: "guild",

            description: "Checks your assigned user role. Can set role color, name and icon.",
            usage: ["color FF0000", "name Dreb", "icon :someEmoji:", "icon reset"],
        });
    }

    * args(): Generator<{ type: string[][] }, Flag, string> {
        const method = yield {
            type: [
                ["myrolename", "name"],
                ["myrolecolor", "color", "colour", "clr"],
                ["myroleicon", "icon", "image"],
            ],
        };
        if (!Argument.isFailure(method)) {
            return Flag.continue(method);
        }
        return Flag.cancel();
    }

    public async exec(message: Message<true>): Promise<Message> {

        const myRole = await Roles.getRole(message);

        if (!myRole) return message.channel.send({ embeds: [await KaikiEmbeds.embedFail(message)] });

        return message.channel.send({
            embeds: [
                new EmbedBuilder()
                    .setAuthor({
                        name: `Current role assigned to ${message.author.username}`,
                        iconURL: message.guild.iconURL({ size: 2048 })
                            || message.author.displayAvatarURL({ size: 2048 }),
                    })
                    .setColor(myRole.hexColor)
                    .addFields({
                        name: "Name", value: myRole.name, inline: true,
                    },
                    {
                        name: "Colour", value: myRole.hexColor, inline: true,
                    }),
            ],
        });
    }
}
