import { ApplyOptions } from "@sapphire/decorators";
import { PreconditionEntryResolvable } from "@sapphire/framework";
import {
    AttachmentBuilder,
    EmbedBuilder,
    Message,
    PermissionsBitField,
    PermissionsString,
} from "discord.js";
import KaikiCommandOptions from "../../lib/Interfaces/Kaiki/KaikiCommandOptions";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";
import Constants from "../../struct/Constants";
import process from "process";

@ApplyOptions<KaikiCommandOptions>({
    name: "gencmdlist",
    aliases: ["gencmdlst", "gencmds"],
    usage: "",
    description:
		"Uploads a JSON file containing all commands. Supports uploading to a specific endpoint.",
    preconditions: ["OwnerOnly"],
})
export default class GenCmdListCommand extends KaikiCommand {
    public async messageRun(message: Message) {
        if (!process.env.CMDLIST_URL || !process.env.SELF_API_TOKEN) {
            return message.channel.send({
                files: [
                    new AttachmentBuilder(
                        Buffer.from(this.generateCommmandlist(), "utf-8"),
                        { name: "cmdlist.json" }
                    ),
                ],
            });
        }

        const pendingMsg = await message.channel.send({
            embeds: [
                new EmbedBuilder()
                    .setDescription("Uploading commandslist...")
                    .setColor(Constants.kaikiOrange),
            ],
        });

        const list = this.generateCommmandlist();

        const uri = new URL(process.env.CMDLIST_URL);
        uri.searchParams.append("token", process.env.SELF_API_TOKEN);

        const res = await fetch(uri, {
            method: "POST",
            body: JSON.stringify({
                list: list,
            }),
            headers: {
                "content-type": "application/json",
            },
        });

        if (res.status === 201) {
            await pendingMsg.edit({
                embeds: [
                    new EmbedBuilder()
                        .setDescription("Successfully uploaded commands")
                        .withOkColor(message),
                ],
                files: [
                    new AttachmentBuilder(Buffer.from(list, "utf-8"), {
                        name: "cmdlist.json",
                    }),
                ],
            });
        }
    }

    private generateCommmandlist() {
        const commands = Array.from(this.store.values());

        const { categories } = this.store;

        return JSON.stringify(
            categories.map((category) => {
                // Akairo: Category ID, Command[]
                return [
                    category,
                    commands
                        .filter((command) => command.category === category)
                        .map(
                            (command: KaikiCommand) =>
                                new GeneratedCommand(command)
                        ),
                ];
            }),
            (key, value) =>
                typeof value === "bigint" ? value.toString() : value,
            4
        );
    }
}

class GeneratedCommand {
    id: string;
    aliases: string[];
    channel?: string | undefined | PreconditionEntryResolvable;
    ownerOnly?: boolean;
    usage?: string | string[];
    userPermissions?: PermissionsString[];
    description?: string;

    constructor(command: KaikiCommand) {
        this.id = command.name;
        this.aliases = Array.from(command.aliases);
        this.channel = command.options.preconditions?.includes("GuildOnly")
            ? command.options.preconditions[
                command.options.preconditions.indexOf("GuildOnly")
            ]
            : undefined;
        this.ownerOnly = !!command.options.preconditions?.includes("OwnerOnly");
        this.usage = command.usage;
        this.userPermissions = new PermissionsBitField(
            command.options.requiredUserPermissions
        ).toArray();
        this.description = command.description;
    }
}
