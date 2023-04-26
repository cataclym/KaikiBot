import { ApplyOptions } from "@sapphire/decorators";
import { Message } from "discord.js";
import { KaikiCommandOptions } from "../../lib/Interfaces/Kaiki/KaikiCommandOptions";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";

@ApplyOptions<KaikiCommandOptions>({
    preconditions: ["GuildOnly"],
})
export default class DadBot extends KaikiCommand {

    public static nickname = new Map<string, string>();

    public async messageRun(message: Message<true>) {

        const nick = DadBot.nickname.get(message.author.id);

        if (!nick || !message.member) return;


        return DadBot.nickname.delete(message.author.id);
    }
}
