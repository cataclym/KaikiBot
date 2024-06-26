import fs from "fs";
import { Message } from "discord.js";
import sharp from "sharp";
import Constants from "../../struct/Constants";

export default class Emotes {
    // Deletes files at filepath
    static async deleteImage(file: fs.PathLike): Promise<void> {
        fs.unlink(file, (err) => {
            if (err) throw err;
            return Promise.resolve();
        });
    }

    // Resizes images, including gifs - returns them in buffer format
    static async resizeImage(
        file: string,
        imgSize?: number
    ): Promise<string | Buffer> {
        const bool = file.endsWith("gif");

        const sharpFile = await sharp(file, { animated: bool });

        return Promise.resolve(
            sharpFile
                .resize(
                    imgSize ||
						Constants.MAGIC_NUMBERS.CMDS.EMOTES.MAX_WIDTH_HEIGHT,
                    imgSize ||
						Constants.MAGIC_NUMBERS.CMDS.EMOTES.MAX_WIDTH_HEIGHT,
                    {
                        fit: "contain",
                        background: { r: 0, g: 0, b: 0, alpha: 0 },
                    }
                )
                .toBuffer()
        );
    }

    static getFilesizeInBytes(filename: fs.PathLike): Promise<number> {
        const stats = fs.statSync(filename);
        return Promise.resolve(stats.size);
    }

    static async saveEmoji(
        message: Message,
        file: string | Buffer,
        name: string
    ): Promise<Message> {
        const promise = await message.guild?.emojis.create({
            attachment: file,
            name,
        });

        if (promise) {
            return Promise.resolve(
                message.channel.send(
                    `Successfully uploaded **${name}** ${promise}.`
                )
            );
        } else {
            return Promise.resolve(
                message.channel.send(`Unable to create emoji: ${name}`)
            );
        }
    }

    // Takes a name and returns the output location for the saved file
    static filePath(name: string): string {
        // Makes file hidden
        return `./.images${name}`;
    }

    // Takes a URL and a path+filename and saves it..
    static async fetchEmote(url: string, saveAs: string) {
        if (fs.existsSync(saveAs)) {
            return Promise.reject();
        } else {
            const file = await fetch(url);

            if (!file.ok || !file.body) return Promise.reject();

            fs.writeFileSync(saveAs, new Uint8Array(await file.arrayBuffer()));

            return Promise.resolve();
        }
    }

    static async countEmotes(message: Message): Promise<void> {
        if (!message.guild) return;

        const { guild } = message,
            emotes = message.content.match(/<?(a)?:.+?:\d+>/g);

        if (!emotes) return;

        const ids = emotes.toString().match(/\d+/g);

        if (!ids) return;

        const request = ids
            .map((item) => {
                const emote = guild.emojis.cache.get(item);

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
            })
            .filter(<T>(n?: T): n is T => Boolean(n));

        await message.client.orm.$transaction(request);
    }
}
