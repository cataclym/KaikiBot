/* eslint-disable no-useless-escape */
import { exec } from "child_process";
import { sendPaginatedMessage } from "discord-js-button-pagination-ts";
import { EmbedBuilder, Message } from "discord.js";
import logger from "loglevel";
import * as process from "process";
import { distros } from "../../lib/distros.json";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";

import Utility from "../../lib/Utility";
import Constants from "../../struct/Constants";

export default class NeofetchCommand extends KaikiCommand {
    constructor() {
        super("neofetch", {
            aliases: ["neofetch", "neo"],
            description: "Displays neofetch ascii art. Provide argument 'list' to get a list of all supported distros.",
            usage: ["", "opensuse", "list"],
            cooldown: 2000,
            typing: true,
            args: [
                {
                    id: "os",
                    type: distros,
                    default: null,
                },
                {
                    id: "list",
                    flag: ["list"],
                    match: "flag",
                },
            ],
        });
    }

    static colors = [
        "30",
        "31",
        "32",
        "33",
        "34",
        "35",
        "36",
        "37",
    ];

    public async exec(message: Message, { os, list }: { os: string | null, list: boolean }): Promise<Message | void> {

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
            let cmd = `neofetch -L --ascii_distro ${os}|sed 's/\x1B\[[0-9;\?]*[a-zA-Z]//g'`;

            const { platform } = process;

            if (!os && platform !== "win32") cmd = "neofetch -L | sed 's/\x1B\[[0-9;\?]*[a-zA-Z]//g'";

            exec(cmd, async (error, stdout, stderr) => {
                if (error || stderr) {
                    return logger.error(error);
                }
                return message.channel.send(await Utility.codeblock(stdout.replace(/```/g, "\u0300`\u0300`\u0300`\u0300")));
            });
        }
    }
}
