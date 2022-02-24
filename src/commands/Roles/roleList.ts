import { sendPaginatedMessage } from "discord-js-button-pagination-ts";
import { Guild, Message, MessageEmbed, Role } from "discord.js";
import KaikiCommand from "Kaiki/KaikiCommand";


export default class RoleListCommand extends KaikiCommand {
    constructor() {
        super("rolelist", {
            aliases: ["rolelist", "roles"],
            description: "Lists all roles",
            usage: "",
            channel: "guild",
        });
    }

    public async exec(message: Message): Promise<Message> {

        const roleArray = [...(message.guild as Guild).roles.cache.values()],
            data: Role[] = roleArray
                .sort((a: Role, b: Role) => b.position - a.position || (b.id as unknown as number) - (a.id as unknown as number)),
            pages: MessageEmbed[] = [];

        if (data) {
            for (let i = 50, p = 0; p < data.length; i = i + 50, p = p + 50) {

                const dEmbed = new MessageEmbed()
                    .setTitle(`Role list (${roleArray.length})`)
                    .setAuthor({ name: message.guild!.name })
                    .addField("\u200B", data
                        .slice(p, i - 25)
                        .join("\n"), true)
                    .withOkColor(message);

                if (data.slice(p, i).length > 25) {
                    dEmbed.addField("\u200B", data
                        .slice(p + 25, i)
                        .join("\n"), true);
                }
                pages.push(dEmbed);
            }
        }
        return sendPaginatedMessage(message, pages, {});
    }
}
