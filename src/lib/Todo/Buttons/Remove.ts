import { Todos } from "@prisma/client";
import {
    ActionRowBuilder,
    ButtonInteraction,
    CacheType,
    EmbedBuilder,
    Events,
    Message,
    ModalActionRowComponentBuilder,
    ModalBuilder,
    TextInputBuilder,
} from "discord.js";

export class ButtonRemove {
    static async Remove(buttonInteraction: ButtonInteraction<CacheType>,
        currentTime: number,
        todoArray: Todos[],
        sentMsg: Message,
    ) {
        await buttonInteraction.showModal(this.RemoveModal(currentTime));

        buttonInteraction.client.on(Events.InteractionCreate, async interaction => {
            if (!interaction.isModalSubmit()) return;
            if (interaction.customId !== `${currentTime}RemoveModal`) {
                return;
            }
            else {
                const toRemove = Number(interaction.fields.getTextInputValue(`${currentTime}text2`));

                if ((toRemove - 1) >= todoArray.length || !Number.isInteger(toRemove)) {
                    await interaction.reply({
                        ephemeral: true,
                        embeds: [
                            new EmbedBuilder()
                                .setTitle("Doesn't exist")
                                .setDescription(`No entry with Id: \`${interaction.fields.getTextInputValue(`${currentTime}text2`)}\``)
                                .withErrorColor(sentMsg),
                        ],
                    });
                    return;
                }

                const entry = await sentMsg.client.orm.todos.delete({
                    select: {
                        String: true,
                    },
                    where: {
                        Id: todoArray[toRemove - 1].Id,
                    },
                });

                await interaction.reply({
                    ephemeral: true,
                    content: "Removed an item from list.",
                    embeds: [
                        new EmbedBuilder()
                            .setAuthor({ name: "Deleted:" })
                            .setDescription(`\`${entry.String}\``)
                            .withOkColor(sentMsg),
                    ],
                });
                return;
            }
        });
    }

    private static RemoveModal = (currentTime: number) => new ModalBuilder()
        .setTitle("Remove a TODO item")
        .setCustomId(`${currentTime}RemoveModal`)
        .addComponents(new ActionRowBuilder<ModalActionRowComponentBuilder>()
            .addComponents(new TextInputBuilder()
                .setStyle(1)
                .setMaxLength(4)
                .setMinLength(1)
                .setLabel("Input number to remove")
                .setCustomId(`${currentTime}text2`)
                .setRequired(),
            ),
        );
}
