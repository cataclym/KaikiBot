import { config } from "../config";
import db from "quick.db";
const guildConfig = new db.table("guildConfig");

let enabledDadBotGuilds = guildConfig.get("dadbot");
export async function updateVar(value: string[]): Promise<void> {
	enabledDadBotGuilds = value;
}

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
}

import { ColorResolvable, Guild, GuildMember } from "discord.js";
import { Message } from "discord.js";
import { Command } from "@cataclym/discord-akairo";

Guild.prototype.isDadBotEnabled = function(guild?: Guild) {
	return enabledDadBotGuilds?.includes(guild?.id ?? this.id);
};

GuildMember.prototype.hasExcludedRole = function(member?: GuildMember) {
	return !(member ?? this as GuildMember).roles.cache.find((r) => r.name === config.names);
};

Message.prototype.getMemberColorAsync = async function(member?: GuildMember) {
	return <ColorResolvable> (member ?? this?.member)?.displayColor || "#f47fff";
};

function getPrefix(message: Message, command: Command) {
	const prefix = (command.handler.prefix as (m: Message) => string | string[])(message);
	if (Array.isArray(prefix)) return prefix[0];
	return prefix;
}

Message.prototype.args = function(command: Command) {
	return (command.handler.parseWithPrefix(this, getPrefix(this, command)))?.content;
};

