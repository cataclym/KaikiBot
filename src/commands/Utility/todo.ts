import { ApplyOptions } from "@sapphire/decorators";
import { Args } from "@sapphire/framework";
import { EmbedBuilder, Message } from "discord.js";
import { KaikiCommandOptions } from "../../lib/Interfaces/Kaiki/KaikiCommandOptions";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";
import { Todo } from "../../lib/Todo/Todo";

@ApplyOptions<KaikiCommandOptions>({
    name: "todo",
    aliases: ["note"],
    usage: ["", "2"],
    description:
        "A personal todo list. The items are limited to 204 characters. Intended for small notes.",
})
export default class TodoCommand extends KaikiCommand {
    public async messageRun(message: Message<true>, args: Args) {
        let page = await args.pick("number").catch(() => 1);
        page = (page <= 1 ? 0 : page - 1) || 0;

        const emb = new EmbedBuilder()
            .setTitle("Todo")
            .setThumbnail(
                "https://cdn.discordapp.com/attachments/717045690022363229/726600392107884646/3391ce4715f3c814d6067911438e5bf7.png"
            )
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
        const { row, rowTwo, currentTime } = Todo.createButtons();

        if (!todoArray.length) {
            row.components[1].setDisabled();
            sentMsg = await message.channel.send({
                embeds: [emb.setDescription("Your list is empty.")],
                components: [row],
            });
        } else {
            const reminderArray = Todo.reminderArray(todoArray);

            for (
                let index = 10, p = 0;
                p < reminderArray.length;
                index += 10, p += 10
            ) {
                pages.push(
                    new EmbedBuilder(emb.data).setDescription(
                        reminderArray.slice(p, index).join("\n")
                    )
                );
            }

            if (page >= pages.length) page = 0;

            sentMsg = await message.channel.send({
                embeds: [pages[page]],
                // Only show arrows if necessary
                components: todoArray.length > 10 ? [row, rowTwo] : [row],
            });
        }

        new Todo(message, sentMsg, currentTime, page, pages, todoArray);
    }
}
