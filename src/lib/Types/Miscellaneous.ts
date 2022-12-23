import { Snowflake } from "discord.js";

export type RegexpType = { match: RegExpMatchArray };
export type RespType = { anime: string, character: string, quote: string };
export type EmoteReactObjectType = { [keyWord: string]: Snowflake };

export type TheseDoNotYetExist = "APPLICATION_COMMAND_PERMISSIONS_V2"
    | "AUTO_MODERATION"
    | "BOOSTING_TIERS_EXPERIMENT_MEDIUM_GUILD"
    | "MEMBER_PROFILES"
    | "NEW_THREAD_PERMISSIONS"
    | "THREADS_ENABLED"
    | "THREE_DAY_THREAD_ARCHIVE"
    | "TEXT_IN_VOICE_ENABLED";
