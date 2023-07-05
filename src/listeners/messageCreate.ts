import { ApplyOptions } from "@sapphire/decorators";
import { Listener, ListenerOptions } from "@sapphire/framework";
import { EmbedBuilder, Message } from "discord.js";
import KaikiCache from "../cache/KaikiCache";
import { DadBot } from "../lib/DadBot";
import Emotes from "../lib/Emotes/Emotes";
import Utility from "../lib/Utility";

@ApplyOptions<ListenerOptions>({
    event: "MessageCreate",
})
export default class MessageCreate extends Listener {
    public async run(message: Message) {

        if (message.inGuild()) {

            let promise;

            if (!message.client.cache.emoteReactCache.has(message.guildId)) {
                promise = KaikiCache.populateERCache(message);
            }

            await Promise.all([
                promise,
                DadBot.run(message),
                Emotes.countEmotes(message),
                message.client.cache.emoteReact(message),
            ]);
        }

        else {
            return this.sendDM(message);
        }
    }

    private async sendDM(message: Message): Promise<Message | undefined> {

        if (message.author === message.client.owner) return;

        let attachmentLinks = "";
        message.client.logger.info(`Message | DM from ${message.author.tag} [${message.author.id}]`);

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
