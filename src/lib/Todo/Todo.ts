import { Todos } from "@prisma/client";
import Constants from "../../struct/Constants";
import KaikiUtil from "../KaikiUtil";
import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonInteraction,
    CacheType,
    EmbedBuilder,
    Message,
    ModalSubmitInteraction,
} from "discord.js";
import { ButtonAdd } from "./Buttons/Add";
import { ButtonRemove } from "./Buttons/Remove";
import { container } from "@sapphire/pieces";

export class Todo {
    message: Message;
    currentTime: number;
    page: number;
    pages: EmbedBuilder[];
    sentMsg?: Message;
    todoArray: Todos[];
    interaction: ModalSubmitInteraction<CacheType>;

    public constructor(
        message: Message<boolean>,
        sentMsg: Message<boolean>,
        currentTime: number,
        page: number,
        pages: EmbedBuilder[],
        todoArray: { Id: bigint; UserId: bigint; String: string }[]
    ) {
        this.message = message;
        this.sentMsg = sentMsg;
        this.currentTime = currentTime;
        this.page = page;
        this.pages = pages;
        this.todoArray = todoArray;

        this.manageInteractions().catch(container.logger.warn);
    }

    private async manageInteractions() {
        await this.handleInitialInteraction().then(async () =>
            this.handleFurtherInteractions()
        );
    }

    public static reminderArray(todoArray: Todos[]) {
        return todoArray.map(
            (todo, i) =>
                `${+i + 1}. ${KaikiUtil.trim(todo.String.split(/\r?\n/).join(" "), Constants.MAGIC_NUMBERS.CMDS.UTILITY.TODO.INPUT_MAX_LENGTH)}`
        );
    }

    public async handleInitialInteraction() {
        const buttonIdentityStrings = this.createButtonIdentityStrings();

        const messageComponentCollector =
            this.sentMsg!.createMessageComponentCollector({
                filter: (i) =>
                    Object.values(buttonIdentityStrings).includes(i.customId) &&
                    this.message.author.id === i.user.id,
                time: 120000,
            });

        messageComponentCollector.on(
            "collect",
            async (buttonInteraction: ButtonInteraction) => {
                switch (buttonInteraction.customId) {
                    case buttonIdentityStrings.add:
                        messageComponentCollector.stop();
                        await this.add(buttonInteraction);
                        break;

                    case buttonIdentityStrings.remove:
                        messageComponentCollector.stop();
                        await this.remove(buttonInteraction);
                        break;

                    case buttonIdentityStrings.forward:
                        await buttonInteraction.deferUpdate();
                        this.setPageBackwards();
                        await this.updateMsg();
                        break;

                    case buttonIdentityStrings.backward:
                        await buttonInteraction.deferUpdate();
                        this.setPageBackwards();
                        await this.updateMsg();
                        break;

                    case buttonIdentityStrings.clear:
                        messageComponentCollector.stop();
                        break;

                    default:
                        break;
                }
            }
        );

        messageComponentCollector.once("end", async () => {
            if (this.sentMsg) {
                await this.sentMsg.edit({
                    components: [],
                });
            } else {
                await this.interaction.editReply({
                    components: [],
                });
            }
            messageComponentCollector.stop();
            // Stop execution
            throw new Error();
        });
    }

    private async remove(buttonInteraction: ButtonInteraction<CacheType>) {
        {
            await buttonInteraction.showModal(
                ButtonRemove.RemoveModal(this.currentTime)
            );

            const interaction = await buttonInteraction.awaitModalSubmit({
                time: 120000,
                filter: (i) => i.customId === `${this.currentTime}RemoveModal`,
            });

            if (!interaction.deferred)
                await interaction.deferReply({ ephemeral: true });

            const input = interaction.fields.getTextInputValue(
                `${this.currentTime}text2`
            );

            const toRemove = Number(input);
            const toRemoveIndex = toRemove - 1;

            if (
                toRemoveIndex >= this.todoArray.length ||
                !Number.isInteger(toRemove)
            ) {
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
                    Id: this.todoArray[toRemoveIndex].Id,
                },
            });

            // Make sure our local copy is up-to-date
            this.todoArray.splice(toRemoveIndex, 1);

            const reminderArray = Todo.reminderArray(this.todoArray);
            const pages: EmbedBuilder[] = [];

            for (
                let index = 10, p = 0;
                p < reminderArray.length;
                index += 10, p += 10
            ) {
                pages.push(
                    new EmbedBuilder(
                        Todo.baseEmbed(this.message).data
                    ).setDescription(reminderArray.slice(p, index).join("\n"))
                );
            }

            const page = Math.floor(toRemoveIndex * 0.1);

            const { row, rowTwo, currentTime } = Todo.createButtons();

            const [message] = await Promise.all([
                interaction.editReply({
                    content: "Removed an item from list.",
                    embeds: [
                        new EmbedBuilder()
                            .setAuthor({ name: "Deleted:" })
                            .setDescription(`\`${entry.String}\``)
                            .withOkColor(),
                        pages.at(page) || pages[0],
                    ],
                    // Only show arrows if necessary
                    components:
                        this.todoArray.length > 10 ? [row, rowTwo] : [row],
                    options: { fetchReply: true },
                }),
                this.sentMsg?.delete(),
            ]);

            delete this.sentMsg;
            this.message = message;
            this.currentTime = currentTime;
            this.interaction = interaction;

            return;
        }
    }

    private async add(buttonInteraction: ButtonInteraction<CacheType>) {
        await buttonInteraction.showModal(
            ButtonAdd.todoModal(this.currentTime)
        );

        const interaction = await buttonInteraction.awaitModalSubmit({
            time: 120000,
            filter: (i) => i.customId === `${this.currentTime}AddModal`,
        });

        const uId = BigInt(interaction.user.id);

        const entry = await buttonInteraction.client.orm.todos.create({
            data: {
                // Get input from modal
                String: interaction.fields
                    .getTextInputValue(`${this.currentTime}text1`)
                    .trim(),
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

        if (!interaction.deferred)
            await interaction.deferReply({ ephemeral: true });

        // Make sure our local copy is up-to-date
        this.todoArray.push({
            String: entry.String,
            UserId: entry.UserId,
            Id: entry.Id,
        });

        const reminderArray = Todo.reminderArray(this.todoArray);
        this.pages = [];

        for (
            let index = 10, p = 0;
            p < reminderArray.length;
            index += 10, p += 10
        ) {
            this.pages.push(
                new EmbedBuilder(
                    Todo.baseEmbed(this.message).data
                ).setDescription(reminderArray.slice(p, index).join("\n"))
            );
        }

        const { row, rowTwo, currentTime } = Todo.createButtons();

        const [message] = await Promise.all([
            interaction.editReply({
                content: `Added entry \`${this.todoArray.length}\`.`,
                embeds: [this.pages.at(-1) || this.pages[0]],
                // Only show arrows if necessary
                components: this.todoArray.length > 10 ? [row, rowTwo] : [row],
                options: { fetchReply: true },
            }),
            this.sentMsg?.delete(),
        ]);

        delete this.sentMsg;
        this.message = message;
        this.currentTime = currentTime;
        this.interaction = interaction;

        return;
    }

    private async updateMsg() {
        if (this.sentMsg) {
            await this.sentMsg.edit({
                embeds: [this.pages[this.page]],
            });
        } else {
            await this.interaction.editReply({
                embeds: [this.pages[this.page]],
            });
        }
    }

    private setPageForwards() {
        this.page = this.page + 1 < this.pages.length ? ++this.page : 0;
    }

    private setPageBackwards() {
        this.page = this.page > 0 ? --this.page : this.pages.length - 1;
    }

    public async handleFurtherInteractions() {
        const buttonIdentityStrings = this.createButtonIdentityStrings();

        const messageComponentCollector =
            this.message.createMessageComponentCollector({
                filter: (i) =>
                    Object.values(buttonIdentityStrings).includes(i.customId) &&
                    this.interaction.user.id === i.user.id,
                time: 120000,
            });

        messageComponentCollector.on(
            "collect",
            async (buttonInteraction: ButtonInteraction) => {
                switch (buttonInteraction.customId) {
                    case buttonIdentityStrings.add:
                        messageComponentCollector.stop();
                        await this.add(buttonInteraction);
                        await this.handleFurtherInteractions();
                        break;

                    case buttonIdentityStrings.remove:
                        messageComponentCollector.stop();
                        await this.remove(buttonInteraction);
                        await this.handleFurtherInteractions();
                        break;

                    case buttonIdentityStrings.forward:
                        await buttonInteraction.deferUpdate();
                        this.setPageForwards();
                        await this.updateMsg();
                        break;

                    case buttonIdentityStrings.backward:
                        await buttonInteraction.deferUpdate();
                        this.setPageBackwards();
                        await this.updateMsg();
                        break;

                    case buttonIdentityStrings.clear:
                        messageComponentCollector.stop();
                        break;

                    default:
                        break;
                }
            }
        );

        messageComponentCollector.once("end", async () => {
            await this.interaction.editReply({
                components: [],
            });
            messageComponentCollector.stop();
            // Stop execution
            throw new Error();
        });
    }

    private createButtonIdentityStrings() {
        const { currentTime } = this;
        return {
            add: `${currentTime}Add`,
            remove: `${currentTime}Remove`,
            forward: `${currentTime}Forward`,
            backward: `${currentTime}Backward`,
            clear: `${currentTime}Clear`,
        };
    }

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

    static baseEmbed = (message: Message) =>
        new EmbedBuilder()
            .setTitle("Todo")
            .setThumbnail(
                "https://cdn.discordapp.com/attachments/717045690022363229/726600392107884646/3391ce4715f3c814d6067911438e5bf7.png"
            )
            .withOkColor(message);
}
