// noinspection MagicNumberJS

import { BotSettings_ActivityType } from "@prisma/client";
import { ActivityType, ChannelType, GuildFeature, RGBTuple, UserFlagsString } from "discord.js";
import { TheseDoNotYetExist } from "../lib/Types/Miscellaneous";

export default class Constants {

    static dadBotArray = ["i'm ", "im ", "i am ", "i’m "];

    static badWord = ["shit", "fuck", "stop", "dont", "kill", "don't", "don`t", "fucking", "shut", "shutup", "shuttup", "trash", "bad", "hate", "stupid", "dumb", "suck", "sucks"];

    static anniversaryStrings = {
        ROLE_JOIN: "Join Anniversary",
        ROLE_CREATED: "Cake Day",
    };

    // Credit to https://github.com/Snitt/emojibotten/blob/master/commands/management/emoji.js
    static emoteRegex = /<(a?)((!?\d+)|(:.+?:\d+))>/g;
    static imageRegex = /(http(s?):)([/|.\w\s-])*\.(?:jpg|gif|png|jpeg)/gi;

    static guildFeatures: { [index in GuildFeature]: string } & { [index in TheseDoNotYetExist]: string } = {
        ANIMATED_BANNER: "Animated banner",
        ANIMATED_ICON: "Animated icon",
        APPLICATION_COMMAND_PERMISSIONS_V2: "Application permissions v2",
        AUTO_MODERATION: "Auto moderation",
        BANNER: "Banner",
        BOOSTING_TIERS_EXPERIMENT_MEDIUM_GUILD: "Experimental boosting tiers",
        COMMUNITY: "Community",
        CREATOR_MONETIZABLE_PROVISIONAL: "Creator monetization enabled",
        CREATOR_STORE_PAGE: "Creator store page",
        DEVELOPER_SUPPORT_SERVER: "Developer support server",
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
        ROLE_SUBSCRIPTIONS_AVAILABLE_FOR_PURCHASE: "Role subscription available",
        ROLE_SUBSCRIPTIONS_ENABLED: "Role subscription enabled",
        TEXT_IN_VOICE_ENABLED: "Text in voice",
        THREADS_ENABLED: "Threads enabled",
        THREE_DAY_THREAD_ARCHIVE: "Three-day thread archives",
        TICKETED_EVENTS_ENABLED: "Ticketed events enabled",
        VANITY_URL: "Vanity URL",
        VERIFIED: "Verified",
        VIP_REGIONS: "VIP Regions",
        WELCOME_SCREEN_ENABLED: "Welcome screen enabled",
    };

    static categories: { [category: string]: string } = {
        Administration: "For server admins. Manage bans and channels.",
        Anime: "Search anime, manga and quotes.",
        Emotes: "Steal or create new emotes",
        Fun: "Silly commands. Has avatar manipulation, games and more",
        Gambling: "Try your game at betting. Gain and lose. Lose a lot",
        Interactions: "Put your feelings on display with kiss, or just hug, or something else?",
        Images: "Spawn cute anime waifus!",
        Moderation: "Moderate the chat with clear, kick and savechat",
        NSFW: "🔞",
        "Owner only": "**Bot owner only.** Manage the bot and execute dangerous commands",
        Roles: "Create, edit and manage server roles, personal roles and more",
        "Server settings": "Configure the bot for your server",
        Utility: "Info, color, search, ping and much more.",
    };

    static channelTypes: { [type in keyof typeof ChannelType]: string } = {
        AnnouncementThread: "AnnouncementThread",
        DM: "DM",
        GroupDM: "GroupDM",
        GuildAnnouncement: "Guild Announcements",
        GuildCategory: "Category",
        GuildDirectory: "GuildDirectory",
        GuildForum: "Guild Forum",
        GuildNews: "News",
        GuildNewsThread: "News thread",
        GuildPrivateThread: "Private thread",
        GuildPublicThread: "Public thread",
        GuildStageVoice: "Stage",
        GuildText: "Text",
        GuildVoice: "Voice",
        PrivateThread: "PrivateThread",
        PublicThread: "PublicThread",
    };

    static flags: { [index in UserFlagsString]: string } = {
        ActiveDeveloper: "Acrive developer",
        BotHTTPInteractions: "Bot interactions",
        BugHunterLevel1: "Bug Hunter (Level 1) 🐛",
        BugHunterLevel2: "Bug Hunter (Level 2) 🐛",
        CertifiedModerator: "Certified Moderator",
        HypeSquadOnlineHouse1: "House of Bravery 🏠",
        HypeSquadOnlineHouse2: "House of Brilliance 🏠",
        HypeSquadOnlineHouse3: "House of Balance 🏠",
        Hypesquad: "HypeSquad Events Member 🎊",
        Partner: "Partnered Server Owner ❤️",
        PremiumEarlySupporter: "Nitro Early Supporter 👍",
        Quarantined: "Quarantined/Disabled user ☣",
        Spammer: "Identified spammer ⚠",
        Staff: "Discord Employee 👨‍💼",
        TeamPseudoUser: "Team User 🏁",
        VerifiedBot: "Verified Bot ☑️",
        VerifiedDeveloper: "Early Verified Developer ✅",
    };

    static activityTypes: { [index in BotSettings_ActivityType]: Exclude<ActivityType, ActivityType.Custom> } = {
        PLAYING: 0,
        STREAMING: 1,
        LISTENING: 2,
        WATCHING: 3,
        COMPETING: 4,
    };

    static readonly MAGIC_NUMBERS = Object.freeze({
        CACHE: {
            FIFTEEN_MINUTES_MS: 900000,
        },
        CMDS: {
            ANIME: {},
            EMOTES: {
                ADD_EMOTE: {
                    NAME_MAX_LENGTH: 32,
                },
                DELETE_EMOTE: {
                    DELETE_DELAY: 3500,
                },

                EMOTE_COUNT: {
                    MIN_PR_PAGE: 25,
                    MAX_PR_PAGE: 50,
                },
                MAX_FILESIZE: 25600,
                MAX_WIDTH_HEIGHT: 128,
            },
            ETC: {
                BOT_MENTION: {
                    DELETE_TIMEOUT: 10000,
                },
                DAD_BOT: {
                    DADBOT_NICK_LENGTH: 32,
                    DADBOT_MAX_LENGTH: 256,
                },
            },
            FUN: {
                NAMES: {
                    NAMES_PR_PAGE: 60,
                },
                NEOFETCH: {
                    DISTROS_PR_PAGE: 150,
                },
                REDDIT: {
                    NSFW_DEL_TIMEOUT: 7500,
                },
            },
            GAMBLING: {
                BET_ROLL: {
                    TWO_TIMES_ROLL: 66,
                    FOUR_TIMES_ROLL: 90,
                    TEN_TIMES_ROLL: 100,
                },
                CUR_TRS: {
                    BIGINT_ZERO: 0n,
                    TRANS_PR_PAGE: 15,
                },
                SLOTS: {
                    EDIT_AFTER_1_SEC: 1000,
                    // * Almost two seconds.
                    EDIT_AFTER_2_SEC: 2100,
                },
            },
            MODERATION: {
                CLEAR: {
                    DELETE_TIMEOUT: 1500,
                },
            },
            OWNER_ONLY: {
                BOT_CONFIG: {
                    DAILY_AMOUNT: 250,
                    DEFAULT_CUR_CODE: 128180,
                },
                EVAL: {
                    MAX_STRING: 1990,
                    MAX_ERROR_STRING: 1960,
                },
                SQL: {
                    MESSAGE_LIMIT_JSON: 1960,
                },
                UPDATE: {
                    DESC_STR_LIMIT: 4048,
                    TIMEOUT: 300000,
                },
            },
            ROLES: {
                IN_ROLE: {
                    ROLES_PR_PAGE: 40,
                },
                ROLE_LIST: {
                    ROLES_PR_PAGE: 50,
                },
                USER_ROLES: {
                    ROLE_PR_PAGE: 20,
                },
            },
            SERVER_SETTINGS: {
                EMOTES: {
                    EMOTE_TRIGGERS_PR_PAGE: 15,
                },
            },
            UTILITY: {
                COLOR: {
                    CLR_NAMES_PR_PAGE: 15,
                },
                SERVER_LIST: {
                    GUILDS_PER_PAGE: 15,
                },
                TODO: {
                    INPUT_MAX_LENGTH: 204,
                },

            },
        },
        COMMON: {
            NAME_LIMIT: 32,
        },
        EMBED_LIMITS: {
            AUTHOR_NAME: 256,
            DESCRIPTION: 4096,
            FIELD: {
                NAME: 256,
                VALUE: 1024,
            },
            FOOTER: {
                TEXT: 2048,
            },
            TITLE: 256,
        },

        LIB: {
            GAMES: {
                TTT: {
                    MSG_DEL_TIMEOUT: 4500,
                },
            },
            HENTAI: {
                HENTAI_SERVICE: {
                    FULL_CACHE_SIZE: 200,
                    HTTP_REQUESTS: {
                        BAD_GATEWAY: 502,
                        OK: 200,
                        SERVICE_UNAVAILABLE: 503,
                        TOO_MANY_REQUESTS: 429,
                    },
                    MEDIUM_CACHE_SIZE: 50,
                },
            },
            KAIKI: {
                KAIKI_ARGS: {
                    MAX_COLOR_VALUE: 0xFFFFFF,
                    // eslint-disable-next-line @typescript-eslint/no-loss-of-precision
                    MAX_INT: 0x7FFFFFFFFFFFFFFF,
                    // ABSOLUTE ZERO IN BINARY
                    MIN_INT: 0b0,
                },
                PRESENCE_UPDATE_TIMEOUT: 300000,
            },
            MONEY: {
                MONEY_SERVICE: {
                    BIGINT_ZERO: 0n,
                },
            },
            UTILITY: {
                // [R,G,B]
                ERR_CLR: [255, 0, 0] as RGBTuple,
                HRS_DAY: 24,
                OK_CLR: [0, 255, 0] as RGBTuple,
            },
        },
    });

    static readonly errorColor = Constants.MAGIC_NUMBERS.LIB.UTILITY.ERR_CLR;

    static readonly okColor = Constants.MAGIC_NUMBERS.LIB.UTILITY.OK_CLR;
}
