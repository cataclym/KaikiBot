import { ApplyOptions } from "@sapphire/decorators";
import {
    Awaitable,
    ChatInputCommandInteraction,
    EmbedBuilder,
    InteractionResponse,
    Message,
} from "discord.js";
import { KaikiCommandOptions } from "../../lib/Interfaces/Kaiki/KaikiCommandOptions";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";
import { ApplicationCommandRegistry } from "@sapphire/framework";

@ApplyOptions<KaikiCommandOptions>({
    name: "ping",
    aliases: ["p"],
    description:
        "Ping the bot and websocket to see if there are latency issues.",
})
export default class PingCommand extends KaikiCommand {
    public async messageRun(message: Message) {
        const initialMsg = await message.channel.send("Pinging...!");

        return initialMsg.edit(this.createEmbedMessage(message, initialMsg));
    }

    public registerApplicationCommands(
        registry: ApplicationCommandRegistry
    ): Awaitable<void> {
        registry.registerChatInputCommand((builder) =>
            builder
                .setName("ping")
                .setDescription("Ping bot to see if it is alive")
        );
    }

    public async chatInputRun(interaction: ChatInputCommandInteraction) {
        const initialMsg = await interaction.reply({
            content: "Pinging...!",
            fetchReply: true,
        });

        return interaction.editReply(
            this.createEmbedMessage(interaction, initialMsg)
        );
    }

    private createEmbedMessage(
        interaction: ChatInputCommandInteraction | Message,
        initialMsg: Message | InteractionResponse
    ) {
        return {
            embeds: [
                new EmbedBuilder()
                    .addFields([
                        {
                            name: "WebSocket ping",
                            value: Math.abs(interaction.client.ws.ping) + " ms",
                            inline: true,
                        },
                        {
                            name: "Client ping",
                            value:
                                initialMsg.createdTimestamp -
                                interaction.createdTimestamp +
                                " ms",
                            inline: true,
                        },
                    ])
                    .withOkColor(
                        interaction.inGuild() ? interaction.guild! : undefined
                    ),
            ],
            content: null,
        };
    }
}
