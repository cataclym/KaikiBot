import { Command, PrefixSupplier } from "@cataclym/discord-akairo";
import { config } from "../config";

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
    }

    export interface MessageEmbed {
        withOkColor(m: Message): ColorResolvable;
        withErrorColor(m: Message): ColorResolvable;
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
	return (g.client as customClient).guildDB.get(g.id, "dadbot", false);
};

MessageEmbed.prototype.withErrorColor = function(m: Message) {
	return m.guild?.id ? (m.client as customClient).guildDB.get(m.guild?.id, "errorColor", errorColor) : errorColor;
};

MessageEmbed.prototype.withOkColor = function(m: Message) {
	return m.guild?.id ? (m.client as customClient).guildDB.get(m.guild?.id, "okColor", okColor) : okColor;

};
