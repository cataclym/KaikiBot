import { EmbedBuilder, Guild, Message, PermissionsBitField } from "discord.js";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";
import KaikiEmbeds from "../../lib/KaikiEmbeds";

type values = "enable" | "true" | "disable" | "false";
const values: values[] = ["enable", "true", "disable", "false"];

export default class AnniversaryRolesConfigCommand extends KaikiCommand {
    constructor() {
        super("config-anniversary", {
            userPermissions: PermissionsBitField.Flags.Administrator,
            channel: "guild",
            args: [
                {
                    id: "value",
                    type: values,
                    otherwise: (message: Message) => ({ embeds: [KaikiEmbeds.genericArgumentError(message)] }),
                },
            ],
        });
    }

    public async exec(message: Message<true>, { value }: { value: values }): Promise<Message> {
        const embed = new EmbedBuilder()
            .withOkColor(message);

        const isEnabled: boolean = message.client.guildsDb.get(message.guildId, "Anniversary", false);

        switch (value) {
            case ("enable"):
            case ("true"): {
                if (!isEnabled) {
                    await this.client.anniversaryService.checkBirthdayOnAdd(message.guild as Guild);
                    await message.client.guildsDb.set(message.guildId, "Anniversary", true);
                    embed.setDescription(`Anniversary-roles functionality has been enabled in ${message.guild?.name}!`);
                }
                else {
                    embed.setDescription("You have already enabled Anniversary-roles.");
                }
                break;
            }
            case ("disable"):
            case ("false"): {
                if (isEnabled) {
                    await message.client.guildsDb.set(message.guildId, "Anniversary", false);
                    embed.setDescription(`Anniversary-roles functionality has been disabled in ${message.guild?.name}!`);
                }
                else {
                    embed.setDescription("You have already disabled Anniversary-roles.");
                }
                break;
            }
        }
        return message.channel.send({
            embeds: [embed],
        });
    }
}
