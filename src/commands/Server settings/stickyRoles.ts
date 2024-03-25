import { ApplyOptions } from "@sapphire/decorators";
import { EmbedBuilder, Message } from "discord.js";
import { KaikiCommandOptions } from "../../lib/Interfaces/Kaiki/KaikiCommandOptions";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";

@ApplyOptions<KaikiCommandOptions>({
    name: "stickyroles",
    aliases: ["sticky"],
    description:
        "Toggles whether bot will give all roles back when someone re-joins the server",
    requiredUserPermissions: ["Administrator"],
    preconditions: ["GuildOnly"],
})
export default class ToggleStickyRolesCommand extends KaikiCommand {
    public async messageRun(message: Message<true>): Promise<Message> {
        const db = await this.client.db.getOrCreateGuild(
            BigInt(message.guildId)
        );

        await this.client.guildsDb.set(
            message.guild.id,
            "StickyRoles",
            !db.StickyRoles
        );

        return message.channel.send({
            embeds: [
                new EmbedBuilder()
                    .setDescription(
                        `Sticky roles have been ${db.StickyRoles ? "enabled" : "disabled"}.`
                    )
                    .withOkColor(message),
            ],
        });
    }
}
