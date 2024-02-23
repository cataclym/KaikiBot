import { execFile, execSync } from "child_process";
import path from "path";
import util from "util";
import { ActionRowBuilder, ButtonBuilder, EmbedBuilder, Message } from "discord.js";
import { ApplyOptions } from "@sapphire/decorators";
import { KaikiCommandOptions } from "../../lib/Interfaces/Kaiki/KaikiCommandOptions";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";
import KaikiUtil from "../../lib/KaikiUtil";
import Constants from "../../struct/Constants";

const exec = util.promisify(execFile);

@ApplyOptions<KaikiCommandOptions>({
    name: "update",
    description: "",
    preconditions: ["OwnerOnly"],
    enabled: false,
})
export default class UpdateCommand extends KaikiCommand {
    static externalPath = (file: string) => path.join(__dirname, "..", "..", "..", "external", file);

    public async messageRun(message: Message): Promise<void | Message<boolean>> {

        const update = await exec(UpdateCommand.externalPath("update.sh"));

        if (update.stderr) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Error occurred while updating")
                        .setDescription(await KaikiUtil.codeblock(KaikiUtil.trim(update.stderr, Constants.MAGIC_NUMBERS.CMDS.OWNER_ONLY.UPDATE.DESC_STR_LIMIT)))
                        .withErrorColor(message),
                ],
            });
        }

        else if (update.stdout.trim() === "No update available.") {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(await KaikiUtil.codeblock(KaikiUtil.trim(update.stdout, Constants.MAGIC_NUMBERS.CMDS.OWNER_ONLY.UPDATE.DESC_STR_LIMIT)))
                        .withErrorColor(message),
                ],
            });
        }

        const embeds = [
            new EmbedBuilder()
                .setTitle(`HEAD is now at ${execSync("git rev-parse --short HEAD")} ${execSync("git describe")}`)
                .setDescription(await KaikiUtil.codeblock(KaikiUtil.trim(update.stdout, 4048)))
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
            time: Constants.MAGIC_NUMBERS.CMDS.OWNER_ONLY.UPDATE.TIMEOUT,
        });

        collector.on("collect", async (i) => {
            await i.deferUpdate();

            const build = await exec(UpdateCommand.externalPath("build.sh"));

            if (build.stderr) {
                embeds[1] = new EmbedBuilder()
                    .setTitle("Error occurred while building")
                    // Embed description limit 4096
                    .setDescription(await KaikiUtil.codeblock(KaikiUtil.trim(build.stderr, Constants.MAGIC_NUMBERS.CMDS.OWNER_ONLY.UPDATE.DESC_STR_LIMIT)))
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
                    .setDescription(await KaikiUtil.codeblock(KaikiUtil.trim(build.stdout, Constants.MAGIC_NUMBERS.CMDS.OWNER_ONLY.UPDATE.DESC_STR_LIMIT)))
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
