import { Snowflake } from "discord.js";

export type RegexpType = { match: RegExpMatchArray };
export type RespType = { anime: string, character: string, quote: string };
export type EmoteReactObjectType = { [keyWord: string]: Snowflake };
export type SeparatedEmoteReactTypes = {
    has_space: EmoteReactObjectType,
    no_space: EmoteReactObjectType
};

export type TheseDoNotYetExist = "APPLICATION_COMMAND_PERMISSIONS_V2"
    | "BOOSTING_TIERS_EXPERIMENT_MEDIUM_GUILD"
    | "MEMBER_PROFILES"
    | "NEW_THREAD_PERMISSIONS"
    | "THREADS_ENABLED"
    | "THREE_DAY_THREAD_ARCHIVE"
    | "TEXT_IN_VOICE_ENABLED";

export type Oldies = "DISCORD_EMPLOYEE"
    | "PARTNERED_SERVER_OWNER"
    | "HYPESQUAD_EVENTS";
