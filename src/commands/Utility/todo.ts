import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, EmbedBuilder, Message } from "discord.js";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";
import { ButtonAdd } from "../../lib/Todo/Buttons/Add";
import { ButtonRemove } from "../../lib/Todo/Buttons/Remove";
import { Todo } from "../../lib/Todo/Todo";

export default class TodoCommand extends KaikiCommand {
    constructor() {
        super("todo", {
            aliases: ["todo", "note"],
            description: "A personal todo list. The items are limited to 204 characters. Intended for small notes.",
            args: [
                {
                    id: "page",
                    type: "integer",
                    default: 1,
                },
            ],
        });
    }

    public async exec(message: Message<true>, { page }: { page: number }) {

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
                    .setEmoji("⬅")
                    .setStyle(2),
            )
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`${currentTime}Forward`)
                    .setEmoji("➡")
                    .setStyle(2),
            );

        const emb = new EmbedBuilder()
            .setTitle("Todo")
            .setThumbnail("https://cdn.discordapp.com/attachments/717045690022363229/726600392107884646/3391ce4715f3c814d6067911438e5bf7.png")
            .withOkColor(message);

        const todoArray = await message.client.orm.todos.findMany({
            where: {
                DiscordUsers: {
                    UserId: BigInt(message.author.id),
                },
            },
            orderBy: {
                Id: "asc",
            },
        });

        let sentMsg: Message<true>;
        const pages: EmbedBuilder[] = [];

        if (!todoArray.length) {
            sentMsg = await message.channel.send({
                embeds: [emb.setDescription("Your list is empty.")],
                components: [row],
            });
        }

        else {

            const reminderArray = Todo.reminderArray(todoArray);
            if (page >= pages.length) page = 0;

            for (let index = 10, p = 0; p < reminderArray.length; index += 10, p += 10) {
                pages.push(new EmbedBuilder(emb.data)
                    .setDescription(reminderArray
                        .slice(p, index)
                        .join("\n"),
                    ),
                );
            }

            sentMsg = await message.channel.send({
                embeds: [pages[page]],
                // Only show arrows if necessary
                components: todoArray.length > 10
                    ? [row, row2]
                    : [row],
            });
        }

        const buttonArray = [`${currentTime}Add`, `${currentTime}Backward`, `${currentTime}Clear`, `${currentTime}Forward`, `${currentTime}Remove`];

        const messageComponentCollector = sentMsg.createMessageComponentCollector({
            filter: (i) => {
                if (buttonArray.includes(i.customId) && message.author.id === i.user.id) {
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
                    messageComponentCollector.stop();
                    await ButtonAdd.Add(buttonInteraction, currentTime, todoArray, sentMsg);
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
                    messageComponentCollector.stop();
                    await ButtonRemove.Remove(buttonInteraction, currentTime, todoArray, sentMsg);
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
}
