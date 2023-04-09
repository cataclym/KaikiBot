import { ApplyOptions } from "@sapphire/decorators";
import { Args } from "@sapphire/framework";
import { EmbedBuilder, Guild, Message } from "discord.js";
import { KaikiCommandOptions } from "../../lib/Interfaces/Kaiki/KaikiCommandOptions";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";

@ApplyOptions<KaikiCommandOptions>({
    name: "welcomemessage",
    aliases: ["welcomemsg"],
    description: "Set message to display when someone joins the guild. Provide either text, or valid JSON from the [embed creator](https://embed.kaikibot.xyz)",
    requiredUserPermissions: ["ManageGuild"],
    preconditions: ["GuildOnly"],
})
export default class WelcomeMessageCommand extends KaikiCommand {
    public async messageRun(message: Message, args: Args): Promise<Message> {

        const json = await args.rest("welcomeGoodbyeMessage");

        const guildID = (message.guild as Guild).id;

        const db = await this.client.orm.guilds.update({
            where: { Id: BigInt(guildID) },
            data: { WelcomeMessage: JSON.stringify(json) },
        });

        const prefix = await message.client.fetchPrefix(message);

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
