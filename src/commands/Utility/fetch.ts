import { time } from "@discordjs/builders";
import { Argument } from "discord-akairo";
import { EmbedBuilder, Message, Snowflake, User } from "discord.js";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";
import Constants from "../../struct/Constants";


export default class FetchUserCommand extends KaikiCommand {
    constructor() {
        super("fetch", {
            cooldown: 30000,
            aliases: ["fu", "fetch"],
            description: "Fetches a discord user, shows relevant information. 30sec cooldown.",
            usage: "<id>",
            args: [
                {
                    id: "userObject",
                    type: Argument.union("user", async (message: Message, phrase: string) => {
                        try {
                            const u = await message.client.users.fetch(phrase as Snowflake);
                            if (u) return u;
                        }
                        catch {
                            return;
                        }
                    }),
                    otherwise: (m) => ({
                        embeds: [
                            new EmbedBuilder()
                                .setDescription("No user found")
                                .withErrorColor(m),
                        ],
                    }),
                },
            ],
        });
    }

    public async exec(message: Message, { userObject }: { userObject: User }): Promise<Message | void> {

        const userinfo = this.handler.modules.get("uinfo");

        if (message.guild?.members.cache.has(userObject.id) && userinfo) {
            return this.handler.runCommand(message, userinfo, await userinfo.parse(message, userObject.id));
        }

        const userFlags = userObject.flags ? userObject.flags.toArray() : [],
            embed = new EmbedBuilder()
                .setDescription(userObject.username)
                .setThumbnail(userObject.displayAvatarURL({ size: 4096 }))
                .setTitle(userObject.tag)
                .addFields([
                    { name: "ID", value: userObject.id, inline: true },
                    { name: "Account date", value: time(userObject.createdAt), inline: true },
                ])
                .withOkColor(message);

        if (userFlags.length) {
            embed.addFields([
                {
                    name: "Flags",
                    value: userFlags.map((flag) => Constants.flags[flag]).join("\n"),
                    inline: true,
                },
            ]);
        }
        if (userObject.bot) {
            embed.addFields([
                {
                    name: "Bot",
                    value: "✅",
                    inline: true,
                },
            ]);
        }

        return message.channel.send({ embeds: [embed] });
    }
}
