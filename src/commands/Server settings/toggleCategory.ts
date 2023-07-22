import { ApplyOptions } from "@sapphire/decorators";
import { Args } from "@sapphire/framework";
import { EmbedBuilder, Message } from "discord.js";
import { CategoriesEnum } from "../../lib/Enums/categoriesEnum";
import { KaikiCommandOptions } from "../../lib/Interfaces/Kaiki/KaikiCommandOptions";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";

// TODO: Well this obviously needs to be revisited with sapphire in mind
@ApplyOptions<KaikiCommandOptions>({
    name: "togglecategory",
    aliases: ["tc"],
    description: "Toggles a category",
    usage: ["Anime"],
    requiredUserPermissions: ["Administrator"],
    preconditions: ["GuildOnly"],
})
export default class ToggleCategoryCommand extends KaikiCommand {
    public async messageRun(message: Message<true>, args: Args): Promise<Message> {

        const categoryStr = await args.rest("category");

        const { guild } = message;
        const index = CategoriesEnum[categoryStr];

        let guildDb = await this.client.orm.guilds.findFirst({
            where: {
                Id: BigInt(guild.id),
            },
            select: {
                BlockedCategories: true,
            },
        });

        if (!guildDb) {
            const obj = {
                BlockedCategories: [],
            };
            Object.assign(obj, await this.client.db.getOrCreateGuild(BigInt(message.guildId)));
            guildDb = obj;
        }

        const exists = guildDb.BlockedCategories.find(cat => cat.CategoryTarget === index);

        if (exists) {
            await this.client.orm.blockedCategories.delete({
                where: {
                    Id: exists.Id,
                },
            });
        }

        else {
            await this.client.orm.guilds.update({
                where: {
                    Id: BigInt(guild.id),
                },
                data: {
                    BlockedCategories: {
                        create: {
                            CategoryTarget: index,
                        },
                    },
                },
            });
        }

        const embed = new EmbedBuilder()
            .setDescription(`${categoryStr} has been ${exists ? "enabled" : "disabled"}.`);

        return message.channel.send({
            embeds: [
                exists
                    ? embed.withOkColor(message)
                    : embed.withErrorColor(message),
            ],
        });
    }
}
