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
    name: "forgetme",
    usage: "",
    description: "Deletes all information about you in the database",
})
export default class ForgetMeCommand extends KaikiCommand {
    public async messageRun(message: Message): Promise<void> {
        const deleteMsg = await message.channel.send({
            embeds: [
                new EmbedBuilder()
                    .setDescription(
                        "Are you *sure* you want to delete all your entries in the database?"
                    )
                    .withOkColor(message),
            ],
            isInteraction: true,
            components: [
                new ActionRowBuilder<ButtonBuilder>({
                    components: [
                        new ButtonBuilder()
                            .setCustomId("1")
                            .setLabel("Yes")
                            .setEmoji("⚠️")
                            .setStyle(4),
                        new ButtonBuilder()
                            .setCustomId("2")
                            .setLabel("No")
                            .setEmoji("❌")
                            .setStyle(2),
                    ],
                }),
            ],
        });

        const buttonListener = new InteractionCollector(message.client, {
            message: deleteMsg,
            time: 20000,
            filter: (m) => m.user.id === message.author.id,
        });

        buttonListener.once("collect", async (i) => {
            if (i.isButton()) {
                if (i.customId === "1") {
                    const userData = await this.client.orm.discordUsers.delete({
                        select: {
                            Amount: true,
                            CreatedAt: true,
                            Todos: true,
                        },
                        where: {
                            UserId: BigInt(message.author.id),
                        },
                    });

                    const guildData =
                        await this.client.orm.guildUsers.deleteMany({
                            where: {
                                UserId: BigInt(message.author.id),
                            },
                        });

                    message.channel.send({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle("Deleted data")
                                .setDescription(
                                    "All data stored about you has been deleted!"
                                )
                                .addFields([
                                    {
                                        name: "Cleared user-data",
                                        value: userData.Todos.length
                                            ? `${userData.Todos.length + guildData.count} entrie(s) deleted`
                                            : "N/A",
                                    },
                                    {
                                        name: "Cleared money-data",
                                        value: userData.Amount
                                            ? `${userData.Amount} currency deleted`
                                            : "N/A",
                                    },
                                ])
                                .withOkColor(message),
                        ],
                    });
                } else {
                    await message.delete();
                }
                buttonListener.stop();
            }
        });

        buttonListener.once("end", async () => {
            await deleteMsg.delete();
        });
    }
}
