import { Argument } from "discord-akairo";
import { Message, MessageEmbed } from "discord.js";
import KaikiCommand from "Kaiki/KaikiCommand";

export default class todoRemoveCommand extends KaikiCommand {
    constructor() {
        super("remove", {
            args: [
                {
                    id: "toRemove",
                    index: 0,
                    type: Argument.union("integer", ["first", "last", "all"]),
                    otherwise: "Please specify number to delete from list, or `first`/`last`/`all`",
                },
            ],
        });
    }

    public async exec(message: Message, { toRemove }: { toRemove: number | "first" | "last" | "all" }): Promise<Message> {

        const { author } = message, todos = await message.client.orm.todos.findMany({
            where: {
                DiscordUsers: {
                    UserId: BigInt(author.id),
                },
            },
        });

        if (!todos) {
            return message.channel.send("Nothing to delete.");
        }

        let removedItem = undefined;

        if (typeof toRemove === "number") {
            // Matches given number to array item
            removedItem = todos.splice(toRemove - 1, 1).toString();
        }

        else {
            switch (toRemove) {
                case "all": {
                    await message.client.orm.todos.deleteMany({
                        where: {
                            DiscordUsers: {
                                UserId: BigInt(author.id),
                            },
                        },
                    });
                    break;
                }
                case "last": {
                    const toRemoveTodoId = Math.max(...todos.map(t => Number(t.Id)));
                    removedItem = (await message.client.orm.todos.delete({
                        select: {
                            String: true,
                        },
                        where: {
                            Id: BigInt(toRemoveTodoId),
                        },
                    }))
                        .String;
                    break;
                }
                case "first": {
                    const toRemoveTodoId = Math.min(...todos.map(t => Number(t.Id)));
                    removedItem = (await message.client.orm.todos.delete({
                        select: {
                            String: true,
                        },
                        where: {
                            Id: BigInt(toRemoveTodoId),
                        },
                    }))
                        .String;
                    break;
                }
            }
        }

        if (!removedItem) {
            return message.channel.send("List deleted.")
                .then(SentMsg => {
                    SentMsg.react("✅");
                    return SentMsg;
                });
        }

        else {
            return message.reply({
                content: "Removed an item from list.",
                embeds: [new MessageEmbed()
                    .setAuthor({ name: "Deleted:" })
                    .setDescription(`\`${removedItem}\``)
                    .withOkColor(message),
                ],
            })
                .then(SentMsg => {
                    SentMsg.react("✅");
                    return SentMsg;
                });
        }
    }
}
