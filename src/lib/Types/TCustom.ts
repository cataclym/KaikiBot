import { Snowflake } from "discord.js";

export type regexpType = { match: RegExpMatchArray };
export type respType = { anime: string, character: string, quote: string };
export type emoteReactObjectType = { [keyWord: string]: Snowflake };
export type separatedEmoteReactTypes = {
    has_space: emoteReactObjectType,
    no_space: emoteReactObjectType
};

export type theseDoNotYetExist = "BOOSTING_TIERS_EXPERIMENT_MEDIUM_GUILD"
    | "MEMBER_PROFILES"
    | "NEW_THREAD_PERMISSIONS"
    | "THREADS_ENABLED"
    | "TEXT_IN_VOICE_ENABLED";

export type Oldies = "DISCORD_EMPLOYEE"
    | "PARTNERED_SERVER_OWNER"
    | "HYPESQUAD_EVENTS";
