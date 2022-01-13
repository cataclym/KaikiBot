import { Guild, GuildMember, Message, MessageEmbed } from "discord.js";
import { KaikiCommand } from "kaiki";


export default class KickCommand extends KaikiCommand {
    constructor() {
        super("kick", {
            aliases: ["kick", "k"],
            userPermissions: ["KICK_MEMBERS"],
            clientPermissions: "KICK_MEMBERS",
            description: "Kicks a user by ID or name with an optional message.",
            usage: "<@some Guy> Your behaviour is harmful.",
            channel: "guild",
            args: [
                {
                    id: "member",
                    type: "member",
                    otherwise: (m: Message) => ({ embeds: [new MessageEmbed({
                        description: "Can't find this user.",
                    })
                        .withErrorColor(m)] }),
                },
                {
                    id: "reason",
                    type: "string",
                    match: "restContent",
                    default: "kicked",
                },
            ],
        });
    }
    public async exec(message: Message, { member, reason }: { member: GuildMember, reason: string }): Promise<Message> {

        const guild = message.guild as Guild;
        const guildClientMember = guild.me as GuildMember;

        if (message.author.id !== message.guild?.ownerId &&
			(message.member as GuildMember).roles.highest.position <= member.roles.highest.position) {

            return message.channel.send({
                embeds: [new MessageEmbed({
                    description: "You don't have permissions to kick this member.",
                })
                    .withErrorColor(message)],
            });
        }
        else if (guildClientMember.roles.highest.position <= member.roles.highest.position) {
            return message.channel.send({
                embeds: [new MessageEmbed({
                    description: "Sorry, I don't have permissions to kick this member.",
                })
                    .withErrorColor(message)],
            });
        }

        const embed = new MessageEmbed({
            title: "Kicked user",
            fields: [
                { name: "Username", value: member.user.username, inline: true },
                { name: "ID", value: member.user.id, inline: true },
            ],
        })
            .withOkColor(message);

        await member.kick(reason).then(m => {
            m.user.send({ embeds: [new MessageEmbed({
                description: `You have been kicked from ${message.guild?.name}.\nReason: ${reason}`,
            })
                .withErrorColor(message)] })
                .catch(() => embed.setFooter("DM'ing user failed."));
        })
            .catch((err) => console.log(err));

        return message.channel.send({ embeds: [embed] });
    }
}
