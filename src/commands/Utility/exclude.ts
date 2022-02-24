import { Message, MessageEmbed, Permissions } from "discord.js";
import KaikiCommand from "Kaiki/KaikiCommand";
import KaikiEmbeds from "../../lib/KaikiEmbeds";

export default class ExcludeCommand extends KaikiCommand {
    constructor() {
        super("exclude", {
            description: "Adds or removes excluded role from user. Excludes the user from being targeted by dad-bot.",
            aliases: ["exclude", "e", "excl"],
            clientPermissions: Permissions.FLAGS.MANAGE_ROLES,
            channel: "guild",
        });
    }

    public async exec(message: Message): Promise<Message | void> {

        if (!message.guild!.determineIsDadBotEnabled()) {
            return message.channel.send({
                embeds: [new MessageEmbed()
                    .setTitle("Dadbot is not enabled")
                    .withErrorColor(message)],
            });
        }

        const db = await this.client.db.getOrCreateGuild(message.guildId!);

        const embeds = [];
        let excludedRole = message.guild?.roles.cache.get(String(db.ExcludeRole));

        if (!excludedRole) {
            excludedRole = await message.guild?.roles.create({
                name: process.env.DADBOT_DEFAULT_ROLENAME,
                reason: "Initiate default dad-bot exclusion role.",
            });

            embeds.push(new MessageEmbed({
                title: "Creating dad-bot role!",
                description: "There doesn't seem to be a default dad-bot role in this server. Creating one...",
                footer: { text: "Beep boop..." },
            })
                .withErrorColor(message));
        }

        if (!message.member?.hasExcludedRole()) {
            await message.member?.roles.add(excludedRole!);
            embeds.push(KaikiEmbeds.addedRoleEmbed(excludedRole!.name)
                .withOkColor(message));
            return message.channel.send({ embeds: embeds });
        }

        else {
            await message.member?.roles.remove(excludedRole!);
            embeds.push(KaikiEmbeds.removedRoleEmbed(excludedRole!.name)
                .withOkColor(message));
            return message.channel.send({ embeds: embeds });
        }
    }
}
