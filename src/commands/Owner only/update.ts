import { execFile } from "child_process";
import { ActionRowBuilder, ButtonBuilder, EmbedBuilder, Message } from "discord.js";
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
                            .withErrorColor(message),
                    ],
                });
            }

            else {
                const embeds = [
                    new EmbedBuilder()
                        .setTitle(stderr)
                        .setDescription(await Utility.codeblock(stdout))
                        .withOkColor(message),
                    new EmbedBuilder()
                        .setTitle("Need to build updated files")
                        .withOkColor(message),
                ];
                const msg = await message.channel.send({
                    embeds: embeds,
                    components: [
                        new ActionRowBuilder<ButtonBuilder>()
                            .addComponents(new ButtonBuilder()
                                .setCustomId(String(Math.random()))
                                .setLabel("Build")
                                .setStyle(1),
                            ),
                    ],
                });

                const collector = msg.createMessageComponentCollector({
                    filter: (i) => i.user.id === message.author.id,
                    time: 15000,
                });

                collector.on("collect", async (i) => {
                    await i.deferUpdate();
                    execFile(path.join(__dirname, "..", "..", "..", "external", "build.sh"), async (error2, stdout2, stderr2) => {
                        if (error2) {
                            embeds[1] = new EmbedBuilder()
                                .setTitle("Error occurred while building")
                                .setDescription(await Utility.codeblock(error2.message))
                                .withErrorColor(message),
                            await i.editReply({
                                embeds: embeds,
                                components: [],
                            });
                        }

                        else {
                            embeds[1] = new EmbedBuilder()
                                .setTitle("Finished building")
                                .setDescription(await Utility.codeblock(stdout2))
                                .addFields([
                                    {
                                        name: "After building...",
                                        value: "You need to restart the bot to for the changes to take effect!",
                                    },
                                ])
                                .withOkColor(message),
                            await i.update({
                                embeds: embeds,
                                components: [],
                            });
                        }
                    });
                });

                collector.on("end", async () => {
                    await msg.edit({
                        components: [],
                    });
                });
            }
        });
    }
}
