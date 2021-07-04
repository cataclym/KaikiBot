import { errorColor, okColor } from "../lib/Util";
import { customClient } from "../struct/client";

export const extensionHook = (): void => {
	return;
};

declare module "discord.js" {
    export interface Guild {
        isDadBotEnabled(guild?: Guild): boolean;
    }

    export interface GuildMember {
        hasExcludedRole(member?: GuildMember): boolean;
    }

    export interface Message {
        getMemberColorAsync(member?: GuildMember): Promise<ColorResolvable>;
        client: customClient;
    }

    export interface MessageEmbed {
        withOkColor(m?: Message): this;
        withErrorColor(m?: Message): this;
    }
}

import { Guild, GuildMember, Message, MessageEmbed } from "discord.js";

GuildMember.prototype.hasExcludedRole = function(member?: GuildMember) {

	const memb = member ?? this as GuildMember;
	const rolename = (memb.guild.client as customClient).guildSettings.get(memb.guild.id, "excludeRole", "");

	return !memb.roles.cache
		.find(r => rolename === r.name);
};

Guild.prototype.isDadBotEnabled = function(guild?: Guild) {

	const g = guild ?? this as Guild;

	if (!g) return false;

	return (g.client as customClient).guildSettings.get(g.id, "dadBot", false);
};

MessageEmbed.prototype.withErrorColor = function(m?: Message) {

	if (m?.guild) {
		return this.setColor(m.client.guildSettings.get(m.guild.id, "errorColor", okColor));
	}

	return this.setColor(errorColor);
};

MessageEmbed.prototype.withOkColor = function(m?: Message) {

	if (m?.guild) {
		return this.setColor(m.client.guildSettings.get(m.guild.id, "okColor", okColor));
	}

	return this.setColor(okColor);
};
