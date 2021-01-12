import { config } from "../config";
import db from "quick.db";
const guildConfigTable = new db.table("guildConfig");

const guildConfig = (id: string | undefined) => {
	if (!id) return undefined;
	return guildConfigTable.get(id);
};

declare module "discord.js" {
    export interface Guild {
        isDadBotEnabled(guild?: Guild): boolean;
    }
    export interface GuildMember {
        hasExcludedRole(member?: GuildMember): boolean;
        // getMemberColorAsync(member?: GuildMember): Promise<ColorResolvable>;
    }
    export interface Message {
        getMemberColorAsync(member?: GuildMember): Promise<ColorResolvable>;
        args(command: Command): string | undefined;
    }

    export interface MessageEmbed {
        withOkColor(m: Message): ColorResolvable;
        withErrorColor(m: Message): ColorResolvable;
    }
}

function getPrefix(message: Message, command: Command) {
	const prefix = (command.handler.prefix as (m: Message) => string | string[])(message);
	if (Array.isArray(prefix)) return prefix[0];
	return prefix;
}

import { errorColor } from "../nsb/Util";
import { Command } from "@cataclym/discord-akairo";
import { ColorResolvable, Guild, GuildMember, Message, MessageEmbed } from "discord.js";

Guild.prototype.isDadBotEnabled = function(guild?: Guild) {
	const value = guildConfig(guild?.id ?? this.id)?.dadbot;
	if (value) {
		return value;
	}
	return false;
};

GuildMember.prototype.hasExcludedRole = function(member?: GuildMember) {
	return !(member ?? this as GuildMember).roles.cache.find((r) => r.name === config.names);
};

Message.prototype.getMemberColorAsync = async function(member?: GuildMember) {
	return <ColorResolvable> (member ?? this?.member)?.displayColor || "#f47fff";
};

Message.prototype.args = function(command: Command) {
	return (command.handler.parseWithPrefix(this, getPrefix(this, command)))?.content;
};

MessageEmbed.prototype.withOkColor = (m: Message) => {
	return guildConfig(m.guild?.id)?.okColor ?? "#7cfc00";
};

MessageEmbed.prototype.withErrorColor = (m: Message) => {
	return guildConfig(m.guild?.id)?.errorColor ?? errorColor;
};

