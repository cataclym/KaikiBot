import {
    APIEmbed,
    ChannelType,
    EmbedBuilder,
    Guild,
    GuildMember,
    Message,
    MessageCreateOptions,
    StickerResolvable,
} from "discord.js";
import { parsePlaceHolders } from "./functions";

type Diff<T, U> = T extends U ? never : T;

interface sendMessageData {
    channel: bigint | null,
    embed: string | null,
    timeout: number | null,
}

export default class GreetHandler {
    static JSONErrorMessage = (m: Message) => ({
        embeds: [
            new EmbedBuilder()
                .setTitle("Error")
                .setDescription("Please provide valid json")
                .withErrorColor(m),
        ],
    });

    static emptyMessageOptions = (m: Message | Guild) => ({
        embeds: [
            new EmbedBuilder()
                .setTitle("No data")
                .setTitle("No welcome/bye message set.")
                .withErrorColor(m),
        ],
    });

    static async handleGreetMessage(guildMember: GuildMember): Promise<Message | void> {

        const db = await guildMember.client.db.getOrCreateGuild(BigInt(guildMember.guild.id));

        if (db.WelcomeChannel) {
            return GreetHandler.sendWelcomeLeaveMessage({
                channel: db.WelcomeChannel,
                embed: db.WelcomeMessage,
                timeout: db.WelcomeTimeout,
            }, guildMember);
        }
    }

    static async handleGoodbyeMessage(guildMember: GuildMember): Promise<Message | void> {

        const db = await guildMember.client.db.getOrCreateGuild(BigInt(guildMember.guild.id));

        if (db.ByeChannel) {
            return GreetHandler.sendWelcomeLeaveMessage({
                channel: db.ByeChannel,
                embed: db.ByeMessage,
                timeout: db.ByeTimeout,
            }, guildMember);
        }
    }

    static async createAndParseWelcomeLeaveMessage(data: sendMessageData, guildMember: GuildMember): Promise<MessageCreateOptions> {
        if (!data.embed) return GreetHandler.emptyMessageOptions(guildMember.guild);
        return JSON.parse(await parsePlaceHolders(data.embed, guildMember));
    }

    static async sendWelcomeLeaveMessage(data: sendMessageData, guildMember: GuildMember): Promise<Message | void> {
        if (!data.channel || !data.embed) return;

        const channel = guildMember.guild.channels.cache.get(String(data.channel))
            ?? await guildMember.guild.client.channels.fetch(String(data.channel), { cache: true });

        if (channel && channel.type !== ChannelType.GuildText && channel.type !== ChannelType.GuildNews || channel?.type !== ChannelType.GuildText) return;

        const parsedMessageOptions = await GreetHandler.createAndParseWelcomeLeaveMessage(<sendMessageData>data, guildMember);

        return channel.send(parsedMessageOptions)
            .then((m) => {
                if (data.timeout) {
                    setTimeout(() => m.delete(), data.timeout * 1000);
                    return m;
                }
                return m;
            });
    }
}

export type IJSONToMessageOptions = MessageCreateOptions & {
    embeds?: APIEmbed[] | undefined;
}

export class JSONToMessageOptions implements MessageCreateOptions {
    constructor(any: IJSONToMessageOptions) {
        this.incomingEmbed = any.embeds;
        this.content = any.content;
        this.stickers = any.stickers;

        this.embeds = this.incomingEmbed?.map((e) => {

            if (e.color && !Number.isInteger(e.color)) {
                e.color = parseInt(String(e.color).replace(/#/g, ""), 16);
            }

            return EmbedBuilder.from(e);
        });
    }

    incomingEmbed?: APIEmbed[] | undefined = [];
    embeds: EmbedBuilder[] | undefined;
    content?: string | undefined;
    stickers?: StickerResolvable[] | undefined;
}
