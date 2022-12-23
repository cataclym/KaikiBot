import { PrefixSupplier } from "discord-akairo";
import { EmbedBuilder, Message, PermissionsBitField } from "discord.js";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";
import KaikiEmbeds from "../../lib/KaikiEmbeds";
import SlashCommandsLib from "../../lib/SlashCommands/SlashCommandsLib";

export default class DadBotConfigCommand extends KaikiCommand {
    constructor() {
        super("config-dadbot", {
            userPermissions: PermissionsBitField.Flags.Administrator,
            channel: "guild",
            args: [
                {
                    id: "value",
                    type: ["enable", "true", "disable", "false"],
                    otherwise: (message: Message) => ({ embeds: [KaikiEmbeds.genericArgumentError(message)] }),
                },
            ],
        });
    }

    public async exec(message: Message<true>, { value }: { value: "enable" | "true" | "disable" | "false" }): Promise<Message> {

        const embed = new EmbedBuilder()
            .withOkColor(message);

        const isEnabled: boolean = message.client.guildsDb.get(message.guildId, "DadBot", false);

        switch (value) {
            case ("enable"):
            case ("true"): {
                if (!isEnabled) {
                    await message.client.guildsDb.set(message.guildId, "DadBot", true);
                    await message.guild?.commands.create(SlashCommandsLib.excludeData);

                    embed
                        .setTitle(`Dad-bot has been enabled in ${message.guild?.name}!`)
                        .setDescription(`Individual users can still disable dad-bot on themselves with \`${(this.handler.prefix as PrefixSupplier)(message)}exclude\`.`);
                }
                else {
                    embed
                        .setTitle("Already enabled")
                        .setDescription("You have already **enabled** dad-bot in this server.")
                        .withErrorColor(message);
                }
                break;
            }
            case ("disable"):
            case ("false"): {
                if (isEnabled) {
                    await message.client.guildsDb.set(message.guildId, "DadBot", false);

                    const cmd = message.guild?.commands.cache.find(c => c.name === "exclude");

                    if (cmd) {
                        await message.guild?.commands.delete(cmd.id);
                    }

                    embed.setTitle(`Dad-bot has been disabled in ${message.guild?.name}!`);
                }
                else {
                    embed
                        .setTitle("Already disabled")
                        .setDescription("You have already **disabled** dad-bot in this server.")
                        .withErrorColor(message);
                }
                break;
            }
        }
        return message.channel.send({
            embeds: [embed],
        });
    }
}
