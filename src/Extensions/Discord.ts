import { Command, PrefixSupplier } from "@cataclym/discord-akairo";
import { config } from "../config";

// cache
const dadbotCache: {[key: string]: boolean} = {};
const errorColorCache: {[key: string]: string} = {};
const okColorCache: {[key: string]: string} = {};

function getPrefix(message: Message, command: Command) {
	const prefix = (command.handler.prefix as PrefixSupplier)(message);
	if (Array.isArray(prefix)) return prefix[0] as string;
	return prefix as string;
}

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
        withOkColor(m: Message): this;
        withErrorColor(m: Message): this;
    }
}

import { ColorResolvable, Guild, GuildMember, Message, MessageEmbed } from "discord.js";
import { customClient } from "../struct/client";
import { errorColor, okColor } from "../nsb/Util";

Message.prototype.args = function(command: Command) {
	return (command.handler.parseWithPrefix(this, getPrefix(this, command)))?.content;
};

Message.prototype.getMemberColorAsync = async function(member?: GuildMember) {
	return <ColorResolvable> (member ?? this?.member)?.displayColor || "#f47fff";
};

GuildMember.prototype.hasExcludedRole = function(member?: GuildMember) {
	return !(member ?? this as GuildMember).roles.cache.find((r) => r.name === config.names);
};

Guild.prototype.isDadBotEnabled = function(guild?: Guild) {

	const g = guild ?? this as Guild;
	let enabled = dadbotCache[g.id];

	if (typeof enabled !== "boolean") {
		enabled = (g.client as customClient).addons.get(g.id, "dadBot", false);
		dadbotCache[g.id] = enabled;
	}

	return enabled;
};

MessageEmbed.prototype.withErrorColor = function(m: Message) {

	if (m.guild?.id) {
		let color = errorColorCache[m.guild.id];

		if (!color) {
			color = (m.client as customClient).addons.get(m.guild.id, "errorColor", errorColor);
			errorColorCache[m.guild.id] = color;
		}
		this.color = color;
		return this;
	}
	this.color = okColor;
	return this;
};

MessageEmbed.prototype.withOkColor = function(m: Message) {

	if (m.guild?.id) {

		let color = okColorCache[m.guild.id];

		if (!color) {
			color = (m.client as customClient).addons.get(m.guild?.id, "okColor", okColor);
			errorColorCache[m.guild.id] = color;
		}
		this.color = color;
		return this;
	}
	this.color = okColor;
	return this;
};
