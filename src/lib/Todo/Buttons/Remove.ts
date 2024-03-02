import {
    ActionRowBuilder,
    ModalActionRowComponentBuilder,
    ModalBuilder,
    TextInputBuilder,
} from "discord.js";

export class ButtonRemove {
    static RemoveModal = (currentTime: number) =>
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
