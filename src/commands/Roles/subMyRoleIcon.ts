import { Guild, GuildEmoji, Message, MessageAttachment, MessageEmbed, ReactionEmoji, Role } from "discord.js";
import { Argument } from "discord-akairo";
import { getGuildDocument } from "../../struct/documentMethods";
import { Snowflake } from "discord-api-types";
import { KaikiCommand } from "kaiki";
import { EMOTE_REGEX, IMAGE_REGEX } from "../../struct/constants";
import { isRegex } from "../../lib/functions";
import { rolePermissionCheck } from "../../lib/roles";
import KaikiEmbeds from "../../lib/KaikiEmbeds";
import Utility from "../../lib/Utility";

const resetWords = ["clear", "reset"];

export default class MyRoleSubIcon extends KaikiCommand {
    constructor() {
        super("myroleicon", {
            clientPermissions: ["MANAGE_ROLES"],
            channel: "guild",
            typing: true,
            args: [{
                id: "icon",
                type: Argument.union((message) => {
                    if (message.attachments.first()) {
                        return message.attachments.first();
                    }
                }, "emoji", resetWords, EMOTE_REGEX, IMAGE_REGEX),
                otherwise: (m: Message) => ({ embeds: [new MessageEmbed()
                    .setTitle("Please provide a valid emote or image link!")
                    .withErrorColor(m)] }),
            }],
        });
    }

    async getRole(message: Message) {
        const db = await getGuildDocument(message.guild!.id),
            roleID = db.userRoles[message.author.id];

        if (!roleID) {
            message.channel.send({ embeds: [await KaikiEmbeds.embedFail(message)] });
            return false;
        }

        const myRole = message.guild!.roles.cache.get(roleID as Snowflake);

        if (!myRole) {
            delete db.userRoles[message.author.id];
            db.markModified("userRoles");
            await db.save();
            message.channel.send({ embeds: [await KaikiEmbeds.embedFail(message)] });
            return false;
        }

        return myRole;
    }

    async exec(message: Message, { icon }: { icon: { match: RegExpMatchArray } | GuildEmoji | MessageAttachment | string }): Promise<Message | undefined> {

        let roleIconSrc: string | Buffer | GuildEmoji | ReactionEmoji | null = null;

        if (icon instanceof GuildEmoji) {
            roleIconSrc = icon.url;
        }

        else if (typeof icon === "string") {
            if (resetWords.includes(icon.toLowerCase())) {
                const myRole = await this.getRole(message);
                if (myRole && await rolePermissionCheck(message, myRole as Role)) {
                    myRole.setIcon(null);
                    return message.channel.send({
                        embeds: [new MessageEmbed()
                            .setDescription("Role-icon has been reset!")
                            .withOkColor(message),
                        ],
                    });
                }
            }
        }

        else if (isRegex(icon)) {

            if (EMOTE_REGEX.exec(icon.match[0])) {
                const emoji = icon.match[0].toString().split(":");

                if (emoji.length < 3) return message.channel.send({ embeds: [KaikiEmbeds.genericArgumentError(message)] });

                const id = emoji[2].replace(">", "");
                roleIconSrc = `https://cdn.discordapp.com/emojis/${id}.${emoji[0] === "<a" ? "gif" : "png"}`;
            }

            else {
                roleIconSrc = icon.match[0].toString();
            }
        }

        else {
            roleIconSrc = icon.url;
        }

        const guild = (message.guild as Guild);

        if (["TIER_1", "NONE"].includes(guild.premiumTier)) {
            return message.channel.send({
                embeds: [
                    await KaikiEmbeds.errorMessage(message.guild || message, "This server does not have enough boosts for role-icons!"),
                ],
            });
        }

        const myRole = await this.getRole(message);

        if (myRole) {

            const botRole = message.guild?.me?.roles.highest,
                isPosition = botRole?.comparePositionTo(myRole);

            if (isPosition && isPosition <= 0) {
                return message.channel.send({ embeds: [await KaikiEmbeds.embedFail(message, "This role is higher than me, I cannot edit this role!")] });
            }

            try {
                await myRole.setIcon(roleIconSrc);
            }
            catch (err) {
                return message.channel.send({
                    embeds: [(await KaikiEmbeds.errorMessage(message.guild || message, "Unsupported image format"))
                        .addField("Message", await Utility.codeblock(err, "xl"))],
                });
            }

            return message.channel.send({
                embeds: [new MessageEmbed()
                    .setDescription(`You have set \`${myRole.name}\`'s icon!`)
                    .withOkColor(message),
                ],
            });
        }
    }
}
