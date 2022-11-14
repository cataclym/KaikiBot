import { EmbedBuilder, GuildEmoji, Message, PermissionsBitField } from "discord.js";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";
import KaikiEmbeds from "../../lib/KaikiEmbeds";

export default class EmoteReactCommand extends KaikiCommand {
    constructor() {
        super("addemotereact", {
            aliases: ["addemotereact", "emotereact", "aer"],
            userPermissions: PermissionsBitField.Flags.ManageEmojisAndStickers,
            clientPermissions: PermissionsBitField.Flags.AddReactions,
            channel: "guild",
            description: "Add triggers for the bot to react with emojis/emotes to. Use quotes for triggers with spaces.",
            usage: ["red :red:", "anime :weeaboosgetout:"],
            args: [
                {
                    id: "trigger",
                    type: "string",
                    otherwise: (m: Message) => ({ embeds: [KaikiEmbeds.genericArgumentError(m)] }),
                },
                {
                    id: "emoji",
                    type: "emoji",
                    otherwise: (m: Message) => ({ embeds: [KaikiEmbeds.genericArgumentError(m)] }),
                },
            ],
        });
    }

    public async exec(message: Message<true>, {
        trigger,
        emoji,
    }: { trigger: string, emoji: GuildEmoji }): Promise<Message> {

        trigger = trigger.toLowerCase();

        await this.client.orm.emojiReactions.create({
            data: {
                Guilds: {
                    connectOrCreate: {
                        where: {
                            Id: BigInt(message.guildId),
                        },
                        create: {
                            Id: BigInt(message.guildId),
                            Prefix: process.env.PREFIX || ";",
                        },
                    },
                },
                EmojiId: BigInt(emoji.id),
                TriggerString: trigger,
            },
        });


        if (!this.client.cache.emoteReactCache.get(message.guildId)) await this.client.cache.populateERCache(message);

        if (trigger.includes(" ")) {
            this.client.cache.emoteReactCache.get(message.guildId)?.get("has_space")?.set(trigger, emoji.id);
        }

        else {
            this.client.cache.emoteReactCache.get(message.guildId)?.get("no_space")?.set(trigger, emoji.id);
        }

        return message.channel.send({
            embeds: [
                new EmbedBuilder()
                    .setTitle("New emoji trigger added")
                    .setDescription(`Typing \`${trigger}\` will force me to react with ${emoji}...`)
                    .setThumbnail(emoji.url)
                    .withOkColor(message),
            ],
        });
    }
}
