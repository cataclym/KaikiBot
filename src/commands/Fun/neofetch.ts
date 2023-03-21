import { exec } from "child_process";
import * as process from "process";
import { ApplyOptions } from "@sapphire/decorators";
import { Args } from "@sapphire/framework";
import { sendPaginatedMessage } from "discord-js-button-pagination-ts";
import { EmbedBuilder, Message } from "discord.js";
import logger from "loglevel";
import { distros } from "../../lib/distros.json";
import { KaikiCommandOptions } from "../../lib/Interfaces/KaikiCommandOptions";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";
import Utility from "../../lib/Utility";
import Constants from "../../struct/Constants";

@ApplyOptions<KaikiCommandOptions>({
    name: "neofetch",
    aliases: ["neo"],
    description: "Displays neofetch ascii art. Provide argument 'list' to get a list of all supported distros.",
    usage: ["", "opensuse", "list"],
    cooldownDelay: 2000,
    typing: true,
    flags: ["list"],
})
export default class NeofetchCommand extends KaikiCommand {

    private static neofetchArgument = Args.make<string>((parameter) => {

        const success = distros.find(str => {

            const k = str.toLowerCase();

            return parameter
                .toLowerCase()
                .startsWith(k.slice(0, Math.max(parameter.length - 1, 1)));
        });

        if (!success) {
            return Args.ok("");
        }

        return Args.ok(success);

    });

    public async messageRun(message: Message, args: Args) {

        const list = args.getFlags("list");

        const os = await args.rest(NeofetchCommand.neofetchArgument);

        if (list) {
            const pages: EmbedBuilder[] = [];
            for (let i = Constants.MAGIC_NUMBERS.CMDS.FUN.NEOFETCH.DISTROS_PR_PAGE, p = 0; p < distros.length; i = i + Constants.MAGIC_NUMBERS.CMDS.FUN.NEOFETCH.DISTROS_PR_PAGE, p = p + Constants.MAGIC_NUMBERS.CMDS.FUN.NEOFETCH.DISTROS_PR_PAGE) {
                pages.push(new EmbedBuilder()
                    .setTitle("ascii_distro list")
                    .setThumbnail(message.author.displayAvatarURL())
                    .setDescription(await Utility.codeblock(distros.slice(p, i).join(", "), "json"))
                    .withOkColor(message));
            }
            return sendPaginatedMessage(message, pages, {});
        }

        else {
            let cmd = `neofetch -L --ascii_distro ${os}|sed 's/\x1B\\[[0-9;?]*[a-zA-Z]//g'`;

            const { platform } = process;

            if (!os && platform !== "win32") cmd = "neofetch -L | sed 's/\x1B\\[[0-9;\\?]*[a-zA-Z]//g'";

            exec(cmd, async (error, stdout, stderr) => {
                if (error || stderr) {
                    return logger.error(error);
                }
                return message.channel.send(await Utility.codeblock("\u00AD" + stdout.replace(/```/g, "\u0300`\u0300`\u0300`\u0300")));
            });
        }
    }
}
