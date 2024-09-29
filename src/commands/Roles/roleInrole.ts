import { ApplyOptions } from "@sapphire/decorators";
import { Args } from "@sapphire/framework";
import { sendPaginatedMessage } from "discord-js-button-pagination-ts";
import { EmbedBuilder, GuildMember, Message } from "discord.js";
import KaikiCommandOptions from "../../lib/Interfaces/Kaiki/KaikiCommandOptions";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";
import Constants from "../../struct/Constants";

@ApplyOptions<KaikiCommandOptions>({
    name: "inrole",
    usage: "@Gamers",
    description: "Lists all users in role",
    preconditions: ["GuildOnly"],
})
export default class RoleInRoleCommand extends KaikiCommand {
    public async messageRun(
        message: Message<true>,
        args: Args
    ): Promise<void> {
        if (!message.member) throw new Error();

        const role = args.finished
            ? message.member.roles.highest
            : await args.rest("role");

        const data = [...role.members.values()]
            .sort(
                (a: GuildMember, b: GuildMember) =>
                    b.roles.highest.position - a.roles.highest.position ||
					(a.id as unknown as number) - (b.id as unknown as number)
            )
            .slice(0, 400);

        const pages: EmbedBuilder[] = [];

        if (data && data.length) {
            const { ROLES_PR_PAGE } =
				Constants.MAGIC_NUMBERS.CMDS.ROLES.IN_ROLE;

            for (
                let i = ROLES_PR_PAGE, p = 0;
                p < data.length;
                i += ROLES_PR_PAGE, p += ROLES_PR_PAGE
            ) {
                const currentPageUsers = data.slice(p, i),
                    emb = new EmbedBuilder()
                        .setTitle(`Users in ${role.name} (${data.length})`)
                        .setAuthor({ name: message.guild.name })
                        .setDescription(
                            currentPageUsers
                                .map(
                                    (member) =>
                                        `${member.user.username} [\`${member.id}\`]`
                                )
                                .join("\n")
                        )
                        .withOkColor(message);

                pages.push(emb);
            }
            return sendPaginatedMessage(message, pages, {});
        } else {
            return sendPaginatedMessage(
                message,
                [
                    new EmbedBuilder({
                        title: `No users in ${role.name}`,
                    }).withErrorColor(message),
                ],
                {}
            );
        }
    }
}
