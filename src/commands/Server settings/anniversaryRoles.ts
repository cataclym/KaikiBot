import { Guild, Message, MessageEmbed } from "discord.js";
import { IGuild } from "../../lib/Migrations/src/IDocuments";
import { checkBirthdayOnAdd } from "../../lib/AnniversaryRoles";
import KaikiCommand from "Kaiki/KaikiCommand";

import { getGuildDocument } from "../../struct/documentMethods";
import KaikiEmbeds from "../../lib/KaikiEmbeds";

type values = "enable" | "true" | "disable" | "false";
const values: values[] = ["enable", "true", "disable", "false"];

export default class AnniversaryRolesConfigCommand extends KaikiCommand {
    constructor() {
        super("config-anniversary", {
            userPermissions: "ADMINISTRATOR",
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
        const embed = new MessageEmbed()
            .withOkColor(message);

        const isEnabled: boolean = message.client.guildProvider.get(message.guildId, "Anniversary", false);

        switch (value) {
            case ("enable"):
            case ("true"): {
                if (!isEnabled) {
                    await this.client.anniversaryService.checkBirthdayOnAdd(message.guild as Guild);
                    await message.client.guildProvider.set(message.guildId, "Anniversary", true);
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
                    await message.client.guildProvider.set(message.guildId, "Anniversary", false);
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
