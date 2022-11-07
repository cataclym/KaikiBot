import { PrefixSupplier } from "discord-akairo";
import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonInteraction,
    EmbedBuilder,
    Events,
    Message,
    ModalActionRowComponentBuilder,
    ModalBuilder,
    TextInputBuilder,
} from "discord.js";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";
import Utility from "../../lib/Utility";

export default class TodoCommand extends KaikiCommand {
    constructor() {
        super("todo", {
            aliases: ["todo", "note"],
            description: "A personal todo list. The items are limited to 204 characters. Intended for small notes.",
        });
    }

    public async exec(message: Message, { page }: { page: number }) {

        const currentTime = Date.now();

        page = (page <= 1 ? 0 : page - 1) || 0;

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

        const row2 = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`${currentTime}Backward`)
                    // .setLabel("Backward")
                    .setEmoji("⬅")
                    .setStyle(2),
            )
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`${currentTime}Forward`)
                    // .setLabel("Forward")
                    .setEmoji("➡")
                    .setStyle(2),
            );

        const emb = new EmbedBuilder()
            .setTitle("Todo")
            .setAuthor({
                name: `${message.author.tag} 📔 To learn more about the command, type ${(this.handler.prefix as PrefixSupplier)(message)}help todo`,
            })
            .setThumbnail("https://cdn.discordapp.com/attachments/717045690022363229/726600392107884646/3391ce4715f3c814d6067911438e5bf7.png")
            .withOkColor(message);

        const todoArray = await this.client.orm.todos.findMany({
            where: {
                UserId: BigInt(message.author.id),
            },
        });

        if (!todoArray.length) {
            return message.channel.send({
                embeds: [emb.setDescription("Your list is empty.")],
            });
        }

        const reminderArray = todoArray.map((todo, i) => `${+i + 1}. ${Utility.trim(todo.String.split(/\r?\n/).join(" "), 204)}`);
        const pages: EmbedBuilder[] = [];

        for (let index = 10, p = 0; p < reminderArray.length; index += 10, p += 10) {
            pages.push(new EmbedBuilder(emb.data)
                .setDescription(reminderArray
                    .slice(p, index)
                    .join("\n"),
                ),
            );
        }

        const sentMsg = await message.channel.send({
            embeds: [pages[page]],
            components: [row, row2],
        });

        const messageComponentCollector = sentMsg.createMessageComponentCollector({
            filter: (i) => {
                if ([`${currentTime}Add`, `${currentTime}Backward`, `${currentTime}Clear`, `${currentTime}Forward`, `${currentTime}Remove`].includes(i.customId) && message.author.id === i.user.id) {
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
                case `${currentTime}Add`: {
                    await buttonInteraction.showModal(this.modal(currentTime));
                    await sentMsg.edit({
                        components: [],
                    });
                    messageComponentCollector.stop();

                    this.client.on(Events.InteractionCreate, async interaction => {
                        if (!interaction.isModalSubmit()) return;
                        if (interaction.customId !== `${currentTime}AddModal`) {
                            return;
                        }
                        else {
                            await this.client.orm.todos.create({
                                data: {
                                    String: interaction.fields.getTextInputValue(`${currentTime}text1`),
                                    UserId: BigInt(message.author.id),
                                },
                            });
                            await interaction.reply({
                                ephemeral: true,
                                content: "Item added",
                            });
                        }
                    });
                    break;
                }
                case `${currentTime}Backward`: {
                    await buttonInteraction.deferUpdate();
                    page = page > 0 ? --page : pages.length - 1;
                    await updateMsg();
                    break;
                }
                case `${currentTime}Clear`: {
                    await sentMsg.edit({
                        components: [],
                    });
                    messageComponentCollector.stop();
                    break;
                }
                case `${currentTime}Forward`: {
                    await buttonInteraction.deferUpdate();
                    page = page + 1 < pages.length ? ++page : 0;
                    await updateMsg();
                    break;
                }
                case `${currentTime}Remove`: {
                    await buttonInteraction.showModal(this.modal(currentTime));
                    await sentMsg.edit({
                        components: [],
                    });
                    messageComponentCollector.stop();
                    break;
                }
                default: {
                    break;
                }
            }
        });

        messageComponentCollector.once("end", async () => {
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

    private modal = (currentTime: number) => new ModalBuilder()
        .setTitle("Add a TODO item")
        .setCustomId(`${currentTime}AddModal`)
        .addComponents(new ActionRowBuilder<ModalActionRowComponentBuilder>()
            .addComponents(new TextInputBuilder()
                .setStyle(2)
                .setMaxLength(204)
                .setMinLength(2)
                .setLabel("TODO")
                .setCustomId(`${currentTime}text1`)
                .setRequired(),
            ),
        );
}
