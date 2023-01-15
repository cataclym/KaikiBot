import { sendPaginatedMessage } from "discord-js-button-pagination-ts";
import { EmbedBuilder, Message, PermissionsBitField } from "discord.js";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";
import Constants from "../../struct/Constants";

export default class ServerList extends KaikiCommand {
    constructor() {
        super("serverlist", {
            aliases: ["serverlist", "listservers"],
            description: "Lists all servers the bot is in. 15 servers per page.",
            clientPermissions: PermissionsBitField.Flags.SendMessages,
            usage: ["", "7"],
        });
    }

    public async exec(message: Message) {

        const { GUILDS_PER_PAGE } = Constants.MAGIC_NUMBERS.CMDS.UTILITY.SERVER_LIST;
        const pages = [];
        const embed = new EmbedBuilder()
            .setDescription("Server list")
            .setTitle(`Total Servers: ${this.client.guilds.cache.size}`)
            .withOkColor(message);


        for (let from = 0, to = GUILDS_PER_PAGE, guilds = [...this.client.guilds.cache.values()];
            from <= guilds.length;
            from += GUILDS_PER_PAGE, to += GUILDS_PER_PAGE) {

            const currentPageGuilds = guilds
                .slice(from, to);

            const emb = EmbedBuilder.from(embed)

            currentPageGuilds.forEach(guild => {
                emb.addFields({
                    name: guild.name,
                    value: `ID: ${guild.id}\nMembers: ${guild.memberCount}\nShard: ${guild.shardId}`,
                    inline: true,
                });
            });

            pages.push(emb);
        }

        return sendPaginatedMessage(message, pages, { owner: message.author });
    }
}
