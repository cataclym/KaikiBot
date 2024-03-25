import { ApplyOptions } from "@sapphire/decorators";
import { Args } from "@sapphire/framework";
import { EmbedBuilder, Message } from "discord.js";
import { KaikiCommandOptions } from "../../lib/Interfaces/Kaiki/KaikiCommandOptions";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";

@ApplyOptions<KaikiCommandOptions>({
    name: "rolecreate",
    aliases: ["createrole", "rc", "cr"],
    description: "Creates a role with a given name.",
    usage: ["GAMERS"],
    requiredUserPermissions: ["ManageRoles"],
    requiredClientPermissions: ["ManageRoles"],
    preconditions: ["GuildOnly"],
})
export default class RoleCreateCommand extends KaikiCommand {
    public async messageRun(message: Message, args: Args): Promise<Message> {
        const name = await args.rest("string");

        const createdRole = await message.guild?.roles.create({
            name: name.substring(0, 32),
        });

        if (!createdRole) {
            throw new Error("Role creation failed.");
        }

        return message.channel.send({
            embeds: [
                new EmbedBuilder({
                    title: "Success!",
                    description: `Created ${createdRole}!`,
                    fields: [
                        {
                            name: "Name",
                            value: createdRole.name,
                        },
                        {
                            name: "ID",
                            value: createdRole.id,
                        },
                    ],
                }).withOkColor(message),
            ],
        });
    }
}
