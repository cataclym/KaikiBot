import { ApplyOptions } from "@sapphire/decorators";
import { Events, Listener, ListenerOptions } from "@sapphire/framework";
import { GuildMember } from "discord.js";
import GreetHandler from "../lib/GreetHandler";
import { handleStickyRoles } from "../lib/Roles";

@ApplyOptions<ListenerOptions>({
    event: Events.GuildMemberAdd,
})
export default class GuildMemberAdd extends Listener {
    public async run(member: GuildMember): Promise<void> {
        const greetHandler = new GreetHandler(member);

        await Promise.all([
            this.container.client.anniversaryService.checkAnniversaryMember(member),
            greetHandler.handleGreetMessage(),
            handleStickyRoles(member),
        ]);
    }
}
