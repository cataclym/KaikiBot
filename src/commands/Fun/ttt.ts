import { GuildMember, Message, MessageActionRow, MessageButton, MessageEmbed } from "discord.js";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";

import TicTacToe from "../../lib/games/TTT";
import KaikiEmbeds from "../../lib/KaikiEmbeds";

export default class TicTacToeCommand extends KaikiCommand {
    constructor() {
        super("tictactoe", {
            aliases: ["tictactoe", "ttt"],
            channel: "guild",
            description: "Starts a TicTacToe game, where you play against an @mentioned person.",
            usage: "@Dreb",
            args: [{
                id: "player2",
                type: "member",
                otherwise: (m: Message) => ({ embeds: [KaikiEmbeds.genericArgumentError(m)] }),
            }],
        });
    }

    public async exec(message: Message, { player2 }: { player2: GuildMember }): Promise<any> {

        if (player2.id === message.member!.id || player2.user.bot) {
            return message.channel.send({ embeds: [await KaikiEmbeds.errorMessage(message, "You can't play against yourself or a bot!")] });
        }

        const acceptMessage = await message.channel.send({
            embeds: [new MessageEmbed()
                .setDescription(`Do you wanna participate in a game of Tic-Tac-Toe against ${message.author.tag}?`)
                .setFooter({ text: "Timeout in 20 seconds" })
                .withOkColor(message)],
            isInteraction: true,
            components: [new MessageActionRow({
                components: [new MessageButton()
                    .setCustomId("1")
                    .setLabel("Yes")
                    .setStyle("PRIMARY"),
                new MessageButton()
                    .setCustomId("2")
                    .setLabel("No")
                    .setStyle("DANGER")],
            })],
        });

        acceptMessage.awaitMessageComponent({
            filter: (m) => {
                m.deferUpdate();
                return m.user.id === player2.id;
            }, componentType: "BUTTON", time: 20000,
        })
            .then(async (interaction) => {

                if (interaction.customId === "1") {
                    new TicTacToe(message.member as GuildMember, player2, message);
                    acceptMessage.delete();
                }

                else {
                    await message.reply({
                        embeds: [new MessageEmbed()
                            .setDescription(`${player2.user.tag} has declined your Tic-Tac-Toe challenge`)
                            .withErrorColor(message),
                        ],
                    });
                    acceptMessage.delete();
                }
            })
            .catch(() => {
                const emb = acceptMessage.embeds[0];
                acceptMessage.edit({
                    embeds: [new MessageEmbed(emb)
                        .setDescription(`~~${emb.description}~~`)
                        .setFooter({ text: "Timed out!" })
                        .withErrorColor(message)],
                    components: [],
                });
            });
    }
}
