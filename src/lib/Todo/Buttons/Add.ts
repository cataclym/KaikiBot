import {
    ActionRowBuilder,
    ModalActionRowComponentBuilder,
    ModalBuilder,
    TextInputBuilder,
} from "discord.js";
import Constants from "../../../struct/Constants";

export class ButtonAdd {
    static todoModal = (currentTime: number) =>
        new ModalBuilder()
            .setTitle("Add a TODO item")
            .setCustomId(`${currentTime}AddModal`)
            .addComponents(
                new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
                    new TextInputBuilder()
                        .setStyle(2)
                        .setMaxLength(
                            Constants.MAGIC_NUMBERS.CMDS.UTILITY.TODO
                                .INPUT_MAX_LENGTH
                        )
                        .setMinLength(2)
                        .setLabel("TODO")
                        .setCustomId(`${currentTime}text1`)
                        .setRequired()
                )
            );
}
