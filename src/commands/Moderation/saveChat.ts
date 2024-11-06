import { ApplyOptions } from "@sapphire/decorators";
import { Args } from "@sapphire/framework";
import { AttachmentBuilder, Collection, Message } from "discord.js";
import KaikiCommandOptions from "../../lib/Interfaces/Kaiki/KaikiCommandOptions";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";

@ApplyOptions<KaikiCommandOptions>({
    name: "savechat",
    description: "Saves a number of messages, and sends it to you.",
    usage: ["100"],
    requiredUserPermissions: ["ManageMessages"],
    preconditions: ["GuildOnly"],
})
export default class SaveChatCommand extends KaikiCommand {
    public async messageRun(
        message: Message,
        args: Args
    ) {
        const amount = await args.pick("number", { maximum: 100, minimum: 1 });

        const collection = await message.channel.messages.fetch({
            limit: amount,
            before: message.id,
        });

        const attachment = Buffer.from(
            (collection as Collection<string, Message<boolean>>)
                .map((m: Message<true | false>) => {
                    return `${m.createdAt.toTimeString().slice(0, 8)} ${m.createdAt.toDateString()} - ${m.author.username}: ${m.content} ${m.attachments ? m.attachments.map((a) => a.url).join("\n") : ""}`;
                })
                .reverse()
                .join("\n")
        );

        const name = (date = new Date()) => `${date.toLocaleDateString()}-${date.toLocaleTimeString()}.txt`

        return Promise.all([message.member?.send({
            files: [new AttachmentBuilder(attachment, { name: name() })],
        }), message.react("✅")]);
    }
}
