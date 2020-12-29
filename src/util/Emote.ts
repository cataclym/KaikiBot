import sharp from "sharp";
import fs from "fs";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import gifsicle from "gifsicle";
import { GuildEmoji } from "discord.js";
import util from "util";
import { Message } from "discord.js";
import cp = require("child_process")
const execFile = util.promisify(cp.execFile);

export async function deleteImage(file: fs.PathLike): Promise<void> {
	fs.unlink(file, err => {
		if (err) throw err;
		return Promise.resolve();
	});
}

// It will first try 128x128 then recursively call itself to 64 then 32 if size
// is not below 256kb.
export async function resizeImage(file: string, type: string, imgSize: number, msg?: Message | undefined): Promise<string | Buffer> {
	if (type == "gif") {
		// msg is only present on the first call and not recursively.
		if (msg) {
			msg.channel.send("Processing...");
		}
		// This one is broken! Not sure how to fix... // with some effort this "works".
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		await execFile(gifsicle, ["--resize-fit-width", imgSize, "-o", file, file]);

		const fileSize = await getFilesizeInBytes(file);
		if (fileSize > 256000) {
			return Promise.resolve(resizeImage(file, type, imgSize / 2));
		}
		else {
			return Promise.resolve(file);
		}
	}
	else {
		return Promise.resolve(
			await sharp(file)
				.resize(128, 128)
				.toBuffer(),
		);
	}
}

export function getFilesizeInBytes(filename: fs.PathLike): Promise<number> {
	const stats = fs.statSync(filename);
	const fileSizeInBytes = stats.size;
	return Promise.resolve(fileSizeInBytes);
}

export async function saveEmoji(message: Message, file: string | Buffer, name: string): Promise<Message | void> {
	return message.guild?.emojis
		.create(file, name)
		.then((emoji: GuildEmoji) => {
			message.channel.send(`Successfully uploaded **${name}** ${emoji}.`);
			return Promise.resolve();
		})
		.catch((e: GuildEmoji) => {
			message.channel.send(`Unable to create emoji for reason: ${e}`);
			return Promise.resolve();
		});
}

// Takes a message and returns the output location for saved files
export function getFileOut(name: string): string {
	// Need to check for file extensions
	return `./images${name}`;
}

// Takes a URL and a directory+filename and saves to that directory with that
// file name.
export async function saveFile(url: string, saveAs: fs.PathLike): Promise<void> {
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