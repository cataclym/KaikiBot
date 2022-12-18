import { Message } from "discord.js";
import logger from "loglevel";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";
import Constants from "../../struct/Constants";

// dad bot
export default class DadBot extends KaikiCommand {
    constructor() {
        super("dadbot", {
            channel: "guild",
            editable: false,
            condition: (message: Message) => {

                if (message.author.bot) return false;

                if (!message.member) return false;

                if (!message.guild?.isDadBotEnabled()) return false;

                if (message.member.hasExcludedRole()) return false;

                if (message.content.includes("||")) return false;

                for (const item of Constants.DadBotArray) {

                    const r = new RegExp(`(^|\\s|$)(?<statement>(?<prefix>${item})\\s*(?<nickname>.*)$)`, "mi");
                    if (r.test(message.content)) {

                        let match = message.content.match(r)?.groups?.nickname;
                        if (!match) continue;

                        const splits = match.split(new RegExp(`${item}`, "mig"));
                        if (splits.length > 1) match = splits.reduce((a, b) => a.length <= b.length && a.length > 0 ? a : b);

                        if (match.length && match.length <= (process.env.DADBOT_MAX_LENGTH || Constants.MAGIC_NUMBERS.CMDS.ETC.DAD_BOT.DADBOT_MAX_LENGTH)) {
                            if (!this.nickname.has(message.member.id)) this.nickname.set(message.member.id, match);
                        }
                    }
                }
                return this.nickname.has(message.member.id);
            },
        });
    }

    private nickname = new Map<string, string>();

    public async exec(message: Message<true>) {

        const nick = this.nickname.get(message.author.id);

        if (!nick || !message.member) return;

        message.channel.send({
            content: `Hi, ${nick}`,
            allowedMentions: {},
        });

        if (nick.length <= (process.env.DADBOT_NICKNAME_LENGTH || Constants.MAGIC_NUMBERS.CMDS.ETC.DAD_BOT.DADBOT_NICK_LENGTH)) {
            const user = message.author;
            const position = message.guild.members.me?.roles.highest.comparePositionTo(message.member.roles.highest);

            if (user.id !== message.guild?.ownerId && position ? position >= 0 : false) {
                // Avoids setting nickname on Server owners
                await message.member?.setNickname(nick)
                    .catch(() => logger.warn(`Insufficient permissions to set member's nickname [${message.member?.user.id}]`));
            }
        }

        await this.client.orm.userNicknames.create({
            data: {
                GuildUsers: {
                    connectOrCreate: {
                        create: {
                            UserId: BigInt(message.author.id),
                            GuildId: BigInt(message.guildId),
                        },
                        where: {
                            UserId_GuildId: {
                                UserId: BigInt(message.author.id),
                                GuildId: BigInt(message.guildId),
                            },
                        },
                    },
                },
                Nickname: nick,
            },
        });

        return this.nickname.delete(message.author.id);
    }
}
