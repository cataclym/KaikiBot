import { GuildFeatures } from "discord.js";
import { theseDoNotYetExist } from "../lib/Types/TCustom";

export default class Constants {

    static dadBotArray = ["i'm ", "im ", "i am ", "i’m "];

    static badWords = ["shit", "fuck", "stop", "dont", "kill", "don't", "don`t", "fucking", "shut", "shutup", "shuttup", "trash", "bad", "hate", "stupid", "dumb", "suck", "sucks"];

    static AnniversaryStrings = {
        roleNameJoin: "Join Anniversary",
        roleNameCreated: "Cake Day",
    };

    // Credit to https://github.com/Snitt/emojibotten/blob/master/commands/management/emoji.js
    static EMOTE_REGEX = /<(a?)((!?\d+)|(:.+?:\d+))>/g;
    static IMAGE_REGEX = /(http(s?):)([/|.\w\s-])*\.(?:jpg|gif|png|jpeg)/gi;

    static guildFeatures: { [index in GuildFeatures]: string } & { [index in theseDoNotYetExist]: string } = {
        ANIMATED_ICON: "Animated icon",
        BANNER: "Banner",
        BOOSTING_TIERS_EXPERIMENT_MEDIUM_GUILD: "Experimental boosting tiers",
        COMMERCE: "Commerce",
        COMMUNITY: "Community",
        DISCOVERABLE: "Discoverable",
        FEATURABLE: "Can be featured",
        INVITE_SPLASH: "Invite splash",
        MEMBER_PROFILES: "Member profiles",
        MEMBER_VERIFICATION_GATE_ENABLED: "Member verification enabled",
        MONETIZATION_ENABLED: "Monetization enabled",
        MORE_STICKERS: "More stickers",
        NEWS: "News",
        NEW_THREAD_PERMISSIONS: "New thread permissions",
        PARTNERED: "Partnered",
        PREVIEW_ENABLED: "Preview enabled",
        PRIVATE_THREADS: "Private threads",
        ROLE_ICONS: "Role icons",
        SEVEN_DAY_THREAD_ARCHIVE: "Seven day thread archive",
        TEXT_IN_VOICE_ENABLED: "Text in voice",
        THREADS_ENABLED: "Threads enabled",
        THREE_DAY_THREAD_ARCHIVE: "Three day thread archive",
        TICKETED_EVENTS_ENABLED: "Ticketed events enabled",
        VANITY_URL: "Vanity URL",
        VERIFIED: "Verified",
        VIP_REGIONS: "VIP Regions",
        WELCOME_SCREEN_ENABLED: "Welcome screen enabled",
    };

    static categories: { [category: string]: string } = {
        Administration: "For server admins. Manage bans and channels.",
        Anime: "Search anime, manga and quotes.",
        Emotes: "Steal or create entirely new emotes",
        Fun: "Silly commands. Has avatar manipulation, games and more",
        Gambling: "Try your game at betting. Gain and lose. Lose a lot",
        Interactions: "Put your feelings on display with kiss, or just hug, or something else?",
        Moderation: "Moderate the chat with clear, kick and savechat",
        NSFW: "🔞",
        "Owner only": "**Bot owner only.** Manage the bot and execute dangerous commands",
        Roles: "Create, edit and manage server roles, personal roles and more",
        "Server settings": "Commands to configure the bot for your server",
        Utility: "Info, color, search, ping and much more.",
    };

    static channelTypes: { [type: string]: string } = {
        GUILD_TEXT: "Text",
        GUILD_NEWS: "News",
        GUILD_CATEGORY: "Category",
        GUILD_VOICE: "Voice",
        GUILD_STAGE_VOICE: "Stage",
        GUILD_NEWS_THREAD: "News thread",
        GUILD_PUBLIC_THREAD: "Public thread",
        GUILD_PRIVATE_THREAD: "Private thread",
    };
}
