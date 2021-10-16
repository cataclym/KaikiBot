import { GuildFeatures } from "discord.js";

export const dadbotArray = ["i'm ", "im ", "i am ", "i’m "];

export const badWords = ["shit", "fuck", "stop", "dont", "kill", "don't", "don`t", "fucking", "shut", "shutup", "shuttup", "trash", "bad", "hate", "stupid", "dumb", "suck", "sucks"];

export const AnniversaryStrings = {
	roleNameJoin: "Join Anniversary",
	roleNameCreated: "Cake Day",
};

export const EMOTE_REGEX = /<(a?)((!?\d+)|(:.+?:\d+))>/g;
export const IMAGE_REGEX = /(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png|jpeg)/gi;
// Credit to https://github.com/Snitt/emojibotten/blob/master/commands/management/emoji.js

export const guildFeatures: {[index in GuildFeatures]: string} = {
	ANIMATED_ICON: "Animated icon",
	BANNER: "Banner",
	COMMERCE: "Commerce",
	COMMUNITY: "Community",
	DISCOVERABLE: "Disoverable",
	FEATURABLE: "Featurable",
	INVITE_SPLASH: "Invite splash",
	MEMBER_VERIFICATION_GATE_ENABLED: "Member verification enabled",
	MONETIZATION_ENABLED: "Monetization enabled",
	MORE_STICKERS: "More stickers",
	NEWS: "News",
	PARTNERED: "Partnered",
	PREVIEW_ENABLED: "Preview enabled",
	PRIVATE_THREADS: "Private threads",
	ROLE_ICONS: "Role icons",
	SEVEN_DAY_THREAD_ARCHIVE: "Seven day thread archive",
	THREE_DAY_THREAD_ARCHIVE: "Three day thread archive",
	TICKETED_EVENTS_ENABLED: "Ticketed events enabled",
	VANITY_URL: "Vanity URL",
	VERIFIED: "Verified",
	VIP_REGIONS: "VIP Regions",
	WELCOME_SCREEN_ENABLED: "Welcome screen enabled",
};