import { ActionRowBuilder, ButtonBuilder } from "discord.js";
import { Todos } from "@prisma/client";
import KaikiUtil from "../KaikiUtil";
import Constants from "../../struct/Constants";

export default class Common {
    public static createButtons() {
        // Create a unique number.
        const currentTime = Math.round(Date.now() * Math.random());

        const row = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`${currentTime}Add`)
                    .setEmoji("➕")
                    .setStyle(3)
            )
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`${currentTime}Remove`)
                    .setEmoji("➖")
                    .setStyle(4)
            )
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`${currentTime}Clear`)
                    .setEmoji("⬛")
                    .setStyle(4)
            );

        const rowTwo = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`${currentTime}Backward`)
                    .setEmoji("⬅")
                    .setStyle(2)
            )
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`${currentTime}Forward`)
                    .setEmoji("➡")
                    .setStyle(2)
            );

        return { row, rowTwo, currentTime };
    }

    public static reminderArray(todoArray: Todos[]) {
        return todoArray.map(
            (todo, i) =>
                `${+i + 1}. ${KaikiUtil.trim(todo.String.split(/\r?\n/).join(" "), Constants.MAGIC_NUMBERS.CMDS.UTILITY.TODO.INPUT_MAX_LENGTH)}`
        );
    }
}