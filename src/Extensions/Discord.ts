import { errorColor, okColor } from "../lib/Util";
import { customClient } from "../struct/client";

export const extensionHook = (): void => {
	return;
};

declare module "discord.js" {
    export interface Guild {
        isDadBotEnabled(message?: Message): boolean;
    }

    export interface GuildMember {
        hasExcludedRole(member?: GuildMember): boolean;
    }

    export interface Message {
        getMemberColorAsync(member?: GuildMember): Promise<ColorResolvable>;
        client: customClient;
    }

    export interface MessageEmbed {
        withOkColor(m?: Message | Guild): this;
        withErrorColor(m?: Message | Guild): this;
    }
}

import { Guild, GuildMember, Message, MessageEmbed } from "discord.js";

GuildMember.prototype.hasExcludedRole = function(member?: GuildMember) {

	const member1 = member ?? this as GuildMember;
	const roleName = (member1.guild.client as customClient).guildSettings.get(member1.guild.id, "excludeRole", "");

	return !member1.roles.cache
		.find(r => roleName === r.name);
};

Guild.prototype.isDadBotEnabled = function(message?: Message) {

	const g = message?.guild ?? this as Guild;

	if (g && (g.client as customClient).guildSettings.get(g.id, "dadBot", false).enabled) {
		return message
			? !message.client.guildSettings.get(g.id, "dadBot", {
				enabled: false,
				excludedChannels: {},
			}).excludedChannels[message.channel.id]
			: true;
	}
	return false;
};

MessageEmbed.prototype.withErrorColor = function(m?: Message | Guild) {

	if (m) {
		if (m instanceof Message && m.guild) {
			return this.setColor((m.client as customClient).guildSettings.get(m.guild!.id, "errorColor", okColor));
		}
		return this.setColor((m.client as customClient).guildSettings.get(m.id, "errorColor", okColor));
	}

	return this.setColor(errorColor);
};

MessageEmbed.prototype.withOkColor = function(m?: Message | Guild) {

	if (m) {
		if (m instanceof Message && m.guild) {
			return this.setColor((m.client as customClient).guildSettings.get(m.guild!.id, "okColor", okColor));
		}
		return this.setColor((m.client as customClient).guildSettings.get(m.id, "okColor", okColor));
	}

	return this.setColor(okColor);
};
