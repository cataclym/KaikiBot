import { EmbedBuilder, Message, PermissionsBitField } from "discord.js";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";


export default class ClearCommand extends KaikiCommand {
    constructor() {
        super("clear", {
            aliases: ["clear", "prune"],
            userPermissions: PermissionsBitField.Flags.ManageMessages,
            clientPermissions: PermissionsBitField.Flags.ManageMessages,
            channel: "guild",
            description: "Clears up to 100 messages in the current channel.",
            usage: "69",
            args: [
                {
                    id: "int",
                    type: "integer",
                    default: 0,
                },
            ],
            cooldown: 60000,
        });
    }

    public async exec(message: Message<true>, { int }: { int: number }): Promise<void> {

        if (int > 100) {
            int = 100;
        }

        const channels = await message.channel.messages.fetch({ limit: int + 1 });
        const maxAgeMs = 14 * 24 * 60 * 60 * 1000;
        const dateNow = Date.now();

        // Filter all messages that are newer than 14 days old
        const bulkDeletable = channels
            .filter(c => (dateNow - c.createdAt.getTime()) < maxAgeMs);

        const manualDelete = channels
            .filter(c => (dateNow - c.createdAt.getTime()) > maxAgeMs);

        await message.channel.bulkDelete(bulkDeletable);

        message.channel.send({
            embeds: [
                new EmbedBuilder()
                    .setDescription(`Deleting **${int}** messages...!`)
                    .withOkColor(message),
            ],
        })
            .then(m => setTimeout(() => m.delete(), manualDelete.size * 1500));

        // kekw
        let i = 0;
        manualDelete.each(async (m) => {
            i += 1500;
            setTimeout(async () => {
                await m.delete()
                    .catch(e => {
                        throw new Error(e);
                    });
            }, i);
        });
    }
}
