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
    }

    export interface MessageEmbed {
        withOkColor(m: Message): ColorResolvable;
        withErrorColor(m: Message): ColorResolvable;
    }
}

import { ColorResolvable, Guild, GuildMember, Message, MessageEmbed } from "discord.js";
import { Command, PrefixSupplier } from "@cataclym/discord-akairo";
import { config } from "../config";
import { errorColor } from "../nsb/Util";
import db from "quick.db";

const guildConfigTable = new db.table("guildConfig");

function guildConfig(id: string | undefined) {
	if (!id) return undefined;
	return guildConfigTable.get(id);
}

function getPrefix(message: Message, command: Command) {
	const prefix = (command.handler.prefix as PrefixSupplier)(message);
	if (Array.isArray(prefix)) return prefix[0] as string;
	return prefix as string;
}

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
	const value = guildConfig(guild?.id ?? this.id)?.dadbot;
	return value ? value : false;
};

MessageEmbed.prototype.withErrorColor = function(m: Message) {
	return guildConfig(m.guild?.id)?.errorColor ?? errorColor;
};

MessageEmbed.prototype.withOkColor = function(m: Message) {
	return guildConfig(m.guild?.id)?.okColor ?? "#7cfc00";
};

