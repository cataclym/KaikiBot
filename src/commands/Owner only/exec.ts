import { ChildProcess, exec } from "child_process";
import { Message, MessageEmbed } from "discord.js";
import { codeblock, trim } from "../../lib/Util";
import { KaikiCommand } from "kaiki";


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
                    embeds: [new MessageEmbed()
                        .setAuthor("Command errored", message.client.user?.displayAvatarURL({ dynamic: true }))
                        .setDescription(await codeblock(trim(String(e ?? "Unknown error"), 1997)))
                        .withErrorColor(message)],
                });
            }

            return message.channel.send({
                embeds: [new MessageEmbed()
                    .setAuthor("Executed command", message.client.user?.displayAvatarURL({ dynamic: true }))
                    .setDescription(await codeblock(trim(stdout ?? "Command executed", 1997)))
                    .withOkColor(message)],
            });
        });
    }
}
