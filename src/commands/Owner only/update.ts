import { execFile } from "child_process";
import { EmbedBuilder, Message } from "discord.js";
import path from "path";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";
import Utility from "../../lib/Utility";

export default class UpdateCommand extends KaikiCommand {
    constructor() {
        super("update", {
            aliases: ["update"],
            ownerOnly: true,
        });
    }

    public async exec(message: Message): Promise<void> {
        execFile(path.join(__dirname, "..", "..", "..", "external", "update.sh"), async (error, stdout, stderr) => {
            if (error) {
                return message.channel.send({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle("Error occurred while updating")
                            .setDescription(await Utility.codeblock(error.message))
                            .withOkColor(message),
                    ],
                });
            }

            else {
                return message.channel.send({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle(stderr)
                            .setDescription(await Utility.codeblock(stdout))
                            .withOkColor(message),
                    ],
                });
            }
        });
    }
}
