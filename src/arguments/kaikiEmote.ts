import { Args, Argument, EmojiObject } from "@sapphire/framework";
import { Snowflake } from "discord.js";

export class KaikiEmote extends Argument<Emote | string> {
    public async run(parameter: string, context: Argument.Context<Emote | string>) {

        const emoji = await context.args
            .pick("emoji")
            .catch(() => undefined);

        if (isEmojiObject(emoji)) {
            return Args.ok({
                name: emoji.name,
                id: emoji.id,
                url: `https://cdn.discordapp.com/emojis/${emoji.id}.${emoji.animated ? "gif" : "png"}`,
            });
        }

        const url = await context.args
            .pick("url");

        return Args.ok(url.href);
    }
}

function isEmojiObject(emoji: EmojiObject | undefined): emoji is NonNullEmojiObject {
    return emoji?.name != null && emoji?.id != null;
}

export type Emote = {
  name: string,
  id: Snowflake,
  url: string,
}

type NonNullEmojiObject = {
  name: string,
  id: string,
  animated?: boolean
}
