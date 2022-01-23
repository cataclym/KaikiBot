import {
    GuildMember,
    Message,
    MessageEmbed,
    MessageEmbedOptions,
    MessageOptions,
    StickerResolvable,
    TextChannel,
} from "discord.js";
import { parsePlaceHolders } from "./functions";

type Diff<T, U> = T extends U ? never : T;
type NotNull<T> = Diff<T, null | undefined>

interface sendMessageData {
    channel: bigint | null,
    embed: string | null,
    timeout?: number,
}

interface hasMessageData {
    channel: NotNull<bigint>,
    embed: NotNull<string>,
    timeout?: number,
}


export default class GreetHandler {
    static JSONErrorMessage = (m: Message) => ({ embeds: [new MessageEmbed()
        .setTitle("Error")
        .setDescription("Please provide valid json")
        .withErrorColor(m)] });
    static async handleGreetMessage(guildMember: GuildMember): Promise<Message | void> {

        const db = await guildMember.client.orm.guilds.findFirst({ where: { Id: BigInt(guildMember.guild.id) } });

        if (db && db.WelcomeChannel) {
            return GreetHandler.sendWelcomeLeaveMessage({
                channel: db.WelcomeChannel,
                embed: db.WelcomeMessage,
                timeout: db.WelcomeTimeout || undefined,
            }, guildMember);
        }
    }

    static async handleGoodbyeMessage(guildMember: GuildMember): Promise<Message | void> {

        const db = await guildMember.client.orm.guilds.findFirst({ where: { Id: BigInt(guildMember.guild.id) } });

        if (db && db.ByeChannel) {
            return GreetHandler.sendWelcomeLeaveMessage(<hasMessageData>{
                channel: db.ByeChannel,
                embed: db.ByeMessage,
                timeout: db.ByeTimeout || undefined,
            }, guildMember);
        }
        return;
    }

    static async createAndParseWelcomeLeaveMessage(data: hasMessageData, guildMember: GuildMember): Promise<MessageOptions> {
        return JSON.parse(await parsePlaceHolders(data.embed, guildMember));
    }

    static async sendWelcomeLeaveMessage(data: sendMessageData, guildMember: GuildMember): Promise<Message | void> {
        if (!data.channel || !data.embed) return;

        const channel = guildMember.guild.channels.cache.get(String(data.channel))
          ?? await guildMember.guild.client.channels.fetch(String(data.channel), { cache: true });

        if (channel && channel.type !== "GUILD_TEXT" && channel.type !== "GUILD_NEWS") return;

        const parsedMessageOptions = await GreetHandler.createAndParseWelcomeLeaveMessage(<hasMessageData>data, guildMember);

        return (channel as TextChannel).send(parsedMessageOptions)
            .then((m) => {
                if (data.timeout) {
                    setTimeout(() => m.delete(), data.timeout * 1000);
                    return m;
                }
                return m;
            });
    }
}

export class JSONToMessageOptions implements MessageOptions {
    constructor(any: any) {
        this.embeds = any.embeds;
        this.content = any.content;
        this.stickers = any.stickers;
    }
    embeds: (MessageEmbed | MessageEmbedOptions)[];
    content?: string | null | undefined;
    stickers?: StickerResolvable[] | undefined;
}

