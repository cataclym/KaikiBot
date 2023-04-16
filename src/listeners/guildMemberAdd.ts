import { ApplyOptions } from "@sapphire/decorators";
import { ListenerOptions } from "@sapphire/framework";
import { GuildMember } from "discord.js";
import GreetHandler from "../lib/GreetHandler";
import KaikiListener from "../lib/Kaiki/KaikiListener";
import { handleStickyRoles } from "../lib/Roles";

@ApplyOptions<ListenerOptions>({
    event: "guildMemberAdd",
})
export default class GuildMemberAdd extends KaikiListener {
    public async run(member: GuildMember): Promise<void> {
        await this.client.anniversaryService.checkAnniversaryMember(member);
        await GreetHandler.handleGreetMessage(member);
        await handleStickyRoles(member);
    }
}
