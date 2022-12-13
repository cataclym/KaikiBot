import { sendPaginatedMessage } from "discord-js-button-pagination-ts";
import { EmbedBuilder, Message, User } from "discord.js";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";
import Constants from "../../struct/Constants";


export default class NamesCommand extends KaikiCommand {
    constructor() {
        super("names", {
            aliases: ["name", "names"],
            description: "Returns yours or mentioned user's daddy nicknames. Delete your nicknames with 'delete' argument.",
            usage: ["@dreb", "delete"],
        });
    }

    * args(): Generator<{ index: 0; type: "user" } | { type: (message: Message, phrase: string) => Promise<boolean> }, { method: unknown; unionUser: unknown }> {
        const method = yield {
            // TODO: figure out type of phrase
            type: async (message: Message, phrase: string) => {
                return (["remove", "rem", "delete", "del"].includes(phrase));
            },
        };
        const unionUser = yield {
            index: 0,
            type: "user",
        };

        return { unionUser, method };
    }

    private static baseEmbed = (message: Message, unionUser: User) => new EmbedBuilder()
        .setTitle(`${unionUser.username}'s past names`)
        .setThumbnail(unionUser.displayAvatarURL())
        .withOkColor(message);

    public async exec(message: Message, {
        method,
        unionUser,
    }: { method: boolean, unionUser: User }): Promise<Message | void> {

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
            }
            else {
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
                        .setDescription(`Deleted all of <@${message.author.id}>'s nicknames from ${message.inGuild() ? "this server" : "all servers"}!.\nWell done, you made daddy forget.`)
                        .setFooter({
                            text: `Deleted ${deleted.count} entries.`,
                        })
                        .withOkColor(message),
                ],
            });
        }

        if (!unionUser) {
            unionUser = message.author;
        }

        let nicknames;
        const pages: EmbedBuilder[] = [];
        if (message.inGuild()) {
            const db = await this.client.orm.userNicknames.findMany({
                where: {
                    GuildUsers: {
                        UserId: BigInt(unionUser.id),
                        GuildId: BigInt(message.guildId),
                    },
                },
            });

            if (db.length) {
                nicknames = db.map(name => name.Nickname);
            }
            else {
                nicknames = ["Empty"];
            }
        }
        else {
            const db = await this.client.orm.userNicknames.findMany({
                where: {
                    GuildUsers: {
                        UserId: BigInt(message.author.id),
                    },
                },
            });
            if (db.length) {
                nicknames = db.map(name => name.Nickname);
            }
            else {
                nicknames = ["Empty"];
            }
        }

        for (let i = Constants.MAGIC_NUMBERS.CMDS.FUN.NAMES.NAMES_PR_PAGE, p = 0;
            p < nicknames.length;
            i += Constants.MAGIC_NUMBERS.CMDS.FUN.NAMES.NAMES_PR_PAGE, p += Constants.MAGIC_NUMBERS.CMDS.FUN.NAMES.NAMES_PR_PAGE) {
            pages.push(NamesCommand.baseEmbed(message, unionUser)
                .setDescription(nicknames.slice(p, i).join(", ")));
        }

        return sendPaginatedMessage(message, pages, { owner: message.author });
    }
}
