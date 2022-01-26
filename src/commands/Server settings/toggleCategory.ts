import { Category, Command } from "discord-akairo";
import { Guild, Message, MessageEmbed } from "discord.js";
import { KaikiCommand } from "kaiki";
import KaikiEmbeds from "../../lib/KaikiEmbeds";
import { blockedCategories } from "../../struct/constants";

export default class ToggleCategoryCommand extends KaikiCommand {
    constructor() {
        super("togglecategory", {
            aliases: ["togglecategory", "tc"],
            userPermissions: "ADMINISTRATOR",
            channel: "guild",
            description: "Toggles a category",
            usage: "Anime",
            args: [{
                id: "category",
                type: (_, phrase) => {
                    return this.handler.categories.find((__, k) => {
                        k = k.toLowerCase();
                        return phrase
                            .toLowerCase()
                            .startsWith(k.slice(0, Math.max(phrase.length - 1, 1)));
                    });
                },
                otherwise: (msg: Message) => ({ embeds: [KaikiEmbeds.genericArgumentError(msg)] }),
            }],
        });
    }
    public async exec(message: Message, { category }: { category: Category<string, Command> }): Promise<Message> {

        const guild = (message.guild as Guild);
        const index = blockedCategories[category.id as keyof typeof blockedCategories];

        const guildDb = await this.client.orm.guilds.findFirst({
            where: {
                Id: BigInt(guild.id),
            },
            select: {
                BlockedCategories: true,
            },
        });

        if (!guildDb) {
            return message.channel.send({
                embeds: [await KaikiEmbeds.errorMessage(message, "Guild is not registered in DB! Contact bot owner as soon as possible.")],
            });
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

        const embed = new MessageEmbed()
            .setDescription(`${category.id} has been ${exists ? "enabled" : "disabled"}.`);

        return message.channel.send({
            embeds: [exists
                ? embed.withOkColor(message)
                : embed.withErrorColor(message)],
        });
    }
}
