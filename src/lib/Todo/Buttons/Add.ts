import { Todos } from "@prisma/client";
import {
    ActionRowBuilder,
    ButtonInteraction,
    EmbedBuilder,
    Events,
    Message,
    ModalActionRowComponentBuilder,
    ModalBuilder,
    TextInputBuilder,
} from "discord.js";
import Constants from "../../../struct/Constants";
import { Todo } from "../Todo";

export class ButtonAdd {

    private static todoModal = (currentTime: number) => new ModalBuilder()
        .setTitle("Add a TODO item")
        .setCustomId(`${currentTime}AddModal`)
        .addComponents(new ActionRowBuilder<ModalActionRowComponentBuilder>()
            .addComponents(new TextInputBuilder()
                .setStyle(2)
                .setMaxLength(Constants.MAGIC_NUMBERS.CMDS.UTILITY.TODO.INPUT_MAX_LENGTH)
                .setMinLength(2)
                .setLabel("TODO")
                .setCustomId(`${currentTime}text1`)
                .setRequired(),
            ),
        );

    private static Embed = (message: Message) => new EmbedBuilder()
        .setTitle("Todo")
        .setThumbnail("https://cdn.discordapp.com/attachments/717045690022363229/726600392107884646/3391ce4715f3c814d6067911438e5bf7.png")
        .withOkColor(message);


    static async add(buttonInteraction: ButtonInteraction,
        currentTime: number,
        todoArray: Todos[],
        sentMsg: Message,
    ) {

        await buttonInteraction.showModal(this.todoModal(currentTime));

        buttonInteraction.client.on(Events.InteractionCreate, async interaction => {
            if (!interaction.isModalSubmit()) return;

            const uId = BigInt(interaction.user.id);

            if (interaction.customId !== `${currentTime}AddModal`) {
                return;
            }

            else {
                const entry = await buttonInteraction.client.orm.todos.create({
                    data: {
                        String: interaction.fields.getTextInputValue(`${currentTime}text1`).trim(),
                        DiscordUsers: {
                            connectOrCreate: {
                                create: {
                                    UserId: uId,
                                },
                                where: {
                                    UserId: uId,
                                },
                            },
                        },
                    },
                });

                todoArray.push({
                    String: entry.String,
                    UserId: entry.UserId,
                    Id: entry.Id,
                });

                await sentMsg.edit({
                    components: [],
                });

                const reminderArray = Todo.reminderArray(todoArray);
                const pages: EmbedBuilder[] = [];

                for (let index = 10, p = 0; p < reminderArray.length; index += 10, p += 10) {
                    pages.push(new EmbedBuilder(ButtonAdd.Embed(sentMsg).data)
                        .setDescription(reminderArray
                            .slice(p, index)
                            .join("\n"),
                        ),
                    );
                }

                await interaction.reply({
                    ephemeral: true,
                    content: `Added entry \`${todoArray.length}\`.`,
                    embeds: [pages.at(-1) || pages[0]],
                });
            }
        });
    }
}
