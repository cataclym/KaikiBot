import { ApplyOptions } from "@sapphire/decorators";
import { sendPaginatedMessage } from "discord-js-button-pagination-ts";
import { EmbedBuilder, Message } from "discord.js";
import { KaikiCommandOptions } from "../../lib/Interfaces/Kaiki/KaikiCommandOptions";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";
import Constants from "../../struct/Constants";

@ApplyOptions<KaikiCommandOptions>({
    name: "listuserroles",
    aliases: ["lur"],
    usage: "",
    description: "List all custom user roles.",
    preconditions: ["GuildOnly"],
})
export default class ListUserRoles extends KaikiCommand {
    public async messageRun(message: Message<true>): Promise<Message> {
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
            const { ROLE_PR_PAGE } =
                Constants.MAGIC_NUMBERS.CMDS.ROLES.USER_ROLES;

            const mapped = db
                    .map(
                        (table) =>
                            `${message.guild?.members.cache.get(String(table.UserId)) || table.UserId} [\`${message.guild?.roles.cache.get(String(table.UserRole)) || table.UserRole}\`]`
                    )
                    .sort(),
                pages: EmbedBuilder[] = [];

            for (
                let items = ROLE_PR_PAGE, from = 0;
                mapped.length > from;
                items += ROLE_PR_PAGE, from += ROLE_PR_PAGE
            ) {
                const pageRoles = mapped.slice(from, items);

                pages.push(
                    new EmbedBuilder()
                        .setTitle("Custom Userroles")
                        .setDescription(pageRoles.join("\n"))
                        .withOkColor(message)
                );
            }

            return sendPaginatedMessage(message, pages, {});
        } else {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .withErrorColor(message)
                        .setTitle("No user roles")
                        .setDescription(
                            "This guild has not used this feature yet."
                        ),
                ],
            });
        }
    }
}
