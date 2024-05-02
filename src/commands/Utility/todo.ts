import { ApplyOptions } from "@sapphire/decorators";
import { ApplicationCommandRegistry, Args, Command } from "@sapphire/framework";
import { Awaitable, Message } from "discord.js";
import { KaikiCommandOptions } from "../../lib/Interfaces/Kaiki/KaikiCommandOptions";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";
import MessageBasedTodo from "../../lib/Todo/MessageBasedTodo";
import InteractionBasedTodo from "../../lib/Todo/InteractionBasedTodo";

@ApplyOptions<KaikiCommandOptions>({
    name: "todo",
    aliases: ["note"],
    usage: ["", "2"],
    description:
        "A personal todo list. The items are limited to 204 characters. Intended for small notes.",
})
export default class TodoCommand extends KaikiCommand {
    public async messageRun(message: Message<true>, args: Args) {
        let page = await args.pick("number").catch(() => 1);
        page = (page <= 1 ? 0 : page - 1) || 0;

        new MessageBasedTodo(
            page,
            message.member || message.author,
            message.channel
        );
    }

    public async chatInputRun(
        interaction: Command.ChatInputCommandInteraction
    ) {
        let page = interaction.options.getInteger("page", false);
        page = page ? (page <= 1 ? 0 : page - 1) : 0;

        await interaction.deferReply();

        new InteractionBasedTodo(
            page,
            interaction.member && "id" in interaction.member
                ? interaction.member
                : interaction.user,
            interaction.channel!
        );
    }

    public registerApplicationCommands(
        registry: ApplicationCommandRegistry
    ): Awaitable<void> {
        registry.registerChatInputCommand((builder) =>
            builder
                .setName("todo")
                .setDescription("View and manage your todo-list")
                .addIntegerOption((option) =>
                    option
                        .setName("page")
                        .setDescription("Which page to open of your todo-list")
                        .setRequired(false)
                )
        );
    }
}
