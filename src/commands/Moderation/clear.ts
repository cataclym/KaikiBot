import type { TextBasedChannel, TextChannel } from "discord.js";
import KaikiCommand from "Kaiki/KaikiCommand";

export default class ClearCommand extends KaikiCommand {
    constructor() {
        super("clear", {
            aliases: ["clear", "prune"],
            userPermissions: "MANAGE_MESSAGES",
            clientPermissions: "MANAGE_MESSAGES",
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
        });
    }
    public async exec({ channel }: { channel: TextBasedChannel }, { int }: { int: number }): Promise<void> {

        if (int > 99) {
            int = 99;
        }

        (channel as TextChannel).bulkDelete(int + 1)
            .catch((r) => console.error(r));
    }
}
