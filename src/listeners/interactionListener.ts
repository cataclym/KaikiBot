import { Listener } from "discord-akairo";
import { BooleanCache, CacheType, ChannelType, Interaction, InteractionResponse } from "discord.js";

export default class InteractionListener extends Listener {
    constructor() {
        super("interaction", {
            event: "interactionCreate",
            emitter: "client",
        });
    }

    public async exec(interaction: Interaction): Promise<InteractionResponse<BooleanCache<CacheType>> | void> {
        //
        // if (!interaction.isCommand()) return;
        //
        // if (!interaction.guild || interaction.commandName !== "exclude" || interaction.channel && !(interaction.channel.type === ChannelType.GuildText)) {
        //     return interaction.deferReply({ ephemeral: true });
        // }
        //
        // else if (interaction.guild.members.me?.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
        //     return ExcludeSlashCommand(interaction)
        //         .catch((er: any) => logger.error(er));
        // }
        //
        // else {
        //     return await interaction.reply({
        //         ephemeral: true,
        //         embeds: [await KaikiEmbeds.errorMessage(interaction.guild,
        //             "I do not have `MANAGE_ROLES` permission.")],
        //     });
        // }
    }
}

