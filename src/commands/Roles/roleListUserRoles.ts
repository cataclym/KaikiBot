import { PrefixSupplier } from "discord-akairo";
import { sendPaginatedMessage } from "discord-js-button-pagination-ts";
import { Message, MessageEmbed } from "discord.js";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";

export default class ListUserRoles extends KaikiCommand {
    constructor() {
        super("listuserroles", {
            aliases: ["listuserroles", "lur"],
            description: "List all custom assigned roles.",
            usage: "",
            prefix: (msg: Message) => {
                const p = (this.handler.prefix as PrefixSupplier)(msg);
                return [p as string, ";"];
            },
            channel: "guild",
        });
    }

    public async exec(message: Message<true>): Promise<Message> {

        const db = await this.client.orm.guildUsers.findMany({
            where: {
                GuildId: BigInt(message.guildId),
                UserRole: {
                    not: null,
                },
            },
            select: {
                UserRole: true,
                UserId: true,
            },
        });

        if (db.length) {

            const mapped = db
                    .map((table) => `${message.guild?.members.cache.get(String(table.UserId)) || table.UserId}: ${message.guild?.roles.cache.get(String(table.UserRole)) || table.UserRole}`)
                    .sort(),
                pages: MessageEmbed[] = [];

            for (let items = 20, from = 0; mapped.length > from; items += 20, from += 20) {

                const pageRoles = mapped.slice(from, items);

                pages.push(new MessageEmbed()
                    .setTitle("Custom Userroles")
                    .setDescription(pageRoles.join("\n"))
                    .withOkColor(message));
            }

            return sendPaginatedMessage(message, pages, {});
        }

        else {
            return message.channel.send({
                embeds: [new MessageEmbed()
                    .withErrorColor(message)
                    .setTitle("No user roles")
                    .setDescription("This guild has not used this feature yet.")],
            });
        }
    }
}
