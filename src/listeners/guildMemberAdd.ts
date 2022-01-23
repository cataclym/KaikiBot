import { Listener } from "discord-akairo";
import { GuildMember } from "discord.js";
import { checkAnniversaryMember } from "../lib/AnniversaryRoles";
import { handleStickyRoles } from "../lib/roles";
import GreetHandler from "../lib/GreetHandler";

export default class GuildMemberAddListener extends Listener {
    constructor() {
        super("guildMemberAdd", {
            event: "guildMemberAdd",
            emitter: "client",
        });
    }
    public async exec(member: GuildMember): Promise<void> {
        await checkAnniversaryMember(member);
        await GreetHandler.handleGreetMessage(member);
        await handleStickyRoles(member);
    }
}

