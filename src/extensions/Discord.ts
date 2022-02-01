import { Guild, GuildMember, Message, MessageEmbed } from "discord.js";
import Utility from "../lib/Utility";
import { KaikiClient } from "kaiki";

export const extensionHook = (): void => {
    return;
};

declare module "discord.js" {
    export interface Guild {
        determineIsDadBotEnabled(message?: Message): boolean;
        client: KaikiClient;
    }

    export interface GuildMember {
        hasExcludedRole(member?: GuildMember): boolean;
        client: KaikiClient;
    }

    export interface Message {
        getMemberColorAsync(member?: GuildMember): Promise<ColorResolvable>;
        client: KaikiClient;
    }

    export interface MessageEmbed {
        withOkColor(m?: Message | Guild): this;
        withErrorColor(m?: Message | Guild): this;
    }
}

GuildMember.prototype.hasExcludedRole = function(member?: GuildMember) {

    const member1 = member ?? this as GuildMember;
    const roleId = (member1.guild.client as KaikiClient).guildProvider.get(member1.guild.id, "ExcludeRole", "");

    return !member1.roles.cache.get(roleId);
};

Guild.prototype.determineIsDadBotEnabled = function(message?: Message) {

    const g = message?.guild ?? this as Guild;

    if (g && (g.client as KaikiClient).guildProvider.get(g.id, "DadBot", false)) {
        return message
            ? !!message.client.dadBotChannelsProvider.get(message.channelId, "ChannelId", false)
            : true;
    }
    return false;
};

MessageEmbed.prototype.withErrorColor = function(m?: Message | Guild) {

    if (m) {
        if (m instanceof Message && m.guild) {
            return this.setColor((m.client as KaikiClient).guildProvider.get(m.guildId!, "ErrorColor", Utility.errorColor));
        }
        return this.setColor((m.client as KaikiClient).guildProvider.get(m.id, "ErrorColor", Utility.errorColor));
    }

    return this.setColor(Utility.errorColor);
};

MessageEmbed.prototype.withOkColor = function(m?: Message | Guild) {

    if (m) {
        if (m instanceof Message && m.guild) {
            return this.setColor((m.client as KaikiClient).guildProvider.get(m.guildId!, "OkColor", Utility.okColor));
        }
        return this.setColor((m.client as KaikiClient).guildProvider.get(m.id, "OkColor", Utility.okColor));
    }

    return this.setColor(Utility.okColor);
};
