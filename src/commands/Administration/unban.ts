import { Argument, Command } from "discord-akairo";
import { Snowflake } from "discord-api-types/globals";
import { Message, EmbedBuilder, Permissions, User } from "discord.js";

export default class UnbanCommand extends Command {
    constructor() {
        super("unban", {
            aliases: ["unban", "ub"],
            userPermissions: Permissions.FLAGS.BAN_MEMBERS,
            clientPermissions: Permissions.FLAGS.BAN_MEMBERS,
            channel: "guild",
            args: [
                {
                    id: "user",
                    type: Argument.union("member", "user", async (_, phrase) => {
                        const u = await this.client.users.fetch(phrase as Snowflake);
                        return u || null;
                    }),
                    otherwise: (m: Message) => ({ embeds: [new EmbedBuilder({
                        description: "Can't find this user.",
                    })
                        .withErrorColor(m)] }),
                },
            ],
        });
    }
    public async exec(message: Message, { user }: { user: User }): Promise<Message> {

        const bans = (message.guild?.bans.cache.size
            ? message.guild?.bans.cache
            : await message.guild?.bans.fetch({ cache: true }));

        if (bans?.find((u) => u.user.id === user.id)) {
            await message.guild?.members.unban(user);
            return message.channel.send({
                embeds: [new EmbedBuilder({
                    description: `Unbanned ${user.tag}.`,
                })
                    .withOkColor(message)],
            });
        }

        else {
            return message.channel.send({
                embeds: [new EmbedBuilder({
                    description: `\`${user.tag}\` is not banned.`,
                })
                    .withErrorColor(message)],
            });
        }
    }
}
