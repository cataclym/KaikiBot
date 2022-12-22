import { Argument } from "discord-akairo";
import {
    Attachment,
    EmbedBuilder,
    Guild,
    GuildEmoji,
    GuildPremiumTier,
    Message,
    PermissionsBitField,
    ReactionEmoji,
} from "discord.js";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";
import KaikiEmbeds from "../../lib/KaikiEmbeds";
import Roles, { rolePermissionCheck } from "../../lib/Roles";
import Utility from "../../lib/Utility";
import Constants from "../../struct/Constants";

export default class MyRoleSubIcon extends KaikiCommand {
    static resetWords = ["clear", "reset"];

    constructor() {
        super("myroleicon", {
            clientPermissions: PermissionsBitField.Flags.ManageRoles,
            channel: "guild",
            typing: true,
            args: [
                {
                    id: "icon",
                    type: Argument.union((message) => {
                        if (message.attachments.first()) {
                            return message.attachments.first();
                        }
                    }, "emoji", MyRoleSubIcon.resetWords, Constants.emoteRegex, Constants.imageRegex),
                    otherwise: (m: Message) => ({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle("Please provide a valid emote or image link!")
                                .withErrorColor(m),
                        ],
                    }),
                },
            ],
        });
    }

    async exec(message: Message<true>, { icon }: { icon: { match: RegExpMatchArray } | GuildEmoji | Attachment | string }): Promise<Message | undefined> {

        let roleIconSrc: string | Buffer | GuildEmoji | ReactionEmoji | null = null;

        if (icon instanceof GuildEmoji) {
            roleIconSrc = icon.url;
        }

        else if (Utility.isRegex(icon)) {

            if (Constants.emoteRegex.exec(icon.match[0])) {
                const emoji = icon.match[0].toString().split(":");

                if (emoji.length < 3) return message.channel.send({ embeds: [KaikiEmbeds.genericArgumentError(message)] });

                const id = emoji[2].replace(">", "");
                roleIconSrc = `https://cdn.discordapp.com/emojis/${id}.${emoji[0] === "<a" ? "gif" : "png"}`;
            }

            else {
                roleIconSrc = icon.match[0].toString();
            }
        }

        else if (icon instanceof Attachment) {
            roleIconSrc = icon.url;
        }

        else {
            const myRole = await Roles.getRole(message);
            if (myRole && await rolePermissionCheck(message, myRole)) {
                myRole.setIcon(null);
                return message.channel.send({
                    embeds: [
                        new EmbedBuilder()
                            .setDescription("Role-icon has been reset!")
                            .withOkColor(message),
                    ],
                });
            }
        }

        const guild = (message.guild as Guild);

        if ([GuildPremiumTier.Tier1, GuildPremiumTier.None].includes(guild.premiumTier)) {
            return message.channel.send({
                embeds: [await KaikiEmbeds.errorMessage(message.guild || message, "This server does not have enough boosts for role-icons!")],
            });
        }

        const myRole = await Roles.getRole(message);

        if (!myRole) return message.channel.send({ embeds: [await KaikiEmbeds.embedFail(message)] });

        const botRole = message.guild?.members.me?.roles.highest,
            isPosition = botRole?.comparePositionTo(myRole);

        if (isPosition && isPosition <= 0) {
            return message.channel.send({ embeds: [await KaikiEmbeds.embedFail(message, "This role is higher than me, I cannot edit this role!")] });
        }

        try {
            await myRole.setIcon(roleIconSrc);
        }
        catch (err) {
            return message.channel.send({
                embeds: [
                    (await KaikiEmbeds.errorMessage(message.guild || message, "Unsupported image format"))
                        .addFields({ name: "Message", value: await Utility.codeblock(err, "xl") }),
                ],
            });
        }

        return message.channel.send({
            embeds: [
                new EmbedBuilder()
                    .setDescription(`You have set \`${myRole.name}\`'s icon!`)
                    .withOkColor(message),
            ],
        });
    }
}
