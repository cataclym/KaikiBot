/* eslint-disable no-useless-escape */
import { sendPaginatedMessage } from "discord-js-button-pagination-ts";
import { exec } from "child_process";
import { Message, EmbedBuilder } from "discord.js";
import logger from "loglevel";
import { distros } from "../../lib/distros.json";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";

import Utility from "../../lib/Utility";

export default class NeofetchCommand extends KaikiCommand {
    constructor() {
        super("neofetch", {
            aliases: ["neofetch", "neo"],
            description: "Displays neofetch ascii art. Provide argument 'list' to get a list of all supported distros.",
            usage: ["", "opensuse", "list"],
            cooldown: 2000,
            typing: true,
            args: [{
                id: "os",
                type: distros,
                default: null,
            },
            {
                id: "list",
                flag: ["list"],
                match: "flag",
            }],
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
            for (let i = 150, p = 0; p < distros.length; i = i + 150, p = p + 150) {
                pages.push(new EmbedBuilder()
                    .setTitle("ascii_distro list")
                    .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
                    .setDescription(await Utility.codeblock(distros.slice(p, i).join(", "), "json"))
                    .withOkColor(message));
            }
            return sendPaginatedMessage(message, pages, {});
        }

        else {
            // const randomColor = NeofetchCommand.colors[Math.floor(Math.random() * 8)];
            let cmd = `neofetch -L --ascii_distro ${os}|sed 's/\x1B\[[0-9;\?]*[a-zA-Z]//g'`;

            if (!os && process.platform !== "win32") cmd = "neofetch -L | sed 's/\x1B\[[0-9;\?]*[a-zA-Z]//g'";

            exec(cmd, async (error, stdout, stderr) => {
                if (error || stderr) {
                    return logger.error(error);
                }
                return message.channel.send(await Utility.codeblock(stdout.replace(/```/g, "\u0300`\u0300`\u0300`\u0300")));

                // return message.channel.send(
                //     await codeblock(`[0;${randomColor}m` + stdout
                //         .replace(/```/g, "\u0300`\u0300`\u0300`\u0300")
                //         .replace(/\n/g, `[0m\n[0;${randomColor}m`) + "[0m",
                //     "ansi"),
                // );
            });
        }
    }
}
