import { Category, Command } from "discord-akairo";
import { Guild, Message, EmbedBuilder } from "discord.js";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";

import KaikiEmbeds from "../../lib/KaikiEmbeds";
import { blockedCategories } from "../../lib/enums/blockedCategories";

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

    public async exec(message: Message<true>, { category }: { category: Category<string, Command> }): Promise<Message> {

        const guild = (message.guild as Guild);
        const index = blockedCategories[category.id as keyof typeof blockedCategories];

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
            .setDescription(`${category.id} has been ${exists ? "enabled" : "disabled"}.`);

        return message.channel.send({
            embeds: [exists
                ? embed.withOkColor(message)
                : embed.withErrorColor(message)],
        });
    }
}
