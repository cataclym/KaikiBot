import { ApplyOptions } from "@sapphire/decorators";
import { Args, UserError } from "@sapphire/framework";
import { sendPaginatedMessage } from "discord-js-button-pagination-ts";
import { EmbedBuilder, GuildMember, Message } from "discord.js";
import KaikiCommandOptions from "../../lib/Interfaces/Kaiki/KaikiCommandOptions";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";
import Constants from "../../struct/Constants";

@ApplyOptions<KaikiCommandOptions>({
    name: "names",
    aliases: ["name"],
    description:
		"Returns yours or mentioned user's daddy nicknames. Delete your nicknames with 'delete' argument.",
    usage: ["@dreb", "delete"],
    preconditions: ["GuildOnly"],
})
export default class NamesCommand extends KaikiCommand {
    private static baseEmbed = (message: Message, member: GuildMember) =>
        new EmbedBuilder()
            .setTitle(`${member.user.username}'s past names`)
            .setThumbnail(member.displayAvatarURL())
            .withOkColor(message);

    public async messageRun(
        message: Message,
        args: Args
    ): Promise<Message | void> {
        const member = <GuildMember>await args.pick("member").catch(() => {
            if (args.finished) {
                return message.member;
            }
            throw new UserError({
                identifier: "NoMemberProvided",
                message: "Couldn't find a server member with that name.",
            });
        });

        const method = await args.pick(this.argument).catch(() => null);

        if (method) {
            let deleted;
            if (message.inGuild()) {
                deleted = await this.client.orm.userNicknames.deleteMany({
                    where: {
                        GuildUsers: {
                            Guilds: {
                                Id: BigInt(message.guildId),
                            },
                        },
                    },
                });
            } else {
                deleted = await this.client.orm.userNicknames.deleteMany({
                    where: {
                        GuildUsers: {
                            UserId: BigInt(message.author.id),
                        },
                    },
                });
            }

            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(
                            `Deleted all of <@${message.author.id}>'s nicknames from ${message.inGuild() ? "this server" : "all servers"}!.\nWell done, you made daddy forget.`
                        )
                        .setFooter({
                            text: `Deleted ${deleted.count} entries.`,
                        })
                        .withOkColor(message),
                ],
            });
        }

        let nicknames;
        const pages: EmbedBuilder[] = [];

        if (message.inGuild()) {
            const db = await this.client.orm.userNicknames.findMany({
                where: {
                    GuildUsers: {
                        UserId: BigInt(member.id),
                        GuildId: BigInt(message.guildId),
                    },
                },
            });

            if (db.length) {
                nicknames = db.map((name) => name.Nickname);
            } else {
                nicknames = ["Empty"];
            }
        } else {
            const db = await this.client.orm.userNicknames.findMany({
                where: {
                    GuildUsers: {
                        UserId: BigInt(message.author.id),
                    },
                },
            });

            if (db.length) {
                nicknames = db.map((name) => name.Nickname);
            } else {
                nicknames = ["Empty"];
            }
        }

        for (
            let i = Constants.MAGIC_NUMBERS.CMDS.FUN.NAMES.NAMES_PR_PAGE, p = 0;
            p < nicknames.length;
            i += Constants.MAGIC_NUMBERS.CMDS.FUN.NAMES.NAMES_PR_PAGE,
            p += Constants.MAGIC_NUMBERS.CMDS.FUN.NAMES.NAMES_PR_PAGE
        ) {
            pages.push(
                NamesCommand.baseEmbed(message, member).setDescription(
                    nicknames.slice(p, i).join(", ")
                )
            );
        }

        return sendPaginatedMessage(message, pages, { owner: message.author });
    }

    private argument = Args.make<string>((parameter, context) => {
        if (["remove", "rem", "delete", "del"].includes(parameter)) {
            return Args.ok(parameter);
        }
        return Args.error({
            argument: context.argument,
            parameter,
        });
    });
}
