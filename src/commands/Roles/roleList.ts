import { ApplyOptions } from "@sapphire/decorators";
import { sendPaginatedMessage } from "discord-js-button-pagination-ts";
import { EmbedBuilder, Guild, Message, Role } from "discord.js";
import KaikiCommandOptions from "../../lib/Interfaces/Kaiki/KaikiCommandOptions";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";
import Constants from "../../struct/Constants";

@ApplyOptions<KaikiCommandOptions>({
    name: "rolelist",
    aliases: ["roles"],
    usage: "",
    description: "Lists all roles",
    preconditions: ["GuildOnly"],
})
export default class RoleListCommand extends KaikiCommand {
    public async messageRun(message: Message<true>): Promise<Message> {
        const roleArray = [...(message.guild as Guild).roles.cache.values()];
        const pages: EmbedBuilder[] = [];
        const { ROLES_PR_PAGE } = Constants.MAGIC_NUMBERS.CMDS.ROLES.ROLE_LIST;
        const data = roleArray.sort(
            (a: Role, b: Role) =>
                b.position - a.position || Number(b.id) - Number(a.id)
        );

        if (data) {
            for (
                let i = ROLES_PR_PAGE, p = 0;
                p < data.length;
                i += ROLES_PR_PAGE, p += ROLES_PR_PAGE
            ) {
                const currentPageRoles = data.slice(p, i);

                const embedBuilder = new EmbedBuilder()
                    .setTitle(`Role list (${data.length})`)
                    .setAuthor({ name: message.guild.name })
                    .setDescription(
                        currentPageRoles
                            .map((role) => `${role.name} [\`${role.id}\`]`)
                            .join("\n")
                    )
                    .withOkColor(message);

                pages.push(embedBuilder);
            }
        }
        return sendPaginatedMessage(message, pages, {});
    }
}
