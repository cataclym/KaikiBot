import { AkairoModule, Command } from "discord-akairo";
import { Collection, EmbedBuilder, Message, PermissionsBitField } from "discord.js";
import { BlockedCategoriesEnum } from "../../lib/Enums/blockedCategoriesEnum";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";
import KaikiEmbeds from "../../lib/KaikiEmbeds";

class BlockedCategory<K extends string, V extends AkairoModule<any, any>> extends Collection<K, V> {
    public id: keyof typeof BlockedCategoriesEnum;

    public constructor(id: keyof typeof BlockedCategoriesEnum, iterable?: Iterable<readonly [K, V]>) {
        super(iterable);
        this.id = id;
    }
}

export default class ToggleCategoryCommand extends KaikiCommand {
    constructor() {
        super("togglecategory", {
            aliases: ["togglecategory", "tc"],
            userPermissions: PermissionsBitField.Flags.Administrator,
            channel: "guild",
            description: "Toggles a category",
            usage: "Anime",
            args: [
                {
                    id: "category",
                    type: (_, phrase) => {
                        return this.handler.categories.find((__, k) => {
                            return phrase
                                .toLowerCase()
                                .startsWith(k.toLowerCase().slice(0, Math.max(phrase.length - 1, 1)));
                        });
                    },
                    otherwise: (msg: Message) => ({ embeds: [KaikiEmbeds.genericArgumentError(msg)] }),
                },
            ],
        });
    }

    public async exec(message: Message<true>, { category }: { category: BlockedCategory<string, Command> }): Promise<Message> {

        const { guild } = message;
        const index = BlockedCategoriesEnum[category.id];

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
            embeds: [
                exists
                    ? embed.withOkColor(message)
                    : embed.withErrorColor(message),
            ],
        });
    }
}
