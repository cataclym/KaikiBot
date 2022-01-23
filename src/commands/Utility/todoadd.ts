import { Message, MessageReaction } from "discord.js";
import { getUserDocument } from "../../struct/documentMethods";
import { KaikiCommand } from "kaiki";
import KaikiEmbeds from "../../lib/KaikiEmbeds";


export default class todoAddCommand extends KaikiCommand {
    constructor() {
        super("add", {
            args: [
                {
                    id: "toAdd",
                    type: "string",
                    match: "rest",
                    otherwise: (msg: Message) => ({ embeds: [KaikiEmbeds.genericArgumentError(msg)] }),
                },
            ],
        });
    }

    public async exec(message: Message, { toAdd }: { toAdd: string}): Promise<MessageReaction> {
        await getUserDocument(message.author.id).then(db => {
            db.todo.push(toAdd);
            db.markModified("todo");
            db.save();
        });
        return message.react("✅");
    }
}
