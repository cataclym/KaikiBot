import cp from "child_process";
import { GuildEmoji, Message } from "discord.js";
import fs from "fs";
import gifsicle from "gifsicle";
import sharp from "sharp";
import util from "util";
import Constants from "../struct/Constants";

export default class Emotes {

    static execFile = util.promisify(cp.execFile);

    static async deleteImage(file: fs.PathLike): Promise<void> {
        fs.unlink(file, err => {
            if (err) throw err;
            return Promise.resolve();
        });
    }

    // It will first try 128x128 then recursively call itself to 64 then 32 if size
    // is not below 256kb.
    static async resizeImage(file: string, type: string, imgSize: number, msg?: Message | undefined): Promise<string | Buffer> {
        if (type === "gif") {
            // msg is only present on the first call and not recursively.
            if (msg) {
                msg.channel.send("Processing...");
            }
            // This one is broken! Not sure how to fix... // with some effort this "works".
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            await execFile(gifsicle, ["--resize-fit-width", imgSize, "-o", file, file]);

            const fileSize = await Emotes.getFilesizeInBytes(file);
            if (fileSize > Constants.MAGIC_NUMBERS.CMDS.EMOTES.MAX_FILESIZE) {
                return Promise.resolve(this.resizeImage(file, type, imgSize / 2));
            }
            else {
                return Promise.resolve(file);
            }
        }
        else {
            return Promise.resolve(
                await sharp(file)
                    .resize(Constants.MAGIC_NUMBERS.CMDS.EMOTES.MAX_WIDTH_HEIGHT, Constants.MAGIC_NUMBERS.CMDS.EMOTES.MAX_WIDTH_HEIGHT)
                    .toBuffer(),
            );
        }
    }

    static getFilesizeInBytes(filename: fs.PathLike): Promise<number> {
        const stats = fs.statSync(filename);
        const fileSizeInBytes = stats.size;
        return Promise.resolve(fileSizeInBytes);
    }

    static async saveEmoji(message: Message, file: string | Buffer, name: string): Promise<Message | void> {
        return message.guild?.emojis
            .create({ attachment: file, name })
            .then((emoji: GuildEmoji) => {
                message.channel.send(`Successfully uploaded **${name}** ${emoji}.`);
                return Promise.resolve();
            })
            .catch((e: GuildEmoji) => {
                message.channel.send(`Unable to create emoji: ${e}`);
                return Promise.resolve();
            });
    }

    // Takes a message and returns the output location for saved files
    static getFileOut(name: string): string {
        // Need to check for file extensions
        return `./images${name}`;
    }

    // Takes a URL and a directory+filename and saves to that directory with that
    // file name.
    static async saveFile(url: string, saveAs: fs.PathLike): Promise<void> {
        if (fs.existsSync(saveAs)) {
            return;
        }
        else {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            await execFile("curl", [url, "-o", saveAs]);
            return Promise.resolve();
        }
    }

    static async countEmotes(message: Message): Promise<void> {
        if (message.guild) {
            const { guild } = message,
                emotes = message.content.match(/<?(a)?:.+?:\d+>/g);
            if (emotes) {
                const ids = emotes.toString().match(/\d+/g);
                if (ids) {
                    const request = ids.map(item => {
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
                    }).filter(<T>(n?: T): n is T => Boolean(n));
                    await message.client.orm.$transaction(request);
                }
            }
        }
    }
}
