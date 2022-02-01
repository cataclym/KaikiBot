import { Guild, Message, MessageEmbed } from "discord.js";
import { getGuildDocument } from "../../struct/documentMethods";
import { Snowflake } from "discord-api-types";
import { KaikiCommand } from "kaiki";
import KaikiEmbeds from "../../lib/KaikiEmbeds";
import Utility from "../../lib/Utility";

export default class MyRoleSubCommandName extends KaikiCommand {
    constructor() {
        super("myrolename", {
            clientPermissions: ["MANAGE_ROLES"],
            channel: "guild",
            args: [{
                id: "name",
                match: "rest",
                otherwise: (m: Message) => ({ embeds: [new MessageEmbed()
                    .setTitle("Please provide a name")
                    .withErrorColor(m)] }),
            }],
        });
    }

    async exec(message: Message, { name }: { name: string }): Promise<Message> {

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

        const botRole = message.guild?.me?.roles.highest,
            isPosition = botRole?.comparePositionTo(myRole);

        if (isPosition && isPosition <= 0) {
            return message.channel.send({ embeds: [await KaikiEmbeds.embedFail(message, "This role is higher than me, I cannot edit this role!")] });
        }

        const oldName = myRole.name;
        await myRole.setName(Utility.trim(name, 32));
        return message.channel.send({ embeds: [new MessageEmbed()
            .setDescription(`You have changed \`${oldName}\`'s name to \`${name}\`!`)
            .setColor(myRole.color)],
        });
    }
}
