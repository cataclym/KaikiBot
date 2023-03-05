import { ApplyOptions } from "@sapphire/decorators";
import { Args } from "@sapphire/framework";
import { AttachmentBuilder, EmbedBuilder, Message } from "discord.js";
import fetch from "node-fetch";
import { KaikiCommandOptions } from "../../lib/Interfaces/KaikiCommandOptions";
import { ServerOffline, ServerOnline } from "../../lib/Interfaces/mcsrvstatAPIData";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";
import Utility from "../../lib/Utility";

@ApplyOptions<KaikiCommandOptions>({
    name: "mcping",
    aliases: ["mcp"],
    description: "Ping a minecraft server address to see if it is online",
    usage: "2b2t.org",
    typing: true,
    subCategory: "Info",
})
export default class MinecraftPingCommand extends KaikiCommand {

    public async exec(message: Message, args: Args): Promise<Message> {

        const term = await args.pick("string");

        const result: ServerOffline | ServerOnline = await fetch(`https://api.mcsrvstat.us/2/${term}`)
            .then(response => response.json() as Promise<ServerOffline | ServerOnline>);

        if (result.online) {

            const attachment = result?.icon?.length
                ? new AttachmentBuilder(Buffer.from(result.icon.slice(result.icon.indexOf(",")), "base64"), { name: "icon.png" })
                : undefined;

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
                embeds: [
                    new EmbedBuilder()
                        .setTitle("No ping :< Server is offline or address is incorrect.")
                        .withErrorColor(message),
                ],
            });
        }
    }
}
