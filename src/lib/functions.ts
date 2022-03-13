import { Snowflake } from "discord-api-types";
import { GuildMember, Message, MessageEmbed } from "discord.js";
import logger from "loglevel";
import { badWords } from "../struct/constants";
import type { regexpType, separatedEmoteReactTypes } from "Types/TCustom";
import Utility from "./Utility";
import { PrismaClient } from "@prisma/client";
import chalk from "chalk";

// TODO: Verify this!!
export async function populateERCache(message: Message<true>) {

    const emoteReacts = (await message.client.orm.emojiReactions.findMany({ where: { GuildId: BigInt(message.guildId) } }))
        .map(table => [table.TriggerString, table.EmojiId]);

    if (!emoteReacts.length) {
        message.client.cache.emoteReactCache.set(message.guildId, new Map([["has_space", new Map()], ["no_space", new Map()]]));
    }

    else {
        const [array_has_space, array_no_space] = Utility.partition(emoteReacts, ([k]) => k.includes(" "));

        message.client.cache.emoteReactCache.set(message.guildId, new Map([["has_space", new Map(array_has_space)], ["no_space", new Map(array_no_space)]]));
    }
}

// Reacts with emote to specified words
export async function emoteReact(message: Message<true>): Promise<void> {

    const id = message.guildId,
        messageContent = message.content.toLowerCase();
    let emotes = message.client.cache.emoteReactCache.get(id);

    if (!emotes) {
        await populateERCache(message);
        emotes = message.client.cache.emoteReactCache.get(id);
    }

    const matches = Array.from(emotes?.get("has_space")?.keys() || [])
        .filter(k => messageContent.match(new RegExp(k.toLowerCase(), "g")));

    for (const word of messageContent.split(" ")) {
        if (emotes?.get("no_space")?.has(word)) {
            matches.push(word);
        }
    }

    if (!matches.length) return;

    return emoteReactLoop(message, matches, emotes!);
}

async function emoteReactLoop(message: Message, matches: RegExpMatchArray, wordObj: Map<TEmoteStringTypes, Map<TEmoteTrigger, TTriggerString>>) {
    for (const word of matches) {
        const emote = wordObj.get("no_space")?.get(word) || wordObj.get("has_space")?.get(word);
        if (!message.guild?.emojis.cache.has(emote as Snowflake) || !emote) continue;
        await message.react(emote);
    }
}

export async function tiredKaikiCryReact(message: Message<true>): Promise<void> {

    const botName = message.client.user?.username.toLowerCase().split(" ");

    if (!botName) {
        return;
    }

    if (new RegExp(botName.join("|")).test(message.content.toLowerCase())
        && new RegExp(badWords.join("|")).test(message.content.toLowerCase())) {

        // Absolute randomness
        if (Math.floor(Math.random() * 10) < 7) {
            await message.react("😢");
        }

        else {
            await message.channel.send("😢");
        }
    }
}

export async function resetDailyClaims(orm: PrismaClient): Promise<void> {
    const updated = await orm.discordUsers.updateMany({
        where: {
            ClaimedDaily: true,
        },
        data: {
            ClaimedDaily: false,
        },
    });
    logger.info(`resetDailyClaims | Daily claims have been reset! Updated ${chalk.green(updated.count)} entries!`);
}

export async function countEmotes(message: Message): Promise<void> {
    if (message.guild) {
        const { guild } = message,
            emotes = message.content.match(/<?(a)?:.+?:\d+>/g);
        if (emotes) {
            const ids = emotes.toString().match(/\d+/g);
            if (ids) {
                const request = ids.map(item => {
                    const emote = guild.emojis.cache.get(item as Snowflake);
                    if (emote) {
                        return message.client.orm.emojiStats.upsert({
                            where: {
                                EmojiId: BigInt(emote.id),
                            },
                            create: {
                                EmojiId: BigInt(emote.id),
                                Count: BigInt(1),
                                GuildId: BigInt(guild.id),
                            },
                            update: {
                                Count: {
                                    increment: 1n,
                                },
                            },
                        });
                    }
                    // Heck you
                }).filter((item): item is any => !!item);
                await message.client.orm.$transaction(request);
            }
        }
    }
}

export function msToTime(duration: number): string {
    const milliseconds: number = Math.floor((duration % 1000) / 100);
    let seconds: number | string = Math.floor((duration / 1000) % 60),
        minutes: number | string = Math.floor((duration / (1000 * 60)) % 60),
        hours: number | string = Math.floor((duration / (1000 * 60 * 60)) % 24);

    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;

    return `**${hours}** hours **${minutes}** minutes **${seconds}.${milliseconds}** seconds`;
}

export async function sendDM(message: Message): Promise<Message | undefined> {

    let attachmentLinks = "";
    logger.info(`message | DM from ${message.author.tag} [${message.author.id}]`);

    const embed = new MessageEmbed({
        author: { name: `${message.author.tag} [${message.author.id}]` },
        description: Utility.trim(message.content, 2048),
    })
        .withOkColor();

    // Attachments lol
    const { attachments } = message;

    if (attachments.first()) {

        const urls: string[] = attachments.map(a => a.url);

        const restLinks = [...urls];
        restLinks.shift();
        attachmentLinks = restLinks.join("\n");

        const firstAttachment = attachments.first()?.url as string;

        embed
            .setImage(firstAttachment)
            .setTitle(firstAttachment)
            .setFooter({ text: urls.join("\n") });
    }

    return message.client.owner.send({ content: attachmentLinks ?? null, embeds: [embed] });

}

export async function parsePlaceHolders(input: string, guildMember: GuildMember): Promise<string> {

    const lowercase = input.toLowerCase();

    if (lowercase.includes("%guild%")) {
        input = input.replace(/%guild%/ig, guildMember.guild.name);
    }
    if (lowercase.includes("%member%")) {
        input = input.replace(/%member%/ig, guildMember.user.tag);
    }
    return input;
}

export function isRegex(value: any): value is regexpType {
    return (value as regexpType).match !== undefined;
}
