import { AkairoMessage } from "discord-akairo";
import { EmbedBuilder, Message } from "discord.js";
import KaikiAkairoClient from "../Kaiki/KaikiAkairoClient";
import KaikiEmbeds from "../KaikiEmbeds";

export function dadbotCheck(message: AkairoMessage | Message) {
    if (!message.guild?.isDadBotEnabled()) {
        return false;
    }
}

async function getOrCreateDadbotRole(message: AkairoMessage<"cached"> | Message<true>, client: KaikiAkairoClient) {
    const db = await client.db.getOrCreateGuild(message.guildId);

    const embeds = [];
    return message.guild?.roles.cache.get(String(db.ExcludeRole));
}

export async function excludeCommand(message: Message<true> | AkairoMessage<"cached">, client: KaikiAkairoClient) {
    const embeds = [];
    let excludedRole = await getOrCreateDadbotRole(message, client);

    if (!excludedRole) {
        excludedRole = await message.guild?.roles.create({
            name: process.env.DADBOT_DEFAULT_ROLENAME,
            reason: "Initiate default dad-bot exclusion role.",
        });

        await this.client.db.orm.guilds.update({
            where: {
                Id: BigInt(message.guildId),
            },
            data: {
                ExcludeRole: BigInt(excludedRole?.id),
            },
        });

        await this.client.guildsDb.set(message.guildId, "ExcludeRole", excludedRole.id);

        embeds.push(new EmbedBuilder({
            title: "Creating dad-bot role!",
            description: "There doesn't seem to be a default dad-bot role in this server. Creating one...",
            footer: { text: "Beep boop..." },
        })
            .withErrorColor(message.guild));
    }

    if (!message.member?.hasExcludedRole()) {
        await message.member?.roles.add(excludedRole);
        embeds.push(KaikiEmbeds.addedRoleEmbed(excludedRole.name)
            .withOkColor(message.guild));
        return message.reply({ embeds: embeds });
    }

    else {
        await message.member.roles.remove(excludedRole);
        embeds.push(KaikiEmbeds.removedRoleEmbed(excludedRole.name)
            .withOkColor(message.guild));
        return message.reply({ embeds: embeds });
    }
}
