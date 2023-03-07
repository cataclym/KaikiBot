import { ApplyOptions } from "@sapphire/decorators";
import { Message } from "discord.js";
import logger from "loglevel";
import { KaikiCommandOptions } from "../../lib/Interfaces/KaikiCommandOptions";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";
import Constants from "../../struct/Constants";

@ApplyOptions<KaikiCommandOptions>({
    preconditions: ["GuildOnly"],
})
export default class DadBot extends KaikiCommand {

    public static nickname = new Map<string, string>();

    public async messageRun(message: Message<true>) {

        const nick = DadBot.nickname.get(message.author.id);

        if (!nick || !message.member) return;

        await message.channel.send({
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

        return DadBot.nickname.delete(message.author.id);
    }
}
