import { Argument } from "discord-akairo";
import { Attachment, Message, PermissionsBitField } from "discord.js";
import sizeOf from "image-size";
import Emotes from "../../lib/Emotes";
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
                    type: Argument.union(Constants.IMAGE_REGEX, Constants.EMOTE_REGEX, (m: Message) => {
                        if (m.attachments.first()) {
                            return m.attachments.first();
                        }
                    }),
                    otherwise: (m: Message) => ({ embeds: [KaikiEmbeds.genericArgumentError(m)] }),
                },
                {
                    id: "name",
                    // I forgot why this was a thing
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

        let emote, urlMatch;

        if (!(url instanceof Attachment)) {
            urlMatch = url.match[0].toString();

            if (urlMatch.startsWith("<") && urlMatch.endsWith(">")) {

                const emoteID = urlMatch.match(/\d+/g);

                if (emoteID) {
                    emote = `https://cdn.discordapp.com/emojis/${emoteID.toString()}.${urlMatch.indexOf("a") === 1 ? "gif" : "png"}`;
                    name = name ?? urlMatch.slice(2, urlMatch.lastIndexOf(":")).replace(":", "");
                }
            }
            else {
                emote = urlMatch;
            }
        }
        else {
            emote = url.url || url.proxyURL;
            name = name || url.name?.slice(0, url.name.lastIndexOf("."));
        }

        if (!emote) return;

        const msNow = Date.now().toString();
        const file = Emotes.getFileOut(msNow);

        name = Utility.trim(name || msNow, Constants.MAGIC_NUMBERS.CMDS.EMOTES.ADD_EMOTE.NAME_MAX_LENGTH).replace(/ /g, "_");
        await Emotes.saveFile(emote, file);

        // Example output: { width: 240, height: 240, type: 'gif' }
        const imgDimensions = sizeOf(file),
            fileSize = await Emotes.getFilesizeInBytes(file);

        // Had to add filesizeCheck
        if ((imgDimensions.width && imgDimensions.height)
            && imgDimensions.width <= Constants.MAGIC_NUMBERS.CMDS.EMOTES.MAX_WIDTH_HEIGHT
            && imgDimensions.height <= Constants.MAGIC_NUMBERS.CMDS.EMOTES.MAX_WIDTH_HEIGHT
            && fileSize <= Constants.MAGIC_NUMBERS.CMDS.EMOTES.MAX_FILESIZE) {

            await Emotes.saveEmoji(message, emote, name);
        }

        else if (imgDimensions.type) {
            const img = await Emotes.resizeImage(file, imgDimensions.type, 128, message);
            await Emotes.saveEmoji(message, img, name);
        }
        await Emotes.deleteImage(file);
    }
}
