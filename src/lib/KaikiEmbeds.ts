import { Command, PrefixSupplier } from "discord-akairo";
import { Guild, Message, MessageEmbed } from "discord.js";

export default class KaikiEmbeds {

    static tinderSlogan = ["Match?", "Chat?", "Date?", "Flirt?", "Text?", "Tease?", "Chat up?", "Take a risk?"];

    // Some cringe anime wedding pictures

    static weddingImageArray = ["https://media.discordapp.net/attachments/717045059215687691/754790776893997134/L4jgWKm.jpg", "https://media.discordapp.net/attachments/717045059215687691/754790949216845824/714738.jpg", "https://media.discordapp.net/attachments/717045059215687691/754791292646457474/408146.jpg",
        "https://media.discordapp.net/attachments/717045059215687691/754791432610644008/Anime-Wedding-runochan97-33554809-1280-720.jpg", "https://media.discordapp.net/attachments/717045059215687691/754791553075249252/Anime-Wedding-runochan97-33554796-800-600.jpg",
        "https://media.discordapp.net/attachments/717045059215687691/754791700492320798/4525190-short-hair-long-hair-brunette-anime-anime-girls-love-live-love-live-sunshine-wedding-dress-b.jpg"];

    static TinderHelp = (msg: Message, cmd: Command): MessageEmbed => {
        const prefix = (cmd.handler.prefix as PrefixSupplier)(msg);
        return new MessageEmbed()
            .setTitle("Tinder help page")
            .addFields(
                {
                    name: "Rolls and likes", value: "Using the main command (`" + prefix + "tinder`), costs a roll!\n" +
                  "If you decide to react with a 💚, you spend 1 like.\n" +
                  "If you react with a 🌟, you spend all your rolls and likes.", inline: true,
                },
                {
                    name: "How to marry",
                    value: "You can only marry someone you are datingIDs.\nMarrying is simple, type\n`" + prefix + "tinder marry @someone`\nThey will have to react with a ❤️, to complete the process!",
                    inline: true,
                },
                {
                    name: "Check status",
                    value: "You can check who you have liked, disliked and who you are currently datingIDs as well as who you have married.\n`" + prefix + "tinder list` / `" + prefix + "tinder list dislikes`",
                    inline: true,
                },
                {
                    name: "Dislikes",
                    value: "You have unlimited dislikes. You can never draw someone you have disliked.",
                    inline: false,
                },
                {
                    name: "Manage your list",
                    value: "You can remove dislikes/likes/dates and even divorce with\n`" + prefix + "tinder remove dislikes (user_list_nr)`. Obtain their number through the list.",
                    inline: false,
                },
            )
            .setColor("#31e387");
    };

    static roleArgumentError = (message: Message): MessageEmbed => new MessageEmbed({
        description: "Can't find a matching role. Try again.",
    })
        .withErrorColor(message);

    static genericArgumentError = (message: Message): MessageEmbed => {
        const cmd = message.util?.parsed?.command;
        const prefix = (cmd?.handler.prefix as PrefixSupplier)(message);

        let usage;

        if (cmd && typeof cmd.description !== "string") {
            if (Array.isArray(cmd.description.usage)) {
                usage = cmd.description.usage.map((u: string) => `${prefix}${cmd?.id} ${u}`).join("\n");
            }
            else {
                usage = `${prefix}${cmd.id}`;
            }
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
