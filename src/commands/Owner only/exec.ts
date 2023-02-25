import { ChildProcess, exec } from "child_process";
import { EmbedBuilder, Message } from "discord.js";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";
import Utility from "../../lib/Utility";
import Constants from "../../struct/Constants";

export default class ExecCommand extends KaikiCommand {
    constructor() {
        super("exec", {
            aliases: ["exec"],
            ownerOnly: true,
            typing: true,
            args: [
                {
                    id: "command",
                    type: "string",
                    match: "restContent",
                },
            ],
        });
    }

    public async exec(message: Message, { command }: { command: string }): Promise<ChildProcess> {

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
