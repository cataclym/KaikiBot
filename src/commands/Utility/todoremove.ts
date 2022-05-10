import { Argument } from "discord-akairo";
import { Message, MessageEmbed } from "discord.js";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";


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
            orderBy: {
                Id: "asc",
            },
        });

        if (!todos) {
            return message.channel.send("Nothing to delete.");
        }

        let removedItem = undefined;

        if (typeof toRemove === "number") {

            if ((toRemove - 1) >= todos.length) {
                return message.channel.send({
                    embeds: [new MessageEmbed()
                        .setTitle("Doesn't exist")
                        .setDescription(`No entry with Id: \`${toRemove}\``)
                        .withErrorColor(message),
                    ],
                });
            }

            // Matches given number to array item
            removedItem = await message.client.orm.todos.delete({
                select: {
                    String: true,
                },
                where: {
                    Id: todos[toRemove - 1].Id,
                },
            });

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
                    return message.channel.send("List deleted.")
                        .then(SentMsg => {
                            SentMsg.react("✅");
                            return SentMsg;
                        });
                }
                case "last": {
                    const toRemoveTodoId = todos[todos.length - 1].Id;
                    removedItem = (await message.client.orm.todos.delete({
                        select: {
                            String: true,
                        },
                        where: {
                            Id: BigInt(toRemoveTodoId),
                        },
                    }));
                    break;
                }
                case "first": {
                    const toRemoveTodoId = todos[0].Id;
                    removedItem = (await message.client.orm.todos.delete({
                        select: {
                            String: true,
                        },
                        where: {
                            Id: BigInt(toRemoveTodoId),
                        },
                    }));
                    break;
                }
            }
        }

        return message.reply({
            content: "Removed an item from list.",
            embeds: [new MessageEmbed()
                .setAuthor({ name: "Deleted:" })
                .setDescription(`\`${removedItem.String}\``)
                .withOkColor(message),
            ],
        })
            .then(SentMsg => {
                SentMsg.react("✅");
                return SentMsg;
            });
    }
}
