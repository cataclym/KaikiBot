import { Message } from "discord.js";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";
import { dadBotArray } from "../../struct/constants";

// dad bot
export default class dadBot extends KaikiCommand {
    constructor() {
        super("dadbot", {
            channel: "guild",
            editable: false,
            condition: (message: Message) => {
                if (message.guild && message.member && !message.author.bot) {
                    if (message.guild.isDadBotEnabled(message) && message.member.hasExcludedRole() && !message.content.includes("||")) {

                        for (const item of dadBotArray) {

                            const r = new RegExp(`(^|\\s|$)(?<statement>(?<prefix>${item})\\s*(?<nickname>.*)$)`, "mi");
                            if (r.test(message.content)) {

                                let match = message.content.match(r)?.groups?.nickname;
                                if (!match) continue;

                                const splits = match.split(new RegExp(`${item}`, "mig"));
                                if (splits.length > 1) match = splits.reduce((a, b) => a.length <= b.length && a.length > 0 ? a : b);

                                if (match.length && match.length <= (process.env.DADBOT_MAX_LENGTH || 256)) {
                                    if (!this.nickname.has(message.member.id)) this.nickname.set(message.member.id, match);
                                }
                            }
                        }
                        return this.nickname.has(message.member.id);
                    }
                }
                return false;
            },
        });
    }

    private nickname = new Map<string, string>();

    public async exec(message: Message<true>) {

        const nick = this.nickname.get(message.author.id);

        if (!nick) return;

        message.channel.send({
            content: `Hi, ${nick}`,
            allowedMentions: {},
        });

        if (nick.length <= (process.env.DADBOT_NICKNAME_LENGTH || 32)) {
            const user = message.author;

            if (user.id !== message.guild?.ownerId) {
                // Avoids setting nickname on Server owners
                await message.member?.setNickname(nick);
            }
        }

        await this.client.orm.userNicknames.create({
            data: {
                GuildUsers: {
                    connect: {
                        UserId_GuildId: {
                            UserId: BigInt(message.author.id),
                            GuildId: BigInt(message.guildId),
                        },
                    },
                },
                Nickname: nick,
            },
        });

        return this.nickname.delete(message.author.id);
    }
}
