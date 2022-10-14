import { PrefixSupplier } from "discord-akairo";
import { Guild, Message, EmbedBuilder } from "discord.js";

export default class KaikiEmbeds {

    static roleArgumentError = (message: Message): EmbedBuilder => new EmbedBuilder({
        description: "Can't find a matching role. Try again.",
    })
        .withErrorColor(message);

    static genericArgumentError = (message: Message): EmbedBuilder => {
        const cmd = message.util?.parsed?.command;
        const prefix = (cmd?.handler.prefix as PrefixSupplier)(message);

        let usage;

        if (cmd && typeof cmd.description !== "string") {
            usage = Array.isArray(cmd.description.usage)
                ? cmd.description.usage.map((u: string) => `${prefix}${cmd?.id} ${u}`).join("\n")
                : `${prefix}${cmd.id}`;
        }

        return new EmbedBuilder({
            description: "Please provide (valid) arguments.",
            fields: [{ name: "Usage", value: (usage ? String(usage) : "<any>") }],
        })
            .withErrorColor(message);
    };

    static errorMessage = async (message: Message | Guild, msg: string): Promise<EmbedBuilder> => new EmbedBuilder({
        title: "Error",
        description: msg,
    })
        .withErrorColor(message);

    static addedRoleEmbed = (roleName: string): EmbedBuilder => new EmbedBuilder({
        title: "Excluded",
        description: `Added role \`${roleName}\`.\nType the command again to remove.`,
    });

    static removedRoleEmbed = (roleName: string): EmbedBuilder => new EmbedBuilder({
        title: "Included",
        description: `Removed role \`${roleName}\`.\nType the command again to add it back.`,
    });

    static noDataReceived = async (m: Message): Promise<EmbedBuilder> => new EmbedBuilder({
        title: "Error",
        description: "No data received. Double check the subreddit's name and try again.",
    })
        .withErrorColor(m);

    static embedFail = async (message: Message, text = "You do not have a role!") => {
        return new EmbedBuilder()
            .setDescription(text)
            .withErrorColor(message);
    };
}
