import { EmbedBuilder, Message, PermissionsBitField } from "discord.js";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";
import SlashCommandsLib from "../../lib/SlashCommands/SlashCommandsLib";

export default class ExcludeCommand extends KaikiCommand {
    constructor() {
        super("exclude", {
            description: "Excludes you from being targeted by dad-bot. Execute command again to reverse this action.",
            aliases: ["exclude", "e", "excl"],
            clientPermissions: PermissionsBitField.Flags.ManageRoles,
            userPermissions: [],
            channel: "guild",
            slashEphemeral: true,
            slashDefaultMemberPermissions: null,
            slash: true,
            lock: "guild",
        });
    }

    public async exec(message: Message<true>): Promise<Message> {

        if (!SlashCommandsLib.dadbotCheck(message)) {
            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Dad-bot is not enabled")
                        .withErrorColor(message.guild),
                ],
            });
        }

        return SlashCommandsLib.excludeCommand(message, this.client);
    }
}
