import { ApplyOptions } from "@sapphire/decorators";
import { Args } from "@sapphire/framework";
import { EmbedBuilder, Message } from "discord.js";
import { KaikiCommandOptions } from "../../lib/Interfaces/Kaiki/KaikiCommandOptions";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";
import KaikiUtil from "../../lib/KaikiUtil";
import Roles from "../../lib/Roles";
import Constants from "../../struct/Constants";

@ApplyOptions<KaikiCommandOptions>({
    name: "restore",
    description: "Restores roles for a user who has previously left the server.",
    usage: ["@dreb"],
    requiredUserPermissions: ["Administrator"],
    requiredClientPermissions: ["ManageRoles"],
    preconditions: ["GuildOnly"],
})
export default class RestoreUserRoles extends KaikiCommand {
    public async messageRun(message: Message, args: Args): Promise<Message | void> {

        const member = await args.rest("member");

        const result = await Roles.restoreUserRoles(member);

        if (!result) {
            return;
        }

        else if (result.success) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(`Restored roles of \`${member.user.username}\` [${member.id}]`)
                        .addFields({
                            name: "Roles added",
                            value: KaikiUtil.trim(result.roles.join("\n"), Constants.MAGIC_NUMBERS.EMBED_LIMITS.FIELD.VALUE),
                        })
                        .withOkColor(message),
                ],
            });
        }

        else if (result.roles) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setDescription("This member already has all the roles.")
                        .withErrorColor(message),
                ],
            });
        }

        else {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setDescription("This user's roles have not been saved, or they have not left the guild.")
                        .withErrorColor(message),
                ],
            });
        }
    }
}
