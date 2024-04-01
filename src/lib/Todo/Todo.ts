import { Todos } from "@prisma/client";
import Constants from "../../struct/Constants";
import {
    ButtonInteraction,
    CacheType,
    EmbedBuilder,
    Guild,
    GuildMember,
    GuildTextBasedChannel,
    Message,
    ModalSubmitInteraction,
    TextBasedChannel,
    User,
} from "discord.js";
import { ButtonAdd } from "./Buttons/Add";
import { ButtonRemove } from "./Buttons/Remove";
import { container } from "@sapphire/pieces";
import Common from "./Common";

export class Todo {
    private currentTime: number;
    private page: number;
    private pages: EmbedBuilder[];
    private todoArray: Todos[];
    private interaction?: ModalSubmitInteraction;
    private author: GuildMember | User;
    private baseEmbed: EmbedBuilder;
    private message: Message<boolean>;
    private channel: TextBasedChannel | GuildTextBasedChannel;
    private readonly colorGuild: Guild | undefined;

    public constructor(
        page: number,
        author: GuildMember | User,
        channel: GuildTextBasedChannel | TextBasedChannel,
        isInteraction?: boolean
    ) {
        this.channel = channel;
        this.author = author;
        this.colorGuild = "guild" in author ? author.guild : undefined;
        
        this.baseEmbed = new EmbedBuilder()
            .setTitle("Todo")
            .setThumbnail(Constants.LINKS.TODO_IMG)
            .withOkColor(this.colorGuild);

        this.page = page;

        this.firstInteraction(isInteraction).then(async () => this.handleFurtherInteractions());
    }

    async firstInteraction(isInteraction: boolean | undefined) {
        this.pages = [];

        this.todoArray = await container.client.orm.todos.findMany({
            where: {
                DiscordUsers: {
                    UserId: BigInt(this.author.id),
                },
            },
            orderBy: {
                Id: "asc",
            },
        });

        const { row, rowTwo, currentTime } = Common.createButtons();

        this.currentTime = currentTime;

        if (!this.todoArray.length) {
            row.components[1].setDisabled();
            this.message = await this.channel.send({
                options: { ephemeral: isInteraction },
                embeds: [
                    new EmbedBuilder(this.baseEmbed.data).setDescription(
                        "Your list is empty."
                    ),
                ],
                components: [row],
            });
        } else {
            const reminderArray = Common.reminderArray(this.todoArray);

            for (
                let index = 10, p = 0;
                p < reminderArray.length;
                index += 10, p += 10
            ) {
                this.pages.push(
                    new EmbedBuilder(this.baseEmbed.data).setDescription(
                        reminderArray.slice(p, index).join("\n")
                    )
                );
            }

            if (this.page >= this.pages.length) this.page = 0;

            this.message = await this.channel.send({
                embeds: [this.pages[this.page]],
                // Only show arrows if necessary
                components:
                    this.todoArray.length > 10 ? [row, rowTwo] : [row],
            });
        }
    }
    protected async remove(buttonInteraction: ButtonInteraction<CacheType>) {
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
                            .withErrorColor(this.colorGuild),
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

            const reminderArray = Common.reminderArray(this.todoArray);
            const pages: EmbedBuilder[] = [];

            for (
                let index = 10, p = 0;
                p < reminderArray.length;
                index += 10, p += 10
            ) {
                pages.push(
                    new EmbedBuilder(this.baseEmbed.data).setDescription(
                        reminderArray.slice(p, index).join("\n")
                    )
                );
            }

            const page = Math.floor(toRemoveIndex * 0.1);

            const { row, rowTwo, currentTime } = Common.createButtons();

            const [message] = await Promise.all([
                interaction.editReply({
                    content: "Removed an item from list.",
                    embeds: [
                        new EmbedBuilder()
                            .setAuthor({ name: "Deleted:" })
                            .setDescription(`\`${entry.String}\``)
                            .withOkColor(this.colorGuild),
                        pages.at(page) || pages[0],
                    ],
                    // Only show arrows if necessary
                    components:
                        this.todoArray.length > 10 ? [row, rowTwo] : [row],
                    options: { fetchReply: true },
                }),
            ]);

            this.message = message;
            this.currentTime = currentTime;
            this.interaction = interaction;

            return;
        }
    }

    protected async add(buttonInteraction: ButtonInteraction<CacheType>) {
        await buttonInteraction.showModal(
            ButtonAdd.todoModal(this.currentTime)
        );

        const interaction = await buttonInteraction.awaitModalSubmit({
            time: 120000,
            filter: (i) => i.customId === `${this.currentTime}AddModal`,
        });

        const uId = BigInt(this.author.id);

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

        const reminderArray = Common.reminderArray(this.todoArray);
        this.pages = [];

        for (
            let index = 10, p = 0;
            p < reminderArray.length;
            index += 10, p += 10
        ) {
            this.pages.push(
                new EmbedBuilder(this.baseEmbed.data).setDescription(
                    reminderArray.slice(p, index).join("\n")
                )
            );
        }

        const { row, rowTwo, currentTime } = Common.createButtons();

        this.message = await interaction.editReply({
            content: `Added entry \`${this.todoArray.length}\`.`,
            embeds: [this.pages.at(-1) || this.pages[0]],
            // Only show arrows if necessary
            components: this.todoArray.length > 10 ? [row, rowTwo] : [row],
            options: { fetchReply: true },
        });
        this.currentTime = currentTime;
        this.interaction = interaction;

        return;
    }

    protected async updateMsg() {
        await (
            this.interaction ? this.interaction.editReply : this.message.edit
        )({
            embeds: [this.pages[this.page]],
        });
    }

    private setPageForwards() {
        this.page = this.page + 1 < this.pages.length ? ++this.page : 0;
    }

    protected setPageBackwards() {
        this.page = this.page > 0 ? --this.page : this.pages.length - 1;
    }

    public async handleFurtherInteractions() {
        const buttonIdentityStrings = this.createButtonIdentityStrings();

        const messageComponentCollector =
            this.message.createMessageComponentCollector({
                filter: (i) =>
                    Object.values(buttonIdentityStrings).includes(i.customId) &&
                    this.author.id === i.user.id,
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
            await this.interaction?.editReply({
                components: [],
            });
            messageComponentCollector.stop();
            // Stop execution
            throw new Error();
        });
    }

    protected createButtonIdentityStrings() {
        const { currentTime } = this;
        return {
            add: `${currentTime}Add`,
            remove: `${currentTime}Remove`,
            forward: `${currentTime}Forward`,
            backward: `${currentTime}Backward`,
            clear: `${currentTime}Clear`,
        };
    }
}
