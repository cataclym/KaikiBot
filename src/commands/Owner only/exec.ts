import { exec } from "child_process";
import { ApplyOptions } from "@sapphire/decorators";
import { Args } from "@sapphire/framework";
import { EmbedBuilder, Message } from "discord.js";
import { KaikiCommandOptions } from "../../lib/Interfaces/Kaiki/KaikiCommandOptions";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";
import Utility from "../../lib/Utility";
import Constants from "../../struct/Constants";

@ApplyOptions<KaikiCommandOptions>({
    name: "exec",
    description: "Use with caution",
    preconditions: ["OwnerOnly"],
    typing: true,
})
export default class ExecCommand extends KaikiCommand {
    public async messageRun(message: Message, args: Args) {

        const command = await args.rest("string");

        return exec(command, async (e, stdout) => {

            if (e) {
                return message.channel.send({
                    embeds: [
                        new EmbedBuilder()
                            .setAuthor({
                                name: "Command errored",
                                iconURL: message.client.user?.displayAvatarURL(),
                            })
                            .setDescription(await Utility.codeblock(Utility.trim(String(e ?? "Unknown error"), Constants.MAGIC_NUMBERS.CMDS.OWNER_ONLY.EVAL.MAX_STRING)))
                            .withErrorColor(message),
                    ],
                });
            }

            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setAuthor({
                            name: "Executed command",
                            iconURL: message.client.user?.displayAvatarURL(),
                        })
                        .setDescription(await Utility.codeblock(Utility.trim(stdout ?? "Command executed", Constants.MAGIC_NUMBERS.CMDS.OWNER_ONLY.EVAL.MAX_STRING)))
                        .withOkColor(message),
                ],
            });
        });
    }
}
