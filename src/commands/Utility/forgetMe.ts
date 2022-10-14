import { InteractionCollector, Message, MessageActionRow, MessageButton, EmbedBuilder } from "discord.js";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";


export default class ForgetMeCommand extends KaikiCommand {
    constructor() {
        super("forgetme", {
            aliases: ["forgetme"],
            description: "Deletes all information about you in the database",
            usage: "",
        });
    }

    public async exec(message: Message): Promise<void> {

        const deleteMsg = await message.channel.send({
            embeds: [new EmbedBuilder()
                .setDescription("Are you *sure* you want to delete all your entries in the database?")
                .withOkColor(message)],
            isInteraction: true,
            components: [new MessageActionRow({
                components:
                    [new MessageButton()
                        .setCustomId("1")
                        .setLabel("Yes")
                        .setEmoji("⚠️")
                        .setStyle("DANGER"),
                    new MessageButton()
                        .setCustomId("2")
                        .setLabel("No")
                        .setEmoji("❌")
                        .setStyle("SECONDARY")],
            })],
        });

        const buttonListener = new InteractionCollector(message.client, {
            message: deleteMsg,
            time: 20000,
            filter: (m) => m.user.id === message.author.id,
        });

        buttonListener.once("collect", async (i) => {

            if (i.isButton()) {
                if (i.customId === "1") {
                    const userData = await this.client.orm.discordUsers.delete({
                        select: {
                            Amount: true,
                            CreatedAt: true,
                            Todos: true,
                        },
                        where: {
                            UserId: BigInt(message.author.id),
                        },
                    });

                    const guildData = await this.client.orm.guildUsers.deleteMany({
                        where: {
                            UserId: BigInt(message.author.id),
                        },
                    });

                    message.channel.send({
                        embeds: [new EmbedBuilder()
                            .setTitle("Deleted data")
                            .setDescription("All data stored about you has been deleted!")
                            .addField("Cleared user-data", userData.Todos.length
                                ? `${userData.Todos.length + guildData.count} entrie(s) deleted`
                                : "N/A")
                            .addField("Cleared money-data", userData.Amount
                                ? `${userData.Amount} currency deleted`
                                : "N/A")
                            .withOkColor(message),
                        ],
                    });
                }
                else {
                    await message.delete();
                }
                buttonListener.stop();
            }
        });

        buttonListener.once("end", async () => {
            await deleteMsg.delete();
        });
    }
}
