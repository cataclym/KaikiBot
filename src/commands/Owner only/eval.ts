import { Message } from "discord.js";
import { KaikiCommand } from "kaiki";
import Utility from "../../lib/Util";

const clean = (text: string) => {
    return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
};

export default class EvalCommand extends KaikiCommand {
    constructor() {
        super("eval", {
            aliases: ["eval"],
            ownerOnly: true,
            args: [
                {
                    id: "code",
                    type: "string",
                    match: "rest",
                },
            ],
        });
    }
    public async exec(message: Message, { code }: { code: string }): Promise<Message | Message[]> {
        try {
            let evaled = await eval("(async () => " + code + ")()");

            evaled = (await import("util")).inspect(evaled);
            return message.channel.send({
                content: await Utility.codeblock(clean(evaled.toString()), "xl"),
            });
        }
        catch (err) {
            return message.channel.send(`\`ERROR\` ${await Utility.codeblock(clean(err.toString()), "xl")}`);
        }
    }
}
