import { ApplyOptions } from "@sapphire/decorators";
import { Args } from "@sapphire/framework";
import { Message } from "discord.js";
import Emotes from "../../lib/Emotes";
import { KaikiCommandOptions } from "../../lib/Interfaces/Kaiki/KaikiCommandOptions";
import KaikiArgumentsTypes from "../../lib/Kaiki/KaikiArgumentsTypes";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";
import Utility from "../../lib/Utility";
import Constants from "../../struct/Constants";

@ApplyOptions<KaikiCommandOptions>({
    name: "addemote",
    aliases: ["ae"],
    description: "Adds an emote from an image link or attached image, with an optional name.",
    usage: "image-link Emotename",
    requiredUserPermissions: ["ManageEmojisAndStickers"],
    requiredClientPermissions: ["ManageEmojisAndStickers"],
    preconditions: ["GuildOnly"],
    typing: true,
})
export default class AddEmoteCommand extends KaikiCommand {

    // args: [
    //     {
    //         id: "url",
    //         type: Argument.union(Constants.imageRegex, Constants.emoteRegex, (m: Message) => {
    //             const first = m.attachments.first();
    //             if (first && first.contentType && first.contentType.slice(0, first.contentType.indexOf("/")) === "image") {
    //                 return first;
    //             }
    //         }),
    //         otherwise: (m: Message) => ({ embeds: [KaikiEmbeds.genericArgumentError(m)] }),
    //     },
    //     {
    //         id: "name",
    //         type: Argument.union((m: Message, phrase) => {
    //             if (!!m.attachments.first() && phrase) {
    //                 return phrase;
    //             }
    //         }, "string"),
    //         match: "rest",
    //     },
    // ];

    public async messageRun(message: Message, args: Args) {

        // Create custom type for url
        // that returns an actual URL
        const url = await args.pick(KaikiArgumentsTypes.urlEmoteAttachmentIArgument);

        let name = message.attachments.first()?.name || await args.rest("string");

        if (!url || !name) return;

        const msNow = Date.now().toString();
        const filePath = Emotes.filePath(msNow);

        name = Utility.trim(name, Constants.MAGIC_NUMBERS.CMDS.EMOTES.ADD_EMOTE.NAME_MAX_LENGTH)
            .replace(/ /g, "_");

        await Emotes.fetchEmote(url, filePath);

        const fileSize = await Emotes.getFilesizeInBytes(filePath);

        // Adds emoteUrl if size is ok
        if (fileSize <= Constants.MAGIC_NUMBERS.CMDS.EMOTES.MAX_FILESIZE) {
            await Emotes.saveEmoji(message, url, name);
            return await Emotes.deleteImage(filePath);
        }

        else {
            const img = await Emotes.resizeImage(filePath);
            await Emotes.saveEmoji(message, img, name);
            return await Emotes.deleteImage(filePath);
        }
    }
}
