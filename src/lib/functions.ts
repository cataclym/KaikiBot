import { PrismaClient } from "@prisma/client";
import chalk from "chalk";
import { EmbedBuilder, GuildMember, Message } from "discord.js";
import logger from "loglevel";
import Constants from "../struct/Constants";
import { RegexpType } from "./Types/TCustom";
import Utility from "./Utility";

export async function tiredKaikiCryReact(message: Message<true>): Promise<void> {

    const botName = message.client.user?.username.toLowerCase().split(" ");

    if (!botName) {
        return;
    }

    if (new RegExp(botName.join("|")).test(message.content.toLowerCase())
        && new RegExp(Constants.BadWords.join("|")).test(message.content.toLowerCase())) {

        // Absolute randomness
        if (Math.floor(Math.random() * 10) < 7) {
            await message.react("😢");
        }

        else {
            await message.channel.send("😢");
        }
    }
}

export async function ResetDailyClaims(orm: PrismaClient): Promise<void> {
    const updated = await orm.discordUsers.updateMany({
        where: {
            ClaimedDaily: true,
        },
        data: {
            ClaimedDaily: false,
        },
    });
    logger.info(`ResetDailyClaims | Daily claims have been reset! Updated ${chalk.green(updated.count)} entries!`);
}

export async function sendDM(message: Message): Promise<Message | undefined> {

    if (message.author === message.client.owner) return;

    let attachmentLinks = "";
    logger.info(`Message | DM from ${message.author.tag} [${message.author.id}]`);

    const embed = new EmbedBuilder({
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

    return message.client.owner.send({ content: attachmentLinks ?? undefined, embeds: [embed] });

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

export function isRegex(value: unknown): value is RegexpType {
    return (value as RegexpType).match !== undefined;
}
