import { Argument, Flag, PrefixSupplier } from "discord-akairo";
import { Message, MessageEmbed } from "discord.js";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";
import KaikiEmbeds from "../../lib/KaikiEmbeds";
import Roles from "../../lib/Roles";

export default class MyRoleCommand extends KaikiCommand {
    constructor() {
        super("myrole", {
            aliases: ["myrole", "mr"],
            clientPermissions: ["MANAGE_ROLES"],
            channel: "guild",
            prefix: (msg: Message) => {
                const mentions = [`<@${this.client.user?.id}>`, `<@!${this.client.user?.id}>`];
                const prefixes = [(this.handler.prefix as PrefixSupplier)(msg) as string, ";"];
                if (this.client.user) {
                    return [...prefixes, ...mentions];
                }
                return prefixes;
            },
            description: "Checks your assigned user role. Can set role color, name and icon.",
            usage: ["color FF0000", "name Dreb", "icon :someEmoji:", "icon reset"],
        });
    }

    * args(): unknown {
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
    }

    public async exec(message: Message<true>): Promise<Message> {

        const myRole = await Roles.getRole(message);

        if (!myRole) return message.channel.send({ embeds: [await KaikiEmbeds.embedFail(message)] });

        return message.channel.send({
            embeds: [new MessageEmbed()
                .setAuthor({
                    name: `Current role assigned to ${message.author.username}`,
                    iconURL: message.guild.iconURL({ size: 2048, dynamic: true })
                        || message.author.displayAvatarURL({ size: 2048, dynamic: true }),
                })
                .setColor(myRole.hexColor)
                .addField("Name", myRole.name, true)
                .addField("Colour", myRole.hexColor, true)],
        });
    }
}
