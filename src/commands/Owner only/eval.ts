import { ApplyOptions } from "@sapphire/decorators";
import { Args } from "@sapphire/framework";
import { Message } from "discord.js";
import { KaikiCommandOptions } from "../../lib/Interfaces/Kaiki/KaikiCommandOptions";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";
import Utility from "../../lib/Utility";
import Constants from "../../struct/Constants";

@ApplyOptions<KaikiCommandOptions>({
    name: "eval",
    description: "",
    preconditions: ["OwnerOnly"],
})
export default class EvalCommand extends KaikiCommand {
    private clean = (text: string) => {
        return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
    };

    public async messageRun(message: Message, args: Args): Promise<Message | Message[]> {

        const code = await args.rest("string");

        try {
            let evaled = await eval("(async () => " + code + ")()");

            evaled = (await import("util")).inspect(evaled);
            return message.channel.send({
                content: await Utility.codeblock(Utility.trim(this.clean(evaled.toString()), Constants.MAGIC_NUMBERS.CMDS.OWNER_ONLY.EVAL.MAX_STRING), "xl"),
            });
        }
        catch (err) {
            return message.channel.send(`\`ERROR\` ${await Utility.codeblock(Utility.trim(this.clean(err.toString()), Constants.MAGIC_NUMBERS.CMDS.OWNER_ONLY.EVAL.MAX_ERROR_STRING), "xl")}`);
        }
    }
}
