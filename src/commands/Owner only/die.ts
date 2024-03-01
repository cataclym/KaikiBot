import process from "process";
import { ApplyOptions } from "@sapphire/decorators";
import {
    ActionRowBuilder,
    ButtonBuilder,
    EmbedBuilder,
    InteractionCollector,
    Message,
} from "discord.js";
import { KaikiCommandOptions } from "../../lib/Interfaces/Kaiki/KaikiCommandOptions";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";

@ApplyOptions<KaikiCommandOptions>({
    name: "die",
    aliases: ["shutdown", "kill"],
    description: "Shuts down bot.",
    preconditions: ["OwnerOnly"],
})
export default class KillBotProcess extends KaikiCommand {
    public async messageRun(message: Message) {
        const deleteMsg = await message.channel.send({
            embeds: [
                new EmbedBuilder()
                    .setDescription("Do you *really* want to shut me down?")
                    .withOkColor(message),
            ],
            isInteraction: true,
            components: [
                new ActionRowBuilder<ButtonBuilder>({
                    components: [
                        new ButtonBuilder()
                            .setCustomId("1")
                            .setLabel("Click to kill")
                            .setStyle(4),
                    ],
                }),
            ],
        });

        const buttonListener = new InteractionCollector(message.client, {
            message: deleteMsg,
            time: 20000,
            filter: (m) => m.user.id === message.author.id,
        });

        buttonListener.once("collect", async (mci) => {
            if (mci.isButton()) {
                await mci.reply({
                    ephemeral: true,
                    embeds: [
                        new EmbedBuilder()
                            .setAuthor({
                                name: "Dying",
                                iconURL:
                                    message.client.user?.displayAvatarURL(),
                            })
                            .addFields([
                                {
                                    name: "Shutting down",
                                    value: "See you later",
                                    inline: false,
                                },
                            ])
                            .withOkColor(message),
                    ],
                });
            }

            await Promise.all([deleteMsg.delete(), message.react("✅")]);

            this.container.logger.warn("Shutting down");
            // Disconnects the client connection
            this.client.destroy().then(() => process.exit(0));
            // Exits process with SIGINT
        });

        buttonListener.once("end", async () => {
            await deleteMsg.delete();
            await message.delete();
        });
    }
}
