import { EmbedBuilder, Message, PermissionsBitField } from "discord.js";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";


export default class ToggleStickyRolesCommand extends KaikiCommand {
    constructor() {
        super("stickyroles", {
            aliases: ["stickyroles", "sticky"],
            userPermissions: PermissionsBitField.Flags.Administrator,
            channel: "guild",
            description: "Toggles whether bot will give all roles back when someone re-joins the server",
            usage: "",
        });
    }

    public async exec(message: Message<true>): Promise<Message> {

        const db = await this.client.db.getOrCreateGuild(BigInt(message.guildId));

        await this.client.guildsDb.set(message.guild.id, "StickyRoles", !!db.StickyRoles);

        return message.channel.send({
            embeds: [
                new EmbedBuilder()
                    .setDescription(`Sticky roles have been ${db.StickyRoles ? "enabled" : "disabled"}.`)
                    .withOkColor(message),
            ],
        });
    }
}
