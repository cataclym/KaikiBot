import { Snowflake } from "discord-api-types";
import { Guild, GuildMember, Message, MessageEmbed, User } from "discord.js";
import logger from "loglevel";
import { badWords } from "../struct/constants";
import type { separatedEmoteReactTypes } from "../cache/cache";
import { regexpType } from "../struct/types";
import Utility from "./Utility";
import { PrismaClient } from "@prisma/client";
import chalk from "chalk";

let botOwner: User | undefined;

export async function populateERCache(message: Message) {

    const emoteReacts = Object.entries((await getGuildDocument((message.guild as Guild).id)).emojiReactions);
    if (!emoteReacts.length) {
        emoteReactCache[message.guild!.id] = {
            has_space: {},
            no_space: {},
        };
        return;
    }

    const [array_has_space, array_no_space] = Utility.partition(emoteReacts, ([k]) => k.includes(" "));

    emoteReactCache[message.guild!.id] = {
        has_space: Object.fromEntries(array_has_space),
        no_space: Object.fromEntries(array_no_space),
    };
}


// Reacts with emote to specified words
export async function emoteReact(message: Message): Promise<void> {

    const gId = message.guild!.id,
        messageContent = message.content.toLowerCase();

    if (!emoteReactCache[gId]) await populateERCache(message);

    const emotes = emoteReactCache[message.guild!.id],
        matches = Object.keys(emotes.has_space)
            .filter(k => messageContent.match(new RegExp(k.toLowerCase(), "g")));

    for (const word of messageContent.split(" ")) {
        if (emotes.no_space[word]) {
            matches.push(word);
        }
    }

    if (!matches.length) return;

    return emoteReactLoop(message, matches, emotes);
}

async function emoteReactLoop(message: Message, matches: RegExpMatchArray, wordObj: separatedEmoteReactTypes) {
    for (const word of matches) {
        const emote = wordObj.no_space[word] || wordObj.has_space[word];
        if (!message.guild?.emojis.cache.has(emote as Snowflake)) continue;
        await message.react(emote);
    }
}

export async function tiredKaikiCryReact(message: Message): Promise<void> {

    const botName = message.client.user?.username.toLowerCase().split(" ");

    if (!botName) {
        return;
    }

    if (new RegExp(botName.join("|")).test(message.content.toLowerCase())
		&& new RegExp(badWords.join("|")).test(message.content.toLowerCase())) {

        const index: number = Math.floor(Math.random() * 10);

        if (index < 7) {
            await message.react("😢");
        }

        else {
            message.channel.send("😢");
        }
    }
}

// export async function resetRolls(): Promise<void> {
//     // Tinder reset
//     // clearRollCache();
//     tinderDataModel.updateMany({ rolls: { $lt: 15 } }, { rolls: 15, temporary: [], likes: 3 }, null, () => {
//         logger.info(`mongooseDB | Reset tinder rolls/likes at ${Date()}`);
//     });
// }

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
    if (message.author.id === process.env.OWNER) return;
    // I don't want see my own messages, thank u

    if (!botOwner) botOwner = message.client.users.cache.get(process.env.OWNER as Snowflake);

    let attachmentLinks = "";
    logger.info(`message | DM from ${message.author.tag} [${message.author.id}]`);

    const embed = new MessageEmbed({
        author: { name: `${message.author.tag} [${message.author.id}]` },
        description: Utility.trim(message.content, 2048),
    })
        .withOkColor();

    // Attachments (Terrible, I know)
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

    return botOwner?.send({ content: attachmentLinks ?? null, embeds: [embed] });

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
