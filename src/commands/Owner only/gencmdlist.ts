import { ApplyOptions } from "@sapphire/decorators";
import { PreconditionEntryResolvable } from "@sapphire/framework";
import { AttachmentBuilder, Message, PermissionsBitField } from "discord.js";
import { KaikiCommandOptions } from "../../lib/Interfaces/KaikiCommandOptions";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";

@ApplyOptions<KaikiCommandOptions>({
    name: "gencmdlist",
    aliases: ["gencmdlst"],
    description: "Uploads a JSON file containing all commands.",
    preconditions: ["OwnerOnly"],
})
export default class GenCmdListCommand extends KaikiCommand {
    public async messageRun(message: Message): Promise<Message> {

        const commands = Array.from(this.store.values());

        const { categories } = this.store;

        return message.channel.send({
            files: [
                new AttachmentBuilder(Buffer.from(JSON
                    .stringify(categories
                        .map((category) => {
                            // Akairo: Category ID, Command[]
                            return [
                                category, commands
                                    .filter(command => command.category === category)
                                    .filter(command => command.aliases.length)
                                    .map((command: KaikiCommand) => new GeneratedCommand(command)),
                            ];
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
    channel?: string | undefined | PreconditionEntryResolvable;
    ownerOnly?: boolean;
    usage?: string | string[] | undefined;
    userPermissions?: string;
    description?: string;

    constructor(command: KaikiCommand) {
        this.id = command.name;
        this.aliases = Array.from(command.aliases);
        this.channel = command.options.preconditions?.includes("GuildOnly")
            ? command.options.preconditions[command.options.preconditions.indexOf("GuildOnly")]
            : undefined;
        this.ownerOnly = !!command.options.preconditions?.includes("OwnerOnly");
        this.usage = command.usage;
        this.userPermissions = new PermissionsBitField(command.options.requiredUserPermissions).toArray().join();
        this.description = command.description;
    }
}
