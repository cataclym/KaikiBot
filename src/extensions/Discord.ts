import { Guild, GuildMember, Message, MessageEmbed } from "discord.js";
import KaikiAkairoClient from "Kaiki/KaikiAkairoClient";
import Utility from "../lib/Utility";

export const extensionHook = () => null;

declare module "discord.js" {
    export interface Guild {
        determineIsDadBotEnabled(message?: Message): boolean;
        client: KaikiAkairoClient;
    }

    export interface GuildMember {
        hasExcludedRole(member?: GuildMember): boolean;
        client: KaikiAkairoClient;
    }

    export interface Message {
        getMemberColorAsync(member?: GuildMember): Promise<ColorResolvable>;
        client: KaikiAkairoClient;
    }

    export interface MessageEmbed {
        withOkColor(m?: Message | Guild): this;
        withErrorColor(m?: Message | Guild): this;
    }

    export interface Interaction {
        client: KaikiAkairoClient;
    }
}

GuildMember.prototype.hasExcludedRole = function(member?: GuildMember) {

    member = member || this as GuildMember;

    const roleId = member.guild.client.guildProvider.get(member.guild.id, "ExcludeRole", undefined);

    return !member.roles.cache.get(roleId);
};

Guild.prototype.determineIsDadBotEnabled = function(message?: Message) {

    const g = message?.guild ?? this as Guild;

    if (g && (g.client as KaikiAkairoClient).guildProvider.get(g.id, "DadBot", false)) {
        return message
            ? !!message.client.dadBotChannelsProvider.get(message.channelId, "ChannelId", false)
            : true;
    }
    return false;
};

MessageEmbed.prototype.withErrorColor = function(m?: Message | Guild) {

    if (m) {
        if (m instanceof Message && m.guild) {
            return this.setColor((m.client as KaikiAkairoClient).guildProvider.get(m.guildId!, "ErrorColor", Utility.errorColor));
        }
        return this.setColor((m.client as KaikiAkairoClient).guildProvider.get(m.id, "ErrorColor", Utility.errorColor));
    }

    return this.setColor(Utility.errorColor);
};

MessageEmbed.prototype.withOkColor = function(m?: Message | Guild) {

    if (m) {
        if (m instanceof Message && m.guild) {
            return this.setColor((m.client as KaikiAkairoClient).guildProvider.get(m.guildId!, "OkColor", Utility.okColor));
        }
        return this.setColor((m.client as KaikiAkairoClient).guildProvider.get(m.id, "OkColor", Utility.okColor));
    }

    return this.setColor(Utility.okColor);
};
