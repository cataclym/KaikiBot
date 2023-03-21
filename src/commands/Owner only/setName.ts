import { ApplyOptions } from "@sapphire/decorators";
import { Args } from "@sapphire/framework";
import { Message } from "discord.js";
import { KaikiCommandOptions } from "../../lib/Interfaces/KaikiCommandOptions";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";

@ApplyOptions<KaikiCommandOptions>({
    name: "setname",
    description: "Assigns the bot a new name/username.",
    usage: ["Medusa"],
    preconditions: ["OwnerOnly"],
})
export default class SetNameCommand extends KaikiCommand {
    public async messageRun(message: Message, args: Args): Promise<Message> {

        const name = await args.rest("string");

        const fullName = name.substring(0, 32);

        await this.client.user?.setUsername(fullName);

        return message.channel.send(`Name set to \`${fullName}\``);
    }
}
