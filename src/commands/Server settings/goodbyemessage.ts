import { ApplyOptions } from "@sapphire/decorators";
import { Args } from "@sapphire/framework";
import { EmbedBuilder, Guild, Message } from "discord.js";
import KaikiCommandOptions from "../../lib/Interfaces/Kaiki/KaikiCommandOptions";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";

@ApplyOptions<KaikiCommandOptions>({
    name: "goodbyemessage",
    aliases: ["goodbyemsg", "byemessage", "byemsg"],
    usage: ["Bye, %member.name%!", "{ embed data }"],
    description:
        "Set message to display when someone leaves the guild. Provide either text, or valid JSON from the [embed creator](https://embed.kaikibot.xyz)",
    requiredUserPermissions: ["ManageGuild"],
    preconditions: ["GuildOnly"],
    minorCategory: "Goodbye",
    quotes: [],
})
export default class ByeMessageCommand extends KaikiCommand {
    public async messageRun(message: Message, args: Args): Promise<Message> {
        const json = await args.rest("welcomeGoodbyeMessage");

        const guildID = (message.guild as Guild).id;

        const db = await this.client.orm.guilds.update({
            where: { Id: BigInt(guildID) },
            data: { ByeMessage: JSON.stringify(json) },
        });

        const prefix = await message.client.fetchPrefix(message);

        const embed = [
            new EmbedBuilder()
                .setDescription(
                    `New bye message has been set!\n\nTest what the message looks like by typing \`${prefix}byetest\``
                )
                .withOkColor(message),
        ];

        if (!db.ByeChannel) {
            embed.push(
                new EmbedBuilder()
                    .setDescription(
                        `Enable \`goodbye\` messages by typing \`${prefix}goodbye\`.`
                    )
                    .withOkColor(message)
            );
        }

        return message.channel.send({
            embeds: embed,
        });
    }
}
