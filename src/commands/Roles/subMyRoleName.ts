import { EmbedBuilder, Message, PermissionsBitField } from "discord.js";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";
import KaikiEmbeds from "../../lib/KaikiEmbeds";
import Roles from "../../lib/Roles";
import Utility from "../../lib/Utility";
import Constants from "../../struct/Constants";

export default class MyRoleSubCommandName extends KaikiCommand {
    constructor() {
        super("myrolename", {
            clientPermissions: PermissionsBitField.Flags.ManageRoles,
            channel: "guild",
            args: [
                {
                    id: "name",
                    match: "rest",
                    otherwise: (m: Message) => ({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle("Please provide a name")
                                .withErrorColor(m),
                        ],
                    }),
                },
            ],
        });
    }

    async exec(message: Message<true>, { name }: { name: string }): Promise<Message> {

        const myRole = await Roles.getRole(message);

        if (!myRole) return message.channel.send({ embeds: [await KaikiEmbeds.embedFail(message)] });

        const botRole = message.guild?.members.me?.roles.highest,
            isPosition = botRole?.comparePositionTo(myRole);

        if (isPosition && isPosition <= 0) {
            return message.channel.send({ embeds: [await KaikiEmbeds.embedFail(message, "This role is higher than me, I cannot edit this role!")] });
        }

        const oldName = myRole.name;
        await myRole.setName(Utility.trim(name, Constants.MAGIC_NUMBERS.COMMON.NAME_LIMIT));
        return message.channel.send({
            embeds: [
                new EmbedBuilder()
                    .setDescription(`You have changed \`${oldName}\`'s name to \`${name}\`!`)
                    .setColor(myRole.color),
            ],
        });
    }
}
