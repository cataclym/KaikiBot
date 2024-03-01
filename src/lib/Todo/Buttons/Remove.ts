import { Todos } from "@prisma/client";
import {
    ActionRowBuilder,
    ButtonInteraction,
    CacheType,
    EmbedBuilder,
    ModalActionRowComponentBuilder,
    ModalBuilder,
    TextInputBuilder,
} from "discord.js";
import { Todo } from "../Todo";
import { ButtonAdd } from "./Add";

export class ButtonRemove {
    static async Remove(
        buttonInteraction: ButtonInteraction<CacheType>,
        currentTime: number,
        todoArray: Todos[]
    ) {
        await buttonInteraction.showModal(this.RemoveModal(currentTime));

        const interaction = await buttonInteraction.awaitModalSubmit({
            time: 120000,
            filter: (i) => i.customId === `${currentTime}RemoveModal`,
        });

        if (!interaction.deferred)
            await interaction.deferReply({ ephemeral: true });

        const input = interaction.fields.getTextInputValue(
            `${currentTime}text2`
        );

        const toRemove = Number(input);
        const toRemoveIndex = toRemove - 1;

        if (toRemoveIndex >= todoArray.length || !Number.isInteger(toRemove)) {
            await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Doesn't exist")
                        .setDescription(`No entry with ID: \`${input}\``)
                        .withErrorColor(),
                ],
            });
            return;
        }

        const entry = await interaction.client.orm.todos.delete({
            select: {
                String: true,
            },
            where: {
                Id: todoArray[toRemoveIndex].Id,
            },
        });

        // Make sure our local copy is up-to-date
        todoArray.splice(toRemoveIndex, 1);

        const reminderArray = Todo.reminderArray(todoArray);
        const pages: EmbedBuilder[] = [];

        for (
            let index = 10, p = 0;
            p < reminderArray.length;
            index += 10, p += 10
        ) {
            pages.push(
                new EmbedBuilder(ButtonAdd.Embed().data).setDescription(
                    reminderArray.slice(p, index).join("\n")
                )
            );
        }

        const page = Math.floor(toRemoveIndex * 0.1);

        const { row, rowTwo, currentTime: newTime } = Todo.createButtons();

        const message = await interaction.editReply({
            content: "Removed an item from list.",
            embeds: [
                new EmbedBuilder()
                    .setAuthor({ name: "Deleted:" })
                    .setDescription(`\`${entry.String}\``)
                    .withOkColor(),
                pages.at(page) || pages[0],
            ],
            // Only show arrows if necessary
            components: todoArray.length > 10 ? [row, rowTwo] : [row],
            options: { fetchReply: true },
        });

        await Todo.handleFurtherInteractions(
            interaction,
            message,
            newTime,
            page,
            pages,
            todoArray
        );
    }

    private static RemoveModal = (currentTime: number) =>
        new ModalBuilder()
            .setTitle("Remove a TODO item")
            .setCustomId(`${currentTime}RemoveModal`)
            .addComponents(
                new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
                    new TextInputBuilder()
                        .setStyle(1)
                        .setMaxLength(4)
                        .setMinLength(1)
                        .setLabel("Input number to remove")
                        .setCustomId(`${currentTime}text2`)
                        .setRequired()
                )
            );
}
