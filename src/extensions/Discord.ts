import { Guild, GuildMember, Message, MessageEmbed } from "discord.js";
import KaikiAkairoClient from "../lib/Kaiki/KaikiAkairoClient";
import Utility from "../lib/Utility";

export const extensionHook = () => null;

declare module "discord.js" {
    export interface Guild {
        isDadBotEnabled(message?: Message): boolean;

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

    const roleId = member.guild.client.guildsDb.get(member.guild.id, "ExcludeRole", undefined);

    return !member.roles.cache.get(roleId);
};

Guild.prototype.isDadBotEnabled = function(message?: Message) {

    const g = message?.guild ?? this as Guild;

    if (g && g.client.guildsDb.get(g.id, "DadBot", false)) {
        return message
            ? !!message.client.dadBotChannels.get(message.channelId, "ChannelId", false)
            : true;
    }
    return false;
};

MessageEmbed.prototype.withErrorColor = function(m?: Message | Guild) {

    if (m) {
        if (m instanceof Message && m.guild) {
            return this.setColor((m.client as KaikiAkairoClient).guildsDb.get(m.guildId!, "ErrorColor", Utility.errorColor));
        }
        return this.setColor((m.client as KaikiAkairoClient).guildsDb.get(m.id, "ErrorColor", Utility.errorColor));
    }

    return this.setColor(Utility.errorColor);
};

MessageEmbed.prototype.withOkColor = function(m?: Message | Guild) {

    if (m) {
        if (m instanceof Message && m.guild) {
            return this.setColor((m.client as KaikiAkairoClient).guildsDb.get(m.guildId!, "OkColor", Utility.okColor));
        }
        return this.setColor((m.client as KaikiAkairoClient).guildsDb.get(m.id, "OkColor", Utility.okColor));
    }

    return this.setColor(Utility.okColor);
};
