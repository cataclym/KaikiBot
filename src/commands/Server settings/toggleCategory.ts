import { ApplyOptions } from "@sapphire/decorators";
import { Args, UserError } from "@sapphire/framework";
import { EmbedBuilder, Message } from "discord.js";
import { CategoriesEnum } from "../../lib/Enums/categoriesEnum";
import { KaikiCommandOptions } from "../../lib/Interfaces/Kaiki/KaikiCommandOptions";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";

// TODO: Well this obviously needs to be revisited with sapphire in mind
@ApplyOptions<KaikiCommandOptions>({
    name: "togglecategory",
    aliases: ["tc"],
    description:
        "Toggles a category. Provide no parameter to see a list of disabled categories.",
    usage: ["Anime", ""],
    requiredUserPermissions: ["Administrator"],
    preconditions: ["GuildOnly"],
})
export default class ToggleCategoryCommand extends KaikiCommand {
    public async messageRun(
        message: Message<true>,
        args: Args
    ): Promise<Message> {
        if (args.finished) {
            const blockedCategories =
                await message.client.orm.blockedCategories.findMany({
                    where: { GuildId: BigInt(message.guildId) },
                });

            if (!blockedCategories.length) {
                throw new UserError({
                    identifier: "NoCategoriesDisabled",
                    message: "This server has not disabled any categories.",
                });
            }

            const categories = blockedCategories
                .map((e) => CategoriesEnum[e.CategoryTarget])
                .filter(Boolean)
                .join("\n");

            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Disabled categories")
                        .setDescription(categories)
                        .withOkColor(),
                ],
            });
        }

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
            Object.assign(
                obj,
                await this.client.db.getOrCreateGuild(BigInt(message.guildId))
            );
            guildDb = obj;
        }

        const exists = guildDb.BlockedCategories.find(
            (cat) => cat.CategoryTarget === index
        );

        if (exists) {
            await this.client.orm.blockedCategories.delete({
                where: {
                    Id: exists.Id,
                },
            });
        } else {
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

        const embed = new EmbedBuilder().setDescription(
            `${categoryStr} has been ${exists ? "enabled" : "disabled"}.`
        );

        return message.channel.send({
            embeds: [
                exists
                    ? embed.withOkColor(message)
                    : embed.withErrorColor(message),
            ],
        });
    }
}
