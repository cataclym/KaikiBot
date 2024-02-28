import { Todos } from "@prisma/client";
import Constants from "../../struct/Constants";
import KaikiUtil from "../KaikiUtil";
import { APIUser, ActionRowBuilder, ButtonBuilder, ButtonInteraction, EmbedBuilder, GuildMember, Message, User } from "discord.js";
import { ButtonAdd } from "./Buttons/Add";
import { ButtonRemove } from "./Buttons/Remove";

export class Todo {
    public static reminderArray(todoArray: Todos[]) {
        return todoArray.map((todo, i) => `${+i + 1}. ${KaikiUtil.trim(todo.String.split(/\r?\n/).join(" "), Constants.MAGIC_NUMBERS.CMDS.UTILITY.TODO.INPUT_MAX_LENGTH)}`);
    }

    public static createButtons() {
        const currentTime = Date.now();

        const row = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(new ButtonBuilder()
                .setCustomId(`${currentTime}Add`)
                .setEmoji("➕")
                .setStyle(3),
            )
            .addComponents(new ButtonBuilder()
                .setCustomId(`${currentTime}Remove`)
                .setEmoji("➖")
                .setStyle(4),
            )
            .addComponents(new ButtonBuilder()
                .setCustomId(`${currentTime}Clear`)
                .setEmoji("⬛")
                .setStyle(4),
            );

        const rowTwo = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`${currentTime}Backward`)
                    .setEmoji("⬅")
                    .setStyle(2),
            )
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`${currentTime}Forward`)
                    .setEmoji("➡")
                    .setStyle(2),
            );

        return { row, rowTwo, currentTime };
    }

    public static handleInteraction(sentMsg: Message, author: User | APIUser, currentTime: number, page: number, pages: EmbedBuilder[], todoArray: Todos[]) {
        const buttonArray = [`${currentTime}Add`, `${currentTime}Backward`, `${currentTime}Clear`, `${currentTime}Forward`, `${currentTime}Remove`];

        const messageComponentCollector = sentMsg.createMessageComponentCollector({
            filter: (i) => {

                if (buttonArray.includes(i.customId) && author.id === i.user.id) {
                    return true;
                }

                else {
                    i.deferUpdate();
                    return false;
                }
            },
            time: 120000,
        });

        messageComponentCollector.on("collect", async (buttonInteraction: ButtonInteraction) => {

            switch (buttonInteraction.customId) {

                case `${currentTime}Add`:
                    await ButtonAdd.add(buttonInteraction, currentTime, todoArray, sentMsg);
                    break;

                case `${currentTime}Backward`:
                    await buttonInteraction.deferUpdate();
                    page = page > 0 ? --page : pages.length - 1;
                    await updateMsg();
                    break;

                case `${currentTime}Clear`:
                    await sentMsg.edit({
                        components: [],
                    });
                    messageComponentCollector.stop();
                    break;

                case `${currentTime}Forward`:
                    await buttonInteraction.deferUpdate();
                    page = page + 1 < pages.length ? ++page : 0;
                    await updateMsg();
                    break;

                case `${currentTime}Remove`:
                    messageComponentCollector.stop();
                    await ButtonRemove.Remove(buttonInteraction, currentTime, todoArray, sentMsg);
                    break;

                default:
                    break;
            }
        });

        messageComponentCollector.once("end", async () => {
            sentMsg.
            await sentMsg.edit({
                components: [],
            });
            messageComponentCollector.stop();
        });

        async function updateMsg() {
            await sentMsg.edit({
                embeds: [pages[page]],
            });
        }
    }

}

