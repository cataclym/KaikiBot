import { PrefixSupplier } from "discord-akairo";
import { Guild, Message, MessageEmbed, Permissions } from "discord.js";
import { EmbedFromJson, EmbedJSON } from "../../interfaces/IGreetLeave";
import { KaikiCommand } from "kaiki";

import { getGuildDocument } from "../../struct/documentMethods";

export default class ByeMessageCommand extends KaikiCommand {
    constructor() {
        super("goodbyemessage", {
            aliases: ["goodbyemessage", "goodbyemsg", "byemsg"],
            userPermissions: Permissions.FLAGS.MANAGE_GUILD,
            channel: "guild",
            args: [{
                id: "msg",
                type: (message, phrase) => {
                    try {
                        return JSON.parse(message.content.substring(message.content.indexOf(phrase)));
                    }
                    catch {
                        return undefined;
                    }
                },
                otherwise: (m) => ({ embeds: [new MessageEmbed()
                    .setTitle("Error")
                    .setDescription("Please provide valid json")
                    .withErrorColor(m)] }),
            }],
        });
    }

    public async exec(message: Message, { msg }: { msg: EmbedJSON }): Promise<Message> {

        const guildID = (message.guild as Guild).id,
            db = await getGuildDocument(guildID);

        db.settings.goodbye.embed = new EmbedFromJson(msg);
        db.markModified("settings.goodbye.embed");

        if (!db.settings.goodbye.channel) {
            db.settings.goodbye.channel = message.channel.id;
            db.markModified("settings.goodbye.channel");
        }

        await db.save();

        const prefix = (this.handler.prefix as PrefixSupplier)(message);
        const embed = [new MessageEmbed()
            .setDescription(`New bye message has been set!\n\nTest what the message looks like by typing \`${prefix}byetest\``)
            .withOkColor(message)];

        if (!db.settings.welcome.enabled) {
            embed.push(new MessageEmbed()
                .setDescription(`Enable \`goodbye\` messages by typing \`${prefix}goodbye\`.`)
                .withOkColor(message),
            );
        }

        return message.channel.send({
            embeds: embed,
        });
    }
}
