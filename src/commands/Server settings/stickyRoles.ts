import { Message, MessageEmbed } from "discord.js";
import KaikiCommand from "Kaiki/KaikiCommand";

export default class ToggleStickyRolesCommand extends KaikiCommand {
    constructor() {
        super("stickyroles", {
            aliases: ["stickyroles", "sticky"],
            userPermissions: "ADMINISTRATOR",
            channel: "guild",
            description: "Toggles whether bot will give all roles back when someone re-joins the server",
            usage: "",
        });
    }
    public async exec(message: Message<true>): Promise<Message> {

        const db = await this.client.orm.guilds.findUnique({
            where: {
                Id: BigInt(message.guildId),
            },
            select: {
                StickyRoles: true,
            },
        });

        await this.client.guildProvider.set(message.guild!.id, "StickyRoles", !!db?.StickyRoles);

        return message.channel.send({
            embeds: [new MessageEmbed()
                .setDescription(`Sticky roles have been ${db?.StickyRoles ? "enabled" : "disabled"}.`)
                .withOkColor(message)],
        });
    }
}
