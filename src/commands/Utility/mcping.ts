import { Message, MessageAttachment, EmbedBuilder } from "discord.js";
import fetch from "node-fetch";
import { ServerOffline, ServerOnline } from "../../lib/Interfaces/IMinecraftServerPing";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";

import KaikiEmbeds from "../../lib/KaikiEmbeds";
import Utility from "../../lib/Utility";

export default class mcpingCommand extends KaikiCommand {
    constructor() {
        super("mcping", {
            aliases: ["mcping"],
            description: "",
            usage: "",
            args: [{
                id: "term",
                match: "rest",
                otherwise: (msg: Message) => ({ embeds: [KaikiEmbeds.genericArgumentError(msg)] }),
            }],
            typing: true,
            subCategory: "Info",
        });
    }

    public async exec(message: Message, { term }: { term: string }): Promise<Message> {

        const result: ServerOffline | ServerOnline = await fetch(`https://api.mcsrvstat.us/2/${term}`)
            .then(response => response.json() as Promise<ServerOffline | ServerOnline>);

        if (result.online) {

            const attachment = result?.icon?.length ? new MessageAttachment(Buffer.from(result.icon.slice(result.icon.indexOf(",")), "base64"), "icon.png") : undefined;

            const embed = new EmbedBuilder()
                .setTitle("Ping! Server is online")
                .setDescription(`${result.ip}:${result.port} ${result?.hostname?.length ? "/ " + result?.hostname : ""}`)
                .addFields([
                    { name: "Version", value: String(result.version), inline: true },
                    { name: "MOTD", value: result.motd.clean.join("\n"), inline: true },
                    { name: "Players", value: `${result.players.online}/${result.players.max}`, inline: true },
                    {
                        name: "Plugins",
                        value: result.plugins?.names.length ? Utility.trim(result.plugins?.names.join(", "), 1024) : "None",
                        inline: true,
                    },
                    { name: "Software", value: result?.software ?? "Unknown", inline: true },
                    {
                        name: "Mods",
                        value: result.mods?.names.length ? Utility.trim(result.mods?.names.join(", "), 1024) : "None",
                        inline: true,
                    },
                ])
                .withOkColor(message);

            if (attachment) {
                embed.setImage("attachment://icon.png");
                return message.channel.send({
                    files: [attachment],
                    embeds: [embed],
                });
            }

            else {
                return message.channel.send({ embeds: [embed] });
            }
        }

        else {
            return message.channel.send({
                embeds: [new EmbedBuilder()
                    .setTitle("No ping :< Server is offline or address is incorrect.")
                    .withErrorColor(message)],
            });
        }
    }
}
