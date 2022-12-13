import { Message } from "discord.js";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";
import Utility from "../../lib/Utility";
import Constants from "../../struct/Constants";

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
                content: await Utility.codeblock(Utility.trim(clean(evaled.toString()), Constants.MAGIC_NUMBERS.CMDS.OWNER_ONLY.EVAL.MAX_STRING), "xl"),
            });
        }
        catch (err) {
            return message.channel.send(`\`ERROR\` ${await Utility.codeblock(Utility.trim(clean(err.toString()), Constants.MAGIC_NUMBERS.CMDS.OWNER_ONLY.EVAL.MAX_ERROR_STRING), "xl")}`);
        }
    }
}
