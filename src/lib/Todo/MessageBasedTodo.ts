import { Todo } from "./Todo";
import {
    ButtonInteraction,
    EmbedBuilder,
    GuildMember,
    GuildTextBasedChannel,
    TextBasedChannel,
    User,
} from "discord.js";
import { container } from "@sapphire/pieces";
import Common from "./Common";
import InteractionBasedTodo from "./InteractionBasedTodo";

export default class MessageBasedTodo extends Todo {
    constructor(
        page: number,
        author: GuildMember | User,
        channel: GuildTextBasedChannel | TextBasedChannel
    ) {
        super(page, author, channel);
    }

    async runTodo() {
        this.pages = [];

        const { row, rowTwo, currentTime } = Common.createButtons();

        this.currentTime = currentTime;

        if (!this.todoArray.length) {
            row.components[1].setDisabled();
            this.message = await this.channel.send({
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
                components: this.todoArray.length > 10 ? [row, rowTwo] : [row],
            });

            await this.listen();
        }
    }

    protected async listen() {
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
                        await Promise.all([
                            this.add(buttonInteraction),
                            this.message.delete(),
                        ]);
                        new InteractionBasedTodo(
                            this.page,
                            this.author,
                            this.channel
                        );
                        break;

                    case buttonIdentityStrings.remove:
                        messageComponentCollector.stop();
                        await Promise.all([
                            this.remove(buttonInteraction),
                            this.message.delete(),
                        ]);
                        new InteractionBasedTodo(
                            this.page,
                            this.author,
                            this.channel
                        );
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
            return messageComponentCollector.stop();
        });
    }

    protected async updateMsg(): Promise<void> {
        await this.message.edit({
            embeds: [this.pages[this.page]],
        });
    }
}
