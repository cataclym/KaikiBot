import { sendPaginatedMessage } from "discord-js-button-pagination-ts";
import { GuildMember, Message, MessageEmbed, Role } from "discord.js";
import { KaikiCommand } from "kaiki";
import { Argument } from "discord-akairo";
import KaikiEmbeds from "../../lib/KaikiEmbeds";


export default class RoleInRoleCommand extends KaikiCommand {
    constructor() {
        super("inrole", {
            aliases: ["inrole"],
            description: "Lists all users in role",
            usage: "",
            channel: "guild",
            args: [{
                id: "role",
                type: Argument.union("role", (m, p) => p?.length
                    ? undefined
                    : m.member?.roles.highest),
                match: "content",
                otherwise: (m) => ({ embeds: [KaikiEmbeds.roleArgumentError(m)] }),
            }],
        });
    }

    public async exec(message: Message, { role }: { role: Role }): Promise<Message> {

        const data = [...role.members.values()]
            .sort((a: GuildMember, b: GuildMember) => b.roles.highest.position - a.roles.highest.position
                || (a.id as unknown as number) - (b.id as unknown as number))
            .slice(0, 400);

        const pages: MessageEmbed[] = [];

        if (data && data.length) {

            for (let i = 40, p = 0; p < data.length; i += 40, p += 40) {

                const currentPageUsers = data.slice(p, i),
                    emb = new MessageEmbed()
                        .setTitle(`Users in ${role.name} (${data.length})`)
                        .setAuthor({ name: message.guild!.name })
                        .addField("•", currentPageUsers
                            .slice(0, 20)
                            .map(u => `${u.user} - ${u.user.username}`)
                            .join("\n"), true)
                        .withOkColor(message);

                if (currentPageUsers.length > 20) {
                    emb.addField("•", currentPageUsers
                        .slice(20, 40)
                        .map(u => `${u.user} - ${u.user.username}`)
                        .join("\n"), true);
                }
                pages.push(emb);
            }
            return sendPaginatedMessage(message, pages, {});

        }
        else {
            return sendPaginatedMessage(message, [new MessageEmbed({
                title: `No users in ${role.name}`,
            })
                .withErrorColor(message)], {});
        }
    }
}
