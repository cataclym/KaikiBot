import { GuildMember } from "discord.js";
import { handleStickyRoles } from "../lib/roles";
import GreetHandler from "../lib/GreetHandler";
import KaikiListener from "Kaiki/KaikiListener";

export default class GuildMemberAddListener extends KaikiListener {
    constructor() {
        super("guildMemberAdd", {
            event: "guildMemberAdd",
            emitter: "client",
        });
    }
    public async exec(member: GuildMember): Promise<void> {
        await this.client.anniversaryService.checkAnniversaryMember(member);
        await GreetHandler.handleGreetMessage(member);
        await handleStickyRoles(member);
    }
}

