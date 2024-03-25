import { Snowflake } from "discord.js";
import { ERCacheType } from "../../Cache/KaikiCache";

export type EmoteTrigger = string;
export type GuildString = Snowflake;
export type TriggerString = string;
export type EmoteReactCache = Map<
    GuildString,
    Map<ERCacheType, Map<EmoteTrigger, TriggerString>>
>;

export type PartitionResult = [[string, bigint][], [string, bigint][]];
