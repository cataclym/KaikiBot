import { ApplyOptions } from "@sapphire/decorators";
import { Args } from "@sapphire/framework";
import { ChannelType, Message, PermissionsBitField } from "discord.js";
import { JSONToMessageOptions } from "../../lib/GreetHandler";
import { KaikiCommandOptions } from "../../lib/Interfaces/Kaiki/KaikiCommandOptions";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";
import KaikiEmbeds from "../../lib/KaikiEmbeds";

@ApplyOptions<KaikiCommandOptions>({
    name: "say",
    description: "Bot will send the message you typed in the specified channel. It also takes embeds",
    usage: ["#general hello from another channel", "<embed code>"],
    requiredUserPermissions: ["ManageMessages"],
    preconditions: ["GuildOnly"],
})
export default class SayCommand extends KaikiCommand {
    public async messageRun(message: Message<true>, args: Args): Promise<Message | void> {

        const targetChannel = await args.pick("guildTextChannel")
            .catch(() => message.channel);

        const stringOrJSON = await args.rest("string");
        const possibleJSON = await JSON.parse(stringOrJSON);

        const argMessage = possibleJSON
            ? possibleJSON
            : stringOrJSON;


        if (message.channel.type !== ChannelType.GuildText) return;

        if (message.member && !message.member.permissionsIn(targetChannel).has(PermissionsBitField.Flags.ManageMessages)) {
            return message.channel.send({ embeds: [await KaikiEmbeds.errorMessage(message, `You do not have \`MANAGE_MESSAGES\` in ${targetChannel}`)] });
        }

        return targetChannel.send(typeof argMessage !== "object"
            ? { content: argMessage }
            : new JSONToMessageOptions(argMessage));
    }
}

