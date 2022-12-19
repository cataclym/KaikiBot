import { EmbedBuilder, Message, MessageReaction } from "discord.js";
import logger from "loglevel";
import KaikiListener from "../lib/Kaiki/KaikiListener";
import Utility from "../lib/Utility";
import Constants from "../struct/Constants";

// const regex = /^[a-z0-9]+$/i;

export default class MessageInvalidListener extends KaikiListener {
    constructor() {
        super("messageInvalid", {
            event: "messageInvalid",
            emitter: "commandHandler",
        });
    }

    public async exec(message: Message): Promise<void | Message<boolean>> {

        if (message.inGuild()) {
            await this.client.cache.emoteReact(message);
            await this.tiredKaikiCryReact(message);
            return;
        }
        return this.sendDM(message);
    }

    private async tiredKaikiCryReact(message: Message<true>): Promise<void | Message<boolean> | MessageReaction> {

        const botName = message.client.user.username.toLowerCase().split(" ");

        if (new RegExp(botName.join("|")).test(message.content.toLowerCase())
            && new RegExp(Constants.BadWords.join("|")).test(message.content.toLowerCase())) {

            // Absolute randomness
            if (Math.floor(Math.random() * 10) < 7) {
                return message.react("😢");
            }

            return message.channel.send("😢");
        }
    }

    private async sendDM(message: Message): Promise<Message | undefined> {

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
}
