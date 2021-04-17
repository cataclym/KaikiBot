import { Command, PrefixSupplier } from "@cataclym/discord-akairo";
import { config } from "../config";

function getPrefix(message: Message, command: Command) {
	const prefix = (command.handler.prefix as PrefixSupplier)(message);
	if (Array.isArray(prefix)) return prefix[0] as string;
	return prefix as string;
}

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
        args(command: Command): string | undefined;
        getMemberColorAsync(member?: GuildMember): Promise<ColorResolvable>;
        client: customClient;
    }

    export interface MessageEmbed {
        withOkColor(m?: Message): this;
        withErrorColor(m?: Message): this;
    }
}

import { ColorResolvable, Guild, GuildMember, Message, MessageEmbed } from "discord.js";
import { customClient } from "../struct/client";
import { errorColor, okColor } from "../nsb/Util";
import { sessionCache } from "../cache/cache";

Message.prototype.args = function(command: Command) {
	return (command.handler.parseWithPrefix(this, getPrefix(this, command)))?.content;
};

Message.prototype.getMemberColorAsync = async function(member?: GuildMember) {
	return <ColorResolvable> (member ?? this?.member)?.displayColor || "#f47fff";
};

GuildMember.prototype.hasExcludedRole = function(member?: GuildMember) {
	return !(member ?? this as GuildMember).roles.cache
		.find((r) => r.name === config.dadbotRole);
};

Guild.prototype.isDadBotEnabled = function(guild?: Guild) {

	const g = guild ?? this as Guild;

	if (!g) return false;

	let enabled = sessionCache.dadbotCache[g.id];

	if (typeof enabled !== "boolean") {
		enabled = (g.client as customClient).guildSettings.get(g.id, "dadBot", false);
		sessionCache.dadbotCache[g.id] = enabled;
	}
	return enabled;
};

MessageEmbed.prototype.withErrorColor = function(m?: Message) {

	if (m?.guild?.id) {

		let color = sessionCache.errorColorCache[m.guild.id];

		if (!color) {
			color = m.client.guildSettings.get(m.guild.id, "errorColor", errorColor);
			sessionCache.errorColorCache[m.guild.id] = color;
		}
		return this.setColor(color);
	}
	return this.setColor(errorColor);
};

MessageEmbed.prototype.withOkColor = function(m?: Message) {

	if (m?.guild?.id) {

		let color = sessionCache.okColorCache[m.guild.id];

		if (!color) {
			color = m.client.guildSettings.get(m.guild.id, "okColor", okColor);
			sessionCache.okColorCache[m.guild.id] = color;
		}
		return this.setColor(color);
	}
	return this.setColor(okColor);
};
