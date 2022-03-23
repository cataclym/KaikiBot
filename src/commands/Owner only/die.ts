import { InteractionCollector, Message, MessageActionRow, MessageButton, MessageEmbed } from "discord.js";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";


import logger from "loglevel";

export default class KillBotProcess extends KaikiCommand {
    constructor() {
        super("die", {
            aliases: ["die", "kill", "shutdown"],
            description: "Shuts down bot.",
            ownerOnly: true,
        });
    }

    public async exec(message: Message): Promise<void> {

        const deleteMsg = await message.channel.send({
            embeds: [new MessageEmbed()
                .setDescription("Do you *really* want to shut me down?")
                .withOkColor(message)],
            isInteraction: true,
            components: [new MessageActionRow({
                components:
                    [new MessageButton()
                        .setCustomId("1")
                        .setLabel("Click to kill")
                        .setStyle("DANGER")],
            })],
        });

        const buttonListener = new InteractionCollector(message.client, {
            message: deleteMsg,
            time: 20000,
            filter: (m) => m.user.id === message.author.id,
        });

        buttonListener.once("collect", async (mci) => {

            if (mci.isButton()) {
                await mci.reply({
                    ephemeral: true, embeds: [new MessageEmbed()
                        .setAuthor({ name: "Dying", iconURL: message.client.user?.displayAvatarURL({ dynamic: true }) })
                        .addField("Shutting down", "See you later", false)
                        .withOkColor(message)],
                });
            }

            await deleteMsg.delete();

            logger.warn("Shutting down");
            process.exit();
            // SIGINT shutdown
        });

        buttonListener.once("end", async () => {
            await deleteMsg.delete();
            await message.delete();
        });
    }
}
