import { PrefixSupplier } from "discord-akairo";
import { Guild, Message, MessageEmbed } from "discord.js";

export default class KaikiEmbeds {

    static roleArgumentError = (message: Message): MessageEmbed => new MessageEmbed({
        description: "Can't find a matching role. Try again.",
    })
        .withErrorColor(message);

    static genericArgumentError = (message: Message): MessageEmbed => {
        const cmd = message.util?.parsed?.command;
        const prefix = (cmd?.handler.prefix as PrefixSupplier)(message);

        let usage;

        if (cmd && typeof cmd.description !== "string") {
            usage = Array.isArray(cmd.description.usage)
                ? cmd.description.usage.map((u: string) => `${prefix}${cmd?.id} ${u}`).join("\n")
                : `${prefix}${cmd.id}`;
        }

        return new MessageEmbed({
            description: "Please provide (valid) arguments.",
            fields: [{ name: "Usage", value: (usage ? String(usage) : "<any>") }],
        })
            .withErrorColor(message);
    };

    static errorMessage = async (message: Message | Guild, msg: string): Promise<MessageEmbed> => new MessageEmbed({
        title: "Error",
        description: msg,
    })
        .withErrorColor(message);

    static addedRoleEmbed = (roleName: string): MessageEmbed => new MessageEmbed({
        title: "Excluded",
        description: `Added role \`${roleName}\`.\nType the command again to remove.`,
    });

    static removedRoleEmbed = (roleName: string): MessageEmbed => new MessageEmbed({
        title: "Included",
        description: `Removed role \`${roleName}\`.\nType the command again to add it back.`,
    });

    static noDataReceived = async (m: Message): Promise<MessageEmbed> => new MessageEmbed({
        title: "Error",
        description: "No data received. Double check the subreddit's name and try again.",
    })
        .withErrorColor(m);

    static embedFail = async (message: Message, text = "You do not have a role!") => {
        return new MessageEmbed()
            .setDescription(text)
            .withErrorColor(message);
    };
}
