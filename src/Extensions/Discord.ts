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
    }
}

import { ColorResolvable, Guild, GuildMember } from "discord.js";
import { Message } from "discord.js";

Guild.prototype.isDadBotEnabled = function(guild?: Guild) {
	return enabledDadBotGuilds?.includes(guild?.id ?? this.id);
};

GuildMember.prototype.hasExcludedRole = function(member?: GuildMember) {
	return !(member ?? this as GuildMember).roles.cache.find((r) => r.name === config.names);
};

Message.prototype.getMemberColorAsync = async function(member?: GuildMember) {
	return <ColorResolvable> (member ?? this?.member)?.displayColor || "#f47fff";
};
