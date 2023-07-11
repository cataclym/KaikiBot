import {
    APIEmbed,
    ChannelType,
    EmbedBuilder,
    Guild,
    GuildMember,
    Message,
    MessageCreateOptions,
    PermissionsBitField,
    StickerResolvable, userMention,
} from "discord.js";

interface MemberMessage extends Message<true> {
    member: GuildMember
}

interface SendMessageData {
    channel: bigint | null,
    embed: string | null,
    timeout: number | null,
}

export default class GreetHandler {

    private replacements: Map<string, (m: GuildMember) => string> = new Map();
    private readonly guildMember: GuildMember;

    constructor(guildMember: GuildMember) {
        this.replacements.set("%guild%", m => m.guild.name);
        this.replacements.set("%guild.name%", m => m.guild.name);
        this.replacements.set("%guild.id%", m => m.guild.id);
        this.replacements.set("%guild.icon%", m => m.guild.iconURL() || "N/A");
        this.replacements.set("%member%", m => m.user.username);
        this.replacements.set("%member.name%", m => m.user.username);
        this.replacements.set("%member.id%", m => m.id);
        this.replacements.set("%member.mention%", m => userMention(m.id));
        this.replacements.set("%member.avatar%", m => m.user.avatarURL() || "N/A");

        this.guildMember = guildMember;
    }

    static jsonErrorMessage = (m: Message) => ({
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

    async handleGreetMessage() {

        const db = await this.guildMember.client.db.getOrCreateGuild(BigInt(this.guildMember.guild.id));

        if (!db.WelcomeChannel) {
            return
        }

        return this.sendWelcomeLeaveMessage({
            channel: db.WelcomeChannel,
            embed: db.WelcomeMessage,
            timeout: db.WelcomeTimeout,
        });
    }

    async handleGoodbyeMessage() {

        const db = await this.guildMember.client.db.getOrCreateGuild(BigInt(this.guildMember.guild.id));

        if (!db.ByeChannel) {
            return;
        }

        return this.sendWelcomeLeaveMessage({
            channel: db.ByeChannel,
            embed: db.ByeMessage,
            timeout: db.ByeTimeout,
        });
    }

    async createAndParseGreetMsg(data: SendMessageData): Promise<MessageCreateOptions> {
        if (!data.embed) {
            return GreetHandler.emptyMessageOptions(this.guildMember.guild);
        }
        const messageOptions: MessageCreateOptions = JSON.parse(await this.parsePlaceHolders(data.embed));

        if (!messageOptions.embeds?.every(object => !!Object.keys(object).length)) {
            messageOptions.embeds = undefined;
        }

        return messageOptions;
    }

    async sendWelcomeLeaveMessage(data: SendMessageData) {

        if (!data.channel || !data.embed) return false;

        const channel = this.guildMember.guild.channels.cache.get(String(data.channel))
            ?? await this.guildMember.guild.client.channels.fetch(String(data.channel), { cache: true });

        if (!channel) return false;

        if (channel.type !== ChannelType.GuildText && channel.type !== ChannelType.GuildNews) return false;

        if (!channel.permissionsFor(this.guildMember.client.user)?.has(PermissionsBitField.Flags.SendMessages)) return false;

        const parsedMessageOptions = await this.createAndParseGreetMsg(<SendMessageData>data);

        return channel.send(parsedMessageOptions)
            .then(m => {
                if (data.timeout) {
                    setTimeout(() => m.delete(), data.timeout * 1000);
                    return m;
                }
                return m;
            });
    }

    private async parsePlaceHolders(input: string) {

        const lowercase = input.toLowerCase();

        for (const [key, value] of this.replacements) {
            if (lowercase.includes(key)) {
                const regex = new RegExp(key, "ig");
                input = input.replace(regex, value(this.guildMember));
            }
        }
        return input;
    }

    static assertMessageMember(message: Message<true>): message is MemberMessage {
        if (message.member) return true;
        return false;
    }
}

export type IJSONToMessageOptions = MessageCreateOptions & {
    embeds?: APIEmbed[] | undefined;
}

export class JSONToMessageOptions implements MessageCreateOptions {
    embeds: EmbedBuilder[] | undefined;
    content?: string | undefined;
    stickers?: StickerResolvable[] | undefined;

    constructor(any: IJSONToMessageOptions) {
        this.content = any.content;
        this.stickers = any.stickers;

        this.embeds = any.embeds
            ? any.embeds.map((e: APIEmbed) => {

                if (e.color && !Number.isInteger(e.color)) {
                    e.color = parseInt(String(e.color).replace(/#/g, ""), 16);
                }

                return EmbedBuilder.from(e);
            })
            : undefined;
    }

}
