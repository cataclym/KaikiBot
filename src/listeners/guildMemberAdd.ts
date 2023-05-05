import { ApplyOptions } from "@sapphire/decorators";
import { Listener, ListenerOptions } from "@sapphire/framework";
import { GuildMember } from "discord.js";
import GreetHandler from "../lib/GreetHandler";
import { handleStickyRoles } from "../lib/Roles";

@ApplyOptions<ListenerOptions>({
    event: "guildMemberAdd",
})
export default class GuildMemberAdd extends Listener {
    public async run(member: GuildMember): Promise<void> {
        await this.container.client.anniversaryService.checkAnniversaryMember(member);
        await GreetHandler.handleGreetMessage(member);
        await handleStickyRoles(member);
    }
}
