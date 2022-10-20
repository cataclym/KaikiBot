import { Argument, Flag, FlagType, PrefixSupplier } from "discord-akairo";
import { sendPaginatedMessage } from "discord-js-button-pagination-ts";
import { EmbedBuilder, Message } from "discord.js";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";

import Utility from "../../lib/Utility";

export default class TodoCommand extends KaikiCommand {
    constructor() {
        super("todo", {
            aliases: ["todo", "note"],
            description: "A personal todo list. The items are limited to 204 characters. Intended for small notes.",
            usage: ["", "add make cake 07/07/2020", "remove 5", "remove last", "remove first", "remove all", "rm 1", "2"],
        });
    }

    * args(): Generator<{ type: string[][] } | { unordered: true; default: 1; type: "number" }, { page: any } | Flag<FlagType.Continue>, string> {
        const method = yield {
            type: [
                ["add"],
                ["remove", "rem", "delete", "del", "rm"],
            ],
        };
        const page = yield {
            type: "number",
            default: 1,
            unordered: true,
        };

        if (!Argument.isFailure(method)) {
            return Flag.continue(method);
        }
        return { page };
    }

    public async exec(message: Message, { page }: { page: number }): Promise<Message> {

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
                embeds: [
                    emb
                        .setDescription("Your list is empty."),
                ],
            });
        }

        const reminderArray = todoArray.map((todo, i) => `${+i + 1}. ${Utility.trim(todo.String.split(/\r?\n/).join(" "), 204)}`);
        const pages = [];

        for (let index = 10, p = 0; p < reminderArray.length; index += 10, p += 10) {
            pages.push(EmbedBuilder.from(emb)
                .setDescription(reminderArray
                    .slice(p, index).join("\n"),
                ),
            );
        }

        return await sendPaginatedMessage(message, pages, { owner: message.author }, page - 1);
    }
}
