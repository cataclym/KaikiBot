import { ColorResolvable, EmbedBuilder, Guild, GuildMember, Message } from "discord.js";
import KaikiAkairoClient from "../lib/Kaiki/KaikiAkairoClient";
import Constants from "../struct/Constants";

export const extensionHook = () => null;

declare module "discord.js" {
    export interface Guild {
        isDadBotEnabled(message?: Message): boolean;

        client: KaikiAkairoClient<true>;
    }

    export interface GuildMember {
        hasExcludedRole(member?: GuildMember): boolean;

        client: KaikiAkairoClient<true>;
    }

    export interface Message {
        getMemberColorAsync(member?: GuildMember): Promise<ColorResolvable>;

        client: KaikiAkairoClient<true>;
    }

    export interface EmbedBuilder {
        withOkColor(m?: Message | Guild): this;

        withErrorColor(m?: Message | Guild): this;
    }

    export interface ButtonInteraction {
        client: KaikiAkairoClient<true>;
    }

}

GuildMember.prototype.hasExcludedRole = function(member?: GuildMember) {

    member = member || this as GuildMember;

    const roleId = member.guild.client.guildsDb.get(member.guild.id, "ExcludeRole", undefined);

    return !!member.roles.cache.get(roleId);
};

Guild.prototype.isDadBotEnabled = function(message?: Message) {

    const g = message?.guild || this as Guild;

    if (g && g.client.guildsDb.get(g.id, "DadBot", false)) {

        if (message) {
            return !message.client.dadBotChannels.items.get(message.channelId);
        }

        else {
            return true;
        }
    }
    return false;
};

EmbedBuilder.prototype.withErrorColor = function(messageOrGuild?: Message | Guild) {

    if (messageOrGuild) {

        if (messageOrGuild instanceof Message && messageOrGuild.inGuild()) {
            return this.setColor(messageOrGuild.client.guildsDb.get(messageOrGuild.guildId, "ErrorColor", Constants.errorColor));
        }

        else {
            return this.setColor(messageOrGuild.client.guildsDb.get(messageOrGuild.id, "ErrorColor", Constants.errorColor));
        }
    }

    return this.setColor(Constants.errorColor);
};

EmbedBuilder.prototype.withOkColor = function(messageOrGuild?: Message | Guild) {

    if (messageOrGuild) {

        if (messageOrGuild instanceof Message && messageOrGuild.inGuild()) {
            return this.setColor(messageOrGuild.client.guildsDb.get(messageOrGuild.guildId, "OkColor", Constants.okColor));
        }

        else {
            return this.setColor(messageOrGuild.client.guildsDb.get(messageOrGuild.id, "OkColor", Constants.okColor));
        }
    }

    return this.setColor(Constants.okColor);
};
