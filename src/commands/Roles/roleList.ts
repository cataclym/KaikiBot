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

        const roleArray = [...(message.guild as Guild).roles.cache.values()];
        const pages: EmbedBuilder[] = [];
        const { ROLES_PR_PAGE } = Constants.MAGIC_NUMBERS.CMDS.ROLES.ROLE_LIST;
        const data = roleArray
            .sort((a: Role, b: Role) => b.position - a.position || Number(b.id) - Number(a.id))
            .map(role => role.name);

        if (data) {
            for (let i = ROLES_PR_PAGE, p = 0; p < data.length; i += ROLES_PR_PAGE, p += ROLES_PR_PAGE) {

                const currentPageRoles = data.slice(p, i);

                const dEmbed = new EmbedBuilder()
                    .setTitle(`Role list (${data.length})`)
                    .setAuthor({ name: message.guild.name })
                    .addFields({
                        name: `Column ${((pages.length + 1) * 2) - 1}`,
                        value: currentPageRoles
                            .slice(0, ROLES_PR_PAGE / 2)
                            .join("\n"),
                        inline: true,
                    })
                    .withOkColor(message);

                if (currentPageRoles.length > (ROLES_PR_PAGE / 2)) {
                    dEmbed.addFields({
                        name: `Column ${(pages.length + 1) * 2}`,
                        value: currentPageRoles
                            .slice(ROLES_PR_PAGE / 2, ROLES_PR_PAGE)
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
