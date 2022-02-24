import { Argument, Flag, PrefixSupplier } from "discord-akairo";
import { Snowflake } from "discord-api-types";
import { Guild, Message, MessageEmbed } from "discord.js";
import { getGuildDocument } from "../../struct/documentMethods";
import KaikiCommand from "Kaiki/KaikiCommand";
import KaikiEmbeds from "../../lib/KaikiEmbeds";

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

    *args(): unknown {
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

    public async exec(message: Message): Promise<Message> {

        const guild = (message.guild as Guild);

        const db = await getGuildDocument(guild.id),
            roleID = db.userRoles[message.author.id];

        if (!roleID) return message.channel.send({ embeds: [await KaikiEmbeds.embedFail(message)] });

        const myRole = guild.roles.cache.get(roleID as Snowflake);

        if (!myRole) {
            delete db.userRoles[message.author.id];
            db.markModified("userRoles");
            await db.save();
            return message.channel.send({ embeds: [await KaikiEmbeds.embedFail(message)] });
        }

        return message.channel.send({
            embeds: [new MessageEmbed()
                .setAuthor({
                    name: `Current role assigned to ${message.author.username}`,
                    iconURL: guild.iconURL({ size: 2048, dynamic: true })
                      || message.author.displayAvatarURL({ size: 2048, dynamic: true }),
                })
                .setColor(myRole.hexColor)
                .addField("Name", myRole.name, true)
                .addField("Colour", myRole.hexColor, true)],
        });
    }
}
