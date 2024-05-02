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
import Common from "./Common";
import { container } from "@sapphire/pieces";

export class Todo {
    protected currentTime: number;
    protected page: number;
    protected pages: EmbedBuilder[];
    protected todoArray: Todos[];
    protected author: GuildMember | User;
    protected baseEmbed: EmbedBuilder;
    protected message: Message<boolean>;
    protected channel: TextBasedChannel | GuildTextBasedChannel;
    private readonly colorGuild: Guild | undefined;
    protected interaction: ModalSubmitInteraction<CacheType>;

    public constructor(
        page: number,
        author: GuildMember | User,
        channel: GuildTextBasedChannel | TextBasedChannel
    ) {
        this.channel = channel;
        this.author = author;
        this.colorGuild = "guild" in author ? author.guild : undefined;

        this.baseEmbed = new EmbedBuilder()
            .setTitle("Todo")
            .setThumbnail(Constants.LINKS.TODO_IMG)
            .withOkColor(this.colorGuild);

        this.page = page;

        container.client.orm.todos
            .findMany({
                where: {
                    DiscordUsers: {
                        UserId: BigInt(this.author.id),
                    },
                },
                orderBy: {
                    Id: "asc",
                },
            })
            .then((todo) => {
                this.todoArray = todo;

                if (!this.message) this.runTodo();

                this.listen();
            });
    }

    protected listen() {
        throw new Error("Method not implemented.");
    }

    protected runTodo() {
        throw new Error("Method not implemented.");
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
        throw new Error("Method not implemented.");
    }

    protected setPageForwards() {
        this.page = this.page + 1 < this.pages.length ? ++this.page : 0;
    }

    protected setPageBackwards() {
        this.page = this.page > 0 ? --this.page : this.pages.length - 1;
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
