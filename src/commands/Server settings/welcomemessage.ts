import { PrefixSupplier } from "discord-akairo";
import { EmbedBuilder, Guild, Message, PermissionsBitField } from "discord.js";

import GreetHandler, { IJSONToMessageOptions, JSONToMessageOptions } from "../../lib/GreetHandler";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";

export default class WelcomeMessageCommand extends KaikiCommand {
    constructor() {
        super("welcomemessage", {
            aliases: ["welcomemessage", "welcomemsg"],
            description: "Set message to display when someone joins the guild. Provide either text, or valid JSON from the [embed creator](https://embed.kaikibot.xyz)",
            userPermissions: PermissionsBitField.Flags.ManageGuild,
            channel: "guild",
            args: [
                {
                    id: "msg",
                    type: (message, phrase) => {
                        try {
                            return JSON.parse(message.content.substring(message.content.indexOf(phrase)));
                        }
                        catch {
                            return undefined;
                        }
                    },
                    otherwise: (m) => ({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle("Error")
                                .setDescription("Please provide valid json")
                                .withErrorColor(m),
                        ],
                    }),
                },
            ],
            subCategory: "Welcome",
        });
    }

    public async exec(message: Message, { msg }: { msg: IJSONToMessageOptions }): Promise<Message> {

        const json = new JSONToMessageOptions(msg);
        if (!json) return message.channel.send(GreetHandler.jsonErrorMessage(message));

        const guildID = (message.guild as Guild).id;

        const db = await this.client.orm.guilds.update({
            where: { Id: BigInt(guildID) },
            data: { WelcomeMessage: JSON.stringify(json) },
        });

        const prefix = (this.handler.prefix as PrefixSupplier)(message);
        const embeds = [
            new EmbedBuilder()
                .setDescription(`New welcome message has been set!\n\nTest what the message looks like by typing \`${prefix}welcometest\``)
                .withOkColor(message),
        ];

        if (!db.WelcomeChannel) {
            embeds.push(new EmbedBuilder()
                .setDescription(`Enable \`welcome\` messages by typing \`${prefix}welcome\`.`)
                .withOkColor(message),
            );
        }

        return message.channel.send({
            embeds: embeds,
        });
    }
}
