import { PrefixSupplier } from "discord-akairo";
import { Guild, Message, MessageEmbed } from "discord.js";
import { KaikiCommand } from "kaiki";
import { getGuildDocument } from "../../struct/documentMethods";
import { excludeData } from "../../lib/slashCommands/data";
import KaikiEmbeds from "../../lib/KaikiEmbeds";

export default class DadBotConfigCommand extends KaikiCommand {
    constructor() {
        super("config-dadbot", {
            userPermissions: "ADMINISTRATOR",
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

    public async exec(message: Message, { value }: { value: "enable" | "true" | "disable" | "false" }): Promise<Message> {
        const embed = new MessageEmbed().withOkColor(message),
            guildID = (message.guild as Guild).id,
            db = await getGuildDocument(guildID);

        const isEnabled = message.client.guildProvider.get(guildID, "DadBot", 0);

        switch (value) {
            case ("enable"):
            case ("true"): {
                if (!isEnabled) {
                    db.settings.dadBot.enabled = true;
                    db.markModified("settings.dadBot.enabled");
                    await message.client.guildProvider.set(guildID, "DadBot", db.settings.dadBot.enabled);
                    await db.save();

                    await message.guild?.commands.create(excludeData);

                    return message.channel.send({ embeds: [embed
                        .setTitle(`dad-bot has been enabled in ${message.guild?.name}!`)
                        .setDescription(`Individual users can still disable dad-bot on themselves with \`${(this.handler.prefix as PrefixSupplier)(message)}exclude\`.`)],
                    });
                }
                else {
                    return message.channel.send({
                        embeds: [embed
                            .setTitle("Already enabled")
                            .setDescription("You have already **enabled** dad-bot in this server.")
                            .withErrorColor(message)],
                    });
                }
            }
            case ("disable"):
            case ("false"): {
                if (isEnabled) {
                    db.settings.dadBot.enabled = false;
                    db.markModified("settings.dadBot.enabled");
                    await message.client.guildProvider.set(guildID, "DadBot", db.settings.dadBot.enabled);
                    await db.save();

                    const cmd = message.guild?.commands.cache.find(c => c.name === "exclude");
                    if (cmd) {
                        await message.guild?.commands.delete(cmd.id);
                    }

                    return message.channel.send({ embeds: [embed
                        .setTitle(`dad-bot has been disabled in ${message.guild?.name}!`)] });
                }
                else {
                    return message.channel.send({
                        embeds: [embed
                            .setTitle("Already disabled")
                            .setDescription("You have already **disabled** dad-bot in this server.")
                            .withErrorColor(message)],
                    });
                }
            }
        }
    }
}
