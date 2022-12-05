import { BotSettings_ActivityType } from "@prisma/client";
import { ActivityType, ChannelType, GuildFeature, UserFlagsString } from "discord.js";
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

    static guildFeatures: { [index in GuildFeature]: string } & { [index in theseDoNotYetExist]: string } = {
        APPLICATION_COMMAND_PERMISSIONS_V2: "Application permissions v2",
        ANIMATED_ICON: "Animated icon",
        ANIMATED_BANNER: "Animated banner",
        BANNER: "Banner",
        BOOSTING_TIERS_EXPERIMENT_MEDIUM_GUILD: "Experimental boosting tiers",
        COMMUNITY: "Community",
        DISCOVERABLE: "Discoverable",
        FEATURABLE: "Can be featured",
        HAS_DIRECTORY_ENTRY: "Listed in a directory channel",
        HUB: "Student hub",
        INVITES_DISABLED: "Disabled invites",
        INVITE_SPLASH: "Invite splash",
        LINKED_TO_HUB: "Linked to student hub",
        MEMBER_PROFILES: "Member profiles",
        MEMBER_VERIFICATION_GATE_ENABLED: "Member verification enabled",
        MONETIZATION_ENABLED: "Monetization enabled",
        MORE_STICKERS: "More stickers",
        NEWS: "News",
        NEW_THREAD_PERMISSIONS: "New thread permissions",
        PARTNERED: "Partnered",
        PREVIEW_ENABLED: "Preview enabled",
        PRIVATE_THREADS: "Private threads",
        RELAY_ENABLED: "Enabled relay",
        ROLE_ICONS: "Role icons",
        TEXT_IN_VOICE_ENABLED: "Text in voice",
        THREE_DAY_THREAD_ARCHIVE: "Three-day thread archives",
        THREADS_ENABLED: "Threads enabled",
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

    static channelTypes: { [type in keyof typeof ChannelType]: string } = {
        GuildText: "Text",
        GuildNews: "News",
        GuildCategory: "Category",
        GuildVoice: "Voice",
        GuildStageVoice: "Stage",
        GuildNewsThread: "News thread",
        GuildPublicThread: "Public thread",
        GuildPrivateThread: "Private thread",
        GuildForum: "Guild Forum",
        GuildAnnouncement: "Guild Announcements",
        DM: "DM",
        GroupDM: "GroupDM",
        AnnouncementThread: "AnnouncementThread",
        PublicThread: "PublicThread",
        PrivateThread: "PrivateThread",
        GuildDirectory: "GuildDirectory",
    };

    static flags: { [index in UserFlagsString]: string } = {
        Staff: "Discord Employee 👨‍💼",
        Partner: "Partnered Server Owner ❤️",
        Hypesquad: "HypeSquad Events Member 🎊",
        BugHunterLevel1: "Bug Hunter (Level 1) 🐛",
        BugHunterLevel2: "Bug Hunter (Level 2) 🐛",
        HypeSquadOnlineHouse1: "House of Bravery 🏠",
        HypeSquadOnlineHouse2: "House of Brilliance 🏠",
        HypeSquadOnlineHouse3: "House of Balance 🏠",
        PremiumEarlySupporter: "Nitro Early Supporter 👍",
        TeamPseudoUser: "Team User 🏁",
        VerifiedBot: "Verified Bot ☑️",
        VerifiedDeveloper: "Early Verified Developer ✅",
        CertifiedModerator: "Certified Moderator",
        BotHTTPInteractions: "Bot interactions",
        Spammer: "Identified spammer ⚠",
        Quarantined: "Quarantined/Disabled user ☣",
    };

    static ActivityTypes: { [index in BotSettings_ActivityType]: Exclude<ActivityType, ActivityType.Custom> } = {
        PLAYING: 0,
        STREAMING: 1,
        LISTENING: 2,
        WATCHING: 3,
        COMPETING: 4,
    };
}
