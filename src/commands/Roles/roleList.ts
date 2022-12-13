import { sendPaginatedMessage } from "discord-js-button-pagination-ts";
import { EmbedBuilder, Guild, Message, Role } from "discord.js";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";
import Constants from "../../struct/Constants";


export default class RoleListCommand extends KaikiCommand {
    constructor() {
        super("rolelist", {
            aliases: ["rolelist", "roles"],
            description: "Lists all roles",
            usage: "",
            channel: "guild",
        });
    }

    public async exec(message: Message<true>): Promise<Message> {

        const roleArray = [...(message.guild as Guild).roles.cache.values()],
            data: Role[] = roleArray
                .sort((a: Role, b: Role) => b.position - a.position || (b.id as unknown as number) - (a.id as unknown as number)),
            pages: EmbedBuilder[] = [];

        const { ROLES_PR_PAGE } = Constants.MAGIC_NUMBERS.CMDS.ROLES.ROLE_LIST;

        if (data) {
            for (let i = ROLES_PR_PAGE, p = 0; p < data.length; i = i + ROLES_PR_PAGE, p = p + ROLES_PR_PAGE) {

                const dEmbed = new EmbedBuilder()
                    .setTitle(`Role list (${roleArray.length})`)
                    .setAuthor({ name: message.guild.name })
                    .addFields({
                        name: "\u200B",
                        value: data
                            .slice(p, i - (ROLES_PR_PAGE / 2))
                            .join("\n"),
                        inline: true,
                    })
                    .withOkColor(message);

                if (data.slice(p, i).length > (ROLES_PR_PAGE / 2)) {
                    dEmbed.addFields({
                        name: "\u200B",
                        value: data
                            .slice(p + (ROLES_PR_PAGE / 2), i)
                            .join("\n"),
                        inline: true,
                    });
                }
                pages.push(dEmbed);
            }
        }
        return sendPaginatedMessage(message, pages, {});
    }
}
