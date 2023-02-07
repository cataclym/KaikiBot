import { Argument } from "discord-akairo";
import { Attachment, Message, PermissionsBitField } from "discord.js";
import Emotes from "../../lib/Emotes";
import ArgumentError from "../../lib/Errors/ArgumentError";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";

import KaikiEmbeds from "../../lib/KaikiEmbeds";
import Utility from "../../lib/Utility";
import Constants from "../../struct/Constants";

export default class AddEmoteCommand extends KaikiCommand {
    constructor() {
        super("addemote", {
            aliases: ["addemote", "ae"],
            description: "Adds an emote from an image link or attached image, with an optional name.",
            usage: "image-link Emotename",
            clientPermissions: PermissionsBitField.Flags.ManageEmojisAndStickers,
            userPermissions: PermissionsBitField.Flags.ManageEmojisAndStickers,
            typing: true,
            channel: "guild",
            args: [
                {
                    id: "url",
                    type: Argument.union(Constants.imageRegex, Constants.emoteRegex, (m: Message) => {
                        const first = m.attachments.first();
                        if (first && first.contentType && first.contentType.slice(0, first.contentType.indexOf("/")) === "image") {
                            return first;
                        }
                    }),
                    otherwise: (m: Message) => ({ embeds: [KaikiEmbeds.genericArgumentError(m)] }),
                },
                {
                    id: "name",
                    type: Argument.union((m: Message, phrase) => {
                        if (!!m.attachments.first() && phrase) {
                            return phrase;
                        }
                    }, "string"),
                    match: "rest",
                },
            ],
        });
    }

    public async exec(message: Message, {
        url,
        name,
    }: { url: { match: RegExpMatchArray, matches: [][] } | Attachment, name: string | null | undefined }): Promise<Message | void> {

        let emoteUrl, urlMatch, type;

        // Attached image
        if (url instanceof Attachment) {
            emoteUrl = url.url || url.proxyURL;
            name = name || url.name?.slice(0, url.name.lastIndexOf("."));

            type = url.contentType
                ? url.contentType.slice(url.contentType.indexOf("/") + 1)
                : "png";
        }

        else {
            urlMatch = url.match[0].toString();

            if (urlMatch.startsWith("<") && urlMatch.endsWith(">")) {

                const emoteID = urlMatch.match(/\d+/g);

                type = urlMatch.indexOf("a") === 1 ? "gif" : "png";

                if (!emoteID) return;

                // Construct emote url - If it has '<a:...'  at the beginning, then it's a gif format.
                emoteUrl = `https://cdn.discordapp.com/emojis/${emoteID.toString()}.${type}`;

                // Get emote name from emote construction <:name:snowflake>
                name = name ?? urlMatch.slice(2, urlMatch.lastIndexOf(":")).replace(":", "");
            }
            else {

                if (!name) throw new ArgumentError("Missing name argument.");

                emoteUrl = urlMatch;
                type = urlMatch.slice(urlMatch.lastIndexOf(".") + 1);
            }
        }

        if (!emoteUrl || !name) return;

        const msNow = Date.now().toString();
        const filePath = Emotes.filePath(msNow);

        name = Utility.trim(name, Constants.MAGIC_NUMBERS.CMDS.EMOTES.ADD_EMOTE.NAME_MAX_LENGTH)
            .replace(/ /g, "_");

        await Emotes.fetchEmote(emoteUrl, filePath);

        const fileSize = await Emotes.getFilesizeInBytes(filePath);

        // Adds emoteUrl if size is ok
        if (fileSize <= Constants.MAGIC_NUMBERS.CMDS.EMOTES.MAX_FILESIZE) {
            await Emotes.saveEmoji(message, emoteUrl, name);
            return await Emotes.deleteImage(filePath);
        }

        else {
            const img = await Emotes.resizeImage(filePath, type, 128, message);
            await Emotes.saveEmoji(message, img, name);
            return await Emotes.deleteImage(filePath);
        }
    }
}
