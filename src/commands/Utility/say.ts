import { ApplyOptions } from "@sapphire/decorators";
import { Args } from "@sapphire/framework";
import { ChannelType, Message, PermissionsBitField } from "discord.js";
import GreetHandler, { JSONToMessageOptions } from "../../lib/GreetHandler";
import KaikiCommandOptions from "../../lib/Interfaces/Kaiki/KaikiCommandOptions";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";
import KaikiEmbeds from "../../lib/Kaiki/KaikiEmbeds";

@ApplyOptions<KaikiCommandOptions>({
    name: "say",
    description:
        "Bot will send the message you typed in the specified channel. It also takes embeds",
    usage: ["#general hello from another channel", "<embed code>"],
    requiredUserPermissions: ["ManageMessages"],
    preconditions: ["GuildOnly"],
    quotes: [],
})
export default class SayCommand extends KaikiCommand {
    public async messageRun(
        message: Message<true>,
        args: Args
    ): Promise<Message | void> {
        const targetChannel = await args
            .pick("guildTextChannel")
            .catch(() => message.channel);

        let stringOrJSON = await args.rest("string");

        if (!message.member) throw new Error();

        const greetHandler = new GreetHandler(message.member);

        stringOrJSON = await greetHandler.parsePlaceHolders(stringOrJSON);

        try {
            stringOrJSON = JSON.parse(stringOrJSON);
        } catch {
            // Ignore
        }

        if (message.channel.type !== ChannelType.GuildText) return;

        if (
            !message.member
                .permissionsIn(targetChannel)
                .has(PermissionsBitField.Flags.ManageMessages)
        ) {
            return message.channel.send({
                embeds: [
                    await KaikiEmbeds.errorMessage(
                        message,
                        `You do not have \`MANAGE_MESSAGES\` in ${targetChannel}`
                    ),
                ],
            });
        }

        return targetChannel.send(
            typeof stringOrJSON === "object"
                ? new JSONToMessageOptions(stringOrJSON)
                : { content: stringOrJSON }
        );
    }
}
