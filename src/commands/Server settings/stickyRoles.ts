import { Guild, Message, MessageEmbed } from "discord.js";
import { KaikiCommand } from "kaiki";
import { getGuildDocument } from "../../struct/documentMethods";

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
    public async exec(message: Message): Promise<Message> {

        const guild = (message.guild as Guild),
            db = await getGuildDocument(guild.id),
            bool = !db.settings.stickyRoles;

        await this.client.guildProvider.set(message.guild!.id, "StickyRoles", bool);

        db.settings.stickyRoles = bool;
        db.markModified("settings.stickyRoles");
        await db.save();

        return message.channel.send({
            embeds: [new MessageEmbed()
                .setDescription(`Sticky roles have been ${bool ? "enabled" : "disabled"}.`)
                .withOkColor(message)],
        });
    }
}
