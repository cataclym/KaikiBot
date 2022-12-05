import { execFile, execSync } from "child_process";
import { ActionRowBuilder, ButtonBuilder, EmbedBuilder, Message } from "discord.js";
import path from "path";
import util from "util";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";
import Utility from "../../lib/Utility";

const exec = util.promisify(execFile);

export default class UpdateCommand extends KaikiCommand {
    constructor() {
        super("update", {
            aliases: ["update"],
            ownerOnly: true,
        });
    }

    static externalPath = (file: string) => path.join(__dirname, "..", "..", "..", "external", file);

    public async exec(message: Message): Promise<void | Message<boolean>> {

        const update = await exec(UpdateCommand.externalPath("update.sh"));

        if (update.stderr) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Error occurred while updating")
                        .setDescription(await Utility.codeblock(Utility.trim(update.stderr, 4048)))
                        .withErrorColor(message),
                ],
            });
        }

        const embeds = [
            new EmbedBuilder()
                .setTitle(`HEAD is now at ${execSync("git rev-parse --short HEAD")} ${execSync("git describe")}`)
                .setDescription(await Utility.codeblock(Utility.trim(update.stdout, 4048)))
                .withOkColor(message),
            new EmbedBuilder()
                .setTitle("Bot needs to compile updated files...!")
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
            time: 120000,
        });

        collector.on("collect", async (i) => {
            await i.deferUpdate();

            const build = await exec(UpdateCommand.externalPath("build.sh"));

            if (build.stderr) {
                embeds[1] = new EmbedBuilder()
                    .setTitle("Error occurred while building")
                    // Embed description limit 4096
                    .setDescription(await Utility.codeblock(Utility.trim(build.stderr, 4048)))
                    .withErrorColor(message),
                await i.editReply({
                    embeds: embeds,
                    components: [],
                });
            }

            else {
                embeds[1] = new EmbedBuilder()
                    .setTitle("Finished building")
                    // Embed description limit 4096
                    .setDescription(await Utility.codeblock(Utility.trim(build.stdout, 4048)))
                    .addFields([
                        {
                            name: "After building...",
                            value: "You need to restart the bot to for the changes to take effect!",
                        },
                    ])
                    .withOkColor(message);

                await i.editReply({
                    embeds: embeds,
                    components: [],
                });
            }
        });

        collector.on("end", async () => {
            await msg.edit({
                content: "Timed out...",
                components: [],
            });
            return collector.stop();
        });
    }
}
