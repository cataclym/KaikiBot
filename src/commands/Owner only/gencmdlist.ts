import { AttachmentBuilder, Message, PermissionResolvable, PermissionsBitField } from "discord.js";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";


export default class GenCmdListCommand extends KaikiCommand {
    constructor() {
        super("gencmdlist", {
            aliases: ["gencmdlist", "gencmdlst"],
            description: "Uploads a JSON file containing all commands.",
            usage: "",
            ownerOnly: true,
        });
    }

    public async exec(message: Message): Promise<Message> {

        const list = Array.from(this.handler.categories.entries());

        return message.channel.send({
            files: [
                new AttachmentBuilder(Buffer.from(JSON.stringify(list.map((value) => {
                    return [value[0], value[1].map((v: KaikiCommand) => new GeneratedCommand(v))];
                }), (key, value) =>
                    typeof value === "bigint"
                        ? value.toString()
                        : value,
                4,
                ), "utf-8"), { name: "cmdlist.json" }),
            ],
        });
    }
}

class GeneratedCommand {
    id: string;
    aliases: string[];
    channel?: string | undefined;
    ownerOnly?: boolean;
    usage?: string | string[] | undefined;
    userPermissions?: string;
    description?: string;

    constructor(command: KaikiCommand) {
        this.id = command.id;
        this.aliases = command.aliases;
        this.channel = command.channel || undefined;
        this.ownerOnly = command.ownerOnly;
        this.usage = command.usage;
        this.userPermissions = new PermissionsBitField(command.userPermissions as PermissionResolvable).toArray().join();
        this.description = command.description;
    }
}
