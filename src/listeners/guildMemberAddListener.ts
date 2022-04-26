import { GuildMember } from "discord.js";
import GreetHandler from "../lib/GreetHandler";
import KaikiListener from "../lib/Kaiki/KaikiListener";
import { handleStickyRoles } from "../lib/Roles";


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

